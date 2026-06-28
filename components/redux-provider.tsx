"use client"

import type React from "react"
import { useEffect } from "react"
import { Provider } from "react-redux"
import { store } from "@/store/store"
import { hydrate as hydrateCart } from "@/store/slices/cartSlice"
import { hydrate as hydrateCheckout } from "@/store/slices/checkoutSlice"

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    store.dispatch(hydrateCart())
    store.dispatch(hydrateCheckout())
  }, [])

  return <Provider store={store}>{children}</Provider>
}
