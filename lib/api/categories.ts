import apiClient from "../api-client"

export interface CategoryProduct {
  id: string
  name: string
  slug: string
  brand: string | null
  price: number
  original_price: number | null
  discount_percentage: number | null
  currency: string
  main_image: string | null
  images: string[]
  in_stock: boolean
  stock_status: string
}

export interface Subcategory {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  product_count: number
  products: CategoryProduct[]
}

export interface CategoryWithProducts {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  total_product_count: number
  direct_product_count: number
  direct_products: CategoryProduct[]
  subcategories: Subcategory[]
}

export interface CategoriesWithProductsResponse {
  success: boolean
  message: string
  data: CategoryWithProducts[]
}

export interface SubcategoriesResponse {
  success: boolean
  message: string
  data: Subcategory[]
}

// Get categories with products
export const getCategoriesWithProducts = async (): Promise<CategoriesWithProductsResponse> => {
  const response = await apiClient.get("/api/v1/categories/with-products")
  return response.data
}

export const getSubcategoriesByCategory = async (categoryId: string): Promise<SubcategoriesResponse> => {
  const response = await apiClient.get(`/api/v1/categories/${categoryId}/subcategories`)
  return response.data
}
