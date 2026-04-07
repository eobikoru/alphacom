"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Truck, Headphones, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import gsap from "gsap"
import { useQuery } from "@tanstack/react-query"
import apiClient from "@/lib/api-client"
import { Skeleton } from "@/components/ui/skeleton"

const fallbackSlides = [
  {
    id: 1,
    title: "Your Reliable",
    subtitle: "Trusted Logitech products and warranty.",
    image: "/sandisk.jpeg",
  },
  {
    id: 2,
    title: "Your Reliable",
    subtitle: "Trusted Sandisk products and warranty.",
    image: "/logitech.jpeg",
  },
]

const AUTO_PLAY_RESUME_MS = 4000

interface BannerItem {
  id: string
  title: string
  subtitle: string
  image_url: string
}

interface BannersResponse {
  data: BannerItem[]
  message: string
  success: boolean
  total: number
}

function splitTitleForHighlight(title: string): { start: string; end: string } {
  const words = title.trim().split(/\s+/).filter(Boolean)
  if (words.length <= 2) return { start: "", end: title.trim() }

  const splitIndex = words.length - 2
  return {
    start: words.slice(0, splitIndex).join(" "),
    end: words.slice(splitIndex).join(" "),
  }
}

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const titleRef = useRef<HTMLSpanElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const imageRef = useRef<HTMLElement>(null)

  const { data, isLoading } = useQuery({
    queryKey: ["hero-banners"],
    queryFn: async () => {
      const response = await apiClient.get<BannersResponse>("/api/v1/banners")
      return response.data
    },
  })

  const heroSlides =
    data?.success && Array.isArray(data.data) && data.data.length > 0
      ? data.data.map((banner, index) => ({
          id: index + 1,
          title: banner.title || "Featured Products",
          subtitle: banner.subtitle || "Shop premium tech products with warranty.",
          image: banner.image_url || "/placeholder.svg",
        }))
      : fallbackSlides

  useEffect(() => {
    if (currentSlide >= heroSlides.length) setCurrentSlide(0)
  }, [currentSlide, heroSlides.length])

  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, heroSlides.length])

  useEffect(() => {
    const textNodes = [titleRef.current, subtitleRef.current].filter(Boolean) as HTMLElement[]
    const imageEl = imageRef.current
    if (textNodes.length === 0 && !imageEl) return

    const tl = gsap.timeline({ defaults: { ease: "power2.out" } })
    if (textNodes.length > 0) {
      tl.fromTo(textNodes, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.1 })
    }
    if (imageEl) {
      tl.fromTo(imageEl, { opacity: 0, scale: 0.96, x: 24 }, { opacity: 1, scale: 1, x: 0, duration: 0.6 }, textNodes.length > 0 ? "-=0.35" : 0)
    }
  }, [currentSlide])

  const handleHeroMouseEnter = () => {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current)
    setIsAutoPlaying(false)
  }

  const handleHeroMouseLeave = () => {
    resumeTimeoutRef.current = setTimeout(() => setIsAutoPlaying(true), AUTO_PLAY_RESUME_MS)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    setIsAutoPlaying(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
    setIsAutoPlaying(false)
  }

  const currentSlideData = heroSlides[currentSlide]
  const titleParts = splitTitleForHighlight(currentSlideData.title)

  return (
    <section
      className="relative overflow-hidden rounded-b-2xl bg-gradient-to-br from-orange-400/15 via-background to-rose-500/15 border-b border-border"
      itemScope
      itemType="https://schema.org/WebPageElement"
      aria-label="Hero section"
      onMouseEnter={handleHeroMouseEnter}
      onMouseLeave={handleHeroMouseLeave}
    >
      <meta itemProp="name" content="AlphaCom Hero" />
      <meta itemProp="description" content="Premium technology store - quality gadgets and expert support" />

      <div className="container mx-auto px-4 py-8 lg:py-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Copy + CTAs */}
          <div className="space-y-6 text-center lg:text-left">
            <header className="space-y-2 overflow-hidden">
              {isLoading ? (
                <div className="space-y-3 max-w-md mx-auto lg:mx-0">
                  <Skeleton className="h-10 sm:h-12 lg:h-14 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              ) : (
                <>
                  <h1 className="text-2xl sm:text-4xl lg:text-5xl font-semi-bold text-foreground leading-tight" itemProp="headline">
                    <span ref={titleRef} className="inline-block">
                      {titleParts.start ? `${titleParts.start} ` : ""}
                      <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 bg-clip-text text-transparent">
                        {titleParts.end}
                      </span>
                    </span>
                  </h1>
                  <p ref={subtitleRef} className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto lg:mx-0">
                    {currentSlideData.subtitle}
                  </p>
                </>
              )}
            </header>
            <nav className="flex flex-wrap items-center justify-center lg:justify-start gap-3" aria-label="Main navigation">
              <Link href="/categories" aria-label="Start shopping">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
                >
                  Start Shopping
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/categories" aria-label="View categories">
                <Button variant="outline" size="lg" className="border-2 active:scale-[0.98]">
                  View Categories
                </Button>
              </Link>
            </nav>
            {/* Trust row - compact */}
            <div
              className="grid grid-cols-3 gap-4 pt-6 border-t border-border"
              itemScope
              itemType="https://schema.org/ItemList"
              aria-label="Store benefits"
            >
              <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left" itemScope itemType="https://schema.org/Service">
                <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                  <Shield className="h-5 w-5 text-orange-500" aria-hidden />
                </div>
                <div>
                  <p className="font-medium text-foreground text-xs sm:text-sm" itemProp="name">100% Warranty</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground" itemProp="description">On all products</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left" itemScope itemType="https://schema.org/Service">
                <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                  <Truck className="h-5 w-5 text-orange-500" aria-hidden />
                </div>
                <div>
                  <p className="font-medium text-foreground text-xs sm:text-sm" itemProp="name">Fast Shipping</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground" itemProp="description">Nationwide delivery</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left" itemScope itemType="https://schema.org/Service">
                <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                  <Headphones className="h-5 w-5 text-orange-500" aria-hidden />
                </div>
                <div>
                  <p className="font-medium text-foreground text-xs sm:text-sm" itemProp="name">24/7 Support</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground" itemProp="description">Expert help</p>
                </div>
              </div>
            </div>
          </div>

          {/* Carousel image - compact */}
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-orange-400/20 to-rose-500/20 rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity" />
            <figure
              ref={imageRef}
              className="relative overflow-hidden rounded-2xl border border-border bg-muted shadow-lg aspect-[4/3] max-h-[280px] lg:max-h-[320px]"
            >
              {isLoading ? (
                <Skeleton className="w-full h-full" />
              ) : (
                <img
                  src={currentSlideData.image || "/placeholder.svg?height=320&width=480"}
                  alt={currentSlideData.title}
                  width={480}
                  height={320}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <figcaption className="sr-only">
                {currentSlideData.title} - {currentSlideData.subtitle}
              </figcaption>
            </figure>
            <button
              type="button"
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/90 border border-border shadow flex items-center justify-center hover:bg-muted transition-colors z-10"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/90 border border-border shadow flex items-center justify-center hover:bg-muted transition-colors z-10"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setCurrentSlide(index)
                    setIsAutoPlaying(false)
                  }}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentSlide
                      ? "w-6 bg-orange-500"
                      : "w-1.5 bg-muted-foreground/40 hover:bg-muted-foreground/60"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
