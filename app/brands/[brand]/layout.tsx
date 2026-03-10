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
  Acer: "Shop Acer laptops, monitors, and PCs at AlphaCom Online. Computer Village Lagos. Genuine Acer with warranty and fast delivery across Nigeria.",
  Amazon: "Shop Amazon devices and accessories at AlphaCom Online. Lagos. Quality products with expert support and delivery across Nigeria.",
  Apple: "Buy Apple accessories, cables, and compatible products at AlphaCom Online. Computer Village Lagos. Genuine products, warranty & fast delivery.",
  Belkin: "Shop Belkin cables, chargers, and accessories at AlphaCom Online. Lagos. Quality products with expert support and nationwide delivery.",
  Canon: "Buy Canon cameras, printers, and accessories at AlphaCom Online. Authorized Canon products in Computer Village Lagos. Warranty & fast delivery.",
  Dell: "Shop Dell laptops, monitors, and PCs at AlphaCom Online. Computer Village Lagos. Genuine Dell with warranty and delivery across Nigeria.",
  Epson: "Buy Epson printers and ink at AlphaCom Online. Computer Village Lagos. Genuine Epson products with warranty and fast delivery.",
  HP: "Shop HP laptops, printers, and accessories at AlphaCom Online. Computer Village Lagos. Genuine HP with warranty and delivery across Nigeria.",
  Huawei: "Buy Huawei phones, tablets, and accessories at AlphaCom Online. Lagos. Genuine products with warranty and fast delivery across Nigeria.",
  JBL: "Shop JBL speakers, headphones, and earbuds at AlphaCom Online. Computer Village Lagos. Genuine JBL with warranty and delivery.",
  Kingston: "Buy Kingston memory cards, SSDs, and USB drives at AlphaCom Online. Lagos. Genuine Kingston with warranty and fast delivery.",
  Lenovo: "Shop Lenovo laptops, PCs, and accessories at AlphaCom Online. Computer Village Lagos. Genuine Lenovo with warranty and delivery across Nigeria.",
  LG: "Buy LG monitors, TVs, and accessories at AlphaCom Online. Lagos. Genuine LG products with warranty and fast delivery.",
  Microsoft: "Shop Microsoft Surface, accessories, and software at AlphaCom Online. Computer Village Lagos. Genuine products with warranty and delivery.",
  Samsung: "Buy Samsung phones, monitors, and accessories at AlphaCom Online. Computer Village Lagos. Genuine Samsung with warranty and delivery across Nigeria.",
  Seagate: "Shop Seagate hard drives and storage at AlphaCom Online. Lagos. Genuine Seagate with warranty and fast delivery.",
  Sony: "Buy Sony headphones, cameras, and electronics at AlphaCom Online. Computer Village Lagos. Genuine Sony with warranty and delivery.",
  "TP-Link": "Shop TP-Link routers, extenders, and networking at AlphaCom Online. Lagos. Genuine TP-Link with warranty and fast delivery.",
  WD: "Buy WD and Western Digital drives and storage at AlphaCom Online. Computer Village Lagos. Genuine products with warranty and delivery.",
  Xiaomi: "Shop Xiaomi phones, power banks, and accessories at AlphaCom Online. Lagos. Genuine Xiaomi with warranty and delivery across Nigeria.",
  APC: "Buy APC UPS, surge protectors, and power solutions at AlphaCom Online. Lagos. Genuine APC with warranty and fast delivery.",
  "D-Link": "Shop D-Link routers, switches, and networking at AlphaCom Online. Computer Village Lagos. Genuine D-Link with warranty and delivery.",
  DJI: "Buy DJI drones and accessories at AlphaCom Online. Lagos. Genuine DJI products with warranty and fast delivery across Nigeria.",
  Hikvision: "Shop Hikvision cameras and security systems at AlphaCom Online. Computer Village Lagos. Genuine Hikvision with warranty and delivery.",
  Kaspersky: "Buy Kaspersky antivirus and security at AlphaCom Online. Lagos. Genuine software with expert support and delivery.",
  Lexar: "Shop Lexar memory cards and storage at AlphaCom Online. Lagos. Genuine Lexar with warranty and fast delivery.",
  Norton: "Buy Norton antivirus and security at AlphaCom Online. Computer Village Lagos. Genuine Norton with expert support and delivery.",
  Remax: "Shop Remax cables, chargers, and accessories at AlphaCom Online. Lagos. Quality products with warranty and fast delivery.",
  Transcend: "Buy Transcend memory cards, SSDs, and storage at AlphaCom Online. Computer Village Lagos. Genuine Transcend with warranty and delivery.",
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
