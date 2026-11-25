import type { Metadata } from "next"
import { SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
  title: "Contact AlphaCom in Lagos",
  description:
    "Call AlphaCom Online on +234 702 638 4967 or +234 813 733 1005, or visit No 3 Adepele Street, off Medical Road, Computer Village, Ikeja.",
  alternates: { canonical: `${SITE_URL}/contact` },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
