"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

const emptySubscribe = () => () => {}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = React.useSyncExternalStore(emptySubscribe, () => true, () => false)

  if (!mounted) {
    return (
      <div className="size-9 sm:size-10 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-800/60" />
    )
  }

  const isDark = resolvedTheme === "dark"

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="size-9 sm:size-10 rounded-lg border-slate-200/85 dark:border-slate-800 bg-white dark:bg-card text-foreground/85 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {isDark ? (
        <Sun className="size-5 sm:size-[22px] text-accent transition-transform duration-300 rotate-0 scale-100" />
      ) : (
        <Moon className="size-5 sm:size-[22px] text-slate-700 dark:text-slate-200 transition-transform duration-300 rotate-0 scale-100" />
      )}
    </Button>
  )
}
