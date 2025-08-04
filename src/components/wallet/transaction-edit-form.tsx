"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/atoms/input";
import { Label } from "~/components/atoms/label";
import { SelectInput } from "~/components/molecules/select-input";
import { DateInput } from "~/components/molecules/date-input";
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalFooter, ModalCloseButton } from "~/components/ui/modal";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";
import type { TransactionResponse } from "~/entities/api/wallet";

// Form validation schema
const transactionEditSchema = z.object({
  recipient: z.string().min(1, "Recipient is required"),
  location: z.string().optional(),
  amount: z.string().min(1, "Amount is required").refine(
    (val) => /^\d+(\.\d{1,2})?$/.test(val),
    "Invalid amount format"
  ),
  fee: z.string().optional().refine(
    (val) => !val || /^\d+(\.\d{1,2})?$/.test(val),
    "Invalid fee format"
  ),
  totalAmount: z.string().optional().refine(
    (val) => !val || /^\d+(\.\d{1,2})?$/.test(val),
    "Invalid total amount format"
  ),
  currency: z.string().min(1, "Currency is required"),
  transactionDate: z.date(),
  direction: z.enum(["in", "out"]),
  walletId: z.string().min(1, "Wallet is required"),
  recipientBank: z.string().optional(),
  recipientBankAccount: z.string().optional(),
  transferPurpose: z.string().optional(),
  description: z.string().optional(),
});

type TransactionEditFormData = z.infer<typeof transactionEditSchema>;

interface TransactionEditFormProps {
  transaction: TransactionResponse | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function TransactionEditForm({ transaction, isOpen, onClose, onSuccess }: TransactionEditFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get user wallets for the wallet selector
  const { data: wallets = [] } = api.wallet.getWallets.useQuery();

  // Update transaction mutation
  const updateTransactionMutation = api.wallet.updateTransaction.useMutation({
    onSuccess: () => {
      toast({
        title: "Transaction Updated",
        description: "Transaction has been updated successfully.",
      });
      onSuccess?.();
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Failed to Update Transaction",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TransactionEditFormData>({
    resolver: zodResolver(transactionEditSchema),
    defaultValues: {
      recipient: "",
      location: "",
      amount: "",
      fee: "",
      totalAmount: "",
      currency: "IDR",
      transactionDate: new Date(),
      direction: "out",
      walletId: "",
      recipientBank: "",
      recipientBankAccount: "",
      transferPurpose: "",
      description: "",
    },
  });

  // Reset form when transaction changes
  useEffect(() => {
    if (transaction) {
      reset({
        recipient: transaction.recipient || "",
        location: transaction.location || "",
        amount: transaction.amount,
        fee: transaction.fee || "",
        totalAmount: transaction.totalAmount || "",
        currency: transaction.currency,
        transactionDate: new Date(transaction.transactionDate),
        direction: transaction.direction as "in" | "out",
        walletId: transaction.walletId,
        recipientBank: transaction.recipientBank || "",
        recipientBankAccount: transaction.recipientBankAccount || "",
        transferPurpose: transaction.transferPurpose || "",
        description: transaction.description || "",
      });
    }
  }, [transaction, reset]);

  const onSubmit = async (data: TransactionEditFormData) => {
    if (!transaction) return;

    setIsSubmitting(true);
    try {
      await updateTransactionMutation.mutateAsync({
        id: transaction.id,
        ...data,
        amount: parseFloat(data.amount),
        fee: data.fee ? parseFloat(data.fee) : undefined,
        totalAmount: data.totalAmount ? parseFloat(data.totalAmount) : undefined,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const walletOptions = wallets.map(wallet => ({
    value: wallet.id,
    label: wallet.name,
  }));

  const directionOptions = [
    { value: "in", label: "Income" },
    { value: "out", label: "Expense" },
  ];

  const currencyOptions = [
    { value: "IDR", label: "IDR (Indonesian Rupiah)" },
    { value: "USD", label: "USD (US Dollar)" },
    { value: "EUR", label: "EUR (Euro)" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title="Edit Transaction"
      description="Update your transaction details"
    >
             <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
         {/* Transaction Overview Section */}
         <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
           <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                 <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                 </svg>
               </div>
               <div>
                 <h3 className="text-sm font-semibold text-gray-900">Transaction Details</h3>
                 <p className="text-xs text-gray-600">Update the basic information for this transaction</p>
               </div>
             </div>

             {/* Type Selection - Icon Only */}
             <div className="flex gap-1">
               <button
                 type="button"
                 onClick={() => setValue("direction", "in")}
                 className={`p-2 rounded-lg border-2 transition-all duration-200 ${
                   watch("direction") === "in"
                     ? "border-green-500 bg-green-50 text-green-700"
                     : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                 }`}
                 title="Income"
               >
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                 </svg>
               </button>
               <button
                 type="button"
                 onClick={() => setValue("direction", "out")}
                 className={`p-2 rounded-lg border-2 transition-all duration-200 ${
                   watch("direction") === "out"
                     ? "border-red-500 bg-red-50 text-red-700"
                     : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                 }`}
                 title="Expense"
               >
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                 </svg>
               </button>
             </div>
           </div>

                     <div className="space-y-4">
             {/* Recipient */}
             <div>
               <Label htmlFor="recipient" className="text-gray-700 font-medium text-sm">Recipient *</Label>
               <Input
                 id="recipient"
                 {...register("recipient")}
                 placeholder="Who received or sent this transaction?"
                 className={`mt-1.5 ${errors.recipient ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"}`}
               />
               {errors.recipient && (
                 <p className="text-sm text-red-500 mt-1.5 flex items-center gap-1">
                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                   </svg>
                   {errors.recipient.message}
                 </p>
               )}
             </div>

             {/* Amount and Date */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
               <div>
                 <Label htmlFor="amount" className="text-gray-700 font-medium text-sm">Amount *</Label>
                 <div className="mt-1.5 relative">
                   <Input
                     id="amount"
                     {...register("amount")}
                     placeholder="0.00"
                     className={`pr-12 ${errors.amount ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"}`}
                   />
                   <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm font-medium">
                     {watch("currency") || "IDR"}
                   </div>
                 </div>
                 {errors.amount && (
                   <p className="text-sm text-red-500 mt-1.5 flex items-center gap-1">
                     <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                       <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                     </svg>
                     {errors.amount.message}
                   </p>
                 )}
               </div>

               <div>
                 <Label htmlFor="transactionDate" className="text-gray-700 font-medium text-sm">Date *</Label>
                 <div className="mt-1.5">
                   <DateInput
                     value={watch("transactionDate")}
                     onChange={(date) => setValue("transactionDate", date)}
                     placeholder="Select date"
                   />
                 </div>
               </div>
             </div>

             {/* Fee and Total Amount */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
               <div>
                 <Label htmlFor="fee" className="text-gray-700 font-medium text-sm">Fee</Label>
                 <div className="mt-1.5 relative">
                   <Input
                     id="fee"
                     {...register("fee")}
                     placeholder="0.00"
                     className={`pr-12 ${errors.fee ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"}`}
                   />
                   <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm font-medium">
                     {watch("currency") || "IDR"}
                   </div>
                 </div>
                 {errors.fee && (
                   <p className="text-sm text-red-500 mt-1.5 flex items-center gap-1">
                     <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                       <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                     </svg>
                     {errors.fee.message}
                   </p>
                 )}
               </div>

               <div>
                 <Label htmlFor="totalAmount" className="text-gray-700 font-medium text-sm">Total Amount</Label>
                 <div className="mt-1.5 relative">
                   <Input
                     id="totalAmount"
                     {...register("totalAmount")}
                     placeholder="0.00"
                     className={`pr-12 ${errors.totalAmount ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"}`}
                   />
                   <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm font-medium">
                     {watch("currency") || "IDR"}
                   </div>
                 </div>
                 {errors.totalAmount && (
                   <p className="text-sm text-red-500 mt-1.5 flex items-center gap-1">
                     <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                       <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                     </svg>
                     {errors.totalAmount.message}
                   </p>
                 )}
               </div>
             </div>
           </div>
        </div>

                 {/* Additional Details Section */}
         <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-5 border border-slate-100">
           <div className="flex items-center gap-3 mb-4">
             <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
               <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
               </svg>
             </div>
             <div>
               <h3 className="text-sm font-semibold text-gray-900">Additional Details</h3>
               <p className="text-xs text-gray-600">Add more context to your transaction</p>
             </div>
           </div>

           <div className="space-y-4">
             {/* Location and Wallet */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
               <div>
                 <Label htmlFor="location" className="text-gray-700 font-medium text-sm">Location</Label>
                 <div className="mt-1.5">
                   <Input
                     id="location"
                     {...register("location")}
                     placeholder="Where did this happen?"
                     className="focus:ring-blue-500"
                   />
                 </div>
               </div>

               <div>
                 <Label htmlFor="walletId" className="text-gray-700 font-medium text-sm">Wallet *</Label>
                 <div className="mt-1.5">
                   <SelectInput
                     value={watch("walletId")}
                     onChange={(value) => setValue("walletId", value)}
                     options={walletOptions}
                     placeholder="Select wallet"
                   />
                 </div>
               </div>
             </div>

             {/* Recipient Bank and Account */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
               <div>
                 <Label htmlFor="recipientBank" className="text-gray-700 font-medium text-sm">Recipient Bank</Label>
                 <div className="mt-1.5">
                   <Input
                     id="recipientBank"
                     {...register("recipientBank")}
                     placeholder="e.g., BCA, Mandiri, BNI"
                     className="focus:ring-blue-500"
                   />
                 </div>
               </div>

               <div>
                 <Label htmlFor="recipientBankAccount" className="text-gray-700 font-medium text-sm">Recipient Account</Label>
                 <div className="mt-1.5">
                   <Input
                     id="recipientBankAccount"
                     {...register("recipientBankAccount")}
                     placeholder="Account number"
                     className="focus:ring-blue-500"
                   />
                 </div>
               </div>
             </div>

             {/* Transfer Purpose */}
             <div>
               <Label htmlFor="transferPurpose" className="text-gray-700 font-medium text-sm">Transfer Purpose</Label>
               <div className="mt-1.5">
                 <Input
                   id="transferPurpose"
                   {...register("transferPurpose")}
                   placeholder="e.g., Wealth Transfer, Payment, etc."
                   className="focus:ring-blue-500"
                 />
               </div>
             </div>

             {/* Description */}
             <div>
               <Label htmlFor="description" className="text-gray-700 font-medium text-sm">Description</Label>
               <div className="mt-1.5">
                 <Input
                   id="description"
                   {...register("description")}
                   placeholder="Add any additional notes about this transaction..."
                   className="focus:ring-blue-500"
                 />
               </div>
             </div>
           </div>
        </div>

        <ModalFooter>
          <div className="flex gap-3 w-full">
            <Button
              type="button"
              color="gray"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              color="blue"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Update Transaction
                </div>
              )}
            </Button>
          </div>
        </ModalFooter>
      </form>
    </Modal>
  );
}