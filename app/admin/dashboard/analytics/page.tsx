"use client"

import { AdminSidebar } from "@/components/admin/sidebar"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import useOnlineStatus from "@/hooks/Network-Status"
import { AdminSidebarToggleButton } from "@/components/admin/sidebar"
import {
    BarChart3,
    Users,
    CalendarDays,
    FileText,
    Globe,
    Monitor,
    Share2,
    TrendingUp,
    Menu
} from "lucide-react"

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

function getFilteredDaily(data: any, filter: string) {
    if (!data?.daily) return {}

    // all-time
    if (filter === "all") {
        let all: any = {}
        Object.values(data.daily).forEach((day: any) => {
            const flat = flatten(day)
            for (const k in flat) all[k] = (all[k] || 0) + flat[k]
        })
        return all
    }

    // date-range
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

    // Keep 1 decimal only if needed
    const formatted =
        scaled % 1 === 0 ? scaled.toFixed(0) : scaled.toFixed(1)

    return `${formatted}${unit}`
}

/* ---------------- PAGE ---------------- */

export default function AdminAnalyticsPage() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const isuserOnline = useOnlineStatus()

    const [dateFilter, setDateFilter] = useState<"all" | "today" | "7d" | "30d">("all")
    const [pageFilter, setPageFilter] = useState<string>("all")

    useEffect(() => {
        if (isuserOnline === false) {
            setLoading(false)
            return
        }

        fetch("/api/track", { method: "GET" })
            .then(r => r.json())
            .then(json => {
                setData(json.data)
                setLoading(false)
            })
    }, [isuserOnline])

    if (loading) {
        return (
            <div className="flex min-h-screen bg-background">
                <AdminSidebar />
                <main className="flex-1 p-6 ml-64">Loading analytics…</main>
            </div>
        )
    }

    /* -------- Prepare Data -------- */

    const flatPages = flatten(data.pages)
    const filteredDaily = getFilteredDaily(data, dateFilter)

    let pageFiltered = filteredDaily
    if (pageFilter !== "all") {
        pageFiltered = Object.fromEntries(
            Object.entries(filteredDaily).filter(([k]) => k === pageFilter)
        )
    }

    const totalVisits = Object.values(pageFiltered).reduce((a: any, b: any) => a + b, 0)
    const uniqueVisitors =
        Object.values(data.visitors || {})
            .flatMap((d: any) => Object.keys(d || {}))
            .length

    const countries = data.countries || {}
    const devices = data.devices || {}
    const referrers = data.referrers || {}

    return (
        <div className="flex min-h-screen max-h-[80vh]  bg-background justify-between">
            <AdminSidebar />
            <main className="flex-1 p-6 w-full overflow-y-auto">

                <div className="flex items-center justify-between mb-8">
                    <AdminSidebarToggleButton />
                    <h1 className="text-2xl font-bold w-52">Traffic Analytics</h1>

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
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {!flatPages || totalVisits === 0 ? (
                    <Card className="bg-card border-border p-6">
                        <CardHeader>
                            <CardTitle>No Data Available</CardTitle>
                            <CardDescription>
                                Analytics data will appear here once traffic is received.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <Stat title="Total Visits" value={totalVisits} icon={<BarChart3 />} />
                            <Stat title="Unique Visitors" value={uniqueVisitors} icon={<Users />} />
                            <Stat title="Pages Tracked" value={Object.keys(flatPages).length} icon={<FileText />} />
                            <Stat title="Date Filter" value={dateFilter.toUpperCase()} icon={<CalendarDays />} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Box title="Top Pages" icon={<TrendingUp />}>
                                {Object.entries(pageFiltered)
                                    .sort((a, b) => (b[1] as number) - (a[1] as number))
                                    .slice(0, 5)
                                    .map(([k, v]) => (
                                        <Row key={k} label={k} value={v} uppercase />
                                    ))}
                            </Box>

                            <Box title="Devices" icon={<Monitor />}>
                                {Object.entries(devices).map(([k, v]) => (
                                    <Row key={k} label={k} value={v} uppercase />
                                ))}
                            </Box>

                            <Box title="Referrers" icon={<Share2 />}>
                                {Object.entries(referrers).map(([k, v]) => (
                                    <Row key={k} label={k} value={v} uppercase />
                                ))}
                            </Box>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <Box title="Countries" icon={<Globe />}>
                                {Object.entries(countries).map(([k, v]) => (
                                    <Row key={k} label={k} value={v} />
                                ))}
                            </Box>

                            <Box title="Filtered Traffic" icon={<CalendarDays />}>
                                {Object.entries(pageFiltered)
                                    .sort((a, b) => (b[1] as number) - (a[1] as number))
                                    .map(([k, v]) => (
                                        <Row key={k} label={k} value={v} uppercase />
                                    ))}
                            </Box>
                        </div>
                    </>
                )}
            </main>
        </div>
    )
}

/* ---------------- UI ---------------- */

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
        <Card className="bg-card border-border">
            <CardHeader>
                <CardTitle className="flex gap-2 items-center text-gray-300">
                    {icon}{title}
                </CardTitle>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    )
}

function Row({ label, value, uppercase }: any) {
    return (
        <div className="flex justify-between text-sm my-2">
            <span className="text-gray-400 break-all">
                {label.toUpperCase().replaceAll("-", " ")}
            </span>
            <span className="font-semibold">{formatNumber(value)}</span>
        </div>
    )
}
