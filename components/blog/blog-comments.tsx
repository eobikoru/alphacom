"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CheckCircle2, Loader2, MessageCircle } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import { useBlogComments, useCreateBlogComment } from "@/hooks/use-blog"
import { getApiErrorMessage, type BlogComment, type CreateBlogCommentResponse } from "@/lib/api/blog"
import { AuthorAvatar } from "@/components/blog/blog-card"

const NAME_MIN = 2
const NAME_MAX = 100
const CONTENT_MAX = 2000
const GUEST_STORAGE_KEY = "blog_comment_guest"
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type FieldErrors = Partial<Record<"author_name" | "author_email" | "content", string>>

const inputClass =
  "w-full rounded-xl border bg-white px-4 text-sm text-gray-950 outline-none transition placeholder:text-gray-400 focus:ring-4 dark:bg-gray-950 dark:text-white"
const okBorder = "border-stone-200 bg-[#FCFBF9] focus:border-stone-400 focus:ring-stone-900/5 dark:border-stone-800 dark:bg-stone-950"
const errorBorder = "border-red-500 focus:ring-red-500/10"

function formatCommentDate(value: string | null) {
  if (!value) return ""
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  const seconds = Math.round((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return "Just now"
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} hr${hours === 1 ? "" : "s"} ago`
  const days = Math.round(hours / 24)
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`
  return date.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })
}

function isAwaitingApproval(response: CreateBlogCommentResponse) {
  const comment = response.data
  if (comment?.is_approved === false) return true
  if (comment?.status && comment.status.toLowerCase() !== "approved") return true
  return /approv|moderat|review/i.test(response.message ?? "")
}

function CommentItem({ comment }: { comment: BlogComment }) {
  const name = comment.author_name || "Anonymous"
  return (
    <li className="flex gap-4 py-6">
      <AuthorAvatar name={name} size="md" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <p className="text-sm font-semibold text-gray-950 dark:text-white">{name}</p>
          <time dateTime={comment.created_at ?? undefined} className="text-xs text-gray-500 dark:text-gray-400">
            {formatCommentDate(comment.created_at)}
          </time>
        </div>
        <p className="mt-1.5 whitespace-pre-line break-words text-[15px] leading-relaxed text-gray-700 dark:text-gray-300">
          {comment.content}
        </p>
      </div>
    </li>
  )
}

export function BlogComments({ slug }: { slug: string }) {
  const { isAuthenticated, user } = useAuth()
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useBlogComments(slug)
  const createComment = useCreateBlogComment(slug)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [content, setContent] = useState("")
  const [errors, setErrors] = useState<FieldErrors>({})
  const [pendingNotice, setPendingNotice] = useState(false)

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(GUEST_STORAGE_KEY) || "null")
      if (saved?.name) setName(saved.name)
      if (saved?.email) setEmail(saved.email)
    } catch {
      localStorage.removeItem(GUEST_STORAGE_KEY)
    }
  }, [])

  const comments = data?.pages.flatMap((page) => page.data ?? []) ?? []
  const total = data?.pages[0]?.pagination?.total ?? comments.length

  const validate = (): FieldErrors => {
    const next: FieldErrors = {}
    if (!isAuthenticated) {
      const trimmedName = name.trim()
      if (trimmedName.length < NAME_MIN) next.author_name = `Name must be at least ${NAME_MIN} characters`
      else if (trimmedName.length > NAME_MAX) next.author_name = `Name must be at most ${NAME_MAX} characters`
      if (!EMAIL_PATTERN.test(email.trim())) next.author_email = "Enter a valid email address"
    }
    if (!content.trim()) next.content = "Write a comment before posting"
    else if (content.length > CONTENT_MAX) next.content = `Comments can be at most ${CONTENT_MAX} characters`
    return next
  }

  const clearError = (field: keyof FieldErrors) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const payload = isAuthenticated
      ? { content: content.trim() }
      : { author_name: name.trim(), author_email: email.trim(), content: content.trim() }

    try {
      const response = await createComment.mutateAsync(payload)
      setContent("")
      if (!isAuthenticated) {
        localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify({ name: name.trim(), email: email.trim() }))
      }
      if (isAwaitingApproval(response)) {
        setPendingNotice(true)
      } else {
        setPendingNotice(false)
        toast.success("Comment posted")
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    }
  }

  return (
    <section id="comments" className="mt-20 scroll-mt-28">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-display text-4xl text-stone-900 sm:text-5xl dark:text-white">
          Conversation
        </h2>
        <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-stone-500">
          {total} {total === 1 ? "comment" : "comments"}
        </span>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-8 rounded-[24px] bg-white p-5 ring-1 ring-stone-900/5 sm:p-7 dark:bg-stone-900 dark:ring-white/10"
      >
        {isAuthenticated ? (
          <div className="mb-4 flex items-center gap-3">
            <AuthorAvatar name={user?.username || user?.email || "You"} />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Commenting as{" "}
              <span className="font-semibold text-gray-950 dark:text-white">{user?.username || user?.email}</span>
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="comment-name" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Name
                </label>
                <input
                  id="comment-name"
                  value={name}
                  maxLength={NAME_MAX}
                  autoComplete="name"
                  onChange={(e) => {
                    setName(e.target.value)
                    clearError("author_name")
                  }}
                  placeholder="Your name"
                  className={cn(inputClass, "h-11", errors.author_name ? errorBorder : okBorder)}
                />
                {errors.author_name && <p className="mt-1 text-xs text-red-500">{errors.author_name}</p>}
              </div>
              <div>
                <label htmlFor="comment-email" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email <span className="font-normal text-gray-400">(not published)</span>
                </label>
                <input
                  id="comment-email"
                  type="email"
                  value={email}
                  autoComplete="email"
                  onChange={(e) => {
                    setEmail(e.target.value)
                    clearError("author_email")
                  }}
                  placeholder="you@example.com"
                  className={cn(inputClass, "h-11", errors.author_email ? errorBorder : okBorder)}
                />
                {errors.author_email && <p className="mt-1 text-xs text-red-500">{errors.author_email}</p>}
              </div>
            </div>
          </>
        )}

        <label htmlFor="comment-content" className="sr-only">
          Comment
        </label>
        <textarea
          id="comment-content"
          value={content}
          rows={4}
          maxLength={CONTENT_MAX}
          onChange={(e) => {
            setContent(e.target.value)
            clearError("content")
          }}
          placeholder="Share your thoughts…"
          className={cn(inputClass, "resize-y py-3 leading-relaxed", errors.content ? errorBorder : okBorder)}
        />
        <div className="mt-1 flex items-start justify-between gap-4">
          <p className="text-xs text-red-500">{errors.content}</p>
          <p
            className={cn(
              "shrink-0 text-xs tabular-nums",
              content.length > CONTENT_MAX * 0.9 ? "text-amber-600" : "text-gray-400",
            )}
          >
            {content.length}/{CONTENT_MAX}
          </p>
        </div>

        <div className="mt-4 flex flex-col-reverse items-start justify-between gap-3 sm:flex-row sm:items-center">
          {!isAuthenticated ? (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Have an account?{" "}
              <Link href="/auth/signin" className="font-medium text-gray-950 underline underline-offset-4 dark:text-white">
                Sign in
              </Link>{" "}
              to comment faster.
            </p>
          ) : (
            <span />
          )}
          <button
            type="submit"
            disabled={createComment.isPending}
            className="inline-flex h-12 items-center gap-2 rounded-full bg-stone-900 px-7 text-sm font-medium text-white transition hover:bg-stone-700 disabled:opacity-60 dark:bg-white dark:text-stone-900 dark:hover:bg-stone-200"
          >
            {createComment.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {createComment.isPending ? "Posting…" : "Post comment"}
          </button>
        </div>

        {pendingNotice && (
          <div className="mt-4 flex items-start gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            Thanks! Your comment has been received and will appear once it's approved.
          </div>
        )}
      </form>

      {isLoading ? (
        <ul className="mt-4 divide-y divide-gray-100 dark:divide-gray-800">
          {Array.from({ length: 2 }).map((_, i) => (
            <li key={i} className="flex gap-4 py-6">
              <div className="h-10 w-10 animate-pulse rounded-full bg-gray-300 dark:bg-gray-700" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-32 animate-pulse rounded bg-gray-300 dark:bg-gray-700" />
                <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
              </div>
            </li>
          ))}
        </ul>
      ) : isError ? (
        <p className="mt-8 text-sm text-gray-500">Comments couldn't be loaded right now.</p>
      ) : comments.length === 0 ? (
        <div className="mt-8 flex flex-col items-center py-6 text-center">
          <MessageCircle className="h-7 w-7 text-stone-300 dark:text-stone-600" strokeWidth={1.25} />
          <p className="mt-4 font-display text-2xl text-stone-900 dark:text-white">Start the conversation</p>
          <p className="mt-1 text-sm text-gray-500">Be the first to share your thoughts.</p>
        </div>
      ) : (
        <>
          <ul className="mt-4 divide-y divide-gray-100 dark:divide-gray-800">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </ul>
          {hasNextPage && (
            <div className="mt-2 flex justify-center">
              <button
                type="button"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-gray-200 px-5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-900"
              >
                {isFetchingNextPage && <Loader2 className="h-4 w-4 animate-spin" />}
                Load more comments
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}
