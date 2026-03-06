"use client"

import { AdminSidebar,AdminSidebarToggleButton } from "@/components/admin/sidebar"
import { useEffect, useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import useOnlineStatus from "@/hooks/Network-Status"
import {
    BarChart3,
    Users,
    CalendarDays,
    FileText,
    Globe,
    Monitor,
    Share2,
    TrendingUp,
    TrendingDown,
    Minus,
    Activity,
    Clock,
    Target,
    Zap,
    ArrowRight,
    Radio,
    Loader2
} from "lucide-react"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from "recharts"

/* ---------------- UTILS ---------------- */

function flatten(obj: any, prefix = ""): Record<string, number> {
    let out: Record<string, number> = {}
    if (!obj) return out
    for (const key in obj) {
        const val = obj[key]
        const path = prefix ? `${prefix}/${key}` : key
        if (typeof val === "number") out[path] = val
        else if (typeof val === "object") Object.assign(out, flatten(val, path))
    }
    return out
}

function getDateRange(filter: string) {
    const today = new Date()
    const dates: string[] = []
    const days =
        filter === "today" ? 1 :
            filter === "7d" ? 7 :
                filter === "30d" ? 30 : 0
    if (days === 0) return []
    for (let i = 0; i < days; i++) {
        const d = new Date(today)
        d.setDate(d.getDate() - i)
        dates.push(d.toISOString().split("T")[0])
    }
    return dates
}

function getPreviousDateRange(filter: string) {
    const today = new Date()
    const dates: string[] = []
    const days =
        filter === "today" ? 1 :
            filter === "7d" ? 7 :
                filter === "30d" ? 30 : 0
    if (days === 0) return []
    for (let i = days; i < days * 2; i++) {
        const d = new Date(today)
        d.setDate(d.getDate() - i)
        dates.push(d.toISOString().split("T")[0])
    }
    return dates
}

function getFilteredDaily(data: any, filter: string) {
    if (!data?.daily) return {}
    if (filter === "all") {
        let all: any = {}
        Object.values(data.daily).forEach((day: any) => {
            const flat = flatten(day)
            for (const k in flat) all[k] = (all[k] || 0) + flat[k]
        })
        return all
    }
    const dates = getDateRange(filter)
    let out: any = {}
    dates.forEach(d => {
        const day = flatten(data.daily?.[d])
        for (const k in day) out[k] = (out[k] || 0) + day[k]
    })
    return out
}

function formatNumber(num: number): string {
    if (typeof num == 'string') return num
    if (num < 1000) return num.toString()
    const units = ["", "K", "M", "B", "T"]
    const order = Math.floor(Math.log10(num) / 3)
    const unit = units[order]
    const scaled = num / Math.pow(1000, order)
    const formatted = scaled % 1 === 0 ? scaled.toFixed(0) : scaled.toFixed(1)
    return `${formatted}${unit}`
}

function formatDuration(ms: number): string {
    if (!ms || ms <= 0) return "0s"
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    if (hours > 0) return `${hours}h ${minutes % 60}m`
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`
    return `${seconds}s`
}

function getFilteredVisitorsData(
    data: any,
    dateFilter: "all" | "today" | "7d" | "30d",
    pageFilter: string
) {
    if (!data?.visitors) return {}

    const result: any = {
        uniqueVisitors: new Set<string>(),
        countries: {},
        devices: {},
        referrers: {}
    }

    const dates =
        dateFilter === "all"
            ? Object.keys(data.visitors)
            : getDateRange(dateFilter)

    dates.forEach(date => {
        const dayData = data.visitors?.[date]
        if (!dayData) return
        Object.entries(dayData).forEach(([page, visitors]: any) => {
            if (pageFilter !== "all" && page !== pageFilter) return
            Object.entries(visitors || {}).forEach(([visitorId, meta]: any) => {
                result.uniqueVisitors.add(visitorId)
                const country = meta.country || "unknown"
                result.countries[country] = (result.countries[country] || 0) + 1
                const device = meta.device || "unknown"
                result.devices[device] = (result.devices[device] || 0) + 1
                const ref = meta.referrer || "unknown"
                result.referrers[ref] = (result.referrers[ref] || 0) + 1
            })
        })
    })

    return result
}

/* ---- NEW: Advanced Analytics ---- */

function getAdvancedAnalytics(
    data: any,
    dateFilter: "all" | "today" | "7d" | "30d",
    pageFilter: string
) {
    if (!data?.visitors) return {
        uniqueVisitors: 0,
        prevUniqueVisitors: 0,
        newVisitors: 0,
        returningVisitors: 0,
        bounceRate: 0,
        avgSessionDuration: 0,
        conversionRate: 0,
        liveVisitors: 0,
        trendData: [],
        sourceQuality: {},
        funnelData: []
    }

    const conversionPages = ["contact", "trade-shows", "services"]
    const funnelSteps = ["home", "services", "contact"]

    const currentDates =
        dateFilter === "all"
            ? Object.keys(data.visitors)
            : getDateRange(dateFilter)

    const previousDates =
        dateFilter === "all" ? [] : getPreviousDateRange(dateFilter)

    // All visitor IDs ever (before current period)
    const allPreviousVisitors = new Set<string>()
    Object.keys(data.visitors || {}).forEach(date => {
        if (!currentDates.includes(date)) {
            const dayData = data.visitors[date]
            Object.values(dayData || {}).forEach((pageVisitors: any) => {
                Object.keys(pageVisitors || {}).forEach(vid => allPreviousVisitors.add(vid))
            })
        }
    })

    const currentVisitors = new Set<string>()
    const newVisitors = new Set<string>()
    const returningVisitors = new Set<string>()

    // Bounce: visitor visits only 1 page in a day
    let bouncedCount = 0
    let totalVisitorDays = 0

    // Session duration
    let totalDuration = 0
    let durationCount = 0

    // Conversions
    const convertedVisitors = new Set<string>()

    // Source quality
    const sourceData: Record<string, { visits: number; pages: Set<string>; conversions: number; bounces: number }> = {}

    // Trend data: per day
    const trendMap: Record<string, { date: string; visits: number; uniqueVisitors: Set<string> }> = {}

    // Funnel
    const funnelVisitors: Record<string, Set<string>> = {}
    funnelSteps.forEach(s => (funnelVisitors[s] = new Set()))

    currentDates.forEach(date => {
        const dayData = data.visitors?.[date]
        if (!dayData) return

        if (!trendMap[date]) trendMap[date] = { date, visits: 0, uniqueVisitors: new Set() }

        // Per-day bounce tracking: visitorId -> pages visited
        const visitorPagesPerDay: Record<string, Set<string>> = {}
        const visitorTimestamps: Record<string, number[]> = {}

        Object.entries(dayData).forEach(([page, visitors]: any) => {
            if (pageFilter !== "all" && page !== pageFilter) return

            Object.entries(visitors || {}).forEach(([visitorId, meta]: any) => {
                currentVisitors.add(visitorId)
                trendMap[date].uniqueVisitors.add(visitorId)
                trendMap[date].visits++

                if (allPreviousVisitors.has(visitorId)) {
                    returningVisitors.add(visitorId)
                } else {
                    newVisitors.add(visitorId)
                }

                // Pages per day
                if (!visitorPagesPerDay[visitorId]) visitorPagesPerDay[visitorId] = new Set()
                visitorPagesPerDay[visitorId].add(page)

                // Timestamps for session duration
                if (meta.at) {
                    if (!visitorTimestamps[visitorId]) visitorTimestamps[visitorId] = []
                    visitorTimestamps[visitorId].push(meta.at)
                }

                // Conversion
                if (conversionPages.includes(page)) convertedVisitors.add(visitorId)

                // Source quality
                const ref = meta.referrer || "direct"
                if (!sourceData[ref]) sourceData[ref] = { visits: 0, pages: new Set(), conversions: 0, bounces: 0 }
                sourceData[ref].visits++
                sourceData[ref].pages.add(page)
                if (conversionPages.includes(page)) sourceData[ref].conversions++

                // Funnel
                funnelSteps.forEach(step => {
                    if (page === step || page.startsWith(step)) funnelVisitors[step].add(visitorId)
                })
            })
        })

        // Bounce calculation per day
        Object.entries(visitorPagesPerDay).forEach(([vid, pages]) => {
            totalVisitorDays++
            if (pages.size <= 1) bouncedCount++
        })

        // Session duration
        Object.values(visitorTimestamps).forEach(timestamps => {
            if (timestamps.length >= 2) {
                const sorted = timestamps.sort((a, b) => a - b)
                totalDuration += sorted[sorted.length - 1] - sorted[0]
                durationCount++
            }
        })
    })

    // Source quality final
    const sourceQuality: Record<string, any> = {}
    Object.entries(sourceData).forEach(([ref, d]) => {
        sourceQuality[ref] = {
            visits: d.visits,
            avgPages: (d.pages.size / Math.max(d.visits, 1)).toFixed(1),
            conversionRate: ((d.conversions / Math.max(d.visits, 1)) * 100).toFixed(1),
            bounceRate: "N/A"
        }
    })

    // Previous period unique visitors
    let prevUniqueVisitors = 0
    if (previousDates.length > 0) {
        const prevSet = new Set<string>()
        previousDates.forEach(date => {
            const dayData = data.visitors?.[date]
            if (!dayData) return
            Object.entries(dayData).forEach(([page, visitors]: any) => {
                if (pageFilter !== "all" && page !== pageFilter) return
                Object.keys(visitors || {}).forEach(vid => prevSet.add(vid))
            })
        })
        prevUniqueVisitors = prevSet.size
    }

    // Live: visitors active in last 5 minutes
    const fiveMinAgo = Date.now() - 5 * 60 * 1000
    const liveSet = new Set<string>()
    const todayStr = new Date().toISOString().split("T")[0]
    const todayData = data.visitors?.[todayStr]
    if (todayData) {
        Object.values(todayData).forEach((pageVisitors: any) => {
            Object.entries(pageVisitors || {}).forEach(([vid, meta]: any) => {
                if (meta.at && meta.at > fiveMinAgo) liveSet.add(vid)
            })
        })
    }

    // Trend array sorted by date
    const trendData = Object.values(trendMap)
        .sort((a, b) => a.date.localeCompare(b.date))
        .map(d => ({
            date: d.date.slice(5), // MM-DD
            visits: d.visits,
            uniqueVisitors: d.uniqueVisitors.size
        }))

    // Funnel data
    const funnelData = funnelSteps.map(step => ({
        step,
        count: funnelVisitors[step].size
    }))

    return {
        uniqueVisitors: currentVisitors.size,
        prevUniqueVisitors,
        newVisitors: newVisitors.size,
        returningVisitors: returningVisitors.size,
        bounceRate: totalVisitorDays > 0 ? ((bouncedCount / totalVisitorDays) * 100).toFixed(1) : "0.0",
        avgSessionDuration: durationCount > 0 ? formatDuration(totalDuration / durationCount) : "N/A",
        conversionRate: currentVisitors.size > 0
            ? ((convertedVisitors.size / currentVisitors.size) * 100).toFixed(1)
            : "0.0",
        liveVisitors: liveSet.size,
        trendData,
        sourceQuality,
        funnelData
    }
}

/* ---------------- PAGE ---------------- */

export default function AdminAnalyticsPage() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const isuserOnline = useOnlineStatus()

    const [dateFilter, setDateFilter] = useState<"all" | "today" | "7d" | "30d">("all")
    const [pageFilter, setPageFilter] = useState<string>("all")

    useEffect(() => {
        if (isuserOnline === false) { setLoading(false); return }
        fetch("/api/track", { method: "GET" })
            .then(r => r.json())
            .then(json => { setData(json.data); setLoading(false) })
    }, [isuserOnline])

    const flatPages = flatten(data?.pages)
    const filteredDaily = getFilteredDaily(data, dateFilter)

    let pageFiltered = filteredDaily
    if (pageFilter !== "all") {
        pageFiltered = Object.fromEntries(
            Object.entries(filteredDaily).filter(([k]) => k === pageFilter)
        )
    }

    const totalVisits = Object.values(pageFiltered).reduce((a: any, b: any) => a + b, 0)

    const analytics = useMemo(() => {
        return getFilteredVisitorsData(data, dateFilter, pageFilter)
    }, [data, dateFilter, pageFilter])

    const advanced = useMemo(() => {
        return getAdvancedAnalytics(data, dateFilter, pageFilter)
    }, [data, dateFilter, pageFilter])

    const countries = analytics.countries || {}
    const devices = analytics.devices || {}
    const referrers = analytics.referrers || {}

    // Growth %
    const growthPct = advanced.prevUniqueVisitors > 0
        ? (((advanced.uniqueVisitors - advanced.prevUniqueVisitors) / advanced.prevUniqueVisitors) * 100).toFixed(1)
        : null
    const growthNum = growthPct !== null ? parseFloat(growthPct) : null

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <AdminSidebar />
                <main className="flex-1 items-center justify-center flex flex-col">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    <span>Loading analytics…</span>
                </main>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen max-h-[80vh] bg-background justify-between">
            <AdminSidebar />
            <main className="flex-1 p-2 md:p-6 w-full md:pt-0 overflow-y-auto">

                {/* Header */}
                <div className="flex items-center justify-start sticky top-0 bg-background py-5 z-10 mb-8 flex-wrap gap-3">
                    <AdminSidebarToggleButton />
                    <h1 className="text-2xl font-bold me-auto">Traffic Analytics</h1>

                    {/* Live visitors badge */}
                    {console.log("data  ",data)}
                    {data && (
                        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                            </span>
                            {formatNumber(advanced.liveVisitors)} Live
                        </div>
                    )}

                    <div className="flex gap-3 flex-wrap">
                        <select
                            value={dateFilter}
                            onChange={e => setDateFilter(e.target.value as any)}
                            className="bg-card border border-border text-foreground px-3 py-1 rounded"
                        >
                            <option value="all">All Time</option>
                            <option value="today">Today</option>
                            <option value="7d">Last 7 Days</option>
                            <option value="30d">Last 30 Days</option>
                        </select>

                        <select
                            value={pageFilter}
                            onChange={e => setPageFilter(e.target.value)}
                            className="bg-card border border-border text-foreground px-3 py-1 rounded"
                        >
                            <option value="all">All Pages</option>
                            {Object.keys(flatPages).map(p => (
                                <option key={p} value={p}>{p === 'trade-shows' ? "Calendar" : p.slice(0, 1).toLocaleUpperCase() + p.slice(1)}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {!data ? (
                    <Card className="bg-transparent border-0 p-6 text-center text-white/60">
                        <CardHeader>
                            <BarChart3 size={120} className="mx-auto mt-10" />
                            <CardTitle className="text-white/60">No Data Yet!</CardTitle>
                            <CardDescription>Analytics data will appear here once traffic is received.</CardDescription>
                        </CardHeader>
                    </Card>
                ) : (
                    <>
                        {/* ── Row 1: Core Stats ── */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <Stat title="Total Visits" value={totalVisits} icon={<BarChart3 />} />

                            {/* Unique Visitors with growth */}
                            <Card className="bg-card border-border">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm text-muted-foreground">Unique Visitors</CardTitle>
                                </CardHeader>
                                <CardContent className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="text-gray-400"><Users size={20} /></div>
                                        <span className="text-2xl font-bold">{formatNumber(advanced.uniqueVisitors)}</span>
                                    </div>
                                    {growthNum !== null && dateFilter !== "all" && (
                                        <GrowthBadge pct={growthNum} />
                                    )}
                                </CardContent>
                            </Card>

                            <Stat title="Pages Tracked" value={Object.keys(flatPages).length} icon={<FileText />} />
                            <Stat title="Date Filter" value={dateFilter.toUpperCase()} icon={<CalendarDays />} />
                        </div>

                        {/* ── Row 2: Smart Stats ── */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <SmartStat
                                title="New Visitors"
                                value={advanced.newVisitors}
                                sub={advanced.uniqueVisitors > 0 ? `${((advanced.newVisitors / advanced.uniqueVisitors) * 100).toFixed(0)}% of total` : ""}
                                icon={<Zap size={16} />}
                                color="text-blue-400"
                            />
                            <SmartStat
                                title="Returning"
                                value={advanced.returningVisitors}
                                sub={advanced.uniqueVisitors > 0 ? `${((advanced.returningVisitors / advanced.uniqueVisitors) * 100).toFixed(0)}% of total` : ""}
                                icon={<Users size={16} />}
                                color="text-purple-400"
                            />
                            <SmartStat
                                title="Bounce Rate"
                                value={`${advanced.bounceRate}%`}
                                sub="Single-page visits"
                                icon={<Activity size={16} />}
                                color="text-orange-400"
                            />
                            <SmartStat
                                title="Avg Session"
                                value={advanced.avgSessionDuration}
                                sub="Time on site"
                                icon={<Clock size={16} />}
                                color="text-green-400"
                            />
                        </div>

                        {/* ── Conversion Banner ── */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <Card className="bg-gradient-to-r from-violet-900/30 to-blue-900/30 border border-violet-500/20">
                                <CardContent className="flex items-center justify-between p-4">
                                    <div>
                                        <p className="text-sm text-white/50 mb-1">Conversion Rate</p>
                                        <p className="text-3xl font-bold text-white">{advanced.conversionRate}%</p>
                                        <p className="text-xs text-white/40 mt-1">Visitors reaching contact/services pages</p>
                                    </div>
                                    <Target size={40} className="text-violet-400 opacity-60" />
                                </CardContent>
                            </Card>
                            <Card className="bg-gradient-to-r from-green-900/30 to-teal-900/30 border border-green-500/20">
                                <CardContent className="flex items-center justify-between p-4">
                                    <div>
                                        <p className="text-sm text-white/50 mb-1">Live Right Now</p>
                                        <p className="text-3xl font-bold text-white">{formatNumber(advanced.liveVisitors)}</p>
                                        <p className="text-xs text-white/40 mt-1">Active in last 5 minutes</p>
                                    </div>
                                    <Radio size={40} className="text-green-400 opacity-60" />
                                </CardContent>
                            </Card>
                        </div>

                        {/* ── Traffic Trend Chart ── */}
                        {advanced.trendData.length > 1 && (
                            <Card className="bg-card border-border mb-6">
                                <CardHeader className="pb-1">
                                    <CardTitle className="flex gap-2 items-center text-gray-300">
                                        <TrendingUp size={18} /> Traffic Trend
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <LineChart data={advanced.trendData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                            <XAxis dataKey="date" tick={{ fill: "#ffffff50", fontSize: 11 }} />
                                            <YAxis tick={{ fill: "#ffffff50", fontSize: 11 }} />
                                            <Tooltip
                                                contentStyle={{ background: "#1e1e2e", border: "1px solid #ffffff20", borderRadius: 8 }}
                                                labelStyle={{ color: "#fff" }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="visits"
                                                stroke="#818cf8"
                                                strokeWidth={2}
                                                dot={false}
                                                name="Visits"
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="uniqueVisitors"
                                                stroke="#34d399"
                                                strokeWidth={2}
                                                dot={false}
                                                name="Unique"
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                    <div className="flex gap-4 mt-2 justify-center text-xs text-white/50">
                                        <span className="flex items-center gap-1"><span className="inline-block w-3 h-0.5 bg-indigo-400"></span> Visits</span>
                                        <span className="flex items-center gap-1"><span className="inline-block w-3 h-0.5 bg-green-400"></span> Unique Visitors</span>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* ── Standard Boxes ── */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <Box title="Top Pages" icon={<TrendingUp />}>
                                {Object.entries(pageFiltered)
                                    .sort((a, b) => (b[1] as number) - (a[1] as number))
                                    .slice(0, 5)
                                    .map(([k, v]) => (
                                        <Row key={k} label={k} value={v} totalVisits={totalVisits} uppercase />
                                    ))}
                            </Box>

                            <Box title="Devices" icon={<Monitor />}>
                                {Object.entries(devices).map(([k, v]) => (
                                    <Row key={k} label={k} value={v} totalVisits={totalVisits} uppercase />
                                ))}
                            </Box>

                            <Box title="Referrers" icon={<Share2 />}>
                                {Object.entries(referrers).map(([k, v]) => (
                                    <Row key={k} label={k} value={v} totalVisits={totalVisits} uppercase />
                                ))}
                            </Box>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <Box title="Countries" icon={<Globe />}>
                                {Object.entries(countries).map(([k, v]) => (
                                    <Row key={k} label={k} totalVisits={Object.entries(countries).reduce((acc: any, a: any) => acc + a[1], 0)} value={v} />
                                ))}
                            </Box>

                            <Box title="Filtered Traffic" icon={<CalendarDays />}>
                                {Object.entries(pageFiltered)
                                    .sort((a, b) => (b[1] as number) - (a[1] as number))
                                    .map(([k, v]) => (
                                        <Row key={k} label={k} value={v} totalVisits={totalVisits} uppercase />
                                    ))}
                            </Box>
                        </div>

                        {/* ── Funnel View ── */}
                        {advanced.funnelData.some(f => f.count > 0) && (
                            <Card className="bg-card border-border mb-6">
                                <CardHeader className="pb-1">
                                    <CardTitle className="flex gap-2 items-center text-gray-300">
                                        <ArrowRight size={18} /> Conversion Funnel
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-end gap-3 flex-wrap">
                                        {advanced.funnelData.map((step, i) => {
                                            const maxCount = Math.max(...advanced.funnelData.map(f => f.count), 1)
                                            const pct = ((step.count / maxCount) * 100).toFixed(0)
                                            const dropoff = i > 0 && advanced.funnelData[i - 1].count > 0
                                                ? (((advanced.funnelData[i - 1].count - step.count) / advanced.funnelData[i - 1].count) * 100).toFixed(0)
                                                : null
                                            return (
                                                <div key={step.step} className="flex items-center gap-3">
                                                    {i > 0 && (
                                                        <div className="text-center">
                                                            <ArrowRight size={16} className="text-white/30" />
                                                            {dropoff && <p className="text-xs text-red-400">-{dropoff}%</p>}
                                                        </div>
                                                    )}
                                                    <div className="text-center min-w-[80px]">
                                                        <div
                                                            className="mx-auto rounded-t-md mb-1 transition-all"
                                                            style={{
                                                                width: 60,
                                                                height: Math.max(parseInt(pct) * 0.8, 8),
                                                                background: `rgba(99,102,241,${0.3 + (parseInt(pct) / 100) * 0.7})`
                                                            }}
                                                        />
                                                        <p className="text-white font-semibold text-sm">{step.count}</p>
                                                        <p className="text-white/40 text-xs capitalize">{step.step}</p>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* ── Source Quality Table ── */}
                        {Object.keys(advanced.sourceQuality).length > 0 && (
                            <Card className="bg-card border-border mb-6">
                                <CardHeader className="pb-1">
                                    <CardTitle className="flex gap-2 items-center text-gray-300">
                                        <BarChart3 size={18} /> Source Quality Analysis
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="text-white/40 border-b border-white/10">
                                                    <th className="text-left py-2 pr-4">Source</th>
                                                    <th className="text-right py-2 pr-4">Visits</th>
                                                    <th className="text-right py-2 pr-4">Avg Pages</th>
                                                    <th className="text-right py-2">Conversion</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Object.entries(advanced.sourceQuality)
                                                    .sort((a: any, b: any) => b[1].visits - a[1].visits)
                                                    .map(([source, q]: any) => (
                                                        <tr key={source} className="border-b border-white/5 hover:bg-white/5">
                                                            <td className="py-2 pr-4 text-gray-300 max-w-[160px] truncate">{source}</td>
                                                            <td className="py-2 pr-4 text-right font-medium">{q.visits}</td>
                                                            <td className="py-2 pr-4 text-right text-white/60">{q.avgPages}</td>
                                                            <td className="py-2 text-right">
                                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${parseFloat(q.conversionRate) > 0 ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-white/30'}`}>
                                                                    {q.conversionRate}%
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </>
                )}
            </main>
        </div>
    )
}

/* ---------------- UI COMPONENTS ---------------- */

function GrowthBadge({ pct }: { pct: number }) {
    if (pct > 0) return (
        <span className="flex items-center gap-1 text-xs font-semibold text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
            <TrendingUp size={12} /> +{pct}%
        </span>
    )
    if (pct < 0) return (
        <span className="flex items-center gap-1 text-xs font-semibold text-red-400 bg-red-400/10 px-2 py-1 rounded-full">
            <TrendingDown size={12} /> {pct}%
        </span>
    )
    return (
        <span className="flex items-center gap-1 text-xs font-semibold text-white/40 bg-white/5 px-2 py-1 rounded-full">
            <Minus size={12} /> 0%
        </span>
    )
}

function SmartStat({ title, value, sub, icon, color }: any) {
    return (
        <Card className="bg-card border-border">
            <CardContent className="pt-4 pb-3">
                <div className={`flex items-center gap-1.5 text-xs mb-2 ${color}`}>
                    {icon}
                    <span className="text-muted-foreground">{title}</span>
                </div>
                <p className="text-xl font-bold">{typeof value === "number" ? formatNumber(value) : value}</p>
                {sub && <p className="text-xs text-white/30 mt-0.5">{sub}</p>}
            </CardContent>
        </Card>
    )
}

function Stat({ title, value, icon }: any) {
    return (
        <Card className="bg-card border-border">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-2">
                {icon && <div className="text-gray-400">{icon}</div>}
                <span className="text-2xl font-bold">{formatNumber(value)}</span>
            </CardContent>
        </Card>
    )
}

function Box({ title, icon, children }: any) {
    return (
        <Card className="bg-card border-border max-h-85 overflow-auto">
            <CardHeader className="sticky top-0 bg-card pb-1">
                <CardTitle className="flex gap-2 items-center text-gray-300">
                    {icon}{title}
                </CardTitle>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    )
}

function Row({ label, value, totalVisits, uppercase }: any) {
    const pct = totalVisits > 0 ? ((value / totalVisits) * 100).toFixed(1) : "0.0"
    return (
        <div className="flex justify-between text-sm my-2">
            <span className="text-gray-400 break-all">
                {uppercase ? label.toUpperCase().replaceAll("-", " ") : label}
            </span>
            <p className="flex gap-1">
                <span className="font-semibold">{formatNumber(value)}</span>
                <span className="text-white/50">({pct}%)</span>
            </p>
        </div>
    )
}