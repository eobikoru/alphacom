import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { SITE_URL } from "@/lib/site"

const title = "Thank you. Your order request has been received."
const description =
  "Alphacom Online has your request for the 20,000mAh power bank and free portable electric hand fan at ₦27,000, with free delivery within Lagos."

const offer = [
  ["Power bank", "20,000mAh"],
  ["Gift", "FREE portable electric hand fan"],
  ["Delivery", "FREE within Lagos"],
] as const

export const metadata: Metadata = {
  title,
  description,
  robots: { index: false, follow: false },
  alternates: { canonical: `${SITE_URL}/promotion/thank-you` },
  openGraph: { title, description, url: `${SITE_URL}/promotion/thank-you` },
}

export default function PromotionThankYouPage() {
  return (
    <main className="min-h-screen bg-[#F0F4F8] text-stone-950">
      <header className="border-b border-stone-200/70 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center px-5 py-3.5 sm:px-8">
          <Link href="/" aria-label="Alphacom Online home">
            <Image src="/alpw1.png" alt="Alphacom" width={180} height={48} className="h-10 w-auto" priority />
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-5xl items-center gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:py-20">
        <div className="overflow-hidden rounded-[1.75rem] bg-white shadow-[0_24px_60px_rgba(28,25,22,0.08)]">
          <Image
            src="/promotion/bundle.jpg"
            alt="20,000mAh power bank beside the free orange electric hand fan"
            width={768}
            height={1024}
            priority
            className="aspect-[4/5] w-full object-cover object-[center_42%]"
          />
        </div>

        <div>
          <p className="text-[12px] font-medium uppercase tracking-[0.28em] text-[#8E1B2C]">Alphacom Online</p>
          <h1 className="mt-4 max-w-lg text-4xl font-medium leading-[1.08] tracking-tight sm:text-5xl">
            Thank you. Your order request has been received.
          </h1>
          <p className="mt-5 max-w-md text-[15px] leading-7 text-stone-600">
            Thank you for choosing Alphacom Online. You&apos;re one step closer to staying powered and cool.
          </p>

          <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-stone-200 bg-white">
            <div className="flex items-end justify-between gap-4 border-b border-stone-200 px-6 py-5">
              <div>
                <p className="text-sm text-stone-500">Your request</p>
                <p className="mt-1 text-base font-medium">Special offer</p>
              </div>
              <p className="text-2xl font-medium tracking-tight text-[#8E1B2C]">₦27,000</p>
            </div>
            <ul>
              {offer.map(([label, value]) => (
                <li key={label} className="flex items-baseline justify-between gap-6 border-b border-stone-100 px-6 py-4 last:border-b-0">
                  <span className="text-sm text-stone-500">{label}</span>
                  <span className="text-right text-sm font-medium text-stone-950">{value}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-medium">What happens next?</h2>
            <p className="mt-3 max-w-md text-[15px] leading-7 text-stone-600">
              Our sales representative will contact you shortly to confirm your order and delivery details.
            </p>
            <p className="mt-3 text-[15px] font-medium text-stone-950">Please keep your phone available so we can reach you.</p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="https://wa.me/2347026384967"
              className="inline-flex items-center justify-center rounded-full bg-[#8E1B2C] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#741625]"
            >
              Chat on WhatsApp · 0702 638 4967
            </a>
            <p className="text-sm text-stone-500">Need immediate assistance?</p>
          </div>

          <p className="mt-10 text-sm leading-6 text-stone-500">
            Thank you for shopping with Alphacom Online.
            <span className="mt-1 block">Your destination for genuine tech products you can count on.</span>
          </p>
        </div>
      </section>
    </main>
  )
}
