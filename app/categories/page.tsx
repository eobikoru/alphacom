"use client"

import Link from "next/link"
import { ChevronRight, Monitor, Camera, Volume2, HardDrive, Printer, Network, Shield, Package } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useAppSelector } from "@/store/hooks"
import { AppLayout } from "@/components/app-layout"

const categories = [
  {
    id: "computers-accessories",
    name: "Computers & Accessories",
    icon: Monitor,
    description: "Desktop computers, laptops, and essential accessories",
    subcategories: [
      { id: "laptops", name: "Laptops", count: 156 },
      { id: "desktops", name: "Desktop Computers", count: 89 },
      { id: "monitors", name: "Monitors", count: 234 },
      { id: "keyboards", name: "Keyboards & Mice", count: 178 },
      { id: "motherboards", name: "Motherboards", count: 67 },
      { id: "processors", name: "Processors", count: 45 },
    ],
  },
  {
    id: "cameras",
    name: "Cameras",
    icon: Camera,
    description: "Professional cameras and photography equipment",
    subcategories: [
      { id: "dslr", name: "DSLR Cameras", count: 67 },
      { id: "mirrorless", name: "Mirrorless Cameras", count: 89 },
      { id: "action-cameras", name: "Action Cameras", count: 45 },
      { id: "lenses", name: "Camera Lenses", count: 123 },
      { id: "tripods", name: "Tripods & Stands", count: 78 },
      { id: "camera-accessories", name: "Camera Accessories", count: 156 },
    ],
  },
  {
    id: "audio-speakers",
    name: "Audio & Speakers",
    icon: Volume2,
    description: "Premium audio equipment and sound systems",
    subcategories: [
      { id: "headphones", name: "Headphones", count: 234 },
      { id: "earbuds", name: "Earbuds & Earphones", count: 189 },
      { id: "speakers", name: "Bluetooth Speakers", count: 145 },
      { id: "soundbars", name: "Soundbars", count: 67 },
      { id: "microphones", name: "Microphones", count: 89 },
      { id: "audio-accessories", name: "Audio Accessories", count: 123 },
    ],
  },
  {
    id: "data-storage",
    name: "Data Storage",
    icon: HardDrive,
    description: "Hard drives, SSDs, and storage solutions",
    subcategories: [
      { id: "external-drives", name: "External Hard Drives", count: 89 },
      { id: "ssd", name: "Solid State Drives", count: 67 },
      { id: "internal-drives", name: "Internal Hard Drives", count: 78 },
      { id: "usb-drives", name: "USB Flash Drives", count: 145 },
      { id: "memory-cards", name: "Memory Cards", count: 234 },
      { id: "nas-storage", name: "NAS Storage", count: 34 },
    ],
  },
  {
    id: "printers-scanners",
    name: "Printers & Scanners",
    icon: Printer,
    description: "Office printing and scanning equipment",
    subcategories: [
      { id: "inkjet-printers", name: "Inkjet Printers", count: 89 },
      { id: "laser-printers", name: "Laser Printers", count: 67 },
      { id: "all-in-one", name: "All-in-One Printers", count: 78 },
      { id: "scanners", name: "Scanners", count: 45 },
      { id: "printer-ink", name: "Printer Ink & Toner", count: 234 },
      { id: "printer-accessories", name: "Printer Accessories", count: 123 },
    ],
  },
  {
    id: "networking",
    name: "Networking",
    icon: Network,
    description: "Routers, switches, and network infrastructure",
    subcategories: [
      { id: "routers", name: "Wireless Routers", count: 89 },
      { id: "switches", name: "Network Switches", count: 45 },
      { id: "access-points", name: "Access Points", count: 34 },
      { id: "network-cables", name: "Network Cables", count: 156 },
      { id: "modems", name: "Modems", count: 67 },
      { id: "network-accessories", name: "Network Accessories", count: 123 },
    ],
  },
  {
    id: "software-security",
    name: "Software & Security",
    icon: Shield,
    description: "Software licenses and security solutions",
    subcategories: [
      { id: "antivirus", name: "Antivirus Software", count: 45 },
      { id: "office-software", name: "Office Software", count: 67 },
      { id: "operating-systems", name: "Operating Systems", count: 23 },
      { id: "security-software", name: "Security Software", count: 89 },
      { id: "backup-software", name: "Backup Software", count: 34 },
      { id: "productivity-software", name: "Productivity Software", count: 78 },
    ],
  },
  {
    id: "accessories",
    name: "Accessories",
    icon: Package,
    description: "Cables, adapters, and tech accessories",
    subcategories: [
      { id: "cables", name: "Cables & Adapters", count: 234 },
      { id: "power-supplies", name: "Power Supplies", count: 89 },
      { id: "cooling", name: "Cooling Solutions", count: 67 },
      { id: "cases", name: "Computer Cases", count: 45 },
      { id: "tools", name: "Tech Tools", count: 123 },
      { id: "misc-accessories", name: "Miscellaneous", count: 156 },
    ],
  },
]

export default function CategoriesPage() {
  const isDark = useAppSelector((state) => state.theme.isDark)

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-foreground">Shop by Category</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our extensive range of technology products organized by category
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => {
              const IconComponent = category.icon
              return (
                <Card
                  key={category.id}
                  className="group hover:shadow-2xl transition-all duration-300 border-0 bg-card/80 hover:bg-card backdrop-blur-xl transform hover:scale-[1.02]"
                >
                  <CardContent className="p-6">
                    {/* Category Header */}
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-card-foreground group-hover:text-cyan-600 transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      </div>
                    </div>

                    {/* Subcategories */}
                    <div className="space-y-3">
                      {category.subcategories.slice(0, 4).map((subcategory) => (
                        <Link
                          key={subcategory.id}
                          href={`/categories/${category.id}/${subcategory.id}`}
                          className="flex items-center justify-between p-3 rounded-lg transition-all duration-200 hover:bg-accent text-card-foreground hover:text-accent-foreground"
                        >
                          <span className="font-medium">{subcategory.name}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">({subcategory.count})</span>
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* View All Link */}
                    <div className="mt-6 pt-4 border-t border-border">
                      <Link
                        href={`/categories/${category.id}`}
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        className="flex items-center justify-center space-x-2 text-cyan-600 hover:text-cyan-700 font-semibold transition-colors"
                      >
                        <span>View All {category.name}</span>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Featured Categories Banner */}
          <div className="mt-16">
            <div className="rounded-3xl p-8 bg-gradient-to-r from-muted to-accent border border-border">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4 text-foreground">Can't find what you're looking for?</h2>
                <p className="text-lg mb-6 text-muted-foreground">
                  Contact our expert team for personalized recommendations
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-600 to-purple-700 hover:from-cyan-700 hover:to-purple-800 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  <span>Contact Us</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
