import { useTranslations } from 'next-intl';
import { Send, MessageCircle } from 'lucide-react';
import { SITE } from '@/shared/lib/site';

/**
 * Viber + Telegram, deliberately no WhatsApp — WhatsApp has low adoption in this
 * market, and INVICSOL's leads come through the two messengers people already use.
 */
export function FloatingButtons() {
  const t = useTranslations('FloatingButtons');

  return (
    <div className="fixed right-4 bottom-4 z-40 flex flex-col gap-3">
      <a
        href={SITE.telegram}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('telegram')}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#26A5E4] text-white shadow-lg transition-transform hover:scale-105"
      >
        <Send className="h-5 w-5" aria-hidden />
      </a>
      <a
        href={SITE.viber}
        aria-label={t('viber')}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#7360F2] text-white shadow-lg transition-transform hover:scale-105"
      >
        <MessageCircle className="h-5 w-5" aria-hidden />
      </a>
    </div>
  );
}
