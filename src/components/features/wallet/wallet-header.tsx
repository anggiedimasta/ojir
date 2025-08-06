import { AlertCircle, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import type { WalletHeaderProps } from "~/entities/api/wallet";

export function WalletHeader({
  hasWallets = true,
  selectedWalletIds = [],
  wallets = [],
  onClearSelection,
}: WalletHeaderProps) {
  const selectedWallets = wallets.filter(wallet => selectedWalletIds.includes(wallet.id));
  const isAllWalletsSelected = selectedWalletIds.length === wallets.length && wallets.length > 0;

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-900">Wallet Management</h1>

        {/* Selected wallets indicator */}
        {selectedWalletIds.length > 0 ? (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-slate-600">
              {isAllWalletsSelected
                ? "Showing transactions from all wallets"
                : `Showing transactions from ${selectedWalletIds.length} selected wallet${selectedWalletIds.length > 1 ? 's' : ''}`
              }
            </span>
            {!isAllWalletsSelected && (
              <Button
                color="ghost"
                size="sm"
                onClick={onClearSelection}
                className="h-6 px-2 text-xs text-slate-500 hover:text-slate-700"
              >
                <X className="w-3 h-3 mr-1" />
                Clear
              </Button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-slate-500">
              No wallets selected - select wallets to view transactions
            </span>
            <Button
              color="ghost"
              size="sm"
              onClick={onClearSelection}
              className="h-6 px-2 text-xs text-slate-500 hover:text-slate-700"
            >
              Select All
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        {!hasWallets && (
          <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>Create a wallet to sync emails</span>
          </div>
        )}
      </div>
    </div>
  );
}