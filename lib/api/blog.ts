import apiClient from "../api-client"

export interface BlogTaxonomy {
  id?: string
  name: string
  slug: string
}

export interface BlogPostCard {
  id: string
  title: string
  slug: string
  excerpt: string | null
  cover_image_url: string | null
  published_at: string | null
  author_name: string | null
  category: BlogTaxonomy | string | null
  tags: Array<BlogTaxonomy | string>
  reading_time_minutes: number | null
  is_featured: boolean
  view_count: number
  comment_count: number
}

export interface BlogPost extends BlogPostCard {
  content: string
  meta_title: string | null
  meta_description: string | null
  related: BlogPostCard[]
}

export interface BlogPagination {
  page: number
  per_page: number
  total: number
  total_pages: number
  has_next: boolean
  has_prev: boolean
}

export interface BlogPostsResponse {
  success: boolean
  message: string
  data: BlogPostCard[]
  pagination: BlogPagination
}

export interface BlogPostResponse {
  success: boolean
  message: string
  data: BlogPost
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description: string | null
  post_count: number
}

export interface BlogTag {
  id?: string
  name: string
  slug: string
  post_count?: number
}

export interface GetBlogPostsParams {
  page?: number
  per_page?: number
  category?: string
  tag?: string
  featured?: boolean
  search?: string
}

export const getBlogPosts = async (params?: GetBlogPostsParams): Promise<BlogPostsResponse> => {
  const response = await apiClient.get("/api/v1/blog/posts", { params })
  return response.data
}

export const getBlogPost = async (slug: string): Promise<BlogPostResponse> => {
  const response = await apiClient.get(`/api/v1/blog/posts/${encodeURIComponent(slug)}`)
  return response.data
}

export const getBlogCategories = async (): Promise<{ success: boolean; data: BlogCategory[] }> => {
  const response = await apiClient.get("/api/v1/blog/categories")
  return response.data
}

export const getBlogTags = async (): Promise<{ success: boolean; data: BlogTag[] }> => {
  const response = await apiClient.get("/api/v1/blog/tags")
  return response.data
}

export interface BlogComment {
  id: string
  author_name: string | null
  content: string
  created_at: string | null
  status?: string
  is_approved?: boolean
}

export interface BlogCommentsResponse {
  success: boolean
  message: string
  data: BlogComment[]
  pagination: BlogPagination
}

export type CreateBlogCommentRequest =
  | { content: string }
  | { author_name: string; author_email: string; content: string }

export interface CreateBlogCommentResponse {
  success: boolean
  message: string
  data?: BlogComment
}

export const getBlogComments = async (
  slug: string,
  params?: { page?: number; per_page?: number },
): Promise<BlogCommentsResponse> => {
  const response = await apiClient.get(`/api/v1/blog/posts/${encodeURIComponent(slug)}/comments`, { params })
  return response.data
}

export const createBlogComment = async (
  slug: string,
  data: CreateBlogCommentRequest,
): Promise<CreateBlogCommentResponse> => {
  const response = await apiClient.post(`/api/v1/blog/posts/${encodeURIComponent(slug)}/comments`, data)
  return response.data
}

export const getApiErrorMessage = (error: any): string => {
  const detail = error?.response?.data?.detail
  if (Array.isArray(detail)) return detail.map((err: any) => err.msg).join(", ")
  if (typeof detail === "string") return detail
  return error?.response?.data?.message || error?.message || "Something went wrong. Please try again."
}

export const taxonomyName = (value: BlogTaxonomy | string | null | undefined) =>
  typeof value === "string" ? value : value?.name ?? ""

export const taxonomySlug = (value: BlogTaxonomy | string | null | undefined) =>
  typeof value === "string"
    ? value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
    : value?.slug ?? ""

export const formatBlogDate = (value: string | null | undefined) => {
  if (!value) return ""
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  return date.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })
}
