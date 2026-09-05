import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getContent } from '@/shared/lib/content';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import { Card } from '@/shared/ui/Card';
import { PlaceholderBadge } from '@/shared/ui/PlaceholderBadge';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'About' });
  return { title: t('pageTitle'), description: t('pageDescription') };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('About');
  const { team, brands, warranty } = getContent(locale);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading title={t('heading')} description={t('intro')} align="left" />

      <div className="mt-12">
        <h2 className="text-navy-800 text-xl font-bold">{t('teamHeading')}</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {team.map((member) => (
            <Card key={member.id} className="relative">
              {member.isPlaceholder ? <PlaceholderBadge label={t('placeholderBadge')} /> : null}
              <h3 className="text-navy-800 font-semibold">{member.name}</h3>
              <p className="text-gold-700 text-sm">{member.role}</p>
              <p className="text-muted mt-2 text-sm">{member.bio}</p>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-navy-800 text-xl font-bold">{t('warrantyHeading')}</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {warranty.map((item) => (
            <Card key={item.id}>
              <p className="text-gold-600 text-3xl font-extrabold">{item.years}</p>
              <h3 className="text-navy-800 mt-2 font-semibold">{item.title}</h3>
              <p className="text-muted mt-2 text-sm">{item.text}</p>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-navy-800 text-xl font-bold">{t('brandsHeading')}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => (
            <div key={brand.id} className="border-border rounded-xl border p-4">
              <p className="text-navy-800 font-semibold">{brand.name}</p>
              <p className="text-gold-700 text-xs">{brand.category}</p>
              <p className="text-muted mt-1 text-sm">{brand.note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
