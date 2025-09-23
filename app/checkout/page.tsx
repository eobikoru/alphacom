"use client"

import { AppLayout } from "@/components/app-layout"
import { PremiumCheckout } from "@/components/premium-checkout"
import { StructuredData } from "@/components/seo/structured-data"
import { useEffect } from "react"

export default function CheckoutPage() {
  const checkoutSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Secure Checkout",
    description: "Complete your purchase with our secure checkout process. SSL encrypted and PCI compliant.",
    url: "https://www.alphacomonline.com/checkout",
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://www.alphacomonline.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Cart",
          item: "https://www.alphacomonline.com/cart",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Checkout",
          item: "https://www.alphacomonline.com/checkout",
        },
      ],
    },
    mainEntity: {
      "@type": "CheckoutPage",
      name: "Premium Store Secure Checkout",
    },
  }

  useEffect(() => {
    // Set page-specific meta tags
    document.title = "Secure Checkout | Premium Store"

    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Complete your purchase securely with SSL encryption, multiple payment options, and guaranteed buyer protection.",
      )
    } else {
      const meta = document.createElement("meta")
      meta.name = "description"
      meta.content =
        "Complete your purchase securely with SSL encryption, multiple payment options, and guaranteed buyer protection."
      document.head.appendChild(meta)
    }

    // Add robots meta for checkout page
    const robotsMeta = document.createElement("meta")
    robotsMeta.name = "robots"
    robotsMeta.content = "noindex, nofollow"
    document.head.appendChild(robotsMeta)

    return () => {
      // Cleanup
      const addedMeta = document.querySelector('meta[name="robots"][content="noindex, nofollow"]')
      if (addedMeta) {
        document.head.removeChild(addedMeta)
      }
    }
  }, [])

  return (
    <>
      <StructuredData data={checkoutSchema} />
      <AppLayout>
        <main>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white py-12">
            <div className="container mx-auto px-4">
              <PremiumCheckout />
            </div>
          </div>
        </main>
      </AppLayout>
    </>
  )
}
