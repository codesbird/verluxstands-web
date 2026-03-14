"use client"

import { useEffect, useState } from "react";
import { getAllEvents } from "@/lib/server/events"
import { Calendar, MapPin, Users, ArrowRight, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Events from "@/components/trade-show/events"
import CTASection from "@/components/common/quick-actions"
import ContactSection from '@/components/home/contact-section';



export default function ClientEvents() {

    const [eventsData, setEventsData] = useState<any[]>([])
    const [seachQuery, setSearchQuery] = useState("")

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

    function getDate(date: string) {
        const dateObj = new Date(date);

        // Get day (numeric) and month (short name)
        const formattedDate = dateObj.toLocaleString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: "numeric"
        });
        console.log("new date  ", formattedDate)
        return formattedDate.split(" ")

    }

    return (

        <div>

            <div className="w-full bg-primary mb-20 rounded-3xl p-3 md:p-5 lg:p-10 relative">
                <div className="border wk-2xl flex flex-start gap-3 rounded-2xl p-3 text-white items-center">
                    <Search />
                    <input onChange={(e) => setSearchQuery(e.target.value)} type="search" className="bg-black/20 w-full p-1 px-2 rounded text-lg text-white/70" placeholder="search event to explore" />
                </div>
                {seachQuery.length > 0 &&
                    <div className="bg-primary max-h-60 border border-t-0 overflow-auto short-scroller px-2 rounded-b-2xl w-2kxl shadow-lg z-10 pt-4 pb-3 relative bottom-4 z-10">
                        {[...eventsData]
                            .filter((item) => seachQuery.length > 0 && String(item.title + item.startDate + item.location).toLowerCase().includes(seachQuery.toLowerCase()))
                            .map((item) => (
                                item &&
                                <Link
                                    href={`/trade-shows/${item.slug}`} key={item.id + item.title}
                                    className="block p-3 py-2 border-b border-white/20 kack/50 my-2 text-white/80 ">
                                    <div className="flex justify-start gap-5">
                                        <div className="flex flex-col">
                                            <div className="text-5xl font-semibold text-cyan-500">
                                                {getDate(item.startDate)[0]}
                                            </div>
                                            <div>
                                                {getDate(item.startDate)[1]}
                                            </div>

                                        </div>
                                        <div className="me-auto">
                                            <div className="text-sm">{formatDateRange(item.startDate, item.endDate)}</div>
                                            <div className="text-xl my-1 font-bold">{item.title} {getDate(item.startDate)[2]}</div>
                                            <div className="text-sm text-white/60 font-semibold">{item.location}</div>
                                        </div>
                                        <div className="h-20 rounded-2xl overflow-hidden w-30">
                                            {item.image && <img src={item.image} />}
                                        </div>
                                    </div>
                                </Link>
                            ))
                        }
                    </div>
                }
            </div>

            <div>
                <Events />
            </div>

            <CTASection />
            <ContactSection />
        </div>

    )
}