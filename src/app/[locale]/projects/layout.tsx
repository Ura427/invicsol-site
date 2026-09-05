/**
 * Renders the `@modal` parallel-route slot alongside the normal page tree.
 * Only /projects needs this — it's the one place a project can be opened as
 * an overlay (from the gallery) as well as its own full page (direct link,
 * refresh, bookmark).
 */
export default function ProjectsLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
