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
 * Capitals, underscores, and hyphens are the same mark.
 * "USB_C", "usb-c", and "Usb-C" all fold to "usb-c".
 */
export function foldSearch(value: string): string {
  return value.toLowerCase().replace(/[_-]+/g, "-").replace(/\s+/g, " ").trim()
}

/** True when the product or aisle name contains the typed words, ignoring case, _ and -. */
export function searchIncludes(haystack: string, query: string): boolean {
  const folded = foldSearch(query)
  if (!folded) return false
  return foldSearch(haystack).includes(folded)
}

/**
 * For API search: underscores become hyphens, and a known brand is sent in its catalogue spelling
 * so the API returns all of that brand (e.g. "logitech" → "Logitech").
 */
export function getCanonicalSearchQuery(query: string): string {
  const q = query.trim().replace(/_+/g, "-").replace(/\s+/g, " ")
  if (!q) return q
  const found = SEO_BRANDS.find((b) => b.slug.toLowerCase() === q.toLowerCase())
  return found ? found.slug : q
}
