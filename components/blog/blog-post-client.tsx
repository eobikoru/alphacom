"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Check, ChevronRight, Facebook, Link2, MessageCircle } from "lucide-react"
import { useBlogPost } from "@/hooks/use-blog"
import { taxonomyName, taxonomySlug, type BlogPost } from "@/lib/api/blog"
import { AuthorAvatar, BlogCard, BlogCover, BlogMeta } from "@/components/blog/blog-card"
import { BlogComments } from "@/components/blog/blog-comments"
import { BlogSocialCard } from "@/components/blog/blog-social"
import { XIcon } from "@/lib/social-links"
import { SectionHeading, ShopBand } from "@/components/blog/blog-list-client"

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
        className="h-full origin-left bg-foreground transition-transform duration-150 ease-out"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
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
    "flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-foreground/70 transition hover:border-foreground hover:bg-foreground hover:text-background dark:bg-card"

  return (
    <div className="flex items-center gap-2">
      <span className="mr-1 text-xs font-medium text-muted-foreground">Share</span>
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
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 pt-8 sm:pt-12">
          <div className="mx-auto max-w-3xl space-y-4">
            <div className="h-4 w-32 animate-pulse rounded bg-muted" />
            <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
            <div className="h-10 w-full animate-pulse rounded bg-muted" />
            <div className="h-10 w-2/3 animate-pulse rounded bg-muted" />
            <div className="h-5 w-56 animate-pulse rounded bg-muted" />
          </div>
          <div className="mx-auto mt-8 aspect-[16/9] max-w-5xl animate-pulse rounded-2xl bg-muted" />
        </div>
      </div>
    )
  }

  if (isError || !post) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-background px-4">
        <div className="text-center">
          <p className="text-sm font-semibold text-muted-foreground">404</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Article not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">It may have been renamed or removed.</p>
          <Link
            href="/blog"
            className="mt-6 inline-flex h-10 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background transition hover:opacity-90"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to blog
          </Link>
        </div>
      </div>
    )
  }

  const category = taxonomyName(post.category)
  const categorySlug = taxonomySlug(post.category)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ReadingProgress />

      <article className="container mx-auto px-4 pt-6 sm:pt-10">
        <header className="mx-auto max-w-3xl">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/blog" className="hover:text-foreground">
              Blog
            </Link>
            {category && (
              <>
                <ChevronRight className="h-3.5 w-3.5" />
                <Link href={`/blog?category=${categorySlug}`} className="hover:text-foreground">
                  {category}
                </Link>
              </>
            )}
          </nav>

          <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">{post.excerpt}</p>
          )}

          <div className="mt-6 flex flex-col gap-4 border-y border-border py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              {post.author_name && <AuthorAvatar name={post.author_name} size="md" />}
              <div>
                {post.author_name && <p className="text-sm font-medium">{post.author_name}</p>}
                <BlogMeta post={post} />
              </div>
            </div>
            <ShareBar post={post} />
          </div>
        </header>

        {post.cover_image_url && (
          <figure className="mx-auto mt-8 max-w-5xl overflow-hidden rounded-2xl border border-border">
            <BlogCover src={post.cover_image_url} alt={post.title} className="aspect-[16/9] w-full" />
          </figure>
        )}

        <div id="article-body" className="mx-auto mt-8 max-w-3xl sm:mt-10">
          <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />

          <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
            {post.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((item) => (
                  <Link
                    key={taxonomySlug(item)}
                    href={`/blog?tag=${taxonomySlug(item)}`}
                    className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-foreground/80 transition hover:bg-foreground hover:text-background"
                  >
                    #{taxonomyName(item)}
                  </Link>
                ))}
              </div>
            ) : (
              <span />
            )}
            <ShareBar post={post} />
          </div>

          {post.author_name && (
            <div className="mt-8 flex items-center gap-4 rounded-2xl border border-border bg-white p-5 dark:bg-card">
              <AuthorAvatar name={post.author_name} size="lg" />
              <div>
                <p className="text-xs text-muted-foreground">Written by</p>
                <p className="text-base font-semibold">{post.author_name}</p>
                <p className="text-sm text-muted-foreground">Alphacom Online</p>
              </div>
            </div>
          )}

          <BlogSocialCard className="mt-6" />

          <BlogComments slug={post.slug} />

          <Link
            href="/blog"
            className="mt-10 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all articles
          </Link>
        </div>
      </article>

      <div className="container mx-auto px-4 pb-20">
        <div className="mx-auto max-w-7xl">
          {post.related?.length > 0 && (
            <section className="mt-14 border-t border-border pt-10">
              <SectionHeading title="Related articles" action={{ label: "View all", href: "/blog" }} />
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
