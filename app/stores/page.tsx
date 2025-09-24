"use client"

import type React from "react"

import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Clock, Navigation } from "lucide-react"
import { useState } from "react"

interface Store {
  id: string
  name: string
  address: string
  city: string
  state: string
  zip: string
  phone: string
  hours: {
    weekdays: string
    saturday: string
    sunday: string
  }
  services: string[]
  distance?: number
}

const stores: Store[] = [
  {
    id: "1",
    name: "Alphacom Online Store",
    address: "No 3 Adepele street, off Medical road",
    city: "Computer village Ikeja",
    state: "Lagos",
    zip: "",
    phone: "+234 702 6384 967",
    hours: {
      weekdays: "9:00 AM - 6:00 PM",
      saturday: "10:00 AM - 4:00 PM",
      sunday: "Closed",
    },
    services: ["In-Store Pickup", "Tech Support", "Product Consultation", "Warranty Service", "Returns & Exchange"],
  },
]

export default function StoreLocatorPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredStores, setFilteredStores] = useState(stores)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      setFilteredStores(stores)
      return
    }

    const filtered = stores.filter(
      (store) =>
        store.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.zip.includes(searchQuery) ||
        store.address.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setFilteredStores(filtered)
  }

  const getDirections = (store: Store) => {
    const address = `${store.address}, ${store.city}, ${store.state} ${store.zip}`
    const encodedAddress = encodeURIComponent(address)
    window.open(`https://maps.google.com/maps?q=${encodedAddress}`, "_blank")
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-20 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/aboutpic.jpg"
              alt="AlphaCom Online Store Interior - Computer Village Lagos"
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-slate-800/80" />
          </div>

          <div className="relative z-10 container mx-auto px-4 text-center">
            <h1 className="text-2xl md:text-4xl font-normal text-white mb-6" itemProp="name">
              Visit Our Store in Computer Village
            </h1>
            <p className="text-[1rem] text-gray-300 max-w-2xl mx-auto mb-8" itemProp="description">
              Located in the heart of Computer Village, Lagos. Experience our premium technology products and expert
              service in person.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Store List */}
            <div className="space-y-6">
              <h2 className="text-2xl font-normal text-foreground">Our Store Location</h2>

              {filteredStores.map((store) => (
                <Card key={store.id} className="bg-card border-border" itemScope itemType="https://schema.org/Store">
                  <CardHeader>
                    <CardTitle className="text-xl text-card-foreground" itemProp="name">
                      {store.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div
                      className="flex items-start space-x-3"
                      itemProp="address"
                      itemScope
                      itemType="https://schema.org/PostalAddress"
                    >
                      <MapPin className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <p className="text-card-foreground" itemProp="streetAddress">
                          {store.address}
                        </p>
                        <p className="text-muted-foreground">
                          <span itemProp="addressLocality">{store.city}</span>,{" "}
                          <span itemProp="addressRegion">{store.state}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Phone className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <p className="text-card-foreground" itemProp="telephone">
                          {store.phone}
                        </p>
                        <p className="text-card-foreground" itemProp="telephone">
                          +234 811 0001 228
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3" itemProp="openingHours">
                      <Clock className="h-5 w-5 text-primary mt-1" />
                      <div className="text-sm">
                        <p className="text-card-foreground">Mon-Fri: {store.hours.weekdays}</p>
                        <p className="text-card-foreground">Sat: {store.hours.saturday}</p>
                        <p className="text-card-foreground">Sun: {store.hours.sunday}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Phone className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <p className="text-card-foreground" itemProp="email">
                          info@alphacomonline.com
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-card-foreground mb-2">Services:</p>
                      <div className="flex flex-wrap gap-2">
                        {store.services.map((service) => (
                          <Badge key={service} variant="outline">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" className="flex-1 bg-transparent" onClick={() => getDirections(store)}>
                        <Navigation className="h-4 w-4 mr-2" />
                        Get Directions
                      </Button>
                      {/* <Button variant="outline" onClick={() => window.open(`tel:${store.phone}`, "_self")}>
                        <Phone className="h-4 w-4 mr-2" />
                        Call Store
                      </Button> */}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Map Placeholder */}
            <div className="lg:sticky lg:top-4">
              <Card className="bg-card border-border h-96 lg:h-[600px]">
                <CardContent className="p-0 h-full">
                  <div className="h-full bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10" />
                    <div className="text-center z-10">
                      <MapPin className="h-16 w-16 text-primary mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-muted-foreground mb-2">Computer Village, Ikeja</h3>
                      <p className="text-muted-foreground">No 3 Adepele street, off Medical road</p>
                      {/* <p className="text-muted-foreground text-sm mt-2">Interactive Map Coming Soon</p> */}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
