import { useTranslations } from 'next-intl';
import { Send, MessageCircle } from 'lucide-react';
import { SITE } from '@/shared/lib/site';

/**
 * Viber + Telegram, deliberately no WhatsApp — WhatsApp has low adoption in this
 * market, and INVICSOL's leads come through the two messengers people already use.
 */
export function FloatingButtons() {
  const t = useTranslations('FloatingButtons');

  // These buttons were dead for a data reason, not a code one: they point at
  // SITE.telegram and SITE.viber, which are still the invented handle
  // (t.me/invicsol) and the invented phone number. A messenger button that
  // opens a chat with nobody is worse than no button, because the visitor
  // believes they have made contact and stops trying. While the contact details
  // are flagged as placeholders the buttons stay hidden; they return on their
  // own once real details are entered and isPlaceholderContact is cleared.
  if (SITE.isPlaceholderContact) return null;

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
