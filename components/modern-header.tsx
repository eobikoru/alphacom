"use client"

import type React from "react"
import { Search, User, Menu, MapPin, Package, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useAppSelector } from "@/store/hooks"
import { ThemeToggle } from "@/components/theme-toggle"
import { useState } from "react"

interface ModernHeaderProps {
  blackNavbar?: boolean
}

export function ModernHeader({ blackNavbar }: ModernHeaderProps) {
  const { itemCount } = useAppSelector((state) => state.cart)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  const handleNavClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
    setIsMobileMenuOpen(false)
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
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-6">
              <Link
                href="/stores"
                onClick={handleNavClick}
                className="flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <MapPin className="h-4 w-4" />
                <span>Store Locator</span>
              </Link>
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span>Track Your Order</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
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
          <div className="flex-1 max-w-2xl mx-8">
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

            <Link href="/auth/signin" onClick={handleNavClick}>
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden md:inline">Sign In</span>
              </Button>
            </Link>

            <Link href="/cart" onClick={handleNavClick}>
              <Button
                variant="outline"
                size="icon"
                className="relative transition-all duration-300 bg-transparent hover:bg-muted/50"
              >
                <ShoppingCart className="h-4 w-4" />
                {itemCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-gradient-to-r from-cyan-600 to-purple-600 border-0"
                  >
                    {itemCount}
                  </Badge>
                )}
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
            <nav className="flex flex-col gap-4">
              {/* <Link
                href="/about"
                className="text-sm font-medium hover:text-primary transition-colors px-3 py-2 rounded-md hover:bg-muted/50"
                onClick={handleNavClick}
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="text-sm font-medium hover:text-primary transition-colors px-3 py-2 rounded-md hover:bg-muted/50"
                onClick={handleNavClick}
              >
                Contact Us
              </Link> */}
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
                <Link
                  key={category}
                  href={`/categories/${categoryMap[category]}`}
                  className="text-sm font-medium hover:text-primary transition-colors px-3 py-2 rounded-md hover:bg-muted/50"
                  onClick={handleNavClick}
                >
                  {category}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="border-t bg-card/50 border-border">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-8 py-3 overflow-x-auto">
            {/* <Link
              href="/about"
              onClick={handleNavClick}
              className="whitespace-nowrap text-sm font-medium hover:text-primary transition-colors px-3 py-2 rounded-md hover:bg-muted/50"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              onClick={handleNavClick}
              className="whitespace-nowrap text-sm font-medium hover:text-primary transition-colors px-3 py-2 rounded-md hover:bg-muted/50"
            >
              Contact Us
            </Link> */}
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
              <Link
                key={category}
                href={`/categories/${categoryMap[category]}`}
                onClick={handleNavClick}
                className="whitespace-nowrap text-sm font-medium hover:text-primary transition-colors px-3 py-2 rounded-md hover:bg-muted/50"
              >
                {category}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
