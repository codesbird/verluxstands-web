'use client'

import TopHeader from '@/components/common/top-header'
import Header from '@/components/common/header'
import Footer from '@/components/common/footer'
import PageHeader from '@/components/common/page-header'
import ContactSection from '@/components/home/contact-section'

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background">
      <TopHeader />
      <Header />
      <PageHeader
        subtitle="Get in Touch"
        title="Let's Create Something Extraordinary"
        backgroundImage="https://www.exproglobal-europe.com/wp-content/uploads/2025/12/LUBREX.jpg"
      />

      <section className="py-8 md:py-15">
        <div className="container mx-auto px-6">
          <div className="mb-12 text-center sm:mb-16">
            <h2 className="mb-4 text-2xl font-bold leading-tight text-primary sm:text-3xl lg:text-4xl">
              Choose Verlux Stands for Your Next Trade Show Event
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
              Get a custom booth design and quote today.
            </p>
          </div>
          <ContactSection />
        </div>
      </section>

      <Footer />
    </main>
  )
}
