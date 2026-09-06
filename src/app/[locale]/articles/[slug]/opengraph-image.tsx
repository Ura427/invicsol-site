import { ImageResponse } from 'next/og';
import { getArticleBySlug } from '@/entities/article/queries';

export const alt = 'INVICSOL article';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const data = await getArticleBySlug(slug, locale);

  const title = data?.translation.title ?? 'INVICSOL';
  const excerpt = data?.translation.excerpt ?? '';

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
          <div
            style={{
              display: 'flex',
              alignSelf: 'flex-start',
              background: 'rgba(232, 160, 32, 0.15)',
              color: '#e8a020',
              fontSize: 24,
              fontWeight: 600,
              padding: '8px 20px',
              borderRadius: 999,
            }}
          >
            Блог
          </div>

          <div style={{ display: 'flex', fontSize: 52, fontWeight: 800, color: '#ffffff' }}>
            {title}
          </div>

          {excerpt ? (
            <div style={{ display: 'flex', fontSize: 26, color: 'rgba(255,255,255,0.8)' }}>
              {excerpt}
            </div>
          ) : null}
        </div>
      </div>
    ),
    { ...size },
  );
}
