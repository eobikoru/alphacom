const PRODUCT_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function isProductId(value: string): boolean {
  return PRODUCT_ID_PATTERN.test(value)
}

/** Public URL for a product. Falls back to the legacy ID route, which redirects to the slug URL. */
export function productHref(product: { id: string; slug?: string | null }): string {
  if (product.slug) return `/products/${encodeURIComponent(product.slug)}`
  return `/products/id/${encodeURIComponent(product.id)}`
}
