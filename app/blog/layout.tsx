import type React from "react"
import { Instrument_Serif } from "next/font/google"

const displaySerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif-display",
  display: "swap",
})

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <div className={displaySerif.variable}>{children}</div>
}
