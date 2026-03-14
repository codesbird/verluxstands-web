import { Metadata } from "next"
import "./global-admin.css"
import AdminLayoutClient from "@/app/admin/layout-client"

// prevent indexing
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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminLayoutClient>
      {children}
    </AdminLayoutClient>
  )
}