export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div
        className="border-border border-t-gold-500 h-10 w-10 animate-spin rounded-full border-4"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}
