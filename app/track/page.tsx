"use client"

import type React from "react"
import { useState } from "react"
import { useTrackOrder } from "@/hooks/use-orders"
import type { TrackOrderResponse } from "@/lib/api/orders"
import { AppLayout } from "@/components/app-layout"
import { CheckCircle2, Clock, Package, Truck, XCircle } from "lucide-react"

function formatMoney(amount: number, currency: string) {
  if (currency === "NGN") {
    return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(amount)
  }
  return `${currency} ${amount.toLocaleString()}`
}

function statusIcon(status: string) {
  switch (status.toLowerCase()) {
    case "completed":
    case "delivered":
      return CheckCircle2
    case "shipped":
      return Truck
    case "pending":
      return Clock
    case "cancelled":
    case "failed":
      return XCircle
    default:
      return Package
  }
}

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("")
  const [email, setEmail] = useState("")
  const [trackingResult, setTrackingResult] = useState<TrackOrderResponse | null>(null)
  const trackOrderMutation = useTrackOrder()

  const handleTrack = async (event: React.FormEvent) => {
    event.preventDefault()
    const result = await trackOrderMutation.mutateAsync({ order_number: orderNumber, email })
    setTrackingResult(result)
  }

  return (
    <AppLayout>
      <div className="bg-[#f6f3f0] text-stone-950 dark:bg-stone-950 dark:text-white">
        <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:py-12">
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-[#8E1B2C] dark:text-rose-300">Orders</p>
          <h1 className="mt-4 text-4xl font-light tracking-tight sm:text-5xl">Track an order</h1>
          <div className="mt-6 h-px w-12 bg-[#8E1B2C] dark:bg-rose-300" />
          <p className="mt-6 max-w-xl text-sm leading-7 text-stone-600 sm:text-base dark:text-stone-300">
            Enter the order number and the email used at checkout. We will show the status, payment, and delivery
            timeline.
          </p>
        </section>

        <section className="border-t border-stone-200/80 bg-white dark:border-white/10 dark:bg-stone-900">
          <div className="mx-auto grid max-w-6xl gap-14 px-5 py-14 sm:px-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:py-16">
            <form onSubmit={handleTrack} className="max-w-md">
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#8E1B2C] dark:text-rose-300">
                Order details
              </p>
              <h2 className="mt-4 text-3xl font-light tracking-tight">Find your shipment</h2>

              <label htmlFor="orderNumber" className="mt-10 block text-[11px] uppercase tracking-[0.18em] text-stone-500">
                Order number
              </label>
              <input
                id="orderNumber"
                value={orderNumber}
                onChange={(event) => setOrderNumber(event.target.value)}
                placeholder="ORD-2025-001"
                required
                className="mt-2 h-11 w-full border border-stone-200 bg-white px-3 text-sm outline-none transition-colors placeholder:text-stone-400 focus:border-[#8E1B2C] dark:border-white/10 dark:bg-stone-950 dark:focus:border-rose-300"
              />

              <label htmlFor="email" className="mt-6 block text-[11px] uppercase tracking-[0.18em] text-stone-500">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@email.com"
                required
                className="mt-2 h-11 w-full border border-stone-200 bg-white px-3 text-sm outline-none transition-colors placeholder:text-stone-400 focus:border-[#8E1B2C] dark:border-white/10 dark:bg-stone-950 dark:focus:border-rose-300"
              />

              <button
                type="submit"
                disabled={trackOrderMutation.isPending}
                className="mt-8 inline-flex items-center rounded-full bg-[#8E1B2C] px-5 py-2.5 text-sm text-white transition-colors hover:bg-[#741625] disabled:opacity-60 dark:bg-rose-300 dark:text-stone-950 dark:hover:bg-rose-200"
              >
                {trackOrderMutation.isPending ? "Looking up…" : "Track order"}
              </button>
            </form>

            <div>
              {trackingResult ? (
                <OrderResult result={trackingResult} />
              ) : (
                <div className="flex h-full min-h-64 items-end border-t border-stone-200 pt-8 dark:border-white/10 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
                  <p className="max-w-sm text-sm leading-7 text-stone-500 dark:text-stone-400">
                    The order number is on your confirmation email. Results appear here once the order is found.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  )
}

function OrderResult({ result }: { result: TrackOrderResponse }) {
  const Icon = statusIcon(result.status)

  return (
    <div className="lg:pl-12">
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-[#8E1B2C] dark:text-rose-300" strokeWidth={1.5} />
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#8E1B2C] dark:text-rose-300">
          {result.status.replace(/_/g, " ")}
        </p>
      </div>
      <h2 className="mt-4 text-3xl font-light tracking-tight">{result.order_number}</h2>

      <dl className="mt-8 grid gap-6 sm:grid-cols-2">
        <div>
          <dt className="text-[11px] uppercase tracking-[0.18em] text-stone-500">Payment</dt>
          <dd className="mt-2 text-sm capitalize">{result.payment_status.replace(/_/g, " ")}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-[0.18em] text-stone-500">Total</dt>
          <dd className="mt-2 text-sm">{formatMoney(result.total_amount, result.currency)}</dd>
        </div>
        {result.tracking_number ? (
          <div>
            <dt className="text-[11px] uppercase tracking-[0.18em] text-stone-500">Tracking number</dt>
            <dd className="mt-2 text-sm">{result.tracking_number}</dd>
          </div>
        ) : null}
        {result.estimated_delivery ? (
          <div>
            <dt className="text-[11px] uppercase tracking-[0.18em] text-stone-500">Estimated delivery</dt>
            <dd className="mt-2 text-sm">{result.estimated_delivery}</dd>
          </div>
        ) : null}
      </dl>

      {result.timeline?.length > 0 ? (
        <ol className="mt-10 border-t border-stone-200 pt-8 dark:border-white/10">
          {result.timeline.map((event, index) => (
            <li key={`${event.timestamp}-${index}`} className="relative pb-8 pl-6 last:pb-0">
              {index < result.timeline.length - 1 ? (
                <span className="absolute bottom-0 left-[3px] top-2 w-px bg-stone-200 dark:bg-white/10" />
              ) : null}
              <span className="absolute left-0 top-1.5 h-1.5 w-1.5 rounded-full bg-[#8E1B2C] dark:bg-rose-300" />
              <p className="text-sm font-medium capitalize">{event.status.replace(/_/g, " ")}</p>
              <p className="mt-1 text-sm leading-6 text-stone-600 dark:text-stone-300">{event.description}</p>
              <p className="mt-1 text-xs text-stone-500">{new Date(event.timestamp).toLocaleString()}</p>
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  )
}
