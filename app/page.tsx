import { AppLayout } from "@/components/app-layout"
import { HeroSection } from "@/components/hero-section"
import { ProductCategories } from "@/components/product-categories"
import { ShopByBrands } from "@/components/shop-by-brands"
import { FlashSales } from "@/components/flash-sales"
import { TopSales } from "@/components/top-sales"
import { FeaturedProducts } from "@/components/featured-products"
import { LandingScrollAnimations } from "@/components/landing-scroll-animations"

export default function HomePage() {
  return (
    <AppLayout>
      <LandingScrollAnimations>
        <HeroSection />
        <FlashSales />
        <TopSales />
        <ShopByBrands />
        <ProductCategories />
        <FeaturedProducts />
      </LandingScrollAnimations>
    </AppLayout>
  )
}
