import Image from 'next/image';

export default function Process() {
  const steps = [
    {
      number: '01',
      title: 'Know Your Needs',
      description:
        'We begin with a consultation to understand your goals, target audience, and brand requirements.',
    },
    {
      number: '02',
      title: '3D Creative Stand Designing',
      description:
        'We present you with creative options tailored to your needs, ensuring your stand design aligns perfectly with your brand identity.',
    },
    {
      number: '03',
      title: 'Your Approval is a Must!',
      description:
        'We take your feedback, modify designs and layouts until the concept not just meets but exceeds your expectations.',
    },
    {
      number: '04',
      title: 'In-House Manufacturing Unit',
      description:
        'Once you approve the design, our skilled stand builders start transforming the 3D into reality.',
    },
    {
      number: '05',
      title: 'Stand Installation, Dismantling, and Storage',
      description:
        'Our experienced technicians manage the stand shipping, onsite installation, dismantling, storage and other post show services.',
    },
    {
      number: '06',
      title: 'On-Site Management & Supervision',
      description:
        'We will be assigning you a dedicated project manager who will be with you from the start to the end.',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-4 leading-tight">
            Steps to a Guaranteed Successful Brand Display at the Exhibition Ground
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            As a trusted exhibition booth builders in Europe, we have a structured, transparent, and creative approach to deliver exceptional results on the show floor.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative p-6 sm:p-8 bg-muted/40 rounded-lg border border-border hover:border-accent hover:bg-muted/60 transition-all duration-300 group"
            >
              {/* Step Number Badge */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                {step.number}
              </div>

              <div className="mt-4">
                <h3 className="text-xl sm:text-2xl font-bold text-primary mb-3 leading-tight">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-base leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Process Image */}
        <div className="mt-16 sm:mt-20 rounded-lg overflow-hidden border border-border shadow-lg">
          <Image
            src="/images/design-process.jpg"
            alt="Professional design and planning process"
            width={1200}
            height={400}
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    </section>
  );
}
