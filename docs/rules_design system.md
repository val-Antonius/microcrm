## UI Design System — Premium SaaS Standard

You are building a premium, modern SaaS product. All UI decisions must reflect a high-end, opinionated design system. Never produce generic shadcn/ui default output.

### Visual Identity
- Aesthetic: minimal-luxury. Think Linear, Vercel dashboard, Raycast — functional but visually intentional.
- Color palette: one dominant neutral base (near-white or near-black), one vivid accent (indigo, violet, or teal family — never generic blue #3b82f6), and one warm highlight (amber or rose) for status indicators only.
- Never use pure black (#000) or pure white (#fff) as surface colors. Use slightly tinted neutrals (e.g. zinc-950, slate-50).
- Dark mode must feel premium, not just "dark gray". Use layered surface depths: background → card → elevated card → popover.

### Typography
- Font pairing: geometric sans for headings (Inter, Geist, or DM Sans), monospace for data/numbers (Geist Mono or JetBrains Mono).
- Heading weight: 500–600 only. Never bold (700+) for UI headings — it reads heavy, not premium.
- Data numbers and metrics: always monospace, tabular-nums, slightly larger than body text.
- Muted labels: use text-muted-foreground at 60–70% opacity, never 40% (too invisible) or 100% (too loud).

### Spacing & Layout
- Cards: subtle border (1px, low-opacity), gentle background tint, no hard drop shadows. Use box-shadow: 0 1px 3px rgba(0,0,0,0.06) max.
- Sidebar: fixed width, slightly different surface from main content, no heavy dividers — use subtle background difference only.
- Consistent padding rhythm: 16px internal card padding, 24px between sections, 32px page margin.

### Components
- Buttons: primary uses accent color with no border, secondary is ghost with subtle border, never use default shadcn outline style.
- Badges/pills: small, rounded-full, tinted background matching semantic color — no hard border.
- Tables: no visible row borders. Use alternating background tints (zebra) or hover highlight only.
- Form inputs: 36px height, subtle background tint, border only on focus. No box-shadow on default state.

### Charts & Data Visualization
- Always use a custom color palette — never recharts default colors.
- Bar/line charts: rounded bar corners (radius 4–6px), smooth curves for lines, no grid lines (use only horizontal guide lines at 30% opacity).
- Chart containers: give charts breathing room — minimum 16px padding, axis labels in muted color.
- Empty states: use a simple illustration or large icon + short message. Never just "No data."

### Interactions & Motion
- All interactive elements must have hover and active states — color shift + subtle scale (scale 0.98 on click).
- Modals/dialogs: backdrop-blur, not solid overlay. Entrance via scale(0.96) → scale(1) + fade, 150ms ease-out.
- Sidebar active item: accent background tint + left border accent, not just bold text.
- Transitions: 120–200ms for micro-interactions, 250ms for layout shifts. Use ease-out universally.

### Kanban / Pipeline Boards
- Columns: distinct tinted background per stage (not white), subtle top border in stage accent color.
- Cards: white/elevated surface with soft shadow, hover lifts slightly (translateY -1px + shadow increase).
- Stage header: show count badge + total value inline, minimal and monospace.
- Drag state: dragging card gets opacity 0.7 + rotation 1–2deg + elevated shadow.

### Anti-patterns — never do these
- No default shadcn gray palette without customization
- No hard-coded Tailwind blue-500 as primary
- No full-width inputs that span the entire modal
- No plain text links without hover underline or color shift
- No charts without custom colors
- No empty dashboard with placeholder text only — always show skeleton or meaningful empty state