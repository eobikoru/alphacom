"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Star, ShoppingCart } from "lucide-react"
import { useAppSelector } from "@/store/hooks"
import { useWishlist } from "@/hooks/use-wishlist"
import { useCart } from "@/hooks/use-cart"
import { toast } from "sonner"
import Link from "next/link"

const featuredProducts = [
  {
    id: "1",
    name: "MacBook Pro 16-inch M3",
    brand: "Apple",
    price: 2500000,
    originalPrice: 2800000,
    rating: 4.9,
    reviews: 128,
    image: "/macbook-pro-laptop-silver-modern-design.jpg",
    badge: "Best Seller",
    badgeColor: "bg-green-500",
    category: "Computers & Accessories",
    inStock: true,
  },
  {
    id: "2",
    name: "Sony WH-1000XM5 Headphones",
    brand: "Sony",
    price: 450000,
    originalPrice: 520000,
    rating: 4.8,
    reviews: 89,
    image: "/sony-wireless-noise-cancelling-headphones-black-pr.jpg",
    badge: "Limited Offer",
    badgeColor: "bg-red-500",
    category: "Audio & Speakers",
    inStock: true,
  },
  {
    id: "3",
    name: "Canon EOS R6 Mark II",
    brand: "Canon",
    price: 3200000,
    originalPrice: null,
    rating: 4.9,
    reviews: 45,
    image: "/canon-dslr-camera-professional-black-with-lens.jpg",
    badge: "New Arrival",
    badgeColor: "bg-blue-500",
    category: "Cameras",
    inStock: true,
  },
  {
    id: "4",
    name: "Samsung 2TB Portable SSD",
    brand: "Samsung",
    price: 180000,
    originalPrice: 220000,
    rating: 4.7,
    reviews: 156,
    image: "/samsung-portable-ssd-external-drive-compact-black.jpg",
    badge: "Hot Deal",
    badgeColor: "bg-orange-500",
    category: "Data Storage",
    inStock: false,
  },
]

export function FeaturedProducts() {
  const { items: wishlistItems, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { addItem, isInCart, getItemQuantity } = useCart()
  const isDark = useAppSelector((state) => state.theme.isDark)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const toggleWishlist = (product: (typeof featuredProducts)[0]) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
      toast.success(`${product.name} has been removed from your wishlist`)
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        brand: product.brand,
      })
      toast.success(`${product.name} has been added to your wishlist`)
    }
  }

  const handleAddToCart = (product: (typeof featuredProducts)[0]) => {
    if (!product.inStock) {
      toast.error("This item is currently out of stock")
      return
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      brand: product.brand,
      category: product.category,
    })

    toast.success(`${product.name} has been added to your cart`)
  }

  return (
    <section
      className={`py-16 lg:py-24 transition-all duration-500 ${
        isDark ? "bg-gradient-to-br from-gray-900/50 to-black/30" : "bg-gradient-to-br from-gray-50 to-white"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2
              className={`text-3xl lg:text-4xl font-bold mb-4 transition-colors duration-300 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Featured Products
            </h2>
            <p className={`text-lg transition-colors duration-300 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Handpicked premium products with exceptional quality and performance
            </p>
          </div>
          <Link href="/categories/computers">
            <Button
              variant="outline"
              className={`hidden md:flex transition-all duration-300 ${
                isDark
                  ? "bg-transparent border-white/20 text-white hover:bg-white/10"
                  : "bg-white border-gray-200 text-gray-900 hover:bg-gray-50"
              }`}
            >
              View All Products
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => {
            const productInWishlist = isInWishlist(product.id)
            const productInCart = isInCart(product.id)
            const cartQuantity = getItemQuantity(product.id)

            return (
              <Card
                key={product.id}
                className={`group hover:shadow-2xl transition-all duration-500 border-0 backdrop-blur-sm ${
                  isDark ? "bg-white/10 hover:bg-white/15 shadow-xl" : "bg-white/90 hover:bg-white shadow-lg"
                }`}
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={product.image || "/placeholder.svg?height=256&width=256&query=premium tech product"}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-4 left-4">
                      <Badge className={`${product.badgeColor} text-white border-0 shadow-lg`}>{product.badge}</Badge>
                    </div>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 w-8 p-0 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
                        onClick={() => toggleWishlist(product)}
                      >
                        <Heart
                          className={`h-4 w-4 transition-colors ${productInWishlist ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                        />
                      </Button>
                    </div>

                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge variant="secondary" className="bg-slate-500 text-white">
                          Out of Stock
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="mb-2">
                      <p
                        className={`text-sm transition-colors duration-300 ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {product.brand}
                      </p>
                      <h3
                        className={`font-semibold text-lg leading-tight group-hover:text-cyan-500 transition-colors duration-300 ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {product.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span
                          className={`text-sm font-medium transition-colors duration-300 ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {product.rating}
                        </span>
                      </div>
                      <span
                        className={`text-sm transition-colors duration-300 ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        ({product.reviews})
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl font-bold text-cyan-500">{formatPrice(product.price)}</span>
                      {product.originalPrice && (
                        <span
                          className={`text-sm line-through transition-colors duration-300 ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Button
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.inStock}
                        className={`w-full transition-all duration-300 transform hover:scale-105 ${
                          productInCart
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700"
                        } shadow-lg hover:shadow-xl`}
                        size="sm"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {!product.inStock
                          ? "Out of Stock"
                          : productInCart
                            ? `In Cart (${cartQuantity})`
                            : "Add to Cart"}
                      </Button>

                      <Button
                        variant="outline"
                        className={`w-full transition-all duration-300 ${
                          isDark
                            ? "bg-transparent border-white/20 text-white hover:bg-white/10"
                            : "bg-white border-gray-200 text-gray-900 hover:bg-gray-50"
                        }`}
                        size="sm"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Link href="/categories/computers">
            <Button
              variant="outline"
              className={`transition-all duration-300 ${
                isDark
                  ? "bg-transparent border-white/20 text-white hover:bg-white/10"
                  : "bg-white border-gray-200 text-gray-900 hover:bg-gray-50"
              }`}
            >
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
