export enum DateFilterOption {
  ALL = "all",
  CURRENT_MONTH = "current-month",
  LAST_MONTH = "last-month",
  CURRENT_WEEK = "current-week",
  CURRENT_DAY = "current-day",
  CUSTOM = "custom",
}

export enum LimitOption {
  TEN = 10,
  TWENTY_FIVE = 25,
  FIFTY = 50,
  HUNDRED = 100,
}

export enum BankFilterType {
  ALL = "all",
  MANDIRI = "mandiri",
  BCA = "bca",
  BNI = "bni",
  BRI = "bri",
  CIMB = "cimb",
  OTHER = "other",
}

export enum PaymentMethodFilterType {
  ALL = "all",
  CASH = "cash",
  BANK_TRANSFER = "bank_transfer",
  E_WALLET = "e_wallet",
  CREDIT_CARD = "credit_card",
  DEBIT_CARD = "debit_card",
  QRIS = "qris",
}

export enum SortOption {
  DATE_ASC = "date-asc",
  DATE_DESC = "date-desc",
  AMOUNT_ASC = "amount-asc",
  AMOUNT_DESC = "amount-desc",
  RECIPIENT_ASC = "recipient-asc",
  RECIPIENT_DESC = "recipient-desc",
  CATEGORY_ASC = "category-asc",
  CATEGORY_DESC = "category-desc",
}

export enum WeekDay {
  SUNDAY = "Sun",
  MONDAY = "Mon",
  TUESDAY = "Tue",
  WEDNESDAY = "Wed",
  THURSDAY = "Thu",
  FRIDAY = "Fri",
  SATURDAY = "Sat",
}
