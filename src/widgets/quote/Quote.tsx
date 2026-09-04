import { useLocale } from 'next-intl';
import { getContent } from '@/shared/lib/content';

export function Quote() {
  const locale = useLocale();
  const { quote } = getContent(locale);

  return (
    <section className="bg-navy-800 py-16 text-white">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <blockquote className="text-2xl leading-relaxed font-medium sm:text-3xl">
          &ldquo;{quote.text}&rdquo;
        </blockquote>
        <p className="text-gold-400 mt-6 text-sm font-semibold">
          {quote.author} — {quote.authorRole}
        </p>
      </div>
    </section>
  );
}
