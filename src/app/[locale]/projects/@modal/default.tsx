/**
 * Fallback for the @modal slot on every route under /projects that isn't the
 * intercepted (.)[slug] one — i.e. nothing to render, so the gallery or detail
 * page shows without an overlay on top of it.
 */
export default function Default() {
  return null;
}
