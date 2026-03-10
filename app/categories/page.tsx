"use client"

import Link from "next/link"
import { ChevronRight, Package, Tag } from "lucide-react"
import { AppLayout } from "@/components/app-layout"
import { useEffect, useMemo, useState } from "react"
import { getCategoriesWithProducts, getBrandsFromCategories, type CategoryWithProducts } from "@/lib/api/categories"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithProducts[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const brands = useMemo(() => getBrandsFromCategories(categories), [categories])

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
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-6 sm:mb-10 px-1">
            <h1 className="text-2xl sm:text-3xl font-semibold mb-1.5 sm:mb-2 text-foreground">Shop by Category</h1>
            <p className="text-muted-foreground max-w-2xl text-xs sm:text-sm">
              Discover our range of technology products by category
            </p>
          </div>

          {isLoading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="rounded-lg border border-border overflow-hidden bg-card p-3 sm:p-4">
                  <div className="h-5 w-3/4 bg-muted rounded animate-pulse" />
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
            </div>
          )}

          {!isLoading && !error && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 relative z-[6]">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="group relative rounded-lg border border-border bg-card overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-200 flex items-center gap-2 p-3 sm:p-4"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                  <Package className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground shrink-0" />
                  <p className="text-xs sm:text-sm font-medium text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                    {category.name}
                  </p>
                </Link>
              ))}
            </div>
          )}

          {/* Shop by Brands */}
          {!isLoading && !error && brands.length > 0 && (
            <div className="mt-6 sm:mt-8">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">Shop by Brand</h2>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {brands.map((brand) => (
                  <Link
                    key={brand}
                    href={`/brands/${encodeURIComponent(brand)}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-foreground hover:bg-accent hover:border-primary/30 hover:text-primary transition-colors"
                  >
                    <Tag className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground shrink-0" />
                    {brand}
                  </Link>
                ))}
              </div>
            </div>
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
