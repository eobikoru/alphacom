import type React from "react"
import { Instagram, Linkedin, Youtube } from "lucide-react"

export function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  )
}

export function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

export interface SocialLink {
  label: string
  handle: string
  href: string
  Icon: React.ComponentType<{ className?: string }>
}

export const SOCIAL_LINKS: SocialLink[] = [
  { label: "Instagram", handle: "@alphacom_online", href: "https://www.instagram.com/alphacom_online", Icon: Instagram },
  { label: "TikTok", handle: "@alphacom_online", href: "https://www.tiktok.com/@alphacom_online", Icon: TikTokIcon },
  { label: "X (Twitter)", handle: "@alphacom_online", href: "https://x.com/alphacom_online", Icon: XIcon },
  { label: "YouTube", handle: "@alphacom_online", href: "https://www.youtube.com/@alphacom_online", Icon: Youtube },
  {
    label: "LinkedIn",
    handle: "Alphacom Interbiz",
    href: "https://www.linkedin.com/in/alphacom-interbiz-projects-limited-71959b123/",
    Icon: Linkedin,
  },
]
