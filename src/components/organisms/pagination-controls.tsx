import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../atoms/button";
import { cn } from "~/lib/utils";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
}

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
    <div className={cn("flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50/50", className)}>
      <div className="text-sm text-slate-600">
        Showing {startItem} to {endItem} of {totalCount} transactions
      </div>
      <div className="flex items-center gap-2">
        <Button
          onClick={() => onPageChange(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>
        <span className="text-sm text-slate-600 px-4 py-2 bg-white border border-slate-200 rounded-lg">
          {currentPage + 1} of {totalPages}
        </span>
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}