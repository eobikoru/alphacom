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
import { SITE_URL } from "@/lib/site"
import Script from "next/script"

const GOOGLE_TAG_ID = "GT-KVFVKX32"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AlphaCom Online | Premium Technology Store - Computer Village Lagos",
    template: "%s | AlphaCom Online",
  },
  description:
    "Premium technology store in Computer Village, Lagos. Shop Logitech, Anker, SanDisk, Micropack & more. Electronics, computers, accessories with 100% warranty, expert support & fast delivery across Nigeria.",
  keywords: [
    "alphacom online",
    "computer village lagos",
    "technology store nigeria",
    "Logitech Nigeria",
    "Logitech Lagos",
    "Anker Nigeria",
    "SanDisk Nigeria",
    "Micropack Nigeria",
    "electronics shop ikeja",
    "computers lagos",
    "tech accessories",
    "premium electronics",
    "authorized Logitech",
    "authorized Anker",
    "computer village store",
    "tech support lagos",
  ],
  authors: [{ name: "AlphaCom Online", url: SITE_URL }],
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
    url: SITE_URL,
    siteName: "AlphaCom Online",
    title: "AlphaCom Online | Premium Technology Store - Logitech, Anker, SanDisk Partner Lagos",
    description:
      "Premium technology store in Computer Village, Lagos. Shop Logitech, Anker, SanDisk, Micropack. Expert support, 100% warranty & fast delivery across Nigeria.",
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "AlphaCom Online - Premium Technology Store Lagos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AlphaCom Online | Premium Technology Store Lagos",
    description: "Premium technology store in Computer Village, Lagos. Logitech, Anker, SanDisk & more. Expert support & competitive prices.",
    images: [`${SITE_URL}/twitter-image.jpg`],
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
    google: "c8oQppTwjVGtJpAyfFXvq-Io27nJKOCHmWbx0qhL8Xc",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  alternates: {
    canonical: SITE_URL,
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
        <meta name="google-site-verification" content="c8oQppTwjVGtJpAyfFXvq-Io27nJKOCHmWbx0qhL8Xc" />
        <meta name="google-site-verification" content="-COsajGLA6SWredQtuZIW6HVEDgUknSc0F9ADCb4HVE" />
        <link rel="icon" href="/alphacomwhitelogo.ico" sizes="any" />
        <link rel="icon" href="/alphacomwhitelogo.ico" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Google tag (gtag.js) */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-tag-gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GOOGLE_TAG_ID}');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "AlphaCom Online",
              url: SITE_URL,
              description:
                "Premium technology store in Computer Village, Lagos. Authorized partner for Logitech, Anker, SanDisk, Micropack. Quality electronics and expert support.",
              potentialAction: {
                "@type": "SearchAction",
                target: `${SITE_URL}/search?q={search_term_string}`,
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
              "@id": `${SITE_URL}/#organization`,
              name: "AlphaCom Online",
              url: SITE_URL,
              logo: `${SITE_URL}/logo.png`,
              image: `${SITE_URL}/og-image.jpg`,
              description:
                "Premium technology store. Authorized Logitech, Anker, SanDisk, Micropack partner. Computer Village Ikeja, Lagos. Quality electronics, computers & accessories with expert support.",
              priceRange: "$$",
              telephone: "+234 702 638 4967, +234 813 733 1005",
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
