'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/shared/ui/Button';

interface StickyStationBarProps {
  /** Already formatted: «від 271 000 ₴» or «Ціна за проєктом». */
  priceLabel: string;
  ctaLabel: string;
  /** The hero CTA's element id; the bar shows once that has scrolled away. */
  watchId: string;
}

/**
 * Phone-only bar pinned to the bottom with the price and the one action. On
 * a phone the hero CTA is gone after the first screen and the next one is
 * four screens down; this keeps the decision reachable the whole way. Hidden
 * while the hero CTA is on screen (no doubling) and once the footer arrives
 * (the footer's own CTA band takes over).
 */
export function StickyStationBar({
  priceLabel,
  ctaLabel,
  watchId,
}: StickyStationBarProps) {
  // "Passed", not "not visible": on load the hero CTA is usually below the
  // fold, and a bar that appears before the button has even been seen is
  // noise over the hero. It shows once the CTA has scrolled above the top.
  const [heroPassed, setHeroPassed] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById(watchId);
    const footer = document.querySelector('footer');
    if (!hero || !footer) return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === hero)
          setHeroPassed(!entry.isIntersecting && entry.boundingClientRect.top < 0);
        if (entry.target === footer) setFooterVisible(entry.isIntersecting);
      }
    });
    observer.observe(hero);
    observer.observe(footer);
    return () => observer.disconnect();
  }, [watchId]);

  const shown = heroPassed && !footerVisible;

  return (
    <div
      aria-hidden={!shown}
      className={`bg-elevated/95 border-border fixed inset-x-0 bottom-0 z-40 border-t backdrop-blur transition-transform duration-300 lg:hidden ${
        shown ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center justify-between gap-4 px-4 py-3">
        <p className="text-navy-800 min-w-0 truncate text-base font-medium">
          {priceLabel}
        </p>
        <Button
          href="/contact"
          variant="gold"
          className="shrink-0"
          tabIndex={shown ? 0 : -1}
        >
          {ctaLabel}
        </Button>
      </div>
    </div>
  );
}
