import type { CSSProperties } from "react"

function maskStyle(src: string): CSSProperties {
  return {
    WebkitMaskImage: `url(${src})`,
    maskImage: `url(${src})`,
    WebkitMaskSize: "contain",
    maskSize: "contain",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskPosition: "center",
  }
}

function ShiningLogo({ src, className }: { src: string; className: string }) {
  return (
    <div className={className}>
      <div className="relative">
        <img src={src} alt="Alphacom" className="h-14 w-auto select-none sm:h-16" draggable={false} />
        <div className="pointer-events-none absolute inset-0 overflow-hidden" style={maskStyle(src)} aria-hidden>
          <div className="animate-brand-shine absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/90 to-transparent" />
        </div>
      </div>
    </div>
  )
}

export function BrandLoader({ label = "Loading" }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="animate-brand-loader-in fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-background"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-60 dark:opacity-40"
        style={{
          background:
            "radial-gradient(60% 45% at 50% 42%, rgba(30,64,175,0.10), transparent 70%), radial-gradient(40% 30% at 62% 58%, rgba(220,38,38,0.08), transparent 70%)",
        }}
        aria-hidden
      />

      <div className="relative flex h-64 w-64 items-center justify-center sm:h-72 sm:w-72">
        <div
          className="animate-brand-glow absolute inset-10 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.28),rgba(220,38,38,0.12)_55%,transparent_72%)] blur-2xl"
          aria-hidden
        />

        <div
          className="animate-brand-spin absolute inset-4 rounded-full p-[2px] [mask:radial-gradient(farthest-side,transparent_calc(100%-2px),#000_calc(100%-2px))]"
          style={{
            background: "conic-gradient(from 0deg, transparent 0deg, transparent 200deg, #1e40af 290deg, #dc2626 350deg, transparent 360deg)",
          }}
          aria-hidden
        />
        <div
          className="animate-brand-spin-reverse absolute inset-9 rounded-full [mask:radial-gradient(farthest-side,transparent_calc(100%-1px),#000_calc(100%-1px))]"
          style={{
            background: "conic-gradient(from 90deg, transparent 0deg, transparent 240deg, rgba(220,38,38,0.7) 320deg, transparent 360deg)",
          }}
          aria-hidden
        />
        <div className="absolute inset-4 rounded-full border border-foreground/[0.06]" aria-hidden />

        <div className="animate-brand-logo relative">
          <ShiningLogo src="/alpw1.png" className="dark:hidden" />
          <ShiningLogo src="/alpd.png" className="hidden dark:block" />
        </div>
      </div>

      <div className="relative mt-2 flex flex-col items-center gap-4">
        <div className="relative h-[3px] w-44 overflow-hidden rounded-full bg-foreground/[0.08]">
          <div className="animate-brand-progress absolute inset-y-0 left-0 w-full origin-left rounded-full bg-gradient-to-r from-blue-700 via-blue-500 to-red-600" />
        </div>
        <p className="flex items-center text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
          {label}
          <span className="ml-1 inline-flex gap-[3px]" aria-hidden>
            <span className="animate-brand-dot inline-block h-1 w-1 rounded-full bg-current" />
            <span className="animate-brand-dot inline-block h-1 w-1 rounded-full bg-current [animation-delay:0.15s]" />
            <span className="animate-brand-dot inline-block h-1 w-1 rounded-full bg-current [animation-delay:0.3s]" />
          </span>
        </p>
      </div>
    </div>
  )
}
