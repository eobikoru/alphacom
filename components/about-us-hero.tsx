"use client"

import Image from "next/image"
import { useAppSelector } from "@/store/hooks"

export function AboutUsHero() {
  const theme = useAppSelector((state) => state.theme.mode)

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <Image
          src="/modern-computer-store-interior-with-displays.jpg"
          alt="Modern computer store interior"
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Company Logo/Storefront Section */}
        <div className="mb-8">
          <div className="relative w-full max-w-4xl mx-auto">
            <div className="text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-balance">
                About{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Alphacom
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 mb-6">Your Trusted Technology Partner Since 2000</p>
            </div>
          </div>
        </div>

        {/* Subtitle */}
        <div className="max-w-3xl mx-auto">
          <p className="text-xl md:text-2xl text-gray-200 leading-relaxed">
            Located in the heart of Computer Village, Ikeja Lagos, we've been Nigeria's premier destination for quality
            ICT products and services for over two decades.
          </p>
        </div>
      </div>
    </section>
  )
}
