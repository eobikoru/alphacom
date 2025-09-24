"use client"

import type React from "react"

import { ModernHeader } from "@/components/modern-header"
import { ModernFooter } from "@/components/modern-footer"
import { Toaster } from "@/components/ui/sonner"

interface AppLayoutProps {
  children: React.ReactNode
  showHeader?: boolean
  showFooter?: boolean
}

export function AppLayout({ children, showHeader = true, showFooter = true }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {showHeader && <ModernHeader />}
      <main className="flex-1">{children}</main>
      {showFooter && <ModernFooter />}
      <Toaster />
    </div>
  )
}
