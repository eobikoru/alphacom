import apiClient from "../api-client"

export interface ProductCategory {
  id: string
  name: string
  slug: string
}

export interface Product {
  id: string
  name: string
  slug: string
  sku: string
  brand: string | null
  price: number
  original_price: number
  discount_percentage: number
  currency: string
  main_image: string | null
  images: string[]
  category: ProductCategory
  subcategory_id: string | null
  in_stock: boolean
  stock_quantity: number
  stock_status: string
  description: string
  short_description: string | null
}

export interface FeaturedProduct {
  id: string // Added id field to match API response
  name: string
  slug: string
  brand: string
  price: number
  original_price: number | null
  discount_percentage: number | null
  currency: string
  main_image: string
  images: string[]
  category: string // Added missing fields from API response
  in_stock: boolean
  stock_status: string
  description: string
  short_description: string | null
  rating: number | null
  review_count: number | null
}

export interface ProductsResponse {
  success: boolean
  message: string
  data: Product[]
  pagination: {
    page: number
    per_page: number
    total: number
    total_pages: number
    has_next: boolean
    has_prev: boolean
  }
}

export interface FeaturedProductsResponse {
  success: boolean
  message: string
  data: FeaturedProduct[]
}

export interface GetProductsParams {
  page?: number
  per_page?: number
  category_id?: string
  search?: string
}

// Get products with categories
export const getProductsWithCategories = async (params?: GetProductsParams): Promise<ProductsResponse> => {
  const response = await apiClient.get("/api/v1/products/with-categories", { params })
  return response.data
}

// Get featured products
export const getFeaturedProducts = async (limit = 10): Promise<FeaturedProductsResponse> => {
  const response = await apiClient.get("/api/v1/products/featured", {
    params: { limit: Math.min(limit, 50) },
  })
  return response.data
}

// Get featured product by ID
export const getFeaturedProductById = async (
  productId: string,
): Promise<{ success: boolean; message: string; data: FeaturedProduct }> => {
  const response = await apiClient.get(`/api/v1/products/featured/${productId}`)
  return response.data
}

// Get product by slug
export const getProductBySlug = async (slug: string): Promise<{ success: boolean; message: string; data: Product }> => {
  const response = await apiClient.get(`/api/v1/products/${slug}`)
  return response.data
}

// Get product by ID
export const getProductById = async (
  productId: string,
): Promise<{ success: boolean; message: string; data: Product }> => {
  const response = await apiClient.get(`/api/v1/products/${productId}`)
  return response.data
}
