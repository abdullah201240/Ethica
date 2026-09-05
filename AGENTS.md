# Ethica Development Guidelines & Rules

Welcome to the **Ethica** project. All agents and developers must strictly follow the architectural and design rules outlined below.

---

## 1. UI Aesthetics & Styling Standards
- **Subtle Borders:** Favor `border border-border/75` (or `border-border/70`). Never use heavy, harsh borders or double borders (e.g., avoid `ring-1 ring-foreground/10` combined with borders).
- **Soft Ambient Shadows:** Never use heavy, muddy drop shadows. Use the diffuse shadow system:
  - `shadow-xs` / `shadow-sm` for cards, attachments, popovers, dropdowns.
  - `shadow-md` for modals, dialogs, sheets.
- **Calibrated Radii:** Base radius is `0.375rem` (6px).
  - Cards, dialogs, drawers, popups: `rounded-lg`
  - Buttons, inputs, small containers, badges: `rounded-md`
  - Avoid bulbous pill shapes (`rounded-2xl`, `rounded-3xl`, `rounded-4xl`) on containers and badges.
- **Bold & Prominent Large Typography:** The user loves large, impactful, eye-catching typography:
  - Hero headlines: `text-4xl sm:text-6xl md:text-7xl lg:text-8xl`
  - Section titles: `text-3xl sm:text-5xl md:text-6xl font-bold`
  - Card titles & subheaders: `text-lg sm:text-xl md:text-2xl`
  - Stat counters & metrics: `text-5xl sm:text-6xl md:text-7xl font-extrabold`
  - Body text: comfortable readable sizes (`text-base sm:text-lg`). Avoid tiny, cramped micro-text.

---

## 2. Official Color Palette & Theme Tokens
All pages, components, illustrations, and design tokens must strictly adhere to the official institutional color scheme:

| Purpose | Color | Hex | Role & Application |
| :--- | :--- | :--- | :--- |
| 🔵 Primary | Deep Navy Blue | `#002752` | Primary brand action, buttons, main titles, active tabs (`bg-primary`, `text-primary`, `--primary`) |
| 🟢 Secondary | DIU Green | `#198754` | Institutional verification, approvals, success indicators (`bg-secondary`, `text-secondary`, `--secondary`) |
| 🟡 Accent | Daffodil Gold | `#E0C23C` | Badges, highlights, certifications, rating stars, alert accents (`bg-accent`, `text-accent-foreground`, `--accent`) |
| ⚪ Background | Pure White | `#FFFFFF` | Page canvas, card backgrounds in light mode (`bg-background`, `bg-card`, `--background`) |
| 🔘 Light Background | Soft Gray | `#F5F7F9` | Alternate section backgrounds, input wells, subtle containers (`bg-muted`, `--muted`) |
| 🔘 Border | Light Gray | `#E5E7EB` | Clean structural dividers, card borders (`border-border`, `--border`) |
| 🔵 Muted Blue/Gray | Blue Gray | `#CCD3DD` | Decorative borders, muted indicators, subtle hover surfaces (`--color-blue-gray`) |
| ⚫ Primary Text | Dark Navy | `#0F172A` | High-contrast readable typography for titles and body text (`text-foreground`, `--foreground`) |
| ⚫ Secondary Text | Slate Gray | `#64748B` | Subtitles, metadata, captions, timestamps (`text-muted-foreground`, `--muted-foreground`) |

---

## 3. Multi-Device Responsiveness (Mobile, Tablet, Desktop)
- **Zero Horizontal Scroll:** Prevent horizontal overflow on all screen sizes (`max-w-full overflow-x-hidden`, `break-words` on dynamic text).
- **Adaptive Breakpoints:**
  - Phone (`<640px`): single column layouts, full-width inputs, touch-safe targets (min 36-44px).
  - Tablet (`640px - 1024px`): balanced grids (`grid-cols-2`, responsive sidebars).
  - Desktop (`1024px+`): expansive layouts (`grid-cols-3` or `4`, persistent sidebars).
- **Viewport-Safe Overlays:**
  - Dialogs: `w-full max-w-[calc(100vw-2rem)] sm:max-w-md md:max-w-lg` with `max-h-[calc(100dvh-2rem)] overflow-y-auto`.
  - Popovers / Menus: `max-w-[calc(100vw-1.5rem)]`.
  - Side sheets: `w-full max-w-[85vw] sm:max-w-sm md:max-w-md`.
  - Chat bubbles: `max-w-[90%] sm:max-w-[82%] md:max-w-[75%] lg:max-w-[70%]`.
- **Full-Width Layout Mandate (No Container max-w):**
  - Do NOT artificially constrain page layouts, navbar, hero, sections, content grids, or cards with `max-w-7xl`, `max-w-5xl`, `max-w-4xl`, `max-w-3xl`, etc.
  - Embrace expansive, edge-to-edge `w-full` layouts with fluid responsive horizontal padding (`px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 2xl:px-20`) so the platform fills the screen beautifully on large screens and across all viewports.

---

## 4. Code Standards & Architecture
- **Framework:** Next.js 16 (App Router) + React 19.
- **Styling:** Tailwind CSS v4 (`client/app/globals.css`).
- **Strict Prohibition of Raw HTML Elements:** In all application workspaces and dashboards (User, Admin, Reviewer), developers and agents must **NEVER** use raw HTML tags:
  - ❌ Forbidden: `<button>`, `<input>`, `<select>`, `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`, `<textarea>`
  - ✅ Mandatory: Always import and compose from installed primitives in [`client/components/ui/`](file:///Users/abdullahalsakib/Documents/Ethica/client/components/ui/):
    - **Buttons:** [`@/components/ui/button`](file:///Users/abdullahalsakib/Documents/Ethica/client/components/ui/button.tsx) (`Button`)
    - **Inputs:** [`@/components/ui/input`](file:///Users/abdullahalsakib/Documents/Ethica/client/components/ui/input.tsx) (`Input`)
    - **Dropdowns & Selects:** [`@/components/ui/dropdown-menu`](file:///Users/abdullahalsakib/Documents/Ethica/client/components/ui/dropdown-menu.tsx) or [`@/components/ui/select`](file:///Users/abdullahalsakib/Documents/Ethica/client/components/ui/select.tsx)
    - **Tables & Rosters:** [`@/components/ui/data-table`](file:///Users/abdullahalsakib/Documents/Ethica/client/components/ui/data-table.tsx) or [`@/components/ui/table`](file:///Users/abdullahalsakib/Documents/Ethica/client/components/ui/table.tsx)
    - **Pagination:** [`@/components/ui/pagination`](file:///Users/abdullahalsakib/Documents/Ethica/client/components/ui/pagination.tsx)
    - **Surfaces & Badges:** [`@/components/ui/card`](file:///Users/abdullahalsakib/Documents/Ethica/client/components/ui/card.tsx), [`@/components/ui/badge`](file:///Users/abdullahalsakib/Documents/Ethica/client/components/ui/badge.tsx)

---

## 5. Text Selectability & Copyability Mandate
- **Universal Text Copyability:** All website copy, headings, titles, descriptions, metrics, badges, code snippets, lists, and content MUST be fully selectable and copyable by users (`user-select: text`).
- **Forbidden `select-none` on Content:** Never apply `select-none` to content containers, sections, headers, cards, text wrappers, buttons, or parent layout divs.
- **Strictly Decorative Use Only:** `select-none` and `pointer-events-none` are strictly reserved for pure non-text background decorative elements (such as ghost watermarks or ambient blur halos) so they never obstruct or intercept user text selection.

---

## 6. Mandatory Unified DataTable UI Standard
All tabular data, rosters, protocol lists, deliberation dockets, and audit trails across the entire Ethica platform MUST strictly use the centralized `DataTable` component located at [`@/components/ui/data-table`](file:///Users/abdullahalsakib/Documents/Ethica/client/components/ui/data-table.tsx). Never build ad-hoc `<table>` implementations in pages or feature components.

### 6.1 Core Required Features
Every table view in the system must leverage the built-in DataTable features:
1. **Real-Time Search:** Instant search filtering across specified `searchKeys` with search icon and clear (`X`) button.
2. **Column Sorting:** Tri-state interactive sorting (`ArrowUpDown`, `ArrowUp`, `ArrowDown`) on sortable columns.
3. **Faceted Filtering:** Select filters for statuses, categories, or boards with an active-filter badge and a one-click reset action.
4. **Page Size Selection:** Configurable rows per page selector (`[5, 10, 20, 50]`) with responsive labeling ("Rows per page:").
5. **Full Pagination Controls:** First (`<<`), Previous (`<`), intelligent sliding numbered page buttons with ellipsis, Next (`>`), Last (`>>`), and an entry count summary ("Showing X to Y of Z entries").
6. **Mobile & Tablet Responsiveness:**
   - Always wrap table markup in a horizontal scroll container (`relative w-full overflow-x-auto`).
   - Toolbars and footers must wrap gracefully on small screens without horizontal scrollbar overflow.
   - Touch targets for pagination controls must maintain at least 36px height/width.
7. **Institutional Styling:**
   - Outer container: `rounded-xl sm:rounded-2xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] overflow-hidden shadow-xs`.
   - Header row: `bg-slate-50/90 dark:bg-slate-900/60 border-b border-slate-200/85 dark:border-slate-800 text-[0.72rem] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400`.

### 6.2 Strict Internal Component Composition Mandate
`DataTable` must NEVER use raw HTML elements (`<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`, `<input>`, `<button>`). Instead, it MUST strictly compose the platform's installed components:
- **Table Primitives:** [`@/components/ui/table`](file:///Users/abdullahalsakib/Documents/Ethica/client/components/ui/table.tsx) (`Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`, `TableCaption`)
- **Pagination Primitives:** [`@/components/ui/pagination`](file:///Users/abdullahalsakib/Documents/Ethica/client/components/ui/pagination.tsx) (`Pagination`, `PaginationContent`, `PaginationItem`, `PaginationLink`, `PaginationPrevious`, `PaginationNext`, `PaginationEllipsis`)
- **Inputs & Controls:** [`@/components/ui/input`](file:///Users/abdullahalsakib/Documents/Ethica/client/components/ui/input.tsx) (`Input`) and [`@/components/ui/button`](file:///Users/abdullahalsakib/Documents/Ethica/client/components/ui/button.tsx) (`Button`)
- **Indicators & Surfaces:** [`@/components/ui/badge`](file:///Users/abdullahalsakib/Documents/Ethica/client/components/ui/badge.tsx) (`Badge`) and [`@/components/ui/card`](file:///Users/abdullahalsakib/Documents/Ethica/client/components/ui/card.tsx) (`Card`, `CardHeader`, `CardTitle`, `CardDescription`)
- **Dropdowns & Selects:** [`@/components/ui/dropdown-menu`](file:///Users/abdullahalsakib/Documents/Ethica/client/components/ui/dropdown-menu.tsx) (`DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuRadioGroup`, `DropdownMenuRadioItem`, `DropdownMenuLabel`, `DropdownMenuSeparator`) or [`@/components/ui/select`](file:///Users/abdullahalsakib/Documents/Ethica/client/components/ui/select.tsx) (`Select`, `SelectTrigger`, `SelectContent`, `SelectItem`). Never use raw `<select>` or unstyled native dropdowns *(Note: Base UI requires `<DropdownMenuLabel>` to always be nested inside a `<DropdownMenuGroup>` or `<DropdownMenuRadioGroup>`)*.

---

## 7. Centralized Section Layout Architecture
Layouts for the 3 main platform pillars (`user`, `admin`, `reviewer`) must be placed at the root of their respective section directories:
- **User / Investigator:** [`client/app/(user)/layout.tsx`](file:///Users/abdullahalsakib/Documents/Ethica/client/app/%28user%29/layout.tsx)
- **Governance Admin:** [`client/app/admin/layout.tsx`](file:///Users/abdullahalsakib/Documents/Ethica/client/app/admin/layout.tsx)
- **Committee Reviewer:** [`client/app/reviewer/layout.tsx`](file:///Users/abdullahalsakib/Documents/Ethica/client/app/reviewer/layout.tsx)

### Layout Rules:
1. **Never create isolated `dashboard/layout.tsx` files.** All future pages in a section (e.g. `/admin/roster`, `/admin/audit`, `/protocols`, etc.) automatically inherit their section's central `DashboardShell` without creating nested layout collisions.
2. **Pathname-Based Auth Bypass:** Each root layout inspects `usePathname()` to render login pages (`/login`, `/admin/login`, `/reviewer/login`) full-screen without dashboard sidebars, while wrapping all other workspace pages in `DashboardShell`.

---

## 8. Pagination UI Standard (Icon-Only, Zero Text Overlap)
All pagination components across the application must strictly adhere to the uniform icon-only button standard:
- **Dimensions:** All 5 control types (`<<`, `<`, numbered pages, `>`, `>>`) must use identical square dimensions (`size="icon"`, `size-8` = 32px × 32px, `rounded-lg`).
- **No Text Labels:** Never include text strings like "Previous" or "Next" inside constrained pagination items. Text causes button cell overflow and collides with adjacent numbered buttons.
- **States:** Active page must use deep navy (`bg-[#002752] text-white`); boundary limits must use `pointer-events-none opacity-40`.

---

## 9. Base UI DropdownMenuLabel Nesting Rule
In `@base-ui/react/menu`, the `<Menu.GroupLabel>` primitive (wrapped by `<DropdownMenuLabel>`) strictly requires a parent group context:
- Always nest `<DropdownMenuLabel>` inside `<DropdownMenuGroup>` or `<DropdownMenuRadioGroup>`.
- **Never** render `<DropdownMenuLabel>` directly inside `<DropdownMenuContent>`, as this causes the fatal runtime error: `Base UI: MenuGroupContext is missing. Menu group parts must be used within <Menu.Group> or <Menu.RadioGroup>.`

---

## 10. Prohibition of Redundant Workspace Greeting/Hero Banners
- **No Redundant Header Banners:** Never include redundant, heavy hero banner containers (e.g., cards with pill badges, large greeting titles like "Reviewer Onboarding & Accreditation" or "IRB Committee Secretariat • Accreditation Chamber", and descriptive subtitles) inside application workspace and dashboard pages.
- **Direct-to-Content Workflow:** Workspace pages must present their core functional components immediately at the top of the viewport (e.g., KPI metric counters grid, action toolbars, and centralized `DataTable`).
- **Leverage In-Component Headers:** Context and section descriptions must be conveyed directly via the centralized `DataTable` title and description props or compact toolbar actions, rather than standalone decorative banner boxes.

---

## 11. Mandatory Centralized KPI Card Standard (`KpiCard` & `KpiGrid`)
All metric counters, statistical indicators, and executive KPI summaries across the platform MUST strictly use the centralized component located at [`@/components/ui/kpi-card`](file:///Users/abdullahalsakib/Documents/Ethica/client/components/ui/kpi-card.tsx):
- **Centralized Primitives:** Always import and compose `KpiCard` and `KpiGrid` from `@/components/ui/kpi-card`.
- **Prohibition of Raw Metric Divs:** Developers and agents must NEVER write ad-hoc metric card `<div>` containers with custom border or text classes.
- **Uniform Institutional Styling:**
  - Outer card: `rounded-xl sm:rounded-2xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] p-4 sm:p-5 shadow-xs transition-shadow hover:shadow-sm select-text`.
  - Impactful bold typography: `text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight tabular-nums select-text`.
  - Structured semantic colors: `navy` (`#002752`), `green` (`#198754`), `amber`, `rose`, `sky`, `gold` (`#E0C23C`).
  - Responsive grid layout: `<KpiGrid columns={4}>` adapts automatically from mobile (2 columns) to desktop (4 columns).

---

## 12. Strict Prohibition of Default Browser Alerts (Mandatory Custom Institutional Alert)
- **Zero Browser `alert()` / `confirm()` / `prompt()`:** Developers and agents must **NEVER** use native browser dialogs (`window.alert()`, `alert()`, `confirm()`, `prompt()`) anywhere in the application.
- **Mandatory Institutional Alert Primitives:** Always import and compose alerts and confirmations from the platform's custom UI primitives:
  - **In-Page Notifications & Status Banners:** [`@/components/ui/alert`](file:///Users/abdullahalsakib/Documents/Ethica/client/components/ui/alert.tsx) (`Alert`, `AlertTitle`, `AlertDescription`, `AlertAction`)
  - **Modal Confirmations & Critical Decision Prompts:** [`@/components/ui/alert-dialog`](file:///Users/abdullahalsakib/Documents/Ethica/client/components/ui/alert-dialog.tsx) (`AlertDialog`, `AlertDialogTrigger`, `AlertDialogContent`, `AlertDialogHeader`, `AlertDialogTitle`, `AlertDialogDescription`, `AlertDialogFooter`, `AlertDialogAction`, `AlertDialogCancel`)

---

## 13. Mandatory Dedicated Dynamic Detail Pages for Primary Records
- **Zero Ad-Hoc Modals for Primary Records:** For all primary platform entities (including accredited reviewer dossiers, reviewer intake applications, researcher protocols, institutional clearance certificates, and detailed audit records), developers and agents must **NEVER** constrain the primary inspection or detail experience to popup `<Dialog>` modals.
- **Mandatory Dynamic Route (`[id]/page.tsx`):**
  - Always implement a dedicated Next.js App Router dynamic page:
    - Reviewer Dossier: [`/admin/roster/[id]`](file:///Users/abdullahalsakib/Documents/Ethica/client/app/admin/roster/%5Bid%5D/page.tsx)
    - Reviewer Applications: [`/admin/applications/[id]`](file:///Users/abdullahalsakib/Documents/Ethica/client/app/admin/applications/%5Bid%5D/page.tsx)
    - Protocol Submissions: [`/dashboard/protocols/[id]`](file:///Users/abdullahalsakib/Documents/Ethica/client/app/%28user%29/dashboard/protocols/%5Bid%5D/page.tsx)
  - Tables, rosters, directories, and lists must link directly to the dynamic page via `<Link href={`.../${row.id}`}>` or an explicit **"View Dossier"** / **"Inspect"** button.
- **Dedicated Page Layout Standards:**
  - **Back-Navigation:** Always provide a top back-navigation bar (`<Link href="...">` with `<ArrowLeft>` icon and clear label, e.g. "Back to Reviewer Roster").
  - **Comprehensive Header:** Display the complete entity identity, degrees, titles, institutional badges, and direct status toggles (`AlertDialog` with Sonner toasts).
  - **Full-Width Deep Context:** Utilize multi-column responsive cards for institutional affiliation, board credentials, domain specializations, research statements, active deliberation workload, and FIPS 140-3 SHA-256 digital seals.








