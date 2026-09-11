import { ImageResponse } from 'next/og';
import { getStationBySlug } from '@/entities/station/queries';

// next-intl is unavailable in the OG image runtime, so the three labels live
// here. Keep in step with Stations.systemTypes in messages/*.json.
const SYSTEM_TYPE_LABEL: Record<string, Record<string, string>> = {
  uk: { 'grid-tied': 'Мережева', hybrid: 'Гібридна', custom: 'За проєктом' },
  en: { 'grid-tied': 'Grid-tied', hybrid: 'Hybrid', custom: 'Custom-designed' },
};

export const alt = 'INVICSOL station';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * The preview card rendered when a station link is pasted into Telegram or
 * Viber — this market's actual referral channel. Without this, a shared link
 * shows a blank grey box; with it, it shows a real business card.
 *
 * Statically generated at build time (same generateStaticParams as the page
 * itself, reused automatically for this file), so this costs nothing at
 * request time — it's baked in alongside the page.
 */
export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const data = await getStationBySlug(slug, locale);

  const title = data?.translation.title ?? 'INVICSOL';
    // Upper label on the card: the system type. It was the invented tier badge.
  const badge = data ? SYSTEM_TYPE_LABEL[locale]?.[data.station.systemType] ?? '' : '';
  const powerKw = data?.station.powerKw;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 80,
          background: 'linear-gradient(135deg, #0d1e3d 0%, #162d56 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: '#e8a020',
            }}
          />
          <div style={{ fontSize: 36, fontWeight: 700, color: '#ffffff' }}>INVICSOL</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {badge ? (
            <div
              style={{
                display: 'flex',
                alignSelf: 'flex-start',
                background: 'rgba(232, 160, 32, 0.15)',
                color: '#e8a020',
                fontSize: 28,
                fontWeight: 600,
                padding: '10px 24px',
                borderRadius: 999,
              }}
            >
              {badge}
            </div>
          ) : null}

          <div style={{ display: 'flex', fontSize: 64, fontWeight: 800, color: '#ffffff' }}>
            {title}
          </div>

          {powerKw !== null && powerKw !== undefined ? (
            <div style={{ display: 'flex', fontSize: 44, fontWeight: 700, color: '#e8a020' }}>
              {powerKw} кВт
            </div>
          ) : null}
        </div>
      </div>
    ),
    { ...size },
  );
}
