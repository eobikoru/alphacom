"use client"

import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, ShoppingCart, Shield, AlertTriangle, Scale, Mail } from "lucide-react"

export default function TermsPage() {
  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-20 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-slate-800/80" />
          </div>

          <div className="relative z-10 container mx-auto px-4 text-center">
            <Badge className="mb-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white">Terms & Conditions</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Terms of Service</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Please read these terms carefully before using our services.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Last Updated */}
            <Card className="bg-muted/50 border-border">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">
                  <strong>Last Updated:</strong> January 1, 2024
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  These Terms and Conditions govern your use of Alphacom Online Store and the purchase of our products.
                </p>
              </CardContent>
            </Card>

            {/* Acceptance of Terms */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-card-foreground">
                  <FileText className="h-6 w-6 text-primary" />
                  Acceptance of Terms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  By accessing and using this website, you accept and agree to be bound by the terms and provision of
                  this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </CardContent>
            </Card>

            {/* Products and Services */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-card-foreground">
                  <ShoppingCart className="h-6 w-6 text-primary" />
                  Products and Services
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-card-foreground mb-2">Product Information</h4>
                  <ul className="text-muted-foreground space-y-1 ml-4">
                    <li>• We strive to provide accurate product descriptions and images</li>
                    <li>• Specifications may vary slightly from manufacturer updates</li>
                    <li>• Colors may appear different due to monitor settings</li>
                    <li>• We reserve the right to correct any errors or inaccuracies</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-card-foreground mb-2">Availability</h4>
                  <ul className="text-muted-foreground space-y-1 ml-4">
                    <li>• All products are subject to availability</li>
                    <li>• We reserve the right to discontinue products without notice</li>
                    <li>• Pre-order items may have extended delivery times</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Ordering and Payment */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-card-foreground">
                  <Scale className="h-6 w-6 text-primary" />
                  Ordering and Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-card-foreground mb-2">Order Process</h4>
                  <ul className="text-muted-foreground space-y-1 ml-4">
                    <li>• Orders are subject to acceptance and availability</li>
                    <li>• We reserve the right to refuse or cancel orders</li>
                    <li>• Order confirmation will be sent via email</li>
                    <li>• Prices are subject to change without notice</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-card-foreground mb-2">Payment Terms</h4>
                  <ul className="text-muted-foreground space-y-1 ml-4">
                    <li>• Payment is required at the time of order</li>
                    <li>• We accept major credit cards and bank transfers</li>
                    <li>• All prices are in Nigerian Naira (NGN)</li>
                    <li>• Payment processing is handled by secure third-party providers</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Shipping and Delivery */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Shipping and Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-muted-foreground space-y-2">
                  <li>• Delivery times are estimates and not guaranteed</li>
                  <li>• Shipping costs are calculated at checkout</li>
                  <li>• Risk of loss passes to customer upon delivery</li>
                  <li>• We are not responsible for delays caused by shipping carriers</li>
                  <li>• Customers must inspect packages upon delivery</li>
                </ul>
              </CardContent>
            </Card>

            {/* Returns and Refunds */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Returns and Refunds</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-muted-foreground space-y-2">
                  <li>• Returns must be initiated within 7 days of delivery</li>
                  <li>• Items must be in original condition with all packaging</li>
                  <li>• Customer is responsible for return shipping costs</li>
                  <li>• Refunds will be processed within 5-10 business days</li>
                  <li>• Some items may be non-returnable (software, consumables)</li>
                </ul>
              </CardContent>
            </Card>

            {/* Warranties */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-card-foreground">
                  <Shield className="h-6 w-6 text-primary" />
                  Warranties and Disclaimers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-card-foreground mb-2">Product Warranties</h4>
                  <ul className="text-muted-foreground space-y-1 ml-4">
                    <li>• Products come with manufacturer warranties</li>
                    <li>• Warranty terms vary by product and manufacturer</li>
                    <li>• We facilitate warranty claims but are not the warranty provider</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-card-foreground mb-2">Disclaimers</h4>
                  <ul className="text-muted-foreground space-y-1 ml-4">
                    <li>• Products are sold "as is" without additional warranties</li>
                    <li>• We disclaim all implied warranties to the extent permitted by law</li>
                    <li>• Our liability is limited to the purchase price of the product</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* User Conduct */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-card-foreground">
                  <AlertTriangle className="h-6 w-6 text-primary" />
                  User Conduct
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">You agree not to:</p>
                <ul className="text-muted-foreground space-y-2">
                  <li>• Use the website for any unlawful purpose</li>
                  <li>• Attempt to gain unauthorized access to our systems</li>
                  <li>• Interfere with the website's operation</li>
                  <li>• Post or transmit harmful content</li>
                  <li>• Violate any applicable laws or regulations</li>
                </ul>
              </CardContent>
            </Card>

            {/* Intellectual Property */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Intellectual Property</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  All content on this website, including text, graphics, logos, images, and software, is the property of
                  Alphacom Online Store or its content suppliers and is protected by copyright and other intellectual
                  property laws. You may not reproduce, distribute, or create derivative works without our written
                  permission.
                </p>
              </CardContent>
            </Card>

            {/* Limitation of Liability */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  In no event shall Alphacom Online Store be liable for any indirect, incidental, special,
                  consequential, or punitive damages, including without limitation, loss of profits, data, use,
                  goodwill, or other intangible losses, resulting from your use of our services.
                </p>
              </CardContent>
            </Card>

            {/* Governing Law */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Governing Law</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  These terms shall be governed by and construed in accordance with the laws of Nigeria. Any disputes
                  arising under these terms shall be subject to the exclusive jurisdiction of the courts of Lagos State,
                  Nigeria.
                </p>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="bg-gradient-to-r from-cyan-50 to-purple-50 dark:from-cyan-900/20 dark:to-purple-900/20 border-cyan-200 dark:border-cyan-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-card-foreground">
                  <Mail className="h-6 w-6 text-primary" />
                  Contact Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  If you have questions about these Terms and Conditions, please contact us:
                </p>
                <div className="space-y-2 text-muted-foreground">
                  <p>
                    <strong>Email:</strong> legal@alphacomonline.com
                  </p>
                  <p>
                    <strong>Phone:</strong> +234 702 6384 967
                  </p>
                  <p>
                    <strong>Address:</strong> No 3 Adepele street, off Medical road, Computer village Ikeja, Lagos
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Changes to Terms */}
            <Card className="bg-muted/50 border-border">
              <CardContent className="p-6">
                <h4 className="font-semibold text-card-foreground mb-2">Changes to Terms</h4>
                <p className="text-muted-foreground">
                  We reserve the right to modify these terms at any time. Changes will be effective immediately upon
                  posting on the website. Your continued use of the service after any changes constitutes acceptance of
                  the new terms.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
