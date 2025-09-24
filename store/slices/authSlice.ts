import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

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

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: true,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true
      state.user = action.payload
      state.loading = false
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.user = null
      state.loading = false
    },
    setAuthFromStorage: (state, action: PayloadAction<{ user: User; isAuthenticated: boolean }>) => {
      state.isAuthenticated = action.payload.isAuthenticated
      state.user = action.payload.user
      state.loading = false
    },
  },
})

export const { setLoading, loginSuccess, logout, setAuthFromStorage } = authSlice.actions
export default authSlice.reducer
