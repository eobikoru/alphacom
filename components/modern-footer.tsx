"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { MapPin, Phone, Mail } from "lucide-react"
import { SOCIAL_LINKS } from "@/lib/social-links"
import { useAppSelector } from "@/store/hooks"
import Link from "next/link"
import { useEffect, useState, type FormEvent } from "react"
import { toast } from "sonner"
import { getCategoriesWithProducts, type CategoryWithProducts } from "@/lib/api/categories"
import { Skeleton } from "@/components/ui/skeleton"

export function ModernFooter() {
  const isDark = useAppSelector((state) => state.theme.isDark)
  const [categories, setCategories] = useState<CategoryWithProducts[]>([])
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true)
  const [newsletterEmail, setNewsletterEmail] = useState("")
  const [isSubscribing, setIsSubscribing] = useState(false)

  const handleSubscribe = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const email = newsletterEmail.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.")
      return
    }

    setIsSubscribing(true)
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await response.json().catch(() => null)
      if (response.ok && data?.success) {
        toast.success(data.message ?? "You're subscribed.")
        setNewsletterEmail("")
      } else {
        toast.error(data?.message ?? "We couldn't subscribe you right now. Please try again.")
      }
    } catch {
      toast.error("We couldn't subscribe you right now. Please try again.")
    } finally {
      setIsSubscribing(false)
    }
  }
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
      {/* Newsletter - blends with footer */}
      <div className="border-t border-border bg-muted/40 dark:bg-muted/20 transition-colors duration-300">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">Stay Updated with Latest Tech</h3>
            <p className="text-muted-foreground mb-6">
              Get exclusive deals, new product launches, and tech insights delivered to your inbox
            </p>
            <form onSubmit={handleSubscribe} noValidate className="flex gap-4 max-w-md mx-auto">
              <Input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                aria-label="Email address"
                autoComplete="email"
                disabled={isSubscribing}
                className="bg-background border-border"
              />
              <Button type="submit" className="px-8" disabled={isSubscribing}>
                {isSubscribing ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
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
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <Button key={label} asChild variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                    <Icon className="h-4 w-4" />
                  </a>
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
                  href="/blog"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Blog
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
                  <p>+234 702 638 4967</p>
                  <p>+234 813 733 1005</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <p className="text-muted-foreground">alphacomonline@gmail.com</p>
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
