
"use client"

import { AdminSidebar, AdminSidebarToggleButton } from "@/components/admin/sidebar"

import { useEffect, useState } from "react"
import ReactECharts from "echarts-for-react"
import * as echarts from "echarts"
import countries from "i18n-iso-countries"
import useOnlineStatus from "@/hooks/Network-Status"





export default function MapView() {
    const [data, setData] = useState<any>(null)
    const isuserOnline = useOnlineStatus()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (isuserOnline === false) { setLoading(false); return }
        fetch("/api/track", { method: "GET" })
            .then(r => r.json())
            .then(json => { setData(json.data); setLoading(false) })
    }, [isuserOnline])

    return (
        <div className="flex min-h-screen max-h-[80vh] bg-background justify-between">
            <AdminSidebar />
            <main className="flex-1 p-2 md:p-6 w-full md:pt-0 overflow-y-auto">

                {/* Header */}
                <div className="flex items-center justify-start sticky top-0 bg-background py-5 z-10 mb-8 flex-wrap gap-3">
                    <AdminSidebarToggleButton />
                    <h1 className="text-2xl font-bold me-auto">Traffic Analytics</h1>
                </div>
            </main>
            <TrafficMap countries={data.countries}/>
        </div>
    )
}


countries.registerLocale(
    require("i18n-iso-countries/langs/en.json")
)

export function TrafficMap({ countries: traffic }: any) {
    const [ready, setReady] = useState(false)

    useEffect(() => {
        fetch("/maps/countries.geo.json")
            .then(res => res.json())
            .then(geoJson => {
                echarts.registerMap("world", geoJson)
                setReady(true)
            })
    }, [])

    if (!ready) return null

    // 🔥 Convert ISO2 → ISO3
    const data = Object.entries(traffic)
        .filter(([code]) => code !== "unknown")
        .map(([iso2, value]) => ({
            name: countries.alpha2ToAlpha3(iso2 as string), 
            value
        }))
        .filter(d => d.name) // remove invalid ones

    const option = {
        tooltip: {
            trigger: "item",
            formatter: (params: any) =>
                `${params.name || "Unknown"}: ${params.value || 0} visits`
        },
        visualMap: {
            min: 0,
            max: Math.max(...data.map((d: any) => d.value)),
            left: "left",
            bottom: "5%",
            text: ["High", "Low"],
            calculable: true
        },
        series: [
            {
                name: "Traffic",
                type: "map",
                map: "world",
                roam: true,
                data
            }
        ]
    }

    return (
        <ReactECharts
            option={option}
            style={{ height: 500 }}
        />
    )
}