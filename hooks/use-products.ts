"use client"

import { useQuery } from "@tanstack/react-query"
import { getProductsWithCategories, getFeaturedProductById, type GetProductsParams } from "@/lib/api/products"

export function useProducts(params?: GetProductsParams) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => getProductsWithCategories(params),
  })
}

export function useFeaturedProduct(productId: string | null) {
  return useQuery({
    queryKey: ["featured-product", productId],
    queryFn: () => getFeaturedProductById(productId!),
    enabled: !!productId,
  })
}
