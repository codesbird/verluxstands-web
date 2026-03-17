'use client'

import { useEffect, useMemo, useState } from 'react'
import { getAllEvents } from '@/lib/server/events'
import { Search, Sparkles } from 'lucide-react'
import Link from 'next/link'
import Events from '@/components/trade-show/events'
import CTASection from '@/components/common/quick-actions'
import ContactSection from '@/components/home/contact-section'

function formatDateRange(start: string, end: string) {
  const startDate = new Date(start)
  const endDate = new Date(end)

  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
  }

  const startFormatted = startDate.toLocaleDateString('en-US', options)
  const endFormatted = endDate.toLocaleDateString('en-US', {
    ...options,
    year: 'numeric',
  })

  return `${startFormatted} - ${endFormatted}`
}

function getMonthDay(date: string) {
  const value = new Date(date)
  return {
    day: value.toLocaleString('en-US', { day: '2-digit' }),
    month: value.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
  }
}

export default function ClientEvents() {
  const [eventsData, setEventsData] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    ;(async () => {
      const res = await getAllEvents()
      if (res.success) {
        setEventsData(res.data || [])
      }
    })()
  }, [])

  const quickResults = useMemo(() => {
    const normalized = searchQuery.trim().toLowerCase()
    if (!normalized) return []

    return [...eventsData]
      .filter((item) => item.status === 'published')
      .filter((item) => String(`${item.title} ${item.startDate} ${item.location}`).toLowerCase().includes(normalized))
      .slice(0, 6)
  }, [eventsData, searchQuery])

  return (
    <div className="space-y-14">
      <div className="relative rounded-[2.25rem] border border-primary/20 bg-[radial-gradient(circle_at_top,#3b2a15_0%,#1b1712_38%,#111111_100%)] p-5 shadow-[0_28px_80px_rgba(0,0,0,0.35)] md:p-8">
        <div className="absolute rounded-[2.25rem] inset-0 bg-[linear-gradient(135deg,rgba(196,160,102,0.16),transparent_35%,transparent_65%,rgba(229,213,184,0.08))]" />
        <div className="relative">
          <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-primary/85">
                <Sparkles className="h-3.5 w-3.5" />
                Event Finder
              </div>
              <h2 className="font-serif text-3xl text-white md:text-4xl">Find the right exhibition calendar, faster</h2>
              <p className="mt-3 text-base leading-7 text-white/68">
                Search upcoming trade shows, browse event dates, and jump straight to the exhibition pages with the same Verlux premium experience used across the website.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="flex items-center gap-3 rounded-[1.4rem] border border-white/10 bg-black/25 px-4 py-4 shadow-inner shadow-black/20">
              <Search className="h-5 w-5 text-primary" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                type="search"
                className="w-full bg-transparent text-base text-white outline-none placeholder:text-white/35"
                placeholder="Search event, city, or month"
              />
            </div>

            {quickResults.length > 0 && (
              <div className="absolute left-0 right-0 top-[calc(100%+14px)] z-20 overflow-hidden rounded-[1.4rem] border border-primary/20 bg-[#171717] p-3 shadow-[0_26px_70px_rgba(0,0,0,0.38)]">
                {quickResults.map((item) => {
                  const dateParts = getMonthDay(item.startDate)
                  return (
                    <Link
                      href={`/trade-shows/${item.slug}`}
                      key={item.id}
                      className="flex items-center gap-4 rounded-[1.1rem] px-3 py-3 transition hover:bg-white/5"
                    >
                      <div className="min-w-[64px] rounded-2xl border border-primary/20 bg-black/25 px-3 py-2 text-center">
                        <div className="text-2xl font-semibold leading-none text-primary">{dateParts.day}</div>
                        <div className="mt-1 text-[11px] uppercase tracking-[0.24em] text-white/55">{dateParts.month}</div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs uppercase tracking-[0.18em] text-primary/70">{formatDateRange(item.startDate, item.endDate)}</div>
                        <div className="mt-1 truncate font-serif text-xl text-white">{item.title}</div>
                        <div className="mt-1 text-sm text-white/50">{item.location}</div>
                      </div>
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white p-2">
                        {item.image ? <img src={item.image} alt={item.title} className="max-h-full w-full object-contain" /> : null}
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <Events searchQuery={searchQuery} />

      <CTASection />
      <ContactSection />
    </div>
  )
}
