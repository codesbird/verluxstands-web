"use server"

import { adminDB, isAdminInitialized } from "../firebase-admin"

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
    status: string
    createdAt?: number
    updatedAt?: number
}

// ─── Slug Utilities ────────────────────────────────────────────────────────────

/**
 * Converts a title into a URL-friendly slug.
 * e.g. "My Cool Event!" → "my-cool-event"
 */
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")   // remove special chars
        .replace(/\s+/g, "-")            // spaces → hyphens
        .replace(/-+/g, "-")             // collapse multiple hyphens
}

/**
 * Checks if a slug is already taken.
 * Returns an error message if it is, or null if it's free.
 */
async function checkSlugConflict(slug: string, excludeSlug?: string): Promise<string | null> {
    if (excludeSlug && slug === excludeSlug) return null  // same event, no conflict

    const snapshot = await adminDB!.ref(`events/${slug}`).get()

    if (snapshot.exists()) {
        return `An event with this name already exists. Please use a different title.`
    }

    return null
}

// ─── CRUD Actions ──────────────────────────────────────────────────────────────

export const createEvent = async (data: EventData) => {
    try {
        console.log("Firebase received event data:", data)

        if (!isAdminInitialized || !adminDB) {
            throw new Error("Firebase Admin is not initialized.")
        }

        if (!data.category || !data.title || !data.startDate || !data.endDate || !data.location) {
            throw new Error("Missing required event fields.")
        }

        // Generate slug and check for conflicts
        const slug = generateSlug(data.title)
        const conflict = await checkSlugConflict(slug)
        if (conflict) {
            return { success: false, message: conflict }
        }

        // Use slug as the Firebase key instead of a push() ID
        const eventRef = adminDB.ref(`events/${slug}`)

        const eventPayload: EventData = {
            id: slug,           // keep id in sync with the key for convenience
            slug,
            category: data.category,
            title: data.title,
            startDate: data.startDate,
            endDate: data.endDate,
            location: data.location,
            attendees: data.attendees || "",
            bookingDeadline: data.bookingDeadline || "",
            createdAt: Date.now(),
            image: data.image,
            status: data.status,
        }

        console.log("Saving event payload:", eventPayload)

        await eventRef.set(eventPayload)

        console.log("Event created successfully with slug:", slug)

        return {
            success: true,
            message: "Event created successfully.",
            slug,              // return slug so the caller can build a URL
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
            id: key,    // always expose the Firebase key as id
        }))

        // Optional: sort by newest first
        // eventsArray.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))

        return { success: true, data: eventsArray }

    } catch (error: any) {
        console.error("Error fetching events:", error)

        return {
            success: false,
            message: error?.message || "Failed to fetch events",
        }
    }
}

/**
 * Fetch a single event by its slug.
 * This is O(1) because the slug IS the Firebase key.
 */
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
    newSlug?: string        // present when the title (and therefore slug) changed
}> {
    try {
        if (!adminDB) throw new Error("Firebase Admin not initialized")
        if (!slug) throw new Error("Slug is required")

        const eventRef = adminDB.ref(`events/${slug}`)
        const snapshot = await eventRef.get()

        if (!snapshot.exists()) throw new Error("Event not found")

        let targetSlug = slug

        // If the title changed we need to re-derive the slug
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

        const updatePayload: Partial<EventData> = {
            ...data,
            slug: targetSlug,
            id: targetSlug,
            updatedAt: Date.now(),
        }

        if (targetSlug !== slug) {
            // Move data to the new key and delete the old one
            const oldData: EventData = snapshot.val()
            const newEventRef = adminDB.ref(`events/${targetSlug}`)

            await newEventRef.set({ ...oldData, ...updatePayload })
            await eventRef.remove()

            console.log(`Event moved from slug "${slug}" → "${targetSlug}"`)
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

        // Verify the event actually exists first
        const eventSnapshot = await adminDB.ref(`events/${slug}`).get()
        if (!eventSnapshot.exists()) throw new Error("Event not found")

        // Store content separately under event-content/<slug>
        // This keeps it decoupled from the event metadata
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