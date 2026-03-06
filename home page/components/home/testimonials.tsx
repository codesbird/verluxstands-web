"use client";

import { useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      content:
        "ExproGlobal exceeded our expectations with their fantastic exhibition stand design! Their creativity and professionalism were evident from start to finish. The entire process was smooth, and they delivered a high-quality stand that attracted a lot of attention at the event. We will definitely be working with them again!",
      author: "Sarah L.",
      role: "Marketing Manager",
      rating: 5,
    },
    {
      content:
        "I can't recommend ExproGlobal highly enough! Their team was great to work with, and the stand they built for us was top-notch. The attention to detail, timely execution, and commitment to meeting our requirements made a huge difference.",
      author: "John M.",
      role: "Event Coordinator",
      rating: 5,
    },
    {
      content:
        "We received so many compliments on our booth, and it certainly helped us stand out from the competition.",
      author: "David R.",
      role: "Sales Director",
      rating: 5,
    },
    {
      content:
        "They transformed our vision into reality. From concept to installation, the team showed exceptional professionalism and craftsmanship.",
      author: "Maria G.",
      role: "Brand Director",
      rating: 5,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Slide one card at a time
  const nextSlide = () => {
    if (currentIndex < testimonials.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Know directly from our customers about the impact of our exhibition stand solutions.
          </p>
        </div>

        {/* Slider */}
        <div className="relative">

          {/* Buttons */}
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white shadow-md p-2 rounded-full disabled:opacity-40 z-10"
          >
            <ChevronLeft />
          </button>

          <button
            onClick={nextSlide}
            disabled={currentIndex === testimonials.length - 1}
            className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white shadow-md p-2 rounded-full disabled:opacity-40 z-10"
          >
            <ChevronRight />
          </button>

          {/* Track */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="w-full md:w-1/2 flex-shrink-0 p-4"
                >
                  <div className="bg-card rounded-lg border border-border p-6 sm:p-8 hover:shadow-lg hover:border-accent transition-all duration-300 h-full">

                    {/* Rating */}
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-accent text-accent"
                        />
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="text-muted-foreground text-base leading-relaxed mb-6">
                      "{testimonial.content}"
                    </p>

                    {/* Author */}
                    <div className="pt-6 border-t border-border">
                      <p className="font-bold text-primary">
                        {testimonial.author}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}