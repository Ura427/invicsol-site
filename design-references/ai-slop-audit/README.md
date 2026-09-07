# AI-slop audit — INVICSOL site

Run 2026-09-07 with Impeccable's detector (`impeccable detect <url>`, 61 deterministic
rules) against the live dev server, across 4 pages and one mobile viewport pass. Raw
findings are the sibling `.json` files. This file is the readable version, traced back
to actual source lines so you can learn to spot these yourself.

## The two systemic issues (fix once, fixes everywhere)

### 1. Hairline border + wide diffuse shadow — 22 hits on the homepage alone

**What it is:** a 1px border paired with a soft, wide-blur shadow (both at once) on
the same element. Individually both are normal; together they're one of the most
recognizable "an AI generated this card" tells, because models default to it constantly
and it commits to nothing — not a flat bordered card, not a properly elevated one.

**Source:** [`src/shared/ui/Card.tsx`](src/shared/ui/Card.tsx) —
```
className={`border-border shadow-card rounded-2xl border bg-white p-6 ${className}`}
```
`shadow-card` is defined in [`globals.css:32`](src/app/globals.css:32) as
`0 12px 32px -16px rgb(13 30 61 / 0.2)` — a 32px blur. `border-border` adds a 1px
`#e4e8f0` edge on top of it. `Card` is the base component behind WhyUs, Testimonials,
Financing, Team, and more — one component, reused everywhere, so this single fix
resolves the majority of the 22 hits site-wide.

**How to notice it yourself:** any card that has *both* a visible thin edge line *and*
a soft shadow floating around it. Pick one. A flat card commits to the border and drops
the shadow; an elevated card commits to the shadow and drops the border.

### 2. Gradient text on the logo wordmark — every page

**Source:** [`src/widgets/nav/Nav.tsx:32`](src/widgets/nav/Nav.tsx:32) —
```
className="from-navy-800 to-navy-600 bg-gradient-to-r bg-clip-text text-xl font-extrabold text-transparent"
```
The "INVICSOL" wordmark in the header uses `bg-clip-text` to render the brand name as
a navy-to-navy gradient. It's subtle here (navy-800 → navy-600 is a small shift), which
is why it wasn't obvious by eye — but it's the exact mechanical pattern ("is this text
using a paint-on gradient instead of a solid color for no functional reason?") the
detector is built to catch, and it's on every single page since it's in the nav.

**How to notice it yourself:** ask "does this text need to be a gradient, or does it
just look techy?" A wordmark, a heading, a stat number — almost never need one. Reserve
gradients (if used at all) for large decorative backgrounds, not typography.

## Other findings, page-specific

- **Colored shadow glow on a dark card** ([`StationCard.tsx:24`](src/entities/station/ui/StationCard.tsx:24)) — the gold-accented "custom" station card has a navy `bg-navy-800` background but still applies the same `shadow-card` (a navy-tinted shadow), producing a colored halo around a dark card sitting on a light page. Same root cause as #1 — `shadow-card` applied without checking what surface it's sitting on.
- **Overused font** — Inter is 76% of the site's text. Correct call to flag, but this one I'd actually keep: Inter was chosen deliberately (verified Cyrillic support, paired with Manrope for display), not defaulted into. Worth knowing the rule exists, not necessarily worth acting on here.
- **Line length too long** (homepage body copy, ~100 chars/line, aim under 80) — real, worth a `max-w-*ch` constraint on a couple of paragraph blocks.
- **Cramped padding** (a `border-border` div with content flush against the edge) and **clipped overflow container** (an `overflow-hidden` wrapper cutting off an absolutely-positioned child) — smaller, page-specific, listed in the JSON with enough context to find if you want them fixed.
- **body-text-viewport-edge** (mobile only, 3 hits) — text sitting right at the mobile viewport edge with too little side margin.
- **Em-dash overuse** (advisory only — 14 in body copy) — I do lean on em-dashes in the copy I write. Advisory, not a failure, but worth knowing it's a real, measurable "AI cadence" signal, not just a stylistic guess.

## What I'd actually fix

Just the two systemic ones. Both are one-line changes with site-wide effect:
1. `Card.tsx` — pick border *or* shadow, not both.
2. `Nav.tsx:32` — drop the gradient, use a solid `text-navy-800`.

Say the word and I'll make both changes and re-run the detector to confirm the count
drops — that re-run-to-confirm loop is exactly how `/impeccable audit` is meant to be
used going forward.
