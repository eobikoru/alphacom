"use client"

import Link from "next/link"
import { ChevronRight, Package, Tag, X } from "lucide-react"
import { AppLayout } from "@/components/app-layout"
import { useEffect, useMemo, useState } from "react"
import { getCategoriesWithProducts, type CategoryWithProducts } from "@/lib/api/categories"

const MOBILE_BREAKPOINT = 768

function getBrandsFromCategories(categories: CategoryWithProducts[]): string[] {
  const set = new Set<string>()
  for (const cat of categories) {
    for (const p of cat.direct_products || []) {
      if (p.brand?.trim()) set.add(p.brand.trim())
    }
    for (const sub of cat.subcategories || []) {
      for (const p of sub.products || []) {
        if (p.brand?.trim()) set.add(p.brand.trim())
      }
    }
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b))
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithProducts[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  const brands = useMemo(() => getBrandsFromCategories(categories), [categories])

  useEffect(() => {
    const check = () => setIsMobile(typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

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

          {/* Mobile: backdrop to close subcategory overlay when tapping outside */}
          {openCategoryId && isMobile && (
            <button
              type="button"
              className="fixed inset-0 z-[5] bg-black/20 md:hidden"
              aria-label="Close menu"
              onClick={() => setOpenCategoryId(null)}
            />
          )}

          {!isLoading && !error && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 relative z-[6]">
              {categories.map((category) => {
                const hasSubcategories = category.subcategories && category.subcategories.length > 0
                const isOpen = openCategoryId === category.id

                return (
                  <div
                    key={category.id}
                    className={`group relative rounded-lg border border-border bg-card overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-200 ${isOpen ? "ring-2 ring-primary/30 shadow-lg" : ""}`}
                  >
                    <Link
                      href={hasSubcategories && isMobile ? "#" : `/categories/${category.slug}`}
                      className="flex items-center gap-2 p-3 sm:p-4"
                      onClick={(e) => {
                        if (hasSubcategories && isMobile) {
                          e.preventDefault()
                          setOpenCategoryId(isOpen ? null : category.id)
                        } else {
                          window.scrollTo({ top: 0, behavior: "smooth" })
                        }
                      }}
                    >
                      <Package className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground shrink-0" />
                      <p className="text-xs sm:text-sm font-medium text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                        {category.name}
                      </p>
                    </Link>

                    {/* Subcategories: hover on desktop, open state on mobile */}
                    {hasSubcategories && (
                      <div
                        className={`absolute inset-0 bg-card/98 dark:bg-card/98 backdrop-blur-sm flex flex-col p-2 sm:p-2 border border-border rounded-lg shadow-lg z-10 transition-opacity duration-200 md:pointer-events-none md:group-hover:pointer-events-auto
                          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 md:group-hover:opacity-100"}`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5 shrink-0">
                          <p className="text-[10px] sm:text-[10px] font-semibold text-muted-foreground uppercase tracking-wide px-0.5">
                            Subcategories
                          </p>
                          <button
                            type="button"
                            onClick={() => setOpenCategoryId(null)}
                            className="md:hidden p-1.5 rounded-md hover:bg-accent text-muted-foreground touch-manipulation"
                            aria-label="Close"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-0.5 min-h-0 overscroll-contain">
                          {category.subcategories.slice(0, 10).map((sub) => (
                            <Link
                              key={sub.id}
                              href={`/categories/${category.slug}/${sub.slug}`}
                              onClick={() => {
                                setOpenCategoryId(null)
                                window.scrollTo({ top: 0, behavior: "smooth" })
                              }}
                              className="block text-xs py-2.5 sm:py-1.5 px-2 rounded-md hover:bg-accent active:bg-accent text-foreground hover:text-primary transition-colors touch-manipulation min-h-[44px] sm:min-h-0 flex items-center"
                            >
                              {sub.name}
                            </Link>
                          ))}
                          {category.subcategories.length > 10 && (
                            <p className="text-[10px] text-muted-foreground px-2 pt-1">+ more</p>
                          )}
                        </div>
                        <Link
                          href={`/categories/${category.slug}`}
                          onClick={() => {
                            setOpenCategoryId(null)
                            window.scrollTo({ top: 0, behavior: "smooth" })
                          }}
                          className="mt-auto pt-2 border-t border-border flex items-center justify-center gap-1 text-xs font-medium text-primary hover:underline shrink-0 py-2.5 sm:py-2 touch-manipulation"
                        >
                          View all <ChevronRight className="h-3 w-3" />
                        </Link>
                      </div>
                    )}
                  </div>
                )
              })}
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
