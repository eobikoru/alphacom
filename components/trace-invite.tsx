"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { readTraceProgress, traceDateId } from "@/lib/trace-puzzle"

export function TraceInvite() {
  const [solved, setSolved] = useState(false)

  useEffect(() => {
    setSolved(readTraceProgress().solved.includes(traceDateId()))
  }, [])

  return (
    <div className="bg-[#f6f3f0] px-4 py-4 dark:bg-stone-950 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 rounded-3xl border border-stone-200/80 bg-white px-4 py-4 dark:border-white/10 dark:bg-stone-900 sm:flex-row sm:items-center sm:px-5">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <TraceMark />
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">Need a 30 second break?</p>
            <p className="mt-1 text-base font-medium tracking-tight text-stone-950 dark:text-white">
              {solved ? "Today's circuit is clear." : "You've earned it."}
            </p>
            <p className="text-sm text-stone-500 dark:text-stone-400">
              {solved ? "A new Trace arrives at midnight." : "Trace is Alphacom's daily path puzzle."}
            </p>
          </div>
        </div>
        <Link
          href="/trace"
          className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-[#8E1B2C] px-5 text-sm font-medium text-white transition-colors hover:bg-[#741625] dark:bg-rose-300 dark:text-stone-950 dark:hover:bg-rose-200"
        >
          {solved ? "See the path" : "Solve now"}
        </Link>
      </div>
    </div>
  )
}

function TraceMark() {
  return (
    <svg viewBox="0 0 64 64" className="h-14 w-14 shrink-0" aria-hidden>
      <rect x="1" y="1" width="62" height="62" rx="16" fill="#8E1B2C" />
      <path d="M16 18 H34 V46 H22 V30 H16 Z" fill="white" />
      <circle cx="16" cy="18" r="3.2" fill="#0c0a09" />
      <circle cx="34" cy="46" r="3.2" fill="#0c0a09" />
      <circle cx="22" cy="30" r="3.2" fill="#0c0a09" />
    </svg>
  )
}
