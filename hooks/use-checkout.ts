import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { updateCheckoutField, updateCheckoutForm, clearCheckoutForm } from "@/store/slices/checkoutSlice"
import type { CheckoutFormData } from "@/store/slices/checkoutSlice"

export const useCheckout = () => {
  const dispatch = useDispatch()
  const formData = useSelector((state: RootState) => state.checkout.formData)

  const updateField = (field: keyof CheckoutFormData, value: string) => {
    dispatch(updateCheckoutField({ field, value }))
  }

  const updateForm = (data: Partial<CheckoutFormData>) => {
    dispatch(updateCheckoutForm(data))
  }

  const clearForm = () => {
    dispatch(clearCheckoutForm())
  }

  return {
    formData,
    updateField,
    updateForm,
    clearForm,
  }
}
