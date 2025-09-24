"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Lock, Truck, Shield, ArrowLeft, Check, MapPin, Phone, Mail, User, Building } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useCart } from "@/hooks/use-cart"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function PremiumCheckout() {
  const { items, total, itemCount, clearAllItems, formatPrice } = useCart()
  const router = useRouter()

  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Clear cart and show success
      clearAllItems()
      toast.success("Order placed successfully! You will receive a confirmation email shortly.")

      // Redirect to a success page or home
      router.push("/")
    } catch (error) {
      toast.error("Payment failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16 bg-background min-h-screen">
        <h2 className="text-2xl font-bold text-foreground mb-4">Your cart is empty</h2>
        <p className="text-muted-foreground mb-8">Add some items to proceed with checkout</p>
        <Link href="/">
          <Button className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700">
            Continue Shopping
          </Button>
        </Link>
      </div>
    )
  }

  const tax = total * 0.075
  const finalTotal = total + tax

  return (
    <div className="max-w-7xl mx-auto bg-background min-h-screen p-4">
      <div className="mb-8">
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">Checkout</span>
        </nav>
        <h1 className="text-4xl font-bold text-foreground mb-2">Secure Checkout</h1>
        <p className="text-muted-foreground">Complete your purchase with confidence</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contact Information */}
            <Card className="border-border shadow-lg">
              <CardHeader className="bg-muted/50">
                <CardTitle className="flex items-center gap-3 text-foreground">
                  <User className="w-5 h-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-foreground font-medium">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      className="mt-1 border-border focus:border-cyan-500"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-foreground font-medium">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      className="mt-1 border-border focus:border-cyan-500"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email" className="text-foreground font-medium">
                    Email Address
                  </Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      className="pl-10 border-border focus:border-cyan-500"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone" className="text-foreground font-medium">
                    Phone Number
                  </Label>
                  <div className="relative mt-1">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      className="pl-10 border-border focus:border-cyan-500"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card className="border-border shadow-lg">
              <CardHeader className="bg-muted/50">
                <CardTitle className="flex items-center gap-3 text-foreground">
                  <MapPin className="w-5 h-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label htmlFor="address" className="text-foreground font-medium">
                    Street Address
                  </Label>
                  <Input
                    id="address"
                    className="mt-1 border-border focus:border-cyan-500"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city" className="text-foreground font-medium">
                      City
                    </Label>
                    <Input
                      id="city"
                      className="mt-1 border-border focus:border-cyan-500"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state" className="text-foreground font-medium">
                      State
                    </Label>
                    <Input
                      id="state"
                      className="mt-1 border-border focus:border-cyan-500"
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="zip" className="text-foreground font-medium">
                      ZIP Code
                    </Label>
                    <Input
                      id="zip"
                      className="mt-1 border-border focus:border-cyan-500"
                      value={formData.zip}
                      onChange={(e) => handleInputChange("zip", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="border-border shadow-lg">
              <CardHeader className="bg-muted/50">
                <CardTitle className="flex items-center gap-3 text-foreground">
                  <CreditCard className="w-5 h-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:border-cyan-500/50 transition-colors">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-muted-foreground" />
                        <span className="font-medium text-foreground">Credit/Debit Card</span>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:border-cyan-500/50 transition-colors">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Building className="w-5 h-5 text-muted-foreground" />
                        <span className="font-medium text-foreground">PayPal</span>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                {paymentMethod === "card" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-6 space-y-4"
                  >
                    <div>
                      <Label htmlFor="cardNumber" className="text-foreground font-medium">
                        Card Number
                      </Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        className="mt-1 border-border focus:border-cyan-500"
                        value={formData.cardNumber}
                        onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry" className="text-foreground font-medium">
                          Expiry Date
                        </Label>
                        <Input
                          id="expiry"
                          placeholder="MM/YY"
                          className="mt-1 border-border focus:border-cyan-500"
                          value={formData.expiry}
                          onChange={(e) => handleInputChange("expiry", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv" className="text-foreground font-medium">
                          CVV
                        </Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          className="mt-1 border-border focus:border-cyan-500"
                          value={formData.cvv}
                          onChange={(e) => handleInputChange("cvv", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </form>
        </div>

        <div className="lg:sticky lg:top-8 lg:h-fit">
          <Card className="border-border shadow-2xl bg-card">
            <div className="bg-gradient-to-r from-cyan-600 to-purple-600 p-6">
              <h2 className="text-2xl font-bold text-white">Order Summary</h2>
              <p className="text-cyan-100">{itemCount} items in your order</p>
            </div>

            <CardContent className="p-6">
              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="relative w-16 h-16 bg-background rounded-lg overflow-hidden shadow-sm">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground truncate">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              {/* Order Totals */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-semibold text-foreground">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className="text-green-600 font-semibold">Free</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax</span>
                  <span className="font-semibold text-foreground">{formatPrice(tax)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-xl font-bold text-foreground">
                  <span>Total</span>
                  <span className="bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
                    {formatPrice(finalTotal)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full h-14 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={handleSubmit}
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Lock className="w-5 h-5" />
                      Complete Order
                    </div>
                  )}
                </Button>

                <Link href="/">
                  <Button
                    variant="outline"
                    className="w-full h-12 border-2 border-border hover:border-muted-foreground rounded-2xl font-semibold bg-transparent text-foreground"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Continue Shopping
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-6 pt-6 border-t border-border space-y-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>256-bit SSL encryption</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>Free shipping & returns</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-purple-600" />
                  <span>30-day money-back guarantee</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
