"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import * as Dialog from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { NEWSLETTER_SETTLED_EVENT } from "@/components/newsletter-welcome"

const PROMO_KEY = "alphacom-black-friday-promo"
const HIDDEN_PREFIXES = ["/checkout", "/payment", "/auth"]
const REVEAL_DELAY_MS = 280

function alreadySeen() {
  try {
    return sessionStorage.getItem(PROMO_KEY) === "seen"
  } catch {
    return false
  }
}

export function BlackFridayModal() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (HIDDEN_PREFIXES.some((prefix) => pathname?.startsWith(prefix))) return
    if (alreadySeen()) return

    let timer = 0
    const reveal = () => {
      if (alreadySeen()) return
      window.clearTimeout(timer)
      timer = window.setTimeout(() => setOpen(true), REVEAL_DELAY_MS)
    }

    window.addEventListener(NEWSLETTER_SETTLED_EVENT, reveal)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener(NEWSLETTER_SETTLED_EVENT, reveal)
    }
  }, [pathname])

  const close = () => {
    try {
      sessionStorage.setItem(PROMO_KEY, "seen")
    } catch {
      // Private mode can block storage. The offer simply returns next visit.
    }
    setOpen(false)
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) close()
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[120] bg-stone-950/55 backdrop-blur-[3px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[130] flex max-h-[min(100dvh-1.25rem,46rem)] w-[min(100%-1.25rem,28rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#0c1733] text-white shadow-[0_28px_90px_-32px_rgba(12,23,51,0.85)] outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:w-[min(100%-2rem,32rem)]">
          <Dialog.Close
            className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-[#0c1733]/70 text-white transition-colors hover:bg-[#0c1733]"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </Dialog.Close>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <Link href="/categories" onClick={close} className="block">
              <img
                src="/black-friday.png"
                alt="Alphacom Black Friday sales. Shop now."
                className="aspect-square w-full object-cover"
              />
            </Link>
            <div className="px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
              <Dialog.Title className="text-lg font-medium leading-snug tracking-tight text-white sm:text-xl">
                Up to 20% off this season
              </Dialog.Title>
              <Dialog.Description className="mt-2 text-sm leading-relaxed text-white/70">
                Get up to 20% discounts on all our products this Black Friday season.
              </Dialog.Description>
              <Link
                href="/categories"
                onClick={close}
                className="mt-5 flex h-12 items-center justify-center rounded-full bg-[#8E1B2C] text-sm font-medium text-white transition-colors hover:bg-[#741625]"
              >
                Shop now
              </Link>
              <button
                type="button"
                onClick={close}
                className="mt-2 w-full py-2 text-sm text-white/60 transition-colors hover:text-white"
              >
                Continue browsing
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
