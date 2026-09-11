# Design references pulled from Refero Styles

Three real product design systems, pulled 2026-09-07 from https://styles.refero.design
to compare against, matched to the confirmed brand voice for INVICSOL (calm, technical,
no hype — see `../PRODUCT.md`). **Nothing here is applied to the site.** These are
comparison material only; picking one (or none, or a blend) is the next decision.

Each `.json` is the full agent-readable design-system extraction Refero produced for
that real site: exact colors with named roles, a type scale, spacing/radius tokens,
component-level descriptions, dos/don'ts, and an "Agent Prompt Guide" section that's
essentially a ready-to-use DESIGN.md.

## The three

### 1. T1 Energy (`T1Energy.json`) — closest industry match
Real solar/battery manufacturing company. Warm cream ("Vellum") canvas, near-colorless
palette (charcoal text, no accent color at all), whisper-light (weight 300) display
type, dramatic 80px rounded photo corners, zero shadows — hierarchy comes entirely from
tone and spacing, not color or elevation. Full-bleed industrial/factory photography
carries all the visual richness. Reads as "a technical spec sheet rendered as a
website" — the most literal match to "engineering project, not equipment" of the three.
**Risk:** almost no color at all may read as cold for a B2C homeowner audience rather
than a B2B/investor one — T1 Energy sells to utilities and governments, not homeowners.

### 2. Increase (`Increase.json`) — institutional trust register, weakest content fit
Banking-infrastructure API company (Stripe/Plaid-adjacent). Navy-on-paper palette,
extremely tight negative letter-spacing at large sizes, one chartreuse "voltage" accent
used only as a rare signal color. Strongest "we are serious and correct" register of
the three. **Caveat:** a lot of its actual component vocabulary (code blocks, API
cards, syntax-highlighted terminals) has no equivalent on a solar-install site — useful
for the navy/restraint/typography feel, not for literal component patterns.

### 3. Samara (`Samara.json`) — best audience match
Prefab/modular home company selling directly to homeowners — same buyer as INVICSOL's
residential segment. Warm parchment background, single sky-blue CTA color, whisper-thin
display font paired with soft 12px-radius cards, sunlit natural-light photography style.
One of its own sample components literally tags a home as "Solar-ready." Calmer and
warmer than T1 Energy while still restrained — the closest to "premium but human."

## How to compare

Each file's `customSections[0].content` ("Agent Prompt Guide") is the fastest way to
get a feel for one — it's already written as ready-to-paste component prompts. The
`northStar` field is a one-line mood summary; `dos`/`donts` are the guardrails; `colors`
and `typeScale` are the literal tokens.

None of these should be adopted wholesale — the plan is to react to them (what's right,
what's wrong) rather than pick one outright, then feed the reaction plus the current
site's screenshots into an actual design pass.

## Equipment photography (`public/equipment/`)

All three are stock, sourced from Pexels (free for commercial use, no attribution
required, https://www.pexels.com/license/). They are illustrative — a generic panel,
inverter and battery rack — **not** photographs of the Jinko/Deye/Pylontech units the
kit lists name. The station page tags the carousel as illustrative while the station's
`commercialIsPlaceholder` flag is set; replace the files with real product shots and
clear the flag per station, and the tag goes.

| File | Source | Note |
|---|---|---|
| `panel-detail.jpg` | Pexels, macro of a panel surface (see commit `eee84a2`) | — |
| `inverter.jpg` | Pexels photo 37929911, top crop | Wall-mounted hybrid inverter with DC breakers |
| `battery.jpg` | Pexels photo 37929911, bottom crop | The battery rack under that same inverter |

Every other candidate on the first two result pages ("solar inverter", "home battery
storage") had a technician in a shirt branded with another installer's name and could
not be used on this site at all.
