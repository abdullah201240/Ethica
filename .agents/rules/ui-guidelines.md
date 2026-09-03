# Ethica UI Design & Responsiveness Guidelines

This rule outlines the mandatory visual styling and responsiveness standards for the **Ethica** project. All new components, pages, and UI modifications must adhere strictly to these rules.

---

## 1. Aesthetic Principles: Sleek, Subtle, and Minimalist

The user has explicitly mandated that the UI must **never** feel chunky, bloated, overly rounded, or heavily shadowed. Instead, adopt a refined, crisp, modern aesthetic:

### 1.1 Borders
- **Never** use heavy, harsh, or high-contrast borders.
- **Never** double-up borders (e.g. avoid combining `border` with `ring-1 ring-foreground/10`).
- Standard border styling:
  - Containers, cards, popups: `border border-border/75` (or `border-border/70`)
  - Form fields, inputs: `border border-input` with subtle `focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40`
  - Subtle dividers: `border-border/60`

### 1.2 Shadows
- **Never** use dark, heavy, or muddy drop shadows (avoid standard Tailwind `shadow-lg` or `shadow-xl` with black opacities).
- Always use the diffuse ambient shadow tokens defined in `globals.css`:
  - Cards, attachments: `shadow-xs` or `shadow-sm`
  - Popovers, dropdowns, selects, context menus: `shadow-sm`
  - Dialogs, sheets, modals, alerts: `shadow-md`
  - Light mode shadows are soft and airy; dark mode relies on gentle borders and low-luminance elevation.

### 1.3 Corner Radii
- Base radius is calibrated to **`0.375rem` (6px)**.
- **Never** use oversized, bulbous pill curves (`rounded-2xl`, `rounded-3xl`, `rounded-4xl`) on containers, dialogs, cards, or buttons.
- Standard radii:
  - Cards, modals, dialogs, drawers, dropdowns, menus: `rounded-lg`
  - Buttons, inputs, small items, badges: `rounded-md`
  - Badges: `rounded-md` (not pill `rounded-4xl`)
  - Avatars and status dots: `rounded-full`

### 1.4 Official Color Palette & Theme Tokens
All features, designs, components, and illustrations must strictly adhere to the official Ethica color system:

| Purpose | Name | Hex | CSS Token / Class |
| :--- | :--- | :--- | :--- |
| 🔵 Primary | Deep Navy Blue | `#002752` | `--primary`, `bg-primary`, `text-primary` |
| 🟢 Secondary | DIU Green | `#198754` | `--secondary`, `bg-secondary`, `text-secondary` |
| 🟡 Accent | Daffodil Gold | `#E0C23C` | `--accent`, `bg-accent`, `text-accent-foreground` |
| ⚪ Background | Pure White | `#FFFFFF` | `--background`, `bg-background`, `bg-card` |
| 🔘 Light Background | Soft Gray | `#F5F7F9` | `--muted`, `bg-muted` |
| 🔘 Border | Light Gray | `#E5E7EB` | `--border`, `border-border` |
| 🔵 Muted Blue/Gray | Blue Gray | `#CCD3DD` | `--color-blue-gray` |
| ⚫ Primary Text | Dark Navy | `#0F172A` | `--foreground`, `text-foreground` |
| ⚫ Secondary Text | Slate Gray | `#64748B` | `--muted-foreground`, `text-muted-foreground` |

### 1.5 Bold, Large & Eye-Catching Typography
The user explicitly mandates large, prominent, bold, eye-catching typography across the platform:
- **Hero Headlines:** `text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.08]`
- **Section Titles:** `text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight`
- **Subheadings & Descriptions:** `text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed`
- **Card Titles & Headers:** `text-lg sm:text-xl md:text-2xl font-bold`
- **Stat Counters & Numbers:** `text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tabular-nums`
- **Buttons & Badges:** `text-sm sm:text-base font-semibold` with generous padding
- **Avoid Micro-Text:** Eliminate tiny `text-[0.65rem]` or hard-to-read, low-contrast text.

---

## 2. Multi-Device Responsiveness (Mobile, Tablet, Desktop)

Every page, widget, and component must look and feel first-class on all device viewports:
- **Mobile Phones:** `< 640px` (e.g. 375px, 390px, 414px)
- **Tablets:** `640px – 1024px` (e.g. iPad 768px, 820px)
- **Desktops / Laptops:** `1024px+` (e.g. 1280px, 1440px, 1920px)

### 2.1 Viewport & Overflow Hygiene
- **Zero Horizontal Scrolling:** The root body and containers must enforce `max-w-full overflow-x-hidden`.
- Long dynamic text, chat messages, or filenames must always use `break-words`, `wrap-break-word`, or `truncate` with `min-w-0` on flex children.
- Data tables must wrap in `<div className="relative w-full overflow-x-auto">`.

### 2.2 Dialogs, Modals, and Drawers
- Dialogs must never extend beyond the screen width:
  - Standard: `w-full max-w-[calc(100vw-2rem)] sm:max-w-md md:max-w-lg`
  - Max height bound: `max-h-[calc(100dvh-2rem)] overflow-y-auto`
- Sheets / Drawers:
  - Mobile: `w-full max-w-[85vw] sm:max-w-sm md:max-w-md`
  - Bottom drawers: `max-h-[85dvh]` with scrollable content.

### 2.3 Popovers, Dropdowns, and Menus
- Always bound popup menus to the viewport with `max-w-[calc(100vw-1.5rem)]` so they never create horizontal viewport overflow on narrow phones.

### 2.4 Chat Bubbles & Messaging
- Bubbles must scale responsively across devices:
  - `max-w-[90%] sm:max-w-[82%] md:max-w-[75%] lg:max-w-[70%]`
- Reactions must be sleek: `ring-1 ring-border/60 shadow-xs text-xs`.

### 2.5 Touch Targets & Spacing
- Mobile interactive elements (buttons, inputs, select triggers) must maintain touch targets of at least `36px - 44px` or adequate tap padding.
- Fluid padding across pages:
  - Container padding: `px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 2xl:px-20`
  - Card spacing: `[--card-spacing:--spacing(3.5)] sm:[--card-spacing:--spacing(4)]`

### 2.6 Full-Width Layout Mandate (No Container max-w Restrictions)
- **Zero Artificial Container max-w:** The user explicitly loves full-width layouts. Never artificially constrain the website width with `max-w-7xl`, `max-w-6xl`, `max-w-5xl`, `max-w-4xl`, or `max-w-3xl` on page wrappers, navbar, hero, sections, content grids, or cards.
- **Expansive Fluid Layouts:** Pages, headers, footers, and sections must use `w-full` edge-to-edge layout, utilizing fluid horizontal padding (`px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 2xl:px-20`) to breathe comfortably while fully occupying the screen on large desktop monitors, ultrawides, tablets, and phones.
- Overlays (modals, dialogs, popovers) retain viewport-relative boundaries to prevent unusable stretched dialog boxes.

