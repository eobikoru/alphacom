import type { Metadata } from "next"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { AppLayout } from "@/components/app-layout"
import { getBrandsFromCategories } from "@/lib/api/categories"
import { fetchCategoriesWithProducts } from "@/lib/server/catalogue"
import { SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
  title: "Shop by category in Lagos",
  description:
    "Browse every product AlphaCom sells in Computer Village, Ikeja, Lagos. Each aisle has its own page, with photos and prices.",
  alternates: { canonical: `${SITE_URL}/categories` },
  robots: { index: true, follow: true },
}

function groupBrands(brands: string[]) {
  const groups = new Map<string, string[]>()
  for (const brand of brands) {
    const first = brand.trim().charAt(0).toUpperCase()
    const letter = /[A-Z]/.test(first) ? first : "#"
    const list = groups.get(letter) ?? []
    list.push(brand)
    groups.set(letter, list)
  }
  return Array.from(groups.entries())
}

export default async function CategoriesPage() {
  const categories = await fetchCategoriesWithProducts()
  const brands = getBrandsFromCategories(categories)
  const brandGroups = groupBrands(brands)

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto max-w-5xl px-4 py-10 sm:py-14">
          <div className="mb-8 flex items-end justify-between gap-6 border-b border-border pb-5">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#8E1B2C]">Browse</p>
              <h1 className="mt-2 text-3xl font-medium tracking-tight text-foreground sm:text-4xl">Shop by category</h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                Every aisle in the shop, in Computer Village, Lagos.
              </p>
            </div>
            <p className="shrink-0 text-sm tabular-nums text-muted-foreground">{categories.length}</p>
          </div>

          <ul className="grid md:grid-cols-2 md:gap-x-16">
            {categories.map((category) => (
              <li key={category.id} className="border-b border-border">
                <Link href={`/categories/${category.slug}`} className="group flex items-baseline justify-between gap-6 py-4">
                  <span className="text-[15px] font-medium text-foreground transition-colors group-hover:text-[#8E1B2C]">
                    {category.name}
                  </span>
                  <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                    {category.total_product_count} {category.total_product_count === 1 ? "product" : "products"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {brands.length > 0 && (
            <section className="mt-16 sm:mt-20">
              <div className="mb-8 flex items-end justify-between gap-6 border-b border-border pb-5">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#8E1B2C]">Browse</p>
                  <h2 className="mt-2 text-3xl font-medium tracking-tight text-foreground sm:text-4xl">Shop by brand</h2>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">Find products from the brands we stock.</p>
                </div>
                <p className="shrink-0 text-sm tabular-nums text-muted-foreground">{brands.length}</p>
              </div>
              <div className="columns-2 gap-x-10 sm:columns-3 lg:columns-4">
                {brandGroups.map(([letter, names]) => (
                  <div key={letter} className="mb-8 break-inside-avoid">
                    <p className="border-b border-border pb-2 text-xs font-medium tracking-[0.2em] text-[#8E1B2C]">{letter}</p>
                    <ul className="mt-3 space-y-2">
                      {names.map((brand) => (
                        <li key={brand}>
                          <Link href={`/brands/${encodeURIComponent(brand)}`} className="text-sm text-foreground transition-colors hover:text-[#8E1B2C]">
                            {brand}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="mt-10 px-0 sm:mt-16">
            <div className="rounded-2xl border border-border bg-gradient-to-r from-muted to-accent p-4 sm:rounded-3xl sm:p-8">
              <div className="text-center">
                <h2 className="mb-2 text-base font-semibold text-foreground sm:mb-4 sm:text-xl">Can&apos;t find what you&apos;re looking for?</h2>
                <p className="mb-4 text-sm text-muted-foreground sm:mb-6 sm:text-lg">Contact our expert team for personalized recommendations</p>
                <Link
                  href="/contact"
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-purple-700 px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:from-cyan-700 hover:to-purple-800 active:scale-[0.98] sm:px-8 sm:py-3 sm:text-base"
                >
                  <span>Contact Us</span>
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
