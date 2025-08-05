// Wallet enums

// Date filter enums
export enum DateFilterType {
  ALL = 'all',
  CURRENT_MONTH = 'current-month',
  LAST_MONTH = 'last-month',
  CURRENT_WEEK = 'current-week',
  CURRENT_DAY = 'current-day',
  CUSTOM = 'custom',
}

// Sort enums
export enum SortByType {
  DATE = 'date',
  AMOUNT = 'amount',
  RECIPIENT = 'recipient',
}

export enum SortOrderType {
  ASC = 'asc',
  DESC = 'desc',
}

// Transaction direction enums
export enum TransactionDirection {
  IN = 'in',
  OUT = 'out',
}

// Bank filter enums
export enum BankFilterType {
  ALL = 'all',
  MANDIRI = 'mandiri',
  BCA = 'bca',
  BNI = 'bni',
  BRI = 'bri',
  CIMB = 'cimb',
  OTHER = 'other',
}

// Payment method filter enums
export enum PaymentMethodFilterType {
  ALL = 'all',
  QRIS = 'qris',
  TRANSFER = 'transfer',
  VIRTUAL_ACCOUNT = 'virtual-account',
  BI_FAST = 'bi-fast',
  OTHER = 'other',
}

// Wallet type enums
export enum WalletType {
  DEBIT = 'debit',
  CREDIT = 'credit',
  SAVINGS = 'savings',
  CURRENT = 'current',
  INVESTMENT = 'investment',
}

// Transaction type enums
export enum TransactionType {
  TRANSFER = 'transfer',
  PAYMENT = 'payment',
  WITHDRAWAL = 'withdrawal',
  DEPOSIT = 'deposit',
  QRIS = 'qris',
  VIRTUAL_ACCOUNT = 'virtual-account',
}

// Transaction status enums
export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

// Currency enums
export enum Currency {
  IDR = 'IDR',
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  JPY = 'JPY',
  SGD = 'SGD',
  MYR = 'MYR',
  THB = 'THB',
  PHP = 'PHP',
  VND = 'VND',
}

// Source of fund enums
export enum SourceOfFund {
  SALARY = 'salary',
  BUSINESS = 'business',
  INVESTMENT = 'investment',
  TRANSFER = 'transfer',
  REFUND = 'refund',
  OTHER = 'other',
}

// Transaction category enums
export enum TransactionCategory {
  FOOD_AND_BEVERAGE = 'food_and_beverage',
  TRANSPORTATION = 'transportation',
  SHOPPING = 'shopping',
  BILLS_AND_UTILITIES = 'bills_and_utilities',
  ENTERTAINMENT = 'entertainment',
  HEALTH_AND_MEDICAL = 'health_and_medical',
  EDUCATION = 'education',
  TRAVEL = 'travel',
  INVESTMENT = 'investment',
  SAVINGS = 'savings',
  OTHER = 'other',
}

// Bank code enums
export enum BankCode {
  MANDIRI = '014',
  BCA = '014',
  BNI = '009',
  BRI = '002',
  CIMB = '022',
  DANAMON = '011',
  PANIN = '019',
  PERMATA = '013',
  OCBC = '028',
  UOB = '023',
  HSBC = '087',
  CITIBANK = '031',
  STANDARD_CHARTERED = '050',
  MAYBANK = '016',
  MEGA = '426',
  BTN = '200',
  BJB = '110',
  BUKOPIN = '441',
  JAGO = '542',
  JENIUS = '535',
  DIGIBANK = '501',
  DANA = 'dana',
  OVO = 'ovo',
  GOPAY = 'gopay',
  SHOPEEPAY = 'shopeepay',
  LINKAJA = 'linkaja',
  FLIP = 'flip',
  PAYPAL = 'paypal',
  APPLE_PAY = 'apple_pay',
  GOOGLE_PAY = 'google_pay',
}

// Payment method enums
export enum PaymentMethod {
  QRIS = 'qris',
  TRANSFER = 'transfer',
  VIRTUAL_ACCOUNT = 'virtual_account',
  BI_FAST = 'bi_fast',
  CASH = 'cash',
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  E_WALLET = 'e_wallet',
  INSTALLMENT = 'installment',
  INTERNATIONAL = 'international',
}

// Acquirer enums
export enum Acquirer {
  MANDIRI = 'mandiri',
  BCA = 'bca',
  BNI = 'bni',
  BRI = 'bri',
  CIMB = 'cimb',
  MIDTRANS = 'midtrans',
  XENDIT = 'xendit',
  DOKU = 'doku',
  FASPAY = 'faspay',
  PAYPRO = 'paypro',
  CASHLEZ = 'cashlez',
  BLUEPAY = 'bluepay',
  PAYFAZZ = 'payfazz',
  PAYTREN = 'paytren',
  KUDO = 'kudo',
  UANGKU = 'uangku',
  CASHBAC = 'cashbac',
  GPay = 'gpay',
  APPLE_PAY = 'apple_pay',
  PAYPAL = 'paypal',
  VISA = 'visa',
  MASTERCARD = 'mastercard',
  AMEX = 'amex',
  JCB = 'jcb',
  AKULAKU = 'akulaku',
  KREDIVO = 'kredivo',
  DHUHA = 'dhuha',
  HOMECREDIT = 'homecredit',
  BAREKSA = 'bareksa',
  BIBIT = 'bibit',
  PLUANG = 'pluang',
} 