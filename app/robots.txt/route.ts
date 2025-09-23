export function GET(): Response {
  const robotsTxt = `# Premium Store - Robots.txt
# Generated on ${new Date().toISOString()}

# Allow all crawlers to access the site
User-agent: *
Allow: /

# Specific rules for major search engines
User-agent: Googlebot
Allow: /
Crawl-delay: 1
Request-rate: 1/1

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: Slurp
Allow: /
Crawl-delay: 2

User-agent: DuckDuckBot
Allow: /
Crawl-delay: 1

User-agent: Baiduspider
Allow: /
Crawl-delay: 2

# Block admin and sensitive areas
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

# Allow important directories
Allow: /categories/
Allow: /products/
Allow: /images/
Allow: /about/
Allow: /contact/
Allow: /stores/
Allow: /blog/

# Block specific file types
Disallow: /*.json$
Disallow: /*.xml$
Disallow: /*.txt$
Disallow: /*.log$

# Allow CSS and JS for better rendering
Allow: /*.css$
Allow: /*.js$

# Sitemap locations
Sitemap: https://your-domain.com/sitemap.xml
Sitemap: https://your-domain.com/sitemap-products.xml
Sitemap: https://your-domain.com/sitemap-categories.xml

# Host directive
Host: https://your-domain.com`

  return new Response(robotsTxt, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400",
    },
  })
}
