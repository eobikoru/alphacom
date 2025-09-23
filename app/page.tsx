import { AppLayout } from "@/components/app-layout"
import { HeroSection } from "@/components/hero-section"
import { ProductCategories } from "@/components/product-categories"
import { FeaturedProducts } from "@/components/featured-products"
import { generateMetadata } from "@/components/seo/seo-head"
import { StructuredData } from "@/components/seo/structured-data"
import { generateOrganizationSchema } from "@/lib/seo-utils"

export const metadata = generateMetadata({
  title: "Premium E-Commerce Store | Best Products & Deals Online",
  description:
    "Discover premium products at unbeatable prices. Shop electronics, fashion, home goods & more with fast shipping, secure checkout & 24/7 customer support.",
  keywords: [
    "premium store",
    "online shopping",
    "electronics",
    "fashion",
    "home goods",
    "best deals",
    "fast shipping",
    "secure checkout",
    "customer support",
    "tech gadgets",
    "smartphones",
    "laptops",
    "gaming",
    "professional workspace",
  ],
  url: "/",
  type: "website",
  image: "/images/homepage-og.jpg",
})

export default function HomePage() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Premium Store",
    url: "https://www.alphacomonline.com",
    description:
      "Premium e-commerce store offering the best products at unbeatable prices with fast shipping and secure checkout.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.alphacomonline.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
    sameAs: [
      "https://facebook.com/premiumstore",
      "https://twitter.com/premiumstore",
      "https://instagram.com/premiumstore",
      "https://linkedin.com/company/premiumstore",
      "https://youtube.com/premiumstore",
    ],
  }

  const organizationSchema = generateOrganizationSchema()

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.alphacomonline.com",
      },
    ],
  }

  const offerCatalogSchema = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "Premium Store Product Catalog",
    description:
      "Browse our extensive catalog of premium products including electronics, fashion, home goods and more.",
    itemListElement: [
      {
        "@type": "OfferCatalog",
        name: "Electronics",
        description: "Latest electronics including smartphones, laptops, tablets and accessories",
        url: "https://www.alphacomonline.com/categories/electronics",
      },
      {
        "@type": "OfferCatalog",
        name: "Computers",
        description: "Professional computers, gaming setups and accessories",
        url: "https://www.alphacomonline.com/categories/computers",
      },
      {
        "@type": "OfferCatalog",
        name: "Fashion",
        description: "Trendy fashion items for men and women",
        url: "https://www.alphacomonline.com/categories/fashion",
      },
      {
        "@type": "OfferCatalog",
        name: "Home & Garden",
        description: "Home improvement and garden essentials",
        url: "https://www.alphacomonline.com/categories/home-garden",
      },
    ],
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Do you offer free shipping?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, we offer free shipping on all orders over $50. Orders are typically delivered within 2-5 business days.",
        },
      },
      {
        "@type": "Question",
        name: "What is your return policy?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We offer a 30-day return policy on all items. Products must be in original condition with all packaging and accessories.",
        },
      },
      {
        "@type": "Question",
        name: "Do you provide warranty on products?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, all our products come with manufacturer warranty. We also provide extended warranty options for additional protection.",
        },
      },
      {
        "@type": "Question",
        name: "How can I track my order?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Once your order ships, you'll receive a tracking number via email. You can also track your order in your account dashboard.",
        },
      },
    ],
  }

  return (
    <>
      <StructuredData data={websiteSchema} />
      <StructuredData data={organizationSchema} />
      <StructuredData data={breadcrumbSchema} />
      <StructuredData data={offerCatalogSchema} />
      <StructuredData data={faqSchema} />

      <AppLayout>
        <main>
          <HeroSection />
          <ProductCategories />
          <FeaturedProducts />
        </main>
      </AppLayout>
    </>
  )
}
