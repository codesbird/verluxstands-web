import { Metadata } from "next"

// Server-side metadata: prevent Google indexing of admin panel
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noarchive: true,
  },
  title: "Admin Dashboard - Verlux Stands (Private)",
  description: "Private admin dashboard - not accessible to public",
}

import AdminLayoutClient from "@/app/admin/layout-client"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>
}
