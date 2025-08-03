import { RefreshCw, Plus, Trash2 } from "lucide-react";
import { Button } from "../atoms/button";
import { Icon } from "../atoms/icon";
import { cn } from "~/lib/utils";

interface WalletHeaderProps {
  onSync: () => void;
  onClear: () => void;
  isLoading: boolean;
  isSyncPending: boolean;
  isClearPending: boolean;
  hasWallets?: boolean;
}

export function WalletHeader({
  onSync,
  onClear,
  isLoading,
  isSyncPending,
  isClearPending,
  hasWallets = true,
}: WalletHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Wallet Dashboard
          </h1>
          <p className="text-slate-600 mt-2 text-lg">Track your transactions from bank emails</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={onSync}
            disabled={isLoading || isSyncPending || !hasWallets}
            variant="outline"
            className={cn(
              "flex items-center gap-2",
              !hasWallets && "opacity-50 cursor-not-allowed"
            )}
            title={!hasWallets ? "Create at least one wallet to enable email sync" : undefined}
          >
            <Icon
              icon={RefreshCw}
              size="sm"
              className={cn((isLoading || isSyncPending) ? 'animate-spin' : '')}
            />
            Sync Emails
          </Button>
          <Button
            onClick={onClear}
            disabled={isClearPending}
            variant="outline"
            className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
          >
            <Icon icon={Trash2} size="sm" />
            Clear All
          </Button>
          <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
            <Icon icon={Plus} size="sm" />
            Add Transaction
          </Button>
        </div>
      </div>
    </div>
  );
}