"use client"

import type React from "react"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { useEffect } from "react"
import { hydrate as hydrateTheme } from "@/store/slices/themeSlice"

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  const { isDark, isHydrated } = useAppSelector((state) => state.theme)

  useEffect(() => {
    dispatch(hydrateTheme())
  }, [dispatch])

  useEffect(() => {
    if (isHydrated) {
      const root = document.documentElement
      if (isDark) {
        root.classList.remove("light")
        root.classList.add("dark")
      } else {
        root.classList.remove("dark")
        root.classList.add("light")
      }

      document.body.className = document.body.className.replace(/\b(light|dark)\b/g, "")
      document.body.classList.add(isDark ? "dark" : "light")
    }
  }, [isDark, isHydrated])

  if (!isHydrated) {
    return <div className="min-h-screen bg-background text-foreground">{children}</div>
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 bg-background text-foreground ${isDark ? "dark" : "light"}`}
    >
      {children}
    </div>
  )
}
