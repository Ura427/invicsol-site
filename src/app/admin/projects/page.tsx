import Link from 'next/link';
import { AdminNav } from '@/widgets/admin-nav/AdminNav';
import { listProjects } from './actions';
import { DeleteProjectButton } from './DeleteProjectButton';

export default async function AdminProjectsPage() {
  const projects = await listProjects();

  return (
    <>
      <AdminNav />
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Projects</h1>
            <p className="mt-1 text-sm text-gray-500">
              What shows in the public gallery at /projects.
            </p>
          </div>
          <Link
            href="/admin/projects/new"
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white"
          >
            New project
          </Link>
        </div>

        <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs tracking-wide text-gray-500 uppercase">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Capacity</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Completed</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {projects.map((project) => (
                <tr key={project.id}>
                  <td className="px-4 py-3 font-medium text-gray-900">{project.title}</td>
                  <td className="px-4 py-3 text-gray-500">{project.capacityKw} kW</td>
                  <td className="px-4 py-3 text-gray-500">{project.objectType}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' }).format(
                      new Date(project.completedAt),
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {project.isPlaceholder ? (
                      <span className="text-amber-600">Placeholder</span>
                    ) : (
                      <span className="text-green-700">Real</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-4">
                      <Link
                        href={`/admin/projects/${project.id}/edit`}
                        className="text-sm font-medium text-gray-700 hover:text-gray-900"
                      >
                        Edit
                      </Link>
                      <DeleteProjectButton id={project.id} title={project.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {projects.length === 0 ? (
            <p className="px-4 py-6 text-sm text-gray-500">No projects yet.</p>
          ) : null}
        </div>
      </div>
    </>
  );
}
