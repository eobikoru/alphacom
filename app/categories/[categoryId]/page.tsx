"use client"

import { CategoryPage } from "@/components/category-page"
import { AppLayout } from "@/components/app-layout"

interface CategoryPageProps {
  params: {
    categoryId: string
  }
}

export default function CategoryPageWrapper({ params }: CategoryPageProps) {
  return (
    <AppLayout>
      <CategoryPage categorySlug={params.categoryId} />
    </AppLayout>
  )
}
