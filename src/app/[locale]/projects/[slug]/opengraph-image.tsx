import { ImageResponse } from 'next/og';
import { getProjectBySlug } from '@/entities/project/queries';

export const alt = 'INVICSOL project';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * Same reasoning as stations/[slug]/opengraph-image.tsx: the card shown when
 * this project's link is shared in Telegram or Viber. Statically generated
 * at build time via the route's own generateStaticParams.
 */
export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const data = await getProjectBySlug(slug, locale);

  const title = data?.translation.title ?? 'INVICSOL';
  const summary = data?.translation.summary ?? '';
  const capacityKw = data?.project.capacityKw;

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

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 980 }}>
          {capacityKw !== undefined ? (
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
              {capacityKw} kW
            </div>
          ) : null}

          <div style={{ display: 'flex', fontSize: 56, fontWeight: 800, color: '#ffffff' }}>
            {title}
          </div>

          {summary ? (
            <div style={{ display: 'flex', fontSize: 28, color: 'rgba(255,255,255,0.8)' }}>
              {summary}
            </div>
          ) : null}
        </div>
      </div>
    ),
    { ...size },
  );
}
