'use client';

import { useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { deleteProject } from './actions';

export function DeleteProjectButton({ id, title }: { id: string; title: string }) {
  const t = useTranslations('Admin.projects');
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!window.confirm(t('confirmDelete', { title }))) return;
    startTransition(() => {
      void deleteProject(id);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="text-sm font-medium text-red-700 transition-colors hover:text-red-900 disabled:opacity-50"
    >
      {isPending ? t('deleting') : t('delete')}
    </button>
  );
}
