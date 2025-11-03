"use client"

import type React from "react"
import { Search, User, Menu, MapPin, LogOut, Mail, Shield, ChevronDown, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { CartDrawer, type CartDrawerRef } from "@/components/cart-drawer"
import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { getCategoriesWithProducts, type CategoryWithProducts } from "@/lib/api/categories"
import { useAppSelector } from "@/store/hooks"
interface ModernHeaderProps {
  blackNavbar?: boolean
}

export function ModernHeader({ blackNavbar }: ModernHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [categories, setCategories] = useState<CategoryWithProducts[]>([])
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true)
  const cartDrawerRef = useRef<CartDrawerRef>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { isAuthenticated, user, logout } = useAuth()
  const isDark = useAppSelector((state) => state.theme.isDark)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategoriesWithProducts()
        if (response.success) {
          setCategories(response.data)
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      } finally {
        setIsCategoriesLoading(false)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isUserMenuOpen])

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

  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
    router.push("/")
  }

  const handleOpenCart = () => {
    setIsUserMenuOpen(false)
    cartDrawerRef.current?.open()
  }

  const getUserInitials = () => {
    if (!user?.username) return "U"
    return user.username.charAt(0).toUpperCase()
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
            <div className="flex items-center gap-4">
              <Link
                href="/stores"
                onClick={handleNavClick}
                className="flex items-center gap-2 hover:text-foreground transition-colors w-fit"
              >
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm">Store Locator</span>
              </Link>
              <Link
                href="/track"
                onClick={handleNavClick}
                className="flex items-center gap-2 hover:text-foreground transition-colors w-fit"
              >
                <Package className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm">Track Order</span>
              </Link>
            </div>
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
            {isDark ? (
             <img src="/alphacomblacklogo.png" className="h-[3rem] fit-cover" />
            ) : (
              <img src="/alphacomwhitelogo.png" className="h-[3rem] fit-cover" />
              
            )}
          </Link>

          {/* Search */}
          {/* <div className="flex-1 max-w-2xl mx-8 hidden md:block">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for products, brands, and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 h-12 border-0 focus-visible:ring-2 focus-visible:ring-primary bg-muted/50"
              />
            </form>
          </div> */}

          {/* Actions */}
          <div className="flex items-center gap-4">
            <ThemeToggle />

            <CartDrawer ref={cartDrawerRef} />

            {isAuthenticated && user ? (
              <div className="relative" ref={dropdownRef}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-sm font-semibold">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline text-sm font-medium">{user.username}</span>
                  <ChevronDown className="h-4 w-4 hidden md:inline" />
                </Button>

                {/* Custom Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-popover border border-border rounded-lg shadow-lg overflow-hidden z-50">
                    {/* User Info Header */}
                    <div className="p-4 bg-card">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-lg font-semibold">
                            {getUserInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-semibold text-popover-foreground">{user.username}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </p>
                          {(user.is_admin || user.is_super_admin) && (
                            <p className="text-xs text-primary flex items-center gap-1">
                              <Shield className="h-3 w-3" />
                              {user.is_super_admin ? "Super Admin" : "Admin"}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Menu Items */}
                    <div className="p-2 bg-popover">
                      <button
                        onClick={handleOpenCart}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-left"
                      >
                        <span className="text-base">📦</span>
                        <span>My Orders</span>
                      </button>
                    </div>

                    <Separator />

                    <div className="p-2 bg-popover">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-red-50 dark:hover:bg-red-950 text-red-600 transition-colors text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/signin" onClick={handleNavClick}>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline">Sign In</span>
                </Button>
              </Link>
            )}

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
            {/* <div className="mb-4">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for products, brands, and more..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 h-12 border-0 focus-visible:ring-2 focus-visible:ring-primary bg-muted/50"
                />
              </form>
            </div> */}

            <nav className="flex flex-col gap-4">
              <Link
                href="/categories"
                className="whitespace-nowrap text-sm font-medium hover:text-primary transition-colors px-3 py-2 rounded-md hover:bg-muted/50"
                onClick={handleNavClick}
              >
                All Categories
              </Link>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.slug)}
                  className="text-left text-sm font-medium hover:text-primary transition-colors px-3 py-2 rounded-md hover:bg-muted/50"
                >
                  {category.name}
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
            {isCategoriesLoading ? (
              <>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-8 w-24 rounded-md" />
                ))}
              </>
            ) : (
              categories.map((category) => (
                <div key={category.id} className="relative">
                  <Link
                    href={`/categories/${category.slug}`}
                    className="whitespace-nowrap text-sm font-medium hover:text-primary transition-colors px-3 py-2 rounded-md hover:bg-muted/50"
                  >
                    {category.name}
                  </Link>
                </div>
              ))
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
