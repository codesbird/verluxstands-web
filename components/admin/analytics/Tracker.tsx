"use client"
import { useEffect } from "react"
import { usePathname } from "next/navigation"

export default function Tracker() {
    const pathname = usePathname()

    useEffect(() => {
        fetch("/api/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                slug: pathname === "/" ? "home" : pathname.replace("/", ""),
                referrer: document.referrer.includes("google") ? "google" : "direct",
                device: window.innerWidth < 768 ? "mobile" : "desktop",
            }),
        })
    }, [pathname])

    return null
}
