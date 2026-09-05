interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
}

export function SectionHeading({ eyebrow, title, description, align = 'center' }: SectionHeadingProps) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-left';

  return (
    <div className={`max-w-2xl ${alignClass}`}>
      {eyebrow ? (
        <p className="text-gold-700 mb-2 text-sm font-semibold tracking-wide uppercase">{eyebrow}</p>
      ) : null}
      <h2 className="text-navy-800 text-3xl font-bold sm:text-4xl">{title}</h2>
      {description ? <p className="text-muted mt-4 text-base sm:text-lg">{description}</p> : null}
    </div>
  );
}
