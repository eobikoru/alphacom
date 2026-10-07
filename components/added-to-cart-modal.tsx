"use client"

import Image from "next/image"
import Link from "next/link"
import * as Dialog from "@radix-ui/react-dialog"
import { ShoppingCart, X } from "lucide-react"

interface AddedToCartModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  productName: string
  productImage: string
  linePrice: number
  cartTotal: number
  onViewCart: () => void
}

const SHIPPING_COST = 0

function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function AddedToCartModal({
  open,
  onOpenChange,
  productName,
  productImage,
  linePrice,
  cartTotal,
  onViewCart,
}: AddedToCartModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[90] w-[min(100%-1.5rem,32rem)] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-4 shadow-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:p-5">
          <div className="flex items-center justify-between gap-3 border-b border-gray-200 pb-3">
            <Dialog.Title className="flex items-center gap-2 text-sm font-medium text-gray-900">
              <ShoppingCart className="h-4 w-4 shrink-0" />
              Product successfully added to your cart!
            </Dialog.Title>
            <Dialog.Close
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gray-300 text-gray-600 transition-colors hover:bg-gray-50"
              aria-label="Close"
            >
              <X className="h-3.5 w-3.5" />
            </Dialog.Close>
          </div>

          <Dialog.Description className="sr-only">
            {productName} was added to your cart. Shipping is free. You can view your cart or continue shopping.
          </Dialog.Description>

          <div className="mt-4 grid grid-cols-[4.5rem_minmax(0,1fr)_auto] items-start gap-x-3 gap-y-3 text-sm text-gray-900 sm:grid-cols-[5rem_minmax(0,1fr)_auto] sm:gap-x-4">
            <div className="row-span-3 flex h-[4.5rem] w-[4.5rem] items-center justify-center sm:h-20 sm:w-20">
              <Image
                src={productImage || "/placeholder.svg"}
                alt={productName}
                width={80}
                height={80}
                className="h-full w-full object-contain"
              />
            </div>
            <p className="font-medium leading-snug">{productName}</p>
            <p className="text-right tabular-nums">{formatNaira(linePrice)}</p>
            <span className="text-gray-800">Shipping Cost</span>
            <span className="text-right tabular-nums">{formatNaira(SHIPPING_COST)}</span>
            <span className="font-semibold">Cart Total</span>
            <span className="text-right font-semibold tabular-nums">{formatNaira(cartTotal)}</span>
          </div>

          <div className="my-4 border-t border-dashed border-gray-300" />

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onViewCart}
              className="h-11 rounded-full bg-[#8E1B2C] text-sm font-medium text-white transition-colors hover:bg-[#741625]"
            >
              View Cart
            </button>
            <Dialog.Close asChild>
              <Link
                href="/"
                className="flex h-11 items-center justify-center rounded-full border-2 border-[#8E1B2C] bg-white text-sm font-medium text-[#8E1B2C] transition-colors hover:bg-[#8E1B2C]/5"
              >
                Continue Shopping
              </Link>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
