import { BankIcon } from "./bank-icon";
import { QrCode, Smartphone, ArrowRightLeft, CreditCard } from "lucide-react";
import type { TransactionResponse, TransactionItemProps } from "~/entities/api/wallet";

export function TransactionItem({ transaction, formatCurrency, formatDate }: TransactionItemProps) {
  // Helper functions
  const isVirtualAccount = (recipient: string | null) => {
    if (!recipient) return false;
    return /tokopedia|shopee|bukalapak|blibli|\d{10,}/i.test(recipient);
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
    } else if (isVirtualAccount(transaction.recipient)) {
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
    <div className="p-6 hover:bg-slate-50/50 transition-all duration-200 group">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div className={`p-3 rounded-xl border ${iconData.bgColor} flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}>
            {iconData.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <h4 className="font-semibold text-slate-900 text-lg">
                {isInternalTransfer(transaction.recipient)
                  ? `${transaction.recipient?.includes('kredit') ? 'Credit Card Payment' : 'Internal Transfer'}`
                  : transaction.recipient
                }
              </h4>
              {isInternalTransfer(transaction.recipient) && (
                <span className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full font-medium">
                  Transfer
                </span>
              )}
            </div>
            <div className="text-sm text-slate-600 space-y-2">
              {isInternalTransfer(transaction.recipient) && (
                <p className="text-slate-600 font-medium">
                  To: {transaction.recipient}
                </p>
              )}
              {/* Bank/Method Badge */}
              <div className="flex items-center gap-2 flex-wrap">
                {isBIFastTransfer(transaction) ? (
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full font-medium">
                      BI Fast Transfer
                    </span>
                    {transaction.location && (
                      <span className="px-3 py-1 text-xs bg-slate-100 text-slate-700 rounded-full font-medium flex items-center gap-1">
                        <BankIcon bankName={transaction.location} className="w-3 h-3" />
                        {transaction.location}
                      </span>
                    )}
                  </div>
                ) : isQRTransfer(transaction) ? (
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 text-xs bg-orange-100 text-orange-700 rounded-full font-medium">
                      QR Transfer
                    </span>
                    {transaction.location && (
                      <span className="px-3 py-1 text-xs bg-slate-100 text-slate-700 rounded-full font-medium flex items-center gap-1">
                        <BankIcon bankName={transaction.location} className="w-3 h-3" />
                        {transaction.location}
                      </span>
                    )}
                  </div>
                ) : transaction.qrisRefNo ? (
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full font-medium">
                      QRIS Payment
                    </span>
                    {transaction.acquirer && (
                      <span className="px-3 py-1 text-xs bg-slate-100 text-slate-700 rounded-full font-medium flex items-center gap-1">
                        <BankIcon bankName={transaction.acquirer} className="w-3 h-3" />
                        {transaction.acquirer}
                      </span>
                    )}
                  </div>
                ) : isVirtualAccount(transaction.recipient) ? (
                  <span className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full font-medium">
                    Virtual Account
                  </span>
                ) : isInternalTransfer(transaction.recipient) ? (
                  <span className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full font-medium">
                    Internal Transfer
                  </span>
                ) : transaction.acquirer ? (
                  <span className="px-3 py-1 text-xs bg-slate-100 text-slate-700 rounded-full font-medium flex items-center gap-1">
                    <BankIcon bankName={transaction.acquirer} className="w-3 h-3" />
                    {transaction.acquirer}
                  </span>
                ) : null}
              </div>
              <p className="text-slate-500">
                {isBIFastTransfer(transaction) && transaction.location ? (
                  <span className="flex items-center gap-1">
                    <BankIcon bankName={transaction.location} className="w-3 h-3" />
                    {transaction.location}
                  </span>
                ) : (
                  transaction.location
                )}
              </p>
              <p className="text-slate-500">{formatDate(transaction.transactionDate)}</p>
              {transaction.virtualAccountNo && (
                <p className="font-mono text-xs text-slate-400">VA: {transaction.virtualAccountNo}</p>
              )}
              {transaction.qrisRefNo && (
                <p className="font-mono text-xs text-slate-400">QRIS: {transaction.qrisRefNo}</p>
              )}
              {transaction.transactionRefNo && (
                <p className="font-mono text-xs text-slate-400">
                  {isBIFastTransfer(transaction) ? 'BI Fast Ref: ' : 'Ref: '}{transaction.transactionRefNo}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="text-right flex-shrink-0 ml-6">
          <p className={`text-2xl font-bold mb-3 ${transaction.direction === 'in' ? 'text-green-600' : 'text-red-600'}`}>
            {transaction.direction === 'in' ? '+' : '-'}{formatCurrency(transaction.amount.toString())}
          </p>
          <div className="text-sm text-slate-600 space-y-2">
            {/* Wallet Badge */}
            {transaction.walletName && (
              <div className="flex items-center justify-end">
                <span className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full font-medium flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-blue-200 flex items-center justify-center overflow-hidden">
                    <BankIcon bankName={transaction.walletBankCode || 'unknown'} className="w-full h-full" />
                  </div>
                  {transaction.walletName === 'Uncategorized' ?
                    'Uncategorized' :
                    (transaction.walletBankName && transaction.walletType ?
                      `${transaction.walletBankName} ${transaction.walletType.charAt(0).toUpperCase() + transaction.walletType.slice(1)}` :
                      transaction.walletName)
                  }
                </span>
              </div>
            )}
            <p className="text-right font-medium">{transaction.sourceAccount}</p>
            {transaction.sourceOfFund && (
              <p className="text-xs text-right text-slate-500">{transaction.sourceOfFund}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}