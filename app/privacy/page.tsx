import type { Metadata } from "next"
import { PolicyList, PolicyPage, PolicySection } from "@/components/policy-page"
import { SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How AlphaCom Online collects, uses, and protects customer information.",
  alternates: { canonical: `${SITE_URL}/privacy` },
}

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage
      eyebrow="Privacy policy"
      title="Your privacy matters"
      intro="We are committed to protecting your personal information and being transparent about how we use it."
    >
      <p className="text-sm leading-7 text-stone-500">
        Last updated January 1, 2025. This Privacy Policy explains how Alphacom Online Store collects, uses, and
        protects your information.
      </p>

      <PolicySection title="Information we collect">
        <div>
          <h3 className="font-medium text-stone-950 dark:text-white">Personal information</h3>
          <PolicyList
            items={[
              "Name, email address, and phone number",
              "Billing and shipping addresses",
              "Payment information (processed securely by our payment partners)",
              "Account credentials and preferences",
            ]}
          />
        </div>
        <div>
          <h3 className="font-medium text-stone-950 dark:text-white">Usage information</h3>
          <PolicyList
            items={[
              "Pages visited and products viewed",
              "Search queries and browsing behavior",
              "Device information and IP address",
              "Cookies and similar tracking technologies",
            ]}
          />
        </div>
      </PolicySection>

      <PolicySection title="How we use your information">
        <PolicyList
          items={[
            "Process and fulfill your orders",
            "Provide customer support and technical assistance",
            "Send order confirmations and shipping updates",
            "Improve our website and services",
            "Send promotional emails (with your consent)",
            "Prevent fraud and ensure security",
            "Comply with legal obligations",
          ]}
        />
      </PolicySection>

      <PolicySection title="Information sharing">
        <p>
          We do not sell, trade, or rent your personal information to third parties. We may share your information only
          in the following circumstances:
        </p>
        <PolicyList
          items={[
            "With trusted service providers who help us operate our business",
            "With shipping companies to deliver your orders",
            "With payment processors to handle transactions securely",
            "When required by law or to protect our rights",
            "With your explicit consent",
          ]}
        />
      </PolicySection>

      <PolicySection title="Data security">
        <p>We implement appropriate security measures to protect your personal information:</p>
        <PolicyList
          items={[
            "SSL encryption for all data transmission",
            "Secure servers and databases",
            "Regular security audits and updates",
            "Limited access to personal information",
            "Employee training on data protection",
          ]}
        />
      </PolicySection>

      <PolicySection title="Your rights">
        <p>You have the right to:</p>
        <PolicyList
          items={[
            "Access your personal information",
            "Correct inaccurate information",
            "Delete your account and personal data",
            "Opt-out of marketing communications",
            "Request data portability",
            "Object to certain data processing",
          ]}
        />
      </PolicySection>

      <PolicySection title="Cookies and tracking">
        <p>We use cookies and similar technologies to enhance your browsing experience:</p>
        <PolicyList
          items={[
            "Essential cookies for website functionality",
            "Analytics cookies to understand usage patterns",
            "Marketing cookies for personalized ads (with consent)",
            "Preference cookies to remember your settings",
          ]}
        />
        <p>You can manage cookie preferences through your browser settings.</p>
      </PolicySection>

      <PolicySection title="Contact us about privacy">
        <p>If you have questions about this Privacy Policy or want to exercise your rights, contact us:</p>
        <p>
          Email alphacomonline@gmail.com
          <br />
          Phone +234 702 638 4967, +234 813 733 1005
          <br />
          No 3 Adepele street, off Medical road, Computer village Ikeja, Lagos
        </p>
      </PolicySection>

      <PolicySection title="Changes to this policy">
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting
          the new policy on our website and updating the &quot;Last Updated&quot; date. Your continued use of our
          services after any changes constitutes acceptance of the updated policy.
        </p>
      </PolicySection>
    </PolicyPage>
  )
}
