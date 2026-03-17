import { getPortfolioMedia } from '@/lib/server/media-library'
import PortfolioGallery from '@/components/portfolio-gallery'

export default async function PortfolioEnhanced() {
  const items = await getPortfolioMedia()

  return (
    <PortfolioGallery
      items={items.slice(0,6)}
      eyebrow="Live Portfolio"
      title="Built Stands, Live Catalog"
      description="Browse the latest exhibition stand work uploaded from the admin dashboard. Filter by category and open any image in the gallery viewer."
      ctaHref="/portfolio"
      ctaLabel="Open Full Portfolio"
      compact
    />
  )
}
