# INVICSOL Reliability Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Correct the confirmed publishing, photo, filtering, navigation, calculator, accessibility, and content-truthfulness defects in one reversible commit.

**Architecture:** Keep URL-driven filtering and the current entity boundaries. Move computations into pure functions with unit tests, make dynamic project pages truly runtime-addressable, and let UI components consume validated domain results rather than duplicate rules.

**Tech Stack:** Next.js 16.3 App Router, React 19, TypeScript 5.9 strict, next-intl 4, Prisma 7/Postgres, Tailwind CSS 4, Jest/Testing Library, Playwright.

## Global Constraints

- Read relevant Next.js 16 guides in `node_modules/next/dist/docs/` before changing route behavior.
- Preserve Ukrainian as the default locale and English as the secondary locale.
- Do not write test leads or projects into the shared Neon database.
- Keep production photo upload disabled until persistent object storage is selected; hide or explain the unavailable action in the UI.
- Use calculated WCAG AA contrast of at least 4.5:1 for normal text.
- Finish all tasks and commit them together as the reliability-fixes commit.

---

### Task 1: Make project detail routes compatible with Admin CRUD

**Files:**
- Modify: `src/app/[locale]/projects/[slug]/page.tsx`
- Modify: `src/entities/project/ui/ProjectDetailContent.tsx`
- Test: `src/entities/project/__tests__/project-detail.test.tsx`

**Interfaces:**
- Consumes: `getProjectBySlug(slug, locale)` and `project.coverImage`.
- Produces: runtime-resolved project detail pages and a cover image independent of gallery records.

- [ ] **Step 1: Write failing tests** proving `ProjectDetailContent` renders `coverImage` when `images=[]` and renders optional gallery images after it without duplicating the cover.
- [ ] **Step 2: Run the targeted Jest test** and verify the cover assertion fails because rendering is guarded by `images.length > 0`.
- [ ] **Step 3: Implement the image rule** by rendering `project.coverImage` unconditionally and treating `images.filter(image => image.path !== project.coverImage)` as optional gallery content.
- [ ] **Step 4: Read the bundled dynamic-routes and `generateStaticParams` guides**, remove `dynamicParams = false` and the build-time database slug whitelist from the project detail page, and keep `notFound()` for unknown records.
- [ ] **Step 5: Run the targeted test and TypeScript** with `npm test -- project-detail.test.tsx --runInBand` and `npm run typecheck`.

### Task 2: Make photo-picker failures recoverable and production behavior truthful

**Files:**
- Modify: `src/app/admin/projects/ImagePicker.tsx`
- Modify: `src/app/admin/projects/ProjectForm.tsx`
- Test: `src/app/admin/projects/__tests__/ImagePicker.test.tsx`
- Modify: `messages/en.json`
- Modify: `messages/uk.json`

**Interfaces:**
- Consumes: `uploadProjectPhoto(FormData): Promise<UploadResult>`.
- Produces: a picker that always exits its busy state and exposes local upload only when supported.

- [ ] **Step 1: Write failing component tests** for a rejected upload promise and for production-disabled copy, asserting the control becomes usable again and an actionable message is announced.
- [ ] **Step 2: Run the targeted test** and confirm the rejected-promise case leaves the upload control disabled.
- [ ] **Step 3: Add a `canUpload` prop** supplied by the server-rendered form context, wrap the upload await in `try/catch/finally`, clear the file input in `finally`, and map unexpected rejection to the existing failed-upload message.
- [ ] **Step 4: Render an honest production state**: retain repository-image selection and replace the upload button with concise localized guidance when persistent upload is unavailable.
- [ ] **Step 5: Run the picker tests** and verify both failure and production states.

### Task 3: Correct admin filtering state and localized project sorting

**Files:**
- Modify: `src/widgets/admin-filters/useFilterParams.ts`
- Modify: `src/entities/project/admin-filters.ts`
- Modify: `src/app/admin/projects/actions.ts`
- Test: `src/widgets/admin-filters/__tests__/useFilterParams.test.tsx`
- Test: `src/entities/project/__tests__/admin-filters.test.ts`

**Interfaces:**
- Consumes: current URL parameters and the admin locale.
- Produces: atomic parameter updates, cancellable search commits, and title ordering matching visible rows.

- [ ] **Step 1: Write failing hook tests** for clearing within the 300 ms debounce and for two immediate filter selections retaining both parameters.
- [ ] **Step 2: Write a failing sorting test** using titles whose alphabetical order differs from their slugs.
- [ ] **Step 3: Run both targeted test files** and confirm all three regressions fail for the observed reasons.
- [ ] **Step 4: Introduce one mutable intended-parameters ref** in `useFilterParams`; update it synchronously before navigation, reset it and pending search state on clear, then derive each next URL from that ref.
- [ ] **Step 5: Sort displayed project results by localized title** after mapping translations, using `Intl.Collator(locale).compare(a.title, b.title)` when `sort === 'title'`; use a deterministic slug tie-breaker.
- [ ] **Step 6: Run both targeted tests** and the existing lead/project filter suites.

### Task 4: Stabilize public navigation across locale and width

**Files:**
- Modify: `src/widgets/nav/Nav.tsx`
- Modify: `src/widgets/nav/LocaleSwitcher.tsx`
- Test: `src/widgets/nav/__tests__/Nav.test.tsx`
- Modify: `e2e/navigation.spec.ts`

**Interfaces:**
- Consumes: locale-aware pathname and current `useSearchParams()`.
- Produces: locale links that preserve query state and a desktop header that never wraps at 1024–1279 px.

- [ ] **Step 1: Write failing tests** asserting locale links retain `?type=business` and the full desktop navigation begins only at the chosen safe breakpoint.
- [ ] **Step 2: Run the targeted unit test** and confirm query parameters are absent and `lg` exposes the crowded layout.
- [ ] **Step 3: Preserve query parameters** by building the switcher href from pathname plus `searchParams.toString()`.
- [ ] **Step 4: Move full navigation and CTA visibility from `lg` to `xl`**, move the menu button/mobile panel inverse classes to `xl:hidden`, and keep the anchored three-column layout at ≥1280 px.
- [ ] **Step 5: Add a Playwright assertion** at 1024 px that the compact header is used and at 1280/1440 px that all controls have one-line height before and after locale switching.
- [ ] **Step 6: Run navigation unit and E2E tests** without submitting any forms.

### Task 5: Make station payback accurate, valid, responsive, and accessible

**Files:**
- Modify: `src/widgets/calculator/model/estimatePayback.ts`
- Modify: `src/entities/station/ui/PaybackCalculator.tsx`
- Modify: `src/app/[locale]/stations/[slug]/page.tsx`
- Test: `src/widgets/calculator/model/__tests__/estimatePayback.test.ts`
- Test: `src/entities/station/ui/__tests__/PaybackCalculator.test.tsx`
- Modify: `messages/en.json`
- Modify: `messages/uk.json`

**Interfaces:**
- Produces: `estimateStationEconomics({ powerKw, tariffUahPerKwh, systemCostUah })` returning annual production, annual savings, and payback years or a typed invalid result.
- Consumes: displayed equipment cost plus the midpoint of a complete installation range; falls back to equipment cost when the range is absent.

- [ ] **Step 1: Write pure-function failing tests** for invalid tariff, displayed-cost payback, and deterministic rounding.
- [ ] **Step 2: Write component failing tests** asserting negative/empty tariff shows an inline error and mobile results use stacked rows.
- [ ] **Step 3: Run the targeted tests** and verify hidden reference pricing and negative savings cause failures.
- [ ] **Step 4: Replace the hidden cost-per-kW formula** with the explicit `systemCostUah` input and return no financial result for non-finite or non-positive inputs.
- [ ] **Step 5: Pass visible station costs from the route**, display an estimate-basis label, use `text-gold-700` for normal-size result text, and change compact results to `grid-cols-1 sm:grid-cols-3`.
- [ ] **Step 6: Remove the remaining bottom generic station CTA** and end the page with a concise contact choice that either carries station context or links to the custom sizing consultation.
- [ ] **Step 7: Run the calculator suites** and calculate foreground/background contrast for each result style.

### Task 6: Correct public claims and placeholder disclosure

**Files:**
- Modify: `src/entities/station/ui/StationCard.tsx`
- Modify: `src/shared/lib/content/en.ts`
- Modify: `src/shared/lib/content/uk.ts`
- Modify: `PRODUCT.md`
- Test: `src/entities/station/ui/__tests__/StationCard.test.tsx`
- Test: `src/shared/lib/content/__tests__/content.test.ts`

**Interfaces:**
- Consumes: `commercialIsPlaceholder` and documented evidence of six completed installations.
- Produces: visible disclosure next to demo prices and evidence-aligned company statistics.

- [ ] **Step 1: Write failing tests** requiring a demo badge on a card with placeholder commercial values and forbidding unsupported `380+`/`6.4 MW` claims in shipped content.
- [ ] **Step 2: Run the targeted tests** and confirm both problems are reproduced.
- [ ] **Step 3: Render the localized demo badge beside card pricing** whenever `commercialIsPlaceholder` is true.
- [ ] **Step 4: Replace unsupported scale statistics** with documented claims: founded in 2016, six completed installations, Lviv-region service, and the verified panel-warranty statement only if supported by actual seeded equipment terms.
- [ ] **Step 5: Update `PRODUCT.md`** to reflect the supplied real installation photos, current logo, equipment-price policy, and remaining placeholder data accurately.
- [ ] **Step 6: Run content and card tests** in both locales.

### Task 7: Verify and create one reliability commit

**Files:**
- Review: all files changed in Tasks 1–6

- [ ] **Step 1: Run `npm test -- --runInBand`** and require 0 failed suites.
- [ ] **Step 2: Run `npm run lint` and `npm run typecheck`** and require exit code 0.
- [ ] **Step 3: Run `npm run build`** with the configured environment and require exit code 0 without Prisma generation corruption.
- [ ] **Step 4: Run browser checks** at 390, 1024, 1280, and 1440 px for navigation, fixed station detail, project detail, and query-preserving locale switching.
- [ ] **Step 5: Inspect `git diff --check` and `git status --short`**, then commit only the reliability work with message `Fix publishing, filters and station-page inconsistencies`.

