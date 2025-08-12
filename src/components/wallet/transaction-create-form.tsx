"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "~/components/atoms/input";
import { Label } from "~/components/atoms/label";
import { DateInput } from "~/components/molecules/date-input";
import { SelectInput } from "~/components/molecules/select-input";
import { Button } from "~/components/ui/button";
import { Modal, ModalFooter } from "~/components/ui/modal";
import { PaymentMethodDropdown } from "~/components/ui/payment-method-dropdown";
import { useToast } from "~/components/ui/use-toast";
import { CategoryFilter } from "~/components/wallet/category-filter";
import { useNumberFormat } from "~/hooks/use-number-format";
import { api } from "~/trpc/react";

// Form validation schema matching the database schema
const transactionCreateSchema = z.object({
  recipient: z.string().min(1, "Recipient is required"),
  location: z.string().optional(),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => /^\d+(\.\d{1,2})?$/.test(val), "Invalid amount format"),
  fee: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d+(\.\d{1,2})?$/.test(val),
      "Invalid fee format",
    ),
  totalAmount: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d+(\.\d{1,2})?$/.test(val),
      "Invalid total amount format",
    ),
  currency: z.string().min(1, "Currency is required"),
  transactionDate: z.date(),
  direction: z.enum(["in", "out"]),
  walletId: z.string().min(1, "Wallet is required"),
  categoryId: z.string().optional(),
  subcategoryId: z.string().optional(),
  recipientBank: z.string().optional(),
  recipientBankAccount: z.string().optional(),
  transferPurpose: z.string().optional(),
  transactionType: z.string().optional(),
  // Fields that exist in the database
  transactionRefNo: z.string().optional(),
  qrisRefNo: z.string().optional(),
  merchantPan: z.string().optional(),
  customerPan: z.string().optional(),
  acquirer: z.string().optional(),
  terminalId: z.string().optional(),
  sourceOfFund: z.string().optional(),
  sourceAccount: z.string().optional(),
  bankSender: z.string().optional(),
  emailSubject: z.string().optional(),
  status: z.string().default("completed"),
});

type TransactionCreateFormData = z.infer<typeof transactionCreateSchema>;

interface TransactionCreateFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  wallets: Array<{ id: string; name: string }>;
}

export function TransactionCreateForm({
  isOpen,
  onClose,
  onSuccess,
  wallets,
}: TransactionCreateFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dateValue, setDateValue] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<
    string | null
  >(null);

  // Use the number formatting composable hooks
  const amountFormatter = useNumberFormat();
  const feeFormatter = useNumberFormat();

  // Get categories and subcategories
  const { data: categories = [] } = api.category.getCategories.useQuery();
  const { data: subcategories = [] } = api.category.getSubcategories.useQuery();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TransactionCreateFormData>({
    resolver: zodResolver(transactionCreateSchema),
    defaultValues: {
      recipient: "",
      location: "",
      amount: "",
      fee: "",
      totalAmount: "",
      currency: "IDR",
      transactionDate: new Date(),
      direction: "out",
      walletId: wallets[0]?.id || "",
      categoryId: undefined,
      subcategoryId: undefined,
      recipientBank: "",
      recipientBankAccount: "",
      transferPurpose: "",
      transactionType: "",
      transactionRefNo: "",
      qrisRefNo: "",
      merchantPan: "",
      customerPan: "",
      acquirer: "",
      terminalId: "",
      sourceOfFund: "",
      sourceAccount: "",
      bankSender: "",
      emailSubject: "",
      status: "completed",
    },
  });

  // Reset form when modal opens/closes
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (isOpen) {
      reset({
        recipient: "",
        location: "",
        amount: "",
        fee: "",
        totalAmount: "",
        currency: "IDR",
        transactionDate: new Date(),
        direction: "out",
        walletId: wallets[0]?.id || "",
        categoryId: undefined,
        subcategoryId: undefined,
        recipientBank: "",
        recipientBankAccount: "",
        transferPurpose: "",
        transactionType: "",
        transactionRefNo: "",
        qrisRefNo: "",
        merchantPan: "",
        customerPan: "",
        acquirer: "",
        terminalId: "",
        sourceOfFund: "",
        sourceAccount: "",
        bankSender: "",
        emailSubject: "",
        status: "completed",
      });
      setDateValue(new Date().toISOString().split("T")[0]);
      setSelectedCategoryId(null);
      setSelectedSubcategoryId(null);

      // Reset formatters without dependencies
      amountFormatter.setFormattedValue("");
      feeFormatter.setFormattedValue("");
    }
  }, [isOpen, reset, wallets]);

  // Auto-set recipient to "me" when direction is "in"
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (watch("direction") === "in") {
      setValue("recipient", "me");
    }
  }, [watch("direction"), setValue]);

  // Handle amount change with formatting
  const handleAmountChange = useCallback(
    (value: string) => {
      amountFormatter.handleInputChange(value, (cleanValue) => {
        setValue("amount", cleanValue);
      });
    },
    [amountFormatter, setValue],
  );

  // Handle fee change with formatting
  const handleFeeChange = useCallback(
    (value: string) => {
      feeFormatter.handleInputChange(value, (cleanValue) => {
        setValue("fee", cleanValue);
      });
    },
    [feeFormatter, setValue],
  );

  // Handle category change and sync with form
  const handleCategoryChange = useCallback(
    (categoryId: string | null) => {
      setSelectedCategoryId(categoryId);
      setValue("categoryId", categoryId || undefined);
      setValue("subcategoryId", undefined);
      setSelectedSubcategoryId(null);
    },
    [setValue],
  );

  // Handle subcategory change and sync with form
  const handleSubcategoryChange = useCallback(
    (subcategoryId: string | null) => {
      setSelectedSubcategoryId(subcategoryId);
      setValue("subcategoryId", subcategoryId || undefined);
    },
    [setValue],
  );

  const onSubmit = async (data: TransactionCreateFormData) => {
    try {
      setIsSubmitting(true);

      // TODO: Implement transaction creation API call
      console.log("Creating transaction:", data);

      toast({
        title: "Transaction Created",
        description: "Your transaction has been successfully created.",
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error creating transaction:", error);
      toast({
        title: "Error",
        description: "Failed to create transaction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const walletOptions = wallets.map((wallet) => ({
    value: wallet.id,
    label: wallet.name,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title="Create New Transaction"
      description="Add a new transaction to your wallet"
      closeOnEscape={false}
      closeOnOverlayClick={false}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Transaction Overview Section */}
        <div className="rounded-xl border border-green-100 bg-gradient-to-r from-green-50 to-emerald-50 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-4 w-4 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  role="img"
                  aria-label="Create"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">
                  Transaction Details
                </h3>
                <p className="text-gray-600 text-xs">
                  Enter the basic information for your new transaction
                </p>
              </div>
            </div>

            {/* Type Selection - Icon Only */}
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setValue("direction", "in")}
                className={`rounded-lg border-2 p-2 transition-all duration-200 ${
                  watch("direction") === "in"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
                title="Income"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  role="img"
                  aria-label="Income"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 13l-5 5m0 0l-5-5m5 5V6"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setValue("direction", "out")}
                className={`rounded-lg border-2 p-2 transition-all duration-200 ${
                  watch("direction") === "out"
                    ? "border-red-500 bg-red-50 text-red-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
                title="Expense"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  role="img"
                  aria-label="Expense"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 11l5-5m0 0l5 5m-5-5v12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {/* Amount and Payment Method - Side by side for incoming transactions */}
            {watch("direction") === "in" && (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                  <Label
                    htmlFor="amount"
                    className="font-medium text-gray-700 text-sm"
                  >
                    Amount *
                  </Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="amount"
                      value={amountFormatter.formattedValue}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      placeholder="0"
                      className={`pr-12 ${errors.amount ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"}`}
                    />
                    <div className="-translate-y-1/2 absolute top-1/2 right-3 transform font-medium text-gray-400 text-sm">
                      IDR
                    </div>
                  </div>
                  {errors.amount && (
                    <p className="mt-1.5 flex items-center gap-1 text-red-500 text-sm">
                      <svg
                        className="h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        role="img"
                        aria-label="Error"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.amount.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="font-medium text-gray-700 text-sm">
                    Payment Method
                  </Label>
                  <div className="mt-1.5">
                    <PaymentMethodDropdown
                      value={watch("transactionType")}
                      onChange={(value) => setValue("transactionType", value)}
                      placeholder="Select payment method"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Payment Method - Full width for outgoing transactions */}
            {watch("direction") === "out" && (
              <div>
                <Label className="font-medium text-gray-700 text-sm">
                  Payment Method
                </Label>
                <div className="mt-1.5">
                  <PaymentMethodDropdown
                    value={watch("transactionType")}
                    onChange={(value) => setValue("transactionType", value)}
                    placeholder="Select payment method"
                  />
                </div>
              </div>
            )}

            {/* Wallet and Date */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <Label
                  htmlFor="walletId"
                  className="font-medium text-gray-700 text-sm"
                >
                  Wallet *
                </Label>
                <div className="mt-1.5">
                  <SelectInput
                    value={watch("walletId")}
                    onChange={(value) => setValue("walletId", value)}
                    options={walletOptions}
                    placeholder="Select wallet"
                  />
                </div>
                {errors.walletId && (
                  <p className="mt-1.5 flex items-center gap-1 text-red-500 text-sm">
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      role="img"
                      aria-label="Error"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.walletId.message}
                  </p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="transactionDate"
                  className="font-medium text-gray-700 text-sm"
                >
                  Date *
                </Label>
                <div className="mt-1.5">
                  <DateInput
                    value={dateValue}
                    onChange={(dateString) => {
                      setDateValue(dateString);
                      setValue("transactionDate", new Date(dateString));
                    }}
                    placeholder="Select date"
                  />
                </div>
                {errors.transactionDate && (
                  <p className="mt-1.5 flex items-center gap-1 text-red-500 text-sm">
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      role="img"
                      aria-label="Error"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.transactionDate.message}
                  </p>
                )}
              </div>
            </div>

            {/* Amount - Full width for outgoing transactions */}
            {watch("direction") === "out" && (
              <div>
                <Label
                  htmlFor="amount"
                  className="font-medium text-gray-700 text-sm"
                >
                  Amount *
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="amount"
                    value={amountFormatter.formattedValue}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    placeholder="0"
                    className={`pr-12 ${errors.amount ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"}`}
                  />
                  <div className="-translate-y-1/2 absolute top-1/2 right-3 transform font-medium text-gray-400 text-sm">
                    IDR
                  </div>
                </div>
                {errors.amount && (
                  <p className="mt-1.5 flex items-center gap-1 text-red-500 text-sm">
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      role="img"
                      aria-label="Error"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.amount.message}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Additional Details Section */}
        <div className="rounded-xl border border-slate-100 bg-gradient-to-r from-slate-50 to-gray-50 p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
              <svg
                className="h-4 w-4 text-slate-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                role="img"
                aria-label="Additional Details"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">
                Additional Details
              </h3>
              <p className="text-gray-600 text-xs">
                Add more context to your transaction
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Location */}
            <div>
              <Label
                htmlFor="location"
                className="font-medium text-gray-700 text-sm"
              >
                Location
              </Label>
              <div className="mt-1.5">
                <Input
                  id="location"
                  {...register("location")}
                  placeholder="Where did this happen?"
                  className="focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Category Selection */}
            <div>
              <Label className="font-medium text-gray-700 text-sm">
                Category
              </Label>
              <div className="mt-1.5">
                <CategoryFilter
                  selectedCategoryId={selectedCategoryId}
                  selectedSubcategoryId={selectedSubcategoryId}
                  onCategoryChange={handleCategoryChange}
                  onSubcategoryChange={handleSubcategoryChange}
                />
              </div>
            </div>

            {/* Transfer Purpose */}
            <div>
              <Label
                htmlFor="transferPurpose"
                className="font-medium text-gray-700 text-sm"
              >
                Transfer Purpose
              </Label>
              <div className="mt-1.5">
                <textarea
                  id="transferPurpose"
                  {...register("transferPurpose")}
                  placeholder="e.g., Wealth Transfer, Payment, etc."
                  className="flex h-20 w-full resize-none rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 text-sm placeholder:text-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Extra Fields Section */}
        <div className="rounded-xl border border-purple-100 bg-gradient-to-r from-purple-50 to-violet-50 p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
              <svg
                className="h-4 w-4 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                role="img"
                aria-label="Transaction Details"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">
                Transaction Details
              </h3>
              <p className="text-gray-600 text-xs">
                Additional transaction information
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Transaction Reference and QRIS Reference */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <Label
                  htmlFor="transactionRefNo"
                  className="font-medium text-gray-700 text-sm"
                >
                  Transaction Reference
                </Label>
                <div className="mt-1.5">
                  <Input
                    id="transactionRefNo"
                    {...register("transactionRefNo")}
                    placeholder="Transaction reference number"
                    className="focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <Label
                  htmlFor="qrisRefNo"
                  className="font-medium text-gray-700 text-sm"
                >
                  QRIS Reference
                </Label>
                <div className="mt-1.5">
                  <Input
                    id="qrisRefNo"
                    {...register("qrisRefNo")}
                    placeholder="QRIS reference number"
                    className="focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Merchant PAN and Customer PAN */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <Label
                  htmlFor="merchantPan"
                  className="font-medium text-gray-700 text-sm"
                >
                  Merchant PAN
                </Label>
                <div className="mt-1.5">
                  <Input
                    id="merchantPan"
                    {...register("merchantPan")}
                    placeholder="Merchant PAN number"
                    className="focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <Label
                  htmlFor="customerPan"
                  className="font-medium text-gray-700 text-sm"
                >
                  Customer PAN
                </Label>
                <div className="mt-1.5">
                  <Input
                    id="customerPan"
                    {...register("customerPan")}
                    placeholder="Customer PAN number"
                    className="focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Acquirer and Terminal ID */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <Label
                  htmlFor="acquirer"
                  className="font-medium text-gray-700 text-sm"
                >
                  Acquirer
                </Label>
                <div className="mt-1.5">
                  <Input
                    id="acquirer"
                    {...register("acquirer")}
                    placeholder="Acquirer information"
                    className="focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <Label
                  htmlFor="terminalId"
                  className="font-medium text-gray-700 text-sm"
                >
                  Terminal ID
                </Label>
                <div className="mt-1.5">
                  <Input
                    id="terminalId"
                    {...register("terminalId")}
                    placeholder="Terminal ID"
                    className="focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sender Information Section */}
        <div className="rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
              <svg
                className="h-4 w-4 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                role="img"
                aria-label="Sender Information"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">
                Sender Information
              </h3>
              <p className="text-gray-600 text-xs">
                Details about the sender or source of funds
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Source of Fund and Source Account */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <Label
                  htmlFor="sourceOfFund"
                  className="font-medium text-gray-700 text-sm"
                >
                  Source of Fund
                </Label>
                <div className="mt-1.5">
                  <Input
                    id="sourceOfFund"
                    {...register("sourceOfFund")}
                    placeholder="Source of funding"
                    className="focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <Label
                  htmlFor="sourceAccount"
                  className="font-medium text-gray-700 text-sm"
                >
                  Source Account
                </Label>
                <div className="mt-1.5">
                  <Input
                    id="sourceAccount"
                    {...register("sourceAccount")}
                    placeholder="Source account number"
                    className="focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Bank Sender */}
            <div>
              <Label
                htmlFor="bankSender"
                className="font-medium text-gray-700 text-sm"
              >
                Bank Sender
              </Label>
              <div className="mt-1.5">
                <Input
                  id="bankSender"
                  {...register("bankSender")}
                  placeholder="Sending bank name"
                  className="focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        <ModalFooter>
          <div className="flex w-full gap-3">
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
              color="green"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Creating..." : "Create Transaction"}
            </Button>
          </div>
        </ModalFooter>
      </form>
    </Modal>
  );
}
