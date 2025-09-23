"use client"

import { createContext, useContext, useState, type ReactNode, useEffect } from "react"

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
}

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  loading: boolean
}

interface AuthContextType {
  state: AuthState
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
  })

  useEffect(() => {
    // Check for existing session on mount
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("auth_token")
        if (token) {
          // In a real app, you'd validate the token with your backend
          const userData = localStorage.getItem("user_data")
          if (userData) {
            setState({
              isAuthenticated: true,
              user: JSON.parse(userData),
              loading: false,
            })
            return
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error)
      }

      setState((prev) => ({ ...prev, loading: false }))
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      // Mock login - in a real app, you'd call your authentication API
      const mockUser: User = {
        id: "1",
        email,
        firstName: "John",
        lastName: "Doe",
      }

      localStorage.setItem("auth_token", "mock_token")
      localStorage.setItem("user_data", JSON.stringify(mockUser))

      setState({
        isAuthenticated: true,
        user: mockUser,
        loading: false,
      })
    } catch (error) {
      throw new Error("Login failed")
    }
  }

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      // Mock registration - in a real app, you'd call your registration API
      const mockUser: User = {
        id: "1",
        email,
        firstName,
        lastName,
      }

      localStorage.setItem("auth_token", "mock_token")
      localStorage.setItem("user_data", JSON.stringify(mockUser))

      setState({
        isAuthenticated: true,
        user: mockUser,
        loading: false,
      })
    } catch (error) {
      throw new Error("Registration failed")
    }
  }

  const logout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_data")
    setState({
      isAuthenticated: false,
      user: null,
      loading: false,
    })
  }

  return <AuthContext.Provider value={{ state, login, logout, register }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
