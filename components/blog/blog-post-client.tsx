"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Check, Facebook, Link2, MessageCircle } from "lucide-react"
import { useBlogPost } from "@/hooks/use-blog"
import { taxonomyName, taxonomySlug, type BlogPost } from "@/lib/api/blog"
import { AuthorAvatar, BlogCard, BlogCover, BlogMeta } from "@/components/blog/blog-card"
import { BlogComments } from "@/components/blog/blog-comments"
import { ShopBand } from "@/components/blog/blog-list-client"

function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const article = document.getElementById("article-body")
      if (!article) return
      const rect = article.getBoundingClientRect()
      const total = rect.height - window.innerHeight * 0.6
      const read = Math.min(Math.max(-rect.top + window.innerHeight * 0.2, 0), Math.max(total, 1))
      setProgress(total > 0 ? read / total : 0)
    }
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]" aria-hidden>
      <div
        className="h-full origin-left bg-gradient-to-r from-[#8E1B2C] to-[#C2410C] transition-transform duration-150 ease-out"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z" />
    </svg>
  )
}

function ShareBar({ post }: { post: BlogPost }) {
  const [copied, setCopied] = useState(false)
  const [url, setUrl] = useState("")

  useEffect(() => {
    setUrl(window.location.href)
  }, [])

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  const text = encodeURIComponent(post.title)
  const encodedUrl = encodeURIComponent(url)
  const buttonClass =
    "flex h-10 w-10 items-center justify-center rounded-full border border-stone-900/10 text-stone-600 transition hover:border-stone-900 hover:bg-stone-900 hover:text-white dark:border-white/15 dark:text-stone-300 dark:hover:border-white dark:hover:bg-white dark:hover:text-stone-900"

  return (
    <div className="flex items-center gap-2">
      <a
        href={`https://wa.me/?text=${text}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass}
        aria-label="Share on WhatsApp"
      >
        <MessageCircle className="h-4 w-4" />
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass}
        aria-label="Share on X"
      >
        <XIcon className="h-3.5 w-3.5" />
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass}
        aria-label="Share on Facebook"
      >
        <Facebook className="h-4 w-4" />
      </a>
      <button type="button" onClick={copyLink} className={buttonClass} aria-label={copied ? "Link copied" : "Copy link"}>
        {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
      </button>
    </div>
  )
}

export function BlogPostClient({ slug }: { slug: string }) {
  const { data, isLoading, isError } = useBlogPost(slug)
  const post = data?.data

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] dark:bg-stone-950">
        <div className="container mx-auto px-4 pt-16 sm:pt-24">
          <div className="mx-auto flex max-w-3xl flex-col items-center">
            <div className="mb-8 h-3 w-28 animate-pulse rounded bg-stone-300 dark:bg-stone-800" />
            <div className="mb-4 h-14 w-full animate-pulse rounded-lg bg-stone-300 dark:bg-stone-800" />
            <div className="mb-10 h-14 w-2/3 animate-pulse rounded-lg bg-stone-300 dark:bg-stone-800" />
            <div className="h-10 w-56 animate-pulse rounded-full bg-stone-200 dark:bg-stone-900" />
          </div>
          <div className="mx-auto mt-14 aspect-[16/9] max-w-6xl animate-pulse rounded-[36px] bg-stone-300 dark:bg-stone-800" />
        </div>
      </div>
    )
  }

  if (isError || !post) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#FAF8F5] px-4 dark:bg-stone-950">
        <div className="text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-[#8E1B2C] dark:text-rose-300">404</p>
          <h1 className="mt-4 font-display text-5xl sm:text-6xl">This story has moved on.</h1>
          <p className="mt-4 text-stone-500">It may have been renamed or removed from the journal.</p>
          <Link
            href="/blog"
            className="mt-10 inline-flex h-12 items-center gap-2 rounded-full bg-stone-900 px-7 text-sm font-medium text-white transition hover:bg-stone-700 dark:bg-white dark:text-stone-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to the journal
          </Link>
        </div>
      </div>
    )
  }

  const category = taxonomyName(post.category)
  const categorySlug = taxonomySlug(post.category)

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 dark:bg-stone-950 dark:text-stone-100">
      <ReadingProgress />

      <article className="container mx-auto px-4 pt-10 sm:pt-16">
        <header className="mx-auto max-w-4xl animate-fade-in-up text-center" style={{ animationDuration: "900ms" }}>
          <nav
            className="mb-10 flex items-center justify-center gap-3 text-[11px] font-medium uppercase tracking-[0.22em] text-stone-500"
            aria-label="Breadcrumb"
          >
            <Link href="/blog" className="transition-colors hover:text-stone-900 dark:hover:text-white">
              The Journal
            </Link>
            {category && (
              <>
                <span className="h-px w-6 bg-stone-300 dark:bg-stone-700" />
                <Link
                  href={`/blog?category=${categorySlug}`}
                  className="text-[#8E1B2C] transition-opacity hover:opacity-70 dark:text-rose-300"
                >
                  {category}
                </Link>
              </>
            )}
          </nav>

          <h1 className="font-display text-[2.75rem] leading-[1.02] tracking-[-0.015em] sm:text-7xl lg:text-[5.5rem]">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="mx-auto mt-7 max-w-2xl font-display text-xl italic leading-snug text-stone-600 sm:text-2xl dark:text-stone-400">
              {post.excerpt}
            </p>
          )}

          <div className="mt-10 flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-10">
            <div className="flex items-center gap-3 text-left">
              {post.author_name && <AuthorAvatar name={post.author_name} size="lg" />}
              <div>
                {post.author_name && <p className="text-sm font-medium">By {post.author_name}</p>}
                <BlogMeta post={post} />
              </div>
            </div>
            <span className="hidden h-10 w-px bg-stone-900/10 sm:block dark:bg-white/10" />
            <ShareBar post={post} />
          </div>
        </header>

        {post.cover_image_url && (
          <figure
            className="mx-auto mt-14 max-w-6xl animate-fade-in-up sm:mt-20"
            style={{ animationDelay: "150ms", animationDuration: "1000ms" }}
          >
            <div className="overflow-hidden rounded-[24px] sm:rounded-[36px]">
              <BlogCover src={post.cover_image_url} alt={post.title} className="aspect-[16/9] w-full" />
            </div>
          </figure>
        )}

        <div id="article-body" className="mx-auto mt-14 max-w-[680px] sm:mt-20">
          <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />

          <div className="mt-16 flex flex-col gap-6 border-y border-stone-900/10 py-8 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
            {post.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((item) => (
                  <Link
                    key={taxonomySlug(item)}
                    href={`/blog?tag=${taxonomySlug(item)}`}
                    className="rounded-full border border-stone-900/10 px-3.5 py-1.5 text-[13px] text-stone-600 transition hover:border-stone-900 hover:text-stone-900 dark:border-white/15 dark:text-stone-300 dark:hover:border-white dark:hover:text-white"
                  >
                    #{taxonomyName(item)}
                  </Link>
                ))}
              </div>
            ) : (
              <p className="font-display text-2xl italic text-stone-500">Enjoyed this story?</p>
            )}
            <ShareBar post={post} />
          </div>

          {post.author_name && (
            <div className="mt-10 flex items-center gap-5 rounded-[24px] bg-white p-6 ring-1 ring-stone-900/5 dark:bg-stone-900 dark:ring-white/10">
              <AuthorAvatar name={post.author_name} size="lg" />
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-stone-500">Written by</p>
                <p className="mt-1 font-display text-2xl">{post.author_name}</p>
                <p className="mt-1 text-sm text-stone-500">For the Alphacom Journal</p>
              </div>
            </div>
          )}

          <BlogComments slug={post.slug} />
        </div>
      </article>

      <div className="container mx-auto px-4 pb-24">
        <div className="mx-auto max-w-7xl">
          {post.related?.length > 0 && (
            <section className="mt-28">
              <div className="mb-10 flex items-center gap-6">
                <h2 className="shrink-0 font-display text-4xl sm:text-5xl">
                  Keep <em className="italic text-[#8E1B2C] dark:text-rose-300">reading</em>
                </h2>
                <span className="h-px flex-1 bg-stone-900/10 dark:bg-white/10" />
                <Link
                  href="/blog"
                  className="hidden shrink-0 text-[13px] font-medium uppercase tracking-[0.16em] text-stone-500 transition-colors hover:text-stone-900 sm:inline dark:hover:text-white"
                >
                  All stories
                </Link>
              </div>
              <div className="grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
                {post.related.map((item) => (
                  <BlogCard key={item.id} post={item} />
                ))}
              </div>
            </section>
          )}

          <ShopBand />
        </div>
      </div>
    </div>
  )
}
