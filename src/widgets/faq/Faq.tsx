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
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading title={t('heading')} />
      <div className="border-border mt-10 divide-y divide-gray-200 rounded-2xl border">
        {faq.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div key={item.id}>
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : item.id)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="text-navy-800 font-medium">{item.question}</span>
                <ChevronDown
                  className={`text-muted h-5 w-5 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  aria-hidden
                />
              </button>
              {isOpen ? <p className="text-muted px-5 pb-4 text-sm leading-relaxed">{item.answer}</p> : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
