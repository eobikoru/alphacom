import type { Metadata } from "next"
import { AppLayout } from "@/components/app-layout"
import { ProductDetailClient } from "@/components/product-detail-client"

interface ProductPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  return {
    title: `Product - ${params.slug}`,
    description: "View product details",
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  return (
    <AppLayout>
      <ProductDetailClient slug={params.slug} />
    </AppLayout>
  )
}
