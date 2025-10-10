"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { verifyPayment, type PaymentVerificationResponse } from "@/lib/api/orders"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/hooks/use-cart"

export default function PaymentVerifyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const reference = searchParams.get("reference")
  const { clearAllItems } = useCart()

  const [verificationResult, setVerificationResult] = useState<PaymentVerificationResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const verify = async () => {
      if (!reference) {
        setError("No payment reference found")
        setIsLoading(false)
        return
      }

      try {
        const result = await verifyPayment(reference)
        setVerificationResult(result)

        // Clear cart if payment was successful
        if (result.status === "success" && result.payment_status === "completed") {
          clearAllItems()
        }
      } catch (err: any) {
        console.error("Payment verification error:", err)
        setError(err.response?.data?.message || "Failed to verify payment")
      } finally {
        setIsLoading(false)
      }
    }

    verify()
  }, [reference, clearAllItems])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <Loader2 className="h-16 w-16 mx-auto text-primary animate-spin mb-4" />
            <h2 className="text-2xl font-bold mb-2">Verifying Payment</h2>
            <p className="text-muted-foreground">Please wait while we confirm your payment...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !verificationResult) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <XCircle className="h-16 w-16 mx-auto text-destructive mb-4" />
            <h2 className="text-2xl font-bold mb-2">Verification Failed</h2>
            <p className="text-muted-foreground mb-6">{error || "Unable to verify payment"}</p>
            <div className="flex gap-3 justify-center">
              <Link href="/categories">
                <Button variant="outline">Continue Shopping</Button>
              </Link>
              <Link href="/track">
                <Button>Track Order</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isSuccess = verificationResult.status === "success" && verificationResult.payment_status === "completed"

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6 text-center">
          {isSuccess ? (
            <>
              <CheckCircle2 className="h-16 w-16 mx-auto text-green-600 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
              <p className="text-muted-foreground mb-4">{verificationResult.message}</p>
              <div className="bg-muted rounded-lg p-4 mb-6">
                <p className="text-sm text-muted-foreground mb-1">Order Number</p>
                <p className="text-lg font-bold">{verificationResult.order_number}</p>
                <p className="text-sm text-muted-foreground mt-2 mb-1">Amount Paid</p>
                <p className="text-lg font-bold">₦{verificationResult.amount.toLocaleString()}</p>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                A confirmation email has been sent to your email address.
              </p>
              <div className="flex gap-3 justify-center">
                <Link href="/categories">
                  <Button variant="outline">Continue Shopping</Button>
                </Link>
                <Link href="/track">
                  <Button>Track Order</Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <XCircle className="h-16 w-16 mx-auto text-destructive mb-4" />
              <h2 className="text-2xl font-bold mb-2">Payment Failed</h2>
              <p className="text-muted-foreground mb-4">{verificationResult.message}</p>
              {verificationResult.order_number && (
                <div className="bg-muted rounded-lg p-4 mb-6">
                  <p className="text-sm text-muted-foreground mb-1">Order Number</p>
                  <p className="text-lg font-bold">{verificationResult.order_number}</p>
                </div>
              )}
              <div className="flex gap-3 justify-center">
                <Link href="/checkout">
                  <Button>Try Again</Button>
                </Link>
                <Link href="/categories">
                  <Button variant="outline">Continue Shopping</Button>
                </Link>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
