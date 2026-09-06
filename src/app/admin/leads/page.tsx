import { AdminNav } from '@/widgets/admin-nav/AdminNav';
import { LeadsInboxClient } from './LeadsInboxClient';

export default function AdminLeadsPage() {
  return (
    <>
      <AdminNav />
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-xl font-bold text-gray-900">Leads</h1>
        <p className="mt-1 text-sm text-gray-500">
          Every calculator, contact form, and callback submission, newest first.
        </p>
        <div className="mt-6">
          <LeadsInboxClient />
        </div>
      </div>
    </>
  );
}
