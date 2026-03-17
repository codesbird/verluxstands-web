'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePopup } from '@/context/popup-context'

const heroImages = ['/images/golden-background.jpg']

const benefits = [
  'Free Design',
  'Free Estimate',
  'No Hidden Costs',
  'Best Price',
  'Idea Fulfillment',
  '24/7 Standby',
]

export default function HeroAnimated() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { openQuotePopup } = usePopup()

  useEffect(() => {
    const imageTimer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
    }, 8000)

    return () => clearInterval(imageTimer)
  }, [])

  return (
    <section className="relative">
      <div className="mx-auto w-full overflow-hidden rounded-[1.75rem]k">
        <div className="relative isolate min-h-[620px] overflow-hidden px-4 py-10 sm:px-8 lg:px-12 lg:py-5">
          <div className="absolute inset-0 -z-20">
            {heroImages.map((image, index) => (
              <div key={image} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}>
                <Image src={image} alt="Exhibition stand environment" fill className="object-cover" priority={index === 0} />
              </div>
            ))}
          </div>

          <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(8,8,8,0.65),rgba(8,8,8,0.72)),radial-gradient(circle_at_top,rgba(196,160,102,0.18),transparent_38%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px brand-divider" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px brand-divider" />

          <div className="mx-auto flex max-h-screen pt-5 max-w-5xl flex-col items-center justify-center text-center">

            <h1 className="max-w-4xl text-3xl font-bold leading-[1.1] text-white sm:text-5xl lg:text-[4.2rem]">
              World-Class <span className="brand-gold-text">Exhibition</span>
              <br />
              Stand Builders &
              <br />
              <span className="brand-gold-text">Booth Designers</span>
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-8 text-white/82 sm:text-lg lg:text-[1.18rem]">
              Welcome to Verlux Stands, your trusted global exhibition stand builder, offering complete and innovative exhibiting solutions with excellence.
            </p>

            <div className="mt-5 flex flex-col items-center gap-4 sm:flex-row">
              <Button onClick={openQuotePopup} size="lg" className="min-w-[240px]">
                Request a Free Quote
              </Button>
              <Button asChild variant="outline" size="lg" className="min-w-[240px]">
                <Link href="/contact">Speak to Our Team</Link>
              </Button>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm text-white/80">
              {benefits.map((benefit, index) => (
                <div key={benefit} className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary" />
                  <span>{benefit}</span>
                  {index < benefits.length - 1 && <span className="hidden text-primary/50 md:inline">|</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
