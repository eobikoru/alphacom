"use client"

import { useRef, useEffect, Children, type ReactNode } from "react"

const ROOT_MARGIN = "120px"
const THRESHOLD = 0.01

export function LandingScrollAnimations({ children }: { children: ReactNode }) {
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const main = mainRef.current
    if (!main) return

    const wrappers = main.querySelectorAll<HTMLElement>("[data-landing-section]")
    if (wrappers.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement
          if (entry.isIntersecting) el.classList.add("landing-section-visible")
        }
      },
      { rootMargin: ROOT_MARGIN, threshold: THRESHOLD }
    )

    wrappers.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <main ref={mainRef} className="landing-main">
      {Children.map(children, (child, i) => (
        <div
          key={i}
          data-landing-section
          className={`landing-section-wrapper${i === 0 ? " landing-section-visible" : ""}`}
        >
          {child}
        </div>
      ))}
    </main>
  )
}
