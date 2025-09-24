import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  brand: string
  category: string
  quantity: number
}

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
}

const loadCartFromStorage = (): CartState => {
  if (typeof window !== "undefined") {
    try {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        return JSON.parse(savedCart)
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error)
    }
  }
  return {
    items: [],
    total: 0,
    itemCount: 0,
  }
}

const initialState: CartState = loadCartFromStorage()

const calculateTotals = (items: CartItem[]) => {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  return { itemCount, total }
}

const saveCartToStorage = (state: CartState) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("cart", JSON.stringify(state))
    } catch (error) {
      console.error("Error saving cart to localStorage:", error)
    }
  }
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, "quantity">>) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id)

      if (existingItem) {
        existingItem.quantity += 1
      } else {
        state.items.push({ ...action.payload, quantity: 1 })
      }

      const totals = calculateTotals(state.items)
      state.total = totals.total
      state.itemCount = totals.itemCount

      saveCartToStorage(state)
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
      const totals = calculateTotals(state.items)
      state.total = totals.total
      state.itemCount = totals.itemCount

      saveCartToStorage(state)
    },

    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find((item) => item.id === action.payload.id)
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter((item) => item.id !== action.payload.id)
        } else {
          item.quantity = action.payload.quantity
        }
      }
      const totals = calculateTotals(state.items)
      state.total = totals.total
      state.itemCount = totals.itemCount

      saveCartToStorage(state)
    },

    clearCart: (state) => {
      state.items = []
      state.total = 0
      state.itemCount = 0

      saveCartToStorage(state)
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer
