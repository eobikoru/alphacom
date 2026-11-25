import type { Metadata } from "next"
import { CategoryPage } from "@/components/category-page"
import { AppLayout } from "@/components/app-layout"
import { fetchCategoriesWithProducts, productsInCategory } from "@/lib/server/catalogue"
import { breadcrumbJsonLd, buyInLagosDescription, buyInLagosTitle, collectionJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"

export async function generateMetadata({ params }: { params: { categoryId: string } }): Promise<Metadata> {
  const categories = await fetchCategoriesWithProducts()
  const { category, products } = productsInCategory(categories, params.categoryId)
  const name = category?.name ?? "Products"
  const title = buyInLagosTitle(name)
  const description = category?.description?.trim() || buyInLagosDescription(name, products.length)
  const url = `${SITE_URL}/categories/${category?.slug ?? params.categoryId}`
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: "AlphaCom Online", type: "website" },
    robots: { index: true, follow: true },
  }
}

export default async function CategoryPageWrapper({ params }: { params: { categoryId: string } }) {
  const categories = await fetchCategoriesWithProducts()
  const { category, products } = productsInCategory(categories, params.categoryId)
  const name = category?.name ?? "Products"
  const url = `${SITE_URL}/categories/${category?.slug ?? params.categoryId}`
  const jsonLd = [
    collectionJsonLd(name, url, products),
    breadcrumbJsonLd([
      { name: "Home", url: SITE_URL },
      { name: "Categories", url: `${SITE_URL}/categories` },
      { name, url },
    ]),
  ]
  return (
    <AppLayout>
      {jsonLd.map((entry) => (
        <script key={entry["@type"]} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }} />
      ))}
      <CategoryPage key={params.categoryId} categorySlug={params.categoryId} initialCategories={categories} />
    </AppLayout>
  )
}
