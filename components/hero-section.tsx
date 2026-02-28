"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Truck, Headphones, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"

const heroSlides = [
  {
    id: 1,
    title: "Your Reliable",
    highlight: "Tech Partner",
    subtitle: "100% Warranty · Premium gadgets & support",
    image: "/camera-equipment.jpg",
  },
  {
    id: 2,
    title: "Premium",
    highlight: "Gaming Setup",
    subtitle: "High-performance devices & accessories",
    image: "/gaming-setup.jpg",
  },
  {
    id: 3,
    title: "Complete Your",
    highlight: "Setup",
    subtitle: "Cases, cables, chargers & more — for every device",
    image: "/slide5.jpg",
  },
]

const AUTO_PLAY_RESUME_MS = 4000

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying])

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
            <header className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight" itemProp="headline">
                <span className="font-normal">{currentSlideData.title} </span>
                <span className="bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
                  {currentSlideData.highlight}
                </span>
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto lg:mx-0">
                {currentSlideData.subtitle}
              </p>
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
                  <p className="font-medium text-foreground text-xs sm:text-sm" itemProp="name">Free Shipping</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground" itemProp="description">Orders over ₦50k</p>
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
            <figure className="relative overflow-hidden rounded-2xl border border-border bg-muted shadow-lg aspect-[4/3] max-h-[280px] lg:max-h-[320px]">
              <img
                src={currentSlideData.image || "/placeholder.svg?height=320&width=480"}
                alt={`${currentSlideData.title} ${currentSlideData.highlight}`}
                width={480}
                height={320}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <figcaption className="sr-only">
                {currentSlideData.title} {currentSlideData.highlight} - {currentSlideData.subtitle}
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
