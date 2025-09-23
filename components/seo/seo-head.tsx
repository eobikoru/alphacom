import type { Metadata } from "next"

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: "website" | "article" | "product"
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
  tags?: string[]
  price?: string
  currency?: string
  availability?: "in stock" | "out of stock" | "preorder"
  brand?: string
  category?: string
  noIndex?: boolean
  noFollow?: boolean
  canonical?: string
}

export function generateMetadata({
  title = "Premium E-Commerce Store | Best Products & Deals Online",
  description = "Discover premium products at unbeatable prices. Shop electronics, fashion, home goods & more with fast shipping, secure checkout & 24/7 customer support.",
  keywords = [],
  image = "/images/og-image.jpg",
  url = "https://www.alphacomonline.com",
  type = "website",
  noIndex = false,
  noFollow = false,
  canonical,
}: SEOHeadProps): Metadata {
  const baseUrl = "https://www.alphacomonline.com"
  const fullUrl = url.startsWith("http") ? url : `${baseUrl}${url}`
  const fullImageUrl = image.startsWith("http") ? image : `${baseUrl}${image}`

  return {
    title,
    description,
    keywords: keywords.join(", "),
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: "Premium Store",
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_US",
      type: type as any,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [fullImageUrl],
      creator: "@premiumstore",
    },
    robots: {
      index: !noIndex,
      follow: !noFollow,
      googleBot: {
        index: !noIndex,
        follow: !noFollow,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: canonical || fullUrl,
    },
  }
}

// Rich Snippets Components
export function ArticleStructuredData({
  headline,
  description,
  image,
  datePublished,
  dateModified,
  author,
  url,
}: {
  headline: string
  description: string
  image: string
  datePublished: string
  dateModified?: string
  author: string
  url: string
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: headline,
    description: description,
    image: image,
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: "Premium Store",
      logo: {
        "@type": "ImageObject",
        url: "https://www.alphacomonline.com/images/logo.png",
      },
    },
    url: url,
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
}

export function LocalBusinessStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Premium Store",
    image: "https://www.alphacomonline.com/images/store-front.jpg",
    telephone: "+1-555-123-4567",
    email: "contact@premiumstore.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "123 Commerce Street",
      addressLocality: "New York",
      addressRegion: "NY",
      postalCode: "10001",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "40.7128",
      longitude: "-74.0060",
    },
    url: "https://www.alphacomonline.com",
    sameAs: [
      "https://facebook.com/premiumstore",
      "https://twitter.com/premiumstore",
      "https://instagram.com/premiumstore",
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        opens: "10:00",
        closes: "16:00",
      },
    ],
    priceRange: "$$",
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
}
