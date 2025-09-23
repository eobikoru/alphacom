"use client"

import type React from "react"

import { useAppSelector } from "@/store/hooks"
import { useEffect } from "react"

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const isDark = useAppSelector((state) => state.theme.isDark)

  useEffect(() => {
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
  }, [isDark])

  return (
    <div
      className={`min-h-screen transition-colors duration-300 bg-background text-foreground ${isDark ? "dark" : "light"}`}
    >
      {children}
    </div>
  )
}
