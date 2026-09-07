import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/shared/ui/Button';

export default function NotFound() {
  const t = useTranslations('NotFound');

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-navy-800 text-3xl">{t('heading')}</h1>
      <p className="text-muted max-w-md">{t('text')}</p>
      <Button href="/" variant="primary">
        {t('backHome')}
      </Button>
    </div>
  );
}
