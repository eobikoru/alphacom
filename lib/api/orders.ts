import apiClient from "../api-client"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export interface CheckoutItem {
  product_id: string
  quantity: number
}

export interface ShippingAddress {
  street: string
  city: string
  state: string
  phone: string
}

export interface GuestCheckoutRequest {
  callback_url: string
  email: string
  name: string
  phone: string
  items: CheckoutItem[]
  shipping_address: ShippingAddress
  notes?: string
}

export interface AuthenticatedCheckoutRequest {
  callback_url: string
  items: CheckoutItem[]
  shipping_address: ShippingAddress
}

export interface CheckoutResponse {
  order_id: string
  order_number: string
  reference: string
  payment_url: string
  access_code: string
  amount: number
  currency: string
}

export interface PaymentVerificationResponse {
  status: string
  message: string
  order_number: string
  payment_status: string
  amount: number
}

export interface TrackOrderRequest {
  order_number: string
  email: string
}

export interface OrderTimeline {
  status: string
  timestamp: string
  description: string
}

export interface TrackOrderResponse {
  order_number: string
  status: string
  payment_status: string
  total_amount: number
  currency: string
  tracking_number: string | null
  estimated_delivery: string
  items: any[]
  timeline: OrderTimeline[]
}

export const guestCheckout = async (data: GuestCheckoutRequest): Promise<CheckoutResponse> => {
  const response = await apiClient.post("/api/v1/orders/checkout/guest", data)
  return response.data
}

export const authenticatedCheckout = async (data: AuthenticatedCheckoutRequest): Promise<CheckoutResponse> => {
  const response = await apiClient.post("/api/v1/orders/checkout", data)
  return response.data
}

export const verifyPayment = async (reference: string): Promise<PaymentVerificationResponse> => {
  const response = await apiClient.get(`/api/v1/orders/verify/${reference}`)
  return response.data
}

export const trackOrder = async (data: TrackOrderRequest): Promise<TrackOrderResponse> => {
  const response = await apiClient.post("/api/v1/orders/track", data)
  return response.data
}
