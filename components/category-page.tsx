"use client"

import { useState, useMemo } from "react"
import { Search, Filter, Grid3X3, List, ChevronDown, Star, Heart, ShoppingCart, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { useAppDispatch } from "@/store/hooks"
import { addItem } from "@/store/slices/cartSlice"
import { useWishlist } from "@/contexts/wishlist-context"
// import { toast } from "@/hooks/use-toast"
import Link from "next/link"

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

const mockProducts: Product[] = [
  {
    id: "1",
    name: "HP Color LaserJet CP5225 Printer CE710A",
    price: 105000,
    image: "/hp-color-laserjet-printer-white-modern.jpg",
    rating: 4.5,
    reviews: 128,
    brand: "HP",
    category: "Printers & Scanners",
    inStock: true,
    isNew: true,
  },
  {
    id: "2",
    name: "HP 415 All in One Ink Tank Wireless Printer",
    price: 58000,
    originalPrice: 65000,
    image: "/hp-all-in-one-wireless-printer-modern-white.jpg",
    rating: 4.3,
    reviews: 89,
    brand: "HP",
    category: "Printers & Scanners",
    inStock: true,
    isOnSale: true,
  },
  {
    id: "3",
    name: "Canon PIXMA G3020 Wireless All-in-One Printer",
    price: 680000,
    image: "/canon-pixma-printer-black-professional.jpg",
    rating: 4.7,
    reviews: 156,
    brand: "Canon",
    category: "Printers & Scanners",
    inStock: true,
  },
  {
    id: "4",
    name: "Epson EcoTank L3250 Wi-Fi All-in-One Ink Tank Printer",
    price: 950000,
    image: "/epson-ecotank-printer-modern-design.jpg",
    rating: 4.6,
    reviews: 203,
    brand: "Epson",
    category: "Printers & Scanners",
    inStock: false,
  },
  {
    id: "5",
    name: "Brother DCP-L2540DW Wireless Laser Printer",
    price: 310000,
    image: "/brother-laser-printer-compact-white.jpg",
    rating: 4.2,
    reviews: 74,
    brand: "Brother",
    category: "Printers & Scanners",
    inStock: true,
  },
  {
    id: "6",
    name: "HP LaserJet Pro M404dn Monochrome Printer",
    price: 640000,
    image: "/hp-laserjet-pro-printer-professional-black.jpg",
    rating: 4.8,
    reviews: 312,
    brand: "HP",
    category: "Printers & Scanners",
    inStock: true,
    isNew: true,
  },
]

const categories = {
  "computers-accessories": "Computers & Accessories",
  cameras: "Cameras",
  "audio-speakers": "Audio & Speakers",
  "data-storage": "Data Storage",
  "printers-scanners": "Printers & Scanners",
  networking: "Networking",
  "software-security": "Software & Security",
  accessories: "Accessories",
}

const categorySubcategories = {
  "computers-accessories": [
    { id: "desktop-computers", name: "Desktop Computers", count: 156 },
    { id: "laptops", name: "Laptops & Notebooks", count: 234 },
    { id: "tablets", name: "Tablets", count: 89 },
    { id: "monitors", name: "Monitors & Displays", count: 167 },
    { id: "keyboards-mice", name: "Keyboards & Mice", count: 298 },
    { id: "computer-components", name: "Computer Components", count: 445 },
    { id: "computer-accessories", name: "Computer Accessories", count: 356 },
    { id: "external-drives", name: "External Drives", count: 123 },
  ],
  cameras: [
    { id: "digital-cameras", name: "Digital Cameras", count: 89 },
    { id: "dslr-cameras", name: "DSLR Cameras", count: 67 },
    { id: "mirrorless-cameras", name: "Mirrorless Cameras", count: 78 },
    { id: "action-cameras", name: "Action Cameras", count: 45 },
    { id: "camera-lenses", name: "Camera Lenses", count: 123 },
    { id: "tripods-stands", name: "Tripods & Stands", count: 89 },
    { id: "camera-accessories", name: "Camera Accessories", count: 234 },
    { id: "memory-cards", name: "Memory Cards", count: 156 },
  ],
  "audio-speakers": [
    { id: "headphones", name: "Headphones", count: 234 },
    { id: "earbuds", name: "Earbuds & Earphones", count: 189 },
    { id: "bluetooth-speakers", name: "Bluetooth Speakers", count: 145 },
    { id: "soundbars", name: "Soundbars", count: 67 },
    { id: "home-audio", name: "Home Audio Systems", count: 89 },
    { id: "microphones", name: "Microphones", count: 78 },
    { id: "audio-accessories", name: "Audio Accessories", count: 123 },
    { id: "professional-audio", name: "Professional Audio", count: 56 },
  ],
  "data-storage": [
    { id: "external-hard-drives", name: "External Hard Drives", count: 167 },
    { id: "usb-flash-drives", name: "USB Flash Drives", count: 234 },
    { id: "memory-cards", name: "Memory Cards", count: 189 },
    { id: "internal-hard-drives", name: "Internal Hard Drives", count: 123 },
    { id: "solid-state-drives", name: "Solid State Drives (SSD)", count: 145 },
    { id: "network-storage", name: "Network Storage (NAS)", count: 67 },
    { id: "optical-media", name: "Optical Media", count: 89 },
    { id: "storage-accessories", name: "Storage Accessories", count: 78 },
  ],
  "printers-scanners": [
    { id: "inkjet-printers", name: "Inkjet Printers", count: 123 },
    { id: "laser-printers", name: "Laser Printers", count: 89 },
    { id: "all-in-one-printers", name: "All-in-One Printers", count: 156 },
    { id: "photo-printers", name: "Photo Printers", count: 67 },
    { id: "3d-printers", name: "3D Printers", count: 45 },
    { id: "scanners", name: "Scanners", count: 78 },
    { id: "printer-ink", name: "Printer Ink & Toner", count: 234 },
    { id: "printer-accessories", name: "Printer Accessories", count: 145 },
  ],
  networking: [
    { id: "routers", name: "Routers", count: 89 },
    { id: "modems", name: "Modems", count: 67 },
    { id: "switches", name: "Network Switches", count: 78 },
    { id: "access-points", name: "Access Points", count: 56 },
    { id: "network-adapters", name: "Network Adapters", count: 123 },
    { id: "cables", name: "Network Cables", count: 189 },
    { id: "powerline", name: "Powerline Networking", count: 45 },
    { id: "network-accessories", name: "Network Accessories", count: 134 },
  ],
  "software-security": [
    { id: "antivirus", name: "Antivirus Software", count: 67 },
    { id: "operating-systems", name: "Operating Systems", count: 45 },
    { id: "office-software", name: "Office Software", count: 89 },
    { id: "design-software", name: "Design Software", count: 78 },
    { id: "security-software", name: "Security Software", count: 123 },
    { id: "backup-software", name: "Backup Software", count: 56 },
    { id: "utility-software", name: "Utility Software", count: 134 },
    { id: "educational-software", name: "Educational Software", count: 67 },
  ],
  accessories: [
    { id: "phone-accessories", name: "Phone Accessories", count: 345 },
    { id: "laptop-accessories", name: "Laptop Accessories", count: 234 },
    { id: "tablet-accessories", name: "Tablet Accessories", count: 156 },
    { id: "gaming-accessories", name: "Gaming Accessories", count: 189 },
    { id: "charging-cables", name: "Charging Cables", count: 267 },
    { id: "cases-covers", name: "Cases & Covers", count: 456 },
    { id: "screen-protectors", name: "Screen Protectors", count: 234 },
    { id: "stands-mounts", name: "Stands & Mounts", count: 123 },
  ],
}

export function CategoryPage({ categorySlug, selectedSubcategory }: CategoryPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [priceRange, setPriceRange] = useState([0, 1000000])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  const dispatch = useAppDispatch()
  const { state: wishlistState, dispatch: wishlistDispatch } = useWishlist()

  const categoryName = categories[categorySlug as keyof typeof categories] || "Products"
  const subcategories = categorySubcategories[categorySlug as keyof typeof categorySubcategories] || []

  const brands = useMemo(() => {
    const brandSet = new Set(mockProducts.map((p) => p.brand))
    return Array.from(brandSet)
  }, [])

  const filteredProducts = useMemo(() => {
    return mockProducts.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand)

      return matchesSearch && matchesPrice && matchesBrand
    })
  }, [searchQuery, priceRange, selectedBrands])

  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts]

    switch (sortBy) {
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price)
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price)
      case "rating":
        return sorted.sort((a, b) => b.rating - a.rating)
      case "newest":
        return sorted.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
      default:
        return sorted
    }
  }, [filteredProducts, sortBy])

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`
  }

  const addToCart = (product: Product) => {
    dispatch(
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        brand: product.brand,
      }),
    )

    // toast({
    //   title: "Added to cart",
    //   description: `${product.name} has been added to your cart.`,
    // })
  }

  const toggleWishlist = (product: Product) => {
    const isInWishlist = wishlistState.items.some((item) => item.id === product.id)

    if (isInWishlist) {
      wishlistDispatch({ type: "REMOVE_ITEM", payload: product.id })
      // toast({
      //   title: "Removed from wishlist",
      //   description: `${product.name} has been removed from your wishlist.`,
      // })
    } else {
      wishlistDispatch({
        type: "ADD_ITEM",
        payload: {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          brand: product.brand,
        },
      })
      // toast({
      //   title: "Added to wishlist",
      //   description: `${product.name} has been added to your wishlist.`,
      // })
    }
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
              {subcategories.find((sub) => sub.id === selectedSubcategory)?.name || selectedSubcategory}
            </span>
          </>
        )}
      </nav>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {selectedSubcategory
            ? subcategories.find((sub) => sub.id === selectedSubcategory)?.name || categoryName
            : categoryName}
        </h1>
        <p className="text-muted-foreground">
          Discover our premium collection of{" "}
          {selectedSubcategory
            ? (subcategories.find((sub) => sub.id === selectedSubcategory)?.name || categoryName).toLowerCase()
            : categoryName.toLowerCase()}
        </p>
      </div>

      {subcategories.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Shop by Subcategory</h2>

          {/* Mobile Dropdown */}
          <div className="md:hidden mb-4">
            <Select
              value={selectedSubcategory || "all"}
              onValueChange={(value) => {
                if (value) {
                  window.location.href = `/categories/${categorySlug}/${value}`
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a subcategory" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {subcategories.map((subcategory) => (
                  <SelectItem key={subcategory.id} value={subcategory.id}>
                    {subcategory.name} ({subcategory.count} items)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-3 lg:grid-cols-6 gap-4">
            {subcategories.map((subcategory) => (
              <Link key={subcategory.id} href={`/categories/${categorySlug}/${subcategory.id}`} className="group">
                <Card
                  className={`hover:shadow-lg transition-all duration-300 border-border hover:border-cyan-200 bg-card ${
                    selectedSubcategory === subcategory.id ? "ring-2 ring-cyan-500 border-cyan-500" : ""
                  }`}
                >
                  <CardContent className="p-4 text-center">
                    <h3
                      className={`font-medium group-hover:text-cyan-600 transition-colors mb-1 ${
                        selectedSubcategory === subcategory.id ? "text-cyan-600" : "text-card-foreground"
                      }`}
                    >
                      {subcategory.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{subcategory.count} items</p>
                    <ChevronRight
                      className={`w-4 h-4 mx-auto mt-2 group-hover:text-cyan-600 transition-colors ${
                        selectedSubcategory === subcategory.id ? "text-cyan-600" : "text-muted-foreground"
                      }`}
                    />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="bg-card rounded-2xl shadow-sm border border-border p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-input focus:border-cyan-500 focus:ring-cyan-500"
            />
          </div>

          <div className="flex items-center gap-4">
            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
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
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2">
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
                      In Stock ({mockProducts.filter((p) => p.inStock).length})
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="on-sale" />
                    <label htmlFor="on-sale" className="text-sm text-card-foreground cursor-pointer">
                      On Sale ({mockProducts.filter((p) => p.isOnSale).length})
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-muted-foreground">
          Showing {sortedProducts.length} of {mockProducts.length} results
        </p>
      </div>

      {/* Products Grid */}
      <div
        className={`grid gap-6 ${
          viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
        }`}
      >
        {sortedProducts.map((product) => {
          const isInWishlist = wishlistState.items.some((item) => item.id === product.id)

          return (
            <Card
              key={product.id}
              className="group hover:shadow-xl transition-all duration-300 border-border hover:border-cyan-200 overflow-hidden bg-card"
            >
              <div className="relative">
                <div className="aspect-square overflow-hidden bg-muted">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {product.isNew && <Badge className="bg-green-500 hover:bg-green-600 text-white">New</Badge>}
                  {product.isOnSale && <Badge className="bg-red-500 hover:bg-red-600 text-white">Sale</Badge>}
                  {!product.inStock && (
                    <Badge variant="secondary" className="bg-slate-500 text-white">
                      Out of Stock
                    </Badge>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0 bg-background/90 hover:bg-background"
                    onClick={() => toggleWishlist(product)}
                  >
                    <Heart className={`h-4 w-4 ${isInWishlist ? "fill-red-500 text-red-500" : ""}`} />
                  </Button>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Brand */}
                  <p className="text-sm text-cyan-600 font-medium">{product.brand}</p>

                  {/* Product Name */}
                  <h3 className="font-semibold text-card-foreground line-clamp-2 group-hover:text-cyan-600 transition-colors">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">({product.reviews})</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-card-foreground">{formatPrice(product.price)}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>

                  {/* Add to Cart */}
                  <Button
                    className="w-full bg-gradient-to-r from-cyan-600 to-purple-700 hover:from-cyan-700 hover:to-purple-800 text-white font-semibold"
                    disabled={!product.inStock}
                    onClick={() => product.inStock && addToCart(product)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {product.inStock ? "Add to Cart" : "Out of Stock"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Load More */}
      {sortedProducts.length > 0 && (
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="px-8 bg-transparent">
            Load More Products
          </Button>
        </div>
      )}
    </div>
  )
}
