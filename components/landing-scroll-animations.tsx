"use client"

import { useRef, useLayoutEffect, type ReactNode } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

type SectionConfig = {
  y?: number
  x?: number
  scale?: number
  opacity?: number
  duration?: number
  ease?: string
  rotate?: number
}

const sectionAnimations: SectionConfig[] = [
  { scale: 0.98, opacity: 0, duration: 1, ease: "power3.out" },
  { y: 80, opacity: 0, duration: 0.95, ease: "power3.out" },
  { x: 80, opacity: 0, duration: 0.95, ease: "power3.out" },
  { y: 70, opacity: 0, scale: 0.98, duration: 1, ease: "power3.out" },
  { x: -80, opacity: 0, duration: 0.95, ease: "power3.out" },
  { y: 60, opacity: 0, scale: 0.97, duration: 1, ease: "power3.out" },
]

export function LandingScrollAnimations({ children }: { children: ReactNode }) {
  const mainRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const main = mainRef.current
    if (!main) return

    const sections = gsap.utils.toArray<HTMLElement>(main.children)
    const ctx = gsap.context(() => {
      sections.forEach((section, i) => {
        const config = sectionAnimations[i % sectionAnimations.length]
        const fromVars: gsap.TweenVars = {
          opacity: config.opacity ?? 0,
          duration: config.duration ?? 0.85,
          ease: (config.ease as gsap.EaseString) ?? "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 88%",
            end: "bottom 15%",
            toggleActions: "play none none reverse",
          },
        }
        if (config.y != null) fromVars.y = config.y
        if (config.x != null) fromVars.x = config.x
        if (config.scale != null) fromVars.scale = config.scale
        if (config.rotate != null) fromVars.rotation = config.rotate

        gsap.from(section, fromVars)
      })
    }, main)

    return () => ctx.revert()
  }, [])

  return <main ref={mainRef}>{children}</main>
}
