import { useTranslations, useLocale } from 'next-intl';
import { getContent } from '@/shared/lib/content';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { ICONS } from '@/shared/ui/icons';

export function ServicesTeaser() {
  const t = useTranslations('Services');
  const locale = useLocale();
  const { services } = getContent(locale);

  return (
    <section className="bg-surface py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title={t('heading')} description={t('teaser')} />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = ICONS[service.icon];
            return (
              <Card key={service.id}>
                <Icon className="text-gold-600 h-7 w-7" aria-hidden />
                <h3 className="text-navy-800 mt-4 text-lg font-semibold">{service.title}</h3>
                <p className="text-muted mt-2 text-sm">{service.text}</p>
              </Card>
            );
          })}
        </div>
        <div className="mt-10 text-center">
          <Button href="/services" variant="outline">
            {t('viewAll')}
          </Button>
        </div>
      </div>
    </section>
  );
}
