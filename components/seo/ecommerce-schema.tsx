interface ProductSchemaProps {
  product: {
    id: string
    name: string
    description: string
    price: number
    currency: string
    image: string[]
    brand?: string
    category: string
    availability: "InStock" | "OutOfStock" | "PreOrder"
    condition?: "NewCondition" | "UsedCondition" | "RefurbishedCondition"
    sku?: string
    gtin?: string
    mpn?: string
    rating?: {
      value: number
      count: number
      bestRating?: number
      worstRating?: number
    }
    offers?: {
      price: number
      currency: string
      availability: string
      validFrom?: string
      validThrough?: string
      priceValidUntil?: string
    }
  }
}

export function ProductSchema({ product }: ProductSchemaProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `https://your-domain.com/products/${product.id}`,
    name: product.name,
    description: product.description,
    image: product.image,
    brand: product.brand
      ? {
          "@type": "Brand",
          name: product.brand,
        }
      : undefined,
    category: product.category,
    sku: product.sku,
    gtin: product.gtin,
    mpn: product.mpn,
    condition: `https://schema.org/${product.condition || "NewCondition"}`,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: product.currency,
      availability: `https://schema.org/${product.availability}`,
      itemCondition: `https://schema.org/${product.condition || "NewCondition"}`,
      seller: {
        "@type": "Organization",
        name: "Premium Store",
        url: "https://your-domain.com",
      },
      priceValidUntil:
        product.offers?.priceValidUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    },
    aggregateRating: product.rating
      ? {
          "@type": "AggregateRating",
          ratingValue: product.rating.value,
          reviewCount: product.rating.count,
          bestRating: product.rating.bestRating || 5,
          worstRating: product.rating.worstRating || 1,
        }
      : undefined,
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
}

interface ShoppingCartSchemaProps {
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    image?: string
  }>
  total: number
  currency: string
}

export function ShoppingCartSchema({ items, total, currency }: ShoppingCartSchemaProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ShoppingCart",
    name: "Premium Store Shopping Cart",
    description: "Shopping cart containing selected premium products",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: item.name,
        offers: {
          "@type": "Offer",
          price: item.price,
          priceCurrency: currency,
        },
      },
      quantity: item.quantity,
    })),
    totalPrice: total,
    priceCurrency: currency,
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
}

interface CheckoutSchemaProps {
  orderTotal: number
  currency: string
  paymentMethods: string[]
  shippingOptions: string[]
}

export function CheckoutSchema({ orderTotal, currency, paymentMethods, shippingOptions }: CheckoutSchemaProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CheckoutPage",
    name: "Secure Checkout",
    description: "Complete your purchase with our secure, SSL-encrypted checkout process",
    url: "https://your-domain.com/checkout",
    paymentAccepted: paymentMethods,
    availableDeliveryMethod: shippingOptions.map((method) => ({
      "@type": "DeliveryMethod",
      name: method,
    })),
    totalPrice: orderTotal,
    priceCurrency: currency,
    provider: {
      "@type": "Organization",
      name: "Premium Store",
      url: "https://your-domain.com",
    },
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
}

export function OrderSchema({
  orderId,
  orderDate,
  orderStatus,
  customer,
  items,
  total,
  currency,
  shippingAddress,
  billingAddress,
}: {
  orderId: string
  orderDate: string
  orderStatus: string
  customer: { name: string; email: string }
  items: Array<{ name: string; price: number; quantity: number }>
  total: number
  currency: string
  shippingAddress: any
  billingAddress: any
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Order",
    orderNumber: orderId,
    orderDate: orderDate,
    orderStatus: `https://schema.org/${orderStatus}`,
    customer: {
      "@type": "Person",
      name: customer.name,
      email: customer.email,
    },
    orderedItem: items.map((item) => ({
      "@type": "OrderItem",
      orderItemNumber: item.name,
      orderQuantity: item.quantity,
      orderItemStatus: "https://schema.org/OrderProcessing",
      orderedItem: {
        "@type": "Product",
        name: item.name,
      },
      price: item.price,
      priceCurrency: currency,
    })),
    orderDelivery: {
      "@type": "ParcelDelivery",
      deliveryAddress: shippingAddress,
    },
    billingAddress: billingAddress,
    totalPrice: total,
    priceCurrency: currency,
    seller: {
      "@type": "Organization",
      name: "Premium Store",
      url: "https://your-domain.com",
    },
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
}
