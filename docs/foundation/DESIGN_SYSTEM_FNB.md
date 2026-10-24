# Restaurant F&B — Design System Contract v1

Status: FOUNDATION / adopted incrementally. Existing `DESIGN_SYSTEM.md`, `apps/web/app/globals.css` and shadcn components remain authoritative until migrated and regression-tested. Do not replace global CSS en masse.

## 1. Non-negotiable rules
- No branch-specific, user-specific, station-specific, price-specific or bank-specific literals in UI source. Business values come from API/database and authorized settings.
- No duplicate button, form, table, modal, toast, navigation or badge implementations; reuse existing components and compose variants.
- Presentation decisions use semantic CSS variables; no arbitrary per-page hex colors, shadows, font sizes or radii.
- Locale and currency derive from restaurant/branch settings, not hardcoded INR/₹, UPI, GST, or Vietnamese labels in calculation code.
- Accessible WCAG 2.2 AA target, visible focus, keyboard navigation, reduced-motion preference, empty/error/loading states.
- Design for desktop dashboard, mobile service/table/order/delivery, and large-screen KDS.

## 2. Source of truth
- CSS variables: `apps/web/app/globals.css`
- Shared primitives: existing shadcn/`components/ui` implementation; inspect before introducing a new component.
- Technology: Next.js 16, React 19, Tailwind CSS 4, shadcn + Base UI, Lucide.
- Preserve the current burgundy palette initially, avoid silently introducing a conflicting second theme. Future rebrand should change tokens in one place.
- Existing light/dark/kiosk themes must all be tested.

## 3. Design tokens
Semantic tokens: background, foreground, card, popover, primary, secondary, muted, accent, destructive, success, warning, border, input, ring, sidebar, chart. Extend with `--status-new`, `--status-preparing`, `--status-ready`, `--status-completed` only after theme variants and contrast are reviewed.
Sizing: use one spacing scale (4px base), component height variants, consistent radii and typography scale.
Numeric amounts use tabular numerals. Currency formatting via `Intl.NumberFormat(locale, {style:'currency', currency})`; Vietnamese display may use a unified VND formatter placing đ where required by product UX.

## 4. Interaction patterns
- Loading skeleton for reads; inline validation for forms; actionable retry for network errors.
- Confirmations mandatory for collecting cash, cancellation, refunds, closing shifts, and cash handovers; confirmation should include amount, branch, staff, and target object.
- Optimistic mutation is forbidden for irreversible financial state changes until server confirms.
- Never rely on color alone for status; accompany with label/icon.
- Responsive navigation must preserve URL route and permissions, including hash tabs.
- Tap targets minimum 44x44 CSS pixels for coarse pointers (kiosk 48px), no obstructed primary action.

## 5. Route-shell ownership
- `/dashboard/#overview|branches|employees|menu|orders|payments|cash|customers|kds|tables|reports|settings` is a proposed *navigation contract*, not proof of implemented routes.
- Admin tabs share shell and contextual branch/shift/time filters.
- Operational routes (/service, /table, /order, /kds, /ready, /delivery) share tokens/primitives, not necessarily the same layout.
- Hash changes must preserve browser back/forward, reload deep links, and restore active tab.
- Navigation is permission-driven; backend authorization is mandatory.

## 6. Definition of Done
Desktop 1440px, tablet 768px, mobile 375px; touch keyboard focus and reduced-motion smoke checks; screenshot review for light/dark; localization and VND checks; loading/empty/error states; no duplicate components or unexplained hardcoded operational data.
