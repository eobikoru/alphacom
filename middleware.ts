import { NextResponse, type NextRequest } from "next/server"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.alphacomonline.com"
const PRODUCT_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function legacyProductId(pathname: string): string | null {
  const match = pathname.match(/^\/products\/(?:id\/)?([^/]+)\/?$/)
  if (!match) return null
  const candidate = decodeURIComponent(match[1])
  return PRODUCT_ID_PATTERN.test(candidate) ? candidate : null
}

export async function middleware(request: NextRequest) {
  const productId = legacyProductId(request.nextUrl.pathname)
  if (!productId) return NextResponse.next()

  try {
    const response = await fetch(`${API_BASE}/api/v1/products/${productId}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    })
    if (response.ok) {
      const json = await response.json()
      const slug: string | undefined = json?.data?.slug
      if (slug) {
        const target = request.nextUrl.clone()
        target.pathname = `/products/${encodeURIComponent(slug)}`
        return NextResponse.redirect(target, 308)
      }
    }
  } catch {
    // Fall through: the legacy page still renders the product by ID.
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/products/:path*"],
}
