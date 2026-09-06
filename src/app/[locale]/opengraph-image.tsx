import { ImageResponse } from 'next/og';
import { getTranslations } from 'next-intl/server';

export const alt = 'INVICSOL';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * The default share card for every page under [locale] that doesn't define
 * its own opengraph-image.tsx (stations/[slug] and projects/[slug] do, and
 * Next resolves to whichever is closest to the actual route). Before this,
 * the homepage and every generic page had no OG image at all — a link
 * pasted into Telegram or Viber, this market's actual referral channel,
 * rendered a blank grey box.
 */
export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 32,
          padding: 80,
          background: 'linear-gradient(135deg, #0d1e3d 0%, #162d56 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: '#e8a020',
            }}
          />
          <div style={{ fontSize: 72, fontWeight: 800, color: '#ffffff' }}>INVICSOL</div>
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 32,
            color: 'rgba(255,255,255,0.8)',
            textAlign: 'center',
            maxWidth: 900,
          }}
        >
          {t('defaultDescription')}
        </div>
      </div>
    ),
    { ...size },
  );
}
