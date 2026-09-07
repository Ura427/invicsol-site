interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  /** 'light' flips text colors for use on a dark (navy) background. */
  tone?: 'default' | 'light';
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  tone = 'default',
}: SectionHeadingProps) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-left';
  const titleClass = tone === 'light' ? 'text-white' : 'text-navy-800';
  const eyebrowClass = tone === 'light' ? 'text-gold-400' : 'text-gold-700';
  const descriptionClass = tone === 'light' ? 'text-white/70' : 'text-muted';

  const markerClass = tone === 'light' ? 'bg-gold-400' : 'bg-gold-700';
  const eyebrowJustify = align === 'center' ? 'justify-center' : 'justify-start';

  return (
    <div className={`max-w-2xl ${alignClass}`}>
      {eyebrow ? (
        // A small solid square before the label, instead of a bare line of
        // uppercase text. It's a machined, dial-indicator device — the kind of
        // specific detail that stops a section header reading as generic.
        <p className={`${eyebrowClass} mb-4 flex items-center gap-2.5 ${eyebrowJustify}`}>
          <span className={`${markerClass} inline-block h-1 w-1 shrink-0`} aria-hidden />
          <span className="text-xs font-medium tracking-[0.14em] uppercase">{eyebrow}</span>
        </p>
      ) : null}
      {/* Weight and tracking come from the global h1,h2,h3 rule (light + tight).
          Deliberately not re-bolded here — see globals.css. */}
      <h2 className={`${titleClass} text-[2rem] sm:text-[2.75rem]`}>{title}</h2>
      {description ? (
        <p className={`${descriptionClass} mt-5 text-base leading-relaxed sm:text-lg`}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
