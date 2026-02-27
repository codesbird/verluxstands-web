import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageHeader } from "@/components/page-header"
import { DynamicSchema } from "@/components/seo/schema"
import { getSEO, generateMetadataFromSEO } from "@/lib/seo"
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import ClientEvents from "@/components/events-calender"

// Generate metadata from CMS
export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO("trade-show-calendar")
  return generateMetadataFromSEO(seo)
}


export default async function TradeShowCalendarPage() {
  const seo = await getSEO("trade-show-calendar")


  return (
    <main className="min-h-screen bg-background">
      <DynamicSchema seo={seo} />
      <Header />
      <PageHeader
        subtitle="Upcoming Events"
        title="Trade Show Calendar 2026"
        description="Plan ahead for the biggest trade shows and exhibitions worldwide. We recommend booking 3-6 months in advance for the best results."
      />

      <section className="py-20 md:py-28">
        <div className="container mx-auto px-6">
          <div className="mb-12 p-6 bg-primary/10 border border-primary/20 rounded-xl">
            <p className="text-foreground">
              <strong>Planning Tip:</strong> For custom exhibition stands, we recommend starting the design process 4-6 months before your event. Contact us early to ensure availability and the best possible outcome.
            </p>
          </div>

          <ClientEvents />

          <div className="mt-16 text-center bg-secondary rounded-xl p-10 border border-border">
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4">
              Don't See Your Event?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              We design and build exhibition stands for events worldwide. Whether it's a major trade show or a regional conference, we've got you covered.
            </p>
            <Link href="/contact">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Contact Us About Your Event
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
