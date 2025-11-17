"use client"

import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RotateCcw, Clock, CheckCircle, XCircle, Package, Mail } from "lucide-react"

export default function ReturnPolicyPage() {
  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-20 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-slate-800/80" />
          </div>

          <div className="relative z-10 container mx-auto px-4 text-center">
            <Badge className="mb-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white">Return Policy</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Easy Returns</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              We want you to be completely satisfied with your purchase. Here's our hassle-free return policy.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Return Overview */}
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-card-foreground">
                  <RotateCcw className="h-6 w-6 text-green-600" />
                  Our Return Promise
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-lg">
                  We offer a 24 hours return policy on most items. If you're not completely satisfied with your purchase,
                  we'll make it right.
                </p>
              </CardContent>
            </Card>

            {/* Return Timeline */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-card-foreground">
                  <Clock className="h-6 w-6 text-primary" />
                  Return Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-xl">24</span>
                    </div>
                    <h4 className="font-semibold text-card-foreground mb-2">Days to Return</h4>
                    <p className="text-muted-foreground text-sm">You have 24 hours from delivery to initiate a return</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-xl">3-5</span>
                    </div>
                    <h4 className="font-semibold text-card-foreground mb-2">Processing Days</h4>
                    <p className="text-muted-foreground text-sm">We'll process your return within 3-5 business days</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-xl">5-10</span>
                    </div>
                    <h4 className="font-semibold text-card-foreground mb-2">Refund Days</h4>
                    <p className="text-muted-foreground text-sm">Refunds are processed within 5-10 business days</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Returnable Items
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-card-foreground">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  What Can Be Returned
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-card-foreground mb-2">Eligible Items</h4>
                  <ul className="text-muted-foreground space-y-1 ml-4">
                    <li>• Unopened items in original packaging</li>
                    <li>• Items with all original accessories and documentation</li>
                    <li>• Products in new, unused condition</li>
                    <li>• Items with original tags and labels intact</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-card-foreground mb-2">Condition Requirements</h4>
                  <ul className="text-muted-foreground space-y-1 ml-4">
                    <li>• No signs of use or wear</li>
                    <li>• Original packaging and protective materials</li>
                    <li>• All cables, adapters, and accessories included</li>
                    <li>• Product registration not completed (if applicable)</li>
                  </ul>
                </div>
              </CardContent>
            </Card> */}

            {/* Non-Returnable Items */}
            {/* <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-card-foreground">
                  <XCircle className="h-6 w-6 text-red-500" />
                  What Cannot Be Returned
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-muted-foreground space-y-2">
                  <li>• Software products (once opened or downloaded)</li>
                  <li>• Consumable items (batteries, ink cartridges, memory cards with data)</li>
                  <li>• Personalized or customized products</li>
                  <li>• Items damaged by misuse or normal wear</li>
                  <li>• Products missing original packaging or accessories</li>
                  <li>• Items purchased with special promotions or clearance sales</li>
                  <li>• Products beyond the 7-day return window</li>
                  <li>• Items that have been registered or activated</li>
                </ul>
              </CardContent>
            </Card> */}

            {/* Return Process */}
            {/* <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-card-foreground">
                  <Package className="h-6 w-6 text-primary" />
                  How to Return Items
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold">1</span>
                    </div>
                    <h4 className="font-semibold text-card-foreground mb-2">Contact Us</h4>
                    <p className="text-muted-foreground text-sm">Call or email to initiate return</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold">2</span>
                    </div>
                    <h4 className="font-semibold text-card-foreground mb-2">Get RMA</h4>
                    <p className="text-muted-foreground text-sm">Receive return authorization number</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold">3</span>
                    </div>
                    <h4 className="font-semibold text-card-foreground mb-2">Pack & Ship</h4>
                    <p className="text-muted-foreground text-sm">Package item and send to us</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold">4</span>
                    </div>
                    <h4 className="font-semibold text-card-foreground mb-2">Get Refund</h4>
                    <p className="text-muted-foreground text-sm">Receive refund after inspection</p>
                  </div>
                </div>

                <div className="bg-muted/50 p-6 rounded-lg">
                  <h4 className="font-semibold text-card-foreground mb-3">Required Information</h4>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Order number</li>
                    <li>• Reason for return</li>
                    <li>• Product condition</li>
                    <li>• Preferred resolution (refund/exchange)</li>
                  </ul>
                </div>
              </CardContent>
            </Card> */}

            {/* Shipping Information */}
            {/* <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Return Shipping</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-card-foreground mb-2">Shipping Costs</h4>
                  <ul className="text-muted-foreground space-y-1 ml-4">
                    <li>• Customer is responsible for return shipping costs</li>
                    <li>• We recommend using trackable shipping methods</li>
                    <li>• Insurance recommended for high-value items</li>
                    <li>• We'll provide return shipping labels for defective items</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-card-foreground mb-2">Packaging Guidelines</h4>
                  <ul className="text-muted-foreground space-y-1 ml-4">
                    <li>• Use original packaging when possible</li>
                    <li>• Include all accessories and documentation</li>
                    <li>• Pack securely to prevent damage during shipping</li>
                    <li>• Include RMA number on the outside of the package</li>
                  </ul>
                </div>
              </CardContent>
            </Card> */}

            {/* Refund Information */}
            {/* <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Refund Process</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-card-foreground mb-2">Refund Methods</h4>
                  <ul className="text-muted-foreground space-y-1 ml-4">
                    <li>• Refunds issued to original payment method</li>
                    <li>• Credit card refunds: 5-10 business days</li>
                    <li>• Bank transfer refunds: 3-7 business days</li>
                    <li>• Cash purchases: Store credit or cash refund</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-card-foreground mb-2">Refund Amount</h4>
                  <ul className="text-muted-foreground space-y-1 ml-4">
                    <li>• Full purchase price (minus original shipping if applicable)</li>
                    <li>• Return shipping costs not refunded (unless item is defective)</li>
                    <li>• Restocking fees may apply to certain items</li>
                    <li>• Partial refunds for items not in original condition</li>
                  </ul>
                </div>
              </CardContent>
            </Card> */}

            {/* Exchanges */}
            {/* <Card className="bg-gradient-to-r from-cyan-50 to-purple-50 dark:from-cyan-900/20 dark:to-purple-900/20 border-cyan-200 dark:border-cyan-800">
              <CardHeader>
                <CardTitle className="text-card-foreground">Exchanges</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  We offer exchanges for defective items or wrong items shipped. For size or color changes, please
                  process a return and place a new order.
                </p>
                <ul className="text-muted-foreground space-y-2">
                  <li>• Exchanges processed within 3-5 business days</li>
                  <li>• Subject to product availability</li>
                  <li>• Price differences may apply</li>
                  <li>• Free shipping for defective item exchanges</li>
                </ul>
              </CardContent>
            </Card> */}

            {/* Contact Information */}
            {/* <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-card-foreground">
                  <Mail className="h-6 w-6 text-primary" />
                  Return Support Contact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-card-foreground mb-3">Contact Information</h4>
                    <div className="space-y-2 text-muted-foreground">
                      <p>
                        <strong>Email:</strong> returns@alphacomonline.com
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
                    <h4 className="font-semibold text-card-foreground mb-3">Return Address</h4>
                    <div className="space-y-1 text-muted-foreground">
                      <p>Alphacom Online Store</p>
                      <p>Returns Department</p>
                      <p>No 3 Adepele street, off Medical road</p>
                      <p>Computer village Ikeja, Lagos</p>
                      <p>Nigeria</p>
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
                  <li>• Returns must be initiated within 7 days of delivery</li>
                  <li>• Items must be in original condition for full refund</li>
                  <li>• Keep tracking information for return shipments</li>
                  <li>• Defective items may be eligible for warranty replacement instead of return</li>
                  <li>• Special orders and custom items are generally non-returnable</li>
                </ul>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
