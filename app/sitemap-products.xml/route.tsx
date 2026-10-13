import { SITE_URL } from "@/lib/site"
import { productHref } from "@/lib/product-url"
import { getAllProductSummaries, type ProductSummary } from "@/lib/server/product-lookup"

export const dynamic = "force-dynamic"

const xmlEscape = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")

const toAbsoluteImage = (image: string): string => {
  if (image.startsWith("http://") || image.startsWith("https://")) return image
  return image.startsWith("/") ? `${SITE_URL}${image}` : `${SITE_URL}/${image}`
}

function productToUrlXml(product: ProductSummary, lastmod: string): string {
  const image = product.image
    ? `
    <image:image>
      <image:loc>${xmlEscape(toAbsoluteImage(product.image))}</image:loc>
      <image:title>${xmlEscape(product.name)}</image:title>
    </image:image>`
    : ""

  return `
  <url>
    <loc>${xmlEscape(`${SITE_URL}${productHref(product)}`)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>${image}
  </url>`
}

export async function GET(): Promise<Response> {
  const lastmod = new Date().toISOString()
  let products: ProductSummary[] = []
  try {
    products = await getAllProductSummaries()
  } catch {
    products = []
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${products
    .map((product) => productToUrlXml(product, lastmod))
    .join("")}
</urlset>`

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": products.length ? "public, max-age=3600" : "public, max-age=300",
    },
  })
}
