"use client"

import type React from "react"

import { useEffect } from "react"
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

  const guestCheckoutMutation = useGuestCheckout()
  const authenticatedCheckoutMutation = useAuthenticatedCheckout()

  useEffect(() => {
    if (isAuthenticated && user) {
      updateField("email", user.email || "")
      updateField("name", user.username || "")
    }
  }, [isAuthenticated, user])

  const isLoading = guestCheckoutMutation.isPending || authenticatedCheckoutMutation.isPending

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="pt-6">
            <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Add some items to your cart to checkout</p>
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

    const callbackUrl = `https://alphacom-f8j4.vercel.app/payment/verify`

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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/categories">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Checkout</h1>
          <p className="text-muted-foreground">Complete your order</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleCheckout} className="space-y-6">
              {/* Contact Information */}
              {!isAuthenticated && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Contact Information
                    </CardTitle>
                    <CardDescription>We'll use this to send you order updates</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="email" className="mb-2 block">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        required
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="name" className="mb-2 block">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        required
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="mb-2 block">
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        required
                        placeholder="08012345678"
                        minLength={11}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Shipping Address
                  </CardTitle>
                  <CardDescription>Where should we deliver your order?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isAuthenticated && (
                    <div>
                      <Label htmlFor="phone" className="mb-2 block">
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        required
                        placeholder="08012345678"
                        minLength={11}
                      />
                    </div>
                  )}
                  <div>
                    <Label htmlFor="street" className="mb-2 block">
                      Street Address *
                    </Label>
                    <Input
                      id="street"
                      value={formData.street}
                      onChange={(e) => updateField("street", e.target.value)}
                      required
                      placeholder="123 Main Street"
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city" className="mb-2 block">
                        City *
                      </Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => updateField("city", e.target.value)}
                        required
                        placeholder="Lagos"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state" className="mb-2 block">
                        State *
                      </Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => updateField("state", e.target.value)}
                        required
                        placeholder="Lagos"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="notes" className="mb-2 block">
                      Delivery Notes (Optional)
                    </Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => updateField("notes", e.target.value)}
                      placeholder="Any special instructions for delivery?"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? "Processing..." : `Proceed to Payment - ${formatPrice(total)}`}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
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
                        <p className="font-medium text-sm truncate">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{formatPrice(item.price)}</p>
                      </div>
                      <div className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
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
