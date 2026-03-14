import Image from 'next/image';

export default function Portfolio() {
  const projects = [
    {
      title: 'Fortune 500 Tech Company Stand',
      description: 'Award-winning minimalist design with interactive displays',
      image: '/images/project-1.jpg',
    },
    {
      title: 'International Trade Show Pavilion',
      description: 'Multi-level stand accommodating 200+ daily visitors',
      image: '/images/project-2.jpg',
    },
    {
      title: 'Innovative Brand Experience Hub',
      description: 'LED-integrated stand with cutting-edge technology integration',
      image: '/images/project-3.jpg',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-4 leading-tight">
            Featured Projects
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Explore our portfolio of successful exhibition stands that have made an impact at major trade shows across Europe.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="group rounded-lg overflow-hidden border border-border hover:border-accent transition-all duration-300 hover:shadow-xl"
            >
              <div className="relative h-64 sm:h-72 overflow-hidden bg-muted">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6 sm:p-8 bg-card">
                <h3 className="text-xl sm:text-2xl font-bold text-primary mb-2 group-hover:text-accent transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted-foreground text-base">
                  {project.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 sm:mt-16 text-center">
          <button className="inline-flex items-center justify-center px-8 py-3 border border-primary text-primary rounded-lg hover:bg-muted transition-colors font-semibold">
            View All Projects
          </button>
        </div>
      </div>
    </section>
  );
}
