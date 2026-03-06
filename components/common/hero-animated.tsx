'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Award } from "lucide-react"
import { usePopup } from "@/context/popup-context"

const heroImages = [
  '/images/hero-exhibition.jpg',
  '/images/modular-stand.jpg',
  '/images/custom-design.jpg',
  '/images/outdoor-stand.jpg',
];

const heroTexts = [
  {
    title: 'WORLD-CLASS EXHIBITION STAND BUILDERS & BOOTH DESIGNERS',
    subtitle: 'Welcome to Verlux Stands, your trusted global exhibition stand builder, offering complete and innovative exhibiting solutions with excellence.',
  },
  {
    title: 'CREATIVE DESIGN & EXPERT EXECUTION',
    subtitle: 'We craft exceptional exhibition stands that amplify your brand presence and captivate audiences through innovative design and precision.',
  },
  {
    title: 'WORLDWIDE NETWORK, LOCAL EXCELLENCE',
    subtitle: 'Serving clients globally with cutting-edge designs and dedicated on-site support for all your exhibition needs.',
  },
  {
    title: 'VISION TO REALITY IN EVERY PROJECT',
    subtitle: 'Your exhibition dreams come true through our comprehensive design, manufacturing, and professional installation services.',
  },
];

const benefits = [
  { icon: '✓', title: 'Free Design', description: 'Custom designs tailored to your brand' },
  { icon: '✓', title: 'Free Estimate', description: 'Transparent pricing, no surprises' },
  { icon: '✓', title: 'No Hidden Costs', description: 'Honest and fair pricing always' },
  { icon: '✓', title: 'Best Price', description: 'Competitive rates without compromise' },
  { icon: '✓', title: 'Idea Fulfillment', description: 'Your vision becomes reality' },
  { icon: '✓', title: '24/7 Standby', description: 'Always ready to support you' },
];

export default function HeroAnimated() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayedTitle, setDisplayedTitle] = useState('');
  const [displayedSubtitle, setDisplayedSubtitle] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const { openQuotePopup } = usePopup()


  // Image slideshow
  useEffect(() => {
    const imageTimer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 8000);
    return () => clearInterval(imageTimer);
  }, []);

  // Text rotation
  useEffect(() => {
    const textTimer = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % heroTexts.length);
      setIsTyping(true);
    }, 10000);
    return () => clearInterval(textTimer);
  }, []);

  // Typing animation for title
  useEffect(() => {
    const currentText = heroTexts[currentTextIndex];
    let titleIndex = 0;

    const titleTimer = setInterval(() => {
      if (titleIndex <= currentText.title.length) {
        setDisplayedTitle(currentText.title.substring(0, titleIndex));
        titleIndex++;
      } else {
        clearInterval(titleTimer);
      }
    }, 60);

    return () => clearInterval(titleTimer);
  }, [currentTextIndex]);

  // Typing animation for subtitle
  useEffect(() => {
    const currentText = heroTexts[currentTextIndex];
    let subtitleIndex = 0;

    const subtitleTimer = setInterval(() => {
      if (subtitleIndex <= currentText.subtitle.length) {
        setDisplayedSubtitle(currentText.subtitle.substring(0, subtitleIndex));
        subtitleIndex++;
      } else {
        clearInterval(subtitleTimer);
        setIsTyping(false);
      }
    }, 50);

    return () => clearInterval(subtitleTimer);
  }, [currentTextIndex]);

  return (
    <section className="relative w-full h-kscreen min-h-screen flex items-center justify-center overfklow-hidden">
      {/* Background Image Slideshow */}
      <div className="absolute inset-0 -z-20">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <Image
              src={image}
              alt={`Exhibition stand ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 -z-10 bg-black/75" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 md:pt-0 lg:pt-0 text-center">
        {/* Main Heading with Typing Animation */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight min-h-20 text-balance">
          {displayedTitle}
          <span className="animate-pulse">|</span>
        </h1>

        {/* Subtitle with Typing Animation */}
        <p className="text-lg sm:text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed min-h-16">
          {displayedSubtitle}
          {isTyping && <span className="animate-pulse">|</span>}
        </p>

        {/* Benefits Grid */}
        <div className="flex justify-start md:justify-center flex-wrap gap-4 mb-12 px-4">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`flex items-center ${index < 5 && "md:border-e pe-2"} gap-1 max-w-xl text-white/90 text-sm hover:text-white transition-colors`}
            >
              <span className="text-xl font-bold text-white/70"><Award size={15} /></span>
              <span className="font-medium">{benefit.title}</span>
              <span className="font-medium">{benefit.icon}</span>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col mb-20 md:mb-0 lg:mb-0 sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={openQuotePopup}
            className="px-8 py-6 bg-primary hover:bg-primary/90 text-accent-foreground font-bold text-lg rounded-lg">
            Get Free Quote
          </Button>
          <Button
            variant="outline"
            className="px-8 py-6 border-2 border-white bg-black/30 text-white/80 hover:bg-white/10 font-bold text-lg rounded-lg"
          >
            View Portfolio
          </Button>
        </div>
      </div>

      {/* Image Indicator Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex ? 'bg-accent w-8' : 'bg-white/50 hover:bg-white/80'
              }`}
          />
        ))}
      </div>

    </section>
  );
}
