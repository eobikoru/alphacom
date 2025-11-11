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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, CreditCard, Truck, ArrowLeft } from "lucide-react"
import { useGuestCheckout, useAuthenticatedCheckout } from "@/hooks/use-orders"
import type { CheckoutItem, ShippingAddress } from "@/lib/api/orders"
import Link from "next/link"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearAllItems, formatPrice } = useCart()
  const { isAuthenticated, user } = useAuth()
  const { formData, updateField, clearForm } = useCheckout()

  const [phoneError, setPhoneError] = useState("")

  const guestCheckoutMutation = useGuestCheckout()
  const authenticatedCheckoutMutation = useAuthenticatedCheckout()

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

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.phone || formData.phone.length !== 11) {
      setPhoneError("Phone number must be exactly 11 digits")
      return
    }

    // Prepare checkout items
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

    if (isAuthenticated) {
      const response = await authenticatedCheckoutMutation.mutateAsync({
        callback_url: callbackUrl,
        items: checkoutItems,
        shipping_address: shippingAddress,
      })

      // Redirect to Paystack payment page
      if (response?.payment_url) {
        clearForm()
        window.location.href = response.payment_url
      }
    } else {
      const response = await guestCheckoutMutation.mutateAsync({
        callback_url: callbackUrl,
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        items: checkoutItems,
        shipping_address: shippingAddress,
        notes: formData.notes,
      })

      // Redirect to Paystack payment page
      if (response?.payment_url) {
        clearForm()
        window.location.href = response.payment_url
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 lg:py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <Link href="/categories">
            <Button variant="ghost" size="sm" className="mb-3 md:mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">Checkout</h1>
          <p className="text-sm md:text-base text-muted-foreground">Complete your order</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleCheckout} className="space-y-4 md:space-y-6">
              {/* Contact Information */}
              {!isAuthenticated && (
                <Card>
                  <CardHeader className="pb-3 md:pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                      <CreditCard className="h-5 w-5" />
                      Contact Information
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm">
                      We'll use this to send you order updates
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 md:space-y-4">
                    <div>
                      <Label htmlFor="email" className="mb-1.5 md:mb-2 block text-sm">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        required
                        placeholder="your@email.com"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="name" className="mb-1.5 md:mb-2 block text-sm">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        required
                        placeholder="John Doe"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="mb-1.5 md:mb-2 block text-sm">
                        Phone Number * (11 digits)
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "").slice(0, 11)
                          updateField("phone", value)
                        }}
                        required
                        placeholder="08012345678"
                        maxLength={11}
                        className="text-sm"
                      />
                      {phoneError && <p className="text-red-500 text-xs md:text-sm mt-1">{phoneError}</p>}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Shipping Address */}
              <Card>
                <CardHeader className="pb-3 md:pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                    <Truck className="h-5 w-5" />
                    Shipping Address
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm">Where should we deliver your order?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4">
                  {isAuthenticated && (
                    <div>
                      <Label htmlFor="phone-auth" className="mb-1.5 md:mb-2 block text-sm">
                        Phone Number * (11 digits)
                      </Label>
                      <Input
                        id="phone-auth"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "").slice(0, 11)
                          updateField("phone", value)
                        }}
                        required
                        placeholder="08012345678"
                        maxLength={11}
                        className="text-sm"
                      />
                      {phoneError && <p className="text-red-500 text-xs md:text-sm mt-1">{phoneError}</p>}
                    </div>
                  )}
                  <div>
                    <Label htmlFor="street" className="mb-1.5 md:mb-2 block text-sm">
                      Street Address *
                    </Label>
                    <Input
                      id="street"
                      value={formData.street}
                      onChange={(e) => updateField("street", e.target.value)}
                      required
                      placeholder="123 Main Street"
                      className="text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <Label htmlFor="city" className="mb-1.5 md:mb-2 block text-sm">
                        City *
                      </Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => updateField("city", e.target.value)}
                        required
                        placeholder="Lagos"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state" className="mb-1.5 md:mb-2 block text-sm">
                        State *
                      </Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => updateField("state", e.target.value)}
                        required
                        placeholder="Lagos"
                        className="text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="notes" className="mb-1.5 md:mb-2 block text-sm">
                      Delivery Notes (Optional)
                    </Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => updateField("notes", e.target.value)}
                      placeholder="Any special instructions for delivery?"
                      rows={3}
                      className="text-sm"
                    />
                  </div>
                </CardContent>
              </Card>

              <Button
                type="submit"
                size="lg"
                className="w-full text-sm md:text-base"
                disabled={isLoading || phoneError !== ""}
              >
                {isLoading ? "Processing..." : `Proceed to Payment - ${formatPrice(total)}`}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="lg:sticky lg:top-4">
              <CardHeader className="pb-3 md:pb-4">
                <CardTitle className="text-lg md:text-xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4">
                <div className="space-y-2 md:space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-2 md:gap-3">
                      <div className="relative h-14 w-14 md:h-16 md:w-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="object-cover w-full h-full"
                        />
                        <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                          {item.quantity}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-xs md:text-sm truncate">{item.name}</p>
                        <p className="text-xs md:text-sm text-muted-foreground">{formatPrice(item.price)}</p>
                      </div>
                      <div className="text-xs md:text-sm font-semibold">{formatPrice(item.price * item.quantity)}</div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-xs md:text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-base md:text-lg font-bold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
