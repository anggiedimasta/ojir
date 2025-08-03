import { Button } from "./button";
import type { PaginationControlsProps } from "~/entities/api/wallet";

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
    <div className={`flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50/50 ${className}`}>
      <div className="text-sm text-slate-600">
        Showing {startItem} to {endItem} of {totalCount} transactions
      </div>
      <div className="flex items-center gap-2">
        <Button
          onClick={() => onPageChange(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
          className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50"
        >
          Previous
        </Button>
        <span className="text-sm text-slate-600 px-4 py-2 bg-white border border-slate-200 rounded-lg">
          {currentPage + 1} of {totalPages}
        </span>
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50"
        >
          Next
        </Button>
      </div>
    </div>
  );
}