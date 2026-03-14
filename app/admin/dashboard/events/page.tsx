"use client"

import { AdminSidebar, AdminSidebarToggleButton } from "@/components/admin/sidebar"
import { Plus } from "lucide-react"
import EventCard from "@/components/admin/events/eventsCard"
import { useState, useEffect } from "react"
import ConfirmModal from "@/components/common/Confirm"
import { ArrowUp, ArrowDown, Download, Upload, ChevronDown, Loader2 } from "lucide-react";
import {
    createEvent,
    getAllEvents,
    deleteEventBySlug,
    updateEventBySlug,
} from "@/lib/server/events"

import AddEvent from "@/components/admin/events/addEvent"
import EventPageBuilder from "@/components/admin/events/EventPageBuilder"


export default function Events() {
    const [eventsData, setEventsData] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [isExportOpen, setIsExportOpen] = useState(false)

    const [isModalOpen, setModalOpen] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState<any | null>(null)
    const [confirmState, setConfirmState] = useState<{
        title: string
        message: string
        confirmText?: string
        confirmButtonClass?: string
        onConfirm?: () => void
    } | null>(null)

    const [sortConfig, setSortConfig] = useState({
        field: "createdAt",
        order: "desc",
    });

    const [filters, setFilters] = useState({
        category: "all",
        status: "all",
        location: "all",
        attendees: "all",
        search: "",
        eventStatus: "all"
    });

    const categories = new Set(eventsData.map((item) => item.category))

    // Fetch events
    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const res = await getAllEvents()
                if (res.success) {
                    setEventsData(res.data || [])
                }
            } catch (e) {
                console.log("events fetch error: ", e)
            } finally {
                setLoading(false);
            }
        })()
    }, [])

    function getEventStatus(startDate: string, endDate: string) {
        const now = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (end < now) return "past";
        if (start > now) return "upcoming";
        return "ongoing";
    }

    const filteredEvents = eventsData.filter((event) => {
        if (filters.category !== "all" && event.category !== filters.category)
            return false;

        if (filters.status !== "all") {
            const status = getEventStatus(event.startDate, event.endDate);
            if (status !== filters.status) return false;
        }

        if (filters.eventStatus !== "all") {
            if (event.status !== filters.eventStatus) return false;
        }

        if (
            filters.location !== "all" &&
            !event.location.toLowerCase().includes(filters.location.toLowerCase())
        )
            return false;

        if (filters.attendees !== "all") {
            const num = Number(event.attendees || 0);
            if (filters.attendees === "small" && num >= 10000) return false;
            if (filters.attendees === "medium" && (num < 10000 || num > 50000)) return false;
            if (filters.attendees === "large" && num <= 50000) return false;
        }

        if (filters.search && !event.title.toLowerCase().includes(filters.search.toLowerCase()))
            return false;

        return true;
    });

    const sortedEvents = [...filteredEvents].sort((a, b) => {
        const { field, order } = sortConfig;

        let valueA = a[field];
        let valueB = b[field];

        if (field === "createdAt" || field === "updatedAt") {
            valueA = Number(valueA || 0);
            valueB = Number(valueB || 0);
        }

        if (field === "startDate" || field === "bookingDeadline") {
            valueA = valueA ? new Date(valueA).getTime() : 0;
            valueB = valueB ? new Date(valueB).getTime() : 0;
        }

        if (field === "title") {
            valueA = valueA?.toLowerCase() || "";
            valueB = valueB?.toLowerCase() || "";
        }

        if (valueA < valueB) return order === "asc" ? -1 : 1;
        if (valueA > valueB) return order === "asc" ? 1 : -1;
        return 0;
    });

    // ------------------------
    // CREATE OR UPDATE EVENT
    // ------------------------
    async function handleSubmit(data: any, updatedAt: any) {
        setLoading(true)

        if (selectedEvent) {
            // EDIT MODE — use slug as the identifier
            const res = await updateEventBySlug(selectedEvent.slug, data)

            if (res.success) {
                setEventsData((prev) =>
                    prev.map((item) =>
                        item.slug === selectedEvent.slug
                            ? {
                                ...item,
                                ...data,
                                updatedAt,
                                // if the title changed the slug may have changed too
                                slug: res.newSlug ?? item.slug,
                                id: res.newSlug ?? item.slug,
                            }
                            : item
                    )
                )
            } else {
                alert(res.message)
            }
        } else {
            // CREATE MODE
            const res = await createEvent(data)

            if (res.success) {
                setEventsData((prev) => [
                    ...prev,
                    { id: res.slug, slug: res.slug, ...data },
                ])
            } else {
                // Show slug conflict or other errors to the user
                alert(res.message)
            }
        }

        setLoading(false)

        if (!selectedEvent) {
            setModalOpen(false)
        } else {
            setModalOpen(false)
            setSelectedEvent(null)
        }
    }

    // ------------------------
    // DELETE EVENT
    // ------------------------
    async function onEventDelete(event: any) {
        setConfirmState({
            title: "Delete Event",
            message: `Are you sure you want to delete "${event.title}"? This action cannot be undone.`,
            confirmText: "Delete",
            confirmButtonClass: "bg-red-600 hover:bg-red-700",
            onConfirm: async () => {
                try {
                    setLoading(true)

                    // Use slug instead of id
                    const res = await deleteEventBySlug(event.slug)

                    if (res.success) {
                        setEventsData((prev) =>
                            prev.filter((item) => item.slug !== event.slug)
                        )
                    }
                } finally {
                    setLoading(false)
                    setConfirmState(null)
                }
            },
        })
    }

    function toggleSortOrder() {
        setSortConfig((prev) => ({
            ...prev,
            order: prev.order === "asc" ? "desc" : "asc",
        }));
    }

    function formatTimestamp(timestamp?: number) {
        if (!timestamp) return ""
        return new Date(Number(timestamp)).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    function handleExportCSV() {
        if (!eventsData.length) return

        const headers = [
            "slug",
            "category",
            "title",
            "startDate",
            "endDate",
            "location",
            "attendees",
            "bookingDeadline",
            "createdAt",
            "updatedAt",
        ]

        const rows = eventsData.map((event) => {
            return headers
                .map((header) => {
                    let value = event[header]

                    if (header === "createdAt" || header === "updatedAt") {
                        value = formatTimestamp(value)
                    }

                    if (header === "startDate" || header === "endDate") {
                        value = value
                            ? new Date(value).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                            })
                            : ""
                    }

                    return `"${value || ""}"`
                })
                .join(",")
        })

        const csvContent = headers.join(",") + "\n" + rows.join("\n")
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")

        link.href = url
        link.setAttribute("download", `Verlux Stands Events ${new Date().toDateString()}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    async function handleImportCSV(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        const text = await file.text()
        const lines = text.split("\n").filter(Boolean)
        const headers = lines[0].split(",")

        const importedEvents = lines.slice(1).map((line) => {
            const values = line.split(",")
            const event: any = {}
            headers.forEach((header, index) => {
                event[header.replace(/"/g, "")] = values[index]?.replace(/"/g, "") || ""
            })
            return event
        })

        const validEvents = importedEvents.filter(
            (e) => e.title && e.startDate && e.endDate
        )

        for (const event of validEvents) {
            const res = await createEvent(event)
            // Skip duplicates silently during bulk import
            if (!res.success) {
                console.warn(`Skipped "${event.title}": ${res.message}`)
            }
        }

        // Refresh from DB to get accurate slugs
        const res = await getAllEvents()
        if (res.success) setEventsData(res.data || [])
    }

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <AdminSidebar />
                <main className="flex-1 items-center justify-center flex flex-col">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    <span>Loading events...</span>
                </main>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background flex justify-start max-h-[80vh] overflow-hidden">
            <AdminSidebar />


            <AddEvent
                isOpen={isModalOpen}
                onClose={() => {
                    setModalOpen(false)
                    setSelectedEvent(null)
                }}
                onSubmit={handleSubmit}
                isEditMode={!!selectedEvent}
                event={selectedEvent}
            />

            <ConfirmModal
                isOpen={!!confirmState}
                title={confirmState?.title}
                message={confirmState?.message}
                confirmText={confirmState?.confirmText}
                confirmButtonClass={confirmState?.confirmButtonClass}
                onConfirm={confirmState?.onConfirm}
                onClose={() => setConfirmState(null)}
            />


            <main className="w-full p-2 md:p-8 lg:p-8 lg:pt-0 overflow-y-auto">
                <div className="mb-3 pt-4">
                    <div className="flex items-center justify-between w-full">
                        <div>
                            <h1 className="text-3xl font-serif text-foreground">
                                <AdminSidebarToggleButton />
                                Verlux Events
                            </h1>
                            <p>Manage your past and upcoming events here</p>
                        </div>

                        <div className="flex relative bg-primary rounded">
                            <button
                                onClick={() => {
                                    setSelectedEvent(null)
                                    setModalOpen(true)
                                }}
                                className="flex gap-1 items-center border-e p-2 px-2 border-yellow-300 hover:bg-yellow-500 rounded"
                            >
                                <Plus className="w-4 h-4" />
                                New
                            </button>

                            <button
                                className="p-2 hover:bg-yellow-500 rounded"
                                onClick={() => setIsExportOpen((prev) => !prev)}
                            >
                                <ChevronDown className="w-5 h-5" />
                            </button>

                            {isExportOpen && (
                                <div className="absolute right-0 mt-8 w-48 bg-[#111] border border-[#222] rounded shadow-lg z-50">
                                    <button
                                        onClick={() => {
                                            handleExportCSV()
                                            setIsExportOpen(false)
                                        }}
                                        className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-[#222]"
                                    >
                                        <Download size={16} />
                                        Export CSV
                                    </button>

                                    <label className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-[#222] cursor-pointer">
                                        <Upload size={16} />
                                        Import CSV
                                        <input
                                            type="file"
                                            accept=".csv"
                                            hidden
                                            onChange={handleImportCSV}
                                        />
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 mb-2 w-full sticky top-0 z-1 bg-background py-2">
                    <input
                        type="text"
                        placeholder="Search by event name..."
                        className="px-3 py-2 rounded bg-[#111] text-sm"
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />

                    <select
                        className="px-3 py-2 rounded bg-[#111] text-sm"
                        value={filters.category}
                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    >
                        <option value="all">All</option>
                        {[...categories].map((category) => (
                            <option key={category} value={category}>
                                {category.slice(0, 1).toUpperCase()}{category.slice(1)}
                            </option>
                        ))}
                    </select>

                    <select
                        className="px-3 py-2 rounded bg-[#111] text-sm"
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    >
                        <option value="all">All Status</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="past">Past</option>
                        <option value="ongoing">Ongoing</option>
                    </select>

                    <select
                        className="px-3 py-2 rounded bg-[#111] text-sm"
                        value={filters.eventStatus}
                        onChange={(e) => setFilters({ ...filters, eventStatus: e.target.value })}
                    >
                        <option value="all">All Type</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                    </select>

                    <select
                        className="px-2 py-2 rounded bg-[#111] text-sm"
                        value={filters.attendees}
                        onChange={(e) => setFilters({ ...filters, attendees: e.target.value })}
                    >
                        <option value="all">All Sizes</option>
                        <option value="small">Small (&lt;10k)</option>
                        <option value="medium">Medium (10k–50k)</option>
                        <option value="large">Large (50k+)</option>
                    </select>

                    <div className="flex items-center gap-2 bg-[#111] rounded">
                        <select
                            className="px-1 py-2 rounded bg-[#111] text-sm border-e"
                            value={sortConfig.field}
                            onChange={(e) =>
                                setSortConfig((prev) => ({ ...prev, field: e.target.value }))
                            }
                        >
                            <option value="createdAt">Created Date</option>
                            <option value="updatedAt">Updated Date</option>
                            <option value="startDate">Event Date</option>
                            <option value="bookingDeadline">Booking Deadline</option>
                            <option value="title">Title</option>
                        </select>

                        <button
                            title="Ascending or Descending"
                            onClick={toggleSortOrder}
                            className="p-2 rounded bg-[#111] hover:bg-[#222] transition"
                        >
                            {sortConfig.order === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                        </button>
                    </div>
                </div>

                {sortedEvents.length <= 0 && (
                    <div className="text-center w-full">
                        <h1 className="text-2xl mt-20 text-gray-700">No Events yet!</h1>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                    {sortedEvents.length > 0 && sortedEvents.map((item) => (
                        <EventCard
                            key={item.slug}
                            loading={loading}
                            {...item}
                            onEdit={() => {
                                setSelectedEvent(item)
                                setModalOpen(true)
                            }}
                            onDelete={() => onEventDelete(item)}
                        />
                    ))}
                </div>
            </main>
        </div>
    )
}