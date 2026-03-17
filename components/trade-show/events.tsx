'use client'

import { useEffect, useMemo, useState } from 'react'
import { getAllEvents } from '@/lib/server/events'
import EventCard from '@/components/trade-show/event-card'

function sortEvents(events: any[]) {
  const now = Date.now()

  return [...events].sort((a, b) => {
    const aStart = new Date(a.startDate).getTime()
    const bStart = new Date(b.startDate).getTime()
    const aEnd = new Date(a.endDate).getTime()
    const bEnd = new Date(b.endDate).getTime()

    if (aStart > now && bStart > now) return aStart - bStart
    if (aStart > now) return -1
    if (bStart > now) return 1

    const aOngoing = aStart <= now && aEnd >= now
    const bOngoing = bStart <= now && bEnd >= now

    if (aOngoing && !bOngoing) return -1
    if (!aOngoing && bOngoing) return 1

    return bEnd - aEnd
  })
}

export default function Events({ searchQuery = '' }: { searchQuery?: string }) {
  const [eventsData, setEventsData] = useState<any[]>([])

  useEffect(() => {
    ;(async () => {
      const res = await getAllEvents()
      if (res.success) {
        setEventsData(res.data || [])
      }
    })()
  }, [])

  const filteredEvents = useMemo(() => {
    const normalized = searchQuery.trim().toLowerCase()
    return sortEvents(eventsData)
      .filter((event) => event.status === 'published')
      .filter((event) => {
        if (!normalized) return true
        return String(`${event.title} ${event.location} ${event.startDate}`).toLowerCase().includes(normalized)
      })
  }, [eventsData, searchQuery])

  if (filteredEvents.length === 0) {
    return (
      <div className="rounded-[2rem] border border-white/10 bg-black/20 px-8 py-16 text-center text-white/60">
        No trade shows matched your search.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
      {filteredEvents.map((event, index) => (
        <div key={`${event.id}-${index}`} className="transition-transform duration-500" style={{ transitionDelay: `${index * 40}ms` }}>
          <EventCard data={event} />
        </div>
      ))}
    </div>
  )
}
