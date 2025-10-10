"use client"

import type React from "react"
import { useRouter } from "next/navigation"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppSelector } from "@/store/hooks"
import { AppLayout } from "@/components/app-layout"
import { useAuth } from "@/hooks/use-auth"

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const theme = useAppSelector((state) => state.theme.mode)
  const { login, isLoading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Sign in form submitted")
    console.log("[v0] Email:", email)
    console.log("[v0] Password length:", password.length)

    try {
      console.log("[v0] Calling login function...")
      await login(email, password)
      console.log("[v0] Login successful, redirecting to home...")
      router.push("/")
    } catch (error) {
      console.error("[v0] Login error in component:", error)
    }
  }

  return (
    <AppLayout showHeader={true} showFooter={true}>
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-400/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 w-full max-w-md">
          <Card className="shadow-2xl border-0 bg-card/90 backdrop-blur-xl">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">Welcome Back</CardTitle>
              <CardDescription className="text-muted-foreground">
                Sign in to your account to continue shopping
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground mb-2 block">Email Address</label>
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

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground mb-2 block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-cyan-500 focus:ring-cyan-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remember"
                      className="w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 rounded focus:ring-cyan-500"
                    />
                    <label htmlFor="remember" className="text-sm text-muted-foreground">
                      Remember me
                    </label>
                  </div>
                  <Link href="/auth/forgot-password" className="text-sm text-cyan-600 hover:text-cyan-700 font-medium">
                    Forgot password?
                  </Link>
                </div>

                {/* Sign In Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-cyan-600 to-purple-700 hover:from-cyan-700 hover:to-purple-800 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>
              </form>

              {/* Sign Up Link */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link href="/auth/signup" className="text-cyan-600 hover:text-cyan-700 font-medium">
                    Sign up
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
