"use client"

import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { removeItem, updateQuantity } from "@/store/slices/cartSlice"
import Link from "next/link"

export function CartPageClient() {
  const dispatch = useAppDispatch()
  const { items: cartItems, total, itemCount } = useAppSelector((state) => state.cart)

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

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center max-w-md mx-auto">
              <div className="relative mb-8">
                <div className="w-32 h-32 mx-auto bg-muted rounded-full flex items-center justify-center shadow-inner">
                  <svg
                    className="w-16 h-16 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">0</span>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-3">Your cart awaits</h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Discover premium tech products crafted for excellence
              </p>
              <Link
                href="/"
                className="inline-flex items-center bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Start Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Shopping Cart</span>
          </nav>
          <h1 className="text-4xl font-bold text-foreground mb-2">Shopping Cart</h1>
          <p className="text-muted-foreground">Review your items and proceed to secure checkout</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-card rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-border"
              >
                <div className="flex items-center gap-6">
                  <div className="relative w-28 h-28 bg-muted rounded-2xl overflow-hidden shadow-inner">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-card-foreground mb-1 truncate">{item.name}</h3>
                    <p className="text-muted-foreground mb-2">{item.category}</p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center bg-muted rounded-full p-1 shadow-inner">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="h-10 w-10 rounded-full hover:bg-background hover:shadow-md transition-all duration-200 flex items-center justify-center text-foreground"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="px-4 py-2 text-lg font-bold text-foreground min-w-[3rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="h-10 w-10 rounded-full hover:bg-background hover:shadow-md transition-all duration-200 flex items-center justify-center text-foreground"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="text-right min-w-[120px]">
                      <p className="text-2xl font-bold text-foreground mb-1">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      <p className="text-sm text-muted-foreground">{formatPrice(item.price)} each</p>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="h-10 w-10 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200 flex items-center justify-center"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="xl:col-span-1">
            <div className="sticky top-8">
              <div className="bg-card rounded-2xl shadow-2xl overflow-hidden border border-border">
                <div className="bg-gradient-to-r from-cyan-600 to-purple-600 p-6">
                  <h2 className="text-2xl font-bold text-white">Order Summary</h2>
                  <p className="text-cyan-100">Review your purchase</p>
                </div>

                <div className="p-8 space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
                      <span className="text-xl font-bold text-foreground">{formatPrice(total)}</span>
                    </div>

                    <div className="flex justify-between items-center py-2">
                      <span className="text-muted-foreground">Shipping</span>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-green-600 font-semibold">Free</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center py-2">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="text-foreground font-semibold">Calculated at checkout</span>
                    </div>
                  </div>

                  <div className="border-t border-border pt-6">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-2xl font-bold text-foreground">Total</span>
                      <span className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
                        {formatPrice(total)}
                      </span>
                    </div>

                    <div className="space-y-4">
                      <Link href="/checkout" className="block">
                        <button className="w-full h-14 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center">
                          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>
                          Secure Checkout
                        </button>
                      </Link>

                      <Link
                        href="/"
                        className="block w-full h-12 border-2 border-border hover:border-muted-foreground rounded-2xl font-semibold transition-all duration-300 bg-transparent flex items-center justify-center text-foreground"
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                          />
                        </svg>
                        Continue Shopping
                      </Link>
                    </div>
                  </div>

                  <div className="border-t border-border pt-6 space-y-3">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                      <span>SSL encrypted secure checkout</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                        />
                      </svg>
                      <span>Free shipping on orders over ₦50,000</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      <span>30-day money-back guarantee</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
