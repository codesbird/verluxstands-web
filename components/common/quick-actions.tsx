import React, { type ReactNode } from 'react'
import { ArrowRight } from "lucide-react"

export const CTAButton = ({ children }: { children: ReactNode }) => {
  return (
    <button className="brand-button-dark group relative overflow-hidden rounded-sm px-6 py-3">
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-120%] transition-transform duration-700 ease-out group-hover:translate-x-[120%]" />
      <span className="relative z-10 flex items-center gap-2">
        {children}
        <span className="transition-transform duration-300 group-hover:translate-x-1"><ArrowRight size={20} /></span>
      </span>
    </button>
  )
}

const CTASection = () => {
  return (
    <div className="px-6 py-8 md:px-10">
      <div
        className="brand-shell brand-actions relative h-52 overflow-hidden rounded-[1.75rem] md:h-48"
        style={{
          backgroundImage:
            'url(https://www.exproglobal-europe.com/wp-content/uploads/2025/10/Italy-img.jpg)',
        }}
      >
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(8,8,8,0.65),rgba(8,8,8,0.72)),radial-gradient(circle_at_top,rgba(196,160,102,0.18),transparent_38%)]" />

        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-4 px-6 md:flex-row md:justify-around">
          <CTAButton>Get Free Design</CTAButton>
          <CTAButton>Request Quote</CTAButton>
          <CTAButton>Request a Callback</CTAButton>
        </div>
      </div>
    </div>
  )
}

export default CTASection
