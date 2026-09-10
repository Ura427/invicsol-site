# INVICSOL reliability fixes and custom-station redesign

## Goal

Finish the work requested in the last Claude session, correct the defects found during
review, and turn the custom-station page into a concise sizing consultation. Preserve
the existing warm, technical INVICSOL design and its Ukrainian-first localization.

## Delivery and rollback

Implementation is split into two independent commits:

1. Correct confirmed bugs, accessibility failures, navigation behavior, admin filters,
   project publishing, photo handling, and content inconsistencies.
2. Redesign `/[locale]/stations/custom` around a compact sizing and payback calculator.

This design document is committed separately before implementation.

## Reliability and consistency fixes

### Project publishing and images

- Make new and renamed project slugs available on direct requests without rebuilding.
- Render a project's selected `coverImage` whether or not it has additional gallery
  image records.
- Treat the cover as the first image and additional images as an optional gallery.
- Keep upload controls honest in production. The production UI must not offer an action
  that the server always rejects. Local uploads retain type and size validation.
- Ensure upload failures always restore the picker to an interactive state and show an
  actionable error.

Persistent production uploads are outside this implementation because no blob-storage
provider has been selected. Existing repository images remain selectable everywhere.

### Admin filters

- Keep filters, sorting, and search in URL parameters.
- Sort projects by the displayed localized title when the operator selects title order.
- Cancel pending search updates when filters are cleared.
- Compose rapid filter changes from the latest intended state so one selection cannot
  overwrite another.

### Public navigation

- Keep the language control and main link group stable while switching locales.
- Move the desktop-to-mobile breakpoint high enough that translated labels and both CTAs
  never wrap into tall, uneven controls at intermediate widths.
- Preserve the current page and its query string when changing language.

### Station calculator and CTA

- Reject or clamp invalid tariff input before computing savings.
- Use the station's displayed commercial data for payback where available, rather than
  a conflicting hidden reference price.
- Use readable text colors and a mobile layout that does not force three narrow result
  columns.
- Remove the remaining generic “for this station” CTA that promises station context but
  sends only to the generic contact page. The replacement custom-page form will submit
  the calculated station context.

### Content truthfulness

- Show the demo-data badge wherever placeholder commercial figures appear, including
  station catalogue cards.
- Align public company statistics with the documented evidence. The site must not claim
  hundreds of installations while `PRODUCT.md` records six completed installations.
- Update stale project Markdown statements affected by these changes.

## Custom-station page

### Page job

Help a homeowner or business visitor turn uncertain requirements into a useful first
recommendation, then submit that recommendation with contact details. The result remains
an estimate; the site visit produces the final engineering decision and quote.

### Layout

The page uses a compact “engineering brief” structure:

1. A concise hero states the outcome and places the calculator within the first screen.
2. The calculator asks for monthly consumption, daytime-use share, backup requirement,
   and electricity tariff.
3. The result shows suggested station size, annual production, annual savings, and an
   estimated payback period.
4. A short inline lead form asks for name, phone, and preferred contact method. The
   calculated inputs and result travel with the lead automatically.
5. Three short trust points explain the site survey, project-specific engineering, and
   installation/support process.
6. A final phone/contact alternative serves visitors who do not want to use the form.

Long process explanations and repeated sales copy are removed. The page retains one
strong installation image, restrained ruled data presentation, Manrope display type,
Inter body type, warm paper surfaces, navy text, and gold only for emphasis and action.

### Calculator behavior

- Reuse the existing sizing and payback domain functions rather than duplicate formulas.
- Monthly consumption and tariff accept constrained numeric input with inline errors.
- Daytime-use share is a small set of understandable choices rather than a precision
  slider.
- Backup requirement distinguishes no backup, critical loads, and extended backup.
- Suggested sizes map to the existing catalogue tiers where possible; requirements above
  fixed tiers remain custom.
- Results update immediately after valid changes and remain stable during contact entry.
- Submission uses the existing lead action and includes a structured payload identifying
  the custom-station page, inputs, and calculated recommendation.

### Responsive and accessible behavior

- On large screens the calculator and result form a balanced two-column work area.
- On phones inputs, result values, and contact fields stack in reading order.
- Controls have visible labels, keyboard focus, appropriate input modes and autocomplete.
- Result changes use a polite live region, errors appear beside their fields, and all
  normal text meets WCAG AA contrast.
- Existing reduced-motion behavior remains intact; no new decorative animation is needed.

## Verification

- Unit tests cover sizing boundaries, invalid tariffs, payback using displayed costs,
  localized project sorting, filter clearing, and project image fallback.
- Component tests cover calculator errors/result updates and resilient upload failure UI.
- Browser checks cover locale switching with query parameters, the 1024–1280 px header
  range, custom-page desktop/mobile layouts, and direct access to a newly created-style
  slug without writing to the shared database.
- Run Jest, ESLint, TypeScript, and a production build before each implementation commit.

