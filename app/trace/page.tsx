import type { Metadata } from "next"
import { AppLayout } from "@/components/app-layout"
import { TraceGame } from "@/components/trace-game"

export const metadata: Metadata = {
  title: "Trace",
  description: "Alphacom's daily path puzzle. Connect the numbered dots in order and fill every cell.",
}

export default function TracePage() {
  return (
    <AppLayout>
      <TraceGame />
    </AppLayout>
  )
}
