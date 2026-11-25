import Link from "next/link"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { AppLayout } from "@/components/app-layout"
import type { Product } from "@/lib/api/products"
import { cdnImage } from "@/lib/image-url"
import { productHref } from "@/lib/product-url"
import { SEO_BRANDS, SITE_URL } from "@/lib/site"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.alphacomonline.com"

function canonicalBrand(slug: string) {
  const decoded = decodeURIComponent(slug)
  return SEO_BRANDS.find((brand) => brand.slug.toLowerCase() === decoded.toLowerCase())?.name ?? decoded
}

async function fetchBrandProducts(name: string): Promise<Product[]> {
  const products: Product[] = []
  let page = 1
  let totalPages = 1
  while (page <= totalPages && page <= 10) {
    const response = await fetch(
      `${API_BASE}/api/v1/products/with-categories?search=${encodeURIComponent(name)}&per_page=100&page=${page}`,
      { next: { revalidate: 3600 }, headers: { Accept: "application/json" } },
    )
    if (!response.ok) break
    const json = await response.json()
    products.push(...((json.data ?? []) as Product[]))
    totalPages = json.pagination?.total_pages ?? 1
    page += 1
  }
  return products
}

function naira(amount: number) {
  return `₦${amount.toLocaleString("en-NG")}`
}

function shelfJsonLd(brandName: string, products: Product[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${brandName} products`,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}${productHref(product)}`,
      item: {
        "@type": "Product",
        name: product.name,
        image: product.main_image || undefined,
        brand: { "@type": "Brand", name: product.brand || brandName },
        offers: {
          "@type": "Offer",
          priceCurrency: "NGN",
          price: product.price,
          availability: product.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          url: `${SITE_URL}${productHref(product)}`,
        },
      },
    })),
  }
}

export default async function BrandPage({ params }: { params: { brand: string } }) {
  const brandName = canonicalBrand(params.brand)
  const products = await fetchBrandProducts(brandName)
  const isMicropack = brandName.toLowerCase() === "micropack"

  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(shelfJsonLd(brandName, products)) }} />
    <AppLayout>
      <div className="bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="mb-3">
            <h1 className="text-lg font-semibold text-foreground">{brandName}</h1>
            <p className="text-sm text-muted-foreground">
              {isMicropack
                ? "AlphaCom is the authorized partner and official importer of Micropack in Nigeria."
                : `${products.length} products`}
            </p>
          </div>

          {products.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">No products found for this brand.</p>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((product, index) => (
                <li key={product.id} className="flex flex-col rounded-lg border bg-card p-2">
                  <Link href={productHref(product)} className="block">
                    <span className="relative mb-2 block">
                      <img
                        src={cdnImage(product.main_image, 400) || "/placeholder.svg"}
                        alt={product.name}
                        width={400}
                        height={300}
                        loading={index < 4 ? "eager" : "lazy"}
                        fetchPriority={index < 2 ? "high" : "auto"}
                        decoding="async"
                        className="h-28 w-full rounded-md bg-white object-contain sm:h-36"
                      />
                      <span className="absolute bottom-1 left-1 rounded bg-white px-1.5 py-0.5 text-sm font-semibold text-neutral-950">
                        {naira(product.price)}
                      </span>
                    </span>
                    <h2 className="line-clamp-2 text-sm font-medium leading-snug text-foreground">{product.name}</h2>
                  </Link>
                  <p className="mt-1 text-xs text-muted-foreground">{product.in_stock ? "In stock" : "Out of stock"}</p>
                  <div className="mt-2">
                    <AddToCartButton product={product} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AppLayout>
    </>
  )
}
