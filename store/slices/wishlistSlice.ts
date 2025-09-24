import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface WishlistItem {
  id: string
  name: string
  price: number
  image: string
  category: string
  brand: string
}

interface WishlistState {
  items: WishlistItem[]
  itemCount: number
}

const initialState: WishlistState = {
  items: [],
  itemCount: 0,
}

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<WishlistItem>) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id)

      if (!existingItem) {
        state.items.push(action.payload)
        state.itemCount = state.items.length
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
      state.itemCount = state.items.length
    },
    clearWishlist: (state) => {
      state.items = []
      state.itemCount = 0
    },
  },
})

export const { addItem, removeItem, clearWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer
