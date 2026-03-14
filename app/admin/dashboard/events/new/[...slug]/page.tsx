"use client"

import React, { useState, useEffect } from "react"
import EventPageBuilder from "@/components/admin/events/EventPageBuilder"
import { saveEventContent, getEventContent } from "@/lib/server/events"

interface PageProps {
    params: Promise<{ slug: string[] }>
}

export default function EventContentEditor({ params }: PageProps) {
    const { slug } = React.use(params)
    const eventSlug = slug[0]

    const [initialBlocks, setInitialBlocks] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    // Fetch existing content once on mount
    useEffect(() => {
        getEventContent(eventSlug)
            .then((res) => {
                if (res.success) setInitialBlocks(res.blocks ?? [])
                else console.warn("Could not load content:", res.message)
            })
            .catch((err) => console.error("Failed to fetch event content:", err))
            .finally(() => setLoading(false))
    }, [eventSlug])

    async function saveContent(blocks: any[]) {
        setSaving(true)
        try {
            const res = await saveEventContent(eventSlug, blocks)
            if (res.success) {
                alert("Content saved successfully")
            } else {
                // alert() only accepts a string — can't pass a second arg
                alert("Error: " + res.message)
            }
        } catch (err: any) {
            alert("Error: " + (err?.message || "Failed to save content"))
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                minHeight: "100vh", background: "#080808", color: "#666", fontSize: 14
            }}>
                Loading content...
            </div>
        )
    }

    return (
        <EventPageBuilder
            initialBlocks={initialBlocks}
            onSave={saveContent}
            saving={saving}
        />
    )
}