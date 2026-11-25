import { fetchCategoriesWithProducts } from "@/lib/server/catalogue"
import { SITE_URL } from "@/lib/site"

/** Tells Google the name of every aisle we sell, on every page. */
export async function CatalogueIndex() {
  const categories = await fetchCategoriesWithProducts()
  const itemListElement: { "@type": "ListItem"; position: number; name: string; url: string }[] = []
  for (const category of categories) {
    if (!category.slug || !category.name) continue
    itemListElement.push({
      "@type": "ListItem",
      position: itemListElement.length + 1,
      name: category.name,
      url: `${SITE_URL}/categories/${category.slug}`,
    })
    for (const subcategory of category.subcategories ?? []) {
      if (!subcategory.slug || !subcategory.name) continue
      itemListElement.push({
        "@type": "ListItem",
        position: itemListElement.length + 1,
        name: subcategory.name,
        url: `${SITE_URL}/categories/${category.slug}/${subcategory.slug}`,
      })
    }
  }
  if (!itemListElement.length) return null
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Products AlphaCom sells in Lagos",
    itemListElement,
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}
