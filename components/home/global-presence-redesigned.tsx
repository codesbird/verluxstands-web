export default function GlobalPresenceRedesigned() {
  const locations = [
    {
      id: 1,
      country: 'INDIA',
      image: 'https://www.exproglobal-europe.com/wp-content/uploads/2025/10/germany-min.jpg',
    },
    {
      id: 2,
      country: 'DUBAI',
      image: 'https://www.exproglobal-europe.com/wp-content/uploads/2025/10/Spain-imgjpg.jpg',
    },
    {
      id: 3,
      country: 'GERMANY',
      image: 'https://www.exproglobal-europe.com/wp-content/uploads/2025/10/Italy-img.jpg',
    },
    {
      id: 4,
      country: 'FRANCE',
      image: 'https://www.exproglobal-europe.com/wp-content/uploads/2025/10/Poland-img.jpg',
    },
    {
      id: 5,
      country: 'ITALY',
      image: 'https://www.exproglobal-europe.com/wp-content/uploads/2025/10/France-img.jpg',
    },
  ];

  return (
    <section id="global" className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-center mb-6 text-primary leading-tight">
          LEADING GLOBAL EXHIBITION BOOTH DESIGN & BUILD COMPANY
        </h2>

        <p className="text-center text-sm sm:text-base text-foreground max-w-4xl mx-auto mb-12 sm:mb-16 leading-relaxed">
          We supply exhibition stands in many places simultaneously thanks to our worldwide connections and in-house production capabilities. Verlux Stands specializes in complete exhibit solutions with great visibility and effect, and we are here to provide 360-degree brand promotion for exhibition and professional exhibition knowledge across Europe.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          {locations.map((location) => (
            <div
              key={location.id}
              className="relative max-h-40 sm:h-56 rounded-2xl overflow-hidden shadow-4xl group cursor-pointer"
            >
              <div
                className="relative h-full w-full bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url(${location.image})` }}
              />

              <div className="absolute inset-0 bg-black/50 transition-colors duration-300 group-hover:bg-black/20" />

              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-2xl sm:text-3xl font-bold text-white text-center px-4">
                  {location.country}
                </h3>
              </div>

              <div className="absolute inset-4 border border-white/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
