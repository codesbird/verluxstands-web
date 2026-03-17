import { Metadata } from 'next'
import TopHeader from '@/components/common/top-header'
import Header from '@/components/common/header'
import Footer from '@/components/common/footer'
import PageHeader from '@/components/common/page-header'
import { getSEO, generateMetadataFromSEO } from '@/lib/seo'
import ContactSection from '@/components/home/contact-section'
import PortfolioGallery from '@/components/portfolio-gallery'
import { getPortfolioMedia } from '@/lib/server/media-library'

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO('portfolio')
  return generateMetadataFromSEO(seo)
}

export default async function PortfolioPage() {
  const items = await getPortfolioMedia()

  return (
    <main className="min-h-screen bg-background">
      <TopHeader />
      <Header />
      <PageHeader
        subtitle="Our Work"
        title="Stands That Define Excellence"
        backgroundImage="https://www.exproglobal-europe.com/wp-content/uploads/2025/12/LUBREX.jpg"
      />

      <PortfolioGallery
        items={items}
        eyebrow="Portfolio Archive"
        title="Explore Our Exhibition Build Library"
        description="Every image here is loaded from the live portfolio library you manage in the admin dashboard. Filter by sector, open the gallery, and move through the stand designs image by image."
      />

      <div className="container mx-auto px-6 pb-16">
        <ContactSection />
      </div>

      <Footer />
    </main>
  )
}
