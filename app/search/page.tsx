"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { AppLayout } from "@/components/app-layout"
import { getCategoriesWithProducts, type CategoryWithProducts } from "@/lib/api/categories"
import { getProductsWithCategories, type Product } from "@/lib/api/products"
import { getCanonicalSearchQuery, SEO_BRANDS } from "@/lib/site"
import { FolderTree, Layers, ShoppingBag, Search } from "lucide-react"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const rawQ = (searchParams.get("q") || "").trim()
  const q = rawQ.toLowerCase()
  const canonicalQuery = getCanonicalSearchQuery(rawQ)
  const [categories, setCategories] = useState<CategoryWithProducts[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [productsLoading, setProductsLoading] = useState(false)

  const matchedCategories = useMemo(() => {
    if (!q) return []
    return categories.filter((c) => c.name.toLowerCase().includes(q))
  }, [categories, q])

  const matchedSubcategories = useMemo(() => {
    if (!q) return []
    const out: { name: string; slug: string; categorySlug: string }[] = []
    categories.forEach((cat) => {
      ;(cat.subcategories || []).forEach((sub) => {
        if (sub.name.toLowerCase().includes(q)) {
          out.push({ name: sub.name, slug: sub.slug, categorySlug: cat.slug })
        }
      })
    })
    return out
  }, [categories, q])

  useEffect(() => {
    getCategoriesWithProducts().then((res) => {
      if (res.success && res.data) setCategories(res.data)
    })
  }, [])

  useEffect(() => {
    if (!q) {
      setProducts([])
      return
    }
    setProductsLoading(true)
    const isBrandSearch = SEO_BRANDS.some((b) => b.slug.toLowerCase() === q)
    const fetchAll = async () => {
      const first = await getProductsWithCategories({ search: canonicalQuery, page: 1, per_page: 100 })
      if (!first.success || !first.data) return []
      const totalPages = first.pagination.total_pages
      if (totalPages <= 1) return first.data
      const rest = await Promise.all(
        Array.from({ length: totalPages - 1 }, (_, i) =>
          getProductsWithCategories({ search: canonicalQuery, page: i + 2, per_page: 100 })
        )
      )
      return [...first.data, ...rest.flatMap((r) => r.data)]
    }
    const fetchPage = () => getProductsWithCategories({ search: canonicalQuery, per_page: 24 }).then((r) => (r.success && r.data ? r.data : []))

    ;(isBrandSearch ? fetchAll() : fetchPage())
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setProductsLoading(false))
  }, [q, canonicalQuery])

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(price)

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <Search className="h-6 w-6" />
          Search results{q ? ` for "${SEO_BRANDS.some((b) => b.slug.toLowerCase() === q) ? canonicalQuery : rawQ}"` : ""}
        </h1>

        {!q ? (
          <p className="text-muted-foreground">Enter a search term in the header to find categories, subcategories, and products.</p>
        ) : (
          <div className="space-y-10">
            {matchedCategories.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <FolderTree className="h-5 w-5 text-muted-foreground" />
                  Categories
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {matchedCategories.map((c) => (
                    <li key={c.id}>
                      <Link
                        href={`/categories/${c.slug}`}
                        className="block p-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {matchedSubcategories.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Layers className="h-5 w-5 text-muted-foreground" />
                  Subcategories
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {matchedSubcategories.map((s, i) => (
                    <li key={`${s.categorySlug}-${s.slug}-${i}`}>
                      <Link
                        href={`/categories/${s.categorySlug}/${s.slug}`}
                        className="block p-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
                      >
                        {s.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                Products
              </h2>
              {productsLoading ? (
                <p className="text-muted-foreground">Loading products...</p>
              ) : products.length === 0 ? (
                <p className="text-muted-foreground">No products found.</p>
              ) : (
                <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {products.map((p) => (
                    <li key={p.id}>
                      <Link
                        href={`/products/id/${p.id}`}
                        className="block rounded-lg border border-border bg-card overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="aspect-square bg-muted relative">
                          {p.main_image && (
                            <img src={p.main_image} alt={p.name} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="p-3">
                          <p className="font-medium text-sm line-clamp-2">{p.name}</p>
                          <p className="text-primary font-semibold mt-1">{formatPrice(p.price)}</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {!productsLoading && matchedCategories.length === 0 && matchedSubcategories.length === 0 && products.length === 0 && (
              <p className="text-muted-foreground">No results for &quot;{searchParams.get("q")}&quot;. Try different keywords.</p>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
