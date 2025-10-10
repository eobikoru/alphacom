import type { Metadata } from "next"
import { ProductDetailClient } from "@/components/product-detail-client"

interface ProductPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  return {
    title: `Product Details`,
    description: "View product details",
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  return <ProductDetailClient productId={params.id} />
}
