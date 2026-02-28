"use client"

import Link from "next/link"

export interface SaleProductCardItem {
  id: string
  name: string
  price: number
  original_price?: number | null
  discount_percentage?: number | null
  main_image: string | null
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(price)

export function SaleProductCard({
  product,
  href,
  itemsLeft,
}: {
  product: SaleProductCardItem
  href: string
  itemsLeft?: number | null
}) {
  const showOriginal = product.original_price != null && product.original_price > product.price
  const progressPercent = itemsLeft != null ? Math.min(100, (itemsLeft / 60) * 100) : 65

  return (
    <Link
      href={href}
      className="group shrink-0 w-36 rounded-lg border border-border bg-card overflow-hidden hover:shadow-lg hover:border-orange-300/50 transition-all duration-300"
    >
      <div className="relative h-24 w-full bg-muted overflow-hidden">
        <img
          src={product.main_image || "/placeholder.svg?height=96&width=144"}
          alt={product.name}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.discount_percentage != null && product.discount_percentage > 0 && (
          <span className="absolute top-1.5 right-1.5 rounded-full bg-amber-600/95 px-1.5 py-0.5 text-[10px] font-bold text-white shadow">
            -{Math.round(product.discount_percentage)}%
          </span>
        )}
      </div>
      <div className="p-2">
        <p className="text-xs font-medium text-foreground line-clamp-2 leading-tight" title={product.name}>
          {product.name}
        </p>
        <p className="text-sm font-bold text-foreground mt-0.5">{formatPrice(product.price)}</p>
        {showOriginal && (
          <p className="text-[10px] text-muted-foreground line-through">{formatPrice(product.original_price!)}</p>
        )}
        <div className="mt-1.5">
          <p className="text-[10px] text-muted-foreground">
            {itemsLeft != null ? `${itemsLeft} items left` : "Limited"}
          </p>
          <div className="mt-0.5 h-1 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-orange-500 transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  )
}
