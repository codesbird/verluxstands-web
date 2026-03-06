import { Button } from '@/components/ui/button';
import Link from "next/link";
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
              Verlux Stands, <span className="text-primary">Your Global Exhibition Stand Solution Partner</span>
            </h2>
            <div className="space-y-4 text-muted-foreground text-base sm:text-lg leading-relaxed">
              <p>
                Verlux Stands is a leading exhibition stand builder offering comprehensive and innovative exhibiting solutions worldwide. We empower brands to create unforgettable event experiences and build lasting market presence.
              </p>
              <p>
                Since 2008, we have been delivering excellence as expert exhibition stand contractors with specialization in custom exhibition stand design, construction, and creating memorable brand displays.
              </p>
              <p>
                Our complete exhibition solutions include expert consultation, strategic planning, 3D design visualization, professional construction, graphic design, on-site installation, logistics management, and comprehensive support.
              </p>
            </div>
            <div className="flex justify-around gap-5 mt-10 flex-wrap w-full">
              <QuoteButton name="GET FREE QUOTE" type="button" />
              <QuoteButton name="OUR WORK" type="link" link="/portfolio" />

              
            </div>
          </div>

          {/* Image */}
          <div className="lg:block z-2 relative rounded-3xl">
            <Image
              src="https://www.exproglobal-europe.com/wp-content/uploads/2025/12/ALARM_GERMANY.jfif_.jpg"
              alt="Verlux Stands manufacturing and design facility"
              width={100}
              height={150}
              className="w-full max-h-100 object-cover rounded-4xl"
              priority
            />
            <div className="absolute background-card hidden md:block lg:block inset-0 rounded-4xl" />
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 mt-16 sm:mt-20 pt-16 sm:pt-20 border-t border-border">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-accent mb-2">15+</div>
            <p className="text-sm sm:text-base text-muted-foreground">Years of Experience</p>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-accent mb-2">6+</div>
            <p className="text-sm sm:text-base text-muted-foreground">Countries Served</p>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-accent mb-2">450+</div>
            <p className="text-sm sm:text-base text-muted-foreground">Projects Completed</p>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-accent mb-2">1100+</div>
            <p className="text-sm sm:text-base text-muted-foreground">No. of Designs</p>
          </div>
        </div>
      </div>
    </section>
  );
}
