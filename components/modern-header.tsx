"use client"

import type React from "react"
import { Search, User, Menu, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { useState } from "react"
import { CartDrawer } from "./cart-drawer"

interface ModernHeaderProps {
  blackNavbar?: boolean
}

export function ModernHeader({ blackNavbar }: ModernHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleNavClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
    setIsMobileMenuOpen(false)
  }

  const handleCategoryClick = (categorySlug: string) => {
    setIsMobileMenuOpen(false)
    router.push(`/categories/${categorySlug}`)
  }

  const categoryMap: Record<string, string> = {
    "Computers & Accessories": "computers-accessories",
    Cameras: "cameras",
    "Audio & Speakers": "audio-speakers",
    "Data Storage": "data-storage",
    "Printers & Scanners": "printers-scanners",
    Networking: "networking",
    "Software & Security": "software-security",
    Accessories: "accessories",
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-border">
      {/* Top bar */}
      <div className="border-b bg-muted/30 border-border">
        <div className="container mx-auto px-4 py-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 text-sm text-muted-foreground">
            <Link
              href="/stores"
              onClick={handleNavClick}
              className="flex items-center gap-2 hover:text-foreground transition-colors w-fit"
            >
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="text-xs sm:text-sm">Store Locator</span>
            </Link>
            <div className="text-xs sm:text-sm text-center sm:text-right">
              <span>Free shipping on orders over ₦50,000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" onClick={handleNavClick} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">A</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">ALPHACOM</h1>
                <p className="text-xs -mt-1 text-muted-foreground">TECH & GADGETS</p>
              </div>
            </div>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-2xl mx-8 hidden md:block">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for products, brands, and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 h-12 border-0 focus-visible:ring-2 focus-visible:ring-primary bg-muted/50"
              />
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <ThemeToggle />

            <CartDrawer />

            <Link href="/auth/signin" onClick={handleNavClick}>
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden md:inline">Sign In</span>
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 p-4 rounded-lg border bg-card border-border">
            {/* Mobile Search */}
            <div className="mb-4">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for products, brands, and more..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 h-12 border-0 focus-visible:ring-2 focus-visible:ring-primary bg-muted/50"
                />
              </form>
            </div>

            <nav className="flex flex-col gap-4">
              <Link
                href="/categories"
                className="text-sm font-medium hover:text-primary transition-colors px-3 py-2 rounded-md hover:bg-muted/50"
                onClick={handleNavClick}
              >
                All Categories
              </Link>
              {[
                "Computers & Accessories",
                "Cameras",
                "Audio & Speakers",
                "Data Storage",
                "Printers & Scanners",
                "Networking",
                "Software & Security",
                "Accessories",
              ].map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(categoryMap[category])}
                  className="text-left text-sm font-medium hover:text-primary transition-colors px-3 py-2 rounded-md hover:bg-muted/50"
                >
                  {category}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="border-t bg-card/50 border-border">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-8 py-3 overflow-x-auto">
            <Link
              href="/categories"
              onClick={handleNavClick}
              className="whitespace-nowrap text-sm font-medium hover:text-primary transition-colors px-3 py-2 rounded-md hover:bg-muted/50"
            >
              All Categories
            </Link>
            {[
              "Computers & Accessories",
              "Cameras",
              "Audio & Speakers",
              "Data Storage",
              "Printers & Scanners",
              "Networking",
              "Software & Security",
              "Accessories",
            ].map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(categoryMap[category])}
                className="whitespace-nowrap text-sm font-medium hover:text-primary transition-colors px-3 py-2 rounded-md hover:bg-muted/50"
              >
                {category}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
