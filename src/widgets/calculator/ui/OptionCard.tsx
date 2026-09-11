import { Check } from 'lucide-react';

interface OptionCardProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

/**
 * A white card, not a hairline outline. The wizard sits on the beige tint on
 * the bespoke station page, where a 1px border in the border colour is nearly
 * the same tone as the background; a fill is what the site's tonal elevation
 * system uses to lift a card, and it works on the paper page too. The chosen
 * one gets a gold edge and a check, so the state reads without relying on the
 * tint alone.
 */
export function OptionCard({ label, isSelected, onClick }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isSelected}
      className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-colors ${
        isSelected
          ? 'border-gold-600 bg-gold-500/10 text-navy-800'
          : 'bg-elevated text-navy-800 border-transparent hover:border-gold-500/60'
      }`}
    >
      <span>{label}</span>
      {isSelected ? <Check className="text-gold-700 h-4 w-4 shrink-0" aria-hidden /> : null}
    </button>
  );
}
