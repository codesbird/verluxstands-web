"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const partners = [
  {
    src: "https://www.exproglobal-europe.com/wp-content/uploads/2025/10/logo-6-1.png",
    alt: "DSI",
  },
  {
    src: "https://www.exproglobal-europe.com/wp-content/uploads/2025/10/logo-8-1.png",
    alt: "ADDVERB",
  },
  {
    src: "https://www.exproglobal-europe.com/wp-content/uploads/2025/10/logo-8-1.png",
    alt: "ADDVERB",
  },
  {
    src: "https://www.exproglobal-europe.com/wp-content/uploads/2025/10/logo-8-1.png",
    alt: "ADDVERB",
  },
  {
    src: "https://www.exproglobal-europe.com/wp-content/uploads/2025/10/logo-8-1.png",
    alt: "ADDVERB",
  },
  {
    src: "https://www.exproglobal-europe.com/wp-content/uploads/2025/10/logo-8-1.png",
    alt: "ADDVERB",
  },
  {
    src: "https://www.exproglobal-europe.com/wp-content/uploads/2025/10/logo-8-1.png",
    alt: "ADDVERB",
  },
  {
    src: "https://www.exproglobal-europe.com/wp-content/uploads/2025/10/logo-4-1.png",
    alt: "BEDFONT",
  },
  {
    src: "https://www.exproglobal-europe.com/wp-content/uploads/2025/10/logo-5-1.png",
    alt: "Partner",
  },
  {
    src: "https://www.exproglobal-europe.com/wp-content/uploads/2025/10/logo-4-1.png",
    alt: "B&S",
  },
];

export default function ServicePartners() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Detect screen size (for visible items)
  const getVisibleItems = () => {
    if (typeof window === "undefined") return 1;
    if (window.innerWidth >= 1024) return 4; // lg
    if (window.innerWidth >= 768) return 3; // md
    if (window.innerWidth >= 640) return 2; // sm
    return 1;
  };

  const [visible, setVisible] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      setVisible(getVisibleItems());
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto Slide
  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setIndex((prev) =>
        prev >= partners.length - visible ? 0 : prev + 1
      );
    }, 2500);

    return () => clearInterval(interval);
  }, [paused, visible]);

  const next = () => {
    setIndex((prev) =>
      prev >= partners.length - visible ? 0 : prev + 1
    );
  };

  const prev = () => {
    setIndex((prev) =>
      prev <= 0 ? partners.length - visible : prev - 1
    );
  };

  return (
    <div className="">
      <h3 className="mb-8 text-center font-serif text-2xl font-bold text-secondary sm:text-3xl">
        SERVICE PARTNERS
      </h3>

      <div
        className="relative max-w-6xl mx-auto"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Buttons */}
        <button
          onClick={prev}
          className="absolute -left-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-primary/25 bg-card/90 p-2 text-secondary shadow-[0_14px_30px_rgba(0,0,0,0.25)] transition-colors hover:border-primary/55 hover:text-white"
        >
          <ChevronLeft size={18} />
        </button>

        <button
          onClick={next}
          className="absolute -right-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-primary/25 bg-card/90 p-2 text-secondary shadow-[0_14px_30px_rgba(0,0,0,0.25)] transition-colors hover:border-primary/55 hover:text-white"
        >
          <ChevronRight size={18} />
        </button>

        {/* Slider */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${(index * 100) / visible}%)`,
              width: `${(partners.length * 100) / visible}%`,
            }}
          >
            {partners.map((partner, i) => (
              <div
                key={i}
                className="flex justify-center items-center px-6"
                style={{ width: `${100 / partners.length}%` }}
              >
                <div className="h-16 sm:h-20 w-32 sm:w-40 flex items-center justify-center">
                  <img
                    src={partner.src}
                    alt={partner.alt}
                    className="h-full object-contain grayscale hover:grayscale-0 transition duration-300"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
