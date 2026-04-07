import { getProductsWithCategories, type Product } from "@/lib/api/products"
import { SITE_URL } from "@/lib/site"

const MAX_PRODUCTS = 5000
const PAGE_SIZE = 100

const xmlEscape = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")

const stripHtml = (value: string): string => value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()

const toAbsoluteImage = (image: string | null): string => {
  if (!image) return `${SITE_URL}/placeholder.svg`
  if (image.startsWith("http://") || image.startsWith("https://")) return image
  return image.startsWith("/") ? `${SITE_URL}${image}` : `${SITE_URL}/${image}`
}

async function getAllProducts(): Promise<Product[]> {
  const allProducts: Product[] = []
  let page = 1
  let totalPages = 1

  while (page <= totalPages && allProducts.length < MAX_PRODUCTS) {
    const response = await getProductsWithCategories({ page, per_page: PAGE_SIZE })
    allProducts.push(...response.data)
    totalPages = response.pagination.total_pages
    page += 1
  }

  return allProducts.slice(0, MAX_PRODUCTS)
}

function productToItemXml(product: Product): string {
  const description = stripHtml(product.short_description || product.description || product.name)
  const productLink = `${SITE_URL}/products/id/${encodeURIComponent(product.id)}`
  const imageLink = toAbsoluteImage(product.main_image)
  const availability = product.in_stock ? "in stock" : "out of stock"
  const price = `${product.price.toFixed(2)} ${product.currency}`
  const salePrice =
    product.original_price > product.price ? `\n      <g:sale_price>${xmlEscape(price)}</g:sale_price>` : ""

  return `    <item>
      <g:id>${xmlEscape(product.id)}</g:id>
      <title>${xmlEscape(product.name)}</title>
      <description>${xmlEscape(description)}</description>
      <link>${xmlEscape(productLink)}</link>
      <g:image_link>${xmlEscape(imageLink)}</g:image_link>
      <g:availability>${availability}</g:availability>
      <g:condition>new</g:condition>
      <g:price>${xmlEscape(price)}</g:price>${salePrice}
      <g:brand>${xmlEscape(product.brand || "AlphaCom")}</g:brand>
      <g:product_type>${xmlEscape(product.category?.name || "General")}</g:product_type>
      <g:identifier_exists>${product.sku ? "yes" : "no"}</g:identifier_exists>
      ${product.sku ? `<g:mpn>${xmlEscape(product.sku)}</g:mpn>` : ""}
    </item>`
}

export async function GET(): Promise<Response> {
  try {
    const products = await getAllProducts()

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>AlphaCom Product Feed</title>
    <link>${SITE_URL}</link>
    <description>Google Merchant Center feed for AlphaCom products</description>
${products.map(productToItemXml).join("\n")}
  </channel>
</rss>`

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    })
  } catch {
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>AlphaCom Product Feed</title>
    <link>${SITE_URL}</link>
    <description>Google Merchant Center feed for AlphaCom products</description>
  </channel>
</rss>`

    return new Response(fallbackXml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=300, s-maxage=300",
      },
    })
  }
}
