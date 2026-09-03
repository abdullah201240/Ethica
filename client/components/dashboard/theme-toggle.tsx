"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

const emptySubscribe = () => () => {}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = React.useSyncExternalStore(emptySubscribe, () => true, () => false)

  if (!mounted) {
    return (
      <div className="size-9 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-800/60" />
    )
  }

  const isDark = resolvedTheme === "dark"

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex size-9 items-center justify-center rounded-lg border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-card text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {isDark ? (
        <Sun className="size-4 text-[#E0C23C] transition-transform duration-300 rotate-0 scale-100" />
      ) : (
        <Moon className="size-4 text-slate-700 transition-transform duration-300 rotate-0 scale-100" />
      )}
    </button>
  )
}
