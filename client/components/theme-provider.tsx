"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { usePathname } from "next/navigation"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const pathname = usePathname()

  // The landing page and public pages must NEVER be hampered by the dark theme.
  // Theme customization (dark / light mode) is strictly reserved for the 3 workspace pillars:
  // - Investigator / Researcher Workspace (/dashboard)
  // - Institutional Governance Admin Console (/admin/*)
  // - IRB Deliberation Chamber Reviewer Portal (/reviewer/*)
  const isPublicPage = pathname === "/" || pathname === "/apply"

  React.useEffect(() => {
    if (isPublicPage) {
      document.documentElement.classList.remove("dark")
      document.documentElement.classList.add("light")
      document.documentElement.style.colorScheme = "light"
    }
  }, [isPublicPage])

  return (
    <NextThemesProvider
      {...props}
      forcedTheme={isPublicPage ? "light" : undefined}
    >
      {children}
    </NextThemesProvider>
  )
}
