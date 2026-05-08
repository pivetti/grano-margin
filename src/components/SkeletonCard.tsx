export function SkeletonCard() {
  return (
    <div className="rounded-lg border border-[var(--border-soft)] bg-[var(--surface)] p-4">
      <div className="h-3 w-24 animate-pulse rounded-full bg-white/10" />
      <div className="mt-4 h-7 w-36 animate-pulse rounded-md bg-white/10" />
      <div className="mt-3 h-3 w-full animate-pulse rounded-full bg-white/10" />
      <div className="mt-2 h-3 w-3/4 animate-pulse rounded-full bg-white/10" />
    </div>
  );
}
