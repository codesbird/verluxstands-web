'use client'

import Link from 'next/link'

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
    year: value.toLocaleString('en-US', { year: 'numeric' }),
  }
}

interface EventsData {
  id: string
  slug?: string
  image: string
  title: string
  startDate: string
  endDate: string
  location: string
}

interface EventCardProps {
  data: EventsData
}

export default function EventCard({ data }: EventCardProps) {
  const eventDate = getMonthDay(data.startDate)
  const href = `/trade-shows/${data.slug || data.id}`

  return (
    <article className="group relative overflow-hidden rounded-[1.9rem] border border-white/8 bg-[#181818] shadow-[0_18px_45px_rgba(0,0,0,0.28)] transition duration-500 hover:-translate-y-1 hover:border-primary/35 hover:shadow-[0_30px_70px_rgba(0,0,0,0.4)]">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary/90 to-transparent opacity-60" />

      <div className="relative p-5 pb-4">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="rounded-[1.25rem] border border-primary/15 bg-black/30 px-4 py-3 text-center shadow-inner shadow-black/30">
            <div className="text-3xl font-semibold leading-none text-primary">{eventDate.day}</div>
            <div className="mt-1 text-xs uppercase tracking-[0.28em] text-white/60">{eventDate.month}</div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.22em] text-white/35">{eventDate.year}</div>
          </div>

          <Link href={href} className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[1.4rem] border border-white/10 bg-white p-3 transition duration-300 group-hover:scale-105 group-hover:border-primary/35">
            {data.image ? <img src={data.image} alt={data.title} className="max-h-full w-full object-contain" /> : null}
          </Link>
        </div>

        <div className="rounded-[1.35rem] border border-white/7 bg-black/20 p-4">
          <div className="mb-3 inline-flex rounded-full border border-primary/20 bg-primary/12 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-primary/90">
            {formatDateRange(data.startDate, data.endDate)}
          </div>

          <h3 className="font-serif text-2xl leading-tight text-white transition-colors group-hover:text-secondary">
            <Link href={href}>{data.title}</Link>
          </h3>

          <div className="mt-4 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          <p className="mt-4 text-sm uppercase tracking-[0.18em] text-white/45">{data.location}</p>
        </div>
      </div>
    </article>
  )
}
