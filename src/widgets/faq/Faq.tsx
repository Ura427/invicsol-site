'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { ChevronDown } from 'lucide-react';
import { getContent } from '@/shared/lib/content';
import { SectionHeading } from '@/shared/ui/SectionHeading';

export function Faq() {
  const t = useTranslations('Faq');
  const locale = useLocale();
  const { faq } = getContent(locale);
  const [openId, setOpenId] = useState<string | null>(faq[0]?.id ?? null);

  return (
    <section className="mx-auto max-w-3xl px-4 py-14 sm:py-20 lg:py-24 sm:px-6 lg:px-8">
      <SectionHeading title={t('heading')} />
      {/* Full-width rows separated by hairline rules, rather than a rounded
          bordered box. Same reasoning as the cards: this design draws with
          rules and tone, not containers. `divide-gray-200` was also a leftover
          cool gray that no longer matches the warmed border token. */}
      <div className="border-border divide-border mt-12 divide-y border-t">
        {faq.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div key={item.id}>
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : item.id)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
              >
                <span className="text-navy-800">{item.question}</span>
                <ChevronDown
                  className={`text-muted h-5 w-5 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                  aria-hidden
                />
              </button>
              {isOpen ? (
                <p className="text-muted max-w-[58ch] pb-6 text-sm leading-relaxed">
                  {item.answer}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
