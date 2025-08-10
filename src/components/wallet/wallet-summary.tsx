import { CreditCard, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { SummaryCard } from "~/components/ui/summary-card";
import type { WalletSummaryProps } from "~/entities/api/wallet";

export function WalletSummary({ summary, formatCurrency }: WalletSummaryProps) {
  const netIncome = summary.totalIncome - summary.totalExpense;
  const isNetPositive = netIncome >= 0;

  // Format transaction count with proper number formatting
  const formatTransactionCount = (count: number) => {
    return new Intl.NumberFormat("id-ID").format(count);
  };

  // Custom icon components using Lucide React icons with respective colors
  const IncomeIcon = () => <TrendingUp className="h-6 w-6 text-green-600" />;
  const ExpenseIcon = () => <TrendingDown className="h-6 w-6 text-red-600" />;
  const NetIncomeIcon = () => (
    <Wallet
      className={`h-6 w-6 ${isNetPositive ? "text-green-600" : "text-red-600"}`}
    />
  );
  const TransactionIcon = () => (
    <CreditCard className="h-6 w-6 text-purple-600" />
  );

  return (
    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <SummaryCard
        title="Total Income"
        value={formatCurrency(summary.totalIncome.toString())}
        icon={IncomeIcon}
        gradient="bg-gradient-to-br from-green-50 to-emerald-50"
        borderColor="border-green-200"
        iconBgColor="bg-green-100"
        iconColor="text-green-600"
        valueColor="text-green-800"
        titleColor="text-green-700"
      />

      <SummaryCard
        title="Total Expenses"
        value={formatCurrency(summary.totalExpense.toString())}
        icon={ExpenseIcon}
        gradient="bg-gradient-to-br from-red-50 to-rose-50"
        borderColor="border-red-200"
        iconBgColor="bg-red-100"
        iconColor="text-red-600"
        valueColor="text-red-800"
        titleColor="text-red-700"
      />

      <SummaryCard
        title="Net Income"
        value={formatCurrency(netIncome.toString())}
        icon={NetIncomeIcon}
        gradient={
          isNetPositive
            ? "bg-gradient-to-br from-green-50 to-emerald-50"
            : "bg-gradient-to-br from-red-50 to-rose-50"
        }
        borderColor={isNetPositive ? "border-green-200" : "border-red-200"}
        iconBgColor={isNetPositive ? "bg-green-100" : "bg-red-100"}
        iconColor={isNetPositive ? "text-green-600" : "text-red-600"}
        valueColor={isNetPositive ? "text-green-800" : "text-red-800"}
        titleColor={isNetPositive ? "text-green-700" : "text-red-700"}
      />

      <SummaryCard
        title="Transactions"
        value={formatTransactionCount(summary.transactionCount)}
        icon={TransactionIcon}
        gradient="bg-gradient-to-br from-purple-50 to-violet-50"
        borderColor="border-purple-200"
        iconBgColor="bg-purple-100"
        iconColor="text-purple-600"
        valueColor="text-purple-800"
        titleColor="text-purple-700"
      />
    </div>
  );
}
