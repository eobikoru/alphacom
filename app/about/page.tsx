"use client"

import { AboutUsHero } from "@/components/about-us-hero"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Award, Clock, MapPin, Phone, Mail, Star, Shield, Truck, HeartHandshake } from "lucide-react"
import { useAppSelector } from "@/store/hooks"
import { AppLayout } from "@/components/app-layout"

const stats = [
  { icon: Users, label: "Happy Customers", value: "50,000+" },
  { icon: Award, label: "Years of Excellence", value: "25+" },
  { icon: Clock, label: "Products Sold", value: "200,000+" },
  { icon: MapPin, label: "Store Locations", value: "3" },
]

const values = [
  {
    icon: Shield,
    title: "Quality Assurance",
    description: "We guarantee authentic products from trusted manufacturers with comprehensive warranties.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Quick and reliable delivery across Lagos and nationwide shipping to all states in Nigeria.",
  },
  {
    icon: HeartHandshake,
    title: "Customer Support",
    description: "Dedicated support team available to help you with technical issues and product guidance.",
  },
  {
    icon: Star,
    title: "Expert Advice",
    description: "Our knowledgeable staff provides personalized recommendations based on your specific needs.",
  },
]

const team = [
  {
    name: "Alphonsus Ejidike",
    role: "Founder & CEO",
    image: "/ceo.jpeg",
    description: "With over 23 years of experience in the ICT industry, Mr. Alphonsus Ejidike is a visionary leader and the driving force behind Alphacom Investment. ",
  },
  {
    name: "Uzoma Ejidike",
    role: "Chief Operating Officer",
    image: "/ceowife.jpeg",
    description: "Uzoma Ejidike is a seasoned professional with extensive experience in Human Resources and Business Management. ",
  },
  
]

export default function AboutPage() {
  const theme = useAppSelector((state) => state.theme.mode)

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <AboutUsHero />

        {/* Stats Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon
                return (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold mb-2 text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <Badge className="mb-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white">Our Story</Badge>
                <h2 className="text-3xl md:text-4xl font-normal mb-6 text-foreground">Building Nigeria's Tech Future</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="prose prose-lg prose-slate dark:prose-invert">
                    <p className="text-muted-foreground">
                      Founded in 2000 by Adebayo Johnson, Alphacom began as a small computer repair shop in Computer
                      Village, Ikeja. What started as a passion for technology has grown into one of Nigeria's most
                      trusted ICT retailers.
                    </p>
                    <p className="text-muted-foreground">
                      Over the years, we've expanded our offerings to include the latest laptops, smartphones, cameras,
                      audio equipment, and accessories from top global brands. Our commitment to quality and customer
                      satisfaction has earned us the trust of over 50,000 customers.
                    </p>
                    <p className="text-muted-foreground">
                      Today, we continue to innovate and adapt to the changing technology landscape, ensuring our
                      customers have access to the latest and most reliable tech products at competitive prices.
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                    <img
                      src="/modern-computer-store-interior-with-displays.jpg"
                      alt="Alphacom Store Interior"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white">Our Values</Badge>
              <h2 className="text-3xl md:text-4xl font-normal mb-6 text-foreground">What Sets Us Apart</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const IconComponent = value.icon
                return (
                  <Card key={index} className="border-0 shadow-lg bg-card">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-normal mb-3 text-foreground">{value.title}</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">{value.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white">Our Team</Badge>
              <h2 className="text-3xl md:text-4xl font-normal mb-6 text-foreground">Meet the Experts</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <Card key={index} className="border-0 shadow-lg overflow-hidden bg-card">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-6 text-center">
                    <h3 className="text-xl font-bold mb-2 text-foreground">{member.name}</h3>
                    <p className="text-cyan-600 font-medium mb-3">{member.role}</p>
                    <p className="text-sm text-muted-foreground">{member.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <Badge className="mb-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white">Visit Us</Badge>
                <h2 className="text-3xl md:text-4xl font-normal mb-6 text-foreground">Find Us at Computer Village</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <Card className="border-0 shadow-lg bg-card">
                  <CardContent className="p-6 text-center">
                    <MapPin className="w-12 h-12 text-cyan-600 mx-auto mb-4" />
                    <h3 className="text-lg font-bold mb-3 text-foreground">Main Store</h3>
                    <p className="text-sm text-muted-foreground">
                      Shop 45, Computer Village
                      <br />
                      Ikeja, Lagos State
                      <br />
                      Nigeria
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-card">
                  <CardContent className="p-6 text-center">
                    <Phone className="w-12 h-12 text-cyan-600 mx-auto mb-4" />
                    <h3 className="text-lg font-bold mb-3 text-foreground">Phone</h3>
                    <p className="text-sm text-muted-foreground">
                      +234 803 123 4567
                      <br />
                      +234 701 234 5678
                      <br />
                      Mon - Sat: 8AM - 7PM
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-card">
                  <CardContent className="p-6 text-center">
                    <Mail className="w-12 h-12 text-cyan-600 mx-auto mb-4" />
                    <h3 className="text-lg font-bold mb-3 text-foreground">Email</h3>
                    <p className="text-sm text-muted-foreground">
                      info@alphacom.ng
                      <br />
                      support@alphacom.ng
                      <br />
                      sales@alphacom.ng
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  )
}
