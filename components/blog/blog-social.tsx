import { cn } from "@/lib/utils"
import { SOCIAL_LINKS } from "@/lib/social-links"

export function BlogSocialIcons({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="mr-1 text-xs font-medium text-muted-foreground">Follow us</span>
      {SOCIAL_LINKS.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Follow Alphacom on ${label}`}
          title={label}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-foreground/70 transition hover:border-foreground hover:bg-foreground hover:text-background"
        >
          <Icon className="h-4 w-4" />
        </a>
      ))}
    </div>
  )
}

export function BlogSocialCard({ className }: { className?: string }) {
  return (
    <section className={cn("rounded-2xl border border-border bg-white p-5 sm:p-6 dark:bg-card", className)}>
      <h2 className="text-base font-semibold">Follow Alphacom</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Get new arrivals, deals and tech tips on your favourite platform.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {SOCIAL_LINKS.map(({ label, handle, href, Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex min-w-0 items-center gap-2.5 rounded-xl border border-border bg-background px-3 py-2.5 transition hover:border-foreground"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
              <Icon className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium">{label.replace(" (Twitter)", "")}</span>
              <span className="block truncate text-xs text-muted-foreground">{handle}</span>
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}
