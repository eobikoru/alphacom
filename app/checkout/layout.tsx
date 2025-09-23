import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Secure Checkout | Premium Store",
  description:
    "Complete your purchase securely with SSL encryption, multiple payment options, and guaranteed buyer protection.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
