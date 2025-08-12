# Enums

This folder contains all the enumerated constants used throughout the application.

## Available Enums

### Loading Enums (`loading.ts`)

#### LoadingTimeout
- `ROUTE_CHANGE`: 500ms - for pathname changes
- `SEARCH_PARAMS`: 400ms - for query parameter changes
- `MINIMUM_LOADING`: 100ms - minimum time to show loading
- `SYNC_OPERATION`: 1000ms - for sync operations
- `CLEAR_OPERATION`: 800ms - for clear operations
- `REFETCH_OPERATION`: 600ms - for refetch operations

#### LoadingMessage
- `LOADING_PAGE`: "Loading page..."
- `LOADING_DATA`: "Loading data..."
- `SYNCING_TRANSACTIONS`: "Syncing transactions from emails..."
- `CLEARING_TRANSACTIONS`: "Clearing all transactions..."
- `REFRESHING_DATA`: "Refreshing data..."
- `PROCESSING`: "Processing..."
- `SAVING`: "Saving..."
- `UPDATING`: "Updating..."

### Common Enums (`common.ts`)

#### Currency
- `IDR`, `USD`, `EUR`, `SGD`

#### TransactionDirection
- `IN`, `OUT`

#### TransactionStatus
- `PENDING`, `COMPLETED`, `FAILED`, `CANCELLED`

#### PaymentMethod
- `CASH`, `BANK_TRANSFER`, `E_WALLET`, `CREDIT_CARD`, `DEBIT_CARD`, `QRIS`

#### UserRole
- `USER`, `ADMIN`, `MODERATOR`

### UI Enums (`ui.ts`)

#### ComponentSize
- `XS`, `SM`, `MD`, `LG`, `XL`, `ICON`

#### ButtonVariant
- `DEFAULT`, `DESTRUCTIVE`, `OUTLINE`, `SECONDARY`, `GHOST`, `LINK`

#### ButtonSize
- `DEFAULT`, `SM`, `LG`, `ICON`

#### BadgeVariant
- `DEFAULT`, `SECONDARY`, `DESTRUCTIVE`, `OUTLINE`, `SUCCESS`, `WARNING`

#### BadgeSize
- `SM`, `MD`, `LG`

#### InputVariant
- `DEFAULT`, `ERROR`, `SUCCESS`

#### LabelVariant
- `DEFAULT`, `REQUIRED`, `OPTIONAL`

#### CardVariant
- `DEFAULT`, `OUTLINED`, `ELEVATED`

#### ModalSize
- `SM`, `MD`, `LG`, `XL`, `2XL`, `FULL`

#### SpinnerSize
- `SM`, `MD`, `LG`

#### IconSize
- `XS`, `SM`, `MD`, `LG`, `XL`

#### CategoryPillSize
- `SM`, `MD`, `LG`

### Filter Enums (`filters.ts`)

#### DateFilterOption
- `ALL`, `CURRENT_MONTH`, `LAST_MONTH`, `CURRENT_WEEK`, `CURRENT_DAY`, `CUSTOM`

#### LimitOption
- `TEN`, `TWENTY_FIVE`, `FIFTY`, `HUNDRED`

#### BankFilterType
- `ALL`, `MANDIRI`, `BCA`, `BNI`, `BRI`, `CIMB`, `OTHER`

#### PaymentMethodFilterType
- `ALL`, `CASH`, `BANK_TRANSFER`, `E_WALLET`, `CREDIT_CARD`, `DEBIT_CARD`, `QRIS`

#### SortOption
- `DATE_ASC`, `DATE_DESC`, `AMOUNT_ASC`, `AMOUNT_DESC`, `RECIPIENT_ASC`, `RECIPIENT_DESC`, `CATEGORY_ASC`, `CATEGORY_DESC`

#### WeekDay
- `SUNDAY`, `MONDAY`, `TUESDAY`, `WEDNESDAY`, `THURSDAY`, `FRIDAY`, `SATURDAY`

### Color Enums (`colors.ts`)

#### WalletColor
- `GOOGLE_BLUE`, `GOOGLE_GREEN`, `GOOGLE_PURPLE`, `GOOGLE_RED`, `GOOGLE_ORANGE`, `GOOGLE_PINK`, `GOOGLE_TEAL`, `GOOGLE_YELLOW`

#### ColorIntensity
- `LIGHT`, `MEDIUM`, `DARK`

#### ColorGradient
- Tailwind gradient classes for each wallet color

#### ChartColor
- Hex color codes for charts and UI elements

### Toast Enums (`toast.ts`)

#### ToastActionType
- `ADD_TOAST`, `UPDATE_TOAST`, `DISMISS_TOAST`, `REMOVE_TOAST`

#### ToastLimit
- `DEFAULT`, `MEDIUM`, `HIGH`

#### ToastTimeout
- `REMOVE_DELAY`, `SHORT`, `MEDIUM`, `LONG`

## Usage

```typescript
import {
  LoadingTimeout,
  LoadingMessage,
  Currency,
  TransactionDirection,
  ButtonVariant,
  DateFilterOption,
  WalletColor,
  ToastActionType
} from "~/enums";

// Use in components
const timeout = LoadingTimeout.ROUTE_CHANGE;
const message = LoadingMessage.LOADING_PAGE;
const currency = Currency.IDR;
const direction = TransactionDirection.OUT;
const buttonVariant = ButtonVariant.PRIMARY;
const dateFilter = DateFilterOption.CURRENT_MONTH;
const walletColor = WalletColor.GOOGLE_BLUE;
const toastAction = ToastActionType.ADD_TOAST;
```

## Adding New Enums

1. Create a new file in the `src/enums/` folder
2. Define your enum(s)
3. Export them from `src/enums/index.ts`
4. Use them throughout the application

## Benefits

- **Type Safety**: Prevents typos and invalid values
- **Centralized Constants**: Easy to maintain and update
- **IntelliSense**: Better IDE support with autocomplete
- **Consistency**: Ensures consistent values across the application
- **Refactoring**: Easy to rename or modify values globally
