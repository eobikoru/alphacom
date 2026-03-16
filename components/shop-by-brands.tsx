"use client"

import Link from "next/link"
import { useRef, useLayoutEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export const FEATURED_BRANDS = [
  {
    name: "Logitech",
    slug: "Logitech",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/1/17/Logitech_logo.svg",
  },
  {
    name: "Anker",
    slug: "Anker",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9c/Anker_logo.svg",
  },
  {
    name: "Aicon",
    slug: "Aicon",
    logoUrl: "/iacon.jpeg",
  },
  {
    name: "Micropack",
    slug: "Micropack",
    logoUrl: "/mag.jpeg",
  },
  {
    name: "SanDisk",
    slug: "SanDisk",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5f/SanDisk_2024_logo.svg",
  },
]

const BUBBLES = [
  { size: 48, left: "8%", top: "15%", delay: 0, duration: 10 },
  { size: 28, left: "22%", top: "55%", delay: 1.2, duration: 12 },
  { size: 56, left: "42%", top: "10%", delay: 0.3, duration: 9 },
  { size: 24, left: "58%", top: "65%", delay: 1.8, duration: 11 },
  { size: 40, left: "72%", top: "25%", delay: 0.6, duration: 13 },
  { size: 36, left: "88%", top: "50%", delay: 0.9, duration: 10 },
  { size: 52, left: "12%", top: "70%", delay: 2, duration: 14 },
  { size: 32, left: "52%", top: "40%", delay: 0.5, duration: 11 },
  { size: 44, left: "32%", top: "78%", delay: 1.5, duration: 9 },
  { size: 30, left: "68%", top: "8%", delay: 1.1, duration: 12 },
]

export function ShopByBrands() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    const cardsEl = cardsRef.current
    if (!section || !cardsEl) return

    const cards = Array.from(cardsEl.children) as HTMLElement[]

    // Entrance: staggered 3D flip-in + scale + fade when section is in view
    const entranceAnim = gsap.fromTo(
      cards,
      {
        opacity: 0,
        y: 70,
        scale: 0.7,
        rotationX: -25,
        transformOrigin: "center bottom",
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationX: 0,
        duration: 0.9,
        ease: "back.out(1.15)",
        stagger: 0.1,
        scrollTrigger: {
          trigger: section,
          start: "top 82%",
          toggleActions: "play none none none",
        },
      }
    )

    // Hover: lift + 3D tilt + shadow
    const hoverIn = (el: HTMLElement) => {
      gsap.to(el, {
        y: -12,
        scale: 1.04,
        rotationX: 6,
        rotationY: 4,
        boxShadow: "0 24px 48px rgba(0,0,0,0.12), 0 12px 24px rgba(0,0,0,0.08)",
        duration: 0.4,
        ease: "power2.out",
        overwrite: true,
      })
    }
    const hoverOut = (el: HTMLElement) => {
      gsap.to(el, {
        y: 0,
        scale: 1,
        rotationX: 0,
        rotationY: 0,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        duration: 0.5,
        ease: "power2.out",
        overwrite: true,
      })
    }

    const listeners = cards.map((card) => {
      const onEnter = () => hoverIn(card)
      const onLeave = () => hoverOut(card)
      card.addEventListener("mouseenter", onEnter)
      card.addEventListener("mouseleave", onLeave)
      return { card, onEnter, onLeave }
    })

    return () => {
      entranceAnim.scrollTrigger?.kill()
      listeners.forEach(({ card, onEnter, onLeave }) => {
        card.removeEventListener("mouseenter", onEnter)
        card.removeEventListener("mouseleave", onLeave)
      })
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-8 lg:py-12 relative overflow-hidden bg-white dark:bg-[#0f0f0f]"
    >
      {/* Floating bubbles – visible on white with soft fill + border */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden>
        {BUBBLES.map((b, i) => (
          <div
            key={i}
            className="absolute rounded-full border border-gray-300/50 dark:border-white/20 bg-gray-100/60 dark:bg-white/10 animate-bubble-float"
            style={{
              width: b.size,
              height: b.size,
              left: b.left,
              top: b.top,
              animationDelay: `${b.delay}s`,
              animationDuration: `${b.duration}s`,
            }}
          />
        ))}
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-6">
          <h2 className="text-2xl lg:text-3xl font-semibold mb-2 text-foreground">Shop by Brand</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
            Explore products from our featured brands
          </p>
        </div>

        <div
          ref={cardsRef}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4"
          style={{ perspective: "800px" }}
        >
          {FEATURED_BRANDS.map((brand) => (
            <Link
              key={brand.slug}
              href={`/brands/${encodeURIComponent(brand.slug)}`}
              className="group flex flex-col items-center justify-center rounded-xl border border-border bg-card/80 dark:bg-card/50 backdrop-blur-sm p-4 will-change-transform"
              style={{ transformStyle: "preserve-3d", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
            >
              <div className="relative w-full aspect-[2/1] max-h-12 sm:max-h-14 flex items-center justify-center rounded-lg bg-gray-50 dark:bg-white/15 border border-border/50 dark:border-white/15 p-2 sm:p-2.5">
                <img
                  src={brand.logoUrl}
                  alt={brand.name}
                  loading="lazy"
                  decoding="async"
                  className="max-w-full max-h-full w-auto h-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                />
              </div>
              <span className="mt-2 text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors duration-300">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
