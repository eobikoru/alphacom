"use client"

import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Clock, CheckCircle, AlertCircle, FileText, Mail } from "lucide-react"

export default function WarrantyPage() {
  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-20 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-slate-800/80" />
          </div>

          <div className="relative z-10 container mx-auto px-4 text-center">
            <Badge className="mb-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white">Warranty Policy</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Product Warranty</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              We stand behind the quality of our products with comprehensive warranty coverage.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Warranty Overview */}
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-card-foreground">
                  <Shield className="h-6 w-6 text-green-600" />
                  Our Warranty Promise
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-lg">
                  All products sold by Alphacom Online Store come with manufacturer warranties. We also provide
                  additional support to ensure you get the most out of your purchase.
                </p>
              </CardContent>
            </Card>

            {/* Warranty Coverage */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-card-foreground">
                  <CheckCircle className="h-6 w-6 text-primary" />
                  What's Covered
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-card-foreground mb-2">Manufacturing Defects</h4>
                  <ul className="text-muted-foreground space-y-1 ml-4">
                    <li>• Hardware failures due to manufacturing defects</li>
                    <li>• Performance issues not meeting specifications</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-card-foreground mb-2">Parts and Labor</h4>
                  <ul className="text-muted-foreground space-y-1 ml-4">
           
                    <li>• Labor costs for authorized repairs</li>
                    <li>• Diagnostic services</li>
           
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Warranty Periods */}
            {/* <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-card-foreground">
                  <Clock className="h-6 w-6 text-primary" />
                  Warranty Periods
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold text-card-foreground mb-2">Laptops & Computers</h4>
                      <p className="text-muted-foreground">1-3 years manufacturer warranty</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold text-card-foreground mb-2">Smartphones & Tablets</h4>
                      <p className="text-muted-foreground">1-2 years manufacturer warranty</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold text-card-foreground mb-2">Cameras</h4>
                      <p className="text-muted-foreground">1-2 years manufacturer warranty</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold text-card-foreground mb-2">Audio Equipment</h4>
                      <p className="text-muted-foreground">1-2 years manufacturer warranty</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold text-card-foreground mb-2">Accessories</h4>
                      <p className="text-muted-foreground">6 months - 1 year warranty</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold text-card-foreground mb-2">Storage Devices</h4>
                      <p className="text-muted-foreground">2-5 years manufacturer warranty</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card> */}

            {/* What's Not Covered */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-card-foreground">
                  <AlertCircle className="h-6 w-6 text-orange-500" />
                  What's Not Covered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-muted-foreground space-y-2">
                  <li>• Physical damage from drops, spills, or accidents</li>
                  <li>• Damage from misuse or abuse</li>
                  <li>• Normal wear and tear (scratches, fading)</li>
                  <li>• Damage from unauthorized repairs or modifications</li>
                  <li>• Software issues caused by user-installed programs</li>
                  <li>• Damage from power surges or electrical issues</li>
                  <li>• Consumable items (batteries, ink cartridges)</li>
                  <li>• Cosmetic damage that doesn't affect functionality</li>
                </ul>
              </CardContent>
            </Card>

            {/* Warranty Process */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-card-foreground">
                  <FileText className="h-6 w-6 text-primary" />
                  How to Claim Warranty
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold">1</span>
                    </div>
                    <h4 className="font-semibold text-card-foreground mb-2">Contact Us</h4>
                    <p className="text-muted-foreground text-sm">
                      Call or email us with your order number and issue description
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold">2</span>
                    </div>
                    <h4 className="font-semibold text-card-foreground mb-2">Assessment</h4>
                    <p className="text-muted-foreground text-sm">
                      We'll assess the issue and determine warranty coverage
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold">3</span>
                    </div>
                    <h4 className="font-semibold text-card-foreground mb-2">Resolution</h4>
                    <p className="text-muted-foreground text-sm">Repair, replace, or refund based on warranty terms</p>
                  </div>
                </div>

                <div className="bg-muted/50 p-6 rounded-lg">
                  <h4 className="font-semibold text-card-foreground mb-3">Required Information</h4>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Order number or receipt</li>
                    <li>• Product serial number</li>
                    <li>• Description of the issue</li>
                    <li>• Photos or videos of the problem (if applicable)</li>
                    <li>• Purchase date</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Extended Warranty */}
            <Card className="bg-gradient-to-r from-cyan-50 to-purple-50 dark:from-cyan-900/20 dark:to-purple-900/20 border-cyan-200 dark:border-cyan-800">
              <CardHeader>
                <CardTitle className="text-card-foreground">Extended Warranty Options</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  For additional peace of mind, we offer extended warranty plans for select products:
                </p>
                <ul className="text-muted-foreground space-y-2">
                  <li>• Extended coverage beyond manufacturer warranty</li>
                  <li>• Accidental damage protection available</li>
                  <li>• Priority repair service</li>
                  <li>• Loaner devices during repairs (when available)</li>
                </ul>
                <p className="text-muted-foreground mt-4">Contact us for extended warranty pricing and availability.</p>
              </CardContent>
            </Card>

            {/* Contact Information */}
            {/* <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-card-foreground">
                  <Mail className="h-6 w-6 text-primary" />
                  Warranty Support Contact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-card-foreground mb-3">Contact Information</h4>
                    <div className="space-y-2 text-muted-foreground">
                      <p>
                        <strong>Email:</strong> warranty@alphacomonline.com
                      </p>
                      <p>
                        <strong>Phone:</strong> +234 702 6384 967
                      </p>
                      <p>
                        <strong>WhatsApp:</strong> +234 702 6384 967
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-card-foreground mb-3">Support Hours</h4>
                    <div className="space-y-2 text-muted-foreground">
                      <p>
                        <strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM
                      </p>
                      <p>
                        <strong>Saturday:</strong> 10:00 AM - 4:00 PM
                      </p>
                      <p>
                        <strong>Sunday:</strong> Closed
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card> */}

            {/* Important Notes */}
            {/* <Card className="bg-muted/50 border-border">
              <CardContent className="p-6">
                <h4 className="font-semibold text-card-foreground mb-2">Important Notes</h4>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Keep your receipt and original packaging for warranty claims</li>
                  <li>• Warranty terms may vary by manufacturer and product</li>
                  <li>• International warranties may have different terms</li>
                  <li>• Warranty coverage begins from the date of purchase</li>
                  <li>• Some products may require registration for warranty activation</li>
                </ul>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
