"use client"

import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react"

export default function ContactPage() {
  const handleWhatsAppChat = () => {
    const phoneNumber = "2347026384967" // Remove + and spaces for WhatsApp URL+2347026384967
    const message = "Hello! I'm interested in your products and would like to get more information."
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-background" itemScope itemType="https://schema.org/ContactPage">
        <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-20 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/aboutpic.jpg"
              alt="Contact AlphaCom Online - Technology Store Lagos"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-slate-800/80" />
          </div>

          <div className="relative z-10 container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-normal text-white mb-6">Get in Touch</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Visit our store in Computer Village or chat with our representatives for instant support.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* WhatsApp Chat Section */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-2xl text-card-foreground flex items-center gap-3">
                  <MessageCircle className="h-6 w-6 text-green-500" />
                  Chat with Our Representatives
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">
                  Get instant support and product recommendations from our expert team. We're here to help you find the
                  perfect technology solutions for your needs.
                </p>

                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <MessageCircle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-800 dark:text-green-200">WhatsApp Support</h3>
                      <p className="text-sm text-green-600 dark:text-green-300">Available 24/7</p>
                    </div>
                  </div>

                  <p className="text-green-700 dark:text-green-300 mb-4">
                    Chat directly with our product specialists for:
                  </p>

                  <ul className="text-sm text-green-600 dark:text-green-400 space-y-2 mb-6">
                    <li>• Product recommendations and specifications</li>
                    <li>• Price quotes and availability</li>
                    <li>• Technical support and troubleshooting</li>
                    <li>• Order tracking and delivery updates</li>
                    <li>• Warranty and return assistance</li>
                  </ul>

                  <Button
                    onClick={handleWhatsAppChat}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 text-lg"
                    size="lg"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Start WhatsApp Chat
                  </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  <p>Response time: Usually within 5 minutes during business hours</p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="bg-card border-border" itemScope itemType="https://schema.org/LocalBusiness">
                <CardHeader>
                  <CardTitle className="text-2xl text-card-foreground">Visit Our Store</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div
                    className="flex items-start space-x-4"
                    itemProp="address"
                    itemScope
                    itemType="https://schema.org/PostalAddress"
                  >
                    <MapPin className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold text-card-foreground">Address</h3>
                      <p className="text-muted-foreground">
                        <span itemProp="streetAddress">No 3 Adepele street, off Medical road</span>,
                        <br />
                        <span itemProp="addressLocality">Computer village Ikeja</span>,{" "}
                        <span itemProp="addressRegion">Lagos</span>
                        <br />
                        <span itemProp="addressCountry">Nigeria</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Phone className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold text-card-foreground">Phone</h3>
                      <div className="text-muted-foreground">
                        <p itemProp="telephone">+234 702 6384 967</p>
                        <p itemProp="telephone">+234 811 0001 228</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Mail className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold text-card-foreground">Email</h3>
                      <p className="text-muted-foreground" itemProp="email">
                        alphacomonline@gmail.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4" itemProp="openingHours">
                    <Clock className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold text-card-foreground">Business Hours</h3>
                      <p className="text-muted-foreground">
                        Monday - Friday: 9:00 AM - 6:00 PM
                        <br />
                        Saturday: 10:00 AM - 4:00 PM
                        <br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Store Locator Map */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground">Store Location</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-64 bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10" />
                    <div className="text-center z-10">
                      <MapPin className="h-12 w-12 text-primary mx-auto mb-2" />
                      <p className="text-card-foreground font-semibold">Computer Village, Ikeja</p>
                      <p className="text-muted-foreground text-sm">Interactive Map Coming Soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Additional Info Section */}
          <div className="mt-16 text-center">
            <Card className="bg-gradient-to-r from-cyan-50 to-purple-50 dark:from-cyan-900/20 dark:to-purple-900/20 border-cyan-200 dark:border-cyan-800">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-card-foreground mb-4">Why Choose Alphacom?</h3>
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-card-foreground mb-2">Expert Support</h4>
                    <p className="text-muted-foreground text-sm">Over 20 years of experience in technology solutions</p>
                  </div>
                  <div>
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-card-foreground mb-2">Prime Location</h4>
                    <p className="text-muted-foreground text-sm">Located in the heart of Computer Village, Lagos</p>
                  </div>
                  <div>
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MessageCircle className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-card-foreground mb-2">Instant Chat</h4>
                    <p className="text-muted-foreground text-sm">Get immediate assistance via WhatsApp</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
