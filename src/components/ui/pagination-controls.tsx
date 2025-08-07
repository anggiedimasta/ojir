import type { PaginationControlsProps } from "~/entities/api/wallet";
import { Button } from "./button";

export function PaginationControls({
	currentPage,
	totalPages,
	totalCount,
	pageSize,
	onPageChange,
	className = "",
}: PaginationControlsProps) {
	if (totalCount <= pageSize) return null;

	const startItem = currentPage * pageSize + 1;
	const endItem = Math.min((currentPage + 1) * pageSize, totalCount);

	return (
		<div
			className={`flex items-center justify-between border-slate-200 border-t bg-slate-50/50 p-6 ${className}`}
		>
			<div className="text-slate-600 text-sm">
				Showing {startItem} to {endItem} of {totalCount} transactions
			</div>
			<div className="flex items-center gap-2">
				<Button
					onClick={() => onPageChange(Math.max(0, currentPage - 1))}
					disabled={currentPage === 0}
					className="border border-slate-200 bg-white px-4 py-2 text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-50 hover:shadow-md disabled:opacity-50"
				>
					Previous
				</Button>
				<span className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-600 text-sm">
					{currentPage + 1} of {totalPages}
				</span>
				<Button
					onClick={() => onPageChange(currentPage + 1)}
					disabled={currentPage >= totalPages - 1}
					className="border border-slate-200 bg-white px-4 py-2 text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-50 hover:shadow-md disabled:opacity-50"
				>
					Next
				</Button>
			</div>
		</div>
	);
}
