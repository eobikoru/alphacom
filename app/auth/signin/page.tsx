"use client"

import { useEffect } from "react"
import { AppLayout } from "@/components/app-layout"
import { useAuthModal } from "@/components/auth-modal"

export default function SignInPage() {
  const { openAuth } = useAuthModal()

  useEffect(() => {
    openAuth("signin")
  }, [openAuth])

  return (
    <AppLayout>
      <div className="flex min-h-[50vh] items-center justify-center px-4">
        <button type="button" onClick={() => openAuth("signin")} className="text-sm font-medium text-cyan-600">
          Sign in
        </button>
      </div>
    </AppLayout>
  )
}
