import { Metadata } from "next"
import TopHeader from "@/components/common/top-header"
import Header from "@/components/common/header"
import Footer from "@/components/common/footer"
import PageHeader from "@/components/common/page-header"
import { DynamicSchema } from "@/components/admin/seo/schema"
import { getSEO, generateMetadataFromSEO } from "@/lib/seo"
// import { Calendar, MapPin, Users, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import ClientEvents from "@/components/trade-show/events-calender"

// Generate metadata from CMS
export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO("trade-shows")
  return generateMetadataFromSEO(seo)
}


export default async function TradeShowCalendarPage() {
  const seo = await getSEO("trade-shows")


  return (
    <main className="min-h-screen bg-background">
      <DynamicSchema seo={seo} />
      <TopHeader />
      <Header />
      <PageHeader
        subtitle="Upcoming Events"
        title="Trade Show Calendar 2026"
        backgroundImage={"https://www.exproglobal-europe.com/wp-content/uploads/2025/12/LUBREX.jpg"}

      />

      <section className="py-10">
        <div className="container mx-auto px-6">

          <ClientEvents />

        </div>
      </section>

      <Footer />
    </main>
  )
}
