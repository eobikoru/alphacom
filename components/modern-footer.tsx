"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail } from "lucide-react"
import { useAppSelector } from "@/store/hooks"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getCategoriesWithProducts, type CategoryWithProducts } from "@/lib/api/categories"
import { Skeleton } from "@/components/ui/skeleton"

export function ModernFooter() {
  const isDark = useAppSelector((state) => state.theme.isDark)
  const [categories, setCategories] = useState<CategoryWithProducts[]>([])
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true)
  const currentYear = new Date().getFullYear()
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

  return (
    <footer className={`border-t transition-colors duration-300 ${isDark ? "bg-card" : "bg-white"}`}>
      {/* Newsletter */}
      <div className={`transition-colors duration-300 ${isDark ? "bg-primary" : "bg-gray-900"}`}>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-primary-foreground mb-4">Stay Updated with Latest Tech</h3>
            <p className="text-primary-foreground/80 mb-6">
              Get exclusive deals, new product launches, and tech insights delivered to your inbox
            </p>
            <div className="flex gap-4 max-w-md mx-auto">
              <Input
                placeholder="Enter your email address"
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
              />
              <Button variant="secondary" className="px-8">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
            {isDark ? (
             <img src="/alphacomblacklogo.png" className="h-[5rem] fit-cover" />
            ) : (
              <img src="/alphacomwhitelogo.png" className="h-[5rem] fit-cover" />
              
            )}
            </div>
            <p className="text-muted-foreground text-sm">
              Your trusted partner for premium technology products with 100% warranty and exceptional customer service.
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, index) => (
                <Button key={index} variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Icon className="h-4 w-4" />
                </Button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="space-y-3 text-sm">
              <div>
                <Link
                  href="/about"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </div>
              <div>
                <Link
                  href="/contact"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </div>
              <div>
                <Link
                  href="/privacy"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </div>
              <div>
                <Link
                  href="/terms"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Terms & Conditions
                </Link>
              </div>
              <div>
                <Link
                  href="/warranty"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Warranty Policy
                </Link>
              </div>
              <div>
                <Link
                  href="/return-policy"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Return Policy
                </Link>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <div className="space-y-3 text-sm">
              {isCategoriesLoading ? (
                <>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-4 w-32 rounded" />
                  ))}
                </>
              ) : (
                categories.map((category) => (
                  <div key={category.id}>
                    <Link
                      href={`/categories/${category.slug}`}
                      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {category.name}
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-muted-foreground">
                    No 3 Adepele street, off Medical road,
                    <br />
                    Computer village Ikeja, Lagos
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <div className="text-muted-foreground">
                  <p>+234 702 6384 967</p>
                  <p>+234 812 345 3411</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <p className="text-muted-foreground">Alphacomonline.gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Bottom Footer */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {currentYear} Alphacom Online Store. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Secure payments powered by</span>
            <div className="flex items-center gap-2">
              <div className="h-6 w-8 bg-muted rounded flex items-center justify-center text-xs font-bold">VISA</div>
              <div className="h-6 w-8 bg-muted rounded flex items-center justify-center text-xs font-bold">MC</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
