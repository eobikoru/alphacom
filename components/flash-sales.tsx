"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { Zap } from "lucide-react"
import { getCategoriesWithProducts, type CategoryWithProducts, type CategoryProduct } from "@/lib/api/categories"
import { SaleProductCard } from "@/components/sale-product-card"

const TWENTY_FOUR_HR_MS = 24 * 60 * 60 * 1000

function getFirstProductFromCategory(category: CategoryWithProducts): CategoryProduct | null {
  if (category.direct_products?.length) return category.direct_products[0]
  const firstSub = category.subcategories?.[0]
  if (firstSub?.products?.length) return firstSub.products[0]
  return null
}

function formatTimeLeft(ms: number): string {
  if (ms <= 0) return "00h : 00m : 00s"
  const totalSeconds = Math.floor(ms / 1000)
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  return `${String(h).padStart(2, "0")}h : ${String(m).padStart(2, "0")}m : ${String(s).padStart(2, "0")}s`
}

export function FlashSales() {
  const [items, setItems] = useState<{ category: CategoryWithProducts; product: CategoryProduct }[]>([])
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState<string>(() => formatTimeLeft(TWENTY_FOUR_HR_MS))
  const endTimeRef = useRef<number>(Date.now() + TWENTY_FOUR_HR_MS)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getCategoriesWithProducts()
        if (!res.success || !res.data) {
          setLoading(false)
          return
        }
        const list: { category: CategoryWithProducts; product: CategoryProduct }[] = []
        for (const cat of res.data) {
          const product = getFirstProductFromCategory(cat)
          if (product) list.push({ category: cat, product })
        }
        setItems(list)
      } catch {
        setItems([])
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  useEffect(() => {
    const tick = () => {
      const now = Date.now()
      let end = endTimeRef.current
      if (now >= end) {
        end = now + TWENTY_FOUR_HR_MS
        endTimeRef.current = end
      }
      setTimeLeft(formatTimeLeft(end - now))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-400/20 via-transparent to-purple-500/20">
          <div className="bg-gradient-to-br from-orange-500 via-red-500 to-rose-600 px-4 py-3">
            <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-semibold">
                <Zap className="h-5 w-5" />
                Flash Sales
              </div>
              <p className="text-white/90 text-sm tabular-nums">Time Left: {timeLeft}</p>
              <span className="text-white/90 text-sm">See All</span>
            </div>
          </div>
          <div className="bg-white dark:bg-card px-4 py-4">
            <div className="flex gap-3 overflow-hidden">
              {[1, 2, 3, 4].map((i) => (
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
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-400/20 via-transparent to-purple-500/20">
      {/* Red banner header - concept style */}
      <div className="bg-gradient-to-br from-orange-500 via-red-500 to-rose-600 px-4 py-3">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-white font-semibold">
            <Zap className="h-5 w-5" />
            Flash Sales
          </div>
          <p className="text-white text-sm tabular-nums">
            Time Left: <span className="font-semibold">{timeLeft}</span>
          </p>
          <Link
            href="/categories"
            className="text-white font-medium text-sm hover:underline flex items-center gap-0.5"
          >
            See All <span className="ml-0.5">&gt;</span>
          </Link>
        </div>
      </div>
      {/* White product area */}
      <div className="bg-white dark:bg-card/95 px-4 py-4">
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {items.map(({ category, product }) => (
            <SaleProductCard
              key={`${category.id}-${product.id}`}
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
