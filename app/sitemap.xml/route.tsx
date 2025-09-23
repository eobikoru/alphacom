export async function GET(): Promise<Response> {
  const baseUrl = "https://your-domain.com"
  const currentDate = new Date().toISOString()

  // Static pages with priorities and change frequencies
  const staticPages = [
    { url: "", priority: 1.0, changefreq: "daily", lastmod: currentDate },
    { url: "/about", priority: 0.8, changefreq: "monthly", lastmod: currentDate },
    { url: "/contact", priority: 0.8, changefreq: "monthly", lastmod: currentDate },
    { url: "/stores", priority: 0.7, changefreq: "weekly", lastmod: currentDate },
    { url: "/categories", priority: 0.9, changefreq: "daily", lastmod: currentDate },
    { url: "/privacy", priority: 0.3, changefreq: "yearly", lastmod: currentDate },
    { url: "/terms", priority: 0.3, changefreq: "yearly", lastmod: currentDate },
    { url: "/return-policy", priority: 0.4, changefreq: "monthly", lastmod: currentDate },
    { url: "/warranty", priority: 0.4, changefreq: "monthly", lastmod: currentDate },
  ]

  // Dynamic category pages
  const categories = [
    { slug: "electronics", priority: 0.9, changefreq: "daily" },
    { slug: "computers", priority: 0.9, changefreq: "daily" },
    { slug: "smartphones", priority: 0.9, changefreq: "daily" },
    { slug: "fashion", priority: 0.8, changefreq: "weekly" },
    { slug: "home-garden", priority: 0.8, changefreq: "weekly" },
    { slug: "sports", priority: 0.7, changefreq: "weekly" },
    { slug: "books", priority: 0.6, changefreq: "weekly" },
    { slug: "automotive", priority: 0.7, changefreq: "weekly" },
    { slug: "health-beauty", priority: 0.7, changefreq: "weekly" },
    { slug: "toys-games", priority: 0.6, changefreq: "weekly" },
  ]

  const categoryUrls = categories.map((cat) => ({
    url: `/categories/${cat.slug}`,
    priority: cat.priority,
    changefreq: cat.changefreq,
    lastmod: currentDate,
  }))

  // Subcategory pages
  const subcategories = [
    { category: "electronics", subcategory: "laptops", priority: 0.8 },
    { category: "electronics", subcategory: "tablets", priority: 0.8 },
    { category: "electronics", subcategory: "headphones", priority: 0.7 },
    { category: "computers", subcategory: "desktops", priority: 0.8 },
    { category: "computers", subcategory: "accessories", priority: 0.7 },
    { category: "smartphones", subcategory: "android", priority: 0.8 },
    { category: "smartphones", subcategory: "iphone", priority: 0.8 },
    { category: "fashion", subcategory: "mens", priority: 0.7 },
    { category: "fashion", subcategory: "womens", priority: 0.7 },
    { category: "fashion", subcategory: "accessories", priority: 0.6 },
  ]

  const subcategoryUrls = subcategories.map((sub) => ({
    url: `/categories/${sub.category}/${sub.subcategory}`,
    priority: sub.priority,
    changefreq: "weekly",
    lastmod: currentDate,
  }))

  // Combine all URLs
  const allUrls = [...staticPages, ...categoryUrls, ...subcategoryUrls]

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
