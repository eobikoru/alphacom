interface ReviewSchemaProps {
  productName: string
  reviews: Array<{
    author: string
    rating: number
    reviewBody: string
    datePublished: string
  }>
  aggregateRating: {
    ratingValue: number
    reviewCount: number
  }
}

export function ReviewSchema({ productName, reviews, aggregateRating }: ReviewSchemaProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productName,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: aggregateRating.ratingValue,
      reviewCount: aggregateRating.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    review: reviews.map((review) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: review.author,
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1,
      },
      reviewBody: review.reviewBody,
      datePublished: review.datePublished,
    })),
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
}
