'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';
import { useRouter } from '@/i18n/navigation';

interface ProjectModalProps {
  children: ReactNode;
}

/**
 * Shell for the intercepted /projects/[slug] route. Clicking a project card
 * from the gallery renders this over the gallery (client-side navigation only
 * — see @modal/(.)[slug]/page.tsx); refreshing that same URL, or opening it
 * from a bookmark or shared link, serves the real /projects/[slug]/page.tsx
 * instead, because interception only fires for in-app navigation.
 *
 * Built on native <dialog>, same as CallbackModal, for the same reason: Escape,
 * focus trapping, and focus restore come from the browser. Closing it — the X
 * button, the backdrop, or Escape — calls router.back() rather than toggling
 * local state, because "closed" here means "return to the gallery URL," not
 * just hiding an element.
 */
export function ProjectModal({ children }: ProjectModalProps) {
  const t = useTranslations('Projects');
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
  }, []);

  function handleClose() {
    router.back();
  }

  return (
    <dialog
      ref={dialogRef}
      aria-label={t('pageTitle')}
      onClose={handleClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) handleClose();
      }}
      className="project-modal-dialog w-full max-w-2xl rounded-2xl bg-white p-6 sm:p-8"
    >
      <button
        type="button"
        onClick={handleClose}
        aria-label={t('backToProjects')}
        className="text-muted hover:text-navy-800 absolute top-4 right-4 z-10"
      >
        <X className="h-6 w-6" aria-hidden />
      </button>

      <div className="max-h-[80vh] overflow-y-auto">{children}</div>
    </dialog>
  );
}
