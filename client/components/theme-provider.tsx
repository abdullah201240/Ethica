"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { usePathname } from "next/navigation"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const pathname = usePathname()

  // The landing page, public marketing pages, and institutional login pages must NEVER be hampered by the dark theme.
  // Theme customization (dark / light mode) is strictly reserved for authenticated workspace dashboards:
  // - Investigator / Researcher Workspace (/dashboard, /protocols, etc.)
  // - Institutional Governance Admin Console (/admin/dashboard, /admin/roster, etc.)
  // - IRB Deliberation Chamber Reviewer Portal (/reviewer/dashboard, etc.)
  const isPureLightPage = Boolean(
    pathname === "/" ||
    pathname === "/apply" ||
    pathname === "/login" ||
    pathname === "/admin/login" ||
    pathname === "/reviewer/login" ||
    pathname?.endsWith("/login")
  )

  React.useEffect(() => {
    if (isPureLightPage) {
      document.documentElement.classList.remove("dark")
      document.documentElement.classList.add("light")
      document.documentElement.style.colorScheme = "light"
    }
  }, [isPureLightPage])

  return (
    <NextThemesProvider
      {...props}
      forcedTheme={isPureLightPage ? "light" : undefined}
    >
      {children}
    </NextThemesProvider>
  )
}
