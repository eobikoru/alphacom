import { AppLayout } from "@/components/app-layout"
import { HeroSection } from "@/components/hero-section"
import { ProductCategories } from "@/components/product-categories"
import { ShopByBrands } from "@/components/shop-by-brands"
import { FlashSales } from "@/components/flash-sales"
import { TopSales } from "@/components/top-sales"
import { FeaturedProducts } from "@/components/featured-products"

export default function HomePage() {
  return (
    <AppLayout>
      <main>
        <HeroSection />
        <FlashSales />
        <TopSales />
        <ProductCategories />
        <ShopByBrands />
        <FeaturedProducts />
      </main>
    </AppLayout>
  )
}
