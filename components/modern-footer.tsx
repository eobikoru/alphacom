"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Instagram, Youtube, Linkedin, MapPin, Phone, Mail } from "lucide-react"
import { useAppSelector } from "@/store/hooks"
import Link from "next/link"
import { useEffect, useState, type FormEvent } from "react"
import { toast } from "sonner"
import { rememberNewsletterPrompt } from "@/components/newsletter-welcome"
import { getCategoriesWithProducts, type CategoryWithProducts } from "@/lib/api/categories"
import { Skeleton } from "@/components/ui/skeleton"

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/alphacom_online", Icon: Instagram },
  { label: "TikTok", href: "https://www.tiktok.com/@alphacom_online", Icon: TikTokIcon },
  { label: "X (Twitter)", href: "https://x.com/alphacom_online", Icon: XIcon },
  { label: "YouTube", href: "https://www.youtube.com/@alphacom_online", Icon: Youtube },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/alphacom-interbiz-projects-limited-71959b123/",
    Icon: Linkedin,
  },
]

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
        rememberNewsletterPrompt("subscribed")
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
      <div className="border-t border-stone-200/80 bg-[#f6f3f0] dark:border-white/10 dark:bg-stone-950">
        <div className="mx-auto grid max-w-6xl items-end gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)] lg:gap-16">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-[#8E1B2C] dark:text-rose-300">
              Newsletter
            </p>
            <h3 className="mt-4 text-3xl font-light tracking-tight text-stone-950 dark:text-white">
              Stay updated with the latest tech
            </h3>
            <p className="mt-4 max-w-md text-sm leading-7 text-stone-600 dark:text-stone-300">
              Get exclusive deals, new product launches, and tech insights delivered to your inbox.
            </p>
          </div>
          <form onSubmit={handleSubscribe} noValidate className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label htmlFor="footer-newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="footer-newsletter-email"
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email address"
              autoComplete="email"
              disabled={isSubscribing}
              className="h-11 w-full border border-stone-200 bg-white px-3 text-sm text-stone-950 outline-none transition-colors placeholder:text-stone-400 focus:border-[#8E1B2C] disabled:opacity-60 dark:border-white/10 dark:bg-stone-950 dark:text-white dark:focus:border-rose-300"
            />
            <button
              type="submit"
              disabled={isSubscribing}
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-[#8E1B2C] px-5 text-sm text-white transition-colors hover:bg-[#741625] disabled:opacity-60 dark:bg-rose-300 dark:text-stone-950 dark:hover:bg-rose-200"
            >
              {isSubscribing ? "Subscribing…" : "Subscribe"}
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
            {isDark ? (
             <img src="/alphacomblacklogo.png" alt="AlphaCom Online" width="160" height="80" className="h-[5rem] w-auto" />
            ) : (
              <img src="/alphacomwhitelogo.png" alt="AlphaCom Online" width="160" height="80" className="h-[5rem] w-auto" />
              
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
                  <address className="text-muted-foreground not-italic">
                    No 3 Adepele Street, off Medical Road,
                    <br />
                    Computer Village, Ikeja, Lagos
                  </address>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <div className="text-muted-foreground">
                  <p><a href="tel:+2347026384967">+234 702 638 4967</a></p>
                  <p><a href="tel:+2348137331005">+234 813 733 1005</a></p>
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
