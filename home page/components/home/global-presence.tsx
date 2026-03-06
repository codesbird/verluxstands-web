export default function GlobalPresence() {
  const countries = [
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'IT', name: 'Italy' },
    { code: 'ES', name: 'Spain' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'CH', name: 'Switzerland' },
    { code: 'PL', name: 'Poland' },
    { code: 'PT', name: 'Portugal' },
    { code: 'RO', name: 'Romania' },
  ];

  return (
    <section id="global" className="py-16 sm:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-4 leading-tight">
            Verlux Stands Network - Global Exhibition Stand Builders
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Service partners across multiple European countries, committed to delivering excellence wherever you are.
          </p>
        </div>

        {/* Countries Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {countries.map((country) => (
            <div
              key={country.code}
              className="bg-muted/40 rounded-lg border border-border p-4 sm:p-6 text-center hover:bg-muted/60 hover:border-accent transition-all duration-300 group"
            >
              <div className="text-4xl sm:text-5xl font-bold text-accent mb-2 group-hover:scale-110 transition-transform">
                {country.code}
              </div>
              <p className="font-semibold text-primary text-sm sm:text-base">{country.name}</p>
            </div>
          ))}
        </div>

        {/* Network Benefits */}
        <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg border border-accent/30 p-8 sm:p-12">
          <h3 className="text-2xl sm:text-3xl font-bold text-primary mb-6 text-center leading-tight">
            Why Choose Verlux Stands as Your Exhibition Stand Builder
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-accent text-accent-foreground">
                  ✓
                </div>
              </div>
              <div>
                <h4 className="font-bold text-primary mb-2">Years of Excellence</h4>
                <p className="text-muted-foreground">
                  Since 2008, we have built a strong reputation for delivering high-quality, tailor-made exhibition stands that help brands stand out.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-accent text-accent-foreground">
                  ✓
                </div>
              </div>
              <div>
                <h4 className="font-bold text-primary mb-2">Expertise & Innovation</h4>
                <p className="text-muted-foreground">
                  Our team of experienced professionals takes care of every aspect of your brand exhibiting, ensuring flawless craftsmanship.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-accent text-accent-foreground">
                  ✓
                </div>
              </div>
              <div>
                <h4 className="font-bold text-primary mb-2">Comprehensive Solutions</h4>
                <p className="text-muted-foreground">
                  From concept design to on-site installation, we provide complete exhibiting solutions tailored to your needs.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-accent text-accent-foreground">
                  ✓
                </div>
              </div>
              <div>
                <h4 className="font-bold text-primary mb-2">Dedicated Support</h4>
                <p className="text-muted-foreground">
                  A dedicated project manager assigned to your project from start to finish, ensuring smooth execution.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
