import { notFound } from "next/navigation"
import { Metadata } from "next"
import { adminDB } from "@/lib/firebase-admin"
import { getSEO, generateMetadataFromSEO } from "@/lib/seo"
import { PageConfig, SEOPageData } from "@/lib/types/seo"
import { PageRenderer } from "@/components/cms/page-renderer"
import { DynamicSchema } from "@/components/seo/schema"

interface PageProps {
  params: Promise<{ slug: string[] }>
}

async function getPageConfig(slug: string): Promise<PageConfig | null> {
  try {
    const snap = await adminDB!.ref(`page_builder/${slug}`).get()
    if (snap.exists()) {
      return { ...(snap.val() as PageConfig), id: slug }
    }
    return null
  } catch (error) {
    console.error("Error fetching page config:", error)
    return null
  }
}

// Generate metadata from CMS
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: slugArray } = await params
  const slug = slugArray.join("/")
  
  const seo = await getSEO(slug)
  return generateMetadataFromSEO(seo)
}

// Static paths can be generated from RTDB if needed
export async function generateStaticParams() {
  try {
    const snap = await adminDB!.ref("page_builder").get()
    if (snap.exists()) {
      const data = snap.val() as Record<string, PageConfig>
      return Object.keys(data).map((slug) => ({
        slug: slug.split("/"),
      }))
    }
    return []
  } catch (error) {
    console.error("Error generating static params:", error)
    return []
  }
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug: slugArray } = await params
  const slug = slugArray.join("/")
  
  // Check if this is a reserved route (admin, api, etc.)
  const reservedRoutes = ["admin", "api", "_next"]
  if (reservedRoutes.includes(slugArray[0])) {
    notFound()
  }
  
  // Get page config from RTDB
  const pageConfig = await getPageConfig(slug)
  
  // If no page config found, return 404
  if (!pageConfig) {
    notFound()
  }
  
  // Check if page is published
  if (!pageConfig.isPublished) {
    notFound()
  }
  
  // Get SEO data for schema
  const seo = await getSEO(slug)
  
  return (
    <>
      <DynamicSchema seo={seo} />
      <PageRenderer config={pageConfig} />
    </>
  )
}
