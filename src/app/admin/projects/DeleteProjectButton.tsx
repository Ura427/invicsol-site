'use client';

import { useTransition } from 'react';
import { deleteProject } from './actions';

export function DeleteProjectButton({ id, title }: { id: string; title: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    startTransition(() => {
      void deleteProject(id);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="text-sm font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
    >
      {isPending ? 'Deleting…' : 'Delete'}
    </button>
  );
}
