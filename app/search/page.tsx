import { Suspense } from "react"
import { SearchResults } from "@/components/search-results"
import { fetchCategoriesWithProducts, fetchSearchHits } from "@/lib/server/catalogue"

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q?.trim() || ""
  const [categories, products] = await Promise.all([
    fetchCategoriesWithProducts(),
    query ? fetchSearchHits(query) : Promise.resolve([]),
  ])

  return (
    <Suspense>
      <SearchResults key={query} initialQuery={query} initialCategories={categories} initialProducts={products} />
    </Suspense>
  )
}
