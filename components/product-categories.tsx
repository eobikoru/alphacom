"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Monitor, Camera, Volume2, HardDrive, Printer, Network, Shield, Package } from "lucide-react"
import Link from "next/link"

const categories = [
  {
    name: "Computers & Accessories",
    slug: "computers-accessories",
    description: "Desktop computers, laptops, and essential accessories",
    itemCount: "200+ items",
    color: "from-cyan-500/20 to-blue-600/20",
    icon: Monitor,
    image: "/accessories.jpg",
  },
  {
    name: "Cameras",
    slug: "cameras",
    description: "Professional cameras and photography equipment",
    itemCount: "90+ items",
    color: "from-indigo-500/20 to-purple-600/20",
    icon: Camera,
    image: "/cameras.jpg",
  },
  {
    name: "Audio & Speakers",
    slug: "audio-speakers",
    description: "Premium audio equipment and sound systems",
    itemCount: "150+ items",
    color: "from-emerald-500/20 to-teal-600/20",
    icon: Volume2,
    image: "/audio-speakers.jpg",
  },
  {
    name: "Data Storage",
    slug: "data-storage",
    description: "Hard drives, SSDs, and storage solutions",
    itemCount: "80+ items",
    color: "from-orange-500/20 to-red-600/20",
    icon: HardDrive,
    image: "/data-storage.jpg",
  },
  {
    name: "Printers & Scanners",
    slug: "printers-scanners",
    description: "Office printing and scanning equipment",
    itemCount: "60+ items",
    color: "from-purple-500/20 to-pink-600/20",
    icon: Printer,
    image: "/printers-scanners.jpg",
  },
  {
    name: "Networking",
    slug: "networking",
    description: "Routers, switches, and network infrastructure",
    itemCount: "70+ items",
    color: "from-blue-500/20 to-cyan-600/20",
    icon: Network,
    image: "/networking.jpg",
  },
  {
    name: "Software & Security",
    slug: "software-security",
    description: "Software licenses and security solutions",
    itemCount: "100+ items",
    color: "from-rose-500/20 to-pink-600/20",
    icon: Shield,
    image: "/software-securityss.jpg",
  },
  {
    name: "Accessories",
    slug: "accessories",
    description: "Cables, adapters, and tech accessories",
    itemCount: "300+ items",
    color: "from-teal-500/20 to-green-600/20",
    icon: Package,
    image: "/headphones-collection.jpg",
  },
]
// const categories = [
//   {
//     name: "Computers & Accessories",
//     slug: "computers-accessories",
//     description: "Desktop computers, laptops, and essential accessories",
//     itemCount: "200+ items",
//     color: "from-cyan-500/20 to-blue-600/20",
//     icon: Monitor,
//     image: "/modern-laptop-workspace-setup.jpg",
//   },
//   {
//     name: "Cameras",
//     slug: "cameras",
//     description: "Professional cameras and photography equipment",
//     itemCount: "90+ items",
//     color: "from-indigo-500/20 to-purple-600/20",
//     icon: Camera,
//     image: "/professional-camera-equipment-showcase.jpg",
//   },
//   {
//     name: "Audio & Speakers",
//     slug: "audio-speakers",
//     description: "Premium audio equipment and sound systems",
//     itemCount: "150+ items",
//     color: "from-emerald-500/20 to-teal-600/20",
//     icon: Volume2,
//     image: "/premium-audio-headphones-collection.jpg",
//   },
//   {
//     name: "Data Storage",
//     slug: "data-storage",
//     description: "Hard drives, SSDs, and storage solutions",
//     itemCount: "80+ items",
//     color: "from-orange-500/20 to-red-600/20",
//     icon: HardDrive,
//     image: "/data-storage-devices-collection.jpg",
//   },
//   {
//     name: "Printers & Scanners",
//     slug: "printers-scanners",
//     description: "Office printing and scanning equipment",
//     itemCount: "60+ items",
//     color: "from-purple-500/20 to-pink-600/20",
//     icon: Printer,
//     image: "/office-printer-scanner-setup.jpg",
//   },
//   {
//     name: "Networking",
//     slug: "networking",
//     description: "Routers, switches, and network infrastructure",
//     itemCount: "70+ items",
//     color: "from-blue-500/20 to-cyan-600/20",
//     icon: Network,
//     image: "/networking-equipment-display.jpg",
//   },
//   {
//     name: "Software & Security",
//     slug: "software-security",
//     description: "Software licenses and security solutions",
//     itemCount: "100+ items",
//     color: "from-rose-500/20 to-pink-600/20",
//     icon: Shield,
//     image: "/software-security-solutions.jpg",
//   },
//   {
//     name: "Accessories",
//     slug: "accessories",
//     description: "Cables, adapters, and tech accessories",
//     itemCount: "300+ items",
//     color: "from-teal-500/20 to-green-600/20",
//     icon: Package,
//     image: "/tech-accessories-collection.jpg",
//   },
// ]

export function ProductCategories() {
  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,119,198,0.05),transparent_50%)]"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 mb-6">
            <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Premium Collections
            </span>
          </div>

          <h2 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
            Shop by Category
          </h2>
          <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Explore our comprehensive range of technology products and find exactly what you need
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {categories.map((category, index) => {
            const IconComponent = category.icon
            return (
              <Link key={category.name} href={`/categories/${category.slug}`}>
                <Card className="group hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500 border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl cursor-pointer overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-transparent to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
                  <div className="absolute inset-[1px] bg-card/90 backdrop-blur-xl rounded-lg"></div>

                  <CardContent className="p-0 relative z-10">
                    <div className="relative overflow-hidden">
                      <div className="relative h-56 lg:h-64 overflow-hidden">
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-60 group-hover:opacity-80 transition-all duration-500`}
                        />
                        <img
                          src={category.image || "/placeholder.svg"}
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />

                        <div className="absolute top-6 left-6">
                          <div className="bg-background/90 backdrop-blur-xl border border-white/20 p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                            <IconComponent className="h-6 w-6 text-primary" />
                          </div>
                        </div>

                        <div className="absolute top-6 right-6">
                          <div className="bg-background/90 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-full text-sm font-semibold">
                            {category.itemCount}
                          </div>
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                      </div>
                    </div>

                    <div className="p-8">
                      <h3 className="text-2xl font-bold mb-3 group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                        {category.name}
                      </h3>
                      <p className="text-muted-foreground mb-6 text-base leading-relaxed">{category.description}</p>

                      <Button
                        variant="ghost"
                        className="p-0 h-auto font-semibold text-primary hover:text-primary/80 group/btn"
                      >
                        <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                          Shop Now
                        </span>
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 group-hover:text-cyan-400 transition-all duration-300" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
