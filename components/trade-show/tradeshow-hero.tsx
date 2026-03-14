"use client"

import Image from "next/image"
import { CalendarDays, MapPin } from "lucide-react"
import QuoteButton from "@/components/common/quote-button"
import { getEventBySlug } from "@/lib/server/events"
import { useState, useEffect } from "react"
import { useCountdown } from "@/components/trade-show/timeleft"

interface EventData {
    title?: string
    subtitle?: string
    image?: string
    startDate?: string
    endDate?: string
    location?: string
}

interface TradeShowHeroProps {
    slug: string
}

export default function TradeShowHero({ slug }: TradeShowHeroProps) {

    const [eventData, setEventData] = useState<EventData | null>(null)

    useEffect(() => {
        const loadEvent = async () => {
            const res = await getEventBySlug(String(slug))

            if (res?.success) {
                setEventData(res.data)
            }
        }

        loadEvent()
    }, [slug])

    const countdown = useCountdown(eventData?.startDate || "")

    if (!eventData) return null

    return (
        <section className="relative min-h-screen py-8 flex items-center justify-center text-white">

            {/* Background */}
            <div className="absolute inset-0">
                <Image
                    src={"https://i.pinimg.com/236x/bb/13/df/bb13df9f653bd6dfd4e01563cf985fb9.jpg"}
                    alt={eventData.title || "event"}
                    fill
                    priority
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px]" />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center max-w-4xl px-6">

                {/* Logo */}
                <div className="mx-auto mb-8 w-40 p-2 h-40 rounded-xl flex items-center justify-center shadow-lg border border-white/30">
                    {eventData.image && (
                        <Image
                            src={eventData.image}
                            alt={eventData.title || "event logo"}
                            width={130}
                            height={100}
                            className="object-contain rounded"
                        />
                    )}
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-6xl font-bold tracking-wide">
                    {eventData.title}
                </h1>

                {/* Subtitle */}
                <p className="mt-4 px-8 md:p-0 text-lg text-white/80">
                    Tube Düsseldorf 2026 is a leading show for the tube manufacturing industry
                </p>

                {/* Date & Location */}
                <div className="flex flex-wrap items-center justify-center md:gap-6 gap-3 mt-6 text-sm md:text-base text-white/90">

                    <div className="flex items-center gap-2">
                        <CalendarDays size={18} />
                        <span>{eventData.startDate} – {eventData.endDate}</span>
                    </div>

                    <div className="w-px h-5 bg-white/40 hidden md:block" />

                    <div className="flex items-center gap-2">
                        <MapPin size={18} />
                        <span>{eventData.location}</span>
                    </div>

                </div>

                {/* CTA */}
                <div className="mt-8">
                    <QuoteButton
                        name="REQUEST QUOTE"
                        type="button"
                        className="btn-white"
                    />
                </div>

                {/* Countdown */}
                {countdown && (
                    <div className="flex justify-center gap-4 mt-10">
                        {/* {console.log("new data : ",countdown)} */}
                        {Object.entries(countdown).map(([label, value]) => (
                            <div key={label} className="flex gap-2 flex-col text-center">

                                <div className="flex gap-2">
                                    {value
                                        .toString()
                                        .padStart(2, "0")
                                        .split("")
                                        .map((num: any, idx: any) => (
                                            <div
                                                key={idx}
                                                className="bg-primary rounded px-2 md:px-5 py-2 text-xs md:text-2xl font-bold"
                                            >
                                                {num}
                                            </div>
                                        ))}
                                </div>

                                <div className="text-xs md:text-sm mt-1 font-black">
                                    {label.toUpperCase()}
                                </div>

                            </div>
                        ))}

                    </div>
                )}

            </div>
        </section>
    )
}