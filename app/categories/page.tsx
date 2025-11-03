"use client"

import Link from "next/link"
import { ChevronRight, Package } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useAppSelector } from "@/store/hooks"
import { AppLayout } from "@/components/app-layout"
import { useEffect, useState } from "react"
import { getCategoriesWithProducts, type CategoryWithProducts } from "@/lib/api/categories"
import { CategoryCardSkeleton } from "@/components/skeletons/category-card-skeleton"

export default function CategoriesPage() {
  const isDark = useAppSelector((state) => state.theme.isDark)
  const [categories, setCategories] = useState<CategoryWithProducts[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
      } catch (error) {
        console.error("Failed to fetch categories:", error)
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
          <div className="text-center mb-12">
            <h1 className="text-4xl mt-4 font-normal mb-4 text-foreground">Shop by Category</h1>
            <p className="text-[1rem] text-muted-foreground max-w-2xl mx-auto">
              Discover our extensive range of technology products organized by category
            </p>
          </div>

          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <CategoryCardSkeleton key={i} />
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
            </div>
          )}

          {!isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category) => (
                <Card
                  key={category.id}
                  className="group hover:shadow-2xl transition-all duration-300 border-0 bg-card/80 hover:bg-card backdrop-blur-xl transform hover:scale-[1.02]"
                >
                  <CardContent className="p-6">
                    {/* Category Header */}
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        {category.image_url ? (
                          <img
                            src={category.image_url || "/placeholder.svg"}
                            alt={category.name}
                            className="w-full h-full object-cover rounded-2xl"
                          />
                        ) : (
                          <Package className="w-8 h-8 text-white" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-normal text-card-foreground group-hover:text-cyan-600 transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {category.description || "Explore our collection"}
                        </p>
                      </div>
                    </div>

                    {/* Subcategories */}
                    <div className="space-y-3">
                      {category.subcategories.slice(0, 4).map((subcategory) => (
                        <Link
                          key={subcategory.id}
                          href={`/categories/${category.slug}/${subcategory.slug}`}
                          className="flex items-center justify-between p-3 rounded-lg transition-all duration-200 hover:bg-accent text-card-foreground hover:text-accent-foreground"
                        >
                          <span className="font-medium">{subcategory.name}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">({subcategory.product_count})</span>
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* View All Link */}
                    <div className="mt-6 pt-4 border-t border-border">
                      <Link
                        href={`/categories/${category.slug}`}
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        className="flex items-center justify-center space-x-2 text-cyan-600 hover:text-cyan-700 font-normal transition-colors"
                      >
                        <span>View All {category.name}</span>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Featured Categories Banner */}
          <div className="mt-16">
            <div className="rounded-3xl p-8 bg-gradient-to-r from-muted to-accent border border-border">
              <div className="text-center">
                <h2 className="text-xl font-normal mb-4 text-foreground">Can't find what you're looking for?</h2>
                <p className="text-lg mb-6 text-muted-foreground">
                  Contact our expert team for personalized recommendations
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-600 to-purple-700 hover:from-cyan-700 hover:to-purple-800 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  <span>Contact Us</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
