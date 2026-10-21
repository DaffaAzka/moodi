export default function UsersLoading() {
  return (
    <main className="min-w-0 flex-1 px-4 pb-24 py-8 sm:px-6 lg:px-10 lg:pb-8">
      <div className="mx-auto max-w-6xl space-y-6 animate-pulse">
        <div>
          <div className="h-9 w-64 bg-muted border-2 border-border" />
          <div className="mt-2 h-4 w-96 max-w-full bg-muted/60" />
        </div>

        {/* Stat Cards Skeleton */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              className="h-24 border-2 border-border bg-card p-4 shadow-[3px_3px_0_var(--border)]"
              key={i}
            />
          ))}
        </div>

        {/* Table Skeleton */}
        <div className="h-96 border-2 border-border bg-card shadow-[4px_4px_0_var(--border)]" />
      </div>
    </main>
  );
}
