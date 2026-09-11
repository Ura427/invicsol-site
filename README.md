# INVICSOL

Marketing site and lead pipeline for a solar installation company in Lviv, Ukraine.
Ukrainian and English. Public pages, a quote calculator, per-station customer
reviews, and a private admin for leads, projects and review moderation.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · Prisma 7 on
Postgres (Neon) · next-intl · Auth.js · TanStack Query · Jest + Testing Library ·
Playwright · axe-core.

```bash
cp .env.example .env      # fill in DATABASE_URL at minimum
npm install
npx prisma migrate deploy && npx prisma db seed
npm run admin:create      # one-off; reads ADMIN_EMAIL / ADMIN_PASSWORD from .env
npm run dev               # http://localhost:3101
```

`npm run typecheck && npm run lint && npm test && npm run test:e2e` is the full check;
`prebuild` regenerates the image manifest and applies migrations, so `npm run build` on a
fresh clone works without a separate step.

---

## Architecture decisions

Each of these was a choice between real alternatives. The alternative and the reason are
recorded here so the next person does not have to rediscover them.

### 1. Station pages are static, and reviews re-render them on demand

The five station pages (`/stations/5kw` … `/stations/custom`) are generated at build time
(`generateStaticParams`, `dynamicParams = false`) with approved reviews baked into the
HTML. Approving, rejecting or deleting a review in the admin calls `revalidatePath` for that
station in both locales, and the page is rebuilt on the next request.

*Alternative:* render on every request, or fetch reviews client-side.
*Why not:* the pages are the money pages and change a few times a year. Static means
CDN-cached, no database hit per visitor, and the reviews are in the HTML for search
engines. Client-side fetching would show "no reviews yet" for a moment on every load and
put nothing in the crawlable HTML. The same mechanism already served project pages.

### 2. Reviews are moderated, and the rating is computed — never stored

`Review.status` is `pending` until an admin approves it. The star rating shown on a
station page is `summarize(approvedReviews)` at render time; there is no `rating` column
to drift out of sync or to seed with a flattering number. Zero reviews renders as "no
reviews yet", not `0.0`. `aggregateRating` is added to the Product JSON-LD only when a
real summary exists.

*Why moderation:* an unmoderated public form on a real company's site is a spam target,
and a fake-looking review costs more trust than no review.

### 3. Server actions return results; they do not throw

Every mutating action (`submitLead`, `submitReview`, `createProject`, …) returns a
discriminated union — `{ ok: true } | { ok: false, error: 'rate_limited' | 'invalid' | … }`.
Next strips thrown error messages in production, so a thrown error reaches the client as
"An error occurred", which the form cannot translate or act on. A result value can be
matched exhaustively and rendered as the right sentence in the right language.

Every action that touches the database is also its own gate: `requireAdmin()` at the top
of each admin action, honeypot + rate limit + validation at the top of each public one.
A server action is a POST endpoint that anyone can call directly; the UI in front of it
is a convenience, not a guard.

### 4. Admin is allowlisted, not just authenticated

Auth.js credentials sign-in checks the password; a separate allowlist
(`ADMIN_ALLOWED_EMAILS`, default: the owner's address) decides who may enter `/admin`.
The check runs in the proxy (edge, on every `/admin` request), in the credentials
provider (at sign-in), and in `requireAdmin()` (inside every admin action). Setting the
allowlist to an empty string locks everyone out — it fails closed.

*Why three places:* the proxy protects pages, the provider stops a valid-but-unlisted
account from ever getting a session, and the action check is what protects the actual
mutation if either of the others is bypassed.

### 5. Two content stores, by shape

Short UI strings (labels, buttons, error messages) live in `messages/{uk,en}.json` for
next-intl. Structured content (services, FAQ, process steps, stats) lives in typed
TypeScript modules under `src/shared/lib/content/`. Anything an admin edits (projects,
reviews, leads) lives in Postgres.

*Why not one store:* flattening a list of six services into JSON message keys makes them
unreadable and untyped; putting button labels in a database makes every page dynamic.
Each shape gets the store that keeps it typed and cheap.

### 6. The admin tree is not localised by URL

Public routes are `/uk/…` and `/en/…` via next-intl's routing. `/admin` is excluded from
that entirely: its language is a cookie (`admin_locale`), default Ukrainian, switched by a
server action. The admin layout provides `NextIntlClientProvider` with an explicit locale
and messages.

*Why:* an admin does not need two URLs for the same inbox, and locale-prefixed admin
routes would have to be excluded from `hreflang`, sitemaps and the auth proxy anyway.

### 7. Cost estimates are ranges from real kit prices, capped by consumption

The payback estimator (`src/widgets/calculator/model/payback.ts`) takes power, tariff,
optional monthly consumption, a self-consumption share and the system type, and returns
ranges: output at 900–1200 kWh per kW per year (Lviv), savings capped by stated
consumption, installed cost scaled per kW from the catalogue's real kit + install prices
for that system type, payback rounded outward to whole years. Backup-only configurations
return no payback. Every estimate is labelled as a scenario or illustrative.

*Why ranges:* the earlier single-number version gave every station the same payback at
the same tariff (power cancels out) and implied a precision nobody has before a site
visit. A range with visible assumptions is the honest form of the same calculation.

### 8. Mobile is a different composition, not a squeezed desktop

The station catalogue is a card grid from `sm` up and a list of rows below it; the
services grid becomes a native `<details>` accordion; admin tables become cards below
`lg` and the filter selects move into a `<dialog>` bottom sheet. Both compositions render
from the same data and the same components, switched by breakpoint classes — nothing
forks.

*Why not one responsive layout:* five stacked station cards were 3,700px of scrolling for
a list of five things, and a seven-column table cannot be made narrow. Where the phone
needs a different shape, it gets one.

### 9. Native elements over libraries

Modals are `<dialog>` (Escape, focus trap, inert page, focus restore — from the browser).
Accordions are `<details>`. The admin filter sheet is a `<dialog>`. The one carousel
dependency is Embla, chosen for touch handling that is genuinely hard to hand-roll.

### 10. Verification is measured, not eyeballed

Design changes are checked by numbers in Playwright: element `top` values for alignment,
`scrollWidth − clientWidth` for overflow, computed contrast ratios, `getBoundingClientRect`
heights for touch targets, axe-core for WCAG 2.1 AA. E2E tests never write to the shared
database; the review submission path is exercised in Jest with the database mocked.

---

## Layout

```
src/app/[locale]/       public routes (uk, en)
src/app/admin/          admin routes, no locale prefix
src/entities/           domain: station, project, review, lead, article
                        (parse.ts = row → typed shape; queries.ts; actions.ts; ui/)
src/widgets/            page sections composed from entities
src/shared/{lib,ui}     cross-cutting helpers and the design-system primitives
messages/               next-intl UI strings
prisma/                 schema, migrations, seed
e2e/                    Playwright specs (read-only against the app)
```

`parse.ts` in each entity is the seam between a Prisma row and the typed shape the UI
uses: string-vocabulary columns are narrowed there, and an unknown value throws rather
than rendering as garbage.

## Environment

See `.env.example` — every variable is documented there, and every integration is
optional except `DATABASE_URL`: with the Telegram, email or analytics variables unset,
that side effect is skipped and the rest of the app runs unchanged. `NEXT_PUBLIC_*`
variables are the only ones shipped to the browser.
