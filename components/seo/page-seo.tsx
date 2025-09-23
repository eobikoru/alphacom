import { generateMetadata } from "./seo-head"
import { StructuredData } from "./structured-data"
import { Breadcrumbs } from "./breadcrumbs"

interface PageSEOProps {
  title: string
  description: string
  keywords?: string[]
  image?: string
  url: string
  type?: "website" | "article" | "product"
  structuredData?: Record<string, any>
  breadcrumbs?: Array<{ label: string; href: string }>
  noIndex?: boolean
  canonical?: string
}

export function PageSEO({
  title,
  description,
  keywords = [],
  image,
  url,
  type = "website",
  structuredData,
  breadcrumbs,
  noIndex = false,
  canonical,
}: PageSEOProps) {
  return (
    <>
      {structuredData && <StructuredData data={structuredData} />}
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} className="mb-6" />}
    </>
  )
}

// Export metadata generation for use in page files
export { generateMetadata }
