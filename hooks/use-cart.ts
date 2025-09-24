import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/store/store"
import { addToCart, removeFromCart, updateQuantity, clearCart, type CartItem } from "@/store/slices/cartSlice"

export const useCart = () => {
  const dispatch = useDispatch()
  const { items, total, itemCount } = useSelector((state: RootState) => state.cart)

  const addItem = (item: Omit<CartItem, "quantity">) => {
    dispatch(addToCart(item))
  }

  const removeItem = (id: string) => {
    dispatch(removeFromCart(id))
  }

  const updateItemQuantity = (id: string, quantity: number) => {
    dispatch(updateQuantity({ id, quantity }))
  }

  const clearAllItems = () => {
    dispatch(clearCart())
  }

  const isInCart = (id: string) => {
    return items.some((item) => item.id === id)
  }

  const getItemQuantity = (id: string) => {
    const item = items.find((item) => item.id === id)
    return item ? item.quantity : 0
  }

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`
  }

  return {
    items,
    total,
    itemCount,
    addItem,
    removeItem,
    updateItemQuantity,
    clearAllItems,
    isInCart,
    getItemQuantity,
    formatPrice,
  }
}
