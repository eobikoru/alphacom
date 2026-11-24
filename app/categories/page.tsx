"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { AppLayout } from "@/components/app-layout"
import { useEffect, useMemo, useState } from "react"
import { getCategoriesWithProducts, getBrandsFromCategories, type CategoryWithProducts } from "@/lib/api/categories"

function groupBrands(brands: string[]) {
  const groups = new Map<string, string[]>()
  for (const brand of brands) {
    const first = brand.trim().charAt(0).toUpperCase()
    const letter = /[A-Z]/.test(first) ? first : "#"
    const list = groups.get(letter) ?? []
    list.push(brand)
    groups.set(letter, list)
  }
  return Array.from(groups.entries())
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithProducts[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const brands = useMemo(() => getBrandsFromCategories(categories), [categories])
  const brandGroups = useMemo(() => groupBrands(brands), [brands])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true)
        const response = await getCategoriesWithProducts()
        if (response.success) {
          setCategories(response.data)
        } else {
          setError("Failed to load categories")
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err)
        setError("Failed to load categories")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto max-w-5xl px-4 py-10 sm:py-14">
          <div className="mb-8 flex items-end justify-between gap-6 border-b border-border pb-5">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#8E1B2C]">Browse</p>
              <h1 className="mt-2 text-3xl font-medium tracking-tight text-foreground sm:text-4xl">Shop by category</h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                Discover our range of technology products by category.
              </p>
            </div>
            {!isLoading && !error ? (
              <p className="shrink-0 text-sm tabular-nums text-muted-foreground">{categories.length}</p>
            ) : null}
          </div>

          {isLoading && (
            <div className="grid md:grid-cols-2 md:gap-x-16">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className="border-b border-border py-4">
                  <div className="h-4 w-2/5 animate-pulse rounded bg-muted" />
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="py-12 text-center">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          {!isLoading && !error && (
            <ul className="grid md:grid-cols-2 md:gap-x-16">
              {categories.map((category) => (
                <li key={category.id} className="border-b border-border">
                  <Link
                    href={`/categories/${category.slug}`}
                    className="group flex items-baseline justify-between gap-6 py-4"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  >
                    <span className="text-[15px] font-medium text-foreground transition-colors group-hover:text-[#8E1B2C]">
                      {category.name}
                    </span>
                    <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                      {category.total_product_count} {category.total_product_count === 1 ? "product" : "products"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {!isLoading && !error && brands.length > 0 && (
            <section className="mt-16 sm:mt-20">
              <div className="mb-8 flex items-end justify-between gap-6 border-b border-border pb-5">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#8E1B2C]">Browse</p>
                  <h2 className="mt-2 text-3xl font-medium tracking-tight text-foreground sm:text-4xl">Shop by brand</h2>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                    Find products from the brands we stock.
                  </p>
                </div>
                <p className="shrink-0 text-sm tabular-nums text-muted-foreground">{brands.length}</p>
              </div>
              <div className="columns-2 gap-x-10 sm:columns-3 lg:columns-4">
                {brandGroups.map(([letter, names]) => (
                  <div key={letter} className="mb-8 break-inside-avoid">
                    <p className="border-b border-border pb-2 text-xs font-medium tracking-[0.2em] text-[#8E1B2C]">{letter}</p>
                    <ul className="mt-3 space-y-2">
                      {names.map((brand) => (
                        <li key={brand}>
                          <Link
                            href={`/brands/${encodeURIComponent(brand)}`}
                            className="text-sm text-foreground transition-colors hover:text-[#8E1B2C]"
                          >
                            {brand}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Featured Categories Banner */}
          <div className="mt-10 sm:mt-16 px-0">
            <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-8 bg-gradient-to-r from-muted to-accent border border-border">
              <div className="text-center">
                <h2 className="text-base sm:text-xl font-semibold mb-2 sm:mb-4 text-foreground">Can't find what you're looking for?</h2>
                <p className="text-sm sm:text-lg mb-4 sm:mb-6 text-muted-foreground">
                  Contact our expert team for personalized recommendations
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-purple-700 hover:from-cyan-700 hover:to-purple-800 text-white font-semibold px-6 py-2.5 sm:px-8 sm:py-3 rounded-xl transition-all duration-300 active:scale-[0.98] text-sm sm:text-base min-h-[44px]"
                >
                  <span>Contact Us</span>
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
