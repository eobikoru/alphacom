"use client"

import { ShoppingCart } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"

export function AddToCartButton({
  product,
}: {
  product: {
    id: string
    name: string
    price: number
    main_image: string | null
    brand: string | null
    category?: { name?: string } | null
    in_stock: boolean
  }
}) {
  const { addItem } = useCart()

  return (
    <Button
      className="h-9 w-full text-xs sm:text-sm"
      disabled={!product.in_stock}
      onClick={() => {
        addItem({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.main_image || "/placeholder.svg",
          brand: product.brand || "Unknown Brand",
          category: product.category?.name || "",
        })
        toast.success(`${product.name} added to cart`)
      }}
    >
      <ShoppingCart className="h-4 w-4 mr-2" />
      {product.in_stock ? "Add to Cart" : "Out of Stock"}
    </Button>
  )
}
