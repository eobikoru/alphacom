"use client"

import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ShoppingCart } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { getProductsWithCategories } from "@/lib/api/products"
import { useCart } from "@/hooks/use-cart"
import { toast } from "sonner"

export default function BrandPage() {
  const params = useParams()
  const router = useRouter()
  const brandName = typeof params.brand === "string" ? decodeURIComponent(params.brand) : ""
  const { addItem } = useCart()

  const { data, isLoading, error } = useQuery({
    queryKey: ["products", "brand", brandName],
    queryFn: () => getProductsWithCategories({ page: 1, per_page: 24, search: brandName }),
    enabled: !!brandName,
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
    <AppLayout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button
              variant="ghost"
              size="sm"
              className="mb-4 -ml-2 gap-1.5 text-muted-foreground hover:text-foreground"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">Shop by Brand: {brandName}</h1>
            <p className="text-muted-foreground mt-1">Products from {brandName}</p>
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
              <Button variant="outline" className="mt-4" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
          ) : !data?.data.length ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products found for this brand.</p>
              <Link href="/categories">
                <Button variant="outline" className="mt-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Categories
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data?.data.map((product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <Link href={`/products/id/${product.id}`}>
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
                      <Link href={`/products/id/${product.id}`}>
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
          )}
        </div>
      </div>
    </AppLayout>
  )
}
