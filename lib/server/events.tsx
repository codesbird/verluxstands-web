"use server"

import { adminDB, isAdminInitialized } from "../firebase-admin"
import { deleteMediaFromBlob } from "./blob-media"

interface EventData {
    id?: string
    slug?: string
    category: string
    title: string
    startDate: string
    endDate: string
    location: string
    attendees?: string
    bookingDeadline?: string
    image: string
    imageMediaId?: string
    status: string
    createdAt?: number
    updatedAt?: number
}

interface EventContentBlock {
    id?: string
    type?: string
    url?: string
    mediaId?: string
    [key: string]: any
}

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
}

async function checkSlugConflict(slug: string, excludeSlug?: string): Promise<string | null> {
    if (excludeSlug && slug === excludeSlug) return null

    const snapshot = await adminDB!.ref(`events/${slug}`).get()

    if (snapshot.exists()) {
        return `An event with this name already exists. Please use a different title.`
    }

    return null
}

function extractBlockMediaIds(blocks: EventContentBlock[] = []) {
    return Array.from(
        new Set(
            blocks
                .map((block) => (typeof block?.mediaId === "string" ? block.mediaId.trim() : ""))
                .filter(Boolean),
        ),
    )
}

async function deleteMediaRecordById(mediaId?: string | null) {
    if (!mediaId || !adminDB) return

    const mediaRef = adminDB.ref(`media_library/${mediaId}`)
    const snapshot = await mediaRef.get()
    if (!snapshot.exists()) return

    const file = snapshot.val() as { url?: string }
    if (file.url) {
        await deleteMediaFromBlob(file.url)
    }
    await mediaRef.remove()
}

async function getEventContentBlocks(slug: string): Promise<EventContentBlock[]> {
    if (!adminDB || !slug) return []
    const snapshot = await adminDB.ref(`event-content/${slug}`).get()
    if (!snapshot.exists()) return []
    return snapshot.val()?.blocks ?? []
}

export const createEvent = async (data: EventData) => {
    try {
        if (!isAdminInitialized || !adminDB) {
            throw new Error("Firebase Admin is not initialized.")
        }

        if (!data.category || !data.title || !data.startDate || !data.endDate || !data.location) {
            throw new Error("Missing required event fields.")
        }

        const slug = generateSlug(data.title)
        const conflict = await checkSlugConflict(slug)
        if (conflict) {
            return { success: false, message: conflict }
        }

        const eventRef = adminDB.ref(`events/${slug}`)

        const eventPayload: EventData = {
            id: slug,
            slug,
            category: data.category,
            title: data.title,
            startDate: data.startDate,
            endDate: data.endDate,
            location: data.location,
            attendees: data.attendees || "",
            bookingDeadline: data.bookingDeadline || "",
            createdAt: Date.now(),
            updatedAt: Date.now(),
            image: data.image || "",
            imageMediaId: data.imageMediaId || "",
            status: data.status,
        }

        await eventRef.set(eventPayload)

        return {
            success: true,
            message: "Event created successfully.",
            slug,
        }

    } catch (error: any) {
        console.error("Error creating event:", error)

        return {
            success: false,
            message: error?.message || "Failed to create event.",
        }
    }
}

export async function getAllEvents(): Promise<{
    success: boolean
    data?: EventData[]
    message?: string
}> {
    try {
        if (!adminDB) {
            throw new Error("Firebase Admin not initialized")
        }

        const snapshot = await adminDB.ref("events").once("value")

        if (!snapshot.exists()) {
            return { success: true, data: [] }
        }

        const eventsObject = snapshot.val()

        const eventsArray: EventData[] = Object.keys(eventsObject).map((key) => ({
            ...eventsObject[key],
            id: key,
        }))

        return { success: true, data: eventsArray }

    } catch (error: any) {
        console.error("Error fetching events:", error)

        return {
            success: false,
            message: error?.message || "Failed to fetch events",
        }
    }
}

export async function getEventBySlug(slug: string): Promise<{
    success: boolean
    message: string
    data: EventData | null
}> {
    try {
        if (!adminDB) throw new Error("Firebase Admin not initialized")
        if (!slug) throw new Error("Slug is required")

        const snapshot = await adminDB.ref(`events/${slug}`).get()

        if (!snapshot.exists()) {
            return { success: false, message: "Event not found", data: null }
        }

        return {
            success: true,
            message: "",
            data: snapshot.val() as EventData,
        }

    } catch (error: any) {
        return {
            success: false,
            message: error?.message || "Failed to fetch event",
            data: null,
        }
    }
}

export async function deleteEventBySlug(slug: string): Promise<{
    success: boolean
    message: string
}> {
    try {
        if (!adminDB) throw new Error("Firebase Admin not initialized")
        if (!slug) throw new Error("Slug is required")

        const eventRef = adminDB.ref(`events/${slug}`)
        const snapshot = await eventRef.get()

        if (!snapshot.exists()) throw new Error("Event not found")

        const event = snapshot.val() as EventData
        const blocks = await getEventContentBlocks(slug)
        const blockMediaIds = extractBlockMediaIds(blocks)

        await Promise.all([
            deleteMediaRecordById(event.imageMediaId),
            ...blockMediaIds.map((mediaId) => deleteMediaRecordById(mediaId)),
        ])

        await adminDB.ref(`event-content/${slug}`).remove()
        await eventRef.remove()

        return { success: true, message: "Event deleted successfully" }

    } catch (error: any) {
        console.error("Delete event error:", error)

        return {
            success: false,
            message: error?.message || "Failed to delete event",
        }
    }
}

export async function updateEventBySlug(
    slug: string,
    data: Partial<EventData>
): Promise<{
    success: boolean
    message: string
    data: Partial<EventData> | null
    newSlug?: string
}> {
    try {
        if (!adminDB) throw new Error("Firebase Admin not initialized")
        if (!slug) throw new Error("Slug is required")

        const eventRef = adminDB.ref(`events/${slug}`)
        const snapshot = await eventRef.get()

        if (!snapshot.exists()) throw new Error("Event not found")

        const oldData = snapshot.val() as EventData
        let targetSlug = slug

        if (data.title) {
            const baseSlug = generateSlug(data.title)

            if (baseSlug !== slug) {
                const conflict = await checkSlugConflict(baseSlug, slug)
                if (conflict) {
                    return { success: false, message: conflict, data: null }
                }
                targetSlug = baseSlug
            }
        }

        const nextImageMediaId = Object.prototype.hasOwnProperty.call(data, "imageMediaId")
            ? (data.imageMediaId || "")
            : (oldData.imageMediaId || "")

        const updatePayload: Partial<EventData> = {
            ...data,
            slug: targetSlug,
            id: targetSlug,
            image: Object.prototype.hasOwnProperty.call(data, "image") ? (data.image || "") : (oldData.image || ""),
            imageMediaId: nextImageMediaId,
            updatedAt: Date.now(),
        }

        if ((oldData.imageMediaId || "") && oldData.imageMediaId !== nextImageMediaId) {
            await deleteMediaRecordById(oldData.imageMediaId)
        }

        if (targetSlug !== slug) {
            const newEventRef = adminDB.ref(`events/${targetSlug}`)
            await newEventRef.set({ ...oldData, ...updatePayload })
            await eventRef.remove()

            const contentSnapshot = await adminDB.ref(`event-content/${slug}`).get()
            if (contentSnapshot.exists()) {
                await adminDB.ref(`event-content/${targetSlug}`).set(contentSnapshot.val())
                await adminDB.ref(`event-content/${slug}`).remove()
            }
        } else {
            await eventRef.update(updatePayload)
        }

        return {
            success: true,
            message: "Event updated successfully",
            data: updatePayload,
            ...(targetSlug !== slug && { newSlug: targetSlug }),
        }

    } catch (error: any) {
        return {
            success: false,
            message: error?.message || "Failed to update event",
            data: null,
        }
    }
}

export async function saveEventContent(slug: string, content: object[]): Promise<{
    success: boolean
    message: string
}> {
    try {
        if (!adminDB) throw new Error("Firebase Admin not initialized")
        if (!slug) throw new Error("Slug is required")

        const eventSnapshot = await adminDB.ref(`events/${slug}`).get()
        if (!eventSnapshot.exists()) throw new Error("Event not found")

        const existingBlocks = await getEventContentBlocks(slug)
        const previousMediaIds = extractBlockMediaIds(existingBlocks)
        const nextMediaIds = extractBlockMediaIds(content as EventContentBlock[])
        const removedMediaIds = previousMediaIds.filter((mediaId) => !nextMediaIds.includes(mediaId))

        await Promise.all(removedMediaIds.map((mediaId) => deleteMediaRecordById(mediaId)))

        await adminDB.ref(`event-content/${slug}`).set({
            blocks: content,
            updatedAt: Date.now(),
        })

        return {
            success: true,
            message: "Event content saved successfully",
        }

    } catch (error: any) {
        return {
            success: false,
            message: error?.message || "Failed to save the content",
        }
    }
}

export async function getEventContent(slug: string): Promise<{
    success: boolean
    message: string
    blocks: object[]
}> {
    try {
        if (!adminDB) throw new Error("Firebase Admin not initialized")
        if (!slug) throw new Error("Slug is required")

        const snapshot = await adminDB.ref(`event-content/${slug}`).get()

        return {
            success: true,
            message: "",
            blocks: snapshot.exists() ? snapshot.val().blocks ?? [] : [],
        }

    } catch (error: any) {
        return {
            success: false,
            message: error?.message || "Failed to fetch content",
            blocks: [],
        }
    }
}

export async function deleteEventContent(slug: string): Promise<{
    success: boolean
    message: string
}> {
    try {
        if (!adminDB) throw new Error("Firebase Admin not initialized")
        if (!slug) throw new Error("Slug is required")

        const blocks = await getEventContentBlocks(slug)
        const mediaIds = extractBlockMediaIds(blocks)
        await Promise.all(mediaIds.map((mediaId) => deleteMediaRecordById(mediaId)))

        await adminDB.ref(`event-content/${slug}`).remove()

        return {
            success: true,
            message: "Event content deleted",
        }

    } catch (error: any) {
        return {
            success: false,
            message: error?.message || "Failed to delete content",
        }
    }
}
