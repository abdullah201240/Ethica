<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# Ethica UI Design & Responsiveness Rules

All UI components and features must adhere strictly to these rules:

1. **Subtle & Clean Aesthetics:**
   - Soft borders: `border border-border/75` (or `/70`). Never use heavy borders or harsh multi-rings.
   - Diffuse shadows: `shadow-xs`, `shadow-sm` for cards/popups; `shadow-md` for modals. Avoid dark, muddy drop shadows.
   - Refined radii: Base radius `0.375rem` (6px). Use `rounded-lg` for cards/modals/popups, `rounded-md` for buttons/inputs/badges. Avoid pill curves (`rounded-2xl`, `rounded-3xl`, `rounded-4xl`) on containers.
   - **Large & Eye-Catching Typography:** Use big, bold, impactful font sizes (hero: `text-5xl` to `text-8xl`, sections: `text-3xl` to `text-6xl`, cards: `text-lg` to `text-2xl`, stats: `text-5xl` to `text-7xl`, body: `text-base` to `text-lg`). Make content punchy, bold, and easily readable without squinting.

2. **Full Responsiveness Across All Devices (Phone, Tablet, Desktop):**
   - Zero horizontal overflow: enforce `max-w-full overflow-x-hidden`, `break-words` on dynamic text.
   - Modals: `w-full max-w-[calc(100vw-2rem)] sm:max-w-md md:max-w-lg` with `max-h-[calc(100dvh-2rem)] overflow-y-auto`.
   - Side sheets & drawers: `w-full max-w-[85vw] sm:max-w-sm md:max-w-md`.
   - Popovers & menus: `max-w-[calc(100vw-1.5rem)]`.
   - Chat bubbles: `max-w-[90%] sm:max-w-[82%] md:max-w-[75%] lg:max-w-[70%]`.
   - Touch targets: minimum 36-44px or comfortable padding on mobile.
   - **Full-Width Layouts (No Container max-w):** No artificial container `max-w-*` (avoid `max-w-7xl`, `max-w-5xl`, etc.). Use edge-to-edge `w-full` layouts with fluid padding (`px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 2xl:px-20`).

3. **Official Color Palette & Theme Tokens:**
   - 🔵 **Primary:** Deep Navy Blue (`#002752`) - Brand actions, primary CTA buttons, active tabs, header icons (`bg-primary`, `text-primary`)
   - 🟢 **Secondary:** DIU Green (`#198754`) - Institutional approvals, certifications, positive states (`bg-secondary`, `text-secondary`, `text-emerald-600`)
   - 🟡 **Accent:** Daffodil Gold (`#E0C23C`) - Accents, warning/expedited flags, high-priority seals (`bg-accent`, `text-accent-foreground`)
   - ⚪ **Background:** Pure White (`#FFFFFF`) - Main canvas and card surfaces (`bg-background`, `bg-card`)
   - 🔘 **Light Background:** Soft Gray (`#F5F7F9`) - Section alternating containers, input backgrounds (`bg-muted`)
   - 🔘 **Border:** Light Gray (`#E5E7EB`) - Structural dividers, clean borders (`border-border`)
   - 🔵 **Muted Blue/Gray:** Blue Gray (`#CCD3DD`) - Decorative accents, secondary borders
   - ⚫ **Primary Text:** Dark Navy (`#0F172A`) - High-contrast headings and body copy (`text-foreground`)
   - ⚫ **Secondary Text:** Slate Gray (`#64748B`) - Captions, metadata, hints, timestamps (`text-muted-foreground`)

