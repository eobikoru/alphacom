"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Package } from 'lucide-react'
import Link from "next/link"
import { useEffect, useState } from "react"
import { getCategoriesWithProducts, type CategoryWithProducts } from "@/lib/api/categories"

export function ProductCategories() {
  const [categories, setCategories] = useState<CategoryWithProducts[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategoriesWithProducts()
        if (response.success) {
          setCategories(response.data)
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
    <section className="py-20 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,119,198,0.05),transparent_50%)]"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 mb-6">
            <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Premium Collections
            </span>
          </div>

          <h2 className="text-2xl lg:text-4xl font-normal mb-6 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
            Shop by Category
          </h2>
          <p className="text-xl lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Explore our comprehensive range of technology products and find exactly what you need
          </p>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/categories/${category.slug}`}>
              <Card className="group hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500 border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl cursor-pointer overflow-hidden relative h-full">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-transparent to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
                <div className="absolute inset-[1px] bg-card/90 backdrop-blur-xl rounded-lg"></div>

                <CardContent className="p-0 relative z-10 flex flex-col h-full">
                  <div className="relative overflow-hidden flex-shrink-0">
                    <div className="relative h-24 lg:h-32 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 opacity-60 group-hover:opacity-80 transition-all duration-500" />
                      <img
                        src={category.image_url || "/placeholder.svg?height=400&width=600"}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />

                      <div className="absolute top-2 left-2">
                        <div className="bg-background/90 backdrop-blur-xl border border-white/20 p-1.5 rounded-lg group-hover:scale-110 transition-transform duration-300">
                          <Package className="h-3 w-3 text-primary" />
                        </div>
                      </div>

                      <div className="absolute top-2 right-2">
                        <div className="bg-background/90 backdrop-blur-xl border border-white/20 px-2 py-1 rounded-full text-xs font-semibold">
                          {category.total_product_count}
                        </div>
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                    </div>
                  </div>

                  <div className="p-3 flex-grow flex flex-col">
                    <h3 className="text-base font-normal mb-2 group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 line-clamp-2">
                      {category.name}
                    </h3>
                    <p className="text-muted-foreground mb-2 text-xs leading-snug line-clamp-1">
                      {category.description || "Explore our collection"}
                    </p>

                    {category.subcategories.length > 0 && (
                      <p className="text-xs text-muted-foreground mb-2">
                        {category.subcategories.length} subcategories
                      </p>
                    )}

                    <Button
                      variant="ghost"
                      className="p-0 h-auto font-semibold text-primary hover:text-primary/80 group/btn text-xs mt-auto"
                    >
                      <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                        Shop
                      </span>
                      <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 group-hover:text-cyan-400 transition-all duration-300" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
