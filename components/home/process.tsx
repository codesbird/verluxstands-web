import Image from 'next/image';

export default function Process() {
  const steps = [
    {
      number: '01',
      title: 'Know Your Needs',
      description:
        'We begin by understanding your exhibition goals, brand standards, display needs, and the message you want to deliver.',
    },
    {
      number: '02',
      title: '3D Creative Stand Designing',
      description:
        'We present creative stand design options according to your brief so the concept fits your brand identity and exhibition objectives.',
    },
    {
      number: '03',
      title: 'Your Approval is a Must!',
      description:
        'We take your feedback seriously and refine the design and layout until it matches your approval and exhibition requirements.',
    },
    {
      number: '04',
      title: 'In-House Manufacturing Unit',
      description:
        'Once the design is approved, our in-house production team starts building your exhibition stand with attention to every detail.',
    },
    {
      number: '05',
      title: 'Stand Installation, Dismantling, and Storage',
      description:
        'We manage shipping, installation, dismantling, storage, and other post-show services so you can focus on the event itself.',
    },
    {
      number: '06',
      title: 'On-Site Management & Supervision',
      description:
        'A dedicated project manager stays with you from start to finish to ensure smooth execution on the exhibition ground.',
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
            The design of your exhibition stand is entirely determined by your brand standards and brief needs. We handle setup, dismantling, delivery, and more so your exhibiting process stays clear and well managed.
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
            src="/images/banner.jpeg"
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
