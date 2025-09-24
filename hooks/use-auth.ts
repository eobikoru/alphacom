"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/store/store"
import { loginSuccess, logout, setAuthFromStorage, setLoading } from "@/store/slices/authSlice"


interface User {
  id: string
  email: string
  firstName: string
  lastName: string
}

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>()
  const authState = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    // Check for existing session on mount
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("auth_token")
        if (token) {
          const userData = localStorage.getItem("user_data")
          if (userData) {
            const user = JSON.parse(userData)
            dispatch(setAuthFromStorage({ user, isAuthenticated: true }))
            return
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error)
      }

      dispatch(setLoading(false))
    }

    checkAuth()
  }, [dispatch])

  const login = async (email: string, password: string) => {
    try {
      dispatch(setLoading(true))

      // Mock login - in a real app, you'd call your authentication API
      const mockUser: User = {
        id: "1",
        email,
        firstName: "John",
        lastName: "Doe",
      }

      localStorage.setItem("auth_token", "mock_token")
      localStorage.setItem("user_data", JSON.stringify(mockUser))

      dispatch(loginSuccess(mockUser))
    } catch (error) {
      dispatch(setLoading(false))
      throw new Error("Login failed")
    }
  }

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      dispatch(setLoading(true))

      // Mock registration - in a real app, you'd call your registration API
      const mockUser: User = {
        id: "1",
        email,
        firstName,
        lastName,
      }

      localStorage.setItem("auth_token", "mock_token")
      localStorage.setItem("user_data", JSON.stringify(mockUser))

      dispatch(loginSuccess(mockUser))
    } catch (error) {
      dispatch(setLoading(false))
      throw new Error("Registration failed")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_data")
    dispatch(logout())
  }

  return {
    ...authState,
    login,
    logout: handleLogout,
    register,
  }
}
