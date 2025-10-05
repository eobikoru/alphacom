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
