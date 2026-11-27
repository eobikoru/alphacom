import type { CategoryProduct, CategoryWithProducts } from "@/lib/api/categories"
import type { FeaturedProduct, Product, ProductSearchHit, ProductsResponse } from "@/lib/api/products"
import { getCanonicalSearchQuery, SEO_BRANDS } from "@/lib/site"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.alphacomonline.com"

async function getJson<T>(path: string, revalidate = 3600): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      ...(revalidate > 0 ? { next: { revalidate } } : { cache: "no-store" as const }),
      headers: { Accept: "application/json" },
    })
    if (!response.ok) return null
    return (await response.json()) as T
  } catch {
    return null
  }
}

export async function fetchCategoriesWithProducts(): Promise<CategoryWithProducts[]> {
  // Do not cache this. An empty reply while the API is down was saved for an hour and Shop by Category stayed blank.
  const json = await getJson<{ data?: CategoryWithProducts[] }>("/api/v1/categories/with-products", 0)
  return json?.data ?? []
}

export async function fetchFeaturedProducts(limit = 8): Promise<FeaturedProduct[]> {
  const json = await getJson<{ data?: FeaturedProduct[] }>(`/api/v1/products/featured?limit=${limit}`)
  return json?.data ?? []
}

export function collectAllProducts(categories: CategoryWithProducts[]): CategoryProduct[] {
  const byId = new Map<string, CategoryProduct>()
  for (const category of categories) {
    for (const product of category.direct_products || []) byId.set(product.id, product)
    for (const subcategory of category.subcategories || []) {
      for (const product of subcategory.products || []) byId.set(product.id, product)
    }
  }
  return Array.from(byId.values())
}

export function productsInCategory(categories: CategoryWithProducts[], categorySlug: string) {
  const category = categories.find((item) => item.slug === categorySlug) ?? null
  const products: CategoryProduct[] = []
  for (const subcategory of category?.subcategories || []) {
    products.push(...(subcategory.products || []))
  }
  return { category, products }
}

function toCatalogueProduct(hit: {
  id: string
  name: string
  slug: string
  brand: string | null
  price: number
  original_price: number | null
  discount_percentage: number | null
  currency: string
  main_image: string | null
  images: string[]
  in_stock: boolean
  stock_status: string
}): Product {
  return {
    id: hit.id,
    name: hit.name,
    slug: hit.slug,
    sku: "",
    brand: hit.brand,
    price: hit.price,
    original_price: hit.original_price ?? hit.price,
    discount_percentage: hit.discount_percentage ?? 0,
    currency: hit.currency || "NGN",
    main_image: hit.main_image,
    images: hit.images ?? [],
    category: { id: "", name: "", slug: "" },
    subcategory_id: null,
    in_stock: hit.in_stock,
    stock_quantity: 0,
    stock_status: hit.stock_status,
    description: "",
    short_description: null,
  }
}

const emptyPage = (perPage: number): ProductsResponse => ({
  success: true,
  message: "",
  data: [],
  pagination: { page: 1, per_page: perPage, total: 0, total_pages: 1, has_next: false, has_prev: false },
})

export async function fetchCataloguePage(search = "", page = 1): Promise<ProductsResponse> {
  const query = search.trim()
  if (!query) {
    const json = await getJson<ProductsResponse>(`/api/v1/products/with-categories?page=${page}&per_page=12`)
    return json ?? emptyPage(12)
  }

  const canonical = getCanonicalSearchQuery(query)
  const first = await getJson<ProductsResponse>(
    `/api/v1/products/search?q=${encodeURIComponent(canonical)}&page=${page}&per_page=20`,
  )
  if (!first) return emptyPage(20)
  return { ...first, data: (first.data ?? []).map((hit) => toCatalogueProduct(hit as never)) }
}

export async function fetchSearchHits(query: string): Promise<ProductSearchHit[]> {
  const canonical = getCanonicalSearchQuery(query.trim())
  if (!canonical) return []
  const first = await getJson<{ data?: ProductSearchHit[]; pagination?: { total_pages?: number } }>(
    `/api/v1/products/search?q=${encodeURIComponent(canonical)}&page=1&per_page=20`,
  )
  const hits = first?.data ?? []
  const isBrand = SEO_BRANDS.some((brand) => brand.slug.toLowerCase() === query.trim().toLowerCase())
  const totalPages = Math.min(first?.pagination?.total_pages ?? 1, 10)
  if (!isBrand || totalPages <= 1) return hits
  const rest = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) =>
      getJson<{ data?: ProductSearchHit[] }>(
        `/api/v1/products/search?q=${encodeURIComponent(canonical)}&page=${index + 2}&per_page=20`,
      ),
    ),
  )
  return [...hits, ...rest.flatMap((page) => page?.data ?? [])]
}
