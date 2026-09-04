/**
 * Marks demo content (invented testimonials, sample team bios, sample financing
 * terms) as visibly not-real, so it can stay on the page for review without ever
 * being presented to a visitor as genuine. See listPlaceholderContent() for the
 * launch-blocker audit this pairs with.
 */
export function PlaceholderBadge({ label }: { label: string }) {
  return (
    <span className="border-gold-500 text-gold-600 absolute top-3 right-3 rounded-full border bg-white/90 px-2.5 py-0.5 text-xs font-semibold">
      {label}
    </span>
  );
}
