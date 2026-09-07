# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Three primary segments, all in Lviv and the surrounding region:
- Homeowners cutting their electricity bill — daytime consumption, want a 50-70% reduction, the 5-15kW grid-tied station range.
- Homeowners hit by outages — want a hybrid station with battery backup for critical loads (heating, water/well pump).
- Businesses and farms pursuing green-tariff income or offsetting heavy load — 25-40kW+ systems, ground- or roof-mounted.

## Product Purpose

INVICSOL is a real, operating solar installation company (6 completed installations to date) based in Lviv, Ukraine, founded 2016. The site is both the company's actual lead-generation site and a portfolio piece for the founder (a job-seeking developer). It needs to read as an indistinguishable-from-real small business, not a demo.

## Positioning

Refuses to show an online price. The core differentiator, stated directly in the copy: "A solar station isn't a piece of equipment you buy — it's an engineering project. The same kit on two different roofs produces two different results." Quotes only after a free site visit. The calculator estimates payback and sizing, never a price.

## Operating Context

- Lead capture via a multi-step calculator (property type → usage → consumption → contact), a callback-request modal, and a contact page — routed to Telegram (internal) and stored in Postgres (Neon).
- Admin panel (single seeded account, no public signup) for a leads inbox and project CRUD.
- Content lives in three places: next-intl message files (UI strings), typed content.ts (fixed editorial: why-us, testimonials, team, financing, FAQ), and DB-backed entities (stations catalogue, project case studies, blog articles) — filterable/growing content only.
- Ukrainian is the default locale; English is the secondary locale for the developer-portfolio audience.

## Capabilities and Constraints

- Next.js 16 (App Router), TypeScript strict, Tailwind v4, next-intl v4, Prisma 7 + Neon Postgres, Auth.js v5 credentials-only admin, TanStack Query for the leads inbox, Playwright E2E, GitHub Actions CI.
- 5 fixed station tiers (5/10/15/30kW + custom) and a growing project case-study gallery, server-filtered by object type/usage/mount/capacity.
- No online pricing anywhere, by design — not a missing feature.

## Brand Commitments

- Name: INVICSOL. Palette: navy + gold accent (navy-800 `#0d1e3d`-ish through gold-500/600/700 for AA contrast). Display font: Manrope (headings, Cyrillic-verified); body: Inter.
- Voice: calm, technical, no hype — engineering-first, understated, matches the "never quote blind" positioning. Not warm/family-toned, not aggressively premium/salesy.
- Equipment brands already seeded as real kit components: Longi (panels), Huawei/Deye (inverters), Pylontech (batteries) — used descriptively in station specs, not as marketing partners.
- No fixed logo file or tagline beyond the name itself; nothing else is locked.

## Evidence on Hand

- 4 project case studies exist, all explicitly flagged `isPlaceholder: true` with stock photography (not the real installations) and invented (but plausible, non-outlandish) numbers/narratives.
- Station catalogue (5 tiers) uses real stock photography, not placeholders — these are generic product-tier photos, not claimed as real installs.
- Testimonials (3) and team bios (3) are explicit placeholders ("Sample review" / role-title-as-name) with initials avatars, not stock headshots — deliberately avoiding misattributing real people.
- Financing options (3) are placeholder terms/provider names with icon badges — no real partner bank confirmed yet.
- Contact details (phone, email, street address) in `src/shared/lib/site.ts` are explicitly fake, flagged `isPlaceholderContact: true`. Must not be fabricated further; only the user can supply real values.
- Still missing: the six real completed installations (capacity, location, date, mount type, batteries, real photos, what made each non-trivial) — this is the actual company portfolio and the single biggest gap between "demo" and "real business site."

## Product Principles

- Never show a price online, anywhere, under any redesign — this is a stated business/trust principle, not a missing feature to "improve."
- Placeholder content must stay honestly labeled and must never impersonate a real, identifiable person (no stock headshots standing in for testimonials or team).
- Realism wins on everything inside the product (content, data, copy); portfolio/distribution concerns (deploy, repo visibility) are the only place the developer-portfolio goal is allowed to outrank "looks like a real business."
- Server-side filtering and honest data boundaries (the `entities/*/parse.ts` seam) are load-bearing engineering decisions, not incidental — a redesign should not casually reshape data flow to chase a visual idea.

## Accessibility & Inclusion

WCAG AA contrast was explicitly verified (not eyeballed) during a prior pass — `--color-gold-700` was added after `gold-600` measured under 4.5:1 on white for small text. Keyboard nav, focus-visible states, and a skip-link are already implemented. Any redesign must re-verify contrast by calculation, not assumption.
