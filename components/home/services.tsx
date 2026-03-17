export default function Services() {
  const services = [
    {
      title: 'Double Decker Exhibition Stands',
      description: 'Double decker exhibition stands are a smart way to increase space and make your brand presence more impressive at the exhibition ground.',
      image: '/live/services/double-decker.webp',
    },
    {
      title: 'Outdoor Exhibition Stands',
      description: 'Outdoor exhibition stands are designed to create strong brand visibility and support your display requirements for open event spaces.',
      image: '/live/services/outdoor.webp',
    },
    {
      title: 'Custom Exhibition Stands',
      description: 'Custom exhibition stands are designed according to your brand standards, business goals, and exhibition brief.',
      image: '/live/services/custom.webp',
    },
    {
      title: 'Country Pavilion Exhibition Stand',
      description: 'Country pavilion exhibition stands are planned to manage large display areas and present a strong brand or national presence.',
      image: '/live/services/country-pavilion.webp',
    },
    {
      title: 'Sustainable Exhibition Stands',
      description: 'Sustainable exhibition stands help brands exhibit responsibly while maintaining strong design quality and practical use.',
      image: '/live/services/sustainable.webp',
    },
    {
      title: 'Modular Exhibition Stands',
      description: 'Modular exhibition stands are practical for brands looking for flexible display solutions with strong visibility and efficient setup.',
      image: '/live/services/modular.webp',
    },
  ];

  return (
    <section id="services" className="py-16 sm:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-4 leading-tight">
            Exhibition Stand Design Company with Complete Exhibit Solutions
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our stand designers and builders cover everything under one roof. We work hard to satisfy our clients by paying close attention to every little detail and maximizing their investment.
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
                <button className="bg-primary duration-1000 ease-out h-0 group-hover:h-10 p-1 px-3 hidden group-hover:block rounded-full text-white/70 hover:text-white cursor-pointer">Explore service</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
