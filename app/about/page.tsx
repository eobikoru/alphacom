import { AboutUsHero } from "@/components/about-us-hero"
import { Mail, MapPin, Phone, Shield, Star, Truck, HeartHandshake } from "lucide-react"
import { AppLayout } from "@/components/app-layout"

const stats = [
  { value: "50,000+", label: "Happy customers" },
  { value: "25+", label: "Years of excellence" },
  { value: "200,000+", label: "Products sold" },
  { value: "3", label: "Store locations" },
]

const values = [
  {
    icon: Shield,
    title: "Quality assurance",
    description: "We guarantee authentic products from trusted manufacturers with comprehensive warranties.",
  },
  {
    icon: Truck,
    title: "Fast delivery",
    description: "Quick and reliable delivery across Lagos and nationwide shipping to all states in Nigeria.",
  },
  {
    icon: HeartHandshake,
    title: "Customer support",
    description: "Dedicated support team available to help you with technical issues and product guidance.",
  },
  {
    icon: Star,
    title: "Expert advice",
    description: "Our knowledgeable staff provides personalized recommendations based on your specific needs.",
  },
]

const team = [
  {
    name: "Alphonsus Ejidike",
    role: "Founder & CEO",
    image: "/ceo.jpeg",
    description:
      "With over 23 years of experience in the ICT industry, Mr. Alphonsus Ejidike is a visionary leader and the driving force behind Alphacom Investment.",
  },
  {
    name: "Anthony",
    role: "Chief Technology Consultant",
    image: "/davi.jpg",
    description:
      "Anthony is a seasoned Information and Communication Technology Consultant with over 18years experience.",
  },
  {
    name: "Hephzibah Kolawole",
    role: "Manager, Finance & Administration",
    image: "/kola.jpeg",
    description:
      "Hephzibah is a skilled finance and administrative manager with a strong background in financial planning, budgeting, and organizational coordination.",
  },
  {
    name: "Ewaoluwa Hammed",
    role: "Manager, E-commerce",
    image: "/ewa.jpeg",
    description:
      "Ewaoluwa is a strategic e-commerce professional with extensive experience in managing digital sales channels, product listings, and customer engagement systems.",
  },
]

const contact = [
  {
    icon: MapPin,
    title: "Main store",
    lines: ["No 3 Adepele street, off Medical road", "Computer Village, Ikeja, Lagos", "Nigeria"],
  },
  {
    icon: Phone,
    title: "Phone",
    lines: ["+234 702 638 4967", "+234 813 733 1005", "Mon – Sat, 8AM – 7PM"],
  },
  {
    icon: Mail,
    title: "Email",
    lines: ["alphacomonline@gmail.com"],
  },
]

function Eyebrow({ children }: { children: string }) {
  return (
    <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#8E1B2C] dark:text-rose-300">{children}</p>
  )
}

export default function AboutPage() {
  return (
    <AppLayout>
      <div className="bg-[#f6f3f0] text-stone-950 dark:bg-stone-950 dark:text-white">
        <AboutUsHero />

        <section className="border-y border-stone-200/80 bg-white dark:border-white/10 dark:bg-stone-950">
          <div className="mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="px-5 py-8 sm:px-8">
                <p className="text-3xl font-light tracking-tight">{stat.value}</p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-16">
            <div>
              <Eyebrow>Our story</Eyebrow>
              <h2 className="mt-4 text-3xl font-light tracking-tight sm:text-4xl">Building Nigeria&apos;s tech future</h2>
            </div>
            <div className="space-y-5 text-sm leading-7 text-stone-600 sm:text-base dark:text-stone-300">
              <p>
                Founded by Alphonsus Ejidike, Alphacom began as a small computer repair shop in Computer Village,
                Ikeja. What started as a passion for technology has grown into one of Nigeria&apos;s most trusted ICT
                retailers.
              </p>
              <p>
                Over the years, we&apos;ve expanded our offerings to include the latest laptops, smartphones, cameras,
                audio equipment, and accessories from top global brands. Our commitment to quality and customer
                satisfaction has earned us the trust of over 50,000 customers.
              </p>
              <p>
                Today, we continue to innovate and adapt to the changing technology landscape, ensuring our customers
                have access to the latest and most reliable tech products at competitive prices.
              </p>
            </div>
          </div>
          <div className="mt-12 overflow-hidden">
            <img src="/alpi.jpeg" alt="Alphacom store interior" className="h-64 w-full object-cover sm:h-80" />
          </div>
        </section>

        <section className="border-t border-stone-200/80 bg-white dark:border-white/10 dark:bg-stone-900">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
            <Eyebrow>Our values</Eyebrow>
            <h2 className="mt-4 max-w-md text-3xl font-light tracking-tight sm:text-4xl">What sets us apart</h2>
            <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => {
                const Icon = value.icon
                return (
                  <div key={value.title}>
                    <Icon className="h-5 w-5 text-[#8E1B2C] dark:text-rose-300" strokeWidth={1.5} />
                    <h3 className="mt-4 text-lg font-medium tracking-tight">{value.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-stone-600 dark:text-stone-300">{value.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
          <Eyebrow>Our team</Eyebrow>
          <h2 className="mt-4 text-3xl font-light tracking-tight sm:text-4xl">Meet the experts</h2>
          <div className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2">
            {team.map((member) => (
              <article key={member.name}>
                <div className="aspect-[4/5] overflow-hidden bg-stone-200 dark:bg-stone-800">
                  <img src={member.image} alt={member.name} className="h-full w-full object-cover object-top" />
                </div>
                <h3 className="mt-5 text-xl font-medium tracking-tight">{member.name}</h3>
                <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-[#8E1B2C] dark:text-rose-300">
                  {member.role}
                </p>
                <p className="mt-3 max-w-md text-sm leading-6 text-stone-600 dark:text-stone-300">{member.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-stone-200/80 bg-white dark:border-white/10 dark:bg-stone-900">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
            <Eyebrow>Visit us</Eyebrow>
            <h2 className="mt-4 text-3xl font-light tracking-tight sm:text-4xl">Find us at Computer Village</h2>
            <div className="mt-12 grid gap-10 md:grid-cols-3">
              {contact.map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.title}>
                    <Icon className="h-5 w-5 text-[#8E1B2C] dark:text-rose-300" strokeWidth={1.5} />
                    <h3 className="mt-4 text-lg font-medium tracking-tight">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-stone-600 dark:text-stone-300">
                      {item.lines.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  )
}
