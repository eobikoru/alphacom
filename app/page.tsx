import type { Metadata } from "next"
import { AppLayout } from "@/components/app-layout"
import { HeroSection, ShopByBrands } from "@/components/home-chrome"
import { TraceInvite } from "@/components/trace-invite"
import { ProductCategories } from "@/components/product-categories"
import { FlashSales } from "@/components/flash-sales"
import { TopSales } from "@/components/top-sales"
import { FeaturedProducts } from "@/components/featured-products"
import { LandingScrollAnimations } from "@/components/landing-scroll-animations"
import { fetchCategoriesWithProducts, fetchFeaturedProducts } from "@/lib/server/catalogue"
import { SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
  title: { absolute: "AlphaCom Online | Computer Village, Lagos" },
  description:
    "Shop every product AlphaCom sells at No 3 Adepele Street, Computer Village, Ikeja. Genuine products, warranty, and delivery across Nigeria.",
  alternates: { canonical: SITE_URL },
}

export default async function HomePage() {
  const [categories, featured] = await Promise.all([fetchCategoriesWithProducts(), fetchFeaturedProducts(8)])

  return (
    <AppLayout>
      <LandingScrollAnimations>
        <HeroSection />
        <TraceInvite />
        <FlashSales categories={categories} />
        <TopSales categories={categories} />
        <ShopByBrands />
        <ProductCategories categories={categories} />
        <FeaturedProducts products={featured} />
      </LandingScrollAnimations>
    </AppLayout>
  )
}
