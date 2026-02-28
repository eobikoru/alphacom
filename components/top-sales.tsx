"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { TrendingUp } from "lucide-react"
import { getCategoriesWithProducts, type CategoryWithProducts, type CategoryProduct } from "@/lib/api/categories"
import { SaleProductCard } from "@/components/sale-product-card"

const TOP_SALES_LIMIT = 12

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

function shuffleAndTake<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

export function TopSales() {
  const [items, setItems] = useState<CategoryProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getCategoriesWithProducts()
        if (!res.success || !res.data) {
          setLoading(false)
          return
        }
        const all = collectAllProducts(res.data)
        setItems(shuffleAndTake(all, TOP_SALES_LIMIT))
      } catch {
        setItems([])
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-4">
        <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-orange-400/20 via-transparent to-purple-500/20">
          <div className="bg-gradient-to-br from-orange-500 via-red-500 to-rose-600 px-4 py-3">
            <div className="flex items-center justify-between text-white font-semibold">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Top Sales
              </div>
              <span className="text-sm text-white/90">See All</span>
            </div>
          </div>
          <div className="bg-white dark:bg-card px-4 py-4">
            <div className="flex gap-3 overflow-hidden">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-36 w-36 shrink-0 rounded-lg bg-muted animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (!items.length) return null

  return (
    <section className="container mx-auto px-4 py-4">
      <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-orange-400/20 via-transparent to-purple-500/20">
        <div className="bg-gradient-to-br from-orange-500 via-red-500 to-rose-600 px-4 py-3">
          <div className="flex items-center justify-between text-white font-semibold">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Sales
            </div>
            <Link href="/categories" className="text-sm text-white/90 hover:underline flex items-center gap-0.5">
              See All <span>&gt;</span>
            </Link>
          </div>
        </div>
        <div className="bg-white dark:bg-card/95 px-4 py-4">
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {items.map((product) => (
              <SaleProductCard
                key={product.id}
                product={product}
                href={`/products/${product.id}`}
                itemsLeft={null}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
