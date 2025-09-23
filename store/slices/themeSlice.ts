import { createSlice } from "@reduxjs/toolkit"

interface ThemeState {
  mode: any
  isDark: boolean
}

const initialState: ThemeState = {
  isDark: true,
  mode: undefined
}

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDark = !state.isDark
    },
    setTheme: (state, action) => {
      state.isDark = action.payload
    },
  },
})

export const { toggleTheme, setTheme } = themeSlice.actions
export default themeSlice.reducer
