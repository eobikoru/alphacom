"use client"

import dynamic from "next/dynamic"

export const HeroSection = dynamic(() => import("@/components/hero-section").then((mod) => mod.HeroSection), {
  ssr: false,
})

export const ShopByBrands = dynamic(() => import("@/components/shop-by-brands").then((mod) => mod.ShopByBrands), {
  ssr: false,
})
