// Shared authentication types for the main app
export interface User {
    id: string
    email: string
    username: string
    is_active: boolean
    is_admin: boolean
    is_super_admin: boolean
  }
  
  export interface AuthState {
    isAuthenticated: boolean
    user: User | null
    loading: boolean
  }
  