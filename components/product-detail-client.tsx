"use client"

import { useEffect, useState } from "react"
import { useAppSelector } from "@/store/hooks"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { getProductBySlug, getProductById, type Product } from "@/lib/api/products"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, ShoppingCart, Truck, Shield, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

interface ProductDetailClientProps {
  slug?: string
  productId?: string
}

export function ProductDetailClient({ slug, productId }: ProductDetailClientProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  const isDark = useAppSelector((state) => state.theme.isDark)
  const { addItem, isInCart, getItemQuantity } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        let response
        if (productId) {
          response = await getProductById(productId)
        } else if (slug) {
          response = await getProductBySlug(slug)
        } else {
          throw new Error("Either slug or productId must be provided")
        }
        setProduct(response.data)
      } catch (error) {
        console.error("Failed to fetch product:", error)
        toast.error("Failed to load product details")
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [slug, productId])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleAddToCart = () => {
    if (!product || !product.in_stock) {
      toast.error("This item is currently out of stock")
      return
    }

    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.main_image || "",
        brand: product.brand || "",
        category: product.category.name,
      })
    }

    toast.success(`${product.name} (x${quantity}) has been added to your cart`)
  }

  const toggleWishlist = () => {
    if (!product) return

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
      toast.success(`${product.name} has been removed from your wishlist`)
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.main_image || "",
        category: product.category.name,
        brand: product.brand || "",
      })
      toast.success(`${product.name} has been added to your wishlist`)
    }
  }

  if (loading) {
    return (
      <div className={`min-h-screen py-12 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="container mx-auto px-4">
          <Skeleton className="h-6 w-64 mb-8" />
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <Skeleton className="w-full h-96 mb-4" />
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-20" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className={`min-h-screen py-12 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="container mx-auto px-4 text-center">
          <h1 className={`text-2xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>Product Not Found</h1>
          <Link href="/categories">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </div>
    )
  }

  const productInCart = isInCart(product.id)
  const cartQuantity = getItemQuantity(product.id)
  const productInWishlist = isInWishlist(product.id)

  return (
    <div className={`min-h-screen py-12 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className={`hover:underline ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                Home
              </Link>
            </li>
            <li className={isDark ? "text-gray-600" : "text-gray-400"}>/</li>
            <li>
              <Link
                href={`/categories/${product.category.slug}`}
                className={`hover:underline ${isDark ? "text-gray-400" : "text-gray-600"}`}
              >
                {product.category.name}
              </Link>
            </li>
            <li className={isDark ? "text-gray-600" : "text-gray-400"}>/</li>
            <li className={isDark ? "text-white" : "text-gray-900"}>{product.name}</li>
          </ol>
        </nav>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div>
            <Card className={`overflow-hidden mb-4 ${isDark ? "bg-gray-800" : "bg-white"}`}>
              <CardContent className="p-0">
                <img
                  src={product.images[selectedImage] || "/placeholder.svg?height=600&width=600"}
                  alt={product.name}
                  className="w-full h-96 object-cover"
                />
              </CardContent>
            </Card>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`border-2 rounded-lg overflow-hidden transition-all ${
                    selectedImage === index
                      ? "border-cyan-500"
                      : isDark
                        ? "border-gray-700 hover:border-gray-600"
                        : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <p className={`text-sm mb-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>{product.brand}</p>
              <h1 className={`text-3xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>{product.name}</h1>
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>SKU: {product.sku}</p>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-cyan-500">{formatPrice(product.price)}</span>
                {product.original_price > product.price && (
                  <>
                    <span className={`text-lg line-through ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                      {formatPrice(product.original_price)}
                    </span>
                    <Badge className="bg-red-500 text-white">{product.discount_percentage}% OFF</Badge>
                  </>
                )}
              </div>
            </div>

            <div className="mb-6">
              <Badge variant={product.in_stock ? "default" : "secondary"} className="mb-2">
                {product.stock_status}
              </Badge>
            </div>

            {product.short_description && (
              <p className={`mb-6 ${isDark ? "text-gray-300" : "text-gray-700"}`}>{product.short_description}</p>
            )}

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className={`px-4 py-2 ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                >
                  -
                </button>
                <span className={`px-6 py-2 ${isDark ? "text-white" : "text-gray-900"}`}>{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className={`px-4 py-2 ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                >
                  +
                </button>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={!product.in_stock}
                className="flex-1 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700"
                size="lg"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {!product.in_stock ? "Out of Stock" : productInCart ? `In Cart (${cartQuantity})` : "Add to Cart"}
              </Button>

              <Button onClick={toggleWishlist} variant="outline" size="lg" className={isDark ? "border-gray-700" : ""}>
                <Heart className={`h-5 w-5 ${productInWishlist ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <Card className={isDark ? "bg-gray-800" : "bg-white"}>
                <CardContent className="p-4 text-center">
                  <Truck className={`h-6 w-6 mx-auto mb-2 ${isDark ? "text-cyan-400" : "text-cyan-600"}`} />
                  <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>Free Delivery</p>
                </CardContent>
              </Card>
              <Card className={isDark ? "bg-gray-800" : "bg-white"}>
                <CardContent className="p-4 text-center">
                  <Shield className={`h-6 w-6 mx-auto mb-2 ${isDark ? "text-cyan-400" : "text-cyan-600"}`} />
                  <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>Warranty</p>
                </CardContent>
              </Card>
              <Card className={isDark ? "bg-gray-800" : "bg-white"}>
                <CardContent className="p-4 text-center">
                  <RefreshCw className={`h-6 w-6 mx-auto mb-2 ${isDark ? "text-cyan-400" : "text-cyan-600"}`} />
                  <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>Easy Returns</p>
                </CardContent>
              </Card>
            </div>

            {product.description && (
              <Card className={isDark ? "bg-gray-800" : "bg-white"}>
                <CardContent className="p-6">
                  <h2 className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
                    Product Description
                  </h2>
                  <p className={`leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    {product.description}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
