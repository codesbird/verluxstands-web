"use client";

import { Calendar, MapPin, Users, Clock } from "lucide-react";

interface EventCardProps {
    id: string;
    loading: boolean;
    category: string;
    title: string;
    startDate: string;
    endDate: string;
    location: string;
    attendees?: string;
    bookingDeadline?: string;
    createdAt: any;
    updatedAt: any;
    onEdit?: () => void;
    onDelete?: () => void;
    image: string
}

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

function timeAgo(timestamp: number) {
    const now = Date.now();
    const diff = now - timestamp;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day(s) ago`;
    if (hours > 0) return `${hours} hour(s) ago`;
    if (minutes > 0) return `${minutes} minute(s) ago`;
    return "Just now";
}

function formatAttendees(attendees?: string) {
    if (!attendees) return null;
    const num = Number(attendees);
    if (isNaN(num)) return attendees;
    return `${num.toLocaleString()}+`;
}

export default function EventCard({
    loading,
    category,
    title,
    startDate,
    endDate,
    location,
    attendees,
    bookingDeadline,
    onEdit,
    onDelete,
    createdAt,
    updatedAt,
    image
}: EventCardProps) {
    return (
        <div className="bg-[#111] border relative border-[#222] rounded-2xl p-5 hover:border-primary/50 transition-all">

            <div className="flex gap-3 flex-wrap">
                <div className="me-auto">
                    {/* Category */}
                    <span className="text-xs uppercase tracking-wide text-primary font-medium">
                        {category}
                    </span>

                    {/* Title */}
                    <h3 className="text-xl font-semibold mt-1">{title.toLocaleUpperCase()}</h3>

                    {/* Date */}
                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-3">
                        <Calendar size={16} />
                        {formatDateRange(startDate, endDate)}
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-2">
                        <MapPin size={16} />
                        {location}
                    </div>

                    {/* Attendees */}
                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-2">
                        <Users size={16} />
                        {attendees ? (<>{formatAttendees(attendees)} Attendees</>):'- - - - -'}
                    </div>

                    {/* Booking Deadline */}
                    {bookingDeadline && (
                        <div className="flex items-center gap-2 text-sm text-yellow-400 mt-2">
                            <Clock size={16} />
                            Book by {bookingDeadline}
                        </div>
                    )}
                </div>
                <div className="rounded">
                    {image && <img className="rounded max-w-52" src={image} />}
                </div>
            </div>



            {/* Admin Actions */}
            <div className="flex justify-end gap-3 mt-5 flex-wrap">
                <div className="me-auto text-sm text-gray-400">
                    <p>Create At : {timeAgo(createdAt)}</p>
                    {updatedAt && <p>Updated At : {timeAgo(updatedAt)}</p>}
                </div>
                 
                <button
                    onClick={onEdit}
                    className="text-sm px-3 py-1 h-8 rounded bg-[#222] hover:bg-[#333]"
                >
                    Edit
                </button>

                <button
                    disabled={loading}
                    onClick={(e) => onDelete?.()}
                    className={`text-sm px-3 h-8 py-1 rounded ${!loading ? "bg-red-600 hover:bg-red-700" : "bg-background"} text-white`}
                >
                    Delete
                </button>
            </div>
        </div>
    );
}