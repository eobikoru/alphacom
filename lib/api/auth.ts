import apiClient from "../api-client"
import { jwtDecode } from "jwt-decode"
import type { User } from "@/types/auth"

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface LoginRequest {
  username: string
  password: string
  grant_type?: string
  scope?: string
  client_id?: string | null
  client_secret?: string | null
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface DecodedToken {
  user_id: string
  username: string
  email: string
  is_admin: boolean
  is_super_admin: boolean
  exp: number
  type: "access" | "refresh"
}

export interface ChangePasswordRequest {
  old_password: string
  new_password: string
  confirm_password: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  new_password: string
  confirm_password: string
}

export const decodeToken = (token: string): DecodedToken => {
  return jwtDecode<DecodedToken>(token)
}

// Register user
export const registerUser = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await apiClient.post("/api/v1/users/register", data)
  return response.data
}

// Login user (form-urlencoded)
export const loginUser = async (username: string, password: string): Promise<AuthResponse> => {
  console.log("[v0] loginUser API function called")
  console.log("[v0] Username:", username)
  console.log("[v0] API Base URL:", apiClient.defaults.baseURL)

  const formData = new URLSearchParams()
  formData.append("username", username)
  formData.append("password", password)
  formData.append("grant_type", "password")

  console.log("[v0] Form data prepared:", formData.toString())

  try {
    const response = await apiClient.post("/api/v1/users/login", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
    console.log("[v0] Login API response:", response.data)
    return response.data
  } catch (error: any) {
    console.error("[v0] Login API error:", error)
    console.error("[v0] Error response:", error.response?.data)
    console.error("[v0] Error status:", error.response?.status)
    throw error
  }
}

// Get current user
export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get("/api/v1/users/me")
  return response.data
}

// Change password
export const changePassword = async (data: ChangePasswordRequest): Promise<void> => {
  await apiClient.post("/api/v1/users/change-password", data)
}

export const forgotPassword = async (data: ForgotPasswordRequest): Promise<{ message: string }> => {
  const response = await apiClient.post("/api/v1/users/forgot-password", data)
  return response.data
}

export const resetPassword = async (data: ResetPasswordRequest): Promise<{ message: string }> => {
  const response = await apiClient.post("/api/v1/users/reset-password", data)
  return response.data
}
