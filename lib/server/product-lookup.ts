import "server-only"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.alphacomonline.com"
const PAGE_SIZE = 100
const MAX_PAGES = 100
const INDEX_TTL_MS = 10 * 60 * 1000
// A slug that is missing from a fresh index only triggers a rebuild after this delay, so unknown URLs can't hammer the API.
const MISS_REFRESH_MIN_AGE_MS = 60 * 1000

export interface ProductSummary {
  id: string
  slug: string
  name: string
  description: string
  image: string | null
  inStock: boolean
}

interface ApiProduct {
  id: string
  slug: string
  name: string
  short_description?: string | null
  description?: string | null
  main_image?: string | null
  in_stock?: boolean
}

interface ProductIndex {
  bySlug: Map<string, ProductSummary>
  builtAt: number
}

let index: ProductIndex | null = null
let building: Promise<ProductIndex> | null = null

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()

function toSummary(product: ApiProduct): ProductSummary {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: stripHtml(product.short_description || product.description || "").slice(0, 300),
    image: product.main_image ?? null,
    inStock: product.in_stock ?? true,
  }
}

async function fetchJson(path: string) {
  const response = await fetch(`${API_BASE}${path}`, { cache: "no-store", headers: { Accept: "application/json" } })
  if (!response.ok) throw new Error(`Product API ${path} responded ${response.status}`)
  return response.json()
}

async function buildIndex(): Promise<ProductIndex> {
  const bySlug = new Map<string, ProductSummary>()
  for (let page = 1; page <= MAX_PAGES; page++) {
    const json = await fetchJson(`/api/v1/products/with-categories?page=${page}&per_page=${PAGE_SIZE}`)
    for (const product of (json.data ?? []) as ApiProduct[]) {
      if (product.slug) bySlug.set(product.slug, toSummary(product))
    }
    if (!json.pagination?.has_next) break
  }
  return { bySlug, builtAt: Date.now() }
}

async function getIndex(forceRefresh = false): Promise<ProductIndex> {
  const isFresh = index && Date.now() - index.builtAt < INDEX_TTL_MS
  if (index && isFresh && !forceRefresh) return index

  if (!building) {
    building = buildIndex()
      .then((built) => {
        index = built
        return built
      })
      .finally(() => {
        building = null
      })
  }

  // Serve the previous index while a background refresh runs, unless nothing has been built yet.
  if (index && !forceRefresh) return index
  try {
    return await building
  } catch (error) {
    if (index) return index
    throw error
  }
}

export async function findProductBySlug(slug: string): Promise<ProductSummary | null> {
  const current = await getIndex()
  const hit = current.bySlug.get(slug)
  if (hit) return hit

  if (Date.now() - current.builtAt < MISS_REFRESH_MIN_AGE_MS) return null
  const refreshed = await getIndex(true)
  return refreshed.bySlug.get(slug) ?? null
}

export async function findProductById(id: string): Promise<ProductSummary | null> {
  try {
    const json = await fetchJson(`/api/v1/products/${encodeURIComponent(id)}`)
    return json?.data?.slug ? toSummary(json.data as ApiProduct) : null
  } catch {
    return null
  }
}

export async function getAllProductSummaries(): Promise<ProductSummary[]> {
  const current = await getIndex()
  return [...current.bySlug.values()]
}
