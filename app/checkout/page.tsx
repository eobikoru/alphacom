"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { useCheckout } from "@/hooks/use-checkout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, ArrowLeft, Landmark, Lock } from "lucide-react"
import { useGuestCheckout, useAuthenticatedCheckout, useOrderBreakdown } from "@/hooks/use-orders"
import type { CheckoutItem, CheckoutResponse, ShippingAddress } from "@/lib/api/orders"
import Link from "next/link"
import { toast } from "sonner"
import { BankTransferModal } from "@/components/bank-transfer-modal"

const inputClass =
  "h-11 rounded-xl border-gray-200 bg-white text-sm shadow-none focus-visible:ring-2 focus-visible:ring-gray-900/10 dark:border-gray-800 dark:bg-gray-950"
const labelClass = "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
const panelClass =
  "rounded-2xl border border-gray-200/80 bg-white p-5 shadow-[0_10px_40px_rgba(15,23,42,0.05)] md:p-6 dark:border-gray-800 dark:bg-gray-900"

type RequiredField = "email" | "name" | "phone" | "street" | "city" | "state"
type MinLengthField = "name" | "street" | "city" | "state"

const MIN_LENGTH: Record<MinLengthField, number> = {
  name: 2,
  street: 5,
  city: 2,
  state: 2,
}

function SectionHeading({ step, title, description }: { step: number; title: string; description: string }) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-950 text-xs font-semibold text-white dark:bg-white dark:text-gray-950">
        {step}
      </span>
      <div>
        <h2 className="text-base font-semibold text-gray-950 dark:text-white">{title}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearAllItems, formatPrice } = useCart()
  const { isAuthenticated, user } = useAuth()
  const { formData, updateField, clearForm } = useCheckout()

  const [phoneError, setPhoneError] = useState("")
  const [breakdownData, setBreakdownData] = useState<any>(null)
  const [breakdownLoading, setBreakdownLoading] = useState(false)
  const [transferOpen, setTransferOpen] = useState(false)
  const [invalidFields, setInvalidFields] = useState<RequiredField[]>([])
  const [shaking, setShaking] = useState(false)
  const [transferOrder, setTransferOrder] = useState<CheckoutResponse | null>(null)
  const [pendingAction, setPendingAction] = useState<"payment" | "transfer" | null>(null)

  const guestCheckoutMutation = useGuestCheckout()
  const authenticatedCheckoutMutation = useAuthenticatedCheckout()
  const orderBreakdownMutation = useOrderBreakdown()

  useEffect(() => {
    if (isAuthenticated && user) {
      updateField("email", user.email || "")
      updateField("name", user.username || "")
    }
  }, [isAuthenticated, user])

  useEffect(() => {
    if (!formData.phone) {
      setPhoneError("")
      return
    }

    if (formData.phone.length < 11) {
      setPhoneError(`Phone number must be 11 digits (${formData.phone.length}/11)`)
    } else if (formData.phone.length === 11) {
      setPhoneError("")
    }
  }, [formData.phone])

  useEffect(() => {
    if (items.length === 0) {
      setBreakdownData(null)
      return
    }

    const fetchBreakdown = async () => {
      setBreakdownLoading(true)
      try {
        const checkoutItems = items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        }))
        const response = await orderBreakdownMutation.mutateAsync({ items: checkoutItems })
        setBreakdownData(response?.data)
      } catch (error) {
        console.error("[v0] Error fetching order breakdown:", error)
      } finally {
        setBreakdownLoading(false)
      }
    }

    fetchBreakdown()
  }, [items])

  const isLoading = guestCheckoutMutation.isPending || authenticatedCheckoutMutation.isPending

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-16">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="pt-6">
            <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl md:text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-sm md:text-base text-muted-foreground mb-6">Add some items to your cart to checkout</p>
            <Link href="/categories">
              <Button>Start Shopping</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const trimmedLength = (field: MinLengthField) => (formData[field] ?? "").trim().length
  const meetsMinLength = (field: MinLengthField) => trimmedLength(field) >= MIN_LENGTH[field]
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((formData.email ?? "").trim())
  const summaryTotal = breakdownData?.subtotal || total

  const getInvalidFields = (): RequiredField[] => {
    const invalid: RequiredField[] = []
    if (!isAuthenticated) {
      if (!isEmailValid) invalid.push("email")
      if (!meetsMinLength("name")) invalid.push("name")
    }
    if ((formData.phone ?? "").length !== 11) invalid.push("phone")
    if (!meetsMinLength("street")) invalid.push("street")
    if (!meetsMinLength("city")) invalid.push("city")
    if (!meetsMinLength("state")) invalid.push("state")
    return invalid
  }

  const validateForm = () => {
    const invalid = getInvalidFields()
    setInvalidFields(invalid)
    if (invalid.length === 0) return true

    if ((formData.phone ?? "").length !== 11) {
      setPhoneError("Phone number must be exactly 11 digits")
    }
    setShaking(false)
    requestAnimationFrame(() => setShaking(true))
    window.setTimeout(() => setShaking(false), 450)

    const firstId = invalid[0] === "phone" && isAuthenticated ? "phone-auth" : invalid[0]
    const firstInput = document.getElementById(firstId)
    firstInput?.scrollIntoView({ behavior: "smooth", block: "center" })
    firstInput?.focus({ preventScroll: true })
    return false
  }

  const handleFieldChange = (field: RequiredField | "notes", value: string) => {
    updateField(field, value)
    if (invalidFields.includes(field as RequiredField)) {
      setInvalidFields((prev) => prev.filter((f) => f !== field))
    }
  }

  const fieldClass = (field: RequiredField) =>
    invalidFields.includes(field)
      ? `${inputClass} border-red-500 focus-visible:ring-red-500/20 dark:border-red-500 ${shaking ? "animate-shake" : ""}`
      : inputClass

  const fieldError = (field: RequiredField, message: string) =>
    invalidFields.includes(field) ? <p className="mt-1 text-xs text-red-500">{message}</p> : null

  const lengthError = (field: MinLengthField, label: string) => {
    const length = trimmedLength(field)
    const min = MIN_LENGTH[field]
    if (length === 0) return fieldError(field, `${label} is required`)
    if (length >= min) return null
    return (
      <p className="mt-1 text-xs text-red-500">
        {label} must be at least {min} characters ({length}/{min})
      </p>
    )
  }

  const placeOrder = async (): Promise<CheckoutResponse | undefined> => {
    const checkoutItems: CheckoutItem[] = items.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
    }))

    const shippingAddress: ShippingAddress = {
      street: formData.street,
      city: formData.city,
      state: formData.state,
      phone: formData.phone,
    }

    const callbackUrl = `https://alphacomonline.com/payment/verify`

    try {
      if (isAuthenticated) {
        return await authenticatedCheckoutMutation.mutateAsync({
          callback_url: callbackUrl,
          items: checkoutItems,
          shipping_address: shippingAddress,
        })
      }
      return await guestCheckoutMutation.mutateAsync({
        callback_url: callbackUrl,
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        items: checkoutItems,
        shipping_address: shippingAddress,
        notes: formData.notes,
      })
    } catch {
      // The mutation hooks already surface the error as a toast.
      return undefined
    }
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setPendingAction("payment")
    const response = await placeOrder()
    setPendingAction(null)

    // Redirect to Paystack payment page
    if (response?.payment_url) {
      toast.success("Redirecting to payment...")
      clearForm()
      window.location.href = response.payment_url
    }
  }

  const handleTransferClick = async () => {
    if (!validateForm()) return

    if (!transferOrder) {
      setPendingAction("transfer")
      const response = await placeOrder()
      setPendingAction(null)
      if (!response) return
      setTransferOrder(response)
    }
    setTransferOpen(true)
  }

  return (
    <div className="min-h-screen bg-[#F0F4F8] dark:bg-gray-950">
      <BankTransferModal
        open={transferOpen}
        onOpenChange={setTransferOpen}
        items={items}
        total={summaryTotal}
        formatPrice={formatPrice}
        orderNumber={transferOrder?.order_number}
      />
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <Link
              href="/categories"
              className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-950 dark:text-gray-400 dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Continue shopping
            </Link>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-950 md:text-4xl dark:text-white">Checkout</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Complete your details to place your order.</p>
          </div>

          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-8">
            <form id="checkout-form" onSubmit={handleCheckout} noValidate className="space-y-6">
              {!isAuthenticated && (
                <section className={panelClass}>
                  <SectionHeading step={1} title="Contact information" description="We'll use this to send you order updates." />
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email" className={labelClass}>
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleFieldChange("email", e.target.value)}
                        required
                        placeholder="your@email.com"
                        className={fieldClass("email")}
                      />
                      {fieldError("email", "Enter a valid email address")}
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="name" className={labelClass}>
                          Full name
                        </Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleFieldChange("name", e.target.value)}
                          required
                          placeholder="John Doe"
                          className={fieldClass("name")}
                        />
                        {lengthError("name", "Full name")}
                      </div>
                      <div>
                        <Label htmlFor="phone" className={labelClass}>
                          Phone number
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "").slice(0, 11)
                            handleFieldChange("phone", value)
                          }}
                          required
                          placeholder="08012345678"
                          maxLength={11}
                          className={fieldClass("phone")}
                        />
                        {phoneError && <p className="mt-1 text-xs text-red-500">{phoneError}</p>}
                      </div>
                    </div>
                  </div>
                </section>
              )}

              <section className={panelClass}>
                <SectionHeading
                  step={isAuthenticated ? 1 : 2}
                  title="Delivery address"
                  description="Where should we deliver your order?"
                />
                <div className="space-y-4">
                  {isAuthenticated && (
                    <div>
                      <Label htmlFor="phone-auth" className={labelClass}>
                        Phone number
                      </Label>
                      <Input
                        id="phone-auth"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "").slice(0, 11)
                          handleFieldChange("phone", value)
                        }}
                        required
                        placeholder="08012345678"
                        maxLength={11}
                        className={fieldClass("phone")}
                      />
                      {phoneError && <p className="mt-1 text-xs text-red-500">{phoneError}</p>}
                    </div>
                  )}
                  <div>
                    <Label htmlFor="street" className={labelClass}>
                      Street address
                    </Label>
                    <Input
                      id="street"
                      value={formData.street}
                      onChange={(e) => handleFieldChange("street", e.target.value)}
                      required
                      placeholder="123 Main Street"
                      className={fieldClass("street")}
                    />
                    {lengthError("street", "Street address")}
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="city" className={labelClass}>
                        City
                      </Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleFieldChange("city", e.target.value)}
                        required
                        placeholder="Lagos"
                        className={fieldClass("city")}
                      />
                      {lengthError("city", "City")}
                    </div>
                    <div>
                      <Label htmlFor="state" className={labelClass}>
                        State
                      </Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => handleFieldChange("state", e.target.value)}
                        required
                        placeholder="Lagos"
                        className={fieldClass("state")}
                      />
                      {lengthError("state", "State")}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="notes" className={labelClass}>
                      Delivery notes <span className="font-normal text-gray-400">(optional)</span>
                    </Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => updateField("notes", e.target.value)}
                      placeholder="Any special instructions for delivery?"
                      rows={3}
                      className="rounded-xl border-gray-200 bg-white text-sm shadow-none dark:border-gray-800 dark:bg-gray-950"
                    />
                  </div>
                </div>
              </section>
            </form>

            <aside className="space-y-4 lg:sticky lg:top-28">
              <section className={panelClass}>
                <h2 className="mb-5 text-base font-semibold text-gray-950 dark:text-white">Order summary</h2>
                <ul className="space-y-4">
                  {items.map((item) => (
                    <li key={item.id} className="flex items-center gap-3">
                      <div className="relative h-16 w-16 shrink-0 rounded-xl border border-gray-100 bg-white dark:border-gray-800">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="h-full w-full rounded-xl object-contain p-1.5"
                        />
                        <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gray-950 px-1 text-[11px] font-semibold text-white dark:bg-white dark:text-gray-950">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-950 dark:text-white">{item.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{formatPrice(item.price)}</p>
                      </div>
                      <p className="text-sm font-semibold tabular-nums text-gray-950 dark:text-white">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </li>
                  ))}
                </ul>

                <Separator className="my-5" />

                {!breakdownLoading && breakdownData?.shipping ? (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Shipping</span>
                      <span>{formatPrice(breakdownData.shipping)}</span>
                    </div>
                    <Separator className="my-5" />
                  </>
                ) : null}

                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Total</span>
                  <span className="text-2xl font-semibold tracking-tight tabular-nums text-gray-950 dark:text-white">
                    {formatPrice(summaryTotal)}
                  </span>
                </div>
              </section>

              <Button
                type="submit"
                form="checkout-form"
                size="lg"
                className="h-12 w-full rounded-full bg-gray-950 text-base text-white hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200"
                disabled={isLoading}
              >
                <Lock className="h-4 w-4" />
                {pendingAction === "payment" ? "Processing..." : "Proceed to Payment"}
              </Button>

              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleTransferClick}
                disabled={isLoading}
                className="h-12 w-full rounded-full border-gray-300 bg-white text-base text-gray-950 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
              >
                <Landmark className="h-4 w-4" />
                {pendingAction === "transfer" ? "Processing..." : "Transfer"}
              </Button>
            </aside>
          </div>
        </div>
      </div>
    </div>
  )
}
