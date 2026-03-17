"use client"

import React, { useEffect, useState } from "react"
import EventPageBuilder from "@/components/admin/events/EventPageBuilder"
import { saveEventContent, getEventContent } from "@/lib/server/events"
import { uploadMediaFile } from "@/lib/media-client"
import { useAuth } from "@/lib/auth-context"

interface PageProps {
    params: Promise<{ slug: string[] }>
}

export default function EventContentEditor({ params }: PageProps) {
    const { slug } = React.use(params)
    const eventSlug = slug[0]
    const { user, loading: authLoading } = useAuth()

    const [initialBlocks, setInitialBlocks] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        getEventContent(eventSlug)
            .then((res) => {
                if (res.success) setInitialBlocks(res.blocks ?? [])
                else console.warn("Could not load content:", res.message)
            })
            .catch((err) => console.error("Failed to fetch event content:", err))
            .finally(() => setLoading(false))
    }, [eventSlug])

    async function uploadBlockImage(file: File) {
        const token = await user?.getIdToken()
        if (!token) {
            throw new Error("You must be signed in to upload event content images.")
        }

        return uploadMediaFile({
            token,
            file,
            scope: "shared",
            category: "Event Content Files",
            title: file.name,
            description: `Event content image for ${eventSlug}`,
        })
    }

    async function saveContent(blocks: any[]) {
        setSaving(true)
        try {
            const res = await saveEventContent(eventSlug, blocks)
            if (res.success) {
                alert("Content saved successfully")
            } else {
                alert("Error: " + res.message)
            }
        } catch (err: any) {
            alert("Error: " + (err?.message || "Failed to save content"))
        } finally {
            setSaving(false)
        }
    }

    if (loading || authLoading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#080808", color: "#666", fontSize: 14 }}>
                {authLoading ? "Checking admin session..." : "Loading content..."}
            </div>
        )
    }

    return (
        <EventPageBuilder
            initialBlocks={initialBlocks}
            onSave={saveContent}
            onUploadImage={uploadBlockImage}
            saving={saving}
        />
    )
}
