"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { getCategoriesWithProducts, type CategoryWithProducts, type CategoryProduct } from "@/lib/api/categories"
import { SaleProductCard } from "@/components/sale-product-card"

const ITEMS_PER_CATEGORY = 12

function collectCategoryProducts(category: CategoryWithProducts): CategoryProduct[] {
  const byId = new Map<string, CategoryProduct>()
  for (const p of category.direct_products || []) byId.set(p.id, p)
  for (const sub of category.subcategories || []) {
    for (const p of sub.products || []) byId.set(p.id, p)
  }
  return Array.from(byId.values())
}

function shuffleAndTake<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

export function ProductCategories() {
  const [categories, setCategories] = useState<CategoryWithProducts[]>([])
  const [categoryProducts, setCategoryProducts] = useState<Map<string, CategoryProduct[]>>(new Map())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategoriesWithProducts()
        if (response.success && response.data) {
          setCategories(response.data)
          const map = new Map<string, CategoryProduct[]>()
          for (const cat of response.data) {
            const all = collectCategoryProducts(cat)
            map.set(cat.id, shuffleAndTake(all, ITEMS_PER_CATEGORY))
          }
          setCategoryProducts(map)
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (isLoading) {
    return (
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-muted-foreground">Loading categories...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 lg:py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,119,198,0.05),transparent_50%)]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-2xl lg:text-3xl font-semibold mb-2 text-foreground">
            Shop by Category
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our comprehensive range of technology products
          </p>
        </div>

        <div className="space-y-6">
          {categories.map((category) => {
            const products = categoryProducts.get(category.id) ?? []
            if (products.length === 0) return null

            return (
              <div key={category.id} className="rounded-2xl overflow-hidden bg-gradient-to-br from-orange-400/15 via-transparent to-purple-500/15">
                <div className="bg-gradient-to-br from-orange-500 via-red-500 to-rose-600 px-4 py-2.5">
                  <div className="flex items-center justify-between text-white font-semibold">
                    <span>{category.name}</span>
                    <Link href={`/categories/${category.slug}`} className="text-sm text-white/90 hover:underline flex items-center gap-0.5">
                      See All <span>&gt;</span>
                    </Link>
                  </div>
                </div>
                <div className="bg-white dark:bg-card/95 px-4 py-3">
                  <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                    {products.map((product) => (
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
            )
          })}
        </div>
      </div>
    </section>
  )
}
