import { Suspense } from "react"
import type { Metadata } from "next"
import { AppLayout } from "@/components/app-layout"
import { BlogListClient } from "@/components/blog/blog-list-client"
import { SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
  title: "Blog - Tech Tips, Guides & News",
  description:
    "Buying advice, how-to guides and the latest tech news from AlphaCom Online, your trusted technology store in Lagos.",
  alternates: { canonical: `${SITE_URL}/blog` },
}

export default function BlogPage() {
  return (
    <AppLayout>
      <Suspense fallback={<div className="min-h-screen bg-[#F0F4F8] dark:bg-gray-950" />}>
        <BlogListClient />
      </Suspense>
    </AppLayout>
  )
}
