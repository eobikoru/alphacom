import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface CheckoutFormData {
  email: string
  name: string
  phone: string
  street: string
  city: string
  state: string
  notes: string
}

interface CheckoutState {
  formData: CheckoutFormData
}

const loadCheckoutFromStorage = (): CheckoutState => {
  if (typeof window !== "undefined") {
    try {
      const savedCheckout = localStorage.getItem("checkout")
      if (savedCheckout) {
        return JSON.parse(savedCheckout)
      }
    } catch (error) {
      console.error("Error loading checkout from localStorage:", error)
    }
  }
  return {
    formData: {
      email: "",
      name: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      notes: "",
    },
  }
}

const initialState: CheckoutState = loadCheckoutFromStorage()

const saveCheckoutToStorage = (state: CheckoutState) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("checkout", JSON.stringify(state))
    } catch (error) {
      console.error("Error saving checkout to localStorage:", error)
    }
  }
}

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    updateCheckoutField: (state, action: PayloadAction<{ field: keyof CheckoutFormData; value: string }>) => {
      state.formData[action.payload.field] = action.payload.value
      saveCheckoutToStorage(state)
    },

    updateCheckoutForm: (state, action: PayloadAction<Partial<CheckoutFormData>>) => {
      state.formData = { ...state.formData, ...action.payload }
      saveCheckoutToStorage(state)
    },

    clearCheckoutForm: (state) => {
      state.formData = {
        email: "",
        name: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        notes: "",
      }
      saveCheckoutToStorage(state)
    },
  },
})

export const { updateCheckoutField, updateCheckoutForm, clearCheckoutForm } = checkoutSlice.actions
export default checkoutSlice.reducer
