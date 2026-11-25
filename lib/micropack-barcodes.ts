/**
 * Barcodes taken from Micropack's in-stock sheet.
 * A product gets a barcode only when one number on that sheet fits it.
 * Color variants stay unmatched until the product name names the color.
 */
const RULES: { gtin: string; model: RegExp; color?: RegExp }[] = [
  { gtin: "6970517494293", model: /\b702W\b/i },
  { gtin: "6970517491292", model: /\bM101\b/i },
  { gtin: "6970517492473", model: /\bK203\b/i },
  { gtin: "6970517492572", model: /\bKM-236W\b/i },
  { gtin: "6970517496655", model: /\bAKM-240W\b/i },
  { gtin: "6970517494484", model: /\bMHP-01\b/i },
  { gtin: "6970517494620", model: /\bMHP-02\b/i },
  { gtin: "6970517491841", model: /\bBT-799W\b/i },
  { gtin: "6970517494903", model: /\bGP-800\b/i },
  { gtin: "6970517496150", model: /green laser|WPM-09G/i },
  { gtin: "6970517491360", model: /\bMP-716W\b/i, color: /\b(BK|BLACK)\b/i },
  { gtin: "6970517491384", model: /\bMP-716W\b/i, color: /\b(BL|BLUE)\b/i },
  { gtin: "6970517491377", model: /\bMP-716W\b/i, color: /\b(PK|PINK)\b/i },
  { gtin: "6970517494408", model: /\bMP-707B\b/i, color: /\b(BK|BLACK)\b/i },
  { gtin: "6970517494415", model: /\bMP-707B\b/i, color: /\b(WH|WHITE)\b/i },
  { gtin: "6970517491353", model: /\bMP-721W\b/i, color: /\b(GN|GREEN)\b/i },
  { gtin: "6970517491568", model: /\bMP-721W\b/i, color: /\b(PK|PINK)\b/i },
  { gtin: "6970517494569", model: /\bMHP-200B\b/i, color: /\b(BK|BLACK)\b/i },
  { gtin: "6970517495917", model: /\bMHP-200B\b/i, color: /\b(GD|GOLD)\b/i },
]

export function micropackGtin(product: { brand?: string | null; name: string }): string | undefined {
  const label = `${product.brand || ""} ${product.name}`
  if (!/micropack/i.test(label)) return undefined
  const hits = RULES.filter((rule) => rule.model.test(product.name) && (!rule.color || rule.color.test(product.name)))
  return hits.length === 1 ? hits[0].gtin : undefined
}
