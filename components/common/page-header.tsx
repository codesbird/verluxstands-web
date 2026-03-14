"use client";

import { ArrowRight } from "lucide-react";
import { usePopup } from "@/context/popup-context"
import QuoteButton from "@/components/common/quote-button"


interface PageHeaderProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
  buttonText?: string;
}

export default function PageHeader({
  title,
  subtitle,
  backgroundImage,
  buttonText = "REQUEST QUOTE",
}: PageHeaderProps) {

  const { openBrochurePopup, openQuotePopup } = usePopup()


  return (
    <section
      className="relative py-16 flex items-center justify-center text-center text-white overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-blue-400/40"></div>

      {/* Optional Gradient Overlay (Adds Depth) */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80"></div>

      {/* Content */}
      <div className="relative z-10 px-6 max-w-4xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-wide mb-6">
          {title}
        </h1>

        <p className="text-lg sm:text-xl text-white/90 mb-8 leading-relaxed">
          {subtitle}
        </p>

        <QuoteButton
          name="Get Free Quote"
          type="button"
          className="btn-white"
          icon={<ArrowRight size={20}/>}
          iconpos="end"
        />

      </div>
    </section>
  );
}