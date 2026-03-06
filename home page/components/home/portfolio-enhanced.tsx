'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function PortfolioEnhanced() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const portfolioItems = [
    {
      title: 'Kuwait Airport',
      image: 'https://www.exproglobal-europe.com/wp-content/uploads/2025/12/YUNNAN-AIRPORT.jpg',
    },
    {
      title: 'Modern Interior',
      image: 'https://www.exproglobal-europe.com/wp-content/uploads/2025/12/AMKA.jpg',
    },
    {
      title: 'CPTDC Exhibition',
      image: 'https://www.exproglobal-europe.com/wp-content/uploads/2025/12/CPTDC.jpg',
    },
    {
      title: 'GOGMEDI Booth',
      image: 'https://www.exproglobal-europe.com/wp-content/uploads/2025/12/Geomedi.jpg',
    },
    {
      title: 'Modern Design',
      image: 'https://www.exproglobal-europe.com/wp-content/uploads/2025/12/Oakio.jpg',
    },
    {
      title: 'Exhibition Space',
      image: 'https://www.exproglobal-europe.com/wp-content/uploads/2025/12/Summit-Group.jpg',
    },
    {
      title: 'Creative Booth',
      image: 'https://www.exproglobal-europe.com/wp-content/uploads/2025/12/SANTECTURE.jpg',
    },
    {
      title: 'Premium Stand',
      image: 'https://www.exproglobal-europe.com/wp-content/uploads/2025/12/MEDISALE.jpg',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#A02D38] mb-6">
            OUR PORTFOLIO
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
            Showcase of our most impressive exhibition stand designs and successful projects delivered across Europe
          </p>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3">
          {portfolioItems.map((item, index) => (
            <div
              key={index}
              className="relative h-64 sm:h-72 rounded-2xl overflow-hidden group cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Image */}
              <Image
                src={item.image}
                alt={item.title}
                fill
                className={`object-cover transition-all duration-500 ${
                  hoveredIndex === index ? 'scale-110 blur-sm' : 'scale-100 blur-0'
                }`}
              />

              {/* Dark Overlay */}
              <div
                className={`absolute inset-0 bg-black transition-opacity duration-300 ${
                  hoveredIndex === index ? 'opacity-40' : 'opacity-20'
                }`}
              />

              {/* Title - Always Visible */}
              <div className="absolute inset-0 flex items-end justify-start p-6">
                <h3 className="text-white text-xl sm:text-2xl font-bold">{item.title}</h3>
              </div>

              {/* Hover Icon */}
              {hoveredIndex === index && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center animate-fade-in-scale">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
