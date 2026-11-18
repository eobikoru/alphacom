"use client"

import { cdnImage } from "@/lib/image-url"
import type React from "react"
import { createPortal } from "react-dom"
import { Search, User, Menu, X, MapPin, LogOut, Mail, Shield, ChevronDown, ChevronRight, Package, FolderTree, Layers, ShoppingBag, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { CartDrawer, type CartDrawerRef } from "@/components/cart-drawer"
import { useState, useRef, useEffect, useMemo } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useAuthModal } from "@/components/auth-modal"
import { getCategoriesWithProducts, type CategoryWithProducts } from "@/lib/api/categories"
import { getProductsWithCategories, type Product } from "@/lib/api/products"
import { productHref } from "@/lib/product-url"
import { useAppSelector } from "@/store/hooks"
interface ModernHeaderProps {
  blackNavbar?: boolean
}

const SEARCH_DEBOUNCE_MS = 300
const MIN_QUERY_LENGTH = 2
const MAX_PRODUCTS_IN_DROPDOWN = 8

export function ModernHeader({ blackNavbar }: ModernHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [menuPresent, setMenuPresent] = useState(false)
  const [menuShown, setMenuShown] = useState(false)
  const mobileSearchRef = useRef<HTMLDivElement>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [categories, setCategories] = useState<CategoryWithProducts[]>([])
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true)
  const [searchProducts, setSearchProducts] = useState<Product[]>([])
  const [productsSearchLoading, setProductsSearchLoading] = useState(false)
  const { openAuth } = useAuthModal()
  const cartDrawerRef = useRef<CartDrawerRef>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  const isLandingPage = pathname === "/"
  const { isAuthenticated, user, logout } = useAuth()
  const isDark = useAppSelector((state) => state.theme.isDark)

  useEffect(() => {
    if (isMobileMenuOpen) {
      setMenuPresent(true)
      const frameId = requestAnimationFrame(() => setMenuShown(true))
      const previousOverflow = document.body.style.overflow
      document.body.style.overflow = "hidden"
      const onKey = (event: KeyboardEvent) => {
        if (event.key === "Escape") setIsMobileMenuOpen(false)
      }
      window.addEventListener("keydown", onKey)
      return () => {
        cancelAnimationFrame(frameId)
        document.body.style.overflow = previousOverflow
        window.removeEventListener("keydown", onKey)
      }
    }

    setMenuShown(false)
    const timer = window.setTimeout(() => setMenuPresent(false), 320)
    return () => window.clearTimeout(timer)
  }, [isMobileMenuOpen])

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
    const openCart = () => {
      setIsUserMenuOpen(false)
      cartDrawerRef.current?.open()
    }
    window.addEventListener("open-cart-drawer", openCart)
    return () => window.removeEventListener("open-cart-drawer", openCart)
  }, [])

  const q = searchQuery.trim().toLowerCase()
  const matchedCategories = useMemo(() => {
    if (q.length < MIN_QUERY_LENGTH) return []
    return categories.filter((c) => c.name.toLowerCase().includes(q))
  }, [categories, q])

  const matchedSubcategories = useMemo(() => {
    if (q.length < MIN_QUERY_LENGTH) return []
    const out: { name: string; slug: string; categorySlug: string }[] = []
    categories.forEach((cat) => {
      ;(cat.subcategories || []).forEach((sub) => {
        if (sub.name.toLowerCase().includes(q)) {
          out.push({ name: sub.name, slug: sub.slug, categorySlug: cat.slug })
        }
      })
    })
    return out
  }, [categories, q])

  useEffect(() => {
    if (q.length < MIN_QUERY_LENGTH) {
      setSearchProducts([])
      return
    }
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
    searchDebounceRef.current = setTimeout(() => {
      setProductsSearchLoading(true)
      getProductsWithCategories({ search: searchQuery.trim(), per_page: MAX_PRODUCTS_IN_DROPDOWN })
        .then((res) => {
          if (res.success && res.data) setSearchProducts(res.data)
          else setSearchProducts([])
        })
        .catch(() => setSearchProducts([]))
        .finally(() => {
          setProductsSearchLoading(false)
          searchDebounceRef.current = null
        })
    }, SEARCH_DEBOUNCE_MS)
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
    }
  }, [searchQuery])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      const insideSearch = searchRef.current?.contains(target) || mobileSearchRef.current?.contains(target)
      if (!insideSearch) {
        setIsSearchOpen(false)
      }
    }
    if (isSearchOpen) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isSearchOpen])

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
              {/* <span>Free shipping on orders over ₦50,000</span> */}
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
             <img src="/alpd.png" alt="Alphacom" className="h-12 w-auto" />
            ) : (
              <img src="/alpw1.png" alt="Alphacom" className="h-12 w-auto" />
              
            )}
          </Link>

          {/* Search - categories, subcategories, products (desktop; hidden on landing so one search shows below for all devices) */}
          <div ref={searchRef} className={`flex-1 max-w-xl mx-4 relative ${isLandingPage ? "hidden" : "hidden md:block"}`}>
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search categories, subcategories & products..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  if (e.target.value.trim().length >= MIN_QUERY_LENGTH) setIsSearchOpen(true)
                  else setIsSearchOpen(false)
                }}
                onFocus={() => searchQuery.trim().length >= MIN_QUERY_LENGTH && setIsSearchOpen(true)}
                className="pl-10 pr-4 h-10 rounded-lg border bg-muted/50 focus-visible:ring-2 focus-visible:ring-primary"
              />
            </form>
            {isSearchOpen && q.length >= MIN_QUERY_LENGTH && (
              <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border border-border bg-popover shadow-lg z-50 max-h-[70vh] overflow-y-auto">
                <div className="p-2">
                  {matchedCategories.length > 0 && (
                    <div className="mb-2">
                      <p className="px-2 py-1 text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                        <FolderTree className="h-3.5 w-3.5" /> Categories
                      </p>
                      {matchedCategories.slice(0, 5).map((c) => (
                        <Link
                          key={c.id}
                          href={`/categories/${c.slug}`}
                          onClick={(e) => {
                            e.preventDefault()
                            setIsSearchOpen(false)
                            setSearchQuery("")
                            handleNavClick()
                            router.push(`/categories/${c.slug}`)
                          }}
                          className="block px-3 py-2 text-sm rounded-md hover:bg-accent"
                        >
                          {c.name}
                        </Link>
                      ))}
                    </div>
                  )}
                  {matchedSubcategories.length > 0 && (
                    <div className="mb-2">
                      <p className="px-2 py-1 text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                        <Layers className="h-3.5 w-3.5" /> Subcategories
                      </p>
                      {matchedSubcategories.slice(0, 5).map((s, i) => (
                        <Link
                          key={`${s.categorySlug}-${s.slug}-${i}`}
                          href={`/categories/${s.categorySlug}/${s.slug}`}
                          onClick={(e) => {
                            e.preventDefault()
                            setIsSearchOpen(false)
                            setSearchQuery("")
                            handleNavClick()
                            router.push(`/categories/${s.categorySlug}/${s.slug}`)
                          }}
                          className="block px-3 py-2 text-sm rounded-md hover:bg-accent"
                        >
                          {s.name}
                        </Link>
                      ))}
                    </div>
                  )}
                  {(searchProducts.length > 0 || productsSearchLoading) && (
                    <div>
                      <p className="px-2 py-1 text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                        <ShoppingBag className="h-3.5 w-3.5" /> Products
                      </p>
                      {productsSearchLoading ? (
                        <div className="px-3 py-4 text-sm text-muted-foreground">Searching...</div>
                      ) : (
                        searchProducts.map((p) => (
                          <Link
                            key={p.id}
                            href={productHref(p)}
                            onClick={(e) => {
                              e.preventDefault()
                              setIsSearchOpen(false)
                              setSearchQuery("")
                              handleNavClick()
                              router.push(productHref(p))
                            }}
                            className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent"
                          >
                            {p.main_image && (
                              <img src={cdnImage(p.main_image, 96)} alt="" className="h-10 w-10 rounded object-cover shrink-0" />
                            )}
                            <span className="truncate">{p.name}</span>
                          </Link>
                        ))
                      )}
                    </div>
                  )}
                  {!productsSearchLoading && matchedCategories.length === 0 && matchedSubcategories.length === 0 && searchProducts.length === 0 && q.length >= MIN_QUERY_LENGTH && (
                    <div className="px-3 py-4 text-sm text-muted-foreground">No results. Try different keywords.</div>
                  )}
                </div>
                <div className="border-t border-border p-2">
                  <Link
                    href={`/search?q=${encodeURIComponent(searchQuery.trim())}`}
                    onClick={(e) => {
                      e.preventDefault()
                      setIsSearchOpen(false)
                      setSearchQuery("")
                      handleNavClick()
                      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
                    }}
                    className="block w-full text-center text-sm font-medium text-primary hover:underline"
                  >
                    View all results for &quot;{searchQuery.trim()}&quot;
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link
              href="/blog"
              onClick={handleNavClick}
              className={`relative flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-foreground ${
                pathname?.startsWith("/blog") ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              <BookOpen className="hidden h-4 w-4 text-foreground sm:block" />
              Blog
              {!pathname?.startsWith("/blog") && (
                <span className="pointer-events-none absolute -right-3 -top-4 animate-bounce rounded-full bg-red-600 px-1.5 py-0.5 text-[9px] font-bold uppercase leading-none tracking-wider text-white shadow-sm">
                  New
                </span>
              )}
            </Link>
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
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => {
                  handleNavClick()
                  openAuth("signin")
                }}
              >
                <User className="h-4 w-4" />
                <span className="hidden md:inline">Sign In</span>
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((open) => !open)}
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Landing page only: show search input for all devices */}
        {isLandingPage && (
          <div ref={searchRef} className="relative mt-3 max-w-full md:max-w-md lg:max-w-sm">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search categories, subcategories & products..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  if (e.target.value.trim().length >= MIN_QUERY_LENGTH) setIsSearchOpen(true)
                  else setIsSearchOpen(false)
                }}
                onFocus={() => searchQuery.trim().length >= MIN_QUERY_LENGTH && setIsSearchOpen(true)}
                className="pl-10 pr-4 h-10 md:h-9 text-sm rounded-lg border bg-muted/60 focus-visible:ring-2 focus-visible:ring-primary"
              />
            </form>
            {isSearchOpen && q.length >= MIN_QUERY_LENGTH && (
              <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border border-border bg-popover shadow-lg max-h-64 overflow-y-auto z-[100] w-full md:shadow-xl">
                <div className="p-2">
                  {matchedCategories.length > 0 && (
                    <div className="mb-2">
                      <p className="px-2 py-1 text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                        <FolderTree className="h-3.5 w-3.5" /> Categories
                      </p>
                      {matchedCategories.slice(0, 5).map((c) => (
                        <Link
                          key={c.id}
                          href={`/categories/${c.slug}`}
                          onClick={(e) => { e.preventDefault(); setIsSearchOpen(false); setSearchQuery(""); handleNavClick(); router.push(`/categories/${c.slug}`); }}
                          className="block px-3 py-2 text-sm rounded-md hover:bg-accent"
                        >
                          {c.name}
                        </Link>
                      ))}
                    </div>
                  )}
                  {matchedSubcategories.length > 0 && (
                    <div className="mb-2">
                      <p className="px-2 py-1 text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                        <Layers className="h-3.5 w-3.5" /> Subcategories
                      </p>
                      {matchedSubcategories.slice(0, 5).map((s, i) => (
                        <Link
                          key={`${s.categorySlug}-${s.slug}-${i}`}
                          href={`/categories/${s.categorySlug}/${s.slug}`}
                          onClick={(e) => { e.preventDefault(); setIsSearchOpen(false); setSearchQuery(""); handleNavClick(); router.push(`/categories/${s.categorySlug}/${s.slug}`); }}
                          className="block px-3 py-2 text-sm rounded-md hover:bg-accent"
                        >
                          {s.name}
                        </Link>
                      ))}
                    </div>
                  )}
                  {(searchProducts.length > 0 || productsSearchLoading) && (
                    <div>
                      <p className="px-2 py-1 text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                        <ShoppingBag className="h-3.5 w-3.5" /> Products
                      </p>
                      {productsSearchLoading ? (
                        <div className="px-3 py-2 text-sm text-muted-foreground">Searching...</div>
                      ) : (
                        searchProducts.slice(0, 5).map((p) => (
                          <Link
                            key={p.id}
                            href={productHref(p)}
                            onClick={(e) => { e.preventDefault(); setIsSearchOpen(false); setSearchQuery(""); handleNavClick(); router.push(productHref(p)); }}
                            className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent"
                          >
                            {p.main_image && <img src={cdnImage(p.main_image, 96)} alt="" className="h-10 w-10 rounded object-cover shrink-0" />}
                            <span className="truncate">{p.name}</span>
                          </Link>
                        ))
                      )}
                    </div>
                  )}
                  {!productsSearchLoading && matchedCategories.length === 0 && matchedSubcategories.length === 0 && searchProducts.length === 0 && (
                    <div className="px-3 py-3 text-sm text-muted-foreground">No results.</div>
                  )}
                </div>
                <div className="border-t border-border p-2">
                  <Link
                    href={`/search?q=${encodeURIComponent(searchQuery.trim())}`}
                    onClick={(e) => { e.preventDefault(); setIsSearchOpen(false); setSearchQuery(""); handleNavClick(); router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`); }}
                    className="block w-full text-center text-sm font-medium text-primary hover:underline"
                  >
                    View all results
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Navigation */}
      <div className="border-t bg-card/50 border-border">
        <div className="container mx-auto px-4">
          <nav className="no-scrollbar flex items-center gap-6 overflow-x-auto py-3">
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
      {menuPresent &&
        createPortal(
          <div className="md:hidden">
            <button
              type="button"
              aria-label="Close menu"
              className={`fixed inset-0 z-[140] bg-stone-950/45 backdrop-blur-[2px] transition-opacity duration-300 ${
                menuShown ? "opacity-100" : "opacity-0"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div
              className={`fixed inset-y-0 right-0 z-[150] flex w-[min(100%-2.75rem,22.5rem)] flex-col bg-white shadow-[0_24px_80px_-28px_rgba(28,25,23,0.55)] transition-transform duration-300 ease-out dark:bg-stone-950 ${
                menuShown ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4 dark:border-white/10">
                <img src={isDark ? "/alpd.png" : "/alpw1.png"} alt="Alphacom" className="h-8 w-auto" />
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 text-stone-500 transition-colors hover:bg-stone-50 hover:text-stone-900 dark:border-white/10 dark:text-stone-400 dark:hover:bg-white/5 dark:hover:text-white"
                  aria-label="Close menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="px-5 pt-5" ref={mobileSearchRef}>
                <form
                  onSubmit={(event) => {
                    handleSearch(event)
                    setIsMobileMenuOpen(false)
                  }}
                  className="relative"
                >
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                  <Input
                    placeholder="Search products"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setIsSearchOpen(e.target.value.trim().length >= MIN_QUERY_LENGTH)
                    }}
                    onFocus={() => searchQuery.trim().length >= MIN_QUERY_LENGTH && setIsSearchOpen(true)}
                    className="h-11 rounded-full border-stone-200 bg-stone-50 pl-10 dark:border-white/10 dark:bg-stone-900"
                  />
                </form>
                {isSearchOpen && q.length >= MIN_QUERY_LENGTH && (
                  <div className="mt-2 max-h-56 overflow-y-auto rounded-2xl border border-stone-200 bg-white shadow-lg dark:border-white/10 dark:bg-stone-900">
                    <div className="p-2">
                      {matchedCategories.slice(0, 4).map((c) => (
                        <Link
                          key={c.id}
                          href={`/categories/${c.slug}`}
                          onClick={() => {
                            setIsSearchOpen(false)
                            setSearchQuery("")
                            setIsMobileMenuOpen(false)
                          }}
                          className="block rounded-lg px-3 py-2 text-sm hover:bg-stone-50 dark:hover:bg-white/5"
                        >
                          {c.name}
                        </Link>
                      ))}
                      {searchProducts.slice(0, 4).map((p) => (
                        <Link
                          key={p.id}
                          href={productHref(p)}
                          onClick={() => {
                            setIsSearchOpen(false)
                            setSearchQuery("")
                            setIsMobileMenuOpen(false)
                          }}
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-stone-50 dark:hover:bg-white/5"
                        >
                          {p.main_image && (
                            <img src={cdnImage(p.main_image, 96)} alt="" className="h-9 w-9 shrink-0 rounded-md object-cover" />
                          )}
                          <span className="truncate">{p.name}</span>
                        </Link>
                      ))}
                      {productsSearchLoading && <p className="px-3 py-2 text-sm text-stone-500">Searching...</p>}
                    </div>
                  </div>
                )}
              </div>

              <nav className="mt-4 flex-1 overflow-y-auto px-3 pb-4">
                <p className="px-3 pb-2 text-[11px] font-medium uppercase tracking-[0.22em] text-[#8E1B2C] dark:text-rose-300">
                  Categories
                </p>
                <Link
                  href="/categories"
                  onClick={handleNavClick}
                  className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-stone-950 transition-colors hover:bg-stone-50 dark:text-white dark:hover:bg-white/5"
                >
                  All categories
                  <ChevronRight className="h-4 w-4 text-stone-400" />
                </Link>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleCategoryClick(category.slug)}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-medium text-stone-950 transition-colors hover:bg-stone-50 dark:text-white dark:hover:bg-white/5"
                  >
                    {category.name}
                    <ChevronRight className="h-4 w-4 text-stone-400" />
                  </button>
                ))}
              </nav>

              <div className="grid grid-cols-2 gap-2 border-t border-stone-200 p-4 dark:border-white/10">
                <Link
                  href="/stores"
                  onClick={handleNavClick}
                  className="flex items-center justify-center gap-2 rounded-full border border-stone-200 py-2.5 text-sm text-stone-700 transition-colors hover:bg-stone-50 dark:border-white/10 dark:text-stone-200 dark:hover:bg-white/5"
                >
                  <MapPin className="h-4 w-4" />
                  Store
                </Link>
                <Link
                  href="/track"
                  onClick={handleNavClick}
                  className="flex items-center justify-center gap-2 rounded-full bg-[#8E1B2C] py-2.5 text-sm text-white transition-colors hover:bg-[#741625] dark:bg-rose-300 dark:text-stone-950 dark:hover:bg-rose-200"
                >
                  <Package className="h-4 w-4" />
                  Track order
                </Link>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </header>
  )
}
