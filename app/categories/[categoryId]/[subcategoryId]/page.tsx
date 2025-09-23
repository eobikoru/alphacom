"use client"

import { CategoryPage } from "@/components/category-page"
import { AppLayout } from "@/components/app-layout"

interface SubcategoryPageProps {
  params: {
    categoryId: string
    subcategoryId: string
  }
}

export default function SubcategoryPageWrapper({ params }: SubcategoryPageProps) {
  return (
    <AppLayout>
      <CategoryPage categorySlug={params.categoryId} selectedSubcategory={params.subcategoryId} />
    </AppLayout>
  )
}
