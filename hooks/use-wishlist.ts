import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/store/store"
import { addItem, clearWishlist, removeItem } from "@/store/slices/wishlistSlice"


interface WishlistItem {
  id: string
  name: string
  price: number
  image: string
  category: string
  brand: string
}

export function useWishlist() {
  const dispatch = useDispatch<AppDispatch>()
  const wishlistState = useSelector((state: RootState) => state.wishlist)

  const addToWishlist = (item: WishlistItem) => {
    dispatch(addItem(item))
  }

  const removeFromWishlist = (itemId: string) => {
    dispatch(removeItem(itemId))
  }

  const clearAllWishlist = () => {
    dispatch(clearWishlist())
  }

  const isInWishlist = (itemId: string) => {
    return wishlistState.items.some((item) => item.id === itemId)
  }

  return {
    items: wishlistState.items,
    itemCount: wishlistState.itemCount,
    addToWishlist,
    removeFromWishlist,
    clearWishlist: clearAllWishlist,
    isInWishlist,
  }
}
