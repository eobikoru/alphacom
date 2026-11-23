"use client"

import { useState, type FormEvent, type ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { X } from "lucide-react"

const WHATSAPP_NUMBER = "2347026384967"
const PRICE = "₦27,000"

const photos = [
  {
    src: "/promotion/power-bank.jpg",
    alt: "20,000mAh power bank with a digital battery display",
    caption: "20,000mAh power bank",
  },
  {
    src: "/promotion/hand-fan.jpg",
    alt: "Orange portable electric hand fan on its stand",
    caption: "Free electric hand fan",
  },
  {
    src: "/promotion/bundle.jpg",
    alt: "The power bank and orange electric hand fan together",
    caption: "The bundle",
  },
] as const

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
    a: "Yes. You can view the product pictures and the product video on this page.",
  },
  {
    q: "Do you offer free delivery?",
    a: "Free delivery applies to the locations covered by this offer. Contact our team to confirm delivery availability for your area.",
  },
  {
    q: "How do I place an order?",
    a: "Click any order button on this page and submit your details through WhatsApp. Our team will assist you.",
  },
]

export function PromotionLanding() {
  const [activePhoto, setActivePhoto] = useState<number | null>(null)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [location, setLocation] = useState("")
  const [quantity, setQuantity] = useState("1")
  const [notes, setNotes] = useState("")
  const [error, setError] = useState("")
  const [sent, setSent] = useState(false)

  const scrollToOrder = () => {
    document.getElementById("order")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const submitOrder = (event: FormEvent) => {
    event.preventDefault()
    const trimmedName = name.trim()
    const trimmedPhone = phone.trim()
    const trimmedLocation = location.trim()

    if (!trimmedName || !trimmedPhone || !trimmedLocation) {
      setError("Enter your full name, phone number, and delivery location.")
      setSent(false)
      return
    }

    const digits = trimmedPhone.replace(/\D/g, "")
    if (digits.length < 10) {
      setError("Enter an active phone number so our team can reach you.")
      setSent(false)
      return
    }

    const message = [
      "Hello Alphacom, I want the special bundle.",
      "",
      "Offer: 20,000mAh Power Bank + FREE Electric Hand Fan",
      `Bundle price: ${PRICE}`,
      `How many bundles: ${quantity}`,
      "",
      `Full name: ${trimmedName}`,
      `Phone number: ${trimmedPhone}`,
      `Delivery address / location: ${trimmedLocation}`,
      `Additional information: ${notes.trim() || "None"}`,
    ].join("\n")

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer")
    setError("")
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-[#F0F4F8] text-stone-950">
      <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
          <Link href="/" aria-label="Alphacom Online home">
            <Image src="/alpw1.png" alt="Alphacom" width={180} height={48} className="h-10 w-auto" priority />
          </Link>
          <button type="button" onClick={scrollToOrder} className={buttonClass}>
            Get this offer
          </button>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        <div>
          <p className="text-[12px] font-medium uppercase tracking-[0.28em] text-[#8E1B2C]">Alphacom Online</p>
          <h1 className="mt-4 text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl">
            Get a 20,000mAh power bank + a free electric hand fan for just {PRICE}.
          </h1>
          <p className="mt-5 text-lg text-stone-700">Two useful everyday essentials. One amazing offer.</p>
          <p className="mt-4 max-w-xl text-[15px] leading-7 text-stone-600">
            Keep your devices powered and enjoy a little extra comfort with this special Alphacom bundle. Get a 20,000mAh power bank and receive a portable electric hand fan absolutely free.
          </p>
          <p className="mt-6 text-sm text-stone-500">Bundle price</p>
          <p className="text-4xl font-medium tracking-tight text-[#8E1B2C]">{PRICE}</p>
          <button type="button" onClick={scrollToOrder} className={`${buttonClass} mt-6`}>
            Get this offer now
          </button>
        </div>
        <button type="button" onClick={() => setActivePhoto(2)} className="overflow-hidden rounded-[1.75rem] bg-white shadow-[0_24px_60px_rgba(28,25,22,0.08)] focus:outline-none" aria-label="View the power bank and fan together">
          <Image
            src="/promotion/bundle.jpg"
            alt="20,000mAh power bank beside the free orange electric hand fan"
            width={768}
            height={1024}
            priority
            className="aspect-[4/5] w-full object-cover object-[center_42%]"
          />
        </button>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-[#8E1B2C]">01</p>
            <h2 className="mt-3 text-3xl font-medium leading-tight sm:text-4xl">A power bank that keeps you going.</h2>
            <h3 className="mt-4 text-lg text-stone-950">Don&apos;t let a low battery interrupt your day.</h3>
            <p className="mt-4 text-[15px] leading-7 text-stone-600">
              Whether you&apos;re working, travelling, attending meetings, studying or going about your daily activities, having reliable backup power makes a difference. The 20,000mAh power bank gives you extra power when you need it, helping you stay connected and keep your essential devices running.
            </p>
            <p className="mt-6 text-sm font-medium text-stone-950">Why you&apos;ll want one</p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-stone-600">
              {[
                "20,000mAh capacity.",
                "Convenient portable charging.",
                "Useful for everyday activities and travel.",
                "A practical backup power solution when you're away from a power source.",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8E1B2C]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid gap-4">
            <button type="button" onClick={() => setActivePhoto(0)} className="overflow-hidden rounded-[1.5rem] focus:outline-none" aria-label="View the power bank">
              <Image src="/promotion/power-bank.jpg" alt="Black 20,000mAh power bank with a digital display" width={500} height={500} className="aspect-square w-full object-cover" />
            </button>
            <p className="text-sm text-stone-500">See it for yourself.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
        <div className="max-w-2xl">
          <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-[#8E1B2C]">02</p>
          <h2 className="mt-3 text-3xl font-medium leading-tight sm:text-4xl">See what you&apos;re getting.</h2>
          <h3 className="mt-4 text-lg text-stone-950">Pictures are good. Seeing the actual product is even better.</h3>
          <p className="mt-4 text-[15px] leading-7 text-stone-600">
            Take a closer look at the power bank before you order. What you see is what you get from Alphacom.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {photos.map((photo, index) => (
            <button key={photo.src} type="button" onClick={() => setActivePhoto(index)} className="overflow-hidden rounded-[1.5rem] bg-white text-left shadow-sm focus:outline-none">
              <Image src={photo.src} alt={photo.alt} width={768} height={1024} className="aspect-[4/5] w-full object-cover" />
              <span className="block px-4 py-3 text-sm font-medium">{photo.caption}</span>
            </button>
          ))}
        </div>
        <div className="mt-14 grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h3 className="text-2xl font-medium">Watch the product.</h3>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              A closer look at the power bank and the hand fan in this bundle, before you order.
            </p>
          </div>
          <div className="mx-auto aspect-[9/16] w-full max-w-[320px] overflow-hidden rounded-[1.5rem] bg-stone-950 shadow-[0_20px_50px_rgba(28,25,22,0.12)]">
            <iframe
              src="https://www.youtube.com/embed/pwpYvxl4EqI"
              title="Alphacom bundle product video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        </div>
      </section>

      <section className="border-y border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
          <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-[#8E1B2C]">03</p>
          <h2 className="mt-3 max-w-xl text-3xl font-medium leading-tight sm:text-4xl">Real customers. Real experiences.</h2>
          <h3 className="mt-4 text-lg text-stone-950">Don&apos;t just take our word for it.</h3>
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-stone-600">
            At Alphacom, we understand that you want to feel confident before making a purchase. These are messages from people who have shopped with us.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              ["/promotion/review-full-1.jpg", "WhatsApp review: I love this your 20000mah powerbank"],
              ["/promotion/review-full-2.jpg", "WhatsApp review: The Powerbank is my best buy ever"],
              ["/promotion/review-full-3.jpg", "WhatsApp review: The Powerbank was worth buying. Thank you Alphacom Online"],
            ].map(([src, alt]) => (
              <figure key={src} className="overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white shadow-sm">
                <Image src={src} alt={alt} width={472} height={560} className="h-auto w-full" />
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F0F4F8]">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:py-24">
          <button type="button" onClick={() => setActivePhoto(1)} className="overflow-hidden rounded-[1.75rem] focus:outline-none" aria-label="View the electric hand fan">
            <Image src="/promotion/hand-fan.jpg" alt="Large view of the orange portable electric hand fan" width={768} height={1024} className="aspect-[4/5] w-full object-cover object-[center_40%]" />
          </button>
          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-[#8E1B2C]">04</p>
            <h2 className="mt-3 text-3xl font-medium leading-tight sm:text-4xl">Your purchase comes with a free bonus.</h2>
            <p className="mt-4 text-lg text-stone-950">Buy the 20,000mAh power bank and get a free electric hand fan.</p>
            <p className="mt-4 text-[15px] leading-7 text-stone-600">
              Yes, you read that correctly. We&apos;re adding an electric hand fan to your order at no extra cost.
            </p>
            <h3 className="mt-8 text-lg font-medium">A little extra comfort for your everyday life.</h3>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-stone-600">
              {[
                "Staying cool while commuting.",
                "Keeping comfortable during outdoor activities.",
                "Taking it along to work, school or church.",
                "Everyday use when you're on the move.",
                "Compact size, with a stand and a button on the handle.",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8E1B2C]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[15px] text-stone-950">
              You get both products for just <span className="font-medium text-[#8E1B2C]">{PRICE}</span>.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-16 text-center sm:px-8 lg:py-24">
        <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-[#8E1B2C]">05</p>
        <h2 className="mt-3 text-3xl font-medium sm:text-4xl">Enjoy free delivery.</h2>
        <p className="mx-auto mt-4 max-w-xl text-[15px] leading-7 text-stone-600">
          Get your bundle delivered without an additional delivery charge, subject to the advertised delivery locations and terms. No need to miss out on this special offer.
        </p>
        <button type="button" onClick={scrollToOrder} className={`${buttonClass} mt-8`}>
          Get my {PRICE} bundle
        </button>
      </section>

      <section className="border-y border-stone-200 bg-white">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center sm:px-8">
          <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-[#8E1B2C]">06</p>
          <h2 className="mt-3 text-3xl font-medium sm:text-4xl">Why shop with Alphacom?</h2>
          <p className="mt-4 text-[15px] leading-7 text-stone-600">
            When you shop with Alphacom Online, you&apos;re shopping with a trusted technology retailer from the heart of Computer Village, Ikeja, Lagos. We are committed to providing genuine tech products you can count on, dependable service and customer support.
          </p>
          <p className="mt-5 text-sm font-medium text-[#8E1B2C]">Your satisfaction matters to us.</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
        <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-[#8E1B2C]">07</p>
        <h2 className="mt-3 text-3xl font-medium sm:text-4xl">How to order.</h2>
        <p className="mt-3 text-stone-600">Getting your bundle is easy.</p>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            "Click the order button.",
            "Fill in your name, phone number and delivery location.",
            "Submit your order through WhatsApp.",
            "Our team will contact you to confirm your order and delivery arrangements.",
          ].map((step, index) => (
            <li key={step} className="rounded-2xl bg-white p-5 shadow-sm">
              <span className="text-sm font-medium text-[#8E1B2C]">{index + 1}</span>
              <p className="mt-2 text-sm leading-6 text-stone-700">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="order" className="scroll-mt-20 bg-white">
        <div className="mx-auto max-w-xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="text-center">
            <h2 className="text-3xl font-medium sm:text-4xl">Order your bundle now.</h2>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-stone-600">
              Fill in your details and send them on WhatsApp. Our team will confirm your order.
            </p>
          </div>
          <form onSubmit={submitOrder} className="mt-8 overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white shadow-[0_24px_60px_rgba(142,27,44,0.08)]">
            <div className="flex items-center justify-between gap-4 border-b border-stone-200 bg-[#F0F4F8] px-6 py-5 sm:px-8">
              <div>
                <p className="text-sm font-medium">Power bank + free hand fan</p>
                <p className="mt-1 text-xs text-stone-500">Free delivery on this offer</p>
              </div>
              <p className="text-2xl font-medium tracking-tight text-[#8E1B2C]">{PRICE}</p>
            </div>
            <div className="px-6 py-7 sm:px-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" htmlFor="full-name">
                  <input id="full-name" name="name" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your full name" className={inputClass} />
                </Field>
                <Field label="Phone number" htmlFor="phone">
                  <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="0803 000 0000" className={inputClass} />
                </Field>
              </div>
              <Field label="Delivery location" htmlFor="location">
                <textarea id="location" name="location" rows={3} value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Area, city, and state" className={`${inputClass} resize-y`} />
              </Field>
              <Field label="How many bundles" htmlFor="quantity">
                <select id="quantity" name="quantity" value={quantity} onChange={(event) => setQuantity(event.target.value)} className={inputClass}>
                  {["1", "2", "3", "4", "5"].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Anything else, optional" htmlFor="notes">
                <textarea id="notes" name="notes" rows={2} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="A note for the team" className={`${inputClass} resize-y`} />
              </Field>
              {error ? <p className="mb-4 rounded-xl bg-[#F8ECEE] px-4 py-3 text-sm text-[#8E1B2C]">{error}</p> : null}
              <button type="submit" className="w-full rounded-xl bg-[#8E1B2C] py-4 text-base font-medium text-white transition hover:bg-[#741625]">
                Order your bundle now
              </button>
              <p className="mt-3 text-center text-xs leading-5 text-stone-500">
                This opens WhatsApp with your details. The order is confirmed when our team replies.
              </p>
              {sent ? (
                <p className="mt-3 rounded-xl bg-[#e8f5ee] px-4 py-3 text-center text-sm text-[#1d6b3a]">
                  WhatsApp is open with your order. Send the message so we can confirm it.
                </p>
              ) : null}
            </div>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
        <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-[#8E1B2C]">08</p>
        <h2 className="mt-3 text-3xl font-medium sm:text-4xl">Frequently asked questions.</h2>
        <div className="mt-8 divide-y divide-stone-200">
          {faqs.map((item) => (
            <article key={item.q} className="py-5">
              <h3 className="font-medium">{item.q}</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">{item.a}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#8E1B2C] px-5 py-16 text-center text-white sm:px-8">
        <div className="mx-auto max-w-2xl">
          <p className="text-[12px] font-medium uppercase tracking-[0.28em] text-white/70">Don&apos;t miss this special offer</p>
          <h2 className="mt-4 text-3xl font-medium leading-tight sm:text-4xl">
            Get your 20,000mAh power bank + free electric hand fan today.
          </h2>
          <p className="mt-5 text-4xl font-medium">Just {PRICE}</p>
          <p className="mt-3 text-white/80">Two useful products. One incredible bundle.</p>
          <button type="button" onClick={scrollToOrder} className="mt-8 rounded-full bg-white px-6 py-3 text-sm font-medium text-[#8E1B2C] transition hover:bg-stone-100">
            Yes, I want my bundle
          </button>
        </div>
      </section>

      <footer className="bg-white px-5 py-10 text-center sm:px-8">
        <p className="text-lg font-medium">Alphacom Online</p>
        <p className="mt-2 text-sm text-stone-500">Your destination for genuine tech products you can count on.</p>
        <p className="mt-1 text-sm text-stone-400">Computer Village, Ikeja, Lagos.</p>
      </footer>

      {activePhoto !== null ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-stone-950/80 p-4" role="dialog" aria-modal="true" aria-label={photos[activePhoto].caption} onClick={() => setActivePhoto(null)}>
          <button type="button" className="absolute right-4 top-4 rounded-full bg-white/15 p-2 text-white" aria-label="Close photo" onClick={() => setActivePhoto(null)}>
            <X className="h-5 w-5" />
          </button>
          <Image
            src={photos[activePhoto].src}
            alt={photos[activePhoto].alt}
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

const buttonClass = "whitespace-nowrap rounded-full bg-[#8E1B2C] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#741625]"

const inputClass =
  "mt-1.5 w-full rounded-xl border border-stone-300 bg-[#F0F4F8] px-4 py-3.5 text-base text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-[#8E1B2C] focus:bg-white focus:ring-2 focus:ring-[#8E1B2C]/15"

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-4 block text-sm font-medium text-stone-950">
      {label}
      {children}
    </label>
  )
}
