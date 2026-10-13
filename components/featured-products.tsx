"use client"

import Link from "next/link"
import { Star } from "lucide-react"
import { useState, useEffect } from "react"
import { getFeaturedProducts, type FeaturedProduct } from "@/lib/api/products"
import { SaleProductCard } from "@/components/sale-product-card"
import { productHref } from "@/lib/product-url"

export function FeaturedProducts() {
  const [products, setProducts] = useState<FeaturedProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true)
        const response = await getFeaturedProducts(8)
        setProducts(response.data)
      } catch {
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchFeaturedProducts()
  }, [])

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-4">
        <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-orange-400/20 via-transparent to-purple-500/20">
          <div className="bg-gradient-to-br from-orange-500 via-red-500 to-rose-600 px-4 py-3">
            <div className="flex items-center justify-between text-white font-semibold">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Featured Products
              </div>
              <span className="text-sm text-white/90">See All</span>
            </div>
          </div>
          <div className="bg-white dark:bg-card px-4 py-4">
            <div className="flex gap-3 overflow-hidden">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-36 w-36 shrink-0 rounded-lg bg-muted animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (!products.length) return null

  return (
    <section className="container mx-auto px-4 py-4">
      <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-orange-400/20 via-transparent to-purple-500/20">
        <div className="bg-gradient-to-br from-orange-500 via-red-500 to-rose-600 px-4 py-3">
          <div className="flex items-center justify-between text-white font-semibold">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Featured Products
            </div>
            <Link href="/categories" className="text-sm text-white/90 hover:underline flex items-center gap-0.5">
              See All <span>&gt;</span>
            </Link>
          </div>
        </div>
        <div className="bg-white dark:bg-card/95 px-4 py-4">
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {products.map((product) => (
              <SaleProductCard
                key={product.id}
                product={product}
                href={productHref(product)}
                itemsLeft={null}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
