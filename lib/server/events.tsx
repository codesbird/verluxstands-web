"use server"

import { adminDB, isAdminInitialized } from "../firebase-admin"

interface EventData {
    category: string
    title: string
    startDate: string
    endDate: string
    location: string
    attendees?: string
    bookingDeadline?: string
    image:string
}

export const createEvent = async (data: EventData) => {
    try {
        console.log("Firebase received event data:", data)

        // 1️⃣ Check Admin SDK initialization
        if (!isAdminInitialized || !adminDB) {
            throw new Error("Firebase Admin is not initialized.")
        }

        // 2️⃣ Basic validation
        if (!data.category || !data.title || !data.startDate || !data.endDate || !data.location) {
            throw new Error("Missing required event fields.")
        }

        // 3️⃣ Generate unique event ID
        const newEventRef = adminDB.ref("events").push()
        const eventId = newEventRef.key

        if (!eventId) {
            throw new Error("Failed to generate event ID.")
        }

        // 4️⃣ Prepare event object
        const eventPayload = {
            id: eventId,
            category: data.category,
            title: data.title,
            startDate: data.startDate,
            endDate: data.endDate,
            location: data.location,
            attendees: data.attendees || "",
            bookingDeadline: data.bookingDeadline || "",
            createdAt: Date.now(),
            image:data.image
        }

        console.log("data is :", eventPayload)

        // 5️⃣ Save to Firebase
        await newEventRef.set(eventPayload)

        console.log("Event created successfully:", eventId)

        return {
            success: true,
            message: "Event created successfully.",
            eventId,
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
            return {
                success: true,
                data: [],
            }
        }

        const eventsObject = snapshot.val()

        // Convert object to array
        const eventsArray: EventData[] = Object.keys(eventsObject).map((key) => ({
            id: key,
            ...eventsObject[key],
        }))

        // Optional: sort by newest first
        // eventsArray.sort((a, b) => b.createdAt - a.createdAt)

        return {
            success: true,
            data: eventsArray,
        }

    } catch (error: any) {
        console.error("Error fetching events:", error)

        return {
            success: false,
            message: error?.message || "Failed to fetch events",
        }
    }
}


export async function deleteEventById(eventId: string): Promise<{
    success: boolean
    message: string
}> {
    try {
        if (!adminDB) {
            throw new Error("Firebase Admin not initialized")
        }

        if (!eventId) {
            throw new Error("Event ID is required")
        }

        const eventRef = adminDB.ref(`events/${eventId}`)

        const snapshot = await eventRef.get()

        if (!snapshot.exists()) {
            throw new Error("Event not found")
        }

        await eventRef.remove()

        return {
            success: true,
            message: "Event deleted successfully",
        }

    } catch (error: any) {
        console.error("Delete event error:", error)

        return {
            success: false,
            message: error?.message || "Failed to delete event",
        }
    }
}

export async function updateEvent(eventId: string, data: object): Promise<{
    success: boolean
    message: string
    data: object | null
}> {

    try {

        if (!adminDB) {
            throw new Error("Firebase Admin not initialized")
        }

        if (!eventId) {
            throw new Error("Event ID is required")
        }

        const eventRef = adminDB.ref(`events/${eventId}`)

        const snapshot = await eventRef.get()

        if (!snapshot.exists()) {
            throw new Error("Event not found")
        }

        // Prevent overwriting restricted fields
        const updatePayload = {
            ...data,
            updatedAt: Date.now(),
        }

        await eventRef.update(updatePayload)

        return {
            success: true,
            message: "Event updated successfully",
            data: updatePayload
        }
    }
    catch (error: any) {
        return {
            success: false,
            message: error?.message || "Failed to delete event",
            data: null
        }
    }
}