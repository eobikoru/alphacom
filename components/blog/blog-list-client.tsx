"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, ArrowRight, ArrowUpRight, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useBlogCategories, useBlogPosts, useBlogTags } from "@/hooks/use-blog"
import {
  BlogCard,
  BlogCardSkeleton,
  BlogHeroCard,
  BlogHeroSkeleton,
  EditorPickCard,
} from "@/components/blog/blog-card"

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

function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <div className={cn("animate-fade-in-up", className)} style={{ animationDelay: `${delay}ms`, animationDuration: "900ms" }}>
      {children}
    </div>
  )
}

export function BlogListClient() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const page = Math.max(1, Number(searchParams.get("page")) || 1)
  const category = searchParams.get("category") ?? ""
  const tag = searchParams.get("tag") ?? ""
  const search = searchParams.get("search") ?? ""

  const [searchInput, setSearchInput] = useState(search)
  const [today, setToday] = useState("")

  useEffect(() => {
    setToday(new Date().toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long", year: "numeric" }))
  }, [])

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
  const lead = page === 1 ? allPosts[0] : undefined
  const rest = lead ? allPosts.slice(1) : allPosts
  const featurePair = lead ? rest.slice(0, 4) : []
  const gridPosts = lead ? rest.slice(4) : rest
  const pagination = data?.pagination
  const categories = categoriesData?.data ?? []
  const tags = tagsData?.data ?? []
  const hasFilters = !!(category || tag || search)
  const total = pagination?.total ?? allPosts.length

  const goToPage = (next: number) => {
    updateParams({ page: next })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const clearFilters = () => {
    setSearchInput("")
    router.replace(pathname, { scroll: false })
  }

  const navLinkClass = (active: boolean) =>
    cn(
      "relative shrink-0 whitespace-nowrap py-4 text-[13px] font-medium uppercase tracking-[0.16em] transition-colors",
      "after:absolute after:inset-x-0 after:-bottom-px after:h-px after:origin-left after:bg-stone-900 after:transition-transform after:duration-500 dark:after:bg-stone-100",
      active
        ? "text-stone-900 after:scale-x-100 dark:text-white"
        : "text-stone-500 after:scale-x-0 hover:text-stone-900 hover:after:scale-x-100 dark:text-stone-400 dark:hover:text-white",
    )

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 dark:bg-stone-950 dark:text-stone-100">
      {/* Masthead */}
      <header className="container mx-auto px-4 pt-6 sm:pt-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between border-b border-stone-900/90 pb-3 text-[11px] font-medium uppercase tracking-[0.22em] text-stone-500 dark:border-stone-100/80 dark:text-stone-400">
            <span className="hidden sm:inline">{today || "\u00A0"}</span>
            <span>Lagos · Nigeria</span>
            <span className="hidden sm:inline">{total > 0 ? `${total} ${total === 1 ? "story" : "stories"}` : "Stories"}</span>
          </div>

          <Reveal className="py-7 text-center sm:py-9 lg:py-10">
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.32em] text-[#8E1B2C] dark:text-rose-300">
              Alphacom presents
            </p>
            <h1 className="font-display text-[3.25rem] leading-[0.9] tracking-[-0.02em] sm:text-[5rem] lg:text-[6.5rem]">
              The <em className="italic text-[#8E1B2C] dark:text-rose-300">Journal</em>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-stone-600 sm:text-base dark:text-stone-400">
              Considered buying advice, practical guides and quiet observations on the technology that shapes everyday
              life.
            </p>
          </Reveal>

          <nav
            className="flex flex-col gap-2 border-y border-stone-900/10 sm:flex-row sm:items-center sm:justify-between sm:gap-8 dark:border-white/10"
            aria-label="Blog categories"
          >
            <div className="-mx-4 flex gap-8 overflow-x-auto px-4 no-scrollbar sm:mx-0 sm:px-0">
              <button type="button" className={navLinkClass(!category)} onClick={() => updateParams({ category: null, page: null })}>
                All stories
              </button>
              {categories.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={navLinkClass(category === item.slug)}
                  onClick={() => updateParams({ category: item.slug, page: null })}
                >
                  {item.name}
                </button>
              ))}
            </div>
            <label className="group flex items-center gap-2.5 border-t border-stone-900/10 py-3 sm:w-64 sm:border-t-0 sm:py-0 dark:border-white/10">
              <Search className="h-4 w-4 shrink-0 text-stone-400 transition-colors group-focus-within:text-stone-900 dark:group-focus-within:text-white" />
              <input
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search the journal"
                aria-label="Search the journal"
                className="w-full bg-transparent text-sm outline-none placeholder:text-stone-400"
              />
            </label>
          </nav>

          {tags.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px]">
              <span className="text-stone-400">Topics</span>
              {tags.map((item) => (
                <button
                  key={item.slug}
                  type="button"
                  onClick={() => updateParams({ tag: tag === item.slug ? null : item.slug, page: null })}
                  className={cn(
                    "transition-colors",
                    tag === item.slug
                      ? "font-medium text-[#8E1B2C] underline underline-offset-4 dark:text-rose-300"
                      : "text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white",
                  )}
                >
                  #{item.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 pb-24 pt-10 sm:pt-12">
        <div className="mx-auto max-w-7xl">
          {hasFilters && (
            <div className="mb-10 flex flex-wrap items-baseline justify-between gap-4">
              <p className="font-display text-3xl sm:text-4xl">
                {pagination ? (
                  <>
                    {pagination.total} {pagination.total === 1 ? "story" : "stories"}
                    {search && (
                      <>
                        {" "}
                        for <em className="italic text-[#8E1B2C] dark:text-rose-300">“{search}”</em>
                      </>
                    )}
                    {tag && (
                      <>
                        {" "}
                        on <em className="italic text-[#8E1B2C] dark:text-rose-300">#{tag}</em>
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
                className="inline-flex items-center gap-1.5 text-[13px] font-medium uppercase tracking-[0.16em] text-stone-500 transition-colors hover:text-stone-900 dark:hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
                Clear
              </button>
            </div>
          )}

          {isLoading ? (
            <>
              <BlogHeroSkeleton />
              <div className="mt-20 grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <BlogCardSkeleton key={i} />
                ))}
              </div>
            </>
          ) : isError ? (
            <div className="py-24 text-center">
              <p className="font-display text-4xl">The journal is resting.</p>
              <p className="mt-3 text-stone-500">We couldn't load stories right now. Please try again shortly.</p>
            </div>
          ) : allPosts.length === 0 ? (
            <div className="py-24 text-center">
              <p className="font-display text-4xl sm:text-5xl">Nothing here, yet.</p>
              <p className="mt-3 text-stone-500">
                {hasFilters ? "Try another search or category." : "New stories are on their way."}
              </p>
              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-stone-900 px-7 text-sm font-medium text-white transition hover:bg-stone-700 dark:bg-white dark:text-stone-900"
                >
                  Browse all stories
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          ) : (
            <div className={cn("transition-opacity duration-500", isFetching && "opacity-50")}>
              {lead && (
                <Reveal delay={120}>
                  <BlogHeroCard post={lead} />
                </Reveal>
              )}

              {featurePair.length > 0 && (
                <section className="mt-16 sm:mt-24">
                  <div className="relative flex flex-col gap-5 border-b border-stone-900/10 pb-8 sm:flex-row sm:items-end sm:justify-between dark:border-white/10">
                    <div>
                      <p className="mb-3 inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-stone-500">
                        <span className="h-px w-8 bg-stone-400" />
                        Curated selection
                      </p>
                      <h2 className="font-display text-5xl leading-none sm:text-6xl">
                        Editor&apos;s <em className="italic text-[#8E1B2C] dark:text-rose-300">picks</em>
                      </h2>
                    </div>
                  </div>

                  <div className="relative mt-10 grid sm:grid-cols-2 sm:gap-x-10 sm:gap-y-14 lg:grid-cols-4 lg:gap-x-0">
                    {featurePair.map((post, i) => (
                      <Reveal
                        key={post.id}
                        delay={i * 100}
                        className="border-t border-stone-900/10 py-8 first:border-t-0 first:pt-0 last:pb-0 sm:border-t-0 sm:py-0 lg:border-l lg:px-8 lg:first:border-l-0 lg:first:pl-0 lg:last:pr-0 dark:border-white/10"
                      >
                        <EditorPickCard post={post} index={i} />
                      </Reveal>
                    ))}
                  </div>
                </section>
              )}

              {gridPosts.length > 0 && (
                <section className={lead ? "mt-20 sm:mt-28" : undefined}>
                  {lead && <SectionTitle title="More stories" />}
                  <div className="grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
                    {gridPosts.map((post, i) => (
                      <Reveal key={post.id} delay={(i % 3) * 100}>
                        <BlogCard post={post} />
                      </Reveal>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}

          {pagination && pagination.total_pages > 1 && (
            <nav
              className="mt-24 flex items-center justify-between border-t border-stone-900/10 pt-8 dark:border-white/10"
              aria-label="Pagination"
            >
              <button
                type="button"
                onClick={() => goToPage(page - 1)}
                disabled={!pagination.has_prev}
                className="inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.16em] text-stone-600 transition-colors hover:text-stone-900 disabled:pointer-events-none disabled:opacity-30 dark:text-stone-400 dark:hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Newer
              </button>
              <div className="flex items-center gap-1">
                {pageNumbers(page, pagination.total_pages).map((item, i) =>
                  item === "…" ? (
                    <span key={`gap-${i}`} className="px-2 text-stone-400">
                      …
                    </span>
                  ) : (
                    <button
                      key={item}
                      type="button"
                      onClick={() => goToPage(item)}
                      aria-current={item === page ? "page" : undefined}
                      className={cn(
                        "h-10 min-w-10 rounded-full px-3 font-display text-lg transition",
                        item === page
                          ? "bg-stone-900 text-white dark:bg-white dark:text-stone-900"
                          : "text-stone-500 hover:text-stone-900 dark:hover:text-white",
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
                className="inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.16em] text-stone-600 transition-colors hover:text-stone-900 disabled:pointer-events-none disabled:opacity-30 dark:text-stone-400 dark:hover:text-white"
              >
                Older
                <ArrowRight className="h-4 w-4" />
              </button>
            </nav>
          )}

          <ShopBand />
        </div>
      </main>
    </div>
  )
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="mb-10 flex items-center gap-6">
      <h2 className="shrink-0 font-display text-4xl sm:text-5xl">{title}</h2>
      <span className="h-px flex-1 bg-stone-900/10 dark:bg-white/10" />
    </div>
  )
}

export function ShopBand() {
  return (
    <section className="relative mt-28 overflow-hidden rounded-[28px] bg-stone-900 px-6 py-16 text-center text-white sm:rounded-[36px] sm:px-12 sm:py-24 dark:bg-stone-900">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#8E1B2C]/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-16 h-80 w-80 rounded-full bg-amber-500/20 blur-3xl" />
      <div className="relative">
        <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-white/60">From the journal to your desk</p>
        <h2 className="mx-auto mt-5 max-w-3xl font-display text-5xl leading-[1.02] sm:text-7xl">
          Discover the tech <em className="italic text-rose-200">we write about.</em>
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-white/65">
          Genuine products, full warranty and delivery across Nigeria from our Computer Village store.
        </p>
        <Link
          href="/categories"
          className="group mt-10 inline-flex h-14 items-center gap-3 rounded-full bg-white pl-7 pr-2 text-sm font-medium text-stone-900 transition hover:bg-stone-100"
        >
          Shop the collection
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-900 text-white transition-transform duration-500 group-hover:rotate-45">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </Link>
      </div>
    </section>
  )
}
