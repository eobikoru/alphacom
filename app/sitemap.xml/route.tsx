import { getBrandsFromCategories, type CategoryWithProducts } from "@/lib/api/categories"
import { SITE_URL } from "@/lib/site"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.alphacomonline.com"

async function shopMap(): Promise<{ aisles: { url: string; priority: number }[]; brands: string[] }> {
  try {
    const response = await fetch(`${API_BASE}/api/v1/categories/with-products`, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
    })
    if (!response.ok) return { aisles: [], brands: [] }
    const json = await response.json()
    const categories = (json.data ?? []) as CategoryWithProducts[]
    const aisles: { url: string; priority: number }[] = []
    for (const category of categories) {
      if (!category.slug) continue
      aisles.push({ url: `/categories/${category.slug}`, priority: 0.8 })
      for (const subcategory of category.subcategories ?? []) {
        if (!subcategory.slug) continue
        aisles.push({ url: `/categories/${category.slug}/${subcategory.slug}`, priority: 0.7 })
      }
    }
    return { aisles, brands: getBrandsFromCategories(categories) }
  } catch {
    return { aisles: [], brands: [] }
  }
}

export async function GET(): Promise<Response> {
  const baseUrl = SITE_URL
  const currentDate = new Date().toISOString()

  // Static pages with priorities and change frequencies
  const staticPages = [
    { url: "", priority: 1.0, changefreq: "daily", lastmod: currentDate },
    { url: "/about", priority: 0.8, changefreq: "monthly", lastmod: currentDate },
    { url: "/contact", priority: 0.8, changefreq: "monthly", lastmod: currentDate },
    { url: "/stores", priority: 0.7, changefreq: "weekly", lastmod: currentDate },
    { url: "/categories", priority: 0.9, changefreq: "daily", lastmod: currentDate },
    { url: "/products", priority: 0.9, changefreq: "daily", lastmod: currentDate },
    { url: "/privacy", priority: 0.3, changefreq: "yearly", lastmod: currentDate },
    { url: "/terms", priority: 0.3, changefreq: "yearly", lastmod: currentDate },
    { url: "/return-policy", priority: 0.4, changefreq: "monthly", lastmod: currentDate },
    { url: "/warranty", priority: 0.4, changefreq: "monthly", lastmod: currentDate },
    { url: "/promotion", priority: 0.8, changefreq: "weekly", lastmod: currentDate },
  ]

  const map = await shopMap()

  // Every brand we actually sell, so a search for that brand can find the shelf.
  const brandUrls = map.brands.map((brand) => ({
    url: `/brands/${encodeURIComponent(brand)}`,
    priority: 0.9,
    changefreq: "weekly" as const,
    lastmod: currentDate,
  }))

  const aisleUrls = map.aisles.map((aisle) => ({
    url: aisle.url,
    priority: aisle.priority,
    changefreq: "weekly" as const,
    lastmod: currentDate,
  }))

  const allUrls = [...staticPages, ...brandUrls, ...aisleUrls]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${allUrls
    .map(
      (page) => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <mobile:mobile/>
  </url>`,
    )
    .join("")}
</urlset>`

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}
