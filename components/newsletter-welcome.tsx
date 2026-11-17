"use client"

import { useEffect, useState, type FormEvent } from "react"
import { usePathname } from "next/navigation"
import * as Dialog from "@radix-ui/react-dialog"
import { X } from "lucide-react"

export const NEWSLETTER_PROMPT_KEY = "alphacom-newsletter-prompt"

const SHOW_DELAY_MS = 1600
const HIDDEN_PREFIXES = ["/checkout", "/payment", "/auth"]

export function rememberNewsletterPrompt(value: "subscribed" | "dismissed") {
  try {
    localStorage.setItem(NEWSLETTER_PROMPT_KEY, value)
  } catch {
    // Private mode can block storage. The prompt simply returns next visit.
  }
}

function InboxIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 280 230" fill="none" aria-hidden className={className}>
      <circle cx="140" cy="116" r="90" fill="white" fillOpacity="0.08" />
      <circle cx="222" cy="46" r="14" fill="white" fillOpacity="0.14" />

      <g transform="rotate(-7 90 120)">
        <rect x="24" y="40" width="124" height="154" rx="18" fill="#F8ECEE" />
        <rect x="38" y="54" width="96" height="82" rx="14" fill="white" />
        <path d="M52 102v-5a18 14 0 0 1 36 0v5" stroke="#8E1B2C" strokeWidth="3.2" strokeLinecap="round" />
        <rect x="42" y="96" width="13" height="20" rx="5" fill="#8E1B2C" />
        <rect x="85" y="96" width="13" height="20" rx="5" fill="#8E1B2C" />
        <rect x="46" y="152" width="76" height="6" rx="3" fill="#8E1B2C" fillOpacity="0.22" />
        <rect x="46" y="166" width="48" height="6" rx="3" fill="#8E1B2C" fillOpacity="0.14" />
      </g>

      <rect x="144" y="78" width="92" height="54" rx="10" fill="white" stroke="#F3D4D9" />
      <rect x="158" y="94" width="42" height="5" rx="2.5" fill="#8E1B2C" fillOpacity="0.7" />
      <rect x="158" y="106" width="60" height="4" rx="2" fill="#8E1B2C" fillOpacity="0.2" />
      <rect x="158" y="116" width="34" height="4" rx="2" fill="#8E1B2C" fillOpacity="0.12" />
      <rect x="128" y="112" width="124" height="82" rx="16" fill="white" />
      <path d="M128 130 L190 166 L252 130" stroke="#8E1B2C" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />

      <circle cx="230" cy="86" r="16" fill="#8E1B2C" stroke="white" strokeWidth="3" />
      <path d="M224 86.5l3.6 3.6 7.2-7.4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function hasSeenPrompt() {
  try {
    return Boolean(localStorage.getItem(NEWSLETTER_PROMPT_KEY))
  } catch {
    return true
  }
}

export function NewsletterWelcome() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (HIDDEN_PREFIXES.some((prefix) => pathname?.startsWith(prefix))) return
    if (hasSeenPrompt()) return

    const timer = window.setTimeout(() => setOpen(true), SHOW_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [pathname])

  const close = (reason: "subscribed" | "dismissed") => {
    rememberNewsletterPrompt(reason)
    setOpen(false)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError("Enter a valid email address.")
      return
    }

    setError("")
    setSubmitting(true)
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      })
      const data = await response.json().catch(() => null)
      if (response.ok && data?.success) {
        setDone(true)
        rememberNewsletterPrompt("subscribed")
        return
      }
      setError(data?.message ?? "We couldn't subscribe you right now. Please try again.")
    } catch {
      setError("We couldn't subscribe you right now. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) close(done ? "subscribed" : "dismissed")
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-stone-950/50 backdrop-blur-[3px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[110] w-[min(100%-1.5rem,44rem)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[28px] border border-stone-200/80 bg-white shadow-[0_28px_90px_-32px_rgba(28,25,23,0.55)] outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 dark:border-white/10 dark:bg-stone-950">
          <div className="grid sm:grid-cols-[minmax(0,15.5rem)_minmax(0,1fr)]">
            <aside className="relative flex items-center gap-3 bg-[#8E1B2C] px-5 py-4 text-white sm:flex-col sm:items-center sm:justify-center sm:gap-5 sm:px-7 sm:py-8">
              <img src="/alpd.png" alt="Alphacom" className="hidden h-9 w-auto sm:block" />
              <InboxIllustration className="h-[4.5rem] w-[5.5rem] shrink-0 sm:h-52 sm:w-full" />
              <div className="min-w-0 sm:mt-2">
                <img src="/alpd.png" alt="Alphacom" className="mb-1 h-7 w-auto sm:hidden" />
                <p className="mt-1 text-sm font-medium leading-snug text-white sm:mt-3 sm:text-[1.35rem] sm:leading-tight">
                  Deals, launches, and notes worth opening.
                </p>
              </div>
            </aside>

            <div className="relative px-6 py-7 sm:px-8 sm:py-9">
              <Dialog.Close
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 text-stone-500 transition-colors hover:border-stone-300 hover:bg-stone-50 hover:text-stone-900 dark:border-white/10 dark:text-stone-400 dark:hover:bg-white/5 dark:hover:text-white"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </Dialog.Close>

              {done ? (
                <div className="pr-8 pt-6 sm:pt-8">
                  <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#8E1B2C] dark:text-rose-300">You're in</p>
                  <Dialog.Title className="mt-3 text-[1.75rem] font-semibold tracking-tight text-stone-950 dark:text-white">
                    Welcome to the list.
                  </Dialog.Title>
                  <Dialog.Description className="mt-3 max-w-sm text-sm leading-relaxed text-stone-500 dark:text-stone-400">
                    Exclusive deals, new product launches, and tech insights will arrive in your inbox.
                  </Dialog.Description>
                  <button
                    type="button"
                    onClick={() => close("subscribed")}
                    className="mt-8 h-12 rounded-full bg-[#8E1B2C] px-6 text-sm font-medium text-white transition-colors hover:bg-[#741625] dark:bg-rose-300 dark:text-stone-950 dark:hover:bg-rose-200"
                  >
                    Continue shopping
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="pr-8 pt-1 sm:pt-6">
                  <Dialog.Title className="text-[1.55rem] font-semibold leading-tight tracking-tight text-stone-950 dark:text-white sm:text-[1.85rem]">
                    Stay updated with the latest tech
                  </Dialog.Title>
                  <Dialog.Description className="mt-3 max-w-sm text-sm leading-relaxed text-stone-500 dark:text-stone-400">
                    Get exclusive deals, new product launches, and tech insights delivered to your inbox.
                  </Dialog.Description>

                  <label htmlFor="welcome-email" className="mt-7 block text-sm font-medium text-stone-700 dark:text-stone-300">
                    Email address
                  </label>
                  <input
                    id="welcome-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value)
                      if (error) setError("")
                    }}
                    placeholder="you@email.com"
                    disabled={submitting}
                    className="mt-2 h-12 w-full rounded-full border border-stone-200 bg-white px-4 text-sm text-stone-950 outline-none transition-colors placeholder:text-stone-400 focus:border-[#8E1B2C] disabled:opacity-60 dark:border-white/10 dark:bg-stone-900 dark:text-white dark:placeholder:text-stone-500 dark:focus:border-rose-300"
                  />
                  {error ? <p className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p> : null}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-4 h-12 w-full rounded-full bg-[#8E1B2C] text-sm font-medium text-white transition-colors hover:bg-[#741625] disabled:opacity-60 dark:bg-rose-300 dark:text-stone-950 dark:hover:bg-rose-200"
                  >
                    {submitting ? "Subscribing..." : "Subscribe"}
                  </button>
                  <button
                    type="button"
                    onClick={() => close("dismissed")}
                    className="mt-3 w-full py-2 text-sm text-stone-500 transition-colors hover:text-stone-900 dark:text-stone-400 dark:hover:text-white"
                  >
                    Maybe later
                  </button>
                </form>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
