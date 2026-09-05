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
- **Components:** Base UI + Shadcn (`client/components/ui`). Always use the shared components in `components/ui/` instead of raw ad-hoc HTML elements.

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




