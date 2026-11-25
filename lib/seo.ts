import type { CategoryProduct } from "@/lib/api/categories"
import { productHref } from "@/lib/product-url"
import { SITE_URL } from "@/lib/site"

export function buyInLagosTitle(name: string) {
  return `Buy ${name} in Lagos`
}

export function buyInLagosDescription(name: string, count?: number) {
  const stock = count && count > 0 ? `${count} products in stock. ` : ""
  return `Buy ${name} at AlphaCom Online, Computer Village, Ikeja, Lagos. ${stock}Genuine products, warranty, and delivery across Nigeria.`
}

export function collectionJsonLd(name: string, url: string, products: CategoryProduct[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: buyInLagosTitle(name),
    url,
    isPartOf: { "@type": "WebSite", name: "AlphaCom Online", url: SITE_URL },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.slice(0, 24).map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE_URL}${productHref(product)}`,
        name: product.name,
      })),
    },
  }
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
