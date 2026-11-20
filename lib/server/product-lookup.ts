import "server-only"
import { cache } from "react"
import type { Product } from "@/lib/api/products"

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

function asProduct(raw: Record<string, unknown>): Product {
  const category = raw.category
  const categoryObject =
    category && typeof category === "object"
      ? (category as Product["category"])
      : { id: "", name: typeof category === "string" ? category : "", slug: "" }

  return {
    id: String(raw.id ?? ""),
    name: String(raw.name ?? ""),
    slug: String(raw.slug ?? ""),
    sku: String(raw.sku ?? ""),
    brand: typeof raw.brand === "string" ? raw.brand : null,
    price: Number(raw.price ?? 0),
    original_price: Number(raw.original_price ?? raw.price ?? 0),
    discount_percentage: Number(raw.discount_percentage ?? 0),
    currency: typeof raw.currency === "string" ? raw.currency : "NGN",
    main_image: typeof raw.main_image === "string" ? raw.main_image : null,
    images: Array.isArray(raw.images) ? raw.images.filter((image): image is string => typeof image === "string") : [],
    category: categoryObject,
    subcategory_id: typeof raw.subcategory_id === "string" ? raw.subcategory_id : null,
    in_stock: Boolean(raw.in_stock),
    stock_quantity: Number(raw.stock_quantity ?? 0),
    stock_status: typeof raw.stock_status === "string" ? raw.stock_status : raw.in_stock ? "In Stock" : "Out of Stock",
    description: typeof raw.description === "string" ? raw.description : "",
    short_description: typeof raw.short_description === "string" ? raw.short_description : null,
    promotion: asPromotion(raw.promotion),
  }
}

function asPromotion(value: unknown): Product["promotion"] {
  if (!value || typeof value !== "object") return null
  const raw = value as Record<string, unknown>
  const title = typeof raw.title === "string" ? raw.title : ""
  const html = typeof raw.html === "string" ? raw.html : ""
  const videoEmbedUrl = typeof raw.video_embed_url === "string" ? raw.video_embed_url : ""
  const videoUrl = typeof raw.video_url === "string" ? raw.video_url : ""
  const videoType = typeof raw.video_type === "string" ? raw.video_type : ""
  if (!title && !html && !videoEmbedUrl) return null
  return {
    id: String(raw.id ?? ""),
    title,
    html,
    video_url: videoUrl || null,
    video_embed_url: videoEmbedUrl || null,
    video_type: videoType || null,
  }
}

/** Full product for the public page. Deduped for metadata and the page render. */
export const fetchProductDetail = cache(async (id: string): Promise<Product | null> => {
  try {
    const json = await fetchJson(`/api/v1/products/${encodeURIComponent(id)}`)
    const raw = json?.data
    if (!raw?.id || !raw?.name) return null
    return asProduct(raw as Record<string, unknown>)
  } catch {
    return null
  }
})

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
