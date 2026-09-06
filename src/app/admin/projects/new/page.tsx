import { AdminNav } from '@/widgets/admin-nav/AdminNav';
import { ProjectForm } from '../ProjectForm';

export default function NewProjectPage() {
  return (
    <>
      <AdminNav />
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-xl font-bold text-gray-900">New project</h1>
        <div className="mt-6">
          <ProjectForm mode="create" />
        </div>
      </div>
    </>
  );
}
