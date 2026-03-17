'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { PortfolioItem } from '@/lib/server/media-library'
import { ChevronLeft, ChevronRight, Expand, Maximize, Minimize, X } from 'lucide-react'

interface PortfolioGalleryProps {
  items: PortfolioItem[]
  eyebrow?: string
  title: string
  description: string
  ctaHref?: string
  ctaLabel?: string
  compact?: boolean
}

const ALL_CATEGORY = 'All'

export default function PortfolioGallery({
  items,
  eyebrow = 'Portfolio',
  title,
  description,
  ctaHref,
  ctaLabel,
  compact = false,
}: PortfolioGalleryProps) {
  const [mounted, setMounted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const lightboxRef = useRef<HTMLDivElement | null>(null)
  const categories = useMemo(() => [ALL_CATEGORY, ...Array.from(new Set(items.map((item) => item.category)))], [items])
  const [activeCategory, setActiveCategory] = useState<string>(ALL_CATEGORY)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const filteredItems = useMemo(() => {
    if (activeCategory === ALL_CATEGORY) {
      return items
    }
    return items.filter((item) => item.category === activeCategory)
  }, [activeCategory, items])

  const displayItems = compact ? filteredItems.slice(0, 8) : filteredItems
  const activeItem = activeIndex !== null ? displayItems[activeIndex] : null

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    if (!displayItems.length) {
      setActiveIndex(null)
      return
    }

    setActiveIndex((current) => {
      if (current === null) return null
      return Math.min(current, displayItems.length - 1)
    })
  }, [displayItems, mounted])

  useEffect(() => {
    if (!mounted) return

    function handleKey(event: KeyboardEvent) {
      if (activeIndex === null) return
      if (event.key === 'Escape') setActiveIndex(null)
      if (event.key === 'ArrowRight') setActiveIndex((current) => (current === null ? null : (current + 1) % displayItems.length))
      if (event.key === 'ArrowLeft') setActiveIndex((current) => (current === null ? null : (current - 1 + displayItems.length) % displayItems.length))
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [activeIndex, displayItems.length, mounted])

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(Boolean(document.fullscreenElement))
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  function goNext() {
    setActiveIndex((current) => (current === null ? null : (current + 1) % displayItems.length))
  }

  function goPrevious() {
    setActiveIndex((current) => (current === null ? null : (current - 1 + displayItems.length) % displayItems.length))
  }

  async function toggleFullscreen() {
    try {
      if (!document.fullscreenElement) {
        await lightboxRef.current?.requestFullscreen()
        setIsFullscreen(true)
      } else {
        await document.exitFullscreen()
        setIsFullscreen(false)
      }
    } catch {
      setIsFullscreen(Boolean(document.fullscreenElement))
    }
  }

  return (
    <section className={compact ? 'py-20' : 'py-14 md:py-18'}>
      <div className="container mx-auto px-6">
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="mb-4 text-xs uppercase tracking-[0.4em] text-primary/80">{eyebrow}</p>
            <h2 className="font-serif text-4xl text-white md:text-5xl">{title}</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/70 md:text-lg">{description}</p>
          </div>
          {ctaHref && ctaLabel ? (
            <a href={ctaHref} className="brand-button-light inline-flex items-center justify-center px-6 py-3 text-sm uppercase tracking-[0.2em]">
              {ctaLabel}
            </a>
          ) : null}
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          {categories.map((category) => {
            const active = category === activeCategory
            return (
              <button
                key={category}
                onClick={() => mounted && setActiveCategory(category)}
                className={`rounded-full border px-4 py-2 text-sm transition ${active ? 'border-primary bg-primary text-black' : 'border-white/10 bg-black/20 text-white/75 hover:border-primary/40 hover:text-white'}`}
              >
                {category}
              </button>
            )
          })}
        </div>

        {displayItems.length === 0 ? (
          <div className="rounded-[2rem] border border-white/10 bg-black/20 px-8 py-16 text-center text-white/60">
            No portfolio images uploaded for this category yet.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {displayItems.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => mounted && setActiveIndex(index)}
                className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#181818] text-left transition duration-500 hover:-translate-y-1 hover:border-primary/50"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/10 to-transparent" />
                  <div className="absolute left-5 top-5 rounded-full border border-primary/30 bg-black/35 px-3 py-2 text-[11px] uppercase tracking-[0.28em] text-primary/85 backdrop-blur">
                    {item.category}
                  </div>
                  <div className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/30 p-3 text-white/80 backdrop-blur">
                    <Expand className="h-4 w-4" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {mounted && activeItem ? (
        <div ref={lightboxRef} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
          <button
            type="button"
            onClick={() => setActiveIndex(null)}
            className="absolute right-5 top-5 rounded-full border border-white/15 bg-black/35 p-3 text-white hover:border-primary/50"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={toggleFullscreen}
            className="absolute right-20 top-5 rounded-full border border-white/15 bg-black/35 p-3 text-white hover:border-primary/50"
          >
            {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
          </button>
          <button
            type="button"
            onClick={goPrevious}
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/15 bg-black/35 p-3 text-white hover:border-primary/50 md:left-8"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/15 bg-black/35 p-3 text-white hover:border-primary/50 md:right-8"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div className="flex w-full max-w-7xl flex-col gap-4">
            <div className="flex min-h-[72vh] items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-[#111111] shadow-2xl">
              <img src={activeItem.image} alt={activeItem.title} className="max-h-[72vh] max-w-full object-contain object-center" />
            </div>
            <div className="flex items-center justify-between gap-4 rounded-[2rem] border border-white/10 bg-[#171717] px-5 py-4 text-white/80">
              <div className="text-xs uppercase tracking-[0.28em] text-primary/75">{activeItem.category}</div>
              <div className="text-xs uppercase tracking-[0.22em] text-white/45">
                {(activeIndex ?? 0) + 1} / {displayItems.length}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
