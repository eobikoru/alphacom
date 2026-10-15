"use client"

import { keepPreviousData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createBlogComment,
  getBlogComments,
  type CreateBlogCommentRequest,
  getBlogCategories,
  getBlogPost,
  getBlogPosts,
  getBlogTags,
  type GetBlogPostsParams,
} from "@/lib/api/blog"

export function useBlogPosts(params?: GetBlogPostsParams, enabled = true) {
  return useQuery({
    queryKey: ["blog-posts", params],
    queryFn: () => getBlogPosts(params),
    placeholderData: keepPreviousData,
    enabled,
  })
}

export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: ["blog-post", slug],
    queryFn: () => getBlogPost(slug),
    enabled: !!slug,
    retry: false,
  })
}

export function useBlogComments(slug: string, perPage = 20) {
  return useInfiniteQuery({
    queryKey: ["blog-comments", slug, perPage],
    queryFn: ({ pageParam }) => getBlogComments(slug, { page: pageParam, per_page: perPage }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.pagination?.has_next ? lastPage.pagination.page + 1 : undefined),
    enabled: !!slug,
  })
}

export function useCreateBlogComment(slug: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateBlogCommentRequest) => createBlogComment(slug, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-comments", slug] })
      queryClient.invalidateQueries({ queryKey: ["blog-post", slug] })
    },
  })
}

export function useBlogCategories() {
  return useQuery({
    queryKey: ["blog-categories"],
    queryFn: getBlogCategories,
    staleTime: 5 * 60 * 1000,
  })
}

export function useBlogTags() {
  return useQuery({
    queryKey: ["blog-tags"],
    queryFn: getBlogTags,
    staleTime: 5 * 60 * 1000,
  })
}
