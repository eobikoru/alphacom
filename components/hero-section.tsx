"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Truck, Headphones, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"

const heroSlides = [
  {
    id: 1,
    title: "Your Reliable",
    highlight: "Tech Partner",
    subtitle: "with 100% Warranty",
    description: "Discover cutting-edge technology and premium gadgets with unmatched quality and service.",
    image: "/camera-equipment.jpg",
    badge: "✨ New Arrivals Available",
  },
  {
    id: 2,
    title: "Premium",
    highlight: "Gaming Setup",
    subtitle: "Performance Unleashed",
    description: "Experience next-level gaming with our curated collection of high-performance devices.",
    image: "/gaming-setup.jpg",
    badge: "🎮 Gaming Collection",
  },
  {
    id: 3,
    category: "accessories",
    label: "Accessories",
    title: "Stylish",
    highlight: "Add-ons",
    subtitle: "Tech That Complements",
    description: "Enhance your gadgets with sleek and functional accessories built for everyday use.",
    image: "/slide5.jpg",
    badge: "🛒 Must-Have Extras",
  },
]

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

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
      className="relative min-h-screen overflow-hidden"
      itemScope
      itemType="https://schema.org/WebPageElement"
      aria-label="Hero section showcasing premium products"
    >
      <meta itemProp="name" content="Premium Store Hero Section" />
      <meta
        itemProp="description"
        content="Discover cutting-edge technology and premium gadgets with unmatched quality and service"
      />

      {/* Premium Background Image with Parallax Effect */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: `url('/backgroundimage.jpg')`,
        }}
        role="img"
        aria-label="Premium modern tech workspace background"
      />

      {/* Multi-layered Premium Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/30 via-transparent to-purple-900/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/20 to-transparent" />

      {/* Animated Geometric Elements */}
      <div className="absolute top-20 right-20 h-32 w-32 bg-gradient-to-br from-cyan-400/20 to-purple-600/20 rounded-full blur-2xl animate-pulse" />
      <div className="absolute bottom-32 left-16 h-40 w-40 bg-gradient-to-tr from-purple-400/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
      <div
        className="absolute top-1/2 left-1/3 h-24 w-24 bg-gradient-to-r from-cyan-300/10 to-purple-300/10 rounded-full blur-xl animate-bounce"
        style={{ animationDuration: "3s" }}
      />

      {/* Premium Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />

      {/* Floating Particles Animation */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute h-1 w-1 bg-cyan-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-20 lg:py-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          {/* Enhanced Content with Premium Animations */}
          <div className="space-y-10 z-20">
            <div className="space-y-8 transition-all duration-1000 ease-out animate-fade-in-up">
              <Badge
                className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-100 border-cyan-300/30 hover:from-cyan-500/30 hover:to-purple-500/30 transition-all duration-500 text-sm px-6 py-3 backdrop-blur-sm shadow-lg animate-fade-in-up"
                style={{ animationDelay: "0.2s" }}
              >
                {currentSlideData.badge}
              </Badge>

              <header>
                <h1
                  className="text-6xl lg:text-8xl font-bold text-balance leading-tight transition-all duration-1000 animate-fade-in-up"
                  style={{ animationDelay: "0.4s" }}
                  itemProp="headline"
                >
                  <span className="text-white font-normal text-[3rem] md:text-[4rem] drop-shadow-2xl">
                    {currentSlideData.title}
                  </span>
                  <span className="bg-gradient-to-r text-[2rem] md:text-[3rem] from-cyan-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent block animate-gradient-x bg-300% drop-shadow-lg">
                    {currentSlideData.highlight}
                  </span>
                  <span
                    className="text-slate-200 text-[2rem] font-normal lg:text-[1.7rem] mb-4 font-light block mt-4 drop-shadow-lg animate-fade-in-up"
                    style={{ animationDelay: "0.6s" }}
                  >
                    {currentSlideData.subtitle}
                  </span>
                </h1>

                <p
                  className="text-[1rem] text-slate-200 text-pretty max-w-lg font-normal leading-relaxed drop-shadow-md animate-fade-in-up"
                  style={{ animationDelay: "0.8s" }}
                  itemProp="description"
                >
                  {currentSlideData.description}
                </p>
              </header>
            </div>

            <nav
              className="flex flex-col sm:flex-row gap-6 animate-fade-in-up"
              style={{ animationDelay: "1s" }}
              aria-label="Main navigation"
            >
              <Link href="/categories" aria-label="Browse all categories">
                <Button
                  size="lg"
                  className="h-16 px-12 text-[0.9rem] bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 shadow-2xl hover:shadow-cyan-500/25 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 backdrop-blur-sm border border-white/10"
                >
                  Start Shopping
                  <ArrowRight className="ml-3 h-6 w-6 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/categories" aria-label="View all product categories">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-16 px-12 text-[0.9rem] border-2 border-white/30 hover:border-cyan-300/50 hover:bg-white/10 transition-all duration-500 bg-white/5 backdrop-blur-sm text-white hover:text-cyan-100 transform hover:scale-105"
                >
                  View Categories
                </Button>
              </Link>
            </nav>

            <section
              className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-12 border-t border-white/20 animate-fade-in-up"
              style={{ animationDelay: "1.2s" }}
              itemScope
              itemType="https://schema.org/ItemList"
              aria-label="Store features and benefits"
            >
              <meta itemProp="name" content="Premium Store Features" />
              <div
                className="flex items-center gap-4 group hover:transform hover:scale-105 transition-all duration-300"
                itemScope
                itemType="https://schema.org/Service"
              >
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center group-hover:from-cyan-500/30 group-hover:to-purple-500/30 transition-all duration-300 backdrop-blur-sm border border-white/10 shadow-lg">
                  <Shield className="h-7 w-7 text-cyan-300" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-normal text-[0.9rem] text-white text-lg drop-shadow-md" itemProp="name">
                    100% Warranty
                  </p>
                  <p className="text-sm text-slate-300" itemProp="description">
                    On all products
                  </p>
                </div>
              </div>
              <div
                className="flex items-center gap-4 group hover:transform hover:scale-105 transition-all duration-300"
                itemScope
                itemType="https://schema.org/Service"
              >
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center group-hover:from-cyan-500/30 group-hover:to-purple-500/30 transition-all duration-300 backdrop-blur-sm border border-white/10 shadow-lg">
                  <Truck className="h-7 w-7 text-cyan-300" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-normal text-[0.9rem] text-white text-lg drop-shadow-md" itemProp="name">
                    Free Shipping
                  </p>
                  <p className="text-sm text-slate-300" itemProp="description">
                    Orders over ₦50k
                  </p>
                </div>
              </div>
              <div
                className="flex items-center gap-4 group hover:transform hover:scale-105 transition-all duration-300"
                itemScope
                itemType="https://schema.org/Service"
              >
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center group-hover:from-cyan-500/30 group-hover:to-purple-500/30 transition-all duration-300 backdrop-blur-sm border border-white/10 shadow-lg">
                  <Headphones className="h-7 w-7 text-cyan-300" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-normal text-white text-[0.9rem] drop-shadow-md" itemProp="name">
                    24/7 Support
                  </p>
                  <p className="text-sm text-slate-300" itemProp="description">
                    Expert assistance
                  </p>
                </div>
              </div>
            </section>
          </div>

          <div className="relative group animate-fade-in-right" style={{ animationDelay: "0.6s" }}>
            {/* Premium backdrop effects */}
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400/10 to-purple-500/10 rounded-3xl blur-xl" />

            <figure className="relative z-10 overflow-hidden rounded-3xl border border-white/20 shadow-2xl backdrop-blur-sm">
              <img
                src={currentSlideData.image || "/premium-modern-tech-workspace-with-sleek-devices-a.jpg"}
                alt={`Premium ${currentSlideData.highlight.toLowerCase()} showcase - ${currentSlideData.description}`}
                width={800}
                height={600}
                className="w-full h-[500px] lg:h-[600px] object-cover transition-all duration-1000 ease-out transform hover:scale-110"
              />
              <figcaption className="sr-only">
                {currentSlideData.title} {currentSlideData.highlight} - {currentSlideData.description}
              </figcaption>

              {/* Premium overlay on image */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/10 via-transparent to-purple-900/10" />
            </figure>

            <button
              onClick={prevSlide}
              className="absolute left-6 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-white/10 backdrop-blur-md shadow-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-white/20 hover:scale-110 border border-white/20 z-30"
            >
              <ChevronLeft className="h-7 w-7 text-white" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-6 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-white/10 backdrop-blur-md shadow-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-white/20 hover:scale-110 border border-white/20 z-30"
            >
              <ChevronRight className="h-7 w-7 text-white" />
            </button>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 z-30">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentSlide(index)
                    setIsAutoPlaying(false)
                  }}
                  className={`h-3 rounded-full transition-all duration-500 backdrop-blur-sm border border-white/30 ${
                    index === currentSlide
                      ? "w-12 bg-gradient-to-r from-cyan-400 to-purple-400 shadow-lg shadow-cyan-400/50"
                      : "w-3 bg-white/40 hover:bg-white/60 hover:scale-125"
                  }`}
                />
              ))}
            </div>

            {/* Premium floating elements around image */}
            <div className="absolute -top-12 -right-12 h-32 w-32 bg-gradient-to-br from-cyan-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-16 -left-16 h-40 w-40 bg-gradient-to-tr from-purple-400/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="h-12 w-6 border-2 border-white/30 rounded-full flex justify-center backdrop-blur-sm">
          <div className="h-3 w-1 bg-gradient-to-b from-cyan-400 to-purple-400 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  )
}
