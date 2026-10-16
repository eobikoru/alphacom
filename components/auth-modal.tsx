"use client"

import type React from "react"
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import Link from "next/link"
import * as Dialog from "@radix-ui/react-dialog"
import { Eye, EyeOff, Lock, Mail, Phone, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"

type AuthMode = "signin" | "signup"

interface AuthModalContextValue {
  openAuth: (mode?: AuthMode) => void
  closeAuth: () => void
}

const AuthModalContext = createContext<AuthModalContextValue | null>(null)

export function useAuthModal() {
  const context = useContext(AuthModalContext)
  if (!context) throw new Error("useAuthModal must be used within AuthModalProvider")
  return context
}

const fieldClass =
  "h-11 rounded-xl border-stone-200 bg-white text-stone-900 shadow-none placeholder:text-stone-400 focus-visible:border-[#8E1B2C] focus-visible:ring-[#8E1B2C]/15 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-stone-500 dark:focus-visible:border-rose-300 dark:focus-visible:ring-rose-300/20"

const labelClass = "mb-2 block text-[13px] font-medium text-stone-700 dark:text-stone-300"

const linkClass = "font-medium text-[#8E1B2C] transition-colors hover:text-[#741625] dark:text-rose-300 dark:hover:text-rose-200"

const submitClass =
  "h-12 w-full rounded-full bg-[#8E1B2C] text-sm font-medium text-white transition-colors hover:bg-[#741625] disabled:opacity-60 dark:bg-rose-300 dark:text-stone-950 dark:hover:bg-rose-200"

const iconClass = "pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400 dark:text-stone-500"

function SignInForm({ onSwitch, onSuccess }: { onSwitch: () => void; onSuccess: () => void }) {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { login, isLoading } = useAuth()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      await login(email, password)
      onSuccess()
    } catch {
      // The auth hook already shows the error.
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="auth-email" className={labelClass}>
          Email Address
        </label>
        <div className="relative">
          <Mail className={iconClass} />
          <Input
            id="auth-email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={`pl-10 ${fieldClass}`}
            autoComplete="email"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="auth-password" className={labelClass}>
          Password
        </label>
        <div className="relative">
          <Lock className={iconClass} />
          <Input
            id="auth-password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={`pl-10 pr-11 ${fieldClass}`}
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 transition-colors hover:text-stone-700 dark:hover:text-stone-200"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <label className="flex items-center gap-2.5 text-sm text-stone-500 dark:text-stone-400">
        <input type="checkbox" className="h-4 w-4 rounded border-stone-300 accent-[#8E1B2C] dark:accent-rose-300" />
        Remember me
      </label>

      <Button type="submit" disabled={isLoading} className={submitClass}>
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Signing in...
          </span>
        ) : (
          "Sign In"
        )}
      </Button>

      <p className="text-center text-sm text-stone-500 dark:text-stone-400">
        Don&apos;t have an account?{" "}
        <button type="button" onClick={onSwitch} className={linkClass}>
          Sign up
        </button>
      </p>
    </form>
  )
}

function SignUpForm({ onSwitch, onSuccess }: { onSwitch: () => void; onSuccess: () => void }) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { register, isLoading } = useAuth()
  const { closeAuth } = useAuthModal()

  const handleInputChange = (field: string, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }))
    if (errors[field]) setErrors((current) => ({ ...current, [field]: "" }))
  }

  const validateForm = () => {
    const nextErrors: Record<string, string> = {}
    if (!formData.firstName.trim()) nextErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) nextErrors.lastName = "Last name is required"
    if (!formData.email.trim()) nextErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) nextErrors.email = "Please enter a valid email address"
    if (!formData.phone.trim()) nextErrors.phone = "Phone number is required"
    if (!formData.password) nextErrors.password = "Password is required"
    else if (formData.password.length < 8) nextErrors.password = "Password must be at least 8 characters long"
    if (!formData.confirmPassword) nextErrors.confirmPassword = "Please confirm your password"
    else if (formData.password !== formData.confirmPassword) nextErrors.confirmPassword = "Passwords do not match"
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!validateForm()) return
    try {
      await register(formData.email, formData.password)
      onSuccess()
    } catch {
      // The auth hook already shows the error.
    }
  }

  const invalidClass = (field: string) => (errors[field] ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "")

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="auth-first-name" className={labelClass}>
            First Name
          </label>
          <Input
            id="auth-first-name"
            type="text"
            placeholder="John"
            value={formData.firstName}
            onChange={(event) => handleInputChange("firstName", event.target.value)}
            className={`${fieldClass} ${invalidClass("firstName")}`}
            autoComplete="given-name"
            required
          />
          {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
        </div>
        <div>
          <label htmlFor="auth-last-name" className={labelClass}>
            Last Name
          </label>
          <Input
            id="auth-last-name"
            type="text"
            placeholder="Doe"
            value={formData.lastName}
            onChange={(event) => handleInputChange("lastName", event.target.value)}
            className={`${fieldClass} ${invalidClass("lastName")}`}
            autoComplete="family-name"
            required
          />
          {errors.lastName && <p className="text-xs text-red-500">{errors.lastName}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="auth-signup-email" className={labelClass}>
          Email Address
        </label>
        <div className="relative">
          <Mail className={iconClass} />
          <Input
            id="auth-signup-email"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={(event) => handleInputChange("email", event.target.value)}
            className={`pl-10 ${fieldClass} ${invalidClass("email")}`}
            autoComplete="email"
            required
          />
        </div>
        {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="auth-phone" className={labelClass}>
          Phone Number
        </label>
        <div className="relative">
          <Phone className={iconClass} />
          <Input
            id="auth-phone"
            type="tel"
            placeholder="08176786654"
            value={formData.phone}
            onChange={(event) => handleInputChange("phone", event.target.value)}
            className={`pl-10 ${fieldClass} ${invalidClass("phone")}`}
            autoComplete="tel"
            required
          />
        </div>
        {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
      </div>

      <div>
        <label htmlFor="auth-signup-password" className={labelClass}>
          Password
        </label>
        <div className="relative">
          <Lock className={iconClass} />
          <Input
            id="auth-signup-password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
            value={formData.password}
            onChange={(event) => handleInputChange("password", event.target.value)}
            className={`pl-10 pr-11 ${fieldClass} ${invalidClass("password")}`}
            autoComplete="new-password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 transition-colors hover:text-stone-700 dark:hover:text-stone-200"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
      </div>

      <div>
        <label htmlFor="auth-confirm-password" className={labelClass}>
          Confirm Password
        </label>
        <div className="relative">
          <Lock className={iconClass} />
          <Input
            id="auth-confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(event) => handleInputChange("confirmPassword", event.target.value)}
            className={`pl-10 pr-11 ${fieldClass} ${invalidClass("confirmPassword")}`}
            autoComplete="new-password"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((current) => !current)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 transition-colors hover:text-stone-700 dark:hover:text-stone-200"
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
      </div>

      <label htmlFor="auth-terms" className="flex items-start gap-2.5 text-sm leading-relaxed text-stone-500 dark:text-stone-400">
        <input
          id="auth-terms"
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-stone-300 accent-[#8E1B2C] dark:accent-rose-300"
          required
        />
        <span>
          I agree to the{" "}
          <Link href="/terms" onClick={closeAuth} className={linkClass}>
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" onClick={closeAuth} className={linkClass}>
            Privacy Policy
          </Link>
        </span>
      </label>

      <Button type="submit" disabled={isLoading} className={submitClass}>
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Creating account...
          </span>
        ) : (
          "Create Account"
        )}
      </Button>

      <p className="text-center text-sm text-stone-500 dark:text-stone-400">
        Already have an account?{" "}
        <button type="button" onClick={onSwitch} className={linkClass}>
          Sign in
        </button>
      </p>
    </form>
  )
}

function AuthDialog({
  open,
  mode,
  onOpenChange,
  onModeChange,
}: {
  open: boolean
  mode: AuthMode
  onOpenChange: (open: boolean) => void
  onModeChange: (mode: AuthMode) => void
}) {
  const isSignIn = mode === "signin"
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) contentRef.current?.scrollTo({ top: 0 })
  }, [open, mode])

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[120] bg-stone-950/45 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          ref={contentRef}
          className="fixed left-1/2 top-1/2 z-[130] max-h-[min(100%-1.5rem,44rem)] w-[min(100%-1.5rem,28rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[28px] border border-stone-200/80 bg-white p-6 shadow-[0_24px_80px_-28px_rgba(28,25,23,0.45)] outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 dark:border-white/10 dark:bg-stone-950 dark:shadow-[0_24px_80px_-28px_rgba(0,0,0,0.7)] sm:p-8"
        >
          <div className="mb-7 flex items-start justify-between gap-4">
            <div>
              <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.28em] text-[#8E1B2C] dark:text-rose-300">
                Account
              </p>
              <Dialog.Title className="text-[1.75rem] font-semibold tracking-tight text-stone-950 dark:text-white">
                {isSignIn ? "Welcome back" : "Create account"}
              </Dialog.Title>
              <Dialog.Description className="mt-2 max-w-[16rem] text-sm leading-relaxed text-stone-500 dark:text-stone-400">
                {isSignIn ? "Sign in to continue shopping with Alphacom." : "Join Alphacom and start your shopping journey."}
              </Dialog.Description>
            </div>
            <Dialog.Close
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-stone-200 text-stone-500 transition-colors hover:border-stone-300 hover:bg-stone-50 hover:text-stone-900 dark:border-white/10 dark:text-stone-400 dark:hover:bg-white/5 dark:hover:text-white"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          {open &&
            (isSignIn ? (
              <SignInForm onSwitch={() => onModeChange("signup")} onSuccess={() => onOpenChange(false)} />
            ) : (
              <SignUpForm onSwitch={() => onModeChange("signin")} onSuccess={() => onModeChange("signin")} />
            ))}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<AuthMode>("signin")

  const openAuth = useCallback((nextMode: AuthMode = "signin") => {
    setMode(nextMode)
    setOpen(true)
  }, [])

  const closeAuth = useCallback(() => setOpen(false), [])

  return (
    <AuthModalContext.Provider value={{ openAuth, closeAuth }}>
      {children}
      <AuthDialog open={open} mode={mode} onOpenChange={setOpen} onModeChange={setMode} />
    </AuthModalContext.Provider>
  )
}
