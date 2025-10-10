import type React from "react"
import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"
import { ReduxProvider } from "@/components/redux-provider"
import { ThemeWrapper } from "@/components/theme-wrapper"
import { Suspense } from "react"
import NextTopLoader from "nextjs-toploader"
import { WhatsAppWidget } from "@/components/whatsapp-widget"
import { QueryProvider } from "@/lib/providers/query-provider"
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  metadataBase: new URL("https://www.alphacomonline.com"),
  title: {
    default: "AlphaCom Online | Premium Technology Store - Computer Village Lagos",
    template: "%s | AlphaCom Online",
  },
  description:
    "Premium technology store in Computer Village, Lagos. Shop electronics, computers, accessories & more with expert support, competitive prices & fast delivery across Nigeria.",
  keywords: [
    "alphacom online",
    "computer village lagos",
    "technology store nigeria",
    "electronics shop ikeja",
    "computers lagos",
    "tech accessories",
    "premium electronics",
    "nigeria technology",
    "computer village store",
    "tech support lagos",
  ],
  authors: [{ name: "AlphaCom Online", url: "https://www.alphacomonline.com" }],
  creator: "AlphaCom Online",
  publisher: "AlphaCom Online",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.alphacomonline.com",
    siteName: "AlphaCom Online",
    title: "AlphaCom Online | Premium Technology Store Lagos",
    description:
      "Premium technology store in Computer Village, Lagos. Expert support, competitive prices & fast delivery across Nigeria.",
    images: [
      {
        url: "https://www.alphacomonline.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AlphaCom Online - Premium Technology Store Lagos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AlphaCom Online | Premium Technology Store Lagos",
    description: "Premium technology store in Computer Village, Lagos. Expert support & competitive prices.",
    images: ["https://www.alphacomonline.com/twitter-image.jpg"],
    creator: "@alphacomonline",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  alternates: {
    canonical: "https://www.alphacomonline.com",
  },
  category: "technology",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "AlphaCom Online",
              url: "https://www.alphacomonline.com",
              description:
                "Premium technology store in Computer Village, Lagos offering quality electronics and expert support",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://www.alphacomonline.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
              sameAs: [
                "https://facebook.com/alphacomonline",
                "https://twitter.com/alphacomonline",
                "https://instagram.com/alphacomonline",
                "https://linkedin.com/company/alphacomonline",
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "@id": "https://www.alphacomonline.com/#organization",
              name: "AlphaCom Online",
              url: "https://www.alphacomonline.com",
              logo: "https://www.alphacomonline.com/logo.png",
              image: "https://www.alphacomonline.com/og-image.jpg",
              description:
                "Premium technology store offering quality electronics, computers, and accessories with expert support",
              priceRange: "$$",
              telephone: "+234 702 6384 967",
              email: "info@alphacomonline.com",
              address: {
                "@type": "PostalAddress",
                streetAddress: "No 3 Adepele street, off Medical road",
                addressLocality: "Computer village Ikeja",
                addressRegion: "Lagos",
                addressCountry: "NG",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: "6.5244",
                longitude: "3.3792",
              },
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                  opens: "09:00",
                  closes: "18:00",
                },
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: "Saturday",
                  opens: "10:00",
                  closes: "16:00",
                },
              ],
              paymentAccepted: ["Cash", "Credit Card", "Bank Transfer"],
              currenciesAccepted: "NGN",
              areaServed: {
                "@type": "Country",
                name: "Nigeria",
              },
            }),
          }}
        />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <NextTopLoader
          color="#3b82f6"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={true}
          easing="ease"
          speed={200}
          shadow="0 0 10px #3b82f6,0 0 5px #3b82f6"
        />
        <QueryProvider>
          <ReduxProvider>
            <Suspense fallback={null}>
              <ThemeWrapper>{children}</ThemeWrapper>
            </Suspense>
          </ReduxProvider>
        </QueryProvider>
        <Toaster />
        <WhatsAppWidget />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
