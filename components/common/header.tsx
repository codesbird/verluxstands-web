'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronDown } from 'lucide-react'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Services', href: '/services' },
  { label: 'Trade Shows', href: '/trade-shows' },
  {
    label: 'Global Presence',
    href: '/global',
    submenu: ['India', 'Dubai', 'Germany', 'France', 'Italy'],
  },
  { label: 'Contact Us', href: '/contact' },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-primary/5 via-black/40 to-black/30 text-white gradient-border">
      <div className="max-w-full">
        <div className="flex hidden md:flex lg:flex items-center justify-start md:justify-center h-7 px-4 sm:px-6 lg:px-8">
          {/* Desktop Navigation */}
          <nav className="flex items-center justify-center gap-1">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative group"
                onMouseEnter={() => setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={`px-4 py-2 text-sm font-bold hover:border-b-3 hover:border-primary transition-colors whitespace-nowrap flex items-center gap-1 h-10 ${item.href === pathname && 'border-b-3 border-primary'}`}
                >
                  {item.label}
                  {item.submenu && <ChevronDown className="w-3 h-3" />}
                </Link>

                {item.submenu && openDropdown === item.label && (
                  <div className="brand-panel absolute left-0 top-full mt-1 font-semibold w-56 overflow-hidden rounded-sm border border-primary/25 py-2 shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
                    {item.submenu.map((subitem) => (
                      <Link
                        key={subitem}
                        href={`${item.href}/${subitem.toLowerCase()}`}
                        className="block px-4 py-2.5 text-sm uppercase tracking-[0.12em] text-white/60 transition-colors hover:bg-primary/30 hover:text-white"
                      >
                        {subitem}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
            )}
          </nav>

        </div>

        <div className="flex items-center justify-between px-2 lg:hidden md:hidden">
          <button
            onClick={() => setIsOpen((value) => !value)}
            className="inline-flex items-center justify-center rounded-sm border border-primary/25 bg-card/70 p-2 text-secondary transition-colors hover:border-primary/60 hover:text-white"
            aria-label="Toggle navigation"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <div className="text-right text-[11px] uppercase tracking-[0.2em] text-secondary/70">
            <div>Verlux Stands</div>
            <div className="mt-1 text-[10px] tracking-[0.28em] text-secondary/45">Global Stand Design</div>
          </div>
        </div>

        {isOpen && (
          <nav className="grid gap-1 border-t border-primary/15 px-2 pb-3 pt-2 lg:hidden">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`rounded-sm px-4 py-3 text-sm uppercase tracking-[0.14em] transition-colors ${pathname === item.href ? 'bg-primary/12 text-secondary' : 'text-foreground/80 hover:bg-primary/8 hover:text-white'}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}

