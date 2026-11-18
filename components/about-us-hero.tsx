import Image from "next/image"

export function AboutUsHero() {
  return (
    <section className="bg-[#f6f3f0] text-stone-950 dark:bg-stone-950 dark:text-white">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14 lg:py-12">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-[#8E1B2C] dark:text-rose-300">
            Computer Village, Lagos
          </p>
          <h1 className="mt-4 text-4xl font-light tracking-tight sm:text-5xl">
            About
            <span className="mt-1 block font-medium">Alphacom</span>
          </h1>
          <div className="mt-6 h-px w-12 bg-[#8E1B2C] dark:bg-rose-300" />
          <p className="mt-6 max-w-md text-sm leading-7 text-stone-600 sm:text-base dark:text-stone-300">
            Your trusted technology partner since 2000. From the heart of Ikeja, we have spent over two decades
            supplying quality ICT products across Nigeria.
          </p>
        </div>

        <div className="relative h-52 overflow-hidden sm:h-64 lg:h-72">
          <Image
            src="/aboutpic.jpg"
            alt="Alphacom"
            fill
            priority
            className="object-cover object-[center_40%]"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>
      </div>
    </section>
  )
}
