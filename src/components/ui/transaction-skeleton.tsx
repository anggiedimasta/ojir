export function TransactionSkeleton() {
	return (
		<div className="animate-pulse p-4">
			{/* Row 1: Main transaction info */}
			<div className="mb-2 flex items-center justify-between">
				<div className="flex flex-1 items-center gap-3">
					<div className="h-9 w-9 flex-shrink-0 rounded-lg bg-slate-200" />
					<div className="min-w-0 flex-1">
						<div className="mb-1 h-5 w-3/4 rounded bg-slate-200" />
					</div>
				</div>
				<div className="h-6 w-20 rounded bg-slate-200" />
			</div>

			{/* Row 2: Badges and metadata */}
			<div className="mb-2 flex items-center justify-between">
				<div className="flex flex-wrap items-center gap-2">
					<div className="h-5 w-16 rounded-full bg-slate-200" />
					<div className="h-5 w-20 rounded-full bg-slate-200" />
					<div className="h-4 w-12 rounded bg-slate-200" />
				</div>
				<div className="flex items-center gap-2">
					<div className="h-5 w-24 rounded-full bg-slate-200" />
					<div className="h-4 w-16 rounded bg-slate-200" />
				</div>
			</div>

			{/* Row 3: Reference numbers and date */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<div className="h-4 w-16 rounded bg-slate-200" />
					<div className="h-4 w-20 rounded bg-slate-200" />
					<div className="h-4 w-24 rounded bg-slate-200" />
				</div>
				<div className="h-4 w-20 rounded bg-slate-200" />
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
