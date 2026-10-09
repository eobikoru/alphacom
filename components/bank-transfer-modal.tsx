"use client"

import { useState } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { Building2, Check, Copy, X } from "lucide-react"
import type { CartItem } from "@/store/slices/cartSlice"

const BANK_DETAILS = {
  accountName: "Alphacom investment company Nigeria",
  bankName: "Zenith Bank",
  accountNumber: "1011019407",
}

interface BankTransferModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: CartItem[]
  total: number
  formatPrice: (amount: number) => string
  orderNumber?: string
}

export function BankTransferModal({ open, onOpenChange, items, total, formatPrice, orderNumber }: BankTransferModalProps) {
  const [copied, setCopied] = useState(false)

  const copyAccountNumber = async () => {
    try {
      await navigator.clipboard.writeText(BANK_DETAILS.accountNumber)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[90] flex max-h-[90vh] w-[min(100%-1.5rem,42rem)] -translate-x-1/2 -translate-y-1/2 flex-col rounded-2xl bg-white shadow-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 dark:bg-gray-900">
          <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-5 py-4 sm:px-6 dark:border-gray-800">
            <div>
              <Dialog.Title className="text-base font-semibold text-gray-950 dark:text-white">Pay by bank transfer</Dialog.Title>
              <Dialog.Description className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                Transfer the total below to complete your order.
              </Dialog.Description>
            </div>
            <Dialog.Close
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          <div className="overflow-y-auto px-5 py-4 sm:px-6">
            <div className="rounded-2xl bg-gray-50 p-4 sm:p-5 dark:bg-gray-800/60">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-950 dark:text-white">
                <Building2 className="h-4 w-4" />
                Account details
              </div>
              <dl className="space-y-2.5 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500 dark:text-gray-400">Account name</dt>
                  <dd className="text-right font-medium text-gray-950 dark:text-white">{BANK_DETAILS.accountName}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500 dark:text-gray-400">Bank</dt>
                  <dd className="font-medium text-gray-950 dark:text-white">{BANK_DETAILS.bankName}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-gray-500 dark:text-gray-400">Account number</dt>
                  <dd className="flex items-center gap-2">
                    <span className="text-base font-semibold tracking-wider tabular-nums text-gray-950 dark:text-white">
                      {BANK_DETAILS.accountNumber}
                    </span>
                    <button
                      type="button"
                      onClick={copyAccountNumber}
                      className="flex h-7 items-center gap-1 rounded-full border border-gray-200 bg-white px-2.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                    >
                      {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </dd>
                </div>
              </dl>
            </div>

            {orderNumber && (
              <p className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
                Use your order number{" "}
                <span className="font-semibold text-gray-950 dark:text-white">{orderNumber}</span> as the transfer
                narration.
              </p>
            )}

            <ul className="mt-6 space-y-3">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-white dark:border-gray-800">
                    <img src={item.image || "/placeholder.svg"} alt={item.name} className="h-full w-full object-contain p-1" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-950 dark:text-white">{item.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold tabular-nums text-gray-950 dark:text-white">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-center justify-between border-t border-dashed border-gray-200 pt-4 dark:border-gray-700">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Total to transfer</span>
              <span className="text-xl font-semibold tabular-nums text-gray-950 dark:text-white">{formatPrice(total)}</span>
            </div>
          </div>

          <div className="border-t border-gray-100 px-5 py-4 sm:px-6 dark:border-gray-800">
            <Dialog.Close className="h-11 w-full rounded-full bg-gray-950 text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200">
              Done
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
