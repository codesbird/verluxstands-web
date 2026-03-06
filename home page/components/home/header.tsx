'use client';

import { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const navItems = [
    { label: 'HOME', href: '#' },
    { label: 'ABOUT US', href: '#about' },
    {
      label: 'EXHIBITION STANDS',
      href: '#services',
      submenu: ['Double Decker', 'Custom Design', 'Outdoor', 'Country Pavilion', 'Sustainable'],
    },
    { label: 'PORTFOLIO', href: '#portfolio' },
    { label: 'TRADE SHOWS', href: '#' },
    {
      label: 'GLOBAL PRESENCE',
      href: '#global',
      submenu: ['Europe', 'Americas', 'Asia'],
    },
    {
      label: 'RESOURCES',
      href: '#',
      submenu: ['Blog', 'Case Studies', 'FAQ'],
    },
    { label: 'CONTACT US', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-primary text-white">
      <div className="max-w-full">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative group"
                onMouseEnter={() => setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <a
                  href={item.href}
                  className="px-4 py-4 text-sm font-bold hover:bg-white/10 transition-colors whitespace-nowrap flex items-center gap-1 h-16"
                >
                  {item.label}
                  {item.submenu && <ChevronDown className="w-3 h-3" />}
                </a>

                {/* Submenu */}
                {item.submenu && (
                  <div className="absolute left-0 mt-0 w-48 bg-white text-primary rounded-b shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pt-2">
                    {item.submenu.map((subitem) => (
                      <a
                        key={subitem}
                        href="#"
                        className="block px-4 py-3 hover:bg-muted text-sm font-medium hover:text-accent transition-colors"
                      >
                        {subitem}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-white"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
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
