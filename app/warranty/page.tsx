import type { Metadata } from "next"
import { PolicyList, PolicyPage, PolicySection } from "@/components/policy-page"
import { SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
  title: "Warranty",
  description: "How the AlphaCom Online warranty works for products bought in store or on alphacomonline.com.",
  alternates: { canonical: `${SITE_URL}/warranty` },
}

const steps = [
  {
    title: "Contact us",
    text: "Call or email us with your order number and issue description",
  },
  {
    title: "Assessment",
    text: "We'll assess the issue and determine warranty coverage",
  },
  {
    title: "Resolution",
    text: "Repair, replace, or refund based on warranty terms",
  },
]

export default function WarrantyPage() {
  return (
    <PolicyPage
      eyebrow="Warranty policy"
      title="Product warranty"
      intro="We stand behind the quality of our products with comprehensive warranty coverage."
    >
      <PolicySection title="Our warranty promise">
        <p>
          All products sold by Alphacom Online Store come with manufacturer warranties. We also provide additional
          support to ensure you get the most out of your purchase.
        </p>
      </PolicySection>

      <PolicySection title="What's covered">
        <div>
          <h3 className="font-medium text-stone-950 dark:text-white">Manufacturing defects</h3>
          <PolicyList
            items={[
              "Hardware failures due to manufacturing defects",
              "Performance issues not meeting specifications",
            ]}
          />
        </div>
        <div>
          <h3 className="font-medium text-stone-950 dark:text-white">Parts and labor</h3>
          <PolicyList items={["Labor costs for authorized repairs", "Diagnostic services"]} />
        </div>
      </PolicySection>

      <PolicySection title="What's not covered">
        <PolicyList
          items={[
            "Physical damage from drops, spills, or accidents",
            "Damage from misuse or abuse",
            "Normal wear and tear (scratches, fading)",
            "Damage from unauthorized repairs or modifications",
            "Software issues caused by user-installed programs",
            "Damage from power surges or electrical issues",
            "Consumable items (batteries, ink cartridges)",
            "Cosmetic damage that doesn't affect functionality",
          ]}
        />
      </PolicySection>

      <PolicySection title="How to claim warranty">
        <div className="grid gap-8 sm:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title}>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#8E1B2C] dark:text-rose-300">
                0{index + 1}
              </p>
              <h3 className="mt-2 font-medium text-stone-950 dark:text-white">{step.title}</h3>
              <p className="mt-2">{step.text}</p>
            </div>
          ))}
        </div>
        <div>
          <h3 className="font-medium text-stone-950 dark:text-white">Required information</h3>
          <PolicyList
            items={[
              "Order number or receipt",
              "Product serial number",
              "Description of the issue",
              "Photos or videos of the problem (if applicable)",
              "Purchase date",
            ]}
          />
        </div>
      </PolicySection>
    </PolicyPage>
  )
}
