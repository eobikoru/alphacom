"use client"

import { useState, useMemo, useEffect } from "react"
import { Search, Filter, Grid3X3, List, ChevronDown, Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Skeleton } from "@/components/ui/skeleton"
import { useWishlist } from "@/hooks/use-wishlist"
import { useCart } from "@/hooks/use-cart"
import { toast } from "sonner"
import Link from "next/link"
import { getCategoriesWithProducts, getSubcategoriesByCategory } from "@/lib/api/categories"
import { ProductCardSkeleton } from "@/components/skeletons/product-card-skeleton"

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviews: number
  brand: string
  category: string
  inStock: boolean
  isNew?: boolean
  isOnSale?: boolean
}

interface CategoryPageProps {
  categorySlug: string
  selectedSubcategory?: string
}

export function CategoryPage({ categorySlug, selectedSubcategory }: CategoryPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [priceRange, setPriceRange] = useState([0, 1000000])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  const [categoriesData, setCategoriesData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentCategory, setCurrentCategory] = useState<any>(null)
  const [allProducts, setAllProducts] = useState<any[]>([])

  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { addItem, isInCart, getItemQuantity } = useCart()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const categoriesResponse = await getCategoriesWithProducts()

        if (!categoriesResponse.success) {
          toast.error("Failed to load categories")
          return
        }

        const category = categoriesResponse.data.find((cat: any) => cat.slug === categorySlug)

        if (!category) {
          toast.error("Category not found")
          return
        }

        setCurrentCategory(category)

        const subcategoriesResponse = await getSubcategoriesByCategory(category.id)

        if (subcategoriesResponse.success) {
          // Collect all products from subcategories
          const products: any[] = []

          // Add products from subcategories
          subcategoriesResponse.data.forEach((sub: any) => {
            if (sub.products) {
              products.push(...sub.products)
            }
          })

          // Update category with fetched subcategories
          setCurrentCategory({
            ...category,
            subcategories: subcategoriesResponse.data,
          })

          setAllProducts(products)
        }
      } catch (error) {
        console.error("[v0] Error fetching category data:", error)
        toast.error("Failed to load category data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [categorySlug])

  const categoryName = currentCategory?.name || "Products"
  const subcategories = currentCategory?.subcategories || []

  const brands = useMemo(() => {
    const brandSet = new Set(allProducts.map((p) => p.brand).filter(Boolean))
    return Array.from(brandSet)
  }, [allProducts])

  const filteredProducts = useMemo(() => {
    let products = allProducts

    // Filter by selected subcategory
    if (selectedSubcategory) {
      const subcategory = subcategories.find((sub: any) => sub.slug === selectedSubcategory)
      if (subcategory) {
        products = subcategory.products || []
      }
    }

    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand)

      return matchesSearch && matchesPrice && matchesBrand
    })
  }, [allProducts, selectedSubcategory, subcategories, searchQuery, priceRange, selectedBrands])

  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts]

    switch (sortBy) {
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price)
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price)
      case "rating":
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      case "newest":
        return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      default:
        return sorted
    }
  }, [filteredProducts, sortBy])

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`
  }

  const toggleWishlist = (product: any) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
      toast.success(`${product.name} has been removed from your wishlist`)
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image_url,
        category: product.category,
        brand: product.brand,
      })
      toast.success(`${product.name} has been added to your wishlist`)
    }
  }

  const handleAddToCart = (product: any) => {
    if (!product.in_stock) {
      toast.error("This item is currently out of stock")
      return
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.main_image,
      brand: product.brand,
      category: product.category,
    })

    toast.success(`${product.name} has been added to your cart`)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 bg-background text-foreground">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center space-x-2 mb-6">
          <Skeleton className="h-4 w-12" />
          <span>/</span>
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Page Header Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>

        {/* Subcategories Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-7 w-48 mb-4" />
          <div className="hidden md:flex flex-wrap gap-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-32 rounded-full" />
            ))}
          </div>
        </div>

        {/* Search and Filters Bar Skeleton */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-6 mb-8">
          <div className="flex flex-col gap-4">
            <Skeleton className="h-10 w-full max-w-md mx-auto lg:mx-0" />
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
              <Skeleton className="h-10 w-full sm:w-48" />
              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
          </div>
        </div>

        {/* Results Count Skeleton */}
        <Skeleton className="h-5 w-48 mb-6" />

        {/* Products Grid Skeleton - small cards */}
        <div className="grid gap-3 grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="rounded-lg border border-border overflow-hidden">
              <Skeleton className="w-full aspect-[4/3]" />
              <div className="p-2 space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-background text-foreground">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
        <span>Home</span>
        <span>/</span>
        <span className="text-foreground font-medium">{categoryName}</span>
        {selectedSubcategory && (
          <>
            <span>/</span>
            <span className="text-foreground font-medium">
              {subcategories.find((sub: any) => sub.slug === selectedSubcategory)?.name || selectedSubcategory}
            </span>
          </>
        )}
      </nav>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {selectedSubcategory
            ? subcategories.find((sub: any) => sub.slug === selectedSubcategory)?.name || categoryName
            : categoryName}
        </h1>
        <p className="text-muted-foreground">
          {currentCategory?.description || `Discover our premium collection of ${categoryName.toLowerCase()}`}
        </p>
      </div>

      {subcategories.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-light text-foreground mb-4">Shop by Subcategory</h2>

          {/* Mobile Dropdown */}
          <div className="md:hidden mb-4">
            <Select
              value={selectedSubcategory || "all"}
              onValueChange={(value) => {
                if (value && value !== "all") {
                  window.location.href = `/categories/${categorySlug}/${value}`
                  setTimeout(() => {
                    const productsSection = document.getElementById("products-section")
                    if (productsSection) {
                      productsSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      })
                    }
                  }, 100)
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a subcategory" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {subcategories.map((subcategory: any) => (
                  <SelectItem key={subcategory.id} value={subcategory.slug}>
                    {subcategory.name} ({subcategory.product_count || 0} items)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="hidden md:flex flex-wrap gap-3">
            {subcategories.map((subcategory: any) => (
              <Link
                key={subcategory.id}
                href={`/categories/${categorySlug}/${subcategory.slug}`}
                className="group"
                onClick={(e) => {
                  setTimeout(() => {
                    const productsSection = document.getElementById("products-section")
                    if (productsSection) {
                      productsSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      })
                    }
                  }, 100)
                }}
              >
                <div
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all duration-200 hover:shadow-md hover:scale-105 ${
                    selectedSubcategory === subcategory.slug
                      ? "bg-cyan-50 border-cyan-200 text-cyan-700 shadow-sm"
                      : "bg-card border-border hover:border-cyan-200 hover:bg-cyan-50/50"
                  }`}
                >
                  <span
                    className={`font-medium text-sm ${
                      selectedSubcategory === subcategory.slug
                        ? "text-cyan-700"
                        : "text-card-foreground group-hover:text-cyan-600"
                    }`}
                  >
                    {subcategory.name}
                  </span>
                  <Badge
                    variant="secondary"
                    className={`text-xs px-2 py-0.5 ${
                      selectedSubcategory === subcategory.slug
                        ? "bg-cyan-100 text-cyan-600 border-cyan-200"
                        : "bg-muted text-muted-foreground group-hover:bg-cyan-100 group-hover:text-cyan-600"
                    }`}
                  >
                    {subcategory.product_count || 0}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="bg-card rounded-2xl shadow-sm border border-border p-6 mb-8" id="products-section">
        <div className="flex flex-col gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md mx-auto lg:mx-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-input focus:border-cyan-500 focus:ring-cyan-500"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
            {/* Sort - Featured */}
            <div className="w-full sm:w-auto">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              {/* View Mode */}
              <div className="flex items-center border border-border rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-8 w-8 p-0"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-8 w-8 p-0"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Filter Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
              </Button>
            </div>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Price Range */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Price Range</h3>
                  <div className="space-y-3">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={1000000}
                      step={10000}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{formatPrice(priceRange[0])}</span>
                      <span>{formatPrice(priceRange[1])}</span>
                    </div>
                  </div>
                </div>

                {/* Brands */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Brands</h3>
                  <div className="space-y-2">
                    {brands.map((brand) => (
                      <div key={brand} className="flex items-center space-x-2">
                        <Checkbox
                          id={brand}
                          checked={selectedBrands.includes(brand)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedBrands([...selectedBrands, brand])
                            } else {
                              setSelectedBrands(selectedBrands.filter((b) => b !== brand))
                            }
                          }}
                        />
                        <label htmlFor={brand} className="text-sm text-card-foreground cursor-pointer">
                          {brand}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Availability</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="in-stock" />
                      <label htmlFor="in-stock" className="text-sm text-card-foreground cursor-pointer">
                        In Stock ({allProducts.filter((p) => p.in_stock).length})
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="on-sale" />
                      <label htmlFor="on-sale" className="text-sm text-card-foreground cursor-pointer">
                        On Sale ({allProducts.filter((p) => p.discount_percentage > 0).length})
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-muted-foreground">
          Showing {sortedProducts.length} of {allProducts.length} results
        </p>
      </div>

      {/* Products Grid - small cards */}
      <div
        className={`grid gap-3 ${
          viewMode === "grid"
            ? "grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6"
            : "grid-cols-1 max-w-xl"
        }`}
      >
        {sortedProducts.map((product) => {
          const productInWishlist = isInWishlist(product.id)
          const productInCart = isInCart(product.id)
          const cartQuantity = getItemQuantity(product.id)
          const inStock = product.in_stock

          return (
            <Card
              key={product.id}
              className="group hover:shadow-md transition-all duration-300 border-border overflow-hidden bg-card"
            >
              <div className="relative">
                <div className="w-full aspect-[4/3] overflow-hidden bg-muted">
                  <Link href={`/products/id/${product.id}`} className="block w-full h-full">
                    <img
                      src={product.main_image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                </div>
                {product.discount_percentage > 0 && (
                  <span className="absolute top-1 right-1 rounded bg-amber-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    -{Math.round(product.discount_percentage)}%
                  </span>
                )}
                {!inStock && (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-[10px] font-medium text-white">
                    Out of Stock
                  </span>
                )}
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-1 left-1 h-7 w-7 p-0 rounded-full bg-background/90 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => toggleWishlist(product)}
                >
                  <Heart className={`h-3.5 w-3.5 ${productInWishlist ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
              </div>
              <CardContent className="p-2">
                <Link href={`/products/id/${product.id}`}>
                  <p className="text-xs font-medium text-foreground line-clamp-2 leading-tight hover:text-primary">
                    {product.name}
                  </p>
                </Link>
                <div className="mt-1 flex items-center gap-1">
                  <span className="text-sm font-bold text-foreground">{formatPrice(product.price)}</span>
                  {product.discount_percentage > 0 && product.original_price && (
                    <span className="text-[10px] text-muted-foreground line-through">
                      {formatPrice(product.original_price)}
                    </span>
                  )}
                </div>
                <Button
                  onClick={() => handleAddToCart(product)}
                  disabled={!inStock}
                  size="sm"
                  className="mt-2 h-7 w-full text-xs"
                  variant={productInCart ? "secondary" : "default"}
                >
                  <ShoppingCart className="h-3 w-3 mr-1" />
                  {!inStock ? "Out" : productInCart ? cartQuantity : "Cart"}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Empty State */}
      {sortedProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No products found matching your criteria.</p>
        </div>
      )}

      {/* Load More */}
      {sortedProducts.length > 0 && sortedProducts.length < allProducts.length && (
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="px-8 bg-transparent">
            Load More Products
          </Button>
        </div>
      )}
    </div>
  )
}
