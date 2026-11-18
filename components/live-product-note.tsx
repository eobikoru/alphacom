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
const EVERY_MS = 6 * 60 * 1000
const VISIBLE_MS = 12000

function chimeUrl() {
  const sampleRate = 22050
  const duration = 1.45
  const length = Math.floor(sampleRate * duration)
  const samples = new Float32Array(length)
  ;[
    { frequency: 440, start: 0 },
    { frequency: 554.37, start: 0.16 },
    { frequency: 659.25, start: 0.32 },
  ].forEach((tone) => {
    const start = Math.floor(tone.start * sampleRate)
    const end = Math.min(length, start + Math.floor(1.05 * sampleRate))
    for (let index = start; index < end; index++) {
      const time = (index - start) / sampleRate
      const envelope = Math.min(1, time / 0.035) * Math.exp(-time * 2.5)
      const fundamental = Math.sin(2 * Math.PI * tone.frequency * time)
      const overtone = Math.sin(2 * Math.PI * tone.frequency * 2 * time) * 0.18
      samples[index] += (fundamental + overtone) * envelope * 0.11
    }
  })

  const bytes = new DataView(new ArrayBuffer(44 + length * 2))
  const write = (offset: number, text: string) => {
    for (let index = 0; index < text.length; index++) bytes.setUint8(offset + index, text.charCodeAt(index))
  }
  write(0, "RIFF")
  bytes.setUint32(4, 36 + length * 2, true)
  write(8, "WAVE")
  write(12, "fmt ")
  bytes.setUint32(16, 16, true)
  bytes.setUint16(20, 1, true)
  bytes.setUint16(22, 1, true)
  bytes.setUint32(24, sampleRate, true)
  bytes.setUint32(28, sampleRate * 2, true)
  bytes.setUint16(32, 2, true)
  bytes.setUint16(34, 16, true)
  write(36, "data")
  bytes.setUint32(40, length * 2, true)
  for (let index = 0; index < length; index++) {
    const sample = Math.max(-1, Math.min(1, samples[index]))
    bytes.setInt16(44 + index * 2, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true)
  }
  return URL.createObjectURL(new Blob([bytes.buffer], { type: "audio/wav" }))
}

let chimeSrc: string | null = null
function getChimeUrl() {
  if (!chimeSrc) chimeSrc = chimeUrl()
  return chimeSrc
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
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const canPlayRef = useRef(false)
  const hiddenRoute = HIDDEN_PREFIXES.some((prefix) => pathname?.startsWith(prefix))

  const chime = () => {
    if (!audioRef.current) {
      const audio = new Audio(getChimeUrl())
      audio.preload = "auto"
      audioRef.current = audio
    }
    const audio = audioRef.current
    audio.volume = 0.32
    audio.currentTime = 0
    return audio.play()
  }

  useEffect(() => {
    const arm = () => {
      canPlayRef.current = true
      const audio = audioRef.current ?? new Audio(getChimeUrl())
      audioRef.current = audio
      audio.volume = 0
      audio.play().then(() => {
        audio.pause()
        audio.currentTime = 0
        audio.volume = 0.32
      }).catch(() => {})
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
    let cardOpen = false
    const schedule = (delay: number) => {
      window.clearTimeout(showTimer)
      showTimer = window.setTimeout(reveal, delay)
    }
    const scheduleDismiss = () => {
      window.clearTimeout(hideTimer)
      if (!cardOpen || document.hidden) return
      hideTimer = window.setTimeout(() => {
        if (cancelled) return
        cardOpen = false
        setOpen(false)
      }, VISIBLE_MS)
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
      if (onQuietPage) {
        schedule(EVERY_MS)
        return
      }
      const next = pick()
      if (!next) return
      lastIdRef.current = next.id
      setProduct(next)
      setTimeAgo(timeAgoLabel())
      cardOpen = true
      setOpen(true)

      if (canPlayRef.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        chime().catch(() => {})
      }

      schedule(EVERY_MS)
      scheduleDismiss()
    }

    const onVisibility = () => {
      if (document.hidden) {
        window.clearTimeout(hideTimer)
        return
      }
      scheduleDismiss()
    }
    document.addEventListener("visibilitychange", onVisibility)

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
      document.removeEventListener("visibilitychange", onVisibility)
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
