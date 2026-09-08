import { getTranslations } from 'next-intl/server';
import { getAdminLocale } from '@/shared/lib/admin-locale';
import { AdminNav } from '@/widgets/admin-nav/AdminNav';
import { ProjectForm } from '../ProjectForm';

export default async function NewProjectPage() {
  const locale = await getAdminLocale();
  const t = await getTranslations({ locale, namespace: 'Admin.projects' });

  return (
    <>
      <AdminNav />
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <h1 className="text-navy-800 text-3xl">{t('createHeading')}</h1>
        <div className="mt-8">
          <ProjectForm mode="create" />
        </div>
      </div>
    </>
  );
}
