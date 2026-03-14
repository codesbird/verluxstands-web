'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FileText,
  Search,
  Settings,
  LogOut,
  PlusCircle,
  MapPin,
  Layers,
  BarChart3,
  X,
  Menu,
  Calendar,
  BriefcaseBusiness,
  Inbox,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import useSidebarToggle from '@/lib/sidebar-toggle'

const navItems = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Pages',
    href: '/admin/dashboard/pages',
    icon: FileText,
  },
  {
    title: 'Events',
    href: '/admin/dashboard/events',
    icon: Calendar,
  },
  {
    title: 'Submissions',
    href: '/admin/dashboard/submissions',
    icon: Inbox,
  },
  {
    title: 'Portfolio',
    href: '/admin/dashboard/portfolios',
    icon: BriefcaseBusiness,
    pages: [
      {
        title: 'Library',
        href: '/admin/dashboard/portfolios/library',
        icon: Search,
      },
      {
        title: 'Category',
        href: '/admin/dashboard/portfolios/categories',
        icon: Search,
      },
    ],
  },
  {
    title: 'Create Page',
    href: '/admin/dashboard/create',
    icon: PlusCircle,
  },
  {
    title: 'SEO Editor',
    href: '/admin/dashboard/seo',
    icon: Search,
  },
  {
    title: 'Page Builder',
    href: '/admin/dashboard/builder',
    icon: Layers,
  },
  {
    title: 'Sitemap',
    href: '/admin/dashboard/sitemap',
    icon: MapPin,
  },
  {
    title: 'Analytics',
    href: '/admin/dashboard/analytics',
    icon: BarChart3,
    pages: [
      {
        title: 'Map View',
        href: '/admin/dashboard/analytics/mapview',
        icon: BarChart3,
      },
      {
        title: 'Insights',
        href: '/admin/dashboard/analytics/insights',
        icon: BarChart3,
      },
      {
        title: 'Ai Predictions',
        href: '/admin/dashboard/analytics/predictions',
        icon: BarChart3,
      },
    ],
  },
  {
    title: 'Settings',
    href: '/admin/dashboard/settings',
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { signOut, user } = useAuth()
  const { isOpen, toggleSidebar } = useSidebarToggle()

  return (
    <aside className={`fixed left-0 top-0 h-screen w-64 flex-col border-r border-border bg-card ${!isOpen ? 'hidden' : 'flex'} md:relative md:flex`}>
      <div className="flex items-center justify-between border-b border-border p-3 md:p-5">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary">
            <span className="text-sm font-bold text-primary-foreground">V</span>
          </div>
          <span className="font-serif text-lg text-foreground">Verlux CMS</span>
        </Link>
        <button className="md:hidden" onClick={() => toggleSidebar()}>
          <X />
        </button>
      </div>

      <nav className="relative flex-1 space-y-1 overflow-y-auto p-4">
        {navItems.map((item) => {
          const hasChildren = !!item.pages?.length
          const isExactParent = pathname === item.href
          const isChildMatch = item.pages?.some((page) => pathname === page.href)
          const isParentActive = isExactParent || isChildMatch
          const shouldExpand = hasChildren && isParentActive

          return (
            <div key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  isParentActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>

              {hasChildren && (
                <div className={cn('relative ml-3 flex flex-col gap-1 p-1 text-sm', shouldExpand ? '' : 'hidden')}>
                  {item.pages?.map((page, index) => {
                    const isActiveChild = pathname === page.href

                    return (
                      <Link
                        key={page.href}
                        href={page.href}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-2 py-1 text-sm transition-colors',
                          isActiveChild ? 'bg-primary/80 text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                        )}
                      >
                        <span className="absolute left-[-5px] top-0 z-5 w-10 rounded-full border-l borderlb border-gray-400" style={{ height: `${(index + 1) * 1.8}rem` }} />
                        {page.title}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      <div className="border-t border-border p-4">
        <div className="mb-3 px-3">
          <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
        </div>
        <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:bg-secondary hover:text-foreground" onClick={() => signOut()}>
          <LogOut className="mr-3 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  )
}

export function AdminSidebarToggleButton() {
  const { isOpen, toggleSidebar } = useSidebarToggle()

  return (
    <Button variant="ghost" className="rounded-lg p-2 md:hidden" onClick={() => toggleSidebar()}>
      {!isOpen && <Menu className="h-8 w-6" />}
    </Button>
  )
}
