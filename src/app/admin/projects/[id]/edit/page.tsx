import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getAdminLocale } from '@/shared/lib/admin-locale';
import { AdminNav } from '@/widgets/admin-nav/AdminNav';
import { getProjectForEdit } from '../../actions';
import { ProjectForm } from '../../ProjectForm';

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const initialValues = await getProjectForEdit(id);
  if (!initialValues) notFound();

  const locale = await getAdminLocale();
  const t = await getTranslations({ locale, namespace: 'Admin.projects' });

  return (
    <>
      <AdminNav />
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <h1 className="text-navy-800 text-3xl">{t('editHeading')}</h1>
        <div className="mt-8">
          <ProjectForm mode="edit" projectId={id} initialValues={initialValues} />
        </div>
      </div>
    </>
  );
}
