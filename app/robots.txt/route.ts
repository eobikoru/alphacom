import { SITE_URL } from "@/lib/site"

export function GET(): Response {
  const robotsTxt = `User-agent: *
Allow: /

Disallow: /admin/
Disallow: /api/
Disallow: /checkout/
Disallow: /cart/
Disallow: /auth/
Disallow: /user/
Disallow: /account/
Disallow: /_next/
Disallow: /static/
Disallow: /tmp/
Disallow: /search?*
Disallow: /*?sort=*
Disallow: /*?filter=*
Disallow: /*?page=*

Allow: /categories/
Allow: /products/
Allow: /brands/
Allow: /sitemap.xml
Allow: /sitemap-products.xml
Allow: /product-feed.xml

Disallow: /*.json$
Disallow: /*.log$

Sitemap: ${SITE_URL}/sitemap.xml
Sitemap: ${SITE_URL}/sitemap-products.xml
Sitemap: ${SITE_URL}/product-feed.xml
`

  return new Response(robotsTxt, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400",
    },
  })
}
