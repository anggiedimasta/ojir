import { BankIcon } from "./bank-icon";
import { QrCode, Smartphone, ArrowRightLeft, CreditCard, Edit } from "lucide-react";
import { Button } from "./button";
import { WALLET_COLORS } from "~/components/ui/color-picker";
import type { TransactionResponse, TransactionItemProps } from "~/entities/api/wallet";

export function TransactionItem({ transaction, formatCurrency, formatDate, onEdit }: TransactionItemProps) {
  // Helper functions
      const getWalletBadgeClasses = (color: string | null | undefined) => {
    const colorConfig = WALLET_COLORS.find(c => c.value === color);
    if (!colorConfig) {
      return 'bg-slate-100 text-slate-700'; // Default for uncategorized or unknown
    }

    // Extract the base color name from the gradient and create flat semi-transparent colors
    const gradientMatch = colorConfig.gradient.match(/from-(\w+)-(\d+)/);
    if (gradientMatch) {
      const colorName = gradientMatch[1]; // e.g., 'blue'
      // Use light background and darker text for semi-transparent effect
      return `bg-${colorName}-100 text-${colorName}-700`;
    }

    return 'bg-slate-100 text-slate-700'; // Fallback
  };

  const isVirtualAccount = (transaction: TransactionResponse) => {
    // First check if virtualAccountNo is present
    if (transaction.virtualAccountNo && transaction.virtualAccountNo.trim()) {
      return true;
    }
    // Fallback to checking recipient for virtual account patterns
    if (!transaction.recipient) return false;
    return /tokopedia|shopee|bukalapak|blibli|\d{10,}/i.test(transaction.recipient);
  };

  const isInternalTransfer = (recipient: string | null) => {
    if (!recipient) return false;
    return /kartu kredit|credit card|transfer|topup|top up/i.test(recipient);
  };

  const isBIFastTransfer = (transaction: TransactionResponse) => {
    return transaction.transactionType === 'transfer' &&
           transaction.transactionRefNo &&
           transaction.transactionRefNo.includes('BMRI');
  };

  const isQRTransfer = (transaction: TransactionResponse) => {
    return transaction.transactionType === 'transfer' &&
           !isBIFastTransfer(transaction);
  };

  const getTransactionIcon = (transaction: TransactionResponse) => {
    if (isBIFastTransfer(transaction)) {
      return {
        icon: <ArrowRightLeft className="w-5 h-5 text-blue-600" />,
        bgColor: 'bg-blue-50 border-blue-200'
      };
    } else if (isQRTransfer(transaction)) {
      return {
        icon: <QrCode className="w-5 h-5 text-orange-600" />,
        bgColor: 'bg-orange-50 border-orange-200'
      };
    } else if (isInternalTransfer(transaction.recipient)) {
      return {
        icon: <ArrowRightLeft className="w-5 h-5 text-green-600" />,
        bgColor: 'bg-green-50 border-green-200'
      };
    } else if (transaction.qrisRefNo) {
      return {
        icon: <QrCode className="w-5 h-5 text-green-600" />,
        bgColor: 'bg-green-50 border-green-200'
      };
    } else if (isVirtualAccount(transaction)) {
      return {
        icon: <Smartphone className="w-5 h-5 text-purple-600" />,
        bgColor: 'bg-purple-50 border-purple-200'
      };
    } else {
      return {
        icon: <CreditCard className="w-5 h-5 text-slate-600" />,
        bgColor: 'bg-slate-50 border-slate-200'
      };
    }
  };

  const iconData = getTransactionIcon(transaction);

  return (
    <div className="p-4 hover:bg-slate-50/50 transition-all duration-200 group">
      {/* Row 1: Main transaction info */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3 flex-1">
          <div className={`p-2 rounded-lg border ${iconData.bgColor} flex-shrink-0 group-hover:scale-105 transition-transform duration-200`}>
            {iconData.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-slate-900 text-base truncate">
              {isInternalTransfer(transaction.recipient)
                ? `${transaction.recipient?.includes('kredit') ? 'Credit Card Payment' : 'Internal Transfer'}`
                : transaction.recipient
              }
            </h4>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onEdit && (
            <Button
              color="ghost"
              size="sm"
              onClick={() => onEdit(transaction)}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 h-8 w-8"
              title="Edit transaction"
            >
              <Edit className="w-4 h-4 text-slate-500" />
            </Button>
          )}
          <div className="text-right">
            <p className={`text-xl font-bold ${transaction.direction === 'in' ? 'text-green-600' : 'text-red-600'}`}>
              {transaction.direction === 'in' ? '+' : '-'}{formatCurrency(transaction.totalAmount || transaction.amount)}
            </p>
            {/* Show amount and fee if they differ from total */}
            {transaction.totalAmount && parseFloat(transaction.totalAmount) !== parseFloat(transaction.amount) && (
              <p className="text-xs text-slate-600 font-medium">
                Amount: {formatCurrency(transaction.amount)}
              </p>
            )}
            {transaction.fee && parseFloat(transaction.fee) > 0 && (
              <p className="text-xs text-slate-500">
                Fee: {formatCurrency(transaction.fee)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Row 2: Badges and metadata */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          {isBIFastTransfer(transaction) ? (
            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full font-medium">BI Fast Transfer</span>
          ) : isQRTransfer(transaction) ? (
            <span className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded-full font-medium">QR Transfer</span>
          ) : transaction.qrisRefNo ? (
            <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full font-medium">QRIS Payment</span>
          ) : isVirtualAccount(transaction) ? (
            <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full font-medium">Virtual Account</span>
          ) : isInternalTransfer(transaction.recipient) ? (
            <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full font-medium">Internal Transfer</span>
          ) : null}

          {transaction.acquirer && (
            <span className="px-2 py-1 text-xs bg-slate-100 text-slate-700 rounded-full font-medium flex items-center gap-1">
                              <BankIcon bankCode={transaction.acquirer} className="w-3 h-3" />
              {transaction.acquirer}
            </span>
          )}

          {/* New fields: Recipient Bank and Transfer Purpose */}
          {transaction.recipientBank && (
            <span className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full font-medium flex items-center gap-1">
                              <BankIcon bankCode={transaction.recipientBank} className="w-3 h-3" />
              {transaction.recipientBank}
            </span>
          )}

          {transaction.transferPurpose && (
            <span className="px-2 py-1 text-xs bg-teal-100 text-teal-700 rounded-full font-medium">
              {transaction.transferPurpose}
            </span>
          )}

          {transaction.location && (
            <span className="text-xs text-slate-500">{transaction.location}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {transaction.walletName && (
            <span className={`px-2 py-1 text-xs rounded-full font-medium flex items-center gap-1 ${transaction.walletColor ? getWalletBadgeClasses(transaction.walletColor) : 'bg-blue-100 text-blue-700'}`}>
              <div className={`w-3 h-3 rounded flex items-center justify-center overflow-hidden ${transaction.walletColor ? 'bg-current/20' : 'bg-blue-200'}`}>
                <BankIcon bankCode={transaction.walletBankCode || 'unknown'} className="w-full h-full" />
              </div>
              {transaction.walletName === 'Uncategorized' ?
                'Uncategorized' :
                (transaction.walletBankName && transaction.walletType ?
                  `${transaction.walletBankName} ${transaction.walletType.charAt(0).toUpperCase() + transaction.walletType.slice(1)}` :
                  transaction.walletName)
              }
            </span>
          )}

          {transaction.sourceAccount && (
            <span className="font-mono text-xs text-slate-400">
              ****{transaction.sourceAccount.slice(-4)}
            </span>
          )}
        </div>
      </div>

      {/* Row 3: Reference numbers and date */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span>{formatDate(transaction.transactionDate)}</span>
          {transaction.qrisRefNo && (
            <span className="font-mono text-slate-400">QRIS: {transaction.qrisRefNo}</span>
          )}
          {transaction.transactionRefNo && (
            <span className="font-mono text-slate-400">
              {isBIFastTransfer(transaction) ? 'BI Fast Ref: ' : 'Ref: '}{transaction.transactionRefNo}
            </span>
          )}
          {/* Show recipient bank account if available */}
          {transaction.recipientBankAccount && (
            <span className="font-mono text-slate-400">
              To: ****{transaction.recipientBankAccount.slice(-4)}
            </span>
          )}
        </div>

        {transaction.sourceOfFund && (!transaction.walletName || transaction.walletName === 'Uncategorized') && (
          <span className="text-xs text-slate-500">{transaction.sourceOfFund}</span>
        )}
      </div>
    </div>
  );
}