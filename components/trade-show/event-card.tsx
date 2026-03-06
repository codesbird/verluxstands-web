"use client"
import { getEventStatusWithStyle } from "@/components/trade-show/event-badge"
import Image from "next"
import Link from "next/link"


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

interface EventsData {
    id: string
    image: string
    title: string
    startDate: string
    endDate: string
    location: string
}

interface EventCardProps {
    data: EventsData
}

export default function EventCard({ data }: EventCardProps) {

    return (
        <div
            key={data.id}
            className="bg-card rounded-3xl lg:my-4 my-8 shadow-lg relative"
        >
            <div className="w-32 h-32 rounded-full border mx-auto overflow-hidden bg-card shadow-sm flex justify-center items-center" style={{ marginTop: "-50px" }}>
                <Link href={`/trade-shows/${data.id}`}>
                    {data.image && <img
                        src={data.image}
                        className="object-cover w-full h-full"
                    />}
                </Link>
            </div>
            <div className="bg-primary mt-2 text-sm py-1 text-white text-center">{formatDateRange(data.startDate, data.endDate)}</div>
            <div className="p-3 font-semibold text-center text-xl">
                <Link href={`/trade-shows/${data.id}`}
                    className="border-b"
                >
                    {data.title} {getDate(data.startDate)[2]}
                </Link>
            </div>
            <div className="p-3 text-center text-black/60">{data.location}</div>

        </div>
    )
}