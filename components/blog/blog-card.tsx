import Link from "next/link"
import { ArrowRight, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatBlogDate, taxonomyName, type BlogPostCard } from "@/lib/api/blog"

export function BlogCover({ src, alt, className }: { src: string | null; alt: string; className?: string }) {
  if (!src) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-[radial-gradient(ellipse_at_top_left,#f5efe6,#e9e2d6_45%,#ddd5c7)] text-[#b9ad9a] dark:bg-[radial-gradient(ellipse_at_top_left,#1f2937,#111827)] dark:text-gray-600",
          className,
        )}
      >
        <ImageIcon className="h-9 w-9" strokeWidth={1.25} />
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
        "flex shrink-0 items-center justify-center rounded-full bg-[#1c1917] font-display text-[#f5efe6] ring-1 ring-black/5 dark:bg-[#f5efe6] dark:text-[#1c1917]",
        size === "lg" ? "h-12 w-12 text-lg" : size === "md" ? "h-10 w-10 text-base" : "h-8 w-8 text-sm",
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
    <div className={cn("flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13px] text-stone-500 dark:text-stone-400", className)}>
      {date && <time dateTime={post.published_at ?? undefined}>{date}</time>}
      {date && post.reading_time_minutes ? <span className="h-0.5 w-0.5 rounded-full bg-current" aria-hidden /> : null}
      {post.reading_time_minutes ? <span>{post.reading_time_minutes} min read</span> : null}
    </div>
  )
}

export function CategoryEyebrow({ post, className, light }: { post: BlogPostCard; className?: string; light?: boolean }) {
  const category = taxonomyName(post.category)
  if (!category) return null
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em]",
        light ? "text-white/80" : "text-[#8E1B2C] dark:text-rose-300",
        className,
      )}
    >
      <span className={cn("h-1 w-1 rounded-full", light ? "bg-white/80" : "bg-[#8E1B2C] dark:bg-rose-300")} />
      {category}
    </span>
  )
}

export function BlogHeroCard({ post }: { post: BlogPostCard }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative block overflow-hidden rounded-[28px] bg-stone-900 sm:rounded-[36px]"
    >
      <div className="relative aspect-[4/5] sm:aspect-[16/10] lg:aspect-[21/10]">
        <BlogCover
          src={post.cover_image_url}
          alt={post.title}
          className="absolute inset-0 h-full w-full transition-transform duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/0" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 lg:p-14">
          <div className="max-w-3xl">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-white backdrop-blur-md">
                The latest
              </span>
              <CategoryEyebrow post={post} light />
            </div>
            <h2 className="font-display text-[2.5rem] leading-[1.02] tracking-[-0.01em] text-white sm:text-6xl lg:text-[5.25rem]">
              {post.title}
            </h2>
            {post.excerpt && (
              <p className="mt-5 line-clamp-2 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">{post.excerpt}</p>
            )}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                {post.author_name && <AuthorAvatar name={post.author_name} size="md" />}
                <div>
                  {post.author_name && <p className="text-sm font-medium text-white">{post.author_name}</p>}
                  <BlogMeta post={post} className="text-white/60 dark:text-white/60" />
                </div>
              </div>
              <span className="inline-flex items-center gap-3 text-sm font-medium text-white">
                Read the story
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-stone-900 transition-transform duration-500 group-hover:translate-x-1">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export function BlogCard({
  post,
  size = "default",
  className,
}: {
  post: BlogPostCard
  size?: "default" | "compact"
  className?: string
}) {
  const compact = size === "compact"
  return (
    <Link href={`/blog/${post.slug}`} className={cn("group flex h-full flex-col", className)}>
      <div
        className={cn(
          "relative overflow-hidden rounded-[20px] bg-stone-100 dark:bg-stone-900",
          "aspect-[4/3]",
        )}
      >
        <BlogCover
          src={post.cover_image_url}
          alt={post.title}
          className="h-full w-full transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
        />
        <div className="pointer-events-none absolute inset-0 rounded-[20px] ring-1 ring-inset ring-black/5" />
      </div>
      <div className={cn("flex flex-1 flex-col", compact ? "pt-4" : "pt-6")}>
        <CategoryEyebrow post={post} className={compact ? "mb-2" : "mb-3"} />
        <h3
          className={cn(
            "font-display leading-[1.08] tracking-[-0.005em] text-stone-900 dark:text-stone-50",
            compact ? "line-clamp-2 text-[1.5rem]" : "text-[1.75rem]",
          )}
        >
          <span className="bg-gradient-to-r from-current to-current bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">
            {post.title}
          </span>
        </h3>
        {post.excerpt && (
          <p
            className={cn(
              "mt-3 text-[15px] leading-relaxed text-stone-600 dark:text-stone-400",
              "line-clamp-2",
            )}
          >
            {post.excerpt}
          </p>
        )}
        <div className={cn("mt-auto flex items-center gap-3", compact ? "pt-4" : "pt-6")}>
          {post.author_name && <AuthorAvatar name={post.author_name} />}
          <div className="min-w-0">
            {post.author_name && (
              <p className="truncate text-[13px] font-medium text-stone-900 dark:text-stone-200">{post.author_name}</p>
            )}
            <BlogMeta post={post} />
          </div>
        </div>
      </div>
    </Link>
  )
}

export function EditorPickCard({ post, index }: { post: BlogPostCard; index: number }) {
  const author = post.author_name
  const date = formatBlogDate(post.published_at)
  return (
    <Link href={`/blog/${post.slug}`} className="group flex h-full flex-col">
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-display text-5xl leading-none text-stone-300 transition-colors duration-500 group-hover:text-[#8E1B2C] dark:text-stone-700 dark:group-hover:text-rose-300">
          {String(index + 1).padStart(2, "0")}
        </span>
        <CategoryEyebrow post={post} />
      </div>

      <div className="relative mt-5 aspect-[4/3] overflow-hidden rounded-2xl bg-stone-100 dark:bg-stone-800">
        <BlogCover
          src={post.cover_image_url}
          alt={post.title}
          className="h-full w-full transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
        />
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5" />
      </div>

      <h3 className="mt-5 line-clamp-3 font-display text-[1.6rem] leading-[1.1] text-stone-900 dark:text-stone-50">
        <span className="bg-gradient-to-r from-current to-current bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">
          {post.title}
        </span>
      </h3>

      <div className="mt-auto flex items-center justify-between gap-3 pt-5 text-[12px] text-stone-500 dark:text-stone-400">
        <span className="truncate">
          {author && <span className="font-medium text-stone-800 dark:text-stone-200">{author}</span>}
          {author && date && <span className="mx-1.5">·</span>}
          {date}
        </span>
        <ArrowRight className="h-4 w-4 shrink-0 -translate-x-1 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100" />
      </div>
    </Link>
  )
}

export function BlogHeroSkeleton() {
  return <div className="aspect-[4/5] animate-pulse rounded-[28px] bg-stone-300 sm:aspect-[16/10] sm:rounded-[36px] lg:aspect-[21/10] dark:bg-stone-800" />
}

export function BlogCardSkeleton() {
  return (
    <div>
      <div className="aspect-[4/3] animate-pulse rounded-[20px] bg-stone-300 dark:bg-stone-800" />
      <div className="space-y-3 pt-6">
        <div className="h-2.5 w-20 animate-pulse rounded bg-stone-300 dark:bg-stone-800" />
        <div className="h-7 w-4/5 animate-pulse rounded bg-stone-300 dark:bg-stone-800" />
        <div className="h-4 w-full animate-pulse rounded bg-stone-200 dark:bg-stone-900" />
      </div>
    </div>
  )
}
