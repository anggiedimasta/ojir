export function TransactionSkeleton() {
  return (
    <div className="p-4 animate-pulse">
      {/* Row 1: Main transaction info */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-9 h-9 bg-slate-200 rounded-lg flex-shrink-0"></div>
          <div className="flex-1 min-w-0">
            <div className="h-5 bg-slate-200 rounded w-3/4 mb-1"></div>
          </div>
        </div>
        <div className="h-6 bg-slate-200 rounded w-20"></div>
      </div>

      {/* Row 2: Badges and metadata */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="h-5 bg-slate-200 rounded-full w-16"></div>
          <div className="h-5 bg-slate-200 rounded-full w-20"></div>
          <div className="h-4 bg-slate-200 rounded w-12"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-5 bg-slate-200 rounded-full w-24"></div>
          <div className="h-4 bg-slate-200 rounded w-16"></div>
        </div>
      </div>

      {/* Row 3: Reference numbers and date */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-4 bg-slate-200 rounded w-16"></div>
          <div className="h-4 bg-slate-200 rounded w-20"></div>
          <div className="h-4 bg-slate-200 rounded w-24"></div>
        </div>
        <div className="h-4 bg-slate-200 rounded w-20"></div>
      </div>
    </div>
  );
}

export function TransactionListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="divide-y divide-slate-100">
      {Array.from({ length: count }).map((_, index) => (
        <TransactionSkeleton key={index} />
      ))}
    </div>
  );
}