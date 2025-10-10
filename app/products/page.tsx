"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getProductsWithCategories } from "@/lib/api/products"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/hooks/use-cart"
import { toast } from "sonner"

export default function ProductsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const { addItem } = useCart()

  const { data, isLoading, error } = useQuery({
    queryKey: ["products", page, search],
    queryFn: () => getProductsWithCategories({ page, per_page: 12, search: search || undefined }),
  })

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.main_image || "/placeholder.svg",
      brand: product.brand || "Unknown",
      category: product.category.name,
    })
    toast.success(`${product.name} added to cart`)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">All Products</h1>
          <p className="text-muted-foreground mb-6">Browse our complete collection of premium tech products</p>

          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="w-full h-48 mb-4" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-destructive">Failed to load products. Please try again later.</p>
          </div>
        ) : data?.data.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data?.data.map((product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <Link href={`/products/${product.slug}`}>
                      <div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-muted">
                        <img
                          src={product.main_image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        {product.discount_percentage > 0 && (
                          <Badge className="absolute top-2 right-2 bg-destructive">
                            -{product.discount_percentage}%
                          </Badge>
                        )}
                        {!product.in_stock && (
                          <Badge className="absolute top-2 left-2 bg-muted-foreground">Out of Stock</Badge>
                        )}
                      </div>
                    </Link>

                    <div className="space-y-2">
                      <Link href={`/products/${product.slug}`}>
                        <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground">{product.brand || "Unknown Brand"}</p>
                      <Badge variant="outline" className="text-xs">
                        {product.category.name}
                      </Badge>

                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold">
                          {product.currency}
                          {product.price.toLocaleString()}
                        </span>
                        {product.original_price > product.price && (
                          <span className="text-sm text-muted-foreground line-through">
                            {product.currency}
                            {product.original_price.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 pt-0">
                    <Button className="w-full" onClick={() => handleAddToCart(product)} disabled={!product.in_stock}>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {product.in_stock ? "Add to Cart" : "Out of Stock"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {data?.pagination && data.pagination.total_pages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!data.pagination.has_prev}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-2 px-4">
                  <span className="text-sm text-muted-foreground">
                    Page {data.pagination.page} of {data.pagination.total_pages}
                  </span>
                </div>
                <Button variant="outline" onClick={() => setPage((p) => p + 1)} disabled={!data.pagination.has_next}>
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
