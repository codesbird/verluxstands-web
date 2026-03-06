"use client"
import { Loader2 } from "lucide-react"
import { AdminSidebar, AdminSidebarToggleButton } from "@/components/admin/sidebar"
import { useState, useEffect } from "react"


const categories = {
    "Technology": "",
    "Automotive": "",
    "Feshion and Beauty": "",
    "Food Industry": "",
    "Healthcare": "",
    "Environment": "",
}

export default function Portfolio() {
    const [loading, setLoading] = useState(false)



    if (loading) {
        return (
            <div className="flex min-h-screen  items-center justify-center bg-background">
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
            <main className="w-full p-2 md:p-8 lg:p-8 lg:pt-0 overflow-y-auto">
                <div className="mb-3 pt-4">
                    <div className="flex items-center justify-between mb-3 w-full">
                        <div>
                            <h1 className="text-3xl font-serif text-foreground">
                                <AdminSidebarToggleButton />
                                Manage Portfolios Categories
                            </h1>
                            <p>Manage your portfolio and categoies.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}