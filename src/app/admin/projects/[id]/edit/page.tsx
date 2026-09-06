import { notFound } from 'next/navigation';
import { AdminNav } from '@/widgets/admin-nav/AdminNav';
import { getProjectForEdit } from '../../actions';
import { ProjectForm } from '../../ProjectForm';

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const initialValues = await getProjectForEdit(id);
  if (!initialValues) notFound();

  return (
    <>
      <AdminNav />
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-xl font-bold text-gray-900">Edit project</h1>
        <div className="mt-6">
          <ProjectForm mode="edit" projectId={id} initialValues={initialValues} />
        </div>
      </div>
    </>
  );
}
