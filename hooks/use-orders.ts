"use client"

import { useMutation, useQuery } from "@tanstack/react-query"
import {
  guestCheckout,
  authenticatedCheckout,
  verifyPayment,
  trackOrder,
  type GuestCheckoutRequest,
  type AuthenticatedCheckoutRequest,
  type TrackOrderRequest,
  OrderBreakdownRequest,
  orderBreakdown,
} from "@/lib/api/orders"
import { toast } from "sonner"

function getErrorMessage(error: any): string {
  const detail = error.response?.data?.detail

  if (Array.isArray(detail)) {
    return detail.map((err: any) => err.msg).join(", ")
  }

  // Handle string error message
  if (typeof detail === "string") {
    return detail
  }

  // Fallback
  return error.response?.data?.message || error.message || "An error occurred. Please try again."
}

export function useGuestCheckout() {
  return useMutation({
    mutationFn: (data: GuestCheckoutRequest) => guestCheckout(data),
    onSuccess: (data) => {
      toast.success("Redirecting to payment...")
    },
    onError: (error: any) => {
     
      const errorMessage = getErrorMessage(error)
      console.log(errorMessage,"errorMessage")
      toast.error(errorMessage)
    },
  })
}

export function useAuthenticatedCheckout() {
  return useMutation({
    mutationFn: (data: AuthenticatedCheckoutRequest) => authenticatedCheckout(data),
    onSuccess: (data) => {
      toast.success("Redirecting to payment...")
    },
    onError: (error: any) => {
      const errorMessage = getErrorMessage(error)
      console.log(errorMessage,"errorMessage")
      toast.error(errorMessage)
    },
  })
}

export function useVerifyPayment(reference: string | null) {
  return useQuery({
    queryKey: ["verify-payment", reference],
    queryFn: () => verifyPayment(reference!),
    enabled: !!reference,
    retry: 3,
    retryDelay: 1000,
  })
}

export function useTrackOrder() {
  return useMutation({
    mutationFn: (data: TrackOrderRequest) => trackOrder(data),
    onSuccess: (data) => {
      toast.success("Order found!")
    },
    onError: (error: any) => {
      const errorMessage = getErrorMessage(error)
      console.log(errorMessage,"errorMessage")
      toast.error(errorMessage)
    },
  })
}
export function useOrderBreakdown() {
  return useMutation({
    mutationFn: (data: OrderBreakdownRequest) => orderBreakdown(data),
    onSuccess: (data) => {
      // toast.success("Order breakdown calculated!")
    },
    onError: (error: any) => {
      const errorMessage = getErrorMessage(error)
      console.log(errorMessage, "errorMessage")
      toast.error(errorMessage)
    },
  })
}