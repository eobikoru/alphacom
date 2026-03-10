import type { Metadata } from "next"
import { SITE_URL, SEO_BRANDS } from "@/lib/site"

const BRAND_DESCRIPTIONS: Record<string, string> = {
  Logitech:
    "Buy genuine Logitech products at AlphaCom Online – mice, keyboards, webcams, headsets & more. Authorized Logitech partner in Computer Village Lagos with 100% warranty.",
  Anker:
    "Shop Anker chargers, power banks, cables & accessories at AlphaCom Online. Authorized Anker partner in Lagos with fast delivery across Nigeria.",
  SanDisk:
    "Buy SanDisk memory cards, USB drives & storage at AlphaCom Online. Authorized SanDisk partner in Computer Village Lagos. Genuine products, warranty.",
  Micropack:
    "Shop Micropack accessories and tech at AlphaCom Online. Computer Village Lagos. Quality products with expert support and fast delivery.",
}

function getBrandMeta(brandSlug: string) {
  const decoded = decodeURIComponent(brandSlug)
  const known = SEO_BRANDS.find((b) => b.slug.toLowerCase() === decoded.toLowerCase())
  const name = known?.name ?? decoded
  const description =
    BRAND_DESCRIPTIONS[name] ??
    `Shop ${name} products at AlphaCom Online – premium technology store in Computer Village Lagos. Genuine products, warranty & fast delivery.`
  return { name, description }
}

type Props = { params: { brand: string }; children: React.ReactNode }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand } = params
  const { name, description } = getBrandMeta(brand)
  const title = `Buy ${name} Products | AlphaCom Online – Lagos`
  const url = `${SITE_URL}/brands/${encodeURIComponent(name)}`

  return {
    title,
    description,
    keywords: [
      `${name} Nigeria`,
      `${name} Lagos`,
      `buy ${name} Lagos`,
      `${name} Computer Village`,
      `AlphaCom ${name}`,
      "authorized " + name,
    ],
    openGraph: {
      title,
      description,
      url,
      siteName: "AlphaCom Online",
      type: "website",
      images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630, alt: `${name} at AlphaCom Online` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: { canonical: url },
    robots: { index: true, follow: true },
  }
}

export default async function BrandLayout({ params, children }: Props) {
  const { brand } = params
  const { name } = getBrandMeta(brand)
  const description =
    BRAND_DESCRIPTIONS[name] ?? `Shop ${name} products at AlphaCom Online – premium technology store in Lagos.`
  const collectionUrl = `${SITE_URL}/brands/${encodeURIComponent(name)}`
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${name} Products | AlphaCom Online`,
    description,
    url: collectionUrl,
    isPartOf: { "@id": `${SITE_URL}/#organization` },
    about: { "@type": "Brand", name },
    mainEntity: {
      "@type": "ItemList",
      name: `${name} products`,
      description: `Genuine ${name} products available at AlphaCom Online, Computer Village Lagos.`,
    },
  }
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Brands", item: `${SITE_URL}/categories` },
      { "@type": "ListItem", position: 3, name: name, item: collectionUrl },
    ],
  }
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {children}
    </>
  )
}
