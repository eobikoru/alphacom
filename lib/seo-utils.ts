// SEO utility functions
export function generatePageTitle(title: string, includeStore = true): string {
  if (includeStore) {
    return `${title} | Premium Store`
  }
  return title
}

export function generateMetaDescription(description: string, maxLength = 160): string {
  if (description.length <= maxLength) {
    return description
  }
  return description.substring(0, maxLength - 3) + "..."
}

export function generateKeywords(baseKeywords: string[], pageSpecific: string[] = []): string[] {
  const defaultKeywords = [
    "premium store",
    "online shopping",
    "best deals",
    "fast shipping",
    "secure checkout",
    "customer support",
  ]

  return [...new Set([...defaultKeywords, ...baseKeywords, ...pageSpecific])]
}

export function generateCanonicalUrl(path: string): string {
  const baseUrl = "https://your-domain.com"
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`
}

export function generateOpenGraphImage(title: string, category?: string): string {
  // In a real app, you might generate dynamic OG images
  const baseUrl = "https://your-domain.com"
  if (category) {
    return `${baseUrl}/images/og/${category}.jpg`
  }
  return `${baseUrl}/images/og-default.jpg`
}

// Schema.org helpers
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function generateProductSchema(product: {
  name: string
  description: string
  image: string[]
  price: number
  currency: string
  availability: string
  brand?: string
  sku?: string
  gtin?: string
  rating?: {
    value: number
    count: number
  }
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    brand: product.brand
      ? {
          "@type": "Brand",
          name: product.brand,
        }
      : undefined,
    sku: product.sku,
    gtin: product.gtin,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: product.currency,
      availability: `https://schema.org/${product.availability}`,
      seller: {
        "@type": "Organization",
        name: "Premium Store",
      },
    },
    aggregateRating: product.rating
      ? {
          "@type": "AggregateRating",
          ratingValue: product.rating.value,
          reviewCount: product.rating.count,
          bestRating: 5,
          worstRating: 1,
        }
      : undefined,
  }
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Premium Store",
    url: "https://your-domain.com",
    logo: "https://your-domain.com/images/logo.png",
    description: "Premium e-commerce store offering the best products at unbeatable prices",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-555-123-4567",
      contactType: "customer service",
      availableLanguage: ["English"],
      areaServed: "US",
    },
    sameAs: [
      "https://facebook.com/premiumstore",
      "https://twitter.com/premiumstore",
      "https://instagram.com/premiumstore",
      "https://linkedin.com/company/premiumstore",
    ],
  }
}

// Core Web Vitals optimization helpers
export function preloadCriticalResources() {
  if (typeof window !== "undefined") {
    // Preload critical fonts
    const fontLink = document.createElement("link")
    fontLink.rel = "preload"
    fontLink.href = "/fonts/geist-sans.woff2"
    fontLink.as = "font"
    fontLink.type = "font/woff2"
    fontLink.crossOrigin = "anonymous"
    document.head.appendChild(fontLink)

    // Preload critical images
    const heroImage = new Image()
    heroImage.src = "/premium-modern-tech-workspace-with-sleek-devices-a.jpg"
  }
}

// // Performance monitoring
// export function measureWebVitals() {
//   if (typeof window !== "undefined" && "web-vital" in window) {
//     import("web-vitals").then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
//       getCLS(console.log)
//       getFID(console.log)
//       getFCP(console.log)
//       getLCP(console.log)
//       getTTFB(console.log)
//     })
//   }
// }
