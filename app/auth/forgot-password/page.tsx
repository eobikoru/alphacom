"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Mail, ArrowLeft, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AppLayout } from "@/components/app-layout"
import { forgotPassword } from "@/lib/api/auth"
import { toast } from "sonner"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await forgotPassword({ email })
      setIsSuccess(true)
      toast.success("Password reset link sent to your email")
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to send reset link")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <AppLayout showHeader={true} showFooter={true}>
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-400/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>

          <div className="relative z-10 w-full max-w-md">
            <Card className="shadow-2xl border-0 bg-card/90 backdrop-blur-xl">
              <CardHeader className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-foreground">Check Your Email</CardTitle>
                <CardDescription className="text-muted-foreground">
                  We've sent a password reset link to <span className="font-semibold text-foreground">{email}</span>
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Click the link in the email to reset your password. The link will expire in 1 hour.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Didn't receive the email? Check your spam folder or{" "}
                    <button
                      onClick={() => setIsSuccess(false)}
                      className="text-cyan-600 hover:text-cyan-700 font-medium"
                    >
                      try again
                    </button>
                    .
                  </p>
                </div>

                <Link href="/auth/signin">
                  <Button className="w-full bg-gradient-to-r from-cyan-600 to-purple-700 hover:from-cyan-700 hover:to-purple-800 text-white font-semibold py-3 rounded-xl">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Sign In
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout showHeader={true} showFooter={true}>
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-400/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 w-full max-w-md">
          <Card className="shadow-2xl border-0 bg-card/90 backdrop-blur-xl">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">Forgot Password?</CardTitle>
              <CardDescription className="text-muted-foreground">
                No worries! Enter your email and we'll send you a reset link
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-cyan-500 focus:ring-cyan-500"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-cyan-600 to-purple-700 hover:from-cyan-700 hover:to-purple-800 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending...</span>
                    </div>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </form>

              <div className="text-center">
                <Link
                  href="/auth/signin"
                  className="text-sm text-cyan-600 hover:text-cyan-700 font-medium inline-flex items-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to Sign In
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
