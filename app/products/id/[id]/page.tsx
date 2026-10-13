import type { Metadata } from "next"
import { permanentRedirect } from "next/navigation"
import { AppLayout } from "@/components/app-layout"
import { ProductDetailClient } from "@/components/product-detail-client"
import { findProductById } from "@/lib/server/product-lookup"
import { productHref } from "@/lib/product-url"

interface ProductPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Product Details`,
    description: "View product details",
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await findProductById(params.id)
  if (product) permanentRedirect(productHref(product))

  return (
    <AppLayout>
      <ProductDetailClient productId={params.id} />
    </AppLayout>
  )
}
