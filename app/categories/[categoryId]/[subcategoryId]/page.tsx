import type { Metadata } from "next"
import { CategoryPage } from "@/components/category-page"
import { AppLayout } from "@/components/app-layout"
import { fetchCategoriesWithProducts, productsInCategory } from "@/lib/server/catalogue"
import { breadcrumbJsonLd, buyInLagosDescription, buyInLagosTitle, collectionJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"

export async function generateMetadata({
  params,
}: {
  params: { categoryId: string; subcategoryId: string }
}): Promise<Metadata> {
  const categories = await fetchCategoriesWithProducts()
  const { category } = productsInCategory(categories, params.categoryId)
  const subcategory = category?.subcategories?.find((item) => item.slug === params.subcategoryId)
  const name = subcategory?.name ?? category?.name ?? "Products"
  const title = buyInLagosTitle(name)
  const description = subcategory?.description?.trim() || buyInLagosDescription(name, subcategory?.products?.length)
  const url = `${SITE_URL}/categories/${params.categoryId}/${params.subcategoryId}`
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: "AlphaCom Online", type: "website" },
    robots: { index: true, follow: true },
  }
}

export default async function SubcategoryPageWrapper({
  params,
}: {
  params: { categoryId: string; subcategoryId: string }
}) {
  const categories = await fetchCategoriesWithProducts()
  const { category } = productsInCategory(categories, params.categoryId)
  const subcategory = category?.subcategories?.find((item) => item.slug === params.subcategoryId)
  const name = subcategory?.name ?? category?.name ?? "Products"
  const url = `${SITE_URL}/categories/${params.categoryId}/${params.subcategoryId}`
  const jsonLd = [
    collectionJsonLd(name, url, subcategory?.products ?? []),
    breadcrumbJsonLd([
      { name: "Home", url: SITE_URL },
      { name: "Categories", url: `${SITE_URL}/categories` },
      { name: category?.name ?? "Category", url: `${SITE_URL}/categories/${params.categoryId}` },
      { name, url },
    ]),
  ]
  return (
    <AppLayout>
      {jsonLd.map((entry) => (
        <script key={entry["@type"]} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }} />
      ))}
      <CategoryPage
        key={`${params.categoryId}/${params.subcategoryId}`}
        categorySlug={params.categoryId}
        selectedSubcategory={params.subcategoryId}
        initialCategories={categories}
      />
    </AppLayout>
  )
}
