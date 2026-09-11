# Approved website audit fixes

User approved findings 3–8 and the change list in this task. Execute in the existing workspace; retain unrelated business claims, contacts, and pricing policy.

## Implementation

- [ ] Add regression coverage, then catch rejected lead actions in ContactForm, CallbackModal, and CalculatorWizard. Reset pending state in finally; retain inputs and show translated retry feedback, including non-phone callback errors.
- [ ] Test clear/type/blur power entry. Keep a draft string, update calculations only for valid values, and clamp on blur. Give each control its own accessible name.
- [ ] Replace constant-ratio payback with an interval model: 900–1200 kWh/kW/year illustrative yield, editable self-consumption share, annual consumption cap, no export revenue, catalogue equipment plus installation cost ranges separated by system type. Hybrid reference kits include their listed batteries. Propagate example-price flags and explain that storage sizing, replacements, finance, degradation, and maintenance are excluded. No solar return for storage-only solutions; missing consumption is explicitly illustrative.
- [ ] Preserve current search/hash in locale link destinations, including after client filter and hash changes. Test actual rendered links.
- [ ] Name project arrows Previous/Next in both locales and derive disabled states from Embla on selection/reinitialization.
- [ ] Filter placeholder testimonials; return no section for an empty real-review list. Consolidate the WhyUs editorial content with the useful engineering details from Expertise, remove separate Expertise and Quote from the homepage, and reduce mobile section spacing.
- [ ] Run focused tests through red/green, then full Jest, lint, typecheck, and read-only browser checks for Ukrainian/English at desktop/mobile widths. Never submit test leads to the shared database.

## Files and boundaries

Lead form components own UI recovery; the server action remains unchanged. Calculator model accepts serializable catalogue references and returns generation/savings/payback ranges, keeping DB access in server pages. LocaleSwitcher owns preserving its destination URL. Homepage components retain existing typography, palette, photography, and services/catalogue/projects/contact entry points.

## Validation scenarios

Rejected lead action → visible retry message and enabled submit, without erasing name/phone. Power 10 → clear → type 25 → blur remains 25; 999 clamps to 100. Low-load oversized station pays back slower than a correctly sized one; storage-only returns null; hybrid references differ from grid references; invalid and zero inputs never display NaN/Infinity. Locale switch preserves repeated query keys and #stations. Carousel edges disable the appropriate arrow. Placeholder-only testimonials render nothing; real reviews still render.
