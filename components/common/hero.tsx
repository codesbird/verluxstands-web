import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function Hero() {
  const benefits = [
    { icon: '✓', title: 'Free Design', description: 'Custom designs tailored to your brand' },
    { icon: '✓', title: 'Free Estimate', description: 'Transparent pricing, no surprises' },
    { icon: '✓', title: 'No Hidden Costs', description: 'Honest and fair pricing always' },
    { icon: '✓', title: 'Best Price', description: 'Competitive rates without compromise' },
    { icon: '✓', title: 'Idea Fulfillment', description: 'Your vision becomes reality' },
    { icon: '✓', title: '24/7 Standby', description: 'Always ready to support you' },
  ];

  return (
    <section className="relative py-16 sm:py-24 bg-gradient-to-br from-background via-background to-muted/30">
      {/* Hero Background Image */}
      <div className="bg-black/40 absolute inset-0 -z-10 overflow-hidden">
        <Image
          src="/images/hero-exhibition.jpg"
          alt="Modern exhibition stand"
          fill
          className="object-cover opacity-10"
          priority
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Headline */}
        <div className="text-center mb-16 sm:mb-20">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-tight">
            Trusted Exhibition Stand Builders & Booth Design Company in Europe
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Welcome to Verlux Stands, your trusted exhibition stand builder in Europe, offering complete exhibiting services and success across the continent.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button className="bg-primary text-secondary-foreground hover:bg-primary/90 text-base px-8 py-6">
              Get Free Quote
            </Button>
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-muted text-base px-8 py-6"
            >
              Download Brochure
            </Button>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid hidden grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 sm:p-8 bg-card rounded-lg border border-border hover:border-accent transition-colors hover:shadow-md"
            >
              <div className="text-4xl font-bold text-accent mb-3">{benefit.icon}</div>
              <h3 className="text-lg sm:text-xl font-bold text-primary mb-2">{benefit.title}</h3>
              <p className="text-sm sm:text-base text-muted-foreground">{benefit.description}</p>
              lkjl
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
