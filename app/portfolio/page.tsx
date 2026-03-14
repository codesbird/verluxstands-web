import { Metadata } from "next"
import Image from "next/image"
import TopHeader from "@/components/common/top-header"
import Header from "@/components/common/header"
import Footer from "@/components/common/footer"
import PageHeader from "@/components/common/page-header"
import { DynamicSchema } from "@/components/admin/seo/schema"
import { getSEO, generateMetadataFromSEO } from "@/lib/seo"
import PortfolioGrid from "@/components/portfolio-grid"
import ContactSection from "@/components/home/contact-section"
import { ArrowUpRight } from "lucide-react"

// Generate metadata from CMS
export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO("portfolio")
  return generateMetadataFromSEO(seo)
}

const projects = [
  {
    title: "Tech Summit 2024",
    category: "Technology",
    image: "/images/stand-1.jpg",
    client: "TechVision Inc.",
    location: "Las Vegas, USA",
    size: "120 sqm",
  },
  {
    title: "Tech Summit 2024",
    category: "Technology",
    image: "/images/stand-1.jpg",
    client: "TechVision Inc.",
    location: "Las Vegas, USA",
    size: "120 sqm",
  },
  {
    title: "Tech Summit 2024",
    category: "Technology",
    image: "/images/stand-1.jpg",
    client: "TechVision Inc.",
    location: "Las Vegas, USA",
    size: "120 sqm",
  },
  {
    title: "Tech Summit 2024",
    category: "Technology",
    image: "/images/stand-1.jpg",
    client: "TechVision Inc.",
    location: "Las Vegas, USA",
    size: "120 sqm",
  },
  {
    title: "Tech Summit 2024",
    category: "Technology",
    image: "/images/stand-1.jpg",
    client: "TechVision Inc.",
    location: "Las Vegas, USA",
    size: "120 sqm",
  },
  {
    title: "Tech Summit 2024",
    category: "Technology",
    image: "/images/stand-1.jpg",
    client: "TechVision Inc.",
    location: "Las Vegas, USA",
    size: "120 sqm",
  },
  {
    title: "Tech Summit 2024",
    category: "Technology",
    image: "/images/stand-1.jpg",
    client: "TechVision Inc.",
    location: "Las Vegas, USA",
    size: "120 sqm",
  },
  {
    title: "Tech Summit 2024",
    category: "Technology",
    image: "/images/stand-1.jpg",
    client: "TechVision Inc.",
    location: "Las Vegas, USA",
    size: "120 sqm",
  },
  {
    title: "Tech Summit 2024",
    category: "Technology",
    image: "/images/stand-1.jpg",
    client: "TechVision Inc.",
    location: "Las Vegas, USA",
    size: "120 sqm",
  },
  {
    title: "Tech Summit 2024",
    category: "Technology",
    image: "/images/stand-1.jpg",
    client: "TechVision Inc.",
    location: "Las Vegas, USA",
    size: "120 sqm",
  },
  {
    title: "Tech Summit 2024",
    category: "Technology",
    image: "/images/stand-1.jpg",
    client: "TechVision Inc.",
    location: "Las Vegas, USA",
    size: "120 sqm",
  },
  {
    title: "Tech Summit 2024",
    category: "Technology",
    image: "/images/stand-1.jpg",
    client: "TechVision Inc.",
    location: "Las Vegas, USA",
    size: "120 sqm",
  },
  {
    title: "Tech Summit 2024",
    category: "Technology",
    image: "/images/stand-1.jpg",
    client: "TechVision Inc.",
    location: "Las Vegas, USA",
    size: "120 sqm",
  },
  {
    title: "Tech Summit 2024",
    category: "Technology",
    image: "/images/stand-1.jpg",
    client: "TechVision Inc.",
    location: "Las Vegas, USA",
    size: "120 sqm",
  },
  {
    title: "Tech Summit 2024",
    category: "Technology",
    image: "/images/stand-1.jpg",
    client: "TechVision Inc.",
    location: "Las Vegas, USA",
    size: "120 sqm",
  },
  {
    title: "Tech Summit 2024",
    category: "Technology",
    image: "/images/stand-1.jpg",
    client: "TechVision Inc.",
    location: "Las Vegas, USA",
    size: "120 sqm",
  },
  {
    title: "Tech Summit 2024",
    category: "Technology",
    image: "/images/stand-1.jpg",
    client: "TechVision Inc.",
    location: "Las Vegas, USA",
    size: "120 sqm",
  },
  {
    title: "Tech Summit 2024",
    category: "Technology",
    image: "/images/stand-1.jpg",
    client: "TechVision Inc.",
    location: "Las Vegas, USA",
    size: "120 sqm",
  },
  {
    title: "Tech Summit 2024",
    category: "Technology",
    image: "/images/stand-1.jpg",
    client: "TechVision Inc.",
    location: "Las Vegas, USA",
    size: "120 sqm",
  },
  {
    title: "Luxe Automotive Showcase",
    category: "Automotive",
    image: "/images/stand-2.jpg",
    client: "Luxe Motors",
    location: "Frankfurt, Germany",
    size: "200 sqm",
  },
  {
    title: "Fashion Forward Exhibition",
    category: "Fashion & Beauty",
    image: "/images/stand-3.jpg",
    client: "Style Co.",
    location: "Milan, Italy",
    size: "80 sqm",
  },
  {
    title: "Healthcare Innovation",
    category: "Healthcare",
    image: "/images/hero-stand.jpg",
    client: "MedTech Solutions",
    location: "Boston, USA",
    size: "150 sqm",
  },
  {
    title: "Food & Beverage Expo",
    category: "Food Industry",
    image: "/images/stand-1.jpg",
    client: "Global Foods Ltd",
    location: "Paris, France",
    size: "100 sqm",
  },
  {
    title: "Food & Beverage Expo",
    category: "Food Industry",
    image: "/images/stand-1.jpg",
    client: "Global Foods Ltd",
    location: "Paris, France",
    size: "100 sqm",
  },
  {
    title: "Food & Beverage Expo",
    category: "Food Industry",
    image: "/images/stand-1.jpg",
    client: "Global Foods Ltd",
    location: "Paris, France",
    size: "100 sqm",
  },
  {
    title: "Food & Beverage Expo",
    category: "Food Industry",
    image: "/images/stand-1.jpg",
    client: "Global Foods Ltd",
    location: "Paris, France",
    size: "100 sqm",
  },
  {
    title: "Food & Beverage Expo",
    category: "Food Industry",
    image: "/images/stand-1.jpg",
    client: "Global Foods Ltd",
    location: "Paris, France",
    size: "100 sqm",
  },
  {
    title: "Food & Beverage Expo",
    category: "Food Industry",
    image: "/images/stand-1.jpg",
    client: "Global Foods Ltd",
    location: "Paris, France",
    size: "100 sqm",
  },
  {
    title: "Food & Beverage Expo",
    category: "Food Industry",
    image: "/images/stand-1.jpg",
    client: "Global Foods Ltd",
    location: "Paris, France",
    size: "100 sqm",
  },
  {
    title: "Food & Beverage Expo",
    category: "Food Industry",
    image: "/images/stand-1.jpg",
    client: "Global Foods Ltd",
    location: "Paris, France",
    size: "100 sqm",
  },
  {
    title: "Food & Beverage Expo",
    category: "Food Industry",
    image: "/images/stand-1.jpg",
    client: "Global Foods Ltd",
    location: "Paris, France",
    size: "100 sqm",
  },
  {
    title: "Sustainable Living",
    category: "Environment",
    image: "/images/stand-2.jpg",
    client: "EcoWorld",
    location: "Amsterdam, Netherlands",
    size: "90 sqm",
  },
]

export default async function PortfolioPage() {
  const seo = await getSEO("portfolio")

  return (
    <main className="min-h-screen bg-background">
      <DynamicSchema seo={seo} />
      <TopHeader />
      <Header />
      <PageHeader
        subtitle="Our Work"
        title="Stands That Define Excellence"
        backgroundImage="https://www.exproglobal-europe.com/wp-content/uploads/2025/12/LUBREX.jpg"
      />

      <section className="py-14 md:py-10">
        <div className="container mx-auto px-6">
          <PortfolioGrid projects={projects} />
          <ContactSection />
        </div>
      </section>

      <Footer />
    </main>
  )
}
