"use client"

import { cdnImage } from "@/lib/image-url"
import { useState, useMemo, useEffect } from "react"
import { Search, Filter, Grid3X3, List, ChevronDown, Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Skeleton } from "@/components/ui/skeleton"
import { useWishlist } from "@/hooks/use-wishlist"
import { useCart } from "@/hooks/use-cart"
import { toast } from "sonner"
import Link from "next/link"
import { getCategoriesWithProducts, getSubcategoriesByCategory, type CategoryWithProducts } from "@/lib/api/categories"
import { searchProducts, type ProductSearchHit } from "@/lib/api/products"
import { ProductCardSkeleton } from "@/components/skeletons/product-card-skeleton"
import { productHref } from "@/lib/product-url"
import { searchIncludes } from "@/lib/site"

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
  initialCategories?: CategoryWithProducts[]
}

function shelfForCategory(categories: CategoryWithProducts[], categorySlug: string) {
  const category = categories.find((item) => item.slug === categorySlug) ?? null
  const products = (category?.subcategories || []).flatMap((subcategory) => subcategory.products || [])
  return { category, products }
}

export function CategoryPage({ categorySlug, selectedSubcategory, initialCategories = [] }: CategoryPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [priceRange, setPriceRange] = useState([0, 1000000])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [inStockOnly, setInStockOnly] = useState(false)
  const [onSaleOnly, setOnSaleOnly] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const seeded = initialCategories.length ? shelfForCategory(initialCategories, categorySlug) : null
  const [categoriesData, setCategoriesData] = useState<any[]>(initialCategories)
  const [loading, setLoading] = useState(seeded === null)
  const [currentCategory, setCurrentCategory] = useState<any>(seeded?.category ?? null)
  const [allProducts, setAllProducts] = useState<any[]>(seeded?.products ?? [])
  const [searchHits, setSearchHits] = useState<ProductSearchHit[] | null>(null)

  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { addItem, isInCart, getItemQuantity } = useCart()

  useEffect(() => {
    if (seeded) return
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

  useEffect(() => {
    const q = searchQuery.trim()
    if (q.length < 2) {
      setSearchHits(null)
      return
    }
    const timer = setTimeout(() => {
      searchProducts({ q, page: 1, per_page: 20 })
        .then((response) => setSearchHits(response.success && response.data ? response.data : []))
        .catch(() => setSearchHits([]))
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const categoryName = currentCategory?.name || "Products"
  const subcategories = currentCategory?.subcategories || []

  const brands = useMemo(() => {
    const brandSet = new Set(allProducts.map((p) => p.brand).filter(Boolean))
    return Array.from(brandSet)
  }, [allProducts])

  const filteredProducts = useMemo(() => {
    let products = searchHits ?? allProducts

    // Filter by selected subcategory
    if (!searchHits && selectedSubcategory) {
      const subcategory = subcategories.find((sub: any) => sub.slug === selectedSubcategory)
      if (subcategory) {
        products = subcategory.products || []
      }
    }

    return products.filter((product) => {
      const matchesSearch = searchHits ? true : searchIncludes(product.name, searchQuery)
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand)
      const matchesStock = !inStockOnly || product.in_stock
      const matchesSale = !onSaleOnly || product.discount_percentage > 0

      return matchesSearch && matchesPrice && matchesBrand && matchesStock && matchesSale
    })
  }, [allProducts, searchHits, selectedSubcategory, subcategories, searchQuery, priceRange, selectedBrands, inStockOnly, onSaleOnly])

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

  const pageTitle = selectedSubcategory
    ? subcategories.find((sub: any) => sub.slug === selectedSubcategory)?.name || categoryName
    : categoryName

  if (loading) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-10 bg-background text-foreground sm:py-14">
        <Skeleton className="mb-8 h-4 w-40" />
        <Skeleton className="mb-3 h-10 w-72" />
        <Skeleton className="mb-10 h-4 w-96 max-w-full" />
        <div className="mb-10 flex gap-6 border-b border-border pb-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-24" />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i}>
              <Skeleton className="aspect-square w-full" />
              <Skeleton className="mt-3 h-4 w-4/5" />
              <Skeleton className="mt-2 h-4 w-1/3" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-6xl bg-background px-4 py-10 text-foreground sm:py-14">
      <nav className="mb-8 flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
        <Link href="/" className="transition-colors hover:text-foreground">Home</Link>
        <span aria-hidden>/</span>
        <Link href="/categories" className="transition-colors hover:text-foreground">All categories</Link>
        <span aria-hidden>/</span>
        {selectedSubcategory ? (
          <Link href={`/categories/${categorySlug}`} className="transition-colors hover:text-foreground">{categoryName}</Link>
        ) : (
          <span className="text-foreground">{categoryName}</span>
        )}
        {selectedSubcategory && (
          <>
            <span aria-hidden>/</span>
            <span className="text-foreground">{pageTitle}</span>
          </>
        )}
      </nav>

      <div className="mb-8 flex items-end justify-between gap-6 border-b border-border pb-5">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#8E1B2C]">Category</p>
          <h1 className="mt-2 text-3xl font-medium tracking-tight sm:text-4xl">{pageTitle}</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            {currentCategory?.description ||
              `Buy ${pageTitle} at AlphaCom Online in Computer Village, Ikeja, Lagos.`}
          </p>
        </div>
        <p className="shrink-0 text-sm tabular-nums text-muted-foreground">{sortedProducts.length}</p>
      </div>

      {subcategories.length > 0 && (
        <div className="mb-10 flex flex-wrap gap-x-6 gap-y-3 border-b border-border">
          <Link
            href={`/categories/${categorySlug}`}
            className={`-mb-px border-b-2 pb-3 text-sm transition-colors ${
              !selectedSubcategory
                ? "border-[#8E1B2C] text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </Link>
          {subcategories.map((subcategory: any) => (
            <Link
              key={subcategory.id}
              href={`/categories/${categorySlug}/${subcategory.slug}`}
              className={`-mb-px border-b-2 pb-3 text-sm transition-colors ${
                selectedSubcategory === subcategory.slug
                  ? "border-[#8E1B2C] text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {subcategory.name}
            </Link>
          ))}
        </div>
      )}

      <div className="mb-8" id="products-section">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search in this category"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-border bg-transparent pl-10 focus-visible:ring-[#8E1B2C]/30"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] border-border bg-transparent">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="price-low">Price, low to high</SelectItem>
                <SelectItem value="price-high">Price, high to low</SelectItem>
                <SelectItem value="rating">Highest rated</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center border border-border">
              <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")} className="h-9 w-9 rounded-none p-0" aria-label="Grid view">
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")} className="h-9 w-9 rounded-none p-0" aria-label="List view">
                <List className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="gap-2 border-border bg-transparent">
              <Filter className="h-4 w-4" />
              Filter
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
                  <h3 className="mb-3 text-sm font-medium text-foreground">Price</h3>
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
                  <h3 className="mb-3 text-sm font-medium text-foreground">Brand</h3>
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
                  <h3 className="mb-3 text-sm font-medium text-foreground">Availability</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="in-stock" checked={inStockOnly} onCheckedChange={(checked) => setInStockOnly(checked === true)} />
                      <label htmlFor="in-stock" className="cursor-pointer text-sm text-card-foreground">
                        In stock ({allProducts.filter((p) => p.in_stock).length})
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="on-sale" checked={onSaleOnly} onCheckedChange={(checked) => setOnSaleOnly(checked === true)} />
                      <label htmlFor="on-sale" className="cursor-pointer text-sm text-card-foreground">
                        On sale ({allProducts.filter((p) => p.discount_percentage > 0).length})
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
      </div>

      <p className="mb-6 text-sm text-muted-foreground">
        {sortedProducts.length} {sortedProducts.length === 1 ? "product" : "products"}
      </p>

      <div className={viewMode === "grid" ? "grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4" : "mx-auto grid max-w-xl grid-cols-1 gap-y-8"}>
        {sortedProducts.map((product) => {
          const productInWishlist = isInWishlist(product.id)
          const productInCart = isInCart(product.id)
          const cartQuantity = getItemQuantity(product.id)
          const inStock = product.in_stock

          return (
            <Card key={product.id} className="group overflow-hidden rounded-none border-border bg-card shadow-none">
              <div className="relative">
                <div className="aspect-square w-full overflow-hidden bg-muted">
                  <Link href={productHref(product)} className="block h-full w-full">
                    <img
                      src={cdnImage(product.main_image, 600) || "/placeholder.svg"}
                      alt={product.name}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  </Link>
                </div>
                {product.discount_percentage > 0 && (
                  <span className="absolute right-2 top-2 bg-[#8E1B2C] px-1.5 py-0.5 text-[10px] font-medium text-white">
                    -{Math.round(product.discount_percentage)}%
                  </span>
                )}
                {!inStock && (
                  <span className="absolute inset-0 flex items-center justify-center bg-background/70 text-xs font-medium text-foreground">
                    Out of stock
                  </span>
                )}
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute left-2 top-2 h-8 w-8 rounded-full bg-background/90 p-0 hover:bg-background"
                  onClick={() => toggleWishlist(product)}
                  aria-label={productInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart className={`h-3.5 w-3.5 ${productInWishlist ? "fill-[#8E1B2C] text-[#8E1B2C]" : ""}`} />
                </Button>
              </div>
              <CardContent className="p-3">
                {product.brand ? <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{product.brand}</p> : null}
                <Link href={productHref(product)}>
                  <p className="mt-1 line-clamp-2 text-sm leading-5 text-foreground transition-colors hover:text-[#8E1B2C]">
                    {product.name}
                  </p>
                </Link>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-sm text-foreground">{formatPrice(product.price)}</span>
                  {product.discount_percentage > 0 && product.original_price && (
                    <span className="text-xs text-muted-foreground line-through">{formatPrice(product.original_price)}</span>
                  )}
                </div>
                <Button
                  onClick={() => handleAddToCart(product)}
                  disabled={!inStock}
                  size="sm"
                  className="mt-3 h-9 w-full text-xs"
                  variant={productInCart ? "secondary" : "default"}
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                  {!inStock ? "Out of stock" : productInCart ? `${cartQuantity} in cart` : "Add to cart"}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Empty State */}
      {sortedProducts.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-sm text-muted-foreground">Nothing in this category matches that search.</p>
        </div>
      )}
    </div>
  )
}
