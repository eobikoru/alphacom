import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"
import { AppLayout } from "@/components/app-layout"
import { ProductDetailClient } from "@/components/product-detail-client"
import { findProductById, findProductBySlug, type ProductSummary } from "@/lib/server/product-lookup"
import { isProductId, productHref } from "@/lib/product-url"
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

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  if (isProductId(params.slug)) return { title: "Product Details" }

  const product = await resolveProduct(params.slug)
  if (!product) return { title: "Product not found" }

  const url = `${SITE_URL}${productHref(product)}`
  const description = product.description || `Buy ${product.name} at AlphaCom Online, Computer Village Lagos.`
  return {
    title: product.name,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: product.name,
      description,
      url,
      type: "website",
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

  return (
    <AppLayout>
      <ProductDetailClient productId={product.id} />
    </AppLayout>
  )
}
