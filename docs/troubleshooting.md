# Troubleshooting

## Every database-backed route returns 500 with a JSON parse error

**Symptom.** The dev server starts fine, but every page that touches the
database fails with:

```
SyntaxError: Unexpected non-whitespace character after JSON at position 768
```

Pages that don't query the database (`/uk/thank-you`, for example) still render,
which makes it look like a page bug. It isn't.

**Cause.** The generated Prisma client under `src/generated/prisma` was written
while the dev server was running. On Windows the running server holds those
files open, so `prisma generate` — including the one `prisma migrate dev` runs
for you — can leave a partially written client behind. The error comes from
Prisma parsing its own generated metadata, not from any application code.

**Fix.**

```bash
# stop the dev server first, then:
npm run db:regen
```

That deletes `src/generated/prisma` and regenerates it cleanly. Deleting
`.next` as well does no harm if the error persists.

**Avoiding it.** Stop the dev server before running `prisma migrate dev`,
`prisma db push` or `prisma generate`. The migration itself applies correctly
either way — it is only the client generation that gets damaged, which is why
the database ends up correct while the app cannot read it.

## Playwright fails on one or two tests, then passes when re-run

`playwright.config.ts` sets `reuseExistingServer: !process.env.CI`. If a dev
server is already listening on the port, Playwright uses that instead of
starting the production server, and six parallel workers then hit routes that
compile on demand — slow enough for a test to time out.

Stop the dev server before `npx playwright test`, or accept that the first run
against a warm dev server can flake. Results against a production server are the
authoritative ones.

## The shared Neon database

This redesign copy and the original site at
`D:\Claude\Local session\invicsol-site` point at the same Neon database. That is
deliberate — both render identical content, which is what makes a side-by-side
comparison meaningful.

The consequence: a migration run here also applies there. The commercial-fields
migration is additive (nullable columns only), so the original keeps working
untouched — its Prisma client simply never selects the new columns. If the
original is ever rebuilt and Prisma complains about migration drift, copy
`prisma/migrations/20260907171404_add_station_commercial_fields/` into its own
migrations folder to bring the histories back in line.
