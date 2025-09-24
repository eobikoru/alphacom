import { AppLayout } from "@/components/app-layout"
import { HeroSection } from "@/components/hero-section"
import { ProductCategories } from "@/components/product-categories"
import { FeaturedProducts } from "@/components/featured-products"

export default function HomePage() {
  return (
    <AppLayout>
      <main>
        <HeroSection />
        <ProductCategories />
        <FeaturedProducts />
      </main>
    </AppLayout>
  )
}
