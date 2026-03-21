import Image from 'next/image';
import QuoteButton from "@/components/common/quote-button"

export default function About() {

  return (
    <section id="about" className="py-16 sm:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-7 sm:px-10 lg:px-15">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold  mb-6 leading-tight">
              Join Hands with the <span className="text-primary">Best Exhibition Stand Builders in India</span>
            </h2>
            <div className="space-y-4 text-muted-foreground text-base sm:text-lg leading-relaxed">
              <p>
                Verlux Stands is the most trusted and experienced exhibition stand builder that provide you with precise guidance from ideas to delivery of your exhibition stands, whether you want a custom stand or a modular one, along with complete exhibit management solution.
              </p>
              <p>
                Verlux Stands assists clients in organizing and carrying out high-quality projects under the guidance of professionals. Our wide range of exhibiting services in Europe and India is second to none. Our stand designers and builders cover everything under one roof.
              </p>
              <p>
                We work hard to satisfy our clients by paying close attention to every little detail and maximizing their investment. We work within your budget without sacrificing the project's quality. We supply exhibition stands in many places simultaneously thanks to our worldwide connections and in-house production capabilities.
              </p>
              <p>
                We think that every brand deserves to shine on the display floor. Our team of architects, designers, and stand builders combines accuracy and inventiveness to create powerful exhibition stands across Asia and Europe.
              </p>
            </div>
            <div className="flex justify-start gap-5 mt-10 flex-wrap w-full">
              <QuoteButton name="SPEAK TO OUR TEAM" type="link" link="/contact" />
            </div>
          </div>

          {/* Image */}
          <div className="lg:block z-2 relative rounded-3xl">
            <Image
              src="/images/happilo.jpeg"
              alt="Exhibition stand build company"
              width={900}
              height={1100}
              className="w-full max-h-100 object-contain rounded-4xl"
              priority
            />
            <div className="absolute background-card hidden md:block lg:block inset-0 rounded-4xl" />
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 mt-16 sm:mt-20 pt-16 sm:pt-20 border-t border-border">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-accent mb-2">98%</div>
            <p className="text-sm sm:text-base text-muted-foreground">Client Satisfaction</p>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-accent mb-2">5+</div>
            <p className="text-sm sm:text-base text-muted-foreground">Countries Served</p>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-accent mb-2">150+</div>
            <p className="text-sm sm:text-base text-muted-foreground">Projects Completed</p>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-accent mb-2">120+</div>
            <p className="text-sm sm:text-base text-muted-foreground">Exhibition Served</p>
          </div>
        </div>
      </div>
    </section>
  );
}
