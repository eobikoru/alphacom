"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ArrowRight, ChevronLeft, ChevronRight, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useBlogCategories, useBlogPosts, useBlogTags } from "@/hooks/use-blog"
import {
  BlogCard,
  BlogCardSkeleton,
  BlogCompactCard,
  BlogFeaturedCard,
  BlogFeaturedSkeleton,
} from "@/components/blog/blog-card"
import { BlogSocialIcons } from "@/components/blog/blog-social"

const PER_PAGE = 12

function pageNumbers(current: number, total: number): Array<number | "…"> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: Array<number | "…"> = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  if (start > 2) pages.push("…")
  for (let p = start; p <= end; p++) pages.push(p)
  if (end < total - 1) pages.push("…")
  pages.push(total)
  return pages
}

const chipClass = (active: boolean) =>
  cn(
    "inline-flex h-9 shrink-0 items-center whitespace-nowrap rounded-full border px-4 text-sm font-medium transition-colors",
    active
      ? "border-foreground bg-foreground text-background"
      : "border-border bg-white text-foreground/80 hover:border-foreground/30 hover:text-foreground dark:bg-card",
  )

export function BlogListClient() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const page = Math.max(1, Number(searchParams.get("page")) || 1)
  const category = searchParams.get("category") ?? ""
  const tag = searchParams.get("tag") ?? ""
  const search = searchParams.get("search") ?? ""

  const [searchInput, setSearchInput] = useState(search)

  const updateParams = (updates: Record<string, string | number | null>) => {
    const next = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "" || (key === "page" && value === 1)) next.delete(key)
      else next.set(key, String(value))
    }
    const query = next.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  useEffect(() => {
    setSearchInput(search)
  }, [search])

  useEffect(() => {
    if (searchInput.trim() === search) return
    const timeout = window.setTimeout(() => updateParams({ search: searchInput.trim(), page: null }), 400)
    return () => window.clearTimeout(timeout)
  }, [searchInput])

  const { data, isLoading, isFetching, isError } = useBlogPosts({
    page,
    per_page: PER_PAGE,
    category: category || undefined,
    tag: tag || undefined,
    search: search || undefined,
  })
  const { data: categoriesData } = useBlogCategories()
  const { data: tagsData } = useBlogTags()

  const allPosts = [...(data?.data ?? [])].sort(
    (a, b) => new Date(b.published_at ?? 0).getTime() - new Date(a.published_at ?? 0).getTime(),
  )
  const hasFilters = !!(category || tag || search)
  const showFeatured = page === 1 && !hasFilters
  const lead = showFeatured ? allPosts[0] : undefined
  const rest = lead ? allPosts.slice(1) : allPosts
  const picks = lead ? rest.slice(0, 4) : []
  const gridPosts = lead ? rest.slice(4) : rest
  const pagination = data?.pagination
  const categories = categoriesData?.data ?? []
  const tags = tagsData?.data ?? []
  const activeCategoryName = categories.find((item) => item.slug === category)?.name

  const goToPage = (next: number) => {
    updateParams({ page: next })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const clearFilters = () => {
    setSearchInput("")
    router.replace(pathname, { scroll: false })
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-white dark:bg-card">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="mx-auto max-w-7xl">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Link href="/" className="hover:text-foreground">
                Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="font-medium text-foreground">Blog</span>
            </nav>

            <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Alphacom Blog</h1>
                <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
                  Buying guides, tech tips and product news from our Computer Village team.
                </p>
                <BlogSocialIcons className="mt-4 flex-wrap" />
              </div>
              <label className="relative block w-full md:w-80">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search articles"
                  aria-label="Search articles"
                  className="h-11 w-full rounded-full border border-border bg-background pl-10 pr-4 text-sm outline-none transition focus:border-foreground/40 focus:ring-4 focus:ring-foreground/5"
                />
              </label>
            </div>

            <nav aria-label="Blog categories" className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1 no-scrollbar sm:mx-0 sm:flex-wrap sm:px-0">
              <button type="button" className={chipClass(!category)} onClick={() => updateParams({ category: null, page: null })}>
                All
              </button>
              {categories.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={chipClass(category === item.slug)}
                  onClick={() => updateParams({ category: item.slug, page: null })}
                >
                  {item.name}
                </button>
              ))}
            </nav>

            {tags.length > 0 && (
              <div className="-mx-4 mt-3 flex items-center gap-2 overflow-x-auto px-4 no-scrollbar sm:mx-0 sm:flex-wrap sm:px-0">
                <span className="shrink-0 text-xs font-medium text-muted-foreground">Topics:</span>
                {tags.map((item) => (
                  <button
                    key={item.slug}
                    type="button"
                    onClick={() => updateParams({ tag: tag === item.slug ? null : item.slug, page: null })}
                    className={cn(
                      "shrink-0 rounded-md px-2 py-1 text-xs transition-colors",
                      tag === item.slug
                        ? "bg-foreground font-medium text-background"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    #{item.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-20 pt-8 sm:pt-10">
        <div className="mx-auto max-w-7xl">
          {hasFilters && (
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-white px-4 py-3 dark:bg-card">
              <p className="text-sm text-muted-foreground">
                {pagination ? (
                  <>
                    <span className="font-semibold text-foreground">{pagination.total}</span>{" "}
                    {pagination.total === 1 ? "article" : "articles"}
                    {activeCategoryName && (
                      <>
                        {" "}
                        in <span className="font-medium text-foreground">{activeCategoryName}</span>
                      </>
                    )}
                    {tag && (
                      <>
                        {" "}
                        tagged <span className="font-medium text-foreground">#{tag}</span>
                      </>
                    )}
                    {search && (
                      <>
                        {" "}
                        matching <span className="font-medium text-foreground">“{search}”</span>
                      </>
                    )}
                  </>
                ) : (
                  "Searching…"
                )}
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1 text-sm font-medium text-foreground hover:underline"
              >
                <X className="h-4 w-4" />
                Clear filters
              </button>
            </div>
          )}

          {isLoading ? (
            <>
              {showFeatured && <BlogFeaturedSkeleton />}
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <BlogCardSkeleton key={i} />
                ))}
              </div>
            </>
          ) : isError ? (
            <EmptyState title="We couldn't load articles" body="Please check your connection and try again shortly." />
          ) : allPosts.length === 0 ? (
            <EmptyState
              title="No articles found"
              body={hasFilters ? "Try a different search or category." : "New articles are on their way."}
              action={hasFilters ? { label: "View all articles", onClick: clearFilters } : undefined}
            />
          ) : (
            <div className={cn("transition-opacity", isFetching && "opacity-60")}>
              {lead && <BlogFeaturedCard post={lead} />}

              {picks.length > 0 && (
                <section className="mt-12 sm:mt-14">
                  <SectionHeading title="Editor's picks" />
                  <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
                    {picks.map((post) => (
                      <BlogCompactCard key={post.id} post={post} />
                    ))}
                  </div>
                </section>
              )}

              {gridPosts.length > 0 && (
                <section className={lead ? "mt-12 sm:mt-14" : undefined}>
                  {lead && <SectionHeading title="Latest articles" />}
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {gridPosts.map((post) => (
                      <BlogCard key={post.id} post={post} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}

          {pagination && pagination.total_pages > 1 && (
            <nav className="mt-12 flex items-center justify-between gap-3" aria-label="Pagination">
              <button
                type="button"
                onClick={() => goToPage(page - 1)}
                disabled={!pagination.has_prev}
                className="inline-flex h-10 items-center gap-1 rounded-full border border-border bg-white px-4 text-sm font-medium transition hover:border-foreground/30 disabled:pointer-events-none disabled:opacity-40 dark:bg-card"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <p className="text-sm text-muted-foreground sm:hidden">
                Page {page} of {pagination.total_pages}
              </p>
              <div className="hidden items-center gap-1 sm:flex">
                {pageNumbers(page, pagination.total_pages).map((item, i) =>
                  item === "…" ? (
                    <span key={`gap-${i}`} className="px-2 text-muted-foreground">
                      …
                    </span>
                  ) : (
                    <button
                      key={item}
                      type="button"
                      onClick={() => goToPage(item)}
                      aria-current={item === page ? "page" : undefined}
                      className={cn(
                        "h-10 min-w-10 rounded-full px-3 text-sm font-medium transition",
                        item === page ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      {item}
                    </button>
                  ),
                )}
              </div>
              <button
                type="button"
                onClick={() => goToPage(page + 1)}
                disabled={!pagination.has_next}
                className="inline-flex h-10 items-center gap-1 rounded-full border border-border bg-white px-4 text-sm font-medium transition hover:border-foreground/30 disabled:pointer-events-none disabled:opacity-40 dark:bg-card"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </nav>
          )}

          <ShopBand />
        </div>
      </main>
    </div>
  )
}

export function SectionHeading({ title, action }: { title: string; action?: { label: string; href: string } }) {
  return (
    <div className="mb-5 flex items-center justify-between gap-4 sm:mb-6">
      <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2>
      {action && (
        <Link href={action.href} className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
          {action.label}
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  )
}

function EmptyState({
  title,
  body,
  action,
}: {
  title: string
  body: string
  action?: { label: string; onClick: () => void }
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-white px-6 py-16 text-center dark:bg-card">
      <p className="text-lg font-semibold">{title}</p>
      <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="mt-6 inline-flex h-10 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background transition hover:opacity-90"
        >
          {action.label}
          <ArrowRight className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

export function ShopBand() {
  return (
    <section className="mt-16 flex flex-col items-start gap-5 rounded-2xl bg-gray-950 px-6 py-8 text-white sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:py-10">
      <div>
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Shop the tech we write about</h2>
        <p className="mt-1.5 max-w-lg text-sm text-white/70">
          Genuine products, full warranty and nationwide delivery from Computer Village, Lagos.
        </p>
      </div>
      <Link
        href="/categories"
        className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-white px-6 text-sm font-medium text-gray-950 transition hover:bg-gray-100"
      >
        Shop now
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  )
}
