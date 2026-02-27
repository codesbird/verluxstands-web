"use client"

import { useEffect, useState } from "react";
import { getAllEvents } from "@/lib/server/events"
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getEventStatusWithStyle } from "./event-badge"


export default function ClientEvents() {

    const [eventsData, setEventsData] = useState<any[]>([])

    // Fetch events
    useEffect(() => {
        (async () => {
            const res = await getAllEvents()
            if (res.success) {
                setEventsData(res.data || [])
            }
        })()
    }, [])

    function formatDateRange(start: string, end: string) {
        const startDate = new Date(start);
        const endDate = new Date(end);

        const options: Intl.DateTimeFormatOptions = {
            month: "short",
            day: "numeric",
        };

        const startFormatted = startDate.toLocaleDateString("en-US", options);
        const endFormatted = endDate.toLocaleDateString("en-US", {
            ...options,
            year: "numeric",
        });

        return `${startFormatted} – ${endFormatted}`;
    }


    return (
        [...eventsData]
            .sort((a, b) => {
                const now = new Date().getTime()

                const aStart = new Date(a.startDate).getTime()
                const bStart = new Date(b.startDate).getTime()

                const aEnd = new Date(a.endDate).getTime()
                const bEnd = new Date(b.endDate).getTime()

                // 1️⃣ Upcoming events first (closest upcoming first)
                if (aStart > now && bStart > now) {
                    return aStart - bStart
                }

                // 2️⃣ If only one is upcoming
                if (aStart > now) return -1
                if (bStart > now) return 1

                // 3️⃣ Ongoing next
                const aOngoing = aStart <= now && aEnd >= now
                const bOngoing = bStart <= now && bEnd >= now

                if (aOngoing && !bOngoing) return -1
                if (!aOngoing && bOngoing) return 1

                // 4️⃣ Completed (latest completed first)
                return bEnd - aEnd
            })
            .map((event) => (
                <div
                    key={event.id}
                    className="bg-card border border-border rounded-xl p-6 md:p-8 hover:border-primary/50 transition-colors mb-3 relative"
                >
                    <span className="absolute top-0 end-5 m-3 text-sm">{getEventStatusWithStyle(event)}</span>

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 ">
                        {event.image && <img src={event.image} className="max-w-52" />}

                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="px-3 py-1 me-auto bg-primary/10 text-primary text-sm font-medium rounded-full">
                                    {event.category.toUpperCase()}
                                </span>

                            </div>

                            <h3 className="font-serif text-2xl font-bold mb-4">{event.title}</h3>
                            <div className="flex flex-wrap gap-x-6 gap-y-3 text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    <span>{event.startDate}</span>
                                    <span>{event.endDate}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    <span>{event.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-primary" />
                                    <span>{event.attendees} attendees</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-start sm:items-center gap-4">

                            <div className="text-left lg:text-right">
                                <p className="text-sm text-muted-foreground">Book by</p>
                                <p className="font-semibold text-foreground text-sm">{formatDateRange(event.startDate, event.endDate)}</p>
                            </div>
                            <Link href="/contact">
                                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                    Get Quote
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            ))
    )
}