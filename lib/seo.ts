import { adminDB, isAdminInitialized } from "./firebase-admin"
import { SEOPageData, defaultSEOData, defaultSEOPages } from "./types/seo"
import { Metadata } from "next"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://verluxstands.com"

// Cache for SEO data to reduce RTDB reads
const seoCache = new Map<string, { data: SEOPageData; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export async function getSEO(slug: string): Promise<SEOPageData> {
  if (!slug || slug.startsWith(".well-known") || slug.includes(".")) {
    console.log("Requested SEO for invalid slug:", slug)
    return {
      ...defaultSEOData,
      slug,
      canonical: `${baseUrl}/${slug === "home" ? "" : slug}`,
    }
  }

  // Normalize slug
  const normalizedSlug = slug === "/" ? "home" : slug.replace(/^\//, "")

  // Check cache first
  const cached = seoCache.get(normalizedSlug)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }

  // If Firebase Admin is not initialized, return default SEO data
  if (!isAdminInitialized || !adminDB) {
    // Check if we have default SEO data for this slug
    const defaultPage = defaultSEOPages.find(p => p.slug === normalizedSlug)
    if (defaultPage) {
      return defaultPage
    }
    return {
      ...defaultSEOData,
      slug: normalizedSlug,
      canonical: `${baseUrl}/${normalizedSlug === "home" ? "" : normalizedSlug}`,
    }
  }

  try {
    const snap = await adminDB.ref(`seo_pages/${normalizedSlug}`).get()

    if (snap.exists()) {
      const data = snap.val() as SEOPageData
      const seoData = {
        ...data,
        id: normalizedSlug,
        lastUpdated: data.lastUpdated ? new Date(data.lastUpdated) : null,
      }

      // Update cache
      seoCache.set(normalizedSlug, { data: seoData, timestamp: Date.now() })
      return seoData
    }
  } catch (error) {
    console.error(`Error fetching SEO for slug "${normalizedSlug}":`, error)
  }

  // Return default SEO data if not found
  const defaultPage = defaultSEOPages.find(p => p.slug === normalizedSlug)
  if (defaultPage) {
    return defaultPage
  }
  return {
    ...defaultSEOData,
    slug: normalizedSlug,
    canonical: `${baseUrl}/${normalizedSlug === "home" ? "" : normalizedSlug}`,
  }
}

export async function getAllSEOPages(): Promise<SEOPageData[]> {
  // If Firebase Admin is not initialized, return default pages
  if (!isAdminInitialized || !adminDB) {
    return defaultSEOPages
  }

  try {
    const snap = await adminDB.ref("seo_pages").get()
    if (snap.exists()) {
      const data = snap.val() as Record<string, SEOPageData>
      return Object.entries(data).map(([id, pageData]) => ({
        ...pageData,
        id,
      }))
    }
    return defaultSEOPages
  } catch (error) {
    console.error("Error fetching all SEO pages:", error)
    return defaultSEOPages
  }
}

export async function getIndexableSEOPages(): Promise<SEOPageData[]> {
  // If Firebase Admin is not initialized, return default indexable pages
  if (!isAdminInitialized || !adminDB) {
    return defaultSEOPages.filter(p => p.index)
  }

  try {
    const snap = await adminDB.ref("seo_pages").get()
    if (snap.exists()) {
      const data = snap.val() as Record<string, SEOPageData>
      return Object.entries(data)
        .filter(([, pageData]) => pageData.index === true)
        .map(([id, pageData]) => ({
          ...pageData,
          id,
        }))
    }
    return defaultSEOPages.filter(p => p.index)
  } catch (error) {
    console.error("Error fetching indexable SEO pages:", error)
    return defaultSEOPages.filter(p => p.index)
  }
}

export function generateMetadataFromSEO(seo: SEOPageData): Metadata {
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: seo.canonical || `${baseUrl}/${seo.slug === "home" ? "" : seo.slug}`,
    },
    robots: {
      index: seo.index,
      follow: seo.follow,
      googleBot: {
        index: seo.index,
        follow: seo.follow,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: seo.ogTitle || seo.title,
      description: seo.ogDescription || seo.description,
      url: seo.canonical || `${baseUrl}/${seo.slug === "home" ? "" : seo.slug}`,
      siteName: "Verlux Stands",
      images: seo.ogImage
        ? [
          {
            url: seo.ogImage.startsWith("http") ? seo.ogImage : `${baseUrl}${seo.ogImage}`,
            width: 1200,
            height: 630,
            alt: seo.ogTitle || seo.title,
          },
        ]
        : [],
      type: "website",
      locale: "en_GB",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.twitterTitle || seo.title,
      description: seo.twitterDescription || seo.description,
      images: seo.ogImage
        ? [seo.ogImage.startsWith("http") ? seo.ogImage : `${baseUrl}${seo.ogImage}`]
        : [],
    },
  }
}

// SEO Validation utilities for admin dashboard
export function validateSEO(seo: SEOPageData): {
  errors: string[]
  warnings: string[]
  score: number
} {
  const errors: string[] = []
  const warnings: string[] = []
  let score = 100

  // Title validation
  if (!seo.title) {
    errors.push("Title is required")
    score -= 20
  } else if (seo.title.length < 30) {
    warnings.push("Title is too short (recommended: 50-60 characters)")
    score -= 5
  } else if (seo.title.length > 60) {
    warnings.push("Title is too long (recommended: 50-60 characters)")
    score -= 5
  }

  // Description validation
  if (!seo.description) {
    errors.push("Description is required")
    score -= 20
  } else if (seo.description.length < 120) {
    warnings.push("Description is too short (recommended: 150-160 characters)")
    score -= 5
  } else if (seo.description.length > 160) {
    warnings.push("Description is too long (recommended: 150-160 characters)")
    score -= 5
  }

  // Keywords validation
  if (!seo.keywords || seo.keywords.length === 0) {
    warnings.push("No keywords defined")
    score -= 5
  } else if (seo.keywords.length < 3) {
    warnings.push("Consider adding more keywords (recommended: 5-10)")
    score -= 2
  }

  // Canonical validation
  if (!seo.canonical) {
    warnings.push("No canonical URL defined")
    score -= 5
  }

  // OpenGraph validation
  if (!seo.ogTitle) {
    warnings.push("OpenGraph title is missing")
    score -= 3
  }
  if (!seo.ogDescription) {
    warnings.push("OpenGraph description is missing")
    score -= 3
  }
  if (!seo.ogImage) {
    warnings.push("OpenGraph image is missing")
    score -= 5
  }

  // Schema validation
  if (!seo.schemaType) {
    warnings.push("Schema type is not defined")
    score -= 5
  }

  return {
    errors,
    warnings,
    score: Math.max(0, score),
  }
}
