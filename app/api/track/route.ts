import { NextResponse } from "next/server"
import { adminDB } from "@/lib/firebase-admin"
import crypto from "crypto"
import { headers } from "next/headers"

export async function POST(req: Request) {
    try {
        const { slug, device, referrer } = await req.json()

        const h = await headers()   // <-- FIX: await headers()

        if (slug && slug.includes("admin")) {
            return NextResponse.json({ ok: false }, { status: 403 })
        }

        const ip =
            h.get("x-forwarded-for")?.split(",")[0] ||
            h.get("x-real-ip") ||
            "unknown"

        const country = h.get("x-vercel-ip-country") || "unknown"

        const ipHash = crypto.createHash("sha256").update(ip).digest("hex")

        const today = new Date().toISOString().split("T")[0]

        const visitorKey = `analytics/visitors/${today}/${slug}/${ipHash}`

        const already = await adminDB.ref(visitorKey).get()

        if (already.exists()) {
            return NextResponse.json({ counted: false })
        }

        await adminDB.ref(visitorKey).set({
            country,
            device,
            referrer,
            at: Date.now(),
        })

        await Promise.all([
            adminDB.ref(`analytics/pages/${slug}`).transaction(n => (n || 0) + 1),
            adminDB.ref(`analytics/daily/${today}/${slug}`).transaction(n => (n || 0) + 1),
            adminDB.ref(`analytics/devices/${device}`).transaction(n => (n || 0) + 1),
            adminDB.ref(`analytics/referrers/${referrer || "direct"}`).transaction(n => (n || 0) + 1),
            adminDB.ref(`analytics/countries/${country}`).transaction(n => (n || 0) + 1),
        ])

        return NextResponse.json({ counted: true })
    } catch (err) {
        console.error("Track error", err)
        return NextResponse.json({ ok: false }, { status: 500 })
    }
}

export async function GET() {
    const data = await adminDB.ref(`analytics`).get()
    if (data.exists()) {
        return NextResponse.json({ ok: true, data: data.val() })
    }

    return NextResponse.json({ ok: false })

}