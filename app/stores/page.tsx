import type { Metadata } from "next"
import { AppLayout } from "@/components/app-layout"
import { SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
  title: "AlphaCom store in Computer Village",
  description:
    "Visit AlphaCom at No 3 Adepele Street, off Medical Road, Computer Village, Ikeja. Open Monday, Tuesday, Wednesday and Friday 9:00 to 18:00, Thursday 10:00 to 18:00, Saturday 10:00 to 16:00.",
  alternates: { canonical: `${SITE_URL}/stores` },
}
import { Clock, Mail, MapPin, Navigation, Phone } from "lucide-react"

const store = {
  name: "Alphacom Online Store",
  address: "No 3 Adepele street, off Medical road",
  city: "Computer Village, Ikeja",
  state: "Lagos",
  phones: ["+234 702 638 4967", "+234 813 733 1005"],
  email: "alphacomonline@gmail.com",
  hours: [
    { label: "Monday – Wednesday", value: "9:00 AM – 6:00 PM" },
    { label: "Thursday", value: "10:00 AM – 6:00 PM" },
    { label: "Friday", value: "9:00 AM – 6:00 PM" },
    { label: "Saturday", value: "10:00 AM – 4:00 PM" },
    { label: "Sunday", value: "Closed" },
  ],
  services: ["In-store pickup", "Tech support", "Product consultation", "Warranty service", "Returns and exchange"],
}

const mapQuery = encodeURIComponent(`${store.address}, ${store.city}, ${store.state}`)
const directionsUrl = `https://maps.google.com/maps?q=${mapQuery}`
const mapEmbedUrl = `https://maps.google.com/maps?q=${mapQuery}&z=16&output=embed`

export default function StoreLocatorPage() {
  return (
    <AppLayout>
      <div className="bg-[#f6f3f0] text-stone-950 dark:bg-stone-950 dark:text-white">
        <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:py-12">
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-[#8E1B2C] dark:text-rose-300">
            Computer Village, Lagos
          </p>
          <h1 className="mt-4 text-4xl font-light tracking-tight sm:text-5xl">Visit the store</h1>
          <div className="mt-6 h-px w-12 bg-[#8E1B2C] dark:bg-rose-300" />
          <p className="mt-6 max-w-xl text-sm leading-7 text-stone-600 sm:text-base dark:text-stone-300">
            See the products in person at No 3 Adepele Street, off Medical Road, in the heart of Computer Village.
          </p>
        </section>

        <section className="border-t border-stone-200/80 bg-white dark:border-white/10 dark:bg-stone-900">
          <div className="mx-auto grid max-w-6xl items-start gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:py-16">
            <div itemScope itemType="https://schema.org/Store">
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#8E1B2C] dark:text-rose-300">
                Our location
              </p>
              <h2 className="mt-4 text-3xl font-light tracking-tight" itemProp="name">
                {store.name}
              </h2>

              <div className="mt-10 space-y-8">
                <div
                  className="flex gap-4"
                  itemProp="address"
                  itemScope
                  itemType="https://schema.org/PostalAddress"
                >
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#8E1B2C] dark:text-rose-300" strokeWidth={1.5} />
                  <div>
                    <p className="text-sm leading-6" itemProp="streetAddress">
                      {store.address}
                    </p>
                    <p className="text-sm leading-6 text-stone-600 dark:text-stone-300">
                      <span itemProp="addressLocality">{store.city}</span>, <span itemProp="addressRegion">{store.state}</span>
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[#8E1B2C] dark:text-rose-300" strokeWidth={1.5} />
                  <div>
                    {store.phones.map((phone) => (
                      <a key={phone} href={`tel:${phone.replace(/\s/g, "")}`} className="block text-sm leading-6" itemProp="telephone">
                        {phone}
                      </a>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4" itemProp="openingHours">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-[#8E1B2C] dark:text-rose-300" strokeWidth={1.5} />
                  <div className="space-y-1">
                    {store.hours.map((row) => (
                      <p key={row.label} className="flex gap-6 text-sm leading-6">
                        <span className="w-36 text-stone-500 dark:text-stone-400">{row.label}</span>
                        <span>{row.value}</span>
                      </p>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[#8E1B2C] dark:text-rose-300" strokeWidth={1.5} />
                  <a href={`mailto:${store.email}`} className="text-sm leading-6" itemProp="email">
                    {store.email}
                  </a>
                </div>
              </div>

              <div className="mt-10">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">
                  In store
                </p>
                <p className="mt-3 max-w-md text-sm leading-7 text-stone-600 dark:text-stone-300">
                  {store.services.join(" · ")}
                </p>
              </div>

              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10 inline-flex items-center gap-2 rounded-full bg-[#8E1B2C] px-5 py-2.5 text-sm text-white transition-colors hover:bg-[#741625] dark:bg-rose-300 dark:text-stone-950 dark:hover:bg-rose-200"
              >
                <Navigation className="h-4 w-4" />
                Get directions
              </a>
            </div>

            <div className="overflow-hidden bg-stone-100 lg:sticky lg:top-28 dark:bg-stone-800">
              <iframe
                title="Alphacom store on Google Maps"
                src={mapEmbedUrl}
                className="h-80 w-full border-0 lg:h-[32rem]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  )
}
