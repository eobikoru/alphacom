import { configureStore } from "@reduxjs/toolkit"
import { combineReducers } from "@reduxjs/toolkit"
import themeReducer from "./slices/themeSlice"
import authReducer from "./slices/authSlice"
import wishlistReducer from "./slices/wishlistSlice"
import cartReducer from "./slices/cartSlice"
import checkoutReducer from "./slices/checkoutSlice"

const rootReducer = combineReducers({
  theme: themeReducer,
  auth: authReducer,
  wishlist: wishlistReducer,
  cart: cartReducer,
  checkout: checkoutReducer,
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: true,
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
