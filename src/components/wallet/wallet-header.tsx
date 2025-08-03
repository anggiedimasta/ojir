import { AlertCircle } from "lucide-react";
import type { WalletHeaderProps } from "~/entities/api/wallet";

export function WalletHeader({
  hasWallets = true,
}: WalletHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-end mb-4">
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