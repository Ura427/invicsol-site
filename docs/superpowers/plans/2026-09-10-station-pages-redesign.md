# INVICSOL Station Pages Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give `/stations/custom` a concise sizing consultation and refine `/stations/{x}kw` into clearer engineering product pages with stronger personality and less repeated text.

**Architecture:** Add a small pure recommendation model shared by a focused custom advisor component and existing calculator utilities. Keep fixed-station pages server-rendered; isolate the interactive economics panel and the custom lead form as client components. Submit through the existing lead action with structured calculator context.

**Tech Stack:** Next.js 16.3 App Router, React 19, TypeScript 5.9 strict, next-intl 4, Tailwind CSS 4, Prisma/Postgres lead action, Jest/Testing Library, Playwright.

## Global Constraints

- Implement only after the reliability-fixes commit is complete.
- Preserve the warm paper/navy/gold visual system, Manrope headings, Inter body text, ruled data layout, visible focus, and reduced-motion behavior.
- Use one installation image as the page's visual signature; add no gradients, decorative shadows, or generic dashboard cards.
- Keep all claims calm, technical, and specific to solar engineering in the Lviv region.
- Keep Ukrainian and English content structurally identical.
- Submit no test leads to the shared Neon database.
- Commit this entire redesign separately from reliability fixes.

---

### Task 1: Define custom sizing and economics as a pure domain model

**Files:**
- Create: `src/entities/station/custom-recommendation.ts`
- Create: `src/entities/station/__tests__/custom-recommendation.test.ts`
- Reuse: `src/widgets/calculator/model/estimatePower.ts`
- Reuse: `src/widgets/calculator/model/estimatePayback.ts`

**Interfaces:**
- Produces `type DaytimeShare = 'low' | 'medium' | 'high'`.
- Produces `type BackupNeed = 'none' | 'critical' | 'extended'`.
- Produces `interface CustomRecommendationInput { monthlyKwh: number; daytimeShare: DaytimeShare; backupNeed: BackupNeed; tariffUahPerKwh: number }`.
- Produces `interface CustomRecommendation { recommendedPowerKw: number; catalogueSlug: '5kw' | '10kw' | '15kw' | '30kw' | 'custom'; systemType: 'grid-tied' | 'hybrid'; annualProductionKwh: number; annualSavingsUah: number; paybackYears: number | null }`.
- Produces `recommendCustomStation(input, stations): CustomRecommendation | { error: 'monthlyKwh' | 'tariff' }`.

- [ ] **Step 1: Write failing tests** covering each catalogue boundary, all backup modes, invalid/non-finite numeric input, and a consumption level above 30 kW.
- [ ] **Step 2: Run the targeted test** and verify failure because the recommendation module does not exist.
- [ ] **Step 3: Implement the minimal model**: derive baseline power with `estimatePowerFromConsumption`, apply a documented daytime-use adjustment, choose hybrid for either backup mode, select the smallest fitting fixed tier, and use that tier's displayed cost for economics.
- [ ] **Step 4: Return `custom` above the fixed range** and keep payback `null` when no verified commercial cost exists.
- [ ] **Step 5: Run the targeted tests** and verify every boundary.

### Task 2: Build the compact custom-station advisor

**Files:**
- Create: `src/entities/station/ui/CustomStationAdvisor.tsx`
- Create: `src/entities/station/ui/__tests__/CustomStationAdvisor.test.tsx`
- Modify: `messages/en.json`
- Modify: `messages/uk.json`

**Interfaces:**
- Consumes: `recommendCustomStation`, station commercial data, `submitLead`, and the current locale.
- Produces: four sizing inputs, live recommendation results, and an inline contact form.

- [ ] **Step 1: Write failing component tests** for valid live results, field-level errors, backup-driven hybrid selection, contact validation, structured submission payload, server failure, and successful thank-you navigation.
- [ ] **Step 2: Run the targeted test** and verify it fails because the component is absent.
- [ ] **Step 3: Implement four inputs**: monthly kWh number, low/medium/high daytime-use segmented choices, no/critical/extended backup choices, and tariff number prefilled with the documented household default.
- [ ] **Step 4: Implement the result panel** with recommended kW/system type, annual generation, annual savings, payback when supported, and a localized caveat. Announce valid result changes through `aria-live="polite"`.
- [ ] **Step 5: Implement the short inline lead form** with name, Ukrainian phone validation, phone/Viber/Telegram choice, honeypot, busy state, and structured `extra` data containing every input and recommendation field.
- [ ] **Step 6: Run the component tests** and inspect keyboard order and error association.

### Task 3: Redesign `/stations/custom` around the advisor

**Files:**
- Modify: `src/app/[locale]/stations/[slug]/page.tsx`
- Create: `src/entities/station/ui/CustomStationPage.tsx`
- Modify: `messages/en.json`
- Modify: `messages/uk.json`

**Interfaces:**
- Consumes: custom station translation, all fixed station commercial data, `CustomStationAdvisor`, and `SITE` contact details.
- Produces: a concise custom route while leaving fixed station routing intact.

- [ ] **Step 1: Extract the custom branch** from the shared route into `CustomStationPage`, keeping the route responsible only for loading and dispatching station data.
- [ ] **Step 2: Build the opening composition**: one short outcome-led heading, one sentence of context, one installation photograph, and the advisor visible within the first desktop screen.
- [ ] **Step 3: Remove repeated content** including the long process grid, suitable/outcomes duplication, empty specification treatment, and generic CTA copy from the custom branch.
- [ ] **Step 4: Add exactly three concise trust rows**: free site survey, engineering matched to roof/load, and installation plus ongoing support.
- [ ] **Step 5: Add a final low-pressure contact alternative** using the verified phone or contact page; avoid repeating the inline form.
- [ ] **Step 6: Review both locales** for line length, translation parity, and unsupported promises.

### Task 4: Refine fixed-capacity station pages

**Files:**
- Create: `src/entities/station/ui/FixedStationPage.tsx`
- Modify: `src/app/[locale]/stations/[slug]/page.tsx`
- Modify: `src/entities/station/ui/PaybackCalculator.tsx`
- Modify: `messages/en.json`
- Modify: `messages/uk.json`
- Test: `src/entities/station/ui/__tests__/FixedStationPage.test.tsx`

**Interfaces:**
- Consumes: parsed station and translation data plus corrected station economics.
- Produces: a focused layout shared by 5/10/15/30 kW pages.

- [ ] **Step 1: Write a failing render test** requiring one h1, one visible price caveat, calculator context tied to the displayed station, no generic “quote for this station” link, and no duplicated benefit copy.
- [ ] **Step 2: Run the targeted test** and verify it fails against the current monolithic route.
- [ ] **Step 3: Build a quieter first screen** with image, title/fit sentence, truthful price block, and a compact economics panel. Keep badge, stock, and reviews subordinate to the decision content.
- [ ] **Step 4: Replace the four equal specification cells** with an engineering strip emphasizing power, system type, purpose, and expandability without bordered mini-cards.
- [ ] **Step 5: Compress “suitable for” and “outcomes”** into one two-column decision section: “Works well when” and “What changes for you,” capped at three concise items each.
- [ ] **Step 6: Turn equipment into a readable bill of materials** with main kit prominent, optional additions quieter, and the single equipment photograph retained as atmosphere rather than product proof.
- [ ] **Step 7: End with one meaningful route** to the custom advisor, passing known station size in the query string so the next page starts with context.
- [ ] **Step 8: Run the fixed-page test** for all four slugs in both locales.

### Task 5: Responsive visual QA and redesign commit

**Files:**
- Modify if required by evidence: files from Tasks 1–4 only
- Add: `e2e/station-pages.spec.ts`

- [ ] **Step 1: Add non-submitting browser tests** for custom advisor inputs/results and fixed-page navigation at 390, 768, 1024, and 1440 px.
- [ ] **Step 2: Inspect screenshots** for first-screen comprehension, label wrapping, result density, heading balance, and alignment with the homepage design system.
- [ ] **Step 3: Remove one unnecessary decorative or repeated element** found during the visual critique rather than adding further ornament.
- [ ] **Step 4: Verify accessibility** including focus order, live result announcements, invalid input messages, and calculated AA contrast.
- [ ] **Step 5: Run `npm test -- --runInBand`, `npm run lint`, `npm run typecheck`, and `npm run build`**, requiring all to exit successfully.
- [ ] **Step 6: Run `git diff --check`**, review the complete diff against the approved design, and commit only station-page work with message `Redesign station pages around guided sizing`.
