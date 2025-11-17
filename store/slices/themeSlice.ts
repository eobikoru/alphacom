import { createSlice } from "@reduxjs/toolkit"

interface ThemeState {
  mode: any
  isDark: boolean
  isHydrated: boolean
}

const initialState: ThemeState = {
  isDark: false,
  isHydrated: false,
  mode: undefined
}

const saveToLocalStorage = (isDark: boolean) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("theme", JSON.stringify({ isDark }))
    } catch (error) {
      console.error("Failed to save theme to localStorage:", error)
    }
  }
}

const loadFromLocalStorage = (): boolean => {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("theme")
      if (saved) {
        const { isDark } = JSON.parse(saved)
        return isDark
      }
    } catch (error) {
      console.error("Failed to load theme from localStorage:", error)
    }
  }
  return false // Default to light theme
}

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    hydrate: (state) => {
      state.isDark = loadFromLocalStorage()
      state.isHydrated = true
    },
    toggleTheme: (state) => {
      state.isDark = !state.isDark
      saveToLocalStorage(state.isDark)
    },
    setTheme: (state, action) => {
      state.isDark = action.payload
      saveToLocalStorage(state.isDark)
    },
  },
})

export const { toggleTheme, setTheme, hydrate } = themeSlice.actions
export default themeSlice.reducer
