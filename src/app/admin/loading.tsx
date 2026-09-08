import { getTranslations } from 'next-intl/server';
import { getAdminLocale } from '@/shared/lib/admin-locale';

export default async function AdminLoading() {
  const locale = await getAdminLocale();
  const t = await getTranslations({ locale, namespace: 'Admin.common' });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="text-muted text-sm">{t('loading')}</p>
    </div>
  );
}
