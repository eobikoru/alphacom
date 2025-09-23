"use client"

import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { updateQuantity, removeItem } from "@/store/slices/cartSlice"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Lock, Truck, Shield } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

export function PremiumCart() {
  const dispatch = useAppDispatch()
  const { items, total, itemCount } = useAppSelector((state) => state.cart)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    dispatch(updateQuantity({ id, quantity: newQuantity }))
  }

  const handleRemoveItem = (id: string) => {
    dispatch(removeItem(id))
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto"
        >
          <div className="relative mb-8">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center shadow-inner">
              <ShoppingBag className="w-16 h-16 text-slate-400" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">0</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Your cart awaits</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">Discover premium tech products crafted for excellence</p>
          <Link href="/">
            <Button className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Start Shopping
            </Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <nav className="flex items-center space-x-2 text-sm text-slate-600 mb-4">
          <Link href="/" className="hover:text-slate-900 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">Shopping Cart</span>
        </nav>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Shopping Cart</h1>
        <p className="text-slate-600">Review your items and proceed to secure checkout</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <AnimatePresence>
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-6">
                      <div className="relative w-28 h-28 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl overflow-hidden shadow-inner">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-slate-900 mb-1 truncate">{item.name}</h3>
                        <p className="text-slate-600 mb-2">{item.category}</p>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="flex items-center bg-slate-50 rounded-full p-1 shadow-inner">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            className="h-10 w-10 rounded-full hover:bg-white hover:shadow-md transition-all duration-200"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="px-4 py-2 text-lg font-bold text-slate-900 min-w-[3rem] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="h-10 w-10 rounded-full hover:bg-white hover:shadow-md transition-all duration-200"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="text-right min-w-[120px]">
                          <p className="text-2xl font-bold text-slate-900 mb-1">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                          <p className="text-sm text-slate-500">{formatPrice(item.price)} each</p>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                          className="h-10 w-10 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="xl:col-span-1">
          <div className="sticky top-8">
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-slate-50 overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-600 to-purple-600 p-6">
                <h2 className="text-2xl font-bold text-white">Order Summary</h2>
                <p className="text-cyan-100">Review your purchase</p>
              </div>

              <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-600">Subtotal ({itemCount} items)</span>
                    <span className="text-xl font-bold text-slate-900">{formatPrice(total)}</span>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-600">Shipping</span>
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-green-600" />
                      <span className="text-green-600 font-semibold">Free</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-600">Tax</span>
                    <span className="text-slate-900 font-semibold">Calculated at checkout</span>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-6">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-2xl font-bold text-slate-900">Total</span>
                    <span className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
                      {formatPrice(total)}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <Link href="/checkout">
                      <Button className="w-full h-14 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                        <Lock className="w-5 h-5 mr-3" />
                        Secure Checkout
                      </Button>
                    </Link>

                    <Link href="/">
                      <Button
                        variant="outline"
                        className="w-full h-12 border-2 border-slate-200 hover:border-slate-300 rounded-2xl font-semibold transition-all duration-300 bg-transparent"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Continue Shopping
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span>SSL encrypted secure checkout</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Truck className="w-4 h-4 text-blue-600" />
                    <span>Free shipping on orders over ₦50,000</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Lock className="w-4 h-4 text-purple-600" />
                    <span>30-day money-back guarantee</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
