import Link from "next/link"
import { ArrowRight, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatBlogDate, taxonomyName, type BlogPostCard } from "@/lib/api/blog"

export function BlogCover({ src, alt, className }: { src: string | null; alt: string; className?: string }) {
  if (!src) {
    return (
      <div className={cn("flex items-center justify-center bg-muted text-muted-foreground/50", className)}>
        <ImageIcon className="h-8 w-8" strokeWidth={1.5} />
      </div>
    )
  }
  return <img src={src} alt={alt} loading="lazy" className={cn("object-cover", className)} />
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

export function AuthorAvatar({ name, size = "sm" }: { name: string; size?: "sm" | "md" | "lg" }) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-foreground font-semibold text-background",
        size === "lg" ? "h-12 w-12 text-base" : size === "md" ? "h-10 w-10 text-sm" : "h-8 w-8 text-xs",
      )}
      aria-hidden
    >
      {initials(name) || "A"}
    </span>
  )
}

export function BlogMeta({ post, className }: { post: BlogPostCard; className?: string }) {
  const date = formatBlogDate(post.published_at)
  return (
    <div className={cn("flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground", className)}>
      {date && <time dateTime={post.published_at ?? undefined}>{date}</time>}
      {date && post.reading_time_minutes ? <span aria-hidden>·</span> : null}
      {post.reading_time_minutes ? <span>{post.reading_time_minutes} min read</span> : null}
    </div>
  )
}

export function CategoryBadge({ post, className }: { post: BlogPostCard; className?: string }) {
  const category = taxonomyName(post.category)
  if (!category) return null
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-foreground/80",
        className,
      )}
    >
      {category}
    </span>
  )
}

export function BlogFeaturedCard({ post }: { post: BlogPostCard }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group grid overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-shadow hover:shadow-md md:grid-cols-2 dark:bg-card"
    >
      <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto md:min-h-[320px]">
        <BlogCover
          src={post.cover_image_url}
          alt={post.title}
          className="absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-col p-5 sm:p-8 lg:p-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-foreground px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-background">
            Latest
          </span>
          <CategoryBadge post={post} />
        </div>
        <h2 className="mt-4 text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-[2rem]">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{post.excerpt}</p>
        )}
        <div className="mt-6 flex items-center gap-3 md:mt-auto md:pt-8">
          {post.author_name && <AuthorAvatar name={post.author_name} size="md" />}
          <div className="min-w-0 flex-1">
            {post.author_name && <p className="truncate text-sm font-medium text-foreground">{post.author_name}</p>}
            <BlogMeta post={post} />
          </div>
          <span className="hidden items-center gap-1.5 text-sm font-medium text-foreground sm:inline-flex">
            Read article
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  )
}

export function BlogCard({ post, className }: { post: BlogPostCard; className?: string }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-shadow hover:shadow-md dark:bg-card",
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <BlogCover
          src={post.cover_image_url}
          alt={post.title}
          className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <CategoryBadge post={post} className="self-start" />
        <h3 className="mt-3 line-clamp-2 text-lg font-semibold leading-snug tracking-tight text-foreground group-hover:underline group-hover:underline-offset-4">
          {post.title}
        </h3>
        {post.excerpt && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>}
        <div className="mt-auto flex items-center gap-2.5 pt-5">
          {post.author_name && <AuthorAvatar name={post.author_name} />}
          <div className="min-w-0">
            {post.author_name && <p className="truncate text-xs font-medium text-foreground">{post.author_name}</p>}
            <BlogMeta post={post} />
          </div>
        </div>
      </div>
    </Link>
  )
}

export function BlogCompactCard({ post }: { post: BlogPostCard }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group flex gap-4 sm:flex-col sm:gap-0">
      <div className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-xl sm:aspect-[16/10] sm:w-full">
        <BlogCover
          src={post.cover_image_url}
          alt={post.title}
          className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="min-w-0 sm:pt-4">
        <CategoryBadge post={post} className="hidden sm:inline-flex" />
        <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-foreground group-hover:underline group-hover:underline-offset-4 sm:mt-2.5">
          {post.title}
        </h3>
        <BlogMeta post={post} className="mt-1.5" />
      </div>
    </Link>
  )
}

export function BlogFeaturedSkeleton() {
  return (
    <div className="grid overflow-hidden rounded-2xl border border-border bg-white md:grid-cols-2 dark:bg-card">
      <div className="aspect-[16/10] animate-pulse bg-muted md:aspect-auto md:min-h-[320px]" />
      <div className="space-y-4 p-5 sm:p-8 lg:p-10">
        <div className="h-5 w-24 animate-pulse rounded-full bg-muted" />
        <div className="h-8 w-4/5 animate-pulse rounded bg-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
      </div>
    </div>
  )
}

export function BlogCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white dark:bg-card">
      <div className="aspect-[16/10] animate-pulse bg-muted" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-20 animate-pulse rounded-full bg-muted" />
        <div className="h-5 w-4/5 animate-pulse rounded bg-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
      </div>
    </div>
  )
}
