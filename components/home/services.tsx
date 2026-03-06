import Image from 'next/image';

export default function Services() {
  const services = [
    {
      title: 'Double Decker Exhibition Stands',
      description: 'Multi-level stands that maximize your brand visibility and engage visitors from multiple perspectives.',
      image: '/images/modular-stand.jpg',
    },
    {
      title: 'Outdoor Exhibition Stands',
      description: 'Weather-resistant designs perfect for outdoor events and trade shows across Europe.',
      image: '/images/outdoor-stand.jpg',
    },
    {
      title: 'Custom Exhibition Stands',
      description: 'Fully tailored stands designed to reflect your unique brand identity and messaging.',
      image: '/images/custom-design.jpg',
    },
    {
      title: 'Country Pavilion Exhibition Stand',
      description: 'Large-scale pavilions ideal for representing countries and major brand initiatives.',
      image: '/images/digital-stand.jpg',
    },
    {
      title: 'Sustainable Exhibition Stands',
      description: 'Eco-friendly stands built with sustainable materials and responsible manufacturing.',
      image: '/images/sustainable-stand.jpg',
    },
    {
      title: 'Outdoor Exhibition Stands',
      description: 'Weather-resistant designs perfect for outdoor events and trade shows across Europe.',
      image: '/images/outdoor-stand.jpg',
    },
  ];

  return (
    <section id="services" className="py-16 sm:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-4 leading-tight">
            End-to-End Exhibition Stand Design and Build Solutions Across Europe
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We are a reliable exhibition stand builder company in Europe known for our commitment to creativity, precision, and reliability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="s group relative bg-card rounded-lg border border-border overflow-hidden transition-transform duration-700 ease-out hover:translate-x-1 hover:-translate-y-1 hover:shadow-lg hover:border-accent"
            >
              <div
                className="relative h-48 sm:h-56 bg-center bg-cover bg-no-repeat"
                style={{ backgroundImage: `url(${service.image})` }}
              />

              <div
                className="absolute inset-0 flex flex-col items-center justify-end p-2 sm:p-8 bg-black/60 transition-colors duration-700 ease-out group-hover:bg-black/40"
              >
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 leading-tight">
                  {service.title}
                </h3>
                <button className="bg-primary duration-1000 ease-out h-0 group-hover:h-10 p-1 px-3 hidden group-hover:block rounded-full text-white/70 hover:text-white cursor-pointer">Learn more</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
