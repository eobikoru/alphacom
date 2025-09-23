"use client"

import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { toggleTheme } from "@/store/slices/themeSlice"

export function ThemeToggle() {
  const isDark = useAppSelector((state) => state.theme.isDark)
  const dispatch = useAppDispatch()

  const handleToggle = () => {
    dispatch(toggleTheme())
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggle}
      className="h-9 w-9 p-0 rounded-full bg-background border-border hover:bg-muted transition-all duration-300 shadow-sm"
    >
      {isDark ? <Sun className="h-4 w-4 text-foreground" /> : <Moon className="h-4 w-4 text-foreground" />}
    </Button>
  )
}
