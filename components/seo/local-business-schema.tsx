interface LocalBusinessProps {
  name: string
  description: string
  address: {
    streetAddress: string
    addressLocality: string
    addressRegion: string
    postalCode: string
    addressCountry: string
  }
  phone: string
  email: string
  openingHours: string[]
  priceRange: string
  paymentAccepted: string[]
  currenciesAccepted: string[]
}

export function LocalBusinessSchema({
  name,
  description,
  address,
  phone,
  email,
  openingHours,
  priceRange,
  paymentAccepted,
  currenciesAccepted,
}: LocalBusinessProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name,
    description,
    url: "https://www.alphacomonline.com",
    logo: "https://www.alphacomonline.com/logo.png",
    image: "https://www.alphacomonline.com/og-image.jpg",
    mainEntityOfPage: "https://www.alphacomonline.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.alphacomonline.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: phone,
      contactType: "customer service",
      availableLanguage: ["English", "Yoruba", "Igbo", "Hausa"],
      areaServed: "NG",
    },
    sameAs: [
      "https://www.facebook.com/alphacomonline",
      "https://www.twitter.com/alphacomonline",
      "https://www.instagram.com/alphacomonline",
      "https://www.linkedin.com/company/alphacomonline",
      "https://wa.me/2348000000000",
    ],
    telephone: phone,
    email,
    address: {
      "@type": "PostalAddress",
      streetAddress: address.streetAddress,
      addressLocality: address.addressLocality,
      addressRegion: address.addressRegion,
      postalCode: address.postalCode,
      addressCountry: address.addressCountry,
    },
    openingHoursSpecification: openingHours.map((hours) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: hours.split(" ")[0],
      opens: hours.split(" ")[1],
      closes: hours.split(" ")[2],
    })),
    priceRange,
    paymentAccepted,
    currenciesAccepted,
    "@id": "https://www.alphacomonline.com/#organization",
    category: "Electronics Store",
    areaServed: {
      "@type": "State",
      name: "Lagos State",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Electronics and Computer Products",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Computer Hardware & Software",
          },
        },
      ],
    },
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
}
