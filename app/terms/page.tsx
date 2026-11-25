import type { Metadata } from "next"
import { PolicyList, PolicyPage, PolicySection } from "@/components/policy-page"
import { SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
  title: "Terms and conditions",
  description: "The terms for shopping at AlphaCom Online, Computer Village, Ikeja.",
  alternates: { canonical: `${SITE_URL}/terms` },
}

export default function TermsPage() {
  return (
    <PolicyPage
      eyebrow="Terms and conditions"
      title="Terms of service"
      intro="Please read these terms carefully before using our services."
    >
      <p className="text-sm leading-7 text-stone-500">
        These Terms and Conditions govern your use of Alphacom Online Store and the purchase of our products.
      </p>

      <PolicySection title="Acceptance of terms">
        <p>
          By accessing and using this website, you accept and agree to be bound by the terms and provision of this
          agreement. If you do not agree to abide by the above, please do not use this service.
        </p>
      </PolicySection>

      <PolicySection title="Products and services">
        <div>
          <h3 className="font-medium text-stone-950 dark:text-white">Product information</h3>
          <PolicyList
            items={[
              "We strive to provide accurate product descriptions and images",
              "Specifications may vary slightly from manufacturer updates",
              "Colors may appear different due to monitor settings",
              "We reserve the right to correct any errors or inaccuracies",
            ]}
          />
        </div>
        <div>
          <h3 className="font-medium text-stone-950 dark:text-white">Availability</h3>
          <PolicyList
            items={[
              "All products are subject to availability",
              "We reserve the right to discontinue products without notice",
              "Pre-order items may have extended delivery times",
            ]}
          />
        </div>
      </PolicySection>

      <PolicySection title="Ordering and payment">
        <div>
          <h3 className="font-medium text-stone-950 dark:text-white">Order process</h3>
          <PolicyList
            items={[
              "Orders are subject to acceptance and availability",
              "We reserve the right to refuse or cancel orders",
              "Order confirmation will be sent via email",
              "Prices are subject to change without notice",
            ]}
          />
        </div>
        <div>
          <h3 className="font-medium text-stone-950 dark:text-white">Payment terms</h3>
          <PolicyList
            items={[
              "Payment is required at the time of order",
              "We accept major credit cards and bank transfers",
              "All prices are in Nigerian Naira (NGN)",
              "Payment processing is handled by secure third-party providers",
            ]}
          />
        </div>
      </PolicySection>

      <PolicySection title="Shipping and delivery">
        <PolicyList
          items={[
            "Delivery times are estimates and not guaranteed",
            "Shipping costs are calculated at checkout",
            "Risk of loss passes to customer upon delivery",
            "We are not responsible for delays caused by shipping carriers",
            "Customers must inspect packages upon receipt",
          ]}
        />
      </PolicySection>

      <PolicySection title="Returns and refunds">
        <PolicyList
          items={[
            "Returns must be initiated within 24hrs of receipt",
            "Items must be in original condition with all packaging",
            "Customer is responsible for return shipping costs",
            "Refunds will be processed within 5-10 business days",
            "Some items may be non-returnable (software, consumables)",
          ]}
        />
      </PolicySection>

      <PolicySection title="Warranties and disclaimers">
        <div>
          <h3 className="font-medium text-stone-950 dark:text-white">Product warranties</h3>
          <PolicyList
            items={[
              "Products come with manufacturer warranties",
              "Warranty terms vary by product and manufacturer",
              "We facilitate warranty claims but are not the warranty provider",
            ]}
          />
        </div>
        <div>
          <h3 className="font-medium text-stone-950 dark:text-white">Disclaimers</h3>
          <PolicyList
            items={[
              'Products are sold "as is" without additional warranties',
              "We disclaim all implied warranties to the extent permitted by law",
              "Our liability is limited to the purchase price of the product",
            ]}
          />
        </div>
      </PolicySection>

      <PolicySection title="User conduct">
        <p>You agree not to:</p>
        <PolicyList
          items={[
            "Use the website for any unlawful purpose",
            "Attempt to gain unauthorized access to our systems",
            "Interfere with the website's operation",
            "Post or transmit harmful content",
            "Violate any applicable laws or regulations",
          ]}
        />
      </PolicySection>

      <PolicySection title="Intellectual property">
        <p>
          All content on this website, including text, graphics, logos, images, and software, is the property of
          Alphacom Online Store or its content suppliers and is protected by copyright and other intellectual property
          laws. You may not reproduce, distribute, or create derivative works without our written permission.
        </p>
      </PolicySection>

      <PolicySection title="Limitation of liability">
        <p>
          In no event shall Alphacom Online Store be liable for any indirect, incidental, special, consequential, or
          punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible
          losses, resulting from your use of our services.
        </p>
      </PolicySection>

      <PolicySection title="Governing law">
        <p>
          These terms shall be governed by and construed in accordance with the laws of Nigeria. Any disputes arising
          under these terms shall be subject to the exclusive jurisdiction of the courts of Lagos State, Nigeria.
        </p>
      </PolicySection>

      <PolicySection title="Contact us">
        <p>If you have questions about these Terms and Conditions, please contact us.</p>
      </PolicySection>

      <PolicySection title="Changes to terms">
        <p>
          We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on
          the website. Your continued use of the service after any changes constitutes acceptance of the new terms.
        </p>
      </PolicySection>
    </PolicyPage>
  )
}
