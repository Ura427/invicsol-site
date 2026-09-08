import { getTranslations } from 'next-intl/server';
import { getAdminLocale } from '@/shared/lib/admin-locale';
import { AdminNav } from '@/widgets/admin-nav/AdminNav';
import { LeadsInboxClient } from './LeadsInboxClient';

export default async function AdminLeadsPage() {
  const locale = await getAdminLocale();
  const t = await getTranslations({ locale, namespace: 'Admin.leads' });

  return (
    <>
      <AdminNav />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h1 className="text-navy-800 text-3xl">{t('heading')}</h1>
        <p className="text-muted mt-2 max-w-[58ch] text-sm leading-relaxed">{t('subtitle')}</p>
        <div className="mt-8">
          <LeadsInboxClient />
        </div>
      </div>
    </>
  );
}
