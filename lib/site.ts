/** Canonical site URL for SEO, sitemaps, and Open Graph. */
export const SITE_URL = "https://alphacomonline.com"

/** Featured brands for SEO and sitemap (slug used in URL). Includes Aicon for search normalization. */
export const SEO_BRANDS = [
  { name: "Logitech", slug: "Logitech" },
  { name: "Anker", slug: "Anker" },
  { name: "Aicon", slug: "Aicon" },
  { name: "Micropack", slug: "Micropack" },
  { name: "SanDisk", slug: "SanDisk" },
] as const

/**
 * For API search: if the query matches a known brand (case-insensitive), return the canonical
 * brand name so the API returns all products (e.g. "logitech" → "Logitech").
 */
export function getCanonicalSearchQuery(query: string): string {
  const q = query.trim()
  if (!q) return q
  const found = SEO_BRANDS.find((b) => b.slug.toLowerCase() === q.toLowerCase())
  return found ? found.slug : q
}
