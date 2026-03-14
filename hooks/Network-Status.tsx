"use client"

import { useEffect, useState } from "react"

export default function useOnlineStatus() {
    const [isOnline, setIsOnline] = useState<boolean | null>(null)

    useEffect(() => {
        function update() {
            setIsOnline(navigator.onLine)
        }

        // set initial value safely
        update()

        window.addEventListener("online", update)
        window.addEventListener("offline", update)

        return () => {
            window.removeEventListener("online", update)
            window.removeEventListener("offline", update)
        }
    }, [])

    return isOnline
}
