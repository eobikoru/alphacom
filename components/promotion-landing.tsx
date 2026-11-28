"use client"

import { useEffect, useState, type FormEvent, type ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"

const PRICE = "₦27,000"
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.alphacomonline.com"
const OFFER_NOTE = "20,000mAh power bank + free hand fan"
type TimeLeft = { days: string; hours: string; minutes: string; seconds: string }

const shots = [
  {
    src: "/promotion/power-bank-scene.jpg",
    alt: "Black Remax power bank on a display stand",
    label: "Power bank",
  },
  {
    src: "/promotion/power-bank-studio.jpg",
    alt: "Black Remax power bank with a digital battery display",
    label: "Close-up",
  },
  {
    src: "/promotion/hand-fan.jpg",
    alt: "Orange portable electric hand fan on its stand",
    label: "Free fan",
  },
  {
    src: "/promotion/bundle.jpg",
    alt: "The power bank and orange electric hand fan together",
    label: "Bundle",
  },
] as const

const reasons = [
  {
    title: "20,000mAh capacity",
    body: "Backup power when you are away from a socket, for work, travel, or the rest of the day.",
  },
  {
    title: "Digital battery display",
    body: "See the charge level clearly, so you know how much power is left.",
  },
  {
    title: "Free electric hand fan",
    body: "A portable fan is included with this offer, at no extra cost.",
  },
  {
    title: "Free delivery in Lagos",
    body: "Order through the form. Our team confirms delivery with you.",
  },
  {
    title: "Confirmed by Alphacom",
    body: "A trusted tech retailer from Computer Village, Ikeja, Lagos.",
  },
]

const includes = [
  "1 power bank, 20,000mAh",
  "1 free portable electric hand fan",
  "Free delivery within Lagos",
  "A confirmation call from our team",
]

const faqs = [
  {
    q: "How much is the bundle?",
    a: "The 20,000mAh power bank and FREE electric hand fan are available together for ₦27,000.",
  },
  {
    q: "Is the electric fan really free?",
    a: "Yes. The electric hand fan is included as a free bonus with this bundle.",
  },
  {
    q: "Can I see the products before ordering?",
    a: "Yes. You can view the product pictures and the product videos on this page.",
  },
  {
    q: "Do you offer free delivery?",
    a: "Free delivery applies within Lagos for this offer. Our team will confirm delivery for your area.",
  },
  {
    q: "How do I place an order?",
    a: "Click any order button on this page and fill in your name and phone number. Our team will contact you.",
  },
]

function pad(value: number) {
  return String(Math.max(0, value)).padStart(2, "0")
}

function timeUntilMidnightLagos(now = Date.now()): TimeLeft {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Lagos",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(new Date(now))
  const get = (type: string) => Number(parts.find((part) => part.type === type)?.value ?? 0)
  return {
    days: "00",
    hours: pad(23 - get("hour")),
    minutes: pad(59 - get("minute")),
    seconds: pad(59 - get("second")),
  }
}

function useOfferCountdown() {
  const [time, setTime] = useState<TimeLeft>({ days: "00", hours: "00", minutes: "00", seconds: "00" })

  useEffect(() => {
    setTime(timeUntilMidnightLagos())
    const id = window.setInterval(() => setTime(timeUntilMidnightLagos()), 1000)
    return () => window.clearInterval(id)
  }, [])

  return time
}

function CountdownDigit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-[4.25rem] w-[4.5rem] overflow-hidden rounded-2xl bg-[#8E1B2C] shadow-[0_16px_32px_rgba(142,27,44,0.22)] sm:h-[4.75rem] sm:w-[5.25rem]">
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-white/15" />
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center text-3xl font-semibold tracking-tight text-white tabular-nums sm:text-4xl"
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#8E1B2C]">{label}</span>
    </div>
  )
}

function FadeIn({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function OfferUrgency({ onOrder }: { onOrder: () => void }) {
  const time = useOfferCountdown()

  return (
    <section className="relative overflow-hidden border-b border-[#E8DDE0] bg-gradient-to-b from-[#FFF8F9] via-white to-[#F7F4F5]">
      <div className="pointer-events-none absolute -left-20 top-0 h-56 w-56 rounded-full bg-[#8E1B2C]/[0.06] blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-48 w-48 rounded-full bg-[#0F8A4B]/[0.06] blur-3xl" />

      <div className="relative mx-auto max-w-3xl px-5 pb-10 pt-8 text-center sm:px-8">
        <motion.div
          animate={{ boxShadow: ["0 0 0 0 rgba(142,27,44,0.18)", "0 0 0 10px rgba(142,27,44,0)", "0 0 0 0 rgba(142,27,44,0.18)"] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          className="mx-auto inline-flex max-w-full items-center justify-center rounded-full bg-[#8E1B2C] px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.16em] text-white sm:text-xs"
        >
          Free delivery within Lagos on this special offer
        </motion.div>

        <h1 className="mx-auto mt-7 max-w-2xl text-3xl font-semibold leading-[1.12] tracking-tight text-stone-950 sm:text-5xl">
          This is your last chance to get this special offer
        </h1>

        <div className="mt-6 flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1">
          <span className="text-5xl font-semibold tracking-tight text-[#0F8A4B] sm:text-6xl">{PRICE}</span>
          <span className="text-sm font-medium uppercase tracking-[0.14em] text-stone-500">• Free delivery</span>
        </div>

        <p className="mt-6 text-sm font-medium uppercase tracking-[0.2em] text-stone-950">Price increases in just a few minutes</p>
        <p className="mt-2 text-sm text-[#8E1B2C]">In fact, you almost missed out on the promo. It remains just</p>

        <div className="mt-6 flex items-start justify-center gap-2.5 sm:gap-3.5">
          <CountdownDigit value={time.days} label="Days" />
          <CountdownDigit value={time.hours} label="Hours" />
          <CountdownDigit value={time.minutes} label="Minutes" />
          <CountdownDigit value={time.seconds} label="Seconds" />
        </div>

        <button type="button" onClick={onOrder} className={`${buttonClass} mt-8 px-8 py-3.5 text-base`}>
          Order before the timer ends
        </button>
      </div>
    </section>
  )
}

export function PromotionLanding() {
  const router = useRouter()
  const [shot, setShot] = useState(0)
  const [activePhoto, setActivePhoto] = useState<number | null>(null)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [address, setAddress] = useState("")
  const [note, setNote] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const scrollToOrder = () => {
    document.getElementById("order")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const submitLead = async (event: FormEvent) => {
    event.preventDefault()
    const trimmedName = name.trim()
    const trimmedPhone = phone.trim()
    if (!trimmedName || !trimmedPhone) {
      setError("Enter your name and phone number.")
      return
    }
    if (trimmedPhone.replace(/\D/g, "").length < 10) {
      setError("Enter a Nigerian phone number, such as 0803…")
      return
    }

    setSubmitting(true)
    setError("")
    const extra = note.trim()
    try {
      const response = await fetch(`${API_BASE}/api/v1/promotions/leads`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          phone: trimmedPhone,
          ...(email.trim() ? { email: email.trim() } : {}),
          ...(address.trim() ? { address: address.trim() } : {}),
          note: extra ? `${OFFER_NOTE}. ${extra}` : OFFER_NOTE,
        }),
      })
      const json = await response.json().catch(() => null)
      if (!response.ok || json?.success === false) {
        setError(leadError(json))
        return
      }
      router.push("/promotion/thank-you")
    } catch {
      setError("We couldn't send your request. Check your connection and try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const selected = shots[shot]

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-stone-950">
      <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3 sm:px-8">
          <Link href="/" aria-label="Alphacom Online home">
            <Image src="/alpw1.png" alt="Alphacom" width={180} height={48} className="h-9 w-auto" priority />
          </Link>
          <button type="button" onClick={scrollToOrder} className={buttonClass}>
            Order now
          </button>
        </div>
      </header>

      <OfferUrgency onOrder={scrollToOrder} />

      <FadeIn className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
        <div className="text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#8E1B2C]">Alphacom Online special offer</p>
          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            20,000mAh power bank + free electric hand fan
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-7 text-stone-600">
            Keep your devices powered, and take home a portable fan with the bundle. One offer. Free delivery within Lagos.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActivePhoto(shot)}
          className="group relative mx-auto mt-10 block w-full max-w-lg overflow-hidden rounded-[1.75rem] bg-white shadow-[0_30px_80px_rgba(28,25,22,0.1)] focus:outline-none"
          aria-label={`View the ${selected.label} photo`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={selected.src}
              initial={{ opacity: 0.4, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <Image src={selected.src} alt={selected.alt} width={500} height={500} priority className="aspect-square w-full object-cover" />
            </motion.div>
          </AnimatePresence>
        </button>

        <div className="mx-auto mt-5 grid max-w-lg grid-cols-4 gap-3">
          {shots.map((item, index) => (
            <button
              key={item.src}
              type="button"
              onClick={() => setShot(index)}
              className={`overflow-hidden rounded-2xl border-2 transition ${
                shot === index ? "border-[#8E1B2C] shadow-sm" : "border-transparent opacity-70 hover:opacity-100"
              }`}
              aria-label={`Show ${item.label}`}
            >
              <Image src={item.src} alt="" width={120} height={120} className="aspect-square w-full object-cover" />
            </button>
          ))}
        </div>
      </FadeIn>

      <section className="bg-white">
        <FadeIn className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
          <div className="text-center">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#8E1B2C]">Why this bundle</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Five reasons to order today</h2>
          </div>
          <ol className="mt-10 space-y-4">
            {reasons.map((reason, index) => (
              <li key={reason.title} className="flex gap-4 rounded-2xl border border-stone-200/80 bg-[#F7F8FA] p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#8E1B2C] text-sm font-semibold text-white">
                  {index + 1}
                </span>
                <div>
                  <p className="font-medium text-stone-950">{reason.title}</p>
                  <p className="mt-1 text-sm leading-6 text-stone-600">{reason.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </FadeIn>
      </section>

      <FadeIn className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
        <div className="overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white shadow-[0_20px_50px_rgba(28,25,22,0.06)]">
          <div className="grid gap-0 lg:grid-cols-2">
            <div className="border-b border-stone-200 p-8 lg:border-b-0 lg:border-r">
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#8E1B2C]">With every order</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">What you receive</h2>
              <ul className="mt-6 space-y-3">
                {includes.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-6 text-stone-700">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8E1B2C]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-3xl font-semibold tracking-tight text-[#0F8A4B]">{PRICE}</p>
              <p className="mt-1 text-sm text-stone-500">Special offer price · Free delivery within Lagos</p>
            </div>
            <figure className="bg-[#F7F4F5] p-5 sm:p-6">
              <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
                <Image
                  src="/promotion/review-full-4.jpg"
                  alt="WhatsApp review: The Powerbank was worth my money. Thank you Alphacom Online for the gift"
                  width={1024}
                  height={449}
                  className="h-auto w-full"
                />
              </div>
              <figcaption className="mt-3 text-xs leading-5 text-stone-500">A message from a customer who bought the power bank.</figcaption>
            </figure>
          </div>
        </div>
      </FadeIn>

      <section className="bg-white">
        <FadeIn className="mx-auto max-w-3xl px-5 py-16 text-center sm:px-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#8E1B2C]">See it yourself</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Product and customer videos</h2>
          <div className="mt-10 flex flex-wrap justify-center gap-5">
            <div className="aspect-[9/16] w-full max-w-[280px] overflow-hidden rounded-[1.5rem] bg-stone-950 shadow-[0_24px_50px_rgba(28,25,22,0.16)]">
              <iframe
                src="https://www.youtube.com/embed/pwpYvxl4EqI"
                title="Alphacom bundle product video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
            <div className="aspect-[9/16] w-full max-w-[280px] overflow-hidden rounded-[1.5rem] bg-stone-950 shadow-[0_24px_50px_rgba(28,25,22,0.16)]">
              <iframe
                src="https://www.youtube.com/embed/dKj8IvUrJrY"
                title="Customer video testimonial"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </div>
        </FadeIn>
      </section>

      <section id="order" className="scroll-mt-24 border-y border-stone-200 bg-gradient-to-b from-[#FFF8F9] to-white">
        <FadeIn className="mx-auto max-w-xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="text-center">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#8E1B2C]">Place your order</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Fill the form below</h2>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-stone-600">
              Name and phone number are enough. Our team will confirm your order.
            </p>
          </div>

          <form
            onSubmit={submitLead}
            className="mt-8 overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white shadow-[0_28px_70px_rgba(142,27,44,0.1)]"
          >
            <div className="flex items-center justify-between gap-4 border-b border-stone-200 bg-[#F7F4F5] px-6 py-5 sm:px-8">
              <div>
                <p className="text-sm font-medium">Power bank + free hand fan</p>
                <p className="mt-1 text-xs text-stone-500">Free delivery within Lagos</p>
              </div>
              <p className="text-2xl font-semibold tracking-tight text-[#0F8A4B]">{PRICE}</p>
            </div>
            <div className="px-6 py-7 sm:px-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium" htmlFor="lead-name">
                  Name
                  <input
                    id="lead-name"
                    name="name"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Your full name"
                    className={inputClass}
                  />
                </label>
                <label className="block text-sm font-medium" htmlFor="lead-phone">
                  Phone number
                  <input
                    id="lead-phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    required
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="0803 000 0000"
                    className={inputClass}
                  />
                </label>
              </div>
              <label className="mt-4 block text-sm font-medium" htmlFor="lead-email">
                Email, optional
                <input
                  id="lead-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@email.com"
                  className={inputClass}
                />
              </label>
              <label className="mt-4 block text-sm font-medium" htmlFor="lead-address">
                Delivery address, optional
                <textarea
                  id="lead-address"
                  name="address"
                  rows={3}
                  autoComplete="street-address"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  placeholder="Area, city, and state"
                  className={`${inputClass} resize-y`}
                />
              </label>
              <label className="mt-4 block text-sm font-medium" htmlFor="lead-note">
                Anything else, optional
                <textarea
                  id="lead-note"
                  name="note"
                  rows={2}
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="A note for the team"
                  className={`${inputClass} resize-y`}
                />
              </label>
              {error ? <p className="mt-4 rounded-xl bg-[#F8ECEE] px-4 py-3 text-sm text-[#8E1B2C]">{error}</p> : null}
              <button
                type="submit"
                disabled={submitting}
                className="mt-5 w-full rounded-2xl bg-[#8E1B2C] py-4 text-base font-medium text-white transition hover:bg-[#741625] disabled:opacity-60"
              >
                {submitting ? "Sending…" : "Order your bundle now"}
              </button>
            </div>
          </form>
        </FadeIn>
      </section>

      <FadeIn className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Frequently asked questions</h2>
        <div className="mt-8 divide-y divide-stone-200 rounded-[1.5rem] border border-stone-200 bg-white px-6">
          {faqs.map((item) => (
            <article key={item.q} className="py-5">
              <h3 className="font-medium">{item.q}</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">{item.a}</p>
            </article>
          ))}
        </div>
      </FadeIn>

      <section className="bg-[#8E1B2C] px-5 py-16 text-center text-white sm:px-8">
        <FadeIn className="mx-auto max-w-2xl">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/70">Special offer</p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            Get your 20,000mAh power bank + free electric hand fan today
          </h2>
          <p className="mt-5 text-4xl font-semibold tracking-tight">Just {PRICE}</p>
          <p className="mt-3 text-white/80">Two useful products. One elegant bundle.</p>
          <button
            type="button"
            onClick={scrollToOrder}
            className="mt-8 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-[#8E1B2C] transition hover:bg-stone-100"
          >
            Yes, I want my bundle
          </button>
        </FadeIn>
      </section>

      <footer className="bg-white px-5 py-10 text-center sm:px-8">
        <p className="text-lg font-medium">Alphacom Online</p>
        <p className="mt-2 text-sm text-stone-500">Your destination for genuine tech products you can count on.</p>
        <p className="mt-1 text-sm text-stone-400">Computer Village, Ikeja, Lagos.</p>
      </footer>

      {activePhoto !== null ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-stone-950/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={shots[activePhoto].label}
          onClick={() => setActivePhoto(null)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 rounded-full bg-white/15 p-2 text-white"
            aria-label="Close photo"
            onClick={() => setActivePhoto(null)}
          >
            <X className="h-5 w-5" />
          </button>
          <Image
            src={shots[activePhoto].src}
            alt={shots[activePhoto].alt}
            width={768}
            height={1024}
            className="max-h-[88vh] w-auto max-w-full rounded-2xl object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      ) : null}
    </div>
  )
}

const buttonClass =
  "whitespace-nowrap rounded-full bg-[#8E1B2C] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#741625]"

const inputClass =
  "mt-1.5 w-full rounded-xl border border-stone-300 bg-[#F7F8FA] px-4 py-3.5 text-base text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-[#8E1B2C] focus:bg-white focus:ring-2 focus:ring-[#8E1B2C]/15"

function leadError(json: unknown): string {
  if (!json || typeof json !== "object") return "We couldn't send your request. Please try again."
  const record = json as { message?: unknown; detail?: unknown }
  if (typeof record.message === "string" && record.message.trim()) return record.message
  if (typeof record.detail === "string" && record.detail.trim()) return record.detail
  if (Array.isArray(record.detail)) {
    const text = record.detail
      .map((item) => (item && typeof item === "object" && "msg" in item && typeof item.msg === "string" ? item.msg : ""))
      .filter(Boolean)
      .join(" ")
    if (text) return text
  }
  return "We couldn't send your request. Please try again."
}
