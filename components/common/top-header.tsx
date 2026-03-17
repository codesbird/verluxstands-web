'use client'

import Link from 'next/link'
import { Mail, Phone, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePopup } from '@/context/popup-context'

export default function TopHeader() {
  const { openBrochurePopup, openQuotePopup } = usePopup()

  return (
    <div className="relative z-40">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-t-[1.75rem] rounded-b-none border-b-0 px-4 py-2 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 flex-col items-start justify-center leading-none text-secondary transition-colors hover:text-white">
          <span className="font-serif text-3xl font-bold tracking-[0.2em] sm:text-4xl">VERLUX</span>
          <span className="mt-1 flex items-center gap-2 text-[11px] uppercase tracking-[0.45em] text-secondary/80 sm:text-xs">
            <span className="h-px w-7 bg-primary/50" />
            STANDS
            <span className="h-px w-7 bg-primary/50" />
          </span>
        </Link>

        <div className="hidden items-center gap-6 text-sm text-secondary/85 lg:flex">
          <a href="tel:+918920253275" className="flex items-center gap-2 transition-colors hover:text-white">
            <Phone className="h-4 w-4 text-primary" />
            <span>+91 8920253275</span>
          </a>
          <a href="mailto:marketing@verluxstands.com" className="hidden md:flex items-center gap-2 transition-colors hover:text-white">
            <Mail className="h-4 w-4 text-primary" />
            <span>marketing@verluxstands.com</span>
          </a>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button onClick={openQuotePopup} size="lg" className="hidden sm:inline-flex">
            Get Free Quote
          </Button>
          <Button onClick={openBrochurePopup} variant="outline" size="sm" className="hidden md:inline-flex">
            Download Brochure
          </Button>
          <Button onClick={openBrochurePopup} variant="outline" size="icon" className="md:hidden" aria-label="Download brochure">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
