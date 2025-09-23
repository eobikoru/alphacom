import { AppLayout } from "@/components/app-layout"
import { CartPageClient } from "./cart-client"
import { generateMetadata } from "@/components/seo/seo-head"
import { StructuredData } from "@/components/seo/structured-data"

export const metadata = generateMetadata({
  title: "Shopping Cart | Premium Store",
  description:
    "Review your selected premium products, update quantities, and proceed to secure checkout. Free shipping on orders over $50.",
  keywords: [
    "shopping cart",
    "review order",
    "update cart",
    "secure checkout",
    "free shipping",
    "premium products",
    "online shopping",
  ],
  url: "/cart",
  noIndex: true, // Cart pages should not be indexed
  noFollow: true,
})

export default function CartPage() {
  const cartSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Shopping Cart",
    description: "Review and manage your selected products before checkout",
    url: "https://www.alphacomonline.com/cart",
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
          name: "Shopping Cart",
          item: "https://www.alphacomonline.com/cart",
        },
      ],
    },
    mainEntity: {
      "@type": "ShoppingCart",
      name: "Premium Store Shopping Cart",
    },
  }

  return (
    <>
      <StructuredData data={cartSchema} />
      <AppLayout blackNavbar>
        <main>
          <CartPageClient />
        </main>
      </AppLayout>
    </>
  )
}
