import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"
import { AppLayout } from "@/components/app-layout"
import { ProductDetailClient } from "@/components/product-detail-client"
import { fetchProductDetail, findProductById, findProductBySlug, type ProductSummary } from "@/lib/server/product-lookup"
import type { Product } from "@/lib/api/products"
import { isProductId, productHref } from "@/lib/product-url"
import { micropackGtin } from "@/lib/micropack-barcodes"
import { SITE_URL } from "@/lib/site"

interface ProductPageProps {
  params: {
    slug: string
  }
}

async function resolveProduct(slug: string): Promise<ProductSummary | null> {
  try {
    return await findProductBySlug(decodeURIComponent(slug))
  } catch {
    return null
  }
}

function metaDescription(product: ProductSummary, detail: Product | null) {
  const sku = detail?.sku
  const lead = sku
    ? `Buy ${product.name} at Alphacom Online, Computer Village Lagos. SKU ${sku}.`
    : `Buy ${product.name} at Alphacom Online, Computer Village Lagos.`
  const specs = (detail?.short_description || product.description || detail?.description || "").replace(/\s+/g, " ").trim()
  const combined = specs ? `${lead} ${specs}` : lead
  return combined.slice(0, 320)
}

function productJsonLd(product: Product, url: string) {
  const description = (product.short_description || product.description || `Buy ${product.name} at Alphacom Online.`).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
  const rated = product as Product & { rating?: number | null; review_count?: number | null }
  const aggregateRating =
    rated.rating && rated.review_count && rated.review_count > 0
      ? { "@type": "AggregateRating", ratingValue: rated.rating, reviewCount: rated.review_count }
      : undefined
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku || undefined,
    mpn: product.sku || undefined,
    gtin13: micropackGtin(product),
    brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
    description,
    image: product.main_image ? [product.main_image] : undefined,
    url,
    ...(aggregateRating ? { aggregateRating } : {}),
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: product.currency || "NGN",
      price: String(product.price),
      availability: product.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: "Alphacom Online" },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency: product.currency || "NGN",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "NG",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 1, unitCode: "DAY" },
          transitTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 5, unitCode: "DAY" },
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "NG",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 1,
        returnMethod: ["https://schema.org/ReturnInStore", "https://schema.org/ReturnByMail"],
        returnFees: "https://schema.org/ReturnFeesCustomerResponsibility",
        merchantReturnLink: `${SITE_URL}/return-policy`,
      },
    },
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  if (isProductId(params.slug)) return { title: "Product Details" }

  const product = await resolveProduct(params.slug)
  if (!product) return { title: "Product not found" }

  const detail = await fetchProductDetail(product.id)
  const url = `${SITE_URL}${productHref(product)}`
  const description = metaDescription(product, detail)
  const title = `${product.name} in Lagos`
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: "Alphacom Online",
      ...(product.image ? { images: [{ url: product.image, alt: product.name }] } : {}),
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  if (isProductId(params.slug)) {
    const product = await findProductById(params.slug)
    if (product) permanentRedirect(productHref(product))
    return (
      <AppLayout>
        <ProductDetailClient productId={params.slug} />
      </AppLayout>
    )
  }

  const product = await resolveProduct(params.slug)
  if (!product) notFound()

  const detail = await fetchProductDetail(product.id)
  const url = `${SITE_URL}${productHref(product)}`
  const jsonLd = detail ? JSON.stringify(productJsonLd(detail, url)).replace(/</g, "\\u003c") : null

  return (
    <AppLayout>
      {jsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} /> : null}
      <ProductDetailClient productId={product.id} initialProduct={detail} />
    </AppLayout>
  )
}
