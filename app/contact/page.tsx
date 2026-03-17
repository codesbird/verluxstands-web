'use client'

import { PhoneCall, Mail, MapPin, Clock3, ClipboardList, PenTool, Settings2, Truck } from 'lucide-react'
import TopHeader from '@/components/common/top-header'
import Header from '@/components/common/header'
import Footer from '@/components/common/footer'
import PageHeader from '@/components/common/page-header'
import ContactSection from '@/components/home/contact-section'

const contactCards = [
  {
    icon: PhoneCall,
    title: 'Speak to Our Team',
    description: 'Call our experts directly and get instant guidance for your exhibition needs.',
    value: '+91 8920253275',
  },
  {
    icon: Mail,
    title: 'Email Us',
    description: 'Share your project details and receive a proposal according to your exhibition requirements.',
    value: 'marketing@verluxstands.com',
  },
  {
    icon: MapPin,
    title: 'Visit Our Address',
    description: 'No. 1, Manikam Market, Unchi Dankaur, Greater Noida, Gautam Buddha Nagar, Uttar Pradesh - 201110',
    value: 'Greater Noida, India',
  },
]

const projectSteps = [
  {
    icon: ClipboardList,
    title: 'Share Your Brief',
    description: 'Tell us about your exhibition, stand size, project goals, and the kind of stand solution you need.',
  },
  {
    icon: PenTool,
    title: 'Design Planning',
    description: 'Our team guides you from ideas to delivery and prepares the stand concept according to your brand standards.',
  },
  {
    icon: Settings2,
    title: 'Build Coordination',
    description: 'We manage the project with complete exhibit management support and attention to every little detail.',
  },
  {
    icon: Truck,
    title: 'Delivery and Setup',
    description: 'We handle delivery, setup, dismantling, and related exhibition stand services so the process stays clear and reliable.',
  },
]

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background">
      <TopHeader />
      <Header />
      <PageHeader
        subtitle="Get in Touch with Our Exhibition Stand Builders in India"
        title="Contact Us"
        backgroundImage="https://www.exproglobal-europe.com/wp-content/uploads/2025/12/LUBREX.jpg"
      />

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-5 text-2xl font-bold leading-tight text-primary sm:text-3xl lg:text-4xl">
              Whether you need a custom exhibition booth, modular stand, or a full exhibition management solution
            </h2>
            <p className="text-lg leading-8 text-muted-foreground">
              Our expert team will guide you from design to delivery with complete precision. Speak to our team today and get instant guidance for your exhibition needs.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {contactCards.map((card) => (
              <div key={card.title} className="rounded-[1.75rem] border border-primary/20 bg-card p-8 text-center shadow-[0_18px_48px_rgba(0,0,0,0.18)]">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
                  <card.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-serif text-2xl font-semibold text-secondary">{card.title}</h3>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">{card.description}</p>
                <div className="mt-5 text-base font-semibold text-primary">{card.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container mx-auto px-6">
          <div className="rounded-[2rem] border border-primary/15 bg-card p-8 md:p-10">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-primary">
                <Clock3 className="h-3.5 w-3.5" />
                Start Your Project
              </div>
              <h2 className="mt-5 font-serif text-3xl font-bold text-secondary md:text-4xl">
                Share your project details and receive a tailored proposal within 24 hours
              </h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">
                We help exhibitors with custom stands, modular stands, and complete exhibit management solutions according to brand requirements, event goals, and budget.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="container mx-auto px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-2xl font-bold leading-tight text-primary sm:text-3xl lg:text-4xl">
              Contact Us for the Best Exhibition Booth Designs
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
              Choose Verlux Stands for your next trade show event and get a proposal according to your exhibition requirements.
            </p>
          </div>
          <ContactSection />
        </div>
      </section>

      <section className="py-16 md:py-20 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <p className="text-sm font-medium text-primary uppercase tracking-widest mb-4">Project Steps</p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold">
              How We Complete Your Exhibition Project
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {projectSteps.map((step, index) => (
              <div key={step.title} className="rounded-[1.75rem] border border-primary/15 bg-card p-8">
                <div className="mb-6 flex items-center justify-between">
                  <step.icon className="h-7 w-7 text-primary" />
                  <span className="font-serif text-3xl text-primary/30">{String(index + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="font-serif text-xl font-semibold text-secondary">{step.title}</h3>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="rounded-[2rem] border border-primary/15 bg-card p-8 md:p-12 text-center">
            <h2 className="font-serif text-3xl font-bold text-secondary md:text-4xl">
              Have the exhibiting experts by your side for the best brand presence at display ground
            </h2>
            <p className="mx-auto mt-5 max-w-4xl text-lg leading-8 text-muted-foreground">
              Building an exhibition stand requires extensive preparation and attention to detail. That is what we do. Connect with our team today and get the best quote for your brand exposition.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
