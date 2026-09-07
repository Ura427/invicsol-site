export function GridSkeleton() {
  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-surface aspect-[4/3] animate-pulse rounded-[var(--radius-lg)]" />
      ))}
    </div>
  );
}
