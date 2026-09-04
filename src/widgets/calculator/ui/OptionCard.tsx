interface OptionCardProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

export function OptionCard({ label, isSelected, onClick }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isSelected}
      className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors ${
        isSelected
          ? 'border-gold-500 bg-gold-500/10 text-navy-800'
          : 'border-border text-navy-800 hover:border-gold-500/50'
      }`}
    >
      {label}
    </button>
  );
}
