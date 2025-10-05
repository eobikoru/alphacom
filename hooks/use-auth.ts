"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/store/store"
import { setLoading, loginSuccess, logout, setAuthFromStorage } from "@/store/slices/authSlice"
import { useMutation } from "@tanstack/react-query"
import { registerUser, loginUser, changePassword, decodeToken, type ChangePasswordRequest } from "@/lib/api/auth"
import { toast } from "sonner"

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>()
  const authState = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    // Check for existing session on mount
    const checkAuth = async () => {
      try {
        console.log("[v0] Checking for existing auth session...")
        const token = localStorage.getItem("auth_token")
        if (token) {
          console.log("[v0] Found existing token, decoding...")
          const decodedToken = decodeToken(token)
          console.log("[v0] Decoded token:", decodedToken)

          // Check if token is expired
          if (decodedToken.exp * 1000 < Date.now()) {
            console.log("[v0] Token expired, clearing storage")
            // Token expired, clear storage
            localStorage.removeItem("auth_token")
            localStorage.removeItem("refresh_token")
            localStorage.removeItem("user_data")
            dispatch(setLoading(false))
            return
          }

          // Create user object from decoded token
          const user = {
            id: decodedToken.user_id,
            username: decodedToken.username,
            email: decodedToken.email,
            is_admin: decodedToken.is_admin,
            is_super_admin: decodedToken.is_super_admin,
            is_active: true,
          }

          console.log("[v0] Restoring user session:", user)
          dispatch(setAuthFromStorage({ user, isAuthenticated: true }))
          return
        }
        console.log("[v0] No existing token found")
      } catch (error) {
        console.error("[v0] Auth check failed:", error)
        // Clear invalid tokens
        localStorage.removeItem("auth_token")
        localStorage.removeItem("refresh_token")
        localStorage.removeItem("user_data")
      }

      dispatch(setLoading(false))
    }

    checkAuth()
  }, [dispatch])

  const registerMutation = useMutation({
    mutationFn: (data: { username: string; email: string; password: string }) => registerUser(data),
    onSuccess: () => {
      console.log("[v0] Registration successful")
      toast.success("Account created successfully! Please sign in to continue.")
      dispatch(setLoading(false))
    },
    onError: (error: any) => {
      console.error("[v0] Registration failed:", error)
      toast.error(error.response?.data?.detail || error.response?.data?.message || "Registration failed")
      dispatch(setLoading(false))
    },
  })

  const loginMutation = useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) => {
      console.log("[v0] Attempting login with username:", username)
      return loginUser(username, password)
    },
    onSuccess: (data) => {
      console.log("[v0] Login API response received:", data)
      localStorage.setItem("auth_token", data.access_token)
      localStorage.setItem("refresh_token", data.refresh_token)
      console.log("[v0] Tokens stored in localStorage")

      const decodedToken = decodeToken(data.access_token)
      console.log("[v0] Decoded access token:", decodedToken)

      const user = {
        id: decodedToken.user_id,
        username: decodedToken.username,
        email: decodedToken.email,
        is_admin: decodedToken.is_admin,
        is_super_admin: decodedToken.is_super_admin,
        is_active: true,
      }

      console.log("[v0] User object created:", user)
      localStorage.setItem("user_data", JSON.stringify(user))
      dispatch(loginSuccess(user))
      console.log("[v0] Login success dispatched to Redux")
      toast.success(`Welcome back, ${user.username}!`)
    },
    onError: (error: any) => {
      console.error("[v0] Login failed:", error)
      console.error("[v0] Error response:", error.response?.data)
      toast.error(error.response?.data?.detail || error.response?.data?.message || "Login failed")
      dispatch(setLoading(false))
    },
  })

  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePasswordRequest) => changePassword(data),
    onSuccess: () => {
      console.log("[v0] Password changed successfully")
      toast.success("Password changed successfully!")
    },
    onError: (error: any) => {
      console.error("[v0] Password change failed:", error)
      toast.error(error.response?.data?.detail || error.response?.data?.message || "Failed to change password")
    },
  })

  const login = async (email: string, password: string) => {
    console.log("[v0] Login function called with email:", email)
    dispatch(setLoading(true))
    // Use email as username for login
    await loginMutation.mutateAsync({ username: email, password })
  }

  const register = async (email: string, password: string) => {
    console.log("[v0] Register function called with email:", email)
    dispatch(setLoading(true))
    // Create username from email
    const username = email.split("@")[0]
    await registerMutation.mutateAsync({ username, email, password })
  }

  const handleLogout = () => {
    console.log("[v0] Logout initiated")
    localStorage.removeItem("auth_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("user_data")
    dispatch(logout())
    toast.success("Logged out successfully")
  }

  const handleChangePassword = async (data: ChangePasswordRequest) => {
    await changePasswordMutation.mutateAsync(data)
  }

  return {
    ...authState,
    login,
    logout: handleLogout,
    register,
    changePassword: handleChangePassword,
    isLoading: loginMutation.isPending || registerMutation.isPending,
    isChangingPassword: changePasswordMutation.isPending,
  }
}
