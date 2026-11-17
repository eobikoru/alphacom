"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { X } from "lucide-react"
import { getProductsWithCategories, type Product } from "@/lib/api/products"
import { cdnImage } from "@/lib/image-url"
import { productHref } from "@/lib/product-url"

const HIDDEN_PREFIXES = ["/checkout", "/payment", "/auth"]
const FIRST_DELAY_MS = 20000
const EVERY_MS = 5 * 60 * 1000
const VISIBLE_MS = 12000

function playChime(context: AudioContext) {
  const now = context.currentTime
  ;[523.25, 659.25].forEach((frequency, index) => {
    const osc = context.createOscillator()
    const gain = context.createGain()
    const start = now + index * 0.11
    osc.type = "sine"
    osc.frequency.value = frequency
    gain.gain.setValueAtTime(0.0001, start)
    gain.gain.exponentialRampToValueAtTime(0.045, start + 0.03)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.38)
    osc.connect(gain)
    gain.connect(context.destination)
    osc.start(start)
    osc.stop(start + 0.4)
  })
}

function timeAgoLabel() {
  const roll = Math.random()
  if (roll < 0.72) {
    const minutes = 1 + Math.floor(Math.random() * 59)
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`
  }
  const hours = 1 + Math.floor(Math.random() * 6)
  return hours === 1 ? "1 hour ago" : `${hours} hours ago`
}

export function LiveProductNote() {
  const pathname = usePathname()
  const pathnameRef = useRef(pathname)
  pathnameRef.current = pathname
  const [product, setProduct] = useState<Product | null>(null)
  const [timeAgo, setTimeAgo] = useState("8 minutes ago")
  const [open, setOpen] = useState(false)
  const productsRef = useRef<Product[]>([])
  const lastIdRef = useRef<string | null>(null)
  const audioRef = useRef<AudioContext | null>(null)
  const canPlayRef = useRef(false)
  const hiddenRoute = HIDDEN_PREFIXES.some((prefix) => pathname?.startsWith(prefix))

  useEffect(() => {
    const arm = () => {
      canPlayRef.current = true
    }
    window.addEventListener("pointerdown", arm, { once: true })
    window.addEventListener("keydown", arm, { once: true })
    return () => {
      window.removeEventListener("pointerdown", arm)
      window.removeEventListener("keydown", arm)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    let hideTimer = 0
    let showTimer = 0
    const schedule = (delay: number) => {
      showTimer = window.setTimeout(reveal, delay)
    }

    const pick = () => {
      const pool = productsRef.current.filter((item) => item.id !== lastIdRef.current)
      const list = pool.length > 0 ? pool : productsRef.current
      if (list.length === 0) return null
      return list[Math.floor(Math.random() * list.length)]
    }

    const reveal = () => {
      if (cancelled) return
      const onQuietPage = HIDDEN_PREFIXES.some((prefix) => pathnameRef.current?.startsWith(prefix))
      if (document.hidden || onQuietPage) {
        schedule(EVERY_MS)
        return
      }
      const next = pick()
      if (!next) return
      lastIdRef.current = next.id
      setProduct(next)
      setTimeAgo(timeAgoLabel())
      setOpen(true)

      if (canPlayRef.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const Context = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
        if (Context) {
          if (!audioRef.current) audioRef.current = new Context()
          const context = audioRef.current
          context.resume().then(() => playChime(context)).catch(() => {})
        }
      }

      hideTimer = window.setTimeout(() => {
        if (cancelled) return
        setOpen(false)
        schedule(EVERY_MS)
      }, VISIBLE_MS)
    }

    getProductsWithCategories({ per_page: 24 })
      .then((response) => {
        if (cancelled || !response.success) return
        productsRef.current = (response.data || []).filter((item) => item.in_stock && item.main_image)
        if (productsRef.current.length === 0) return
        schedule(FIRST_DELAY_MS)
      })
      .catch(() => {})

    return () => {
      cancelled = true
      window.clearTimeout(hideTimer)
      window.clearTimeout(showTimer)
    }
  }, [])

  if (hiddenRoute || !open || !product) return null

  return (
    <aside className="fixed bottom-6 left-4 z-40 w-[min(100%-2rem,26rem)] rounded-2xl border border-stone-200/80 bg-white p-5 pr-11 shadow-[0_18px_50px_-24px_rgba(28,25,23,0.55)] dark:border-white/10 dark:bg-stone-950 sm:left-6">
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-800 dark:hover:bg-white/10 dark:hover:text-white"
        aria-label="Dismiss"
      >
        <X className="h-3.5 w-3.5" />
      </button>
      <div className="flex items-center gap-4">
        <img
          src={cdnImage(product.main_image, 240) || "/placeholder.svg"}
          alt=""
          className="h-24 w-24 shrink-0 rounded-2xl bg-stone-100 object-contain dark:bg-stone-900"
        />
        <div className="min-w-0 py-1">
          <p className="text-[15px] leading-snug text-stone-800 dark:text-stone-100">
            <span aria-hidden="true">👜 </span>
            Someone recently bought a <span className="font-medium text-stone-950 dark:text-white">{product.name}</span>
          </p>
          <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">{timeAgo}</p>
          <Link
            href={productHref(product)}
            onClick={() => setOpen(false)}
            className="mt-2.5 inline-flex text-sm font-medium text-[#8E1B2C] underline-offset-4 hover:underline dark:text-rose-300"
          >
            View product
          </Link>
        </div>
      </div>
    </aside>
  )
}
