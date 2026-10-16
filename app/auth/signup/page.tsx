"use client"

import { useEffect } from "react"
import { AppLayout } from "@/components/app-layout"
import { useAuthModal } from "@/components/auth-modal"

export default function SignUpPage() {
  const { openAuth } = useAuthModal()

  useEffect(() => {
    openAuth("signup")
  }, [openAuth])

  return (
    <AppLayout>
      <div className="flex min-h-[50vh] items-center justify-center px-4">
        <button type="button" onClick={() => openAuth("signup")} className="text-sm font-medium text-cyan-600">
          Create an account
        </button>
      </div>
    </AppLayout>
  )
}
