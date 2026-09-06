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

  return (
    <div className={`max-w-2xl ${alignClass}`}>
      {eyebrow ? (
        <p className={`${eyebrowClass} mb-2 text-sm font-semibold tracking-wide uppercase`}>
          {eyebrow}
        </p>
      ) : null}
      <h2 className={`${titleClass} text-3xl font-bold sm:text-4xl`}>{title}</h2>
      {description ? (
        <p className={`${descriptionClass} mt-4 text-base sm:text-lg`}>{description}</p>
      ) : null}
    </div>
  );
}
