'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { KitItem } from '@/entities/station/parse';

interface EquipmentCarouselProps {
  /** Only items with an image become slides; the rest are simply not shown here. */
  items: readonly KitItem[];
  /**
   * The photos under public/equipment/ are stock, not the listed models. While
   * this is true the carousel says so on every slide — the caption names a
   * specific product, and a caption over a photo of a different product would
   * otherwise claim the photo is that product.
   */
  isIllustrative: boolean;
}

/**
 * The station page's hero: one slide per line of the main kit, captioned with
 * that line. Same Embla setup as the projects carousel, with two differences
 * that follow from being a hero rather than a strip of cards — a single full
 * slide rather than a peeking row, and dots, because with a full-width slide
 * there is no next-card edge to tell the eye it can scroll.
 *
 * Arrows are 44px, the minimum comfortable touch target.
 */
export function EquipmentCarousel({ items, isIllustrative }: EquipmentCarouselProps) {
  const t = useTranslations('Stations');
  const slides = items.filter((item): item is KitItem & { image: string } => item.image !== null);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: slides.length > 1,
    duration: 30,
  });
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (emblaApi) setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  // Subscribed only, never called directly: the state already starts at slide
  // 0, which is where Embla starts, and calling it here would be a setState
  // inside an effect body. `reInit` covers a resize changing the snap.
  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  if (slides.length === 0) return null;

  return (
    <div className="relative">
      <div
        className="overflow-hidden rounded-[var(--radius-image)]"
        ref={emblaRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={t('kit')}
      >
        <div className="flex">
          {slides.map((slide, index) => (
            <div
              key={slide.label}
              className="relative aspect-[4/3] min-w-0 flex-[0_0_100%] lg:aspect-[5/4]"
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} / ${slides.length}`}
            >
              <Image
                src={slide.image}
                alt=""
                fill
                priority={index === 0}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="bg-surface object-cover"
              />
              {/* Caption on a bottom-weighted scrim, the same device as the
                  homepage hero: contrast exactly where the text sits and none
                  where it doesn't. */}
              <div
                className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-900/85 via-navy-900/40 to-transparent px-6 pt-16 pb-5 text-white"
                aria-hidden
              >
                <p className="text-lg font-medium tracking-[-0.01em]">{slide.label}</p>
                {isIllustrative ? (
                  <p className="mt-1 text-xs text-white/70">{t('illustrativePhoto')}</p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      {slides.length > 1 ? (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-2" role="tablist" aria-label={t('kit')}>
            {slides.map((slide, index) => (
              <button
                key={slide.label}
                type="button"
                role="tab"
                aria-selected={index === selected}
                aria-label={slide.label}
                onClick={() => emblaApi?.scrollTo(index)}
                // The hit area is 44px; the visible dot is not, which is how a
                // row of dots stays quiet while still being tappable.
                className="flex h-11 w-6 items-center justify-center"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all ${
                    index === selected ? 'bg-navy-800 w-6' : 'bg-border w-1.5'
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => emblaApi?.scrollPrev()}
              aria-label={t('previous')}
              className="border-border text-navy-800 hover:bg-navy-800 flex h-11 w-11 items-center justify-center rounded-full border transition-colors hover:text-white"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => emblaApi?.scrollNext()}
              aria-label={t('next')}
              className="border-border text-navy-800 hover:bg-navy-800 flex h-11 w-11 items-center justify-center rounded-full border transition-colors hover:text-white"
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
