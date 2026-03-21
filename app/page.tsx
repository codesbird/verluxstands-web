import Image from "next/image"
import { Metadata } from "next"


import { getSEO, generateMetadataFromSEO } from "@/lib/seo"
import { DynamicSchema } from "@/components/admin/seo/schema"
import { OrganizationSchema, LocalBusinessSchema, FAQSchema } from "@/components/structured-data"


import TopHeader from '@/components/common/top-header';
import Header from '@/components/common/header';
import HeroAnimated from '@/components/common/hero-animated';
import About from '@/components/home/about';
import Services from '@/components/home/services';
import Process from '@/components/home/process';
import PortfolioEnhanced from '@/components/home/portfolio-enhanced';
import Testimonials from '@/components/home/testimonials';
import GlobalPresenceRedesigned from '@/components/home/global-presence-redesigned';
import GeomapNetwork from '@/components/home/geomap-network';
import ContactSection from '@/components/home/contact-section';
import Footer from '@/components/common/footer';
import CTASection from '@/components/common/quick-actions';
import ServicePartners from '@/components/common/service-partners';

// import { SidebarToggleProvider } from "@/lib/sidebar-toggle"

// Generate metadata from CMS
// export async function generateMetadata(): Promise<Metadata> {
//   const seo = await getSEO("home")
//   return generateMetadataFromSEO(seo)
// }

const homeFaqs = [
  {
    question: "How much does an exhibition stand cost?",
    answer: "The cost of an exhibition stand depends on stand size, design requirements, materials, and the services you need. Share your brief with us and we will provide a proposal as per your exhibition requirements."
  },
  {
    question: "How long does it take to design and build an exhibition stand?",
    answer: "The timeline depends on the stand design, size, and exhibition requirements. Our team guides you from ideas to delivery and plans the process according to your event schedule."
  },
  {
    question: "Do you offer exhibition stand rental?",
    answer: "Yes, we offer custom stand and modular stand solutions according to your exhibition requirements, business goals, and budget."
  },
  {
    question: "What locations do you serve?",
    answer: "We provide exhibition stand services across Europe and India and supply exhibition stands in many places simultaneously through our worldwide connections and in-house production capabilities."
  }
]

export default async function Home() {
  const seo = await getSEO("home")

  return (
    <>
      <DynamicSchema seo={seo} />
      <OrganizationSchema />
      <LocalBusinessSchema />
      <FAQSchema faqs={homeFaqs} />
      <main>
        <TopHeader />
        <Header />
        <HeroAnimated />
        <About />
        {/* <GeomapNetwork /> */}
        <Services />
        <GlobalPresenceRedesigned />
        <CTASection />
        <Process />
        <PortfolioEnhanced />
        <div className="px-8 md:px-15 text-center mt-20">
          <div className="relative min-h-[240px] rounded-3xl overflow-hidden">
            <Image
              src="/live/cta/brand-floor.webp"
              alt="Exhibition stand background"
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(196,160,102,0.82),rgba(25,25,25,0.58)),linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.18))]" />

            <div className="relative z-10 flex min-h-[240px] flex-col justify-center items-center w-full gap-4 p-6 sm:p-10">
              <h2 className="text-4xl text-white">We think that every brand deserves to shine on the display floor</h2>
              <p className="text-white/80 text-lg">
                Our team of architects, designers, and stand builders combines accuracy and inventiveness to create powerful exhibition stands across Asia and Europe. We manage the planning and construction of your exhibition stand with complete exhibit solutions so you can stay focused on your show objectives and brand presence.
              </p>
            </div>
          </div>
        </div>
        <Testimonials />
        {/* <ServicePartners /> */}
        <ContactSection />
        <Footer />
      </main>
    </>
  )
}
