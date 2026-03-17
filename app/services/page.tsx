import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import TopHeader from "@/components/common/top-header"
import Header from "@/components/common/header"
import Footer from "@/components/common/footer"
import PageHeader from "@/components/common/page-header"
import { ServiceSchema, BreadcrumbSchema } from "@/components/structured-data"
import { DynamicSchema } from "@/components/admin/seo/schema"
import { getSEO, generateMetadataFromSEO } from "@/lib/seo"
import { Building2, Trees, PanelsTopLeft, Landmark, Leaf, Blocks, CheckCircle2 } from "lucide-react"
import QuoteButton from "@/components/common/quote-button"

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO("services")
  return generateMetadataFromSEO(seo)
}

const services = [
  {
    id: "double-decker",
    icon: Building2,
    title: "Double Decker Exhibition Stands",
    image: "/live/services/double-decker.webp",
    intro: "Double decker exhibition stands are a smart way to increase space and make your brand presence more impressive at the exhibition ground.",
    description: [
      "A double decker exhibition stand is a strong choice for exhibitors who need more display space, better visitor movement, and a more impressive booth structure on the show floor. This type of stand helps brands create separate meeting, product, and presentation areas within the same exhibition footprint.",
      "Verlux Stands plans double decker stands according to your brand standards, exhibition requirements, and practical use of space. We focus on strong visibility, better visitor engagement, and a stand structure that supports both presentation and business discussions during the event.",
    ],
    points: [
      "Better use of vertical space for meetings and hospitality",
      "Strong visibility from multiple directions on the exhibition ground",
      "Suitable for premium launches, product displays, and brand presentations",
    ],
  },
  {
    id: "outdoor",
    icon: Trees,
    title: "Outdoor Exhibition Stands",
    image: "/live/services/outdoor.webp",
    intro: "Outdoor exhibition stands are designed to create strong brand visibility and support your display requirements for open event spaces.",
    description: [
      "Outdoor exhibition stands require a different level of planning because the stand has to work well in open event spaces while still creating a strong and professional brand presence. The structure, display areas, and visitor flow all need to be practical for outdoor conditions.",
      "We design outdoor exhibition stands to support product showcasing, visitor interaction, and strong visual impact. Our team plans the stand according to event needs, available space, and your brand goals so the result remains useful as well as visually strong.",
    ],
    points: [
      "Planned for open-space exhibiting requirements",
      "Strong brand visibility for large-format outdoor displays",
      "Useful for product showcases, launches, and visitor engagement",
    ],
  },
  {
    id: "custom",
    icon: PanelsTopLeft,
    title: "Custom Exhibition Stands",
    image: "/live/services/custom.webp",
    intro: "Custom exhibition stands are designed according to your brand standards, business goals, and exhibition brief.",
    description: [
      "Custom exhibition stands are for exhibitors who want a displaying solution that reflects their business, industry relevance, and brand inventiveness instead of relying on a pre-made display. A custom stand gives you more flexibility in storytelling, graphics, layout, interaction, and product presentation.",
      "Verlux Stands designs and builds custom exhibition stands for brands across Europe and Asia. We go beyond aesthetics and create stands that improve interaction and return on investment. The result is not just a booth structure but a display tool that helps your company stand apart on the trade show floor.",
    ],
    points: [
      "Designed to fit your business goals and brand message",
      "Greater flexibility in layout, graphics, AV, and visitor experience",
      "Built to improve interaction, visibility, and lead generation",
    ],
  },
  {
    id: "country-pavilion",
    icon: Landmark,
    title: "Country Pavilion Exhibition Stand",
    image: "/live/services/country-pavilion.webp",
    intro: "Country pavilion exhibition stands are planned to manage large display areas and present a strong brand or national presence.",
    description: [
      "Country pavilion exhibition stands are meant for larger presentation zones where multiple brands, products, or sectors are represented in a single stand environment. These stands require clear zoning, coordinated branding, and a layout that helps visitors move naturally through the pavilion.",
      "Our team plans country pavilion stands with strong visual structure, useful visitor circulation, and coordinated presentation areas. This helps exhibitors create a professional environment for meetings, product showcasing, and brand positioning across a large exhibition space.",
    ],
    points: [
      "Clear zoning for multiple products or participating brands",
      "Strong identity for country-level or sector-level presentation",
      "Useful for international expos and large-format event participation",
    ],
  },
  {
    id: "sustainable",
    icon: Leaf,
    title: "Sustainable Exhibition Stands",
    image: "/live/services/sustainable.webp",
    intro: "Sustainable exhibition stands help brands exhibit responsibly while maintaining strong design quality and practical use.",
    description: [
      "Many exhibitors now look for stand solutions that balance design quality with responsible material use and practical long-term value. A sustainable exhibition stand helps you maintain a strong brand presence while working in a more mindful and efficient way.",
      "Verlux Stands builds sustainable display solutions that remain visually effective and practical for event use. We focus on materials, build planning, and stand use in a way that supports your exhibiting needs without losing the quality and visibility expected on the exhibition floor.",
    ],
    points: [
      "Supports responsible exhibiting without losing design impact",
      "Focus on practical material use and efficient stand planning",
      "Useful for brands that want value, reuse potential, and quality together",
    ],
  },
  {
    id: "modular",
    icon: Blocks,
    title: "Modular Exhibition Stands",
    image: "/live/services/modular.webp",
    intro: "Modular exhibition stands are practical for brands looking for flexible display solutions with strong visibility and efficient setup.",
    description: [
      "A modular exhibition stand is ideal for exhibitors who need a flexible stand solution that works across different events and booth sizes. It helps brands keep the displaying process practical while still maintaining a professional and visible presentation.",
      "We create modular stand solutions according to your event needs, business goals, and budget. This gives exhibitors a dependable system that can support different layouts while keeping the stand attractive, useful, and suitable for repeated use across exhibitions.",
    ],
    points: [
      "Flexible stand solution for repeated event participation",
      "Practical setup with strong visual presentation",
      "Suitable for exhibitors balancing budget, speed, and brand presence",
    ],
  },
]

export default async function ServicesPage() {
  const seo = await getSEO("services")

  return (
    <>
      <DynamicSchema seo={seo} />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://verluxstands-web.vercel.app" },
        { name: "Services", url: "https://verluxstands-web.vercel.app/services" }
      ]} />
      <ServiceSchema
        serviceName="Exhibition Stand Design & Build"
        description="Complete exhibition stand services including custom, modular, double decker, outdoor, pavilion, and sustainable exhibition stands."
      />
      <main className="min-h-screen bg-background">
        <TopHeader />
        <Header />
        <PageHeader
          subtitle="What We Offer"
          title="Exhibition Stand Design Company with Complete Exhibit Solutions"
          backgroundImage="https://www.exproglobal-europe.com/wp-content/uploads/2025/12/LUBREX.jpg"
        />

        <section className="border-b border-primary/10 bg-card/60 backdrop-blur">
          <div className="container mx-auto px-6">
            <div className="sticky top-0 z-20 -mx-6 overflow-x-auto border-b border-primary/10 bg-background/92 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
              <div className="flex min-w-max gap-3">
                {services.map((service) => (
                  <Link
                    key={service.id}
                    href={`#${service.id}`}
                    className="rounded-full border border-primary/20 bg-primary/8 px-4 py-2 text-sm font-medium text-secondary transition-colors hover:bg-primary hover:text-black"
                  >
                    {service.title}
                  </Link>
                ))}
              </div>
            </div>

            <div className="py-12 text-center">
              <h2 className="font-serif text-3xl font-bold text-primary md:text-4xl">
                Our stand designers and builders cover everything under one roof
              </h2>
              <p className="mx-auto mt-5 max-w-4xl text-lg leading-8 text-muted-foreground">
                We work hard to satisfy our clients by paying close attention to every little detail and maximizing their investment. Explore each service below and jump directly to the stand solution that matches your exhibition requirements.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container mx-auto px-6">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {services.map((service) => (
                <Link
                  key={service.id}
                  href={`#${service.id}`}
                  className="group overflow-hidden rounded-[1.75rem] border border-primary/15 bg-card transition-transform duration-300 hover:-translate-y-1 hover:border-primary/35"
                >
                  <div className="relative h-56">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
                    <div className="absolute left-6 top-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-black/35 text-primary">
                      <service.icon className="h-6 w-6" />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <h3 className="font-serif text-2xl font-semibold text-white">{service.title}</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-sm leading-7 text-muted-foreground">{service.intro}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-20 md:pb-28">
          <div className="container mx-auto px-6">
            <div className="space-y-16">
              {services.map((service, index) => (
                <section
                  key={service.id}
                  id={service.id}
                  className="scroll-mt-28 rounded-[2rem] border border-primary/15 bg-card/70 p-6 md:p-10"
                >
                  <div className={`grid items-center gap-10 lg:grid-cols-2 ${index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}>
                    <div className="relative overflow-hidden rounded-[1.75rem]">
                      <div className="relative aspect-[5/4]">
                        <Image
                          src={service.image}
                          alt={service.title}
                          fill
                          className="object-cover"
                          sizes="(min-width: 1024px) 50vw, 100vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                      </div>
                    </div>

                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-primary">
                        <service.icon className="h-3.5 w-3.5" />
                        Service Detail
                      </div>
                      <h2 className="mt-5 font-serif text-3xl font-bold text-secondary md:text-4xl">
                        {service.title}
                      </h2>
                      <p className="mt-5 text-lg leading-8 text-foreground/84">
                        {service.intro}
                      </p>
                      <div className="mt-6 space-y-4 text-base leading-8 text-muted-foreground">
                        {service.description.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </div>
                      <div className="mt-8 space-y-3">
                        {service.points.map((point) => (
                          <div key={point} className="flex items-start gap-3">
                            <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                            <span className="text-foreground/86">{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-20">
          <div className="container mx-auto px-6">
            <div className="rounded-[2rem] border border-primary/15 bg-card p-8 text-center md:p-12">
              <h2 className="font-serif text-3xl font-bold text-secondary md:text-4xl">
                Have the exhibiting experts by your side for the best brand presence at display ground
              </h2>
              <p className="mx-auto mt-5 max-w-4xl text-lg leading-8 text-muted-foreground">
                Whether you need a custom stand, modular stand, outdoor stand, or a complete exhibiting solution, Verlux Stands can plan the right approach according to your event goals, brand standards, and exhibition requirements.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <QuoteButton name="Request a Free Quote" type="button" />
                <Link
                  href="/contact"
                  className="rounded-full border border-primary/25 px-6 py-3 font-medium text-secondary transition-colors hover:bg-primary hover:text-black"
                >
                  Speak to Our Team
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  )
}
