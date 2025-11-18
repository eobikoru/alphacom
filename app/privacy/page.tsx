"use client"

import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Eye, Lock, UserCheck, Database, Mail } from "lucide-react"

export default function PrivacyPolicyPage() {
  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-20 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-slate-800/80" />
          </div>

          <div className="relative z-10 container mx-auto px-4 text-center">
            <Badge className="mb-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white">Privacy Policy</Badge>
            <h1 className="text-4xl md:text-5xl font-normal text-white mb-6">Your Privacy Matters</h1>
            <p className="text-xl  font-normal text-gray-300 max-w-2xl mx-auto">
              We are committed to protecting your personal information and being transparent about how we use it.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Last Updated */}
            <Card className="bg-muted/50 border-border">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">
                  <strong>Last Updated:</strong> January 1, 2025
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  This Privacy Policy explains how Alphacom Online Store collects, uses, and protects your information.
                </p>
              </CardContent>
            </Card>

            {/* Information We Collect */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-card-foreground">
                  <Database className="h-6 w-6 text-primary" />
                  Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-card-foreground mb-2">Personal Information</h4>
                  <ul className="text-muted-foreground space-y-1 ml-4">
                    <li>• Name, email address, and phone number</li>
                    <li>• Billing and shipping addresses</li>
                    <li>• Payment information (processed securely by our payment partners)</li>
                    <li>• Account credentials and preferences</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-card-foreground mb-2">Usage Information</h4>
                  <ul className="text-muted-foreground space-y-1 ml-4">
                    <li>• Pages visited and products viewed</li>
                    <li>• Search queries and browsing behavior</li>
                    <li>• Device information and IP address</li>
                    <li>• Cookies and similar tracking technologies</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* How We Use Information */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-card-foreground">
                  <UserCheck className="h-6 w-6 text-primary" />
                  How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-muted-foreground space-y-2">
                  <li>• Process and fulfill your orders</li>
                  <li>• Provide customer support and technical assistance</li>
                  <li>• Send order confirmations and shipping updates</li>
                  <li>• Improve our website and services</li>
                  <li>• Send promotional emails (with your consent)</li>
                  <li>• Prevent fraud and ensure security</li>
                  <li>• Comply with legal obligations</li>
                </ul>
              </CardContent>
            </Card>

            {/* Information Sharing */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-card-foreground">
                  <Shield className="h-6 w-6 text-primary" />
                  Information Sharing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  We do not sell, trade, or rent your personal information to third parties. We may share your
                  information only in the following circumstances:
                </p>
                <ul className="text-muted-foreground space-y-2">
                  <li>• With trusted service providers who help us operate our business</li>
                  <li>• With shipping companies to deliver your orders</li>
                  <li>• With payment processors to handle transactions securely</li>
                  <li>• When required by law or to protect our rights</li>
                  <li>• With your explicit consent</li>
                </ul>
              </CardContent>
            </Card>

            {/* Data Security */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-card-foreground">
                  <Lock className="h-6 w-6 text-primary" />
                  Data Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  We implement appropriate security measures to protect your personal information:
                </p>
                <ul className="text-muted-foreground space-y-2">
                  <li>• SSL encryption for all data transmission</li>
                  <li>• Secure servers and databases</li>
                  <li>• Regular security audits and updates</li>
                  <li>• Limited access to personal information</li>
                  <li>• Employee training on data protection</li>
                </ul>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-card-foreground">
                  <Eye className="h-6 w-6 text-primary" />
                  Your Rights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">You have the right to:</p>
                <ul className="text-muted-foreground space-y-2">
                  <li>• Access your personal information</li>
                  <li>• Correct inaccurate information</li>
                  <li>• Delete your account and personal data</li>
                  <li>• Opt-out of marketing communications</li>
                  <li>• Request data portability</li>
                  <li>• Object to certain data processing</li>
                </ul>
              </CardContent>
            </Card>

            {/* Cookies */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Cookies and Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  We use cookies and similar technologies to enhance your browsing experience:
                </p>
                <ul className="text-muted-foreground space-y-2">
                  <li>• Essential cookies for website functionality</li>
                  <li>• Analytics cookies to understand usage patterns</li>
                  <li>• Marketing cookies for personalized ads (with consent)</li>
                  <li>• Preference cookies to remember your settings</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  You can manage cookie preferences through your browser settings.
                </p>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="bg-gradient-to-r from-cyan-50 to-purple-50 dark:from-cyan-900/20 dark:to-purple-900/20 border-cyan-200 dark:border-cyan-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-card-foreground">
                  <Mail className="h-6 w-6 text-primary" />
                  Contact Us About Privacy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  If you have questions about this Privacy Policy or want to exercise your rights, contact us:
                </p>
                <div className="space-y-2 text-muted-foreground">
                  <p>
                    <strong>Email:</strong> Alphacomonline.com
                  </p>
                  <p>
                    <strong>Phone:</strong> +234 702 638 4967
                  </p>
                  <p>
                    <strong>Address:</strong> No 3 Adepele street, off Medical road, Computer village Ikeja, Lagos
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Changes to Policy */}
            <Card className="bg-muted/50 border-border">
              <CardContent className="p-6">
                <h4 className="font-semibold text-card-foreground mb-2">Changes to This Policy</h4>
                <p className="text-muted-foreground">
                  We may update this Privacy Policy from time to time. We will notify you of any significant changes by
                  posting the new policy on our website and updating the "Last Updated" date. Your continued use of our
                  services after any changes constitutes acceptance of the updated policy.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
