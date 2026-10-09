import type { Metadata } from "next"
import { AppLayout } from "@/components/app-layout"
import { BlogPostClient } from "@/components/blog/blog-post-client"
import { SITE_URL } from "@/lib/site"
import type { BlogPostResponse } from "@/lib/api/blog"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.alphacomonline.com"

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const url = `${SITE_URL}/blog/${params.slug}`
  try {
    const res = await fetch(`${API_URL}/api/v1/blog/posts/${encodeURIComponent(params.slug)}`, {
      next: { revalidate: 300 },
    })
    if (!res.ok) throw new Error(`Blog post request failed: ${res.status}`)
    const { data: post }: BlogPostResponse = await res.json()
    const title = post.meta_title || post.title
    const description = post.meta_description || post.excerpt || undefined
    const images = post.cover_image_url ? [post.cover_image_url] : undefined

    return {
      title,
      description,
      alternates: { canonical: url },
      openGraph: {
        type: "article",
        url,
        title,
        description,
        images,
        publishedTime: post.published_at ?? undefined,
        authors: post.author_name ? [post.author_name] : undefined,
      },
      twitter: { card: "summary_large_image", title, description, images },
    }
  } catch {
    return { title: "Blog", alternates: { canonical: url } }
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  return (
    <AppLayout>
      <BlogPostClient slug={params.slug} />
    </AppLayout>
  )
}
