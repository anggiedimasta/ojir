import { SortAsc, SortDesc } from "lucide-react";
import { SearchInput } from "../molecules/search-input";
import { SelectInput } from "../molecules/select-input";
import { IconButton } from "../molecules/icon-button";
import { cn } from "~/lib/utils";
import type { SortByType, SortOrderType } from "~/entities/api/wallet";

interface SearchAndSortProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  sortBy: SortByType;
  sortOrder: SortOrderType;
  onSortByChange: (sortBy: SortByType) => void;
  onSortOrderChange: (sortOrder: SortOrderType) => void;
  className?: string;
}

export function SearchAndSort({
  searchQuery,
  onSearchQueryChange,
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderChange,
  className,
}: SearchAndSortProps) {
  const sortOptions = [
    { value: 'date', label: 'Sort by Date' },
    { value: 'amount', label: 'Sort by Amount' },
    { value: 'recipient', label: 'Sort by Recipient' },
  ];

  return (
    <div className={cn("flex gap-2 items-center", className)}>
      <SearchInput
        value={searchQuery}
        onChange={onSearchQueryChange}
        placeholder="Search transactions..."
      />

      <SelectInput
        value={sortBy}
        onChange={(value) => onSortByChange(value as SortByType)}
        options={sortOptions}
        className="w-40"
      />

      <IconButton
        icon={sortOrder === 'asc' ? SortAsc : SortDesc}
        onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
        variant="outline"
        size="sm"
        title={sortOrder === 'asc' ? 'Sort Descending' : 'Sort Ascending'}
      />
    </div>
  );
}