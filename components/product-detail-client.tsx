"use client"

import { useEffect, useState } from "react"
import { useAppSelector } from "@/store/hooks"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { getProductBySlug, getProductById, type Product } from "@/lib/api/products"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingBag, ShoppingCart, Shield, RefreshCw, ChevronRight } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
import { AddedToCartModal } from "@/components/added-to-cart-modal"

interface ProductDetailClientProps {
  slug?: string
  productId?: string
}

function categoryLabel(category: Product["category"] | string | null | undefined) {
  if (!category) return ""
  if (typeof category === "string") return category
  return category.name || ""
}

function categoryHref(category: Product["category"] | string | null | undefined) {
  if (!category || typeof category === "string" || !category.slug) return null
  return `/categories/${category.slug}`
}

export function ProductDetailClient({ slug, productId }: ProductDetailClientProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [cartModalOpen, setCartModalOpen] = useState(false)
  const [addedLinePrice, setAddedLinePrice] = useState(0)

  const isDark = useAppSelector((state) => state.theme.isDark)
  const { addItem, isInCart, getItemQuantity, total } = useCart()
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
        category: categoryLabel(product.category),
      })
    }

    setAddedLinePrice(product.price * quantity)
    setCartModalOpen(true)
  }

  const handleViewCart = () => {
    setCartModalOpen(false)
    window.setTimeout(() => window.dispatchEvent(new Event("open-cart-drawer")), 200)
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
        category: categoryLabel(product.category),
        brand: product.brand || "",
      })
      toast.success(`${product.name} has been added to your wishlist`)
    }
  }

  const pageBg = isDark ? "bg-gray-950" : "bg-[#F0F4F8]"
  const surface = isDark
    ? "border border-gray-800 bg-gray-900"
    : "border border-gray-200/80 bg-white shadow-[0_10px_40px_rgba(15,23,42,0.05)]"
  const mutedText = isDark ? "text-gray-400" : "text-gray-500"
  const strongText = isDark ? "text-white" : "text-gray-950"

  if (loading) {
    return (
      <div className={`min-h-screen ${pageBg}`}>
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <Skeleton className="mb-8 h-4 w-56" />
          <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-14">
            <div>
              <Skeleton className="aspect-square w-full rounded-2xl" />
              <div className="mt-4 grid grid-cols-5 gap-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-square rounded-xl" />
                ))}
              </div>
            </div>
            <div className="space-y-4 pt-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-10 w-4/5" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-12 w-40" />
              <Skeleton className="h-20 w-full rounded-2xl" />
              <Skeleton className="h-12 w-full rounded-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className={`min-h-screen ${pageBg}`}>
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className={`text-2xl font-semibold mb-4 ${strongText}`}>Product Not Found</h1>
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

  const gallery =
    product.images?.length > 0
      ? product.images
      : [product.main_image || "/placeholder.svg"]
  const activeImage = gallery[selectedImage] || gallery[0]
  const productImage = product.main_image || activeImage

  return (
    <div className={`min-h-screen ${pageBg}`}>
      <AddedToCartModal
        open={cartModalOpen}
        onOpenChange={setCartModalOpen}
        productName={product.name}
        productImage={productImage}
        linePrice={addedLinePrice}
        cartTotal={total}
        onViewCart={handleViewCart}
      />
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className={`flex flex-wrap items-center gap-1.5 text-sm ${mutedText}`}>
            <li>
              <Link href="/" className={`transition-colors hover:text-cyan-600 ${strongText}`}>
                Home
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            {categoryLabel(product.category) && (
              <>
                <li>
                  {categoryHref(product.category) ? (
                    <Link
                      href={categoryHref(product.category) as string}
                      className={`transition-colors hover:text-cyan-600 ${strongText}`}
                    >
                      {categoryLabel(product.category)}
                    </Link>
                  ) : (
                    <span className={strongText}>{categoryLabel(product.category)}</span>
                  )}
                </li>
                <li aria-hidden>
                  <ChevronRight className="h-3.5 w-3.5" />
                </li>
              </>
            )}
            <li className={`max-w-[16rem] truncate sm:max-w-md ${mutedText}`}>{product.name}</li>
          </ol>
        </nav>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
          <div className="lg:sticky lg:top-36">
            <div className={`overflow-hidden rounded-2xl ${surface}`}>
              <div className="flex aspect-square items-center justify-center p-6 sm:p-10">
                <Image
                  src={activeImage || "/placeholder.svg"}
                  alt={product.name}
                  width={800}
                  height={800}
                  className="h-full w-full object-contain"
                  priority
                />
              </div>
            </div>
            {gallery.length > 1 && (
              <div className="mt-4 grid grid-cols-5 gap-3">
                {gallery.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    aria-label={`View image ${index + 1}`}
                    className={`overflow-hidden rounded-xl border bg-white transition-all ${
                      selectedImage === index
                        ? "border-cyan-500 ring-2 ring-cyan-500/30"
                        : isDark
                          ? "border-gray-700 hover:border-gray-500"
                          : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt=""
                      className="aspect-square w-full object-contain p-1.5"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:pt-2">
            {product.brand && (
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">{product.brand}</p>
            )}
            <h1 className={`mt-2 text-3xl font-semibold tracking-tight md:text-4xl ${strongText}`}>{product.name}</h1>
            <p className={`mt-2 text-sm ${mutedText}`}>SKU {product.sku}</p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className={`text-4xl font-semibold tracking-tight ${strongText}`}>{formatPrice(product.price)}</span>
              {product.original_price > product.price && (
                <>
                  <span className={`text-lg line-through ${mutedText}`}>{formatPrice(product.original_price)}</span>
                  <Badge className="bg-red-500 text-white">{product.discount_percentage}% OFF</Badge>
                </>
              )}
            </div>

            <div className="mt-4">
              <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                  product.in_stock
                    ? isDark
                      ? "bg-emerald-500/15 text-emerald-300"
                      : "bg-emerald-50 text-emerald-700"
                    : isDark
                      ? "bg-gray-800 text-gray-300"
                      : "bg-gray-200 text-gray-600"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${product.in_stock ? "bg-emerald-500" : "bg-gray-400"}`} />
                {product.stock_status}
              </span>
            </div>

            {product.short_description && (
              <p className={`mt-6 max-w-xl text-[15px] leading-7 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                {product.short_description}
              </p>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div
                className={`inline-flex h-12 items-center self-start rounded-full border px-1 ${
                  isDark ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-lg ${
                    isDark ? "text-white hover:bg-gray-800" : "text-gray-900 hover:bg-gray-100"
                  }`}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className={`w-8 text-center text-sm font-medium ${strongText}`}>{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-lg ${
                    isDark ? "text-white hover:bg-gray-800" : "text-gray-900 hover:bg-gray-100"
                  }`}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={!product.in_stock}
                className="h-12 flex-1 rounded-full bg-gradient-to-r from-cyan-600 to-purple-600 text-base hover:from-cyan-700 hover:to-purple-700"
                size="lg"
              >
                <ShoppingCart className="h-5 w-5" />
                {!product.in_stock ? "Out of Stock" : productInCart ? `In Cart (${cartQuantity})` : "Add to Cart"}
              </Button>

              <Button
                onClick={toggleWishlist}
                variant="outline"
                size="lg"
                aria-label={productInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                className={`h-12 w-12 rounded-full ${isDark ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white"}`}
              >
                <Heart className={`h-5 w-5 ${productInWishlist ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
            </div>

            <Button
              onClick={() => window.dispatchEvent(new Event("open-cart-drawer"))}
              variant="outline"
              size="lg"
              className={`mt-3 h-12 w-full rounded-full text-base ${
                isDark ? "border-gray-700 bg-gray-900 text-white hover:bg-gray-800" : "border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
              }`}
            >
              <ShoppingBag className="h-5 w-5" />
              View Cart
            </Button>

            <div className={`mt-8 grid grid-cols-2 overflow-hidden rounded-2xl ${surface}`}>
              <div className={`flex items-center gap-3 px-4 py-4 ${isDark ? "border-r border-gray-800" : "border-r border-gray-100"}`}>
                <Shield className={`h-5 w-5 shrink-0 ${isDark ? "text-cyan-400" : "text-cyan-600"}`} />
                <div>
                  <p className={`text-sm font-medium ${strongText}`}>Warranty</p>
                  <p className={`text-xs ${mutedText}`}>Covered on this product</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-4">
                <RefreshCw className={`h-5 w-5 shrink-0 ${isDark ? "text-cyan-400" : "text-cyan-600"}`} />
                <div>
                  <p className={`text-sm font-medium ${strongText}`}>Easy returns</p>
                  <p className={`text-xs ${mutedText}`}>Simple return process</p>
                </div>
              </div>
            </div>

            {product.description && (
              <section className={`mt-6 rounded-2xl p-6 ${surface}`}>
                <h2 className={`text-lg font-semibold tracking-tight ${strongText}`}>Description</h2>
                <p className={`mt-4 text-[15px] leading-7 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  {product.description}
                </p>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
