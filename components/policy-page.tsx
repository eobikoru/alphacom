import type { ReactNode } from "react"
import { AppLayout } from "@/components/app-layout"

export function PolicyPage({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string
  title: string
  intro: string
  children: ReactNode
}) {
  return (
    <AppLayout>
      <div className="bg-[#f6f3f0] text-stone-950 dark:bg-stone-950 dark:text-white">
        <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:py-12">
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-[#8E1B2C] dark:text-rose-300">{eyebrow}</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-light tracking-tight sm:text-5xl">{title}</h1>
          <div className="mt-6 h-px w-12 bg-[#8E1B2C] dark:bg-rose-300" />
          <p className="mt-6 max-w-xl text-sm leading-7 text-stone-600 sm:text-base dark:text-stone-300">{intro}</p>
        </section>
        <section className="border-t border-stone-200/80 bg-white dark:border-white/10 dark:bg-stone-900">
          <div className="mx-auto max-w-3xl space-y-12 px-5 py-14 sm:px-8 lg:py-16">{children}</div>
        </section>
      </div>
    </AppLayout>
  )
}

export function PolicySection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-2xl font-light tracking-tight">{title}</h2>
      <div className="mt-4 space-y-4 text-sm leading-7 text-stone-600 dark:text-stone-300">{children}</div>
    </section>
  )
}

export function PolicyList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-1.5 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}
