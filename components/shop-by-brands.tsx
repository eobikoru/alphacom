"use client"

import Link from "next/link"

const FEATURED_BRANDS = [
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
    name: "Micropack",
    slug: "Micropack",
    logoUrl: "https://www.micropackhk.com/cdn/shop/files/MicropackLogo_small.png",
  },
  {
    name: "SanDisk",
    slug: "SanDisk",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5f/SanDisk_2024_logo.svg",
  },
]

export function ShopByBrands() {
  return (
    <section className="py-12 lg:py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(120,119,198,0.06),transparent_50%)]" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-2xl lg:text-3xl font-semibold mb-2 text-foreground">Shop by Brand</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore products from our featured brands
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {FEATURED_BRANDS.map((brand) => (
            <Link
              key={brand.slug}
              href={`/brands/${encodeURIComponent(brand.slug)}`}
              className="group flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-6 sm:p-8 hover:shadow-lg hover:border-primary/30 transition-all duration-200"
            >
              {/* Logo pad: light in light mode, light panel in dark mode so logos stay visible on both themes */}
              <div className="relative w-full aspect-[2/1] max-h-16 sm:max-h-20 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-white/20 border border-border/50 dark:border-white/20 p-3 sm:p-4">
                <img
                  src={brand.logoUrl}
                  alt={brand.name}
                  className="max-w-full max-h-full w-auto h-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <span className="mt-3 text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
