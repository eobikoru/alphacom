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
    caption: "The power bank",
  },
  {
    src: "/promotion/hand-fan.jpg",
    alt: "Orange portable electric hand fan on its stand",
    caption: "The hand fan, included",
  },
  {
    src: "/promotion/bundle.jpg",
    alt: "The power bank and orange electric hand fan together",
    caption: "Both, together",
  },
] as const

const faqs = [
  {
    q: "How much is the bundle?",
    a: "The 20,000mAh power bank and free electric hand fan are available together for ₦27,000.",
  },
  {
    q: "Is the electric hand fan really free?",
    a: "Yes. The electric hand fan is included with this bundle. You pay ₦27,000 for both.",
  },
  {
    q: "Can the power bank charge my phone?",
    a: "Yes. It is designed to provide backup charging for compatible devices when you are away from a power source.",
  },
  {
    q: "Is delivery free?",
    a: "Yes. This offer includes free delivery, subject to the advertised delivery locations and terms. Share your location and our team will confirm the arrangement before your order is finalized.",
  },
  {
    q: "Do you deliver outside Lagos?",
    a: "Send your location with the order. Our team will confirm whether this free-delivery offer covers your area.",
  },
  {
    q: "How do I order?",
    a: "Fill in the form on this page and send it on WhatsApp. Our team will contact you to confirm your details and delivery.",
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
    <div className="min-h-screen bg-[#f4efe8] text-[#1c1916]">
      <header className="sticky top-0 z-40 border-b border-[#e4dbd1] bg-[#f4efe8]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
          <Link href="/" aria-label="Alphacom Online home">
            <Image src="/alpw1.png" alt="Alphacom" width={180} height={48} className="h-10 w-auto" priority />
          </Link>
          <button
            type="button"
            onClick={scrollToOrder}
            className="whitespace-nowrap text-[13px] font-medium tracking-wide text-[#1c1916] underline decoration-[#c4b6a6] underline-offset-4 transition hover:decoration-[#1c1916]"
          >
            Order · {PRICE}
          </button>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-end gap-10 px-5 pb-16 pt-10 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pt-16">
        <div>
          <p className="text-[12px] uppercase tracking-[0.28em] text-[#8a7564]">Alphacom Online · Ikeja</p>
          <h1 className="mt-5 max-w-xl text-[3.1rem] font-medium leading-[0.95] tracking-[-0.03em] text-[#1c1916] sm:text-7xl">
            Stay powered.
            <span className="mt-1 block italic text-[#8d4a34]">Stay cool.</span>
          </h1>
          <p className="mt-6 max-w-md text-[15px] leading-7 text-[#5e564e]">
            A 20,000mAh power bank, with a portable electric hand fan included. Two everyday essentials, one bundle, for {PRICE}.
          </p>
          <div className="mt-8 flex flex-wrap items-end gap-6">
            <p className="text-5xl font-medium tracking-tight">{PRICE}</p>
            <button
              type="button"
              onClick={scrollToOrder}
              className="rounded-full bg-[#1c1916] px-6 py-3 text-sm text-[#f4efe8] transition hover:bg-[#3a332c]"
            >
              Reserve this bundle
            </button>
          </div>
          <p className="mt-5 max-w-sm text-xs leading-5 text-[#8a7d72]">
            Free delivery on this offer, subject to the locations and terms confirmed with your order.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setActivePhoto(2)}
          className="group relative block focus:outline-none"
          aria-label="View the power bank and fan together"
        >
          <Image
            src="/promotion/bundle.jpg"
            alt="20,000mAh power bank beside the free orange electric hand fan"
            width={768}
            height={1024}
            priority
            className="aspect-[4/5] w-full rounded-[2rem] object-cover object-[center_42%] shadow-[0_30px_80px_rgba(28,25,22,0.12)]"
          />
          <span className="absolute bottom-4 left-4 rounded-full bg-[#f4efe8]/90 px-3 py-1.5 text-xs text-[#1c1916] backdrop-blur">
            Power bank + hand fan
          </span>
        </button>
      </section>

      <section className="border-y border-[#e4dbd1]">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 sm:grid-cols-3 sm:px-8">
          {[
            ["01", "Stay powered", "Extra capacity from a 20,000mAh power bank when you are away from a socket."],
            ["02", "Stay cool", "A portable electric hand fan comes with the order, at no extra cost."],
            ["03", "One price", "Both pieces together for ₦27,000, with free delivery on this offer."],
          ].map(([index, title, body]) => (
            <div key={index}>
              <p className="text-sm italic text-[#8d4a34]">{index}</p>
              <h2 className="mt-2 text-lg font-medium">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#5e564e]">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#1c1916] text-[#f4efe8]">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:py-24">
          <button
            type="button"
            onClick={() => setActivePhoto(0)}
            className="overflow-hidden rounded-[1.75rem] focus:outline-none"
            aria-label="View the power bank"
          >
            <Image
              src="/promotion/power-bank.jpg"
              alt="Black 20,000mAh power bank with a digital display reading 99 percent"
              width={500}
              height={500}
              className="aspect-square w-full object-cover"
            />
          </button>
          <div>
            <p className="text-[12px] uppercase tracking-[0.28em] text-[#c4a090]">The power bank</p>
            <h2 className="mt-4 text-4xl font-medium leading-tight sm:text-5xl">
              A quieter kind of backup power.
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-7 text-[#d9d0c6]">
              Whether you are working, travelling, in a meeting, or studying, a low battery does not have to interrupt the day. This 20,000mAh power bank is the practical piece you keep in a bag.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-[#efe7de]">
              {[
                "20,000mAh capacity",
                "Portable charging for compatible devices",
                "Useful for work, school, and travel",
                "A backup when you are away from a power source",
              ].map((item) => (
                <li key={item} className="border-t border-white/10 pt-3">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[12px] uppercase tracking-[0.28em] text-[#8a7564]">What you receive</p>
            <h2 className="mt-3 text-4xl font-medium tracking-tight sm:text-5xl">
              The actual products.
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-6 text-[#5e564e]">
            These photographs are the power bank and the hand fan in this bundle.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {photos.map((photo, index) => (
            <button
              key={photo.src}
              type="button"
              onClick={() => setActivePhoto(index)}
              className={`group overflow-hidden text-left focus:outline-none ${index === 1 ? "sm:mt-10" : ""}`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                width={768}
                height={1024}
                className="aspect-[4/5] w-full rounded-[1.5rem] object-cover transition duration-500 group-hover:scale-[1.01]"
              />
              <span className="mt-3 block text-sm text-[#5e564e]">{photo.caption}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="border-t border-[#e4dbd1]">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:py-24">
          <div>
            <p className="text-[12px] uppercase tracking-[0.28em] text-[#8a7564]">A closer look</p>
            <h2 className="mt-3 text-4xl font-medium leading-tight">
              See it before you order.
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#5e564e]">
              A short look at the power bank and the hand fan that come in this Alphacom bundle.
            </p>
          </div>
          <div className="mx-auto aspect-[9/16] w-full max-w-[320px] overflow-hidden rounded-[1.75rem] bg-[#1c1916] shadow-[0_24px_60px_rgba(28,25,22,0.12)]">
            <iframe
              src="https://www.youtube.com/embed/4KiHspG1ROI"
              title="Alphacom bundle product video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-8 sm:px-8 lg:grid-cols-2 lg:py-12">
        <button
          type="button"
          onClick={() => setActivePhoto(1)}
          className="overflow-hidden rounded-[2rem] focus:outline-none"
          aria-label="View a larger photo of the electric hand fan"
        >
          <Image
            src="/promotion/hand-fan.jpg"
            alt="Large view of the orange portable electric hand fan"
            width={768}
            height={1024}
            className="aspect-[4/5] w-full object-cover object-[center_40%]"
          />
        </button>
        <div>
          <p className="text-[12px] uppercase tracking-[0.28em] text-[#8a7564]">Included with your order</p>
          <h2 className="mt-3 text-4xl font-medium leading-tight sm:text-5xl">
            The hand fan comes with it.
          </h2>
          <p className="mt-5 max-w-md text-[15px] leading-7 text-[#5e564e]">
            Buy the power bank and the portable electric hand fan is added at no extra cost. Both are yours for {PRICE}.
          </p>
          <ul className="mt-8 space-y-2 text-sm leading-6 text-[#3d3833]">
            {[
              "A breeze while you commute.",
              "Comfortable company for outdoor plans.",
              "Light enough for work, school, or church.",
              "Compact size, with a stand and a button on the handle.",
            ].map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="rounded-[2rem] bg-[#ebe3d8] px-6 py-10 sm:px-12 sm:py-14">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <p className="text-[12px] uppercase tracking-[0.28em] text-[#8a7564]">Delivery</p>
              <h2 className="mt-3 max-w-lg text-4xl font-medium leading-tight">
                Delivered without an extra charge.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-[#5e564e]">
                Free delivery applies to the locations and terms of this offer. Tell us where you are, and the team confirms the arrangement before the order is finalized.
              </p>
            </div>
            <p className="text-sm leading-7 text-[#5e564e]">
              Alphacom Online is a technology retailer in Computer Village, Ikeja, Lagos. Genuine products, a team you can reach, and support after you order.
            </p>
          </div>
        </div>
      </section>

      <section id="order" className="scroll-mt-20 bg-[#ebe4da]">
        <div className="mx-auto max-w-xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="text-center">
            <p className="text-[12px] uppercase tracking-[0.28em] text-[#8a7564]">Order</p>
            <h2 className="mt-3 text-4xl font-medium leading-tight">Tell us where to send it.</h2>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#5e564e]">
              Your name, phone, and location. We confirm the bundle and delivery on WhatsApp.
            </p>
          </div>
          <form onSubmit={submitOrder} className="mt-8 overflow-hidden rounded-[1.75rem] border border-[#d9cfc3] bg-white shadow-[0_24px_60px_rgba(28,25,22,0.1)]">
            <div className="flex items-center justify-between gap-4 border-b border-[#efe7de] bg-[#faf7f3] px-6 py-5 sm:px-8">
              <div>
                <p className="text-sm font-medium text-[#1c1916]">Power bank + free hand fan</p>
                <p className="mt-1 text-xs text-[#8a7d72]">Free delivery on this offer</p>
              </div>
              <p className="text-2xl font-medium tracking-tight text-[#1c1916]">{PRICE}</p>
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
              {error ? <p className="mb-4 rounded-xl bg-[#f8ece6] px-4 py-3 text-sm text-[#8d4a34]">{error}</p> : null}
              <button type="submit" className="w-full rounded-xl bg-[#128C7E] py-4 text-base font-medium text-white transition hover:bg-[#0e7468]">
                Send order on WhatsApp
              </button>
              <p className="mt-3 text-center text-xs leading-5 text-[#8a7d72]">
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

      <section className="border-t border-[#e4dbd1]">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.7fr_1.3fr]">
          <h2 className="text-4xl font-medium">Questions, briefly.</h2>
          <div className="divide-y divide-[#e4dbd1]">
            {faqs.map((item) => (
              <article key={item.q} className="py-5">
                <h3 className="font-medium">{item.q}</h3>
                <p className="mt-2 text-sm leading-6 text-[#5e564e]">{item.a}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-[#e4dbd1] px-5 py-10 text-center sm:px-8">
        <p className="text-2xl italic">Alphacom Online</p>
        <p className="mt-2 text-sm text-[#8a7d72]">Computer Village, Ikeja, Lagos · Genuine tech, carefully chosen.</p>
      </footer>

      {activePhoto !== null ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[#1c1916]/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={photos[activePhoto].caption}
          onClick={() => setActivePhoto(null)}
        >
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

const inputClass =
  "mt-1.5 w-full rounded-xl border border-[#d8cfc4] bg-[#faf7f3] px-4 py-3.5 text-base text-[#1c1916] outline-none transition placeholder:text-[#a3988c] focus:border-[#1c1916] focus:bg-white focus:ring-2 focus:ring-[#1c1916]/10"

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-4 block text-sm font-medium text-[#1c1916]">
      {label}
      {children}
    </label>
  )
}
