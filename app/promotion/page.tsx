import type { Metadata } from "next"
import { PromotionLanding } from "@/components/promotion-landing"
import { SITE_URL } from "@/lib/site"

const title = "20,000mAh Power Bank + Free Electric Hand Fan for ₦27,000"
const description =
  "Get a 20,000mAh power bank and a portable electric hand fan free for ₦27,000. Free delivery on this Alphacom Online bundle from Computer Village, Ikeja, Lagos."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_URL}/promotion` },
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/promotion`,
    type: "website",
    images: [
      {
        url: `${SITE_URL}/promotion/bundle.jpg`,
        width: 768,
        height: 1024,
        alt: "Alphacom bundle: 20,000mAh power bank and free orange electric hand fan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [`${SITE_URL}/promotion/bundle.jpg`],
  },
}

export default function PromotionPage() {
  return (
    <main>
      <PromotionLanding />
    </main>
  )
}
