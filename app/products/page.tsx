import type { Metadata } from "next"
import Link from "next/link"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { AppLayout } from "@/components/app-layout"
import { fetchCataloguePage } from "@/lib/server/catalogue"
import { cdnImage } from "@/lib/image-url"
import { productHref } from "@/lib/product-url"
import { SITE_URL } from "@/lib/site"

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { search?: string; page?: string }
}): Promise<Metadata> {
  if (searchParams.search || searchParams.page) {
    return { title: "All products", robots: { index: false, follow: true } }
  }
  return {
    title: "Buy electronics in Lagos",
    description:
      "Shop every product AlphaCom sells at Computer Village, Ikeja, Lagos. Genuine products, warranty, and delivery across Nigeria.",
    alternates: { canonical: `${SITE_URL}/products` },
    robots: { index: true, follow: true },
  }
}

function naira(amount: number) {
  return `₦${amount.toLocaleString("en-NG")}`
}

export default async function ProductsPage({ searchParams }: { searchParams: { search?: string; page?: string } }) {
  const search = searchParams.search?.trim() || ""
  const page = Math.max(1, Number(searchParams.page) || 1)
  const catalogue = await fetchCataloguePage(search, page)
  const products = catalogue.data ?? []
  const pagination = catalogue.pagination

  return (
    <AppLayout>
      <div className="bg-background">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-semibold text-foreground">All products</h1>
          <p className="mt-1 text-sm text-muted-foreground">The full Alphacom catalogue.</p>
          <form action="/products" className="mt-4 flex max-w-md gap-2">
            <input
              name="search"
              defaultValue={search}
              placeholder="Search products"
              className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
            />
            <button type="submit" className="h-10 rounded-md bg-[#8E1B2C] px-4 text-sm text-white">
              Search
            </button>
          </form>

          {products.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">No products found.</p>
          ) : (
            <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((product, index) => (
                <li key={product.id} className="flex flex-col rounded-lg border bg-card p-2">
                  <Link href={productHref(product)}>
                    <span className="relative mb-2 block">
                      <img
                        src={cdnImage(product.main_image, 400) || "/placeholder.svg"}
                        alt={product.name}
                        width={400}
                        height={300}
                        loading={index < 4 ? "eager" : "lazy"}
                        className="h-28 w-full rounded-md bg-white object-contain sm:h-36"
                      />
                      <span className="absolute bottom-1 left-1 rounded bg-white px-1.5 py-0.5 text-sm font-semibold text-neutral-950">
                        {naira(product.price)}
                      </span>
                    </span>
                    <h2 className="line-clamp-2 text-sm font-medium leading-snug">{product.name}</h2>
                  </Link>
                  <p className="mt-1 text-xs text-muted-foreground">{product.in_stock ? "In stock" : "Out of stock"}</p>
                  <div className="mt-2">
                    <AddToCartButton product={product} />
                  </div>
                </li>
              ))}
            </ul>
          )}

          {pagination && pagination.total_pages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-3 text-sm">
              {pagination.has_prev ? (
                <Link className="rounded border px-3 py-2" href={`/products?search=${encodeURIComponent(search)}&page=${page - 1}`}>
                  Previous
                </Link>
              ) : null}
              <span className="text-muted-foreground">
                Page {pagination.page} of {pagination.total_pages}
              </span>
              {pagination.has_next ? (
                <Link className="rounded border px-3 py-2" href={`/products?search=${encodeURIComponent(search)}&page=${page + 1}`}>
                  Next
                </Link>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
