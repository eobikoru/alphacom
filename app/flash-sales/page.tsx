import type { Metadata } from "next"
import Link from "next/link"
import { SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
  title: "Flash sales in Lagos",
  description: "Today's flash sale products at AlphaCom Online, Computer Village, Ikeja. Photos, prices, and stock are on the page.",
  alternates: { canonical: `${SITE_URL}/flash-sales` },
}
import { Zap, ArrowLeft } from "lucide-react"
import { SaleProductCard } from "@/components/sale-product-card"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { productHref } from "@/lib/product-url"
import { collectAllProducts, fetchCategoriesWithProducts } from "@/lib/server/catalogue"

export default async function FlashSalesPage() {
  const products = collectAllProducts(await fetchCategoriesWithProducts()).slice(0, 20)

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4 -ml-2 gap-1.5 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <div className="mb-6 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-rose-600 text-white">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Flash Sales</h1>
              <p className="text-sm text-muted-foreground">All flash sale products</p>
            </div>
          </div>

          {!products.length ? (
            <p className="py-12 text-center text-muted-foreground">No flash sale products at the moment.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {products.map((product) => (
                <SaleProductCard key={product.id} product={product} href={productHref(product)} itemsLeft={null} />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
