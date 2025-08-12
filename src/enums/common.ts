export enum Currency {
  IDR = "IDR",
  USD = "USD",
  EUR = "EUR",
  SGD = "SGD",
}

export enum TransactionDirection {
  IN = "in",
  OUT = "out",
}

export enum TransactionStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
  CANCELLED = "cancelled",
}

export enum PaymentMethod {
  CASH = "cash",
  BANK_TRANSFER = "bank_transfer",
  E_WALLET = "e_wallet",
  CREDIT_CARD = "credit_card",
  DEBIT_CARD = "debit_card",
  QRIS = "qris",
}

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
  MODERATOR = "moderator",
}
