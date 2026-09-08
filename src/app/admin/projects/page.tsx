import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { getAdminLocale } from '@/shared/lib/admin-locale';
import { AdminNav } from '@/widgets/admin-nav/AdminNav';
import { Badge } from '@/shared/ui/Badge';
import { listProjects } from './actions';
import { DeleteProjectButton } from './DeleteProjectButton';

const OBJECT_TYPE_KEY: Record<string, string> = {
  house: 'objectTypeHouse',
  business: 'objectTypeBusiness',
};

export default async function AdminProjectsPage() {
  const locale = await getAdminLocale();
  const t = await getTranslations({ locale, namespace: 'Admin.projects' });
  const tForm = await getTranslations({ locale, namespace: 'Admin.form' });
  const projects = await listProjects(locale);

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(iso));

  return (
    <>
      <AdminNav />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-navy-800 text-3xl">{t('heading')}</h1>
            <p className="text-muted mt-2 max-w-[58ch] text-sm leading-relaxed">{t('subtitle')}</p>
          </div>
          <Link
            href="/admin/projects/new"
            className="bg-navy-800 hover:bg-navy-700 inline-flex items-center rounded-full px-6 py-3 text-sm font-medium tracking-[-0.01em] text-white transition-colors"
          >
            {t('new')}
          </Link>
        </div>

        {projects.length === 0 ? (
          <p className="text-muted mt-8 text-sm">{t('empty')}</p>
        ) : (
          <div className="border-border mt-8 overflow-x-auto border-y">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-border text-muted border-b text-xs tracking-[0.14em] uppercase">
                  <th className="py-3 pr-4 font-medium">{t('colTitle')}</th>
                  <th className="py-3 pr-4 font-medium">{t('colCapacity')}</th>
                  <th className="py-3 pr-4 font-medium">{t('colType')}</th>
                  <th className="py-3 pr-4 font-medium">{t('colCompleted')}</th>
                  <th className="py-3 pr-4 font-medium">{t('colStatus')}</th>
                  <th className="py-3 font-medium" />
                </tr>
              </thead>
              <tbody className="divide-border divide-y">
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td className="text-navy-800 py-3 pr-4 font-medium">{project.title}</td>
                    <td className="text-muted py-3 pr-4 whitespace-nowrap">
                      {project.capacityKw} kW
                    </td>
                    <td className="text-muted py-3 pr-4">
                      {OBJECT_TYPE_KEY[project.objectType]
                        ? tForm(OBJECT_TYPE_KEY[project.objectType]!)
                        : project.objectType}
                    </td>
                    <td className="text-muted py-3 pr-4 whitespace-nowrap">
                      {formatDate(project.completedAt)}
                    </td>
                    <td className="py-3 pr-4">
                      {project.isPlaceholder ? (
                        <Badge tone="warning">{t('statusPlaceholder')}</Badge>
                      ) : (
                        <Badge tone="positive">{t('statusReal')}</Badge>
                      )}
                    </td>
                    <td className="py-3">
                      <div className="flex justify-end gap-4 whitespace-nowrap">
                        <Link
                          href={`/admin/projects/${project.id}/edit`}
                          className="text-navy-800 hover:text-gold-700 text-sm font-medium transition-colors"
                        >
                          {t('edit')}
                        </Link>
                        <DeleteProjectButton id={project.id} title={project.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
