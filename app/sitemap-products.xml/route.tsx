export async function GET(): Promise<Response> {
  const baseUrl = "https://your-domain.com"
  const currentDate = new Date().toISOString()

  // In a real app, fetch from database
  const sampleProducts = [
    { id: "laptop-pro-15", name: 'Professional Laptop 15"', category: "computers", lastmod: currentDate },
    { id: "smartphone-x1", name: "Smartphone X1 Pro", category: "smartphones", lastmod: currentDate },
    { id: "wireless-headphones", name: "Premium Wireless Headphones", category: "electronics", lastmod: currentDate },
    { id: "gaming-chair", name: "Ergonomic Gaming Chair", category: "furniture", lastmod: currentDate },
    { id: "smart-watch", name: "Smart Fitness Watch", category: "electronics", lastmod: currentDate },
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${sampleProducts
    .map(
      (product) => `
  <url>
    <loc>${baseUrl}/products/${product.id}</loc>
    <lastmod>${product.lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <image:image>
      <image:loc>${baseUrl}/images/products/${product.id}/main.jpg</image:loc>
      <image:title>${product.name}</image:title>
      <image:caption>High-quality ${product.name} available at Premium Store</image:caption>
    </image:image>
  </url>`,
    )
    .join("")}
</urlset>`

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
