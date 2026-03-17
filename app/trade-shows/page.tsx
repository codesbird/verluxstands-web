import { Metadata } from 'next'
import TopHeader from '@/components/common/top-header'
import Header from '@/components/common/header'
import Footer from '@/components/common/footer'
import PageHeader from '@/components/common/page-header'
import { getSEO, generateMetadataFromSEO } from '@/lib/seo'
import ClientEvents from '@/components/trade-show/events-calender'

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO('trade-shows')
  return generateMetadataFromSEO(seo)
}

export default async function TradeShowCalendarPage() {
  return (
    <main className="min-h-screen bg-background">
      <TopHeader />
      <Header />
      <PageHeader
        subtitle="Upcoming Events"
        title="Trade Show Calendar 2026"
        backgroundImage="https://www.exproglobal-europe.com/wp-content/uploads/2025/12/LUBREX.jpg"
      />

      <section className="py-10 md:py-14">
        <div className="container mx-auto px-6">
          <ClientEvents />
        </div>
      </section>

      <Footer />
    </main>
  )
}
