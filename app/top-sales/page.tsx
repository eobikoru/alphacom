"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { TrendingUp, ArrowLeft } from "lucide-react"
import { getCategoriesWithProducts, type CategoryWithProducts, type CategoryProduct } from "@/lib/api/categories"
import { SaleProductCard } from "@/components/sale-product-card"
import { AppLayout } from "@/components/app-layout"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

const MAX_PRODUCTS = 20

function collectAllProducts(categories: CategoryWithProducts[]): CategoryProduct[] {
  const byId = new Map<string, CategoryProduct>()
  for (const cat of categories) {
    for (const p of cat.direct_products || []) byId.set(p.id, p)
    for (const sub of cat.subcategories || []) {
      for (const p of sub.products || []) byId.set(p.id, p)
    }
  }
  return Array.from(byId.values())
}

export default function TopSalesPage() {
  const [products, setProducts] = useState<CategoryProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getCategoriesWithProducts()
        if (res.success && res.data) setProducts(collectAllProducts(res.data).slice(0, MAX_PRODUCTS))
      } catch {
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

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
          <div className="flex items-center gap-2 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-rose-600 text-white">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Top Sales</h1>
              <p className="text-sm text-muted-foreground">All top selling products</p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="rounded-lg border border-border overflow-hidden">
                  <Skeleton className="h-24 w-full" />
                  <div className="p-2 space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : !products.length ? (
            <p className="text-center text-muted-foreground py-12">No top sale products at the moment.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {products.map((product) => (
                <SaleProductCard
                  key={product.id}
                  product={product}
                  href={`/products/${product.id}`}
                  itemsLeft={null}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
