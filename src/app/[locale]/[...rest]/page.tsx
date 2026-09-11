import { notFound } from 'next/navigation';

/**
 * Without this, an address nobody defined (/uk/anything) falls through to
 * Next's bare default 404 — no header, no footer, English only. Routing it
 * through notFound() renders the localized not-found.tsx beside this file
 * inside the site shell.
 */
export default function CatchAll() {
  notFound();
}
