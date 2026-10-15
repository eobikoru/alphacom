"use client"

import { useId, useState } from "react"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { useBlogFaqs } from "@/hooks/use-blog"

export function BlogFaq() {
  const { data, isLoading } = useBlogFaqs()
  const faqs = [...(data?.data ?? [])].sort((a, b) => a.sort_order - b.sort_order)
  const [openId, setOpenId] = useState<string | null>(null)
  const baseId = useId()

  if (isLoading || faqs.length === 0) return null

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  }

  return (
    <section aria-labelledby={`${baseId}-title`} className="mt-28 grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)] lg:gap-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <div className="lg:sticky lg:top-40 lg:self-start">
        <p className="mb-3 inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-stone-500">
          <span className="h-px w-8 bg-stone-400" />
          Good to know
        </p>
        <h2 id={`${baseId}-title`} className="font-bold text-5xl leading-none lg:text-4xl">
          Questions, <em className="not-italic text-[#8E1B2C] dark:text-rose-300">answered</em>
        </h2>
        <p className="mt-5 max-w-sm leading-relaxed text-stone-600 dark:text-stone-400">
          Everything you might want to know before you shop with us.
        </p>
      </div>

      <ul className="border-t border-stone-900/10 dark:border-white/10">
        {faqs.map((faq, index) => {
          const isOpen = openId === faq.id
          const panelId = `${baseId}-panel-${faq.id}`
          const buttonId = `${baseId}-button-${faq.id}`
          return (
            <li key={faq.id} className="border-b border-stone-900/10 dark:border-white/10">
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="group flex w-full items-start gap-5 py-7 text-left sm:gap-8"
                >
                  <span
                    className={cn(
                      "mt-1 w-7 shrink-0 text-sm font-semibold tabular-nums transition-colors",
                      isOpen ? "text-[#8E1B2C] dark:text-rose-300" : "text-stone-400",
                    )}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={cn(
                      "flex-1 text-xl font-semibold leading-snug transition-colors sm:text-2xl lg:text-xl",
                      isOpen
                        ? "text-stone-900 dark:text-white"
                        : "text-stone-700 group-hover:text-stone-900 dark:text-stone-300 dark:group-hover:text-white",
                    )}
                  >
                    {faq.question}
                  </span>
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-500",
                      isOpen
                        ? "rotate-45 border-stone-900 bg-stone-900 text-white dark:border-white dark:bg-white dark:text-stone-900"
                        : "border-stone-900/15 text-stone-600 group-hover:border-stone-900/40 dark:border-white/15 dark:text-stone-300",
                    )}
                    aria-hidden
                  >
                    <Plus className="h-4 w-4" />
                  </span>
                </button>
              </h3>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                aria-hidden={!isOpen}
                className={cn(
                  "grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                )}
              >
                <div className="overflow-hidden">
                  <p className="whitespace-pre-line pb-8 pl-12 pr-12 text-base leading-relaxed text-stone-600 sm:pl-[3.75rem] sm:text-[17px] dark:text-stone-400">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
