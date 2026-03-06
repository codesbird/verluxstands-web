'use client';

import { useState } from 'react';
import { Menu, X, ChevronDown, Phone, Mail } from 'lucide-react';
import Link from "next/link"


export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const navItems = [
    { label: 'HOME', href: '/' },
    // {
    //   label: 'EXHIBITION STANDS',
    //   href: '/services',
    //   submenu: ['Double Decker', 'Custom Design', 'Outdoor', 'Country Pavilion', 'Sustainable'],
    // },
    { label: 'ABOUT US', href: '/about' },
    { label: 'PORTFOLIO', href: '/portfolio' },
    { label: 'SERVICES', href: '/services' },
    { label: 'TRADE SHOWS', href: '/trade-shows' },
    {
      label: 'GLOBAL PRESENCE',
      href: '/global',
      submenu: ['India', 'Dubai','Germany','France','Italy'],
    },
    { label: 'CONTACT US', href: '/contact' },

  ];

  return (
    <header className="sticky top-0 z-40 bg-primary text-white">
      <div className="max-w-full">
        <div className="flex items-center justify-start md:justify-center h-10 px-4 sm:px-6 lg:px-8">
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center justify-center gap-1">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative group"
                onMouseEnter={() => setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={item.href}
                  className="px-4 py-2 text-sm font-bold scale-animation transition-colors whitespace-nowrap flex items-center gap-1 h-10"
                >
                  {item.label}
                  {item.submenu && <ChevronDown className="w-3 h-3" />}
                </Link>

                {/* Submenu */}
                {item.submenu && (
                  <div className="absolute overflow-hidden left-0 mt-0 w-48 bg-white text-primary rounded-b shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                    {item.submenu.map((subitem) => (
                      <Link
                        key={subitem}
                        href={`${item.href + "/" + subitem.toLowerCase()}`}
                        className="block scale-animation-short px-4 py-0 hover:bg-muted text-lg hover:bg-primary hover:text-white transition-colors"
                      >
                        {subitem}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-white me-auto"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-8 h-8" />}
          </button>
          <div className="lg:hidden flex  text-sm flex-col">
            <div className="flex items-center gap-2"><Mail size={15} /> marketing@verluxstands.com</div>
            <div className="flex items-center gap-2"><Phone size={15} />+91 758696812</div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <nav className="lg:hidden pb-4 space-y-2 px-4">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block px-4 py-2 text-white hover:bg-white/10 rounded transition-colors font-medium"
              >
                {item.label}

              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
