import { Metadata } from "next"
import Image from "next/image"
import TopHeader from '@/components/common/top-header';
import Header from "@/components/common/header"
import Footer from "@/components/common/footer"
import PageHeader from "@/components/common/page-header"
import { DynamicSchema } from "@/components/admin/seo/schema"
import { getSEO, generateMetadataFromSEO } from "@/lib/seo"
import { CheckCircle2, Award, Globe, MessageSquareQuote, PhoneCall, ClipboardList, Factory, Truck } from "lucide-react"

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO("about")
  return generateMetadataFromSEO(seo)
}

const stats = [
  { number: "98%", label: "Client Satisfaction" },
  { number: "5+", label: "Countries Served" },
  { number: "150+", label: "Projects Completed" },
  { number: "120+", label: "Exhibition Served" },
]

const values = [
  {
    icon: Award,
    title: "Precise Guidance",
    description: "We provide precise guidance from ideas to delivery of your exhibition stands according to your exhibition brief.",
  },
  {
    icon: Globe,
    title: "Complete Services",
    description: "Our stand designers and builders cover everything under one roof with complete exhibit management solutions.",
  },
  {
    icon: Factory,
    title: "Worldwide Connections",
    description: "We supply exhibition stands in many places simultaneously thanks to our worldwide connections and in-house production capabilities.",
  },
  {
    icon: MessageSquareQuote,
    title: "Brand Visibility",
    description: "We create exhibition stands with great visibility and effect so your brand can shine on the display floor.",
  },
]

const processSteps = [
  {
    icon: ClipboardList,
    title: "Know Your Requirements",
    description: "We understand your exhibition goals, brand standards, industry, business needs, and display requirements before planning the stand.",
  },
  {
    icon: Award,
    title: "3D Stand Design",
    description: "Our skilled builders and designers offer a range of design choices so you can select the one that best suits your requirements.",
  },
  {
    icon: Factory,
    title: "In-House Production",
    description: "Once the design is finalized, we manage the stand build process with attention to every little detail and project quality.",
  },
  {
    icon: Truck,
    title: "Setup, Delivery, and More",
    description: "We handle setup, dismantling, delivery, and related exhibition stand management services so your exhibiting process stays well managed.",
  },
]

export default async function AboutPage() {
  const seo = await getSEO("about")

  return (
    <main className="min-h-screen bg-background">
      <DynamicSchema seo={seo} />
      <TopHeader />
      <Header />
      <PageHeader
        title="About Us"
        subtitle="Join Hands with the Best Exhibition Stand Builders in India"
        backgroundImage={"https://www.exproglobal-europe.com/wp-content/uploads/2025/12/page-header-img2.jpg"}
      />

      <section className="py-16 bg-card border-b border-border">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-serif text-4xl md:text-5xl font-bold text-primary mb-2">{stat.number}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative">
              <div className="aspect-[4/3] rounded-xl overflow-hidden">
                <Image
                  src="/images/hero-stand.jpg"
                  alt="Verlux workshop"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
                A Dependable Exhibition Stand Builder with Complete Services
              </h2>
              <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
                <p>
                  Verlux Stands assists clients in organizing and carrying out high-quality projects under the guidance of professionals. Our wide range of exhibiting services in Europe and India is second to none. Our stand designers and builders cover everything under one roof.
                </p>
                <p>
                  We work hard to satisfy our clients by paying close attention to every little detail and maximizing their investment. We work within your budget without sacrificing the project's quality.
                </p>
                <p>
                  We supply exhibition stands in many places simultaneously thanks to our worldwide connections and in-house production capabilities. Verlux Stands is an exhibition stand design company that specializes in complete exhibit solutions with great visibility and effect.
                </p>
              </div>
              <ul className="mt-8 space-y-3">
                {[
                  "Precise guidance from ideas to delivery",
                  "Custom stand or modular stand solutions",
                  "Complete exhibit management under one roof",
                  "Worldwide connections and in-house production",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-foreground font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-medium text-primary uppercase tracking-widest mb-4">Why Verlux Stands</p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold">
              What Makes Our Exhibition Services Reliable
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div key={value.title} className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-2xl border border-primary/20 bg-card p-8 text-center">
              <PhoneCall className="w-10 h-10 text-primary mx-auto mb-5" />
              <h3 className="font-serif text-2xl font-semibold mb-3">Speak to Our Team</h3>
              <p className="text-muted-foreground leading-relaxed">
                Call our experts directly and get instant guidance for your exhibition needs.
              </p>
              <div className="mt-6 text-lg font-medium text-secondary">+91 8920253275</div>
            </div>
            <div className="rounded-2xl border border-primary/20 bg-card p-8 text-center">
              <MessageSquareQuote className="w-10 h-10 text-primary mx-auto mb-5" />
              <h3 className="font-serif text-2xl font-semibold mb-3">Request a Free Quote</h3>
              <p className="text-muted-foreground leading-relaxed">
                Share your project details and receive a tailored proposal within 24 hours.
              </p>
              <div className="mt-6 text-lg font-medium text-secondary">Get the best quote for your brand exposition</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-sm font-medium text-primary uppercase tracking-widest mb-4">Project Process</p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold">
              Steps to Complete a Project
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={step.title} className="rounded-2xl border border-primary/15 bg-card p-8">
                <div className="flex items-center justify-between mb-6">
                  <step.icon className="w-8 h-8 text-primary" />
                  <span className="font-serif text-3xl text-primary/30">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="font-serif text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-sm font-medium text-primary uppercase tracking-widest mb-4">Exhibition Stand Build Company</p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold">
                Building an Exhibition Stand Requires Extensive Preparation and Attention to Detail
              </h2>
            </div>
            <div className="space-y-5 text-lg leading-relaxed text-muted-foreground rounded-2xl border border-primary/15 bg-card p-8 md:p-10">
              <p>
                We think that every brand deserves to shine on the display floor. Our team of architects, designers, and stand builders combines accuracy and inventiveness to create powerful exhibition stands across Asia and Europe. Our only purpose is to make the process of planning and constructing your exhibition stand in Europe enjoyable and hassle-free so you can concentrate on reaching your show objectives.
              </p>
              <p>
                The design of your exhibition stand is entirely determined by your brand standards and brief needs. Our goal is to provide an exceptional exhibition stand by handling all aspects of setup, dismantling, delivery, and related project requirements.
              </p>
              <p>
                Verlux Stands is your reliable exhibition stand design company in Europe and Asia whether you are searching for readymade displays with great visibility or a stand that is specifically designed to fit your marketing plan. We assist you in captivating audiences, fostering relationships and making your brand shine.
              </p>
              <p className="font-medium text-secondary">
                Connect with our team today and get the best quote for your brand exposition today.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
