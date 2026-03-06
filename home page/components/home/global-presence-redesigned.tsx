'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function GlobalPresenceRedesigned() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const locations = [
    {
      id: 1,
      country: 'GERMANY',
      image: 'https://www.exproglobal-europe.com/wp-content/uploads/2025/10/germany-min.jpg',
    },
    {
      id: 2,
      country: 'SPAIN',
      image: 'https://www.exproglobal-europe.com/wp-content/uploads/2025/10/Spain-imgjpg.jpg',
    },
    {
      id: 3,
      country: 'ITALY',
      image: 'https://www.exproglobal-europe.com/wp-content/uploads/2025/10/Italy-img.jpg',
    },
    {
      id: 4,
      country: 'POLAND',
      image: 'https://www.exproglobal-europe.com/wp-content/uploads/2025/10/Poland-img.jpg',
    },
    {
      id: 5,
      country: 'FRANCE',
      image: 'https://www.exproglobal-europe.com/wp-content/uploads/2025/10/France-img.jpg',
    },
    {
      id: 6,
      country: 'PORTUGAL',
      image: 'https://www.exproglobal-europe.com/wp-content/uploads/2025/10/Portugal-img.jpg',
    },
    {
      id: 7,
      country: 'ROMANIA',
      image: 'https://www.exproglobal-europe.com/wp-content/uploads/2025/10/Romania-img.jpg',
    },
    {
      id: 8,
      country: 'NETHERLANDS',
      image: 'https://www.exproglobal-europe.com/wp-content/uploads/2025/10/Netherland-min.jpg',
    },
  ];

  return (
    <section id="global" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-6 text-[#A02D38] leading-tight">
          LEADING GLOBAL EXHIBITION BOOTH DESIGN & BUILD COMPANY
        </h2>

        {/* Description */}
        <p className="text-center text-sm sm:text-base text-foreground max-w-4xl mx-auto mb-12 sm:mb-16 leading-relaxed">
          Verlux Stands is a premier exhibition booth design company offering creative, customized, and functional
          exhibiting solutions globally. With years of excellence and proven expertise as a world-class exhibition stand builder, we have established a strong reputation for delivering high-quality, tailor-made exhibition stands that help brands excel at international shows, making us the preferred exhibition stand design and build partner worldwide.
        </p>

        {/* Location Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {locations.map((location) => (
            <div
              key={location.id}
              className="relative max-h-40 sm:h-56 rounded-2xl overflow-hidden shadow-4xl group cursor-pointer"
              onMouseEnter={() => setHoveredCard(location.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Background Image */}
              <div className="relative w-full h-full">
                <Image
                  src={location.image}
                  alt={location.country}
                  fill
                  className={`object-cover transition-all duration-500 ${hoveredCard === location.id ? 'scale-100' : 'scale-110'
                    }`}
                  priority={location.id <= 4}
                />

                {/* Overlay */}
                <div className="absolute inset-0 group-hover:bg-black/10 bg-black/50  transition-colors duration-300" />
              </div>

              {/* Country Name */}
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-2xl sm:text-3xl font-bold text-white text-center px-4">
                  {location.country}
                </h3>
              </div>

              {/* Hover Effect - Icon */}
              <div
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${hoveredCard === location.id ? 'opacity-100' : 'opacity-0'
                  }`}
              >
                <div className="w-52 h-30 border-1 border-white flex items-center justify-center"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="mt-16 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-[#A02D38]/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-[#A02D38]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </div>
            <h4 className="font-bold text-primary mb-2">Multiple Facilities</h4>
            <p className="text-sm text-muted-foreground">Manufacturing centers across Europe for faster delivery</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-[#A02D38]/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-[#A02D38]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <h4 className="font-bold text-primary mb-2">Quality Assured</h4>
            <p className="text-sm text-muted-foreground">Premium materials and expert craftsmanship in every stand</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-[#A02D38]/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-[#A02D38]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
              </svg>
            </div>
            <h4 className="font-bold text-primary mb-2">Fast Delivery</h4>
            <p className="text-sm text-muted-foreground">Quick turnaround times for all exhibition stand projects</p>
          </div>
        </div>


      </div>
    </section>
  );
}
