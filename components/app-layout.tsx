"use client"

import type React from "react"

import { ModernHeader } from "@/components/modern-header"
import { ModernFooter } from "@/components/modern-footer"
import { CartProvider } from "@/lib/cart-context"
// import { Toaster } from "@/components/ui/toaster"

interface AppLayoutProps {
  children: React.ReactNode
  showHeader?: boolean
  showFooter?: boolean
  blackNavbar?: boolean
}

export function AppLayout({ children, showHeader = true, showFooter = true, blackNavbar = false }: AppLayoutProps) {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        {showHeader && <ModernHeader blackNavbar={blackNavbar} />}
        <main className="flex-1">{children}</main>
        {showFooter && <ModernFooter />}
      </div>
      {/* <Toaster /> */}
    </CartProvider>
  )
}
