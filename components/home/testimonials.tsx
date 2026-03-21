"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "We were impressed with the creativity and attention to detail. The booth design perfectly reflected our brand and attracted a lot of visitors at the event.",
    name: "Marketing Manager",
    designation: "Mangalam Ornaments",
    image: "/live/testimonials/mangalam-ornaments.jpg",
  },
  {
    quote:
      "The team delivered exactly what we wanted - modern, functional, and eye-catching. Our booth stood out among competitors and brought us great leads.",
    name: "Director",
    designation: "Forever Forest",
    image: "/live/testimonials/forever-forest.jpg",
  },
  {
    quote:
      "From design to execution, everything was smooth and professional. The booth was not only beautiful but also practical for our team's needs.",
    name: "CEO",
    designation: "DD Jewellers",
    image: "/live/testimonials/dd-jewellers.jpg",
  },
  {
    quote:
      "Excellent service and great communication throughout the project. They understood our vision and brought it to life beyond expectations.",
    name: "Event Coordinator",
    designation: "The Indian Essence",
    image: "/live/testimonials/the-indian-essence.jpg",
  },
  {
    quote:
      "We received so many compliments on our booth! It truly made an impact and gave us the professional presence we were aiming for.",
    name: "Sales Head",
    designation: "DYNA",
    image: "/live/testimonials/dyna.png",
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const active = testimonials[currentIndex];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-16 sm:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-4">
            What our clients says
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Know directly from our customers about the impact of our exhibition stand solutions.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-primary/20 bg-black/20 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="relative mx-auto w-full max-w-sm">
              <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_top,rgba(196,160,102,0.28),transparent_60%)]" />
              <div className="relative overflow-hidden rounded-[2rem] border border-primary/20 bg-black/30 p-3">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem]">
                  <Image
                    src={active.image}
                    alt={active.designation}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 28rem, 100vw"
                  />
                </div>
              </div>
            </div>

            <div className="relative">
              <Quote className="h-10 w-10 text-primary/70" />
              <div className="mt-5 flex gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-5 w-5 fill-primary text-primary" />
                ))}
              </div>
              <p className="mt-6 text-lg leading-8 text-foreground/84 sm:text-xl">
                "{active.quote}"
              </p>
              <div className="mt-8 border-t border-primary/15 pt-6">
                <div className="text-2xl font-semibold text-secondary">{active.name}</div>
                <div className="mt-1 text-sm uppercase tracking-[0.35em] text-primary">
                  {active.designation}
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between gap-4">
                <div className="flex gap-2">
                  {testimonials.map((testimonial, index) => (
                    <button
                      key={testimonial.designation}
                      type="button"
                      onClick={() => setCurrentIndex(index)}
                      className={`h-2.5 rounded-full transition-all ${index === currentIndex ? 'w-10 bg-primary' : 'w-2.5 bg-primary/30'}`}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={prevSlide}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/25 bg-black/35 text-primary transition-colors hover:bg-primary hover:text-black"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={nextSlide}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/25 bg-black/35 text-primary transition-colors hover:bg-primary hover:text-black"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
