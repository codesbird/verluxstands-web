type EventStatus =
    | "Upcoming"
    | "Ongoing"
    | "Completed"
    | "Cancelled"

interface EventType {
    startDate: string
    endDate: string
    isCancelled?: boolean
}

export default function getEventStatus(event: EventType): EventStatus {
    const now = new Date()
    const start = new Date(event.startDate)
    const end = new Date(event.endDate)

    console.log("the event : ",event)

    // 1️⃣ Cancelled always has highest priority
    if (event.isCancelled) {
        return "Cancelled"
    }

    // 2️⃣ Completed
    if (end < now) {
        return "Completed"
    }

    // 3️⃣ Upcoming
    if (start > now) {
        return "Upcoming"
    }

    // 4️⃣ Otherwise it's ongoing
    return "Ongoing"
}

export function getEventStatusWithStyle(event: EventType) {
    const status = getEventStatus(event)

    const styles = {
        Upcoming: "bg-blue-600",
        Ongoing: "bg-green-600",
        Completed: "bg-gray-600",
        Cancelled: "bg-red-600",
    }

    return <span className={`border p-1 px-2 rounded ${styles[status]}`}>{status}</span>
}