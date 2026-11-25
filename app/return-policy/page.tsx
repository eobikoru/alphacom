import type { Metadata } from "next"
import { PolicyPage, PolicySection } from "@/components/policy-page"
import { SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
  title: "Return policy",
  description: "AlphaCom Online returns: start a return within 1 day of receiving the product.",
  alternates: { canonical: `${SITE_URL}/return-policy` },
}

const timeline = [
  {
    value: "24",
    title: "Hours to return",
    text: "You have 1 day from receipt to initiate a return. Call us to initiate a return.",
  },
  {
    value: "3–5",
    title: "Processing days",
    text: "We'll process your return within 3-5 business days",
  },
  {
    value: "5–10",
    title: "Refund days",
    text: "Refunds are processed within 5-10 business days",
  },
]

export default function ReturnPolicyPage() {
  return (
    <PolicyPage
      eyebrow="Return policy"
      title="Easy returns"
      intro="We want you to be completely satisfied with your purchase. Here is our return policy."
    >
      <PolicySection title="Our return promise">
        <p>
          We offer a 24 hours return policy on most items. If you&apos;re not completely satisfied with your purchase,
          we&apos;ll make it right.
        </p>
      </PolicySection>

      <PolicySection title="Return timeline">
        <div className="grid gap-8 sm:grid-cols-3">
          {timeline.map((item) => (
            <div key={item.title}>
              <p className="text-3xl font-light tracking-tight text-stone-950 dark:text-white">{item.value}</p>
              <h3 className="mt-3 font-medium text-stone-950 dark:text-white">{item.title}</h3>
              <p className="mt-2">{item.text}</p>
            </div>
          ))}
        </div>
      </PolicySection>
    </PolicyPage>
  )
}
