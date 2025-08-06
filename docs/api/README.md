# API Documentation

This document provides a comprehensive reference for all tRPC endpoints available in the Ojir application.

## 📋 Table of Contents

- [Authentication](#authentication)
- [Wallet Management](#wallet-management)
- [Transaction Operations](#transaction-operations)
- [User Preferences](#user-preferences)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

## 🔐 Authentication

All API endpoints require authentication except for the authentication endpoints themselves.

### Authentication Endpoints

#### `auth.getSession`
Get the current user session.

**Parameters:** None

**Returns:**
```typescript
{
  user: {
    id: string
    name: string
    email: string
    image: string
  } | null
  expires: string
}
```

**Example:**
```typescript
const { data: session } = api.auth.getSession.useQuery()
```

---

## 💰 Wallet Management

### `wallet.getAll`
Retrieve all wallets for the authenticated user.

**Parameters:** None

**Returns:**
```typescript
Array<{
  id: string
  name: string
  balance: number
  currency: string
  color: string
  bankId: string
  userId: string
  createdAt: Date
  updatedAt: Date
  bank: {
    id: string
    name: string
    icon: string
  }
}>
```

**Example:**
```typescript
const { data: wallets, isLoading } = api.wallet.getAll.useQuery()
```

### `wallet.getById`
Retrieve a specific wallet by ID.

**Parameters:**
```typescript
{
  id: string
}
```

**Returns:** Single wallet object (same structure as above)

**Example:**
```typescript
const { data: wallet } = api.wallet.getById.useQuery({ id: "wallet-id" })
```

### `wallet.create`
Create a new wallet.

**Parameters:**
```typescript
{
  name: string
  currency: string
  color: string
  bankId: string
  initialBalance?: number
}
```

**Returns:** Created wallet object

**Example:**
```typescript
const createWallet = api.wallet.create.useMutation({
  onSuccess: () => {
    // Refresh wallet list
    utils.wallet.getAll.invalidate()
  }
})

createWallet.mutate({
  name: "My Savings",
  currency: "USD",
  color: "#3B82F6",
  bankId: "bank-1",
  initialBalance: 1000
})
```

### `wallet.update`
Update an existing wallet.

**Parameters:**
```typescript
{
  id: string
  name?: string
  color?: string
  bankId?: string
}
```

**Returns:** Updated wallet object

### `wallet.delete`
Delete a wallet and all associated transactions.

**Parameters:**
```typescript
{
  id: string
}
```

**Returns:** Success confirmation

---

## 📊 Transaction Operations

### `transaction.getAll`
Retrieve transactions with optional filtering and pagination.

**Parameters:**
```typescript
{
  walletIds?: string[]
  dateRange?: {
    from: Date
    to: Date
  }
  category?: string
  paymentMethod?: string
  minAmount?: number
  maxAmount?: number
  search?: string
  page?: number
  limit?: number
  sortBy?: 'date' | 'amount' | 'description'
  sortOrder?: 'asc' | 'desc'
}
```

**Returns:**
```typescript
{
  transactions: Array<{
    id: string
    amount: number
    description: string
    category: string
    paymentMethod: string
    date: Date
    walletId: string
    userId: string
    createdAt: Date
    updatedAt: Date
    wallet: {
      id: string
      name: string
      currency: string
    }
  }>
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
```

**Example:**
```typescript
const { data } = api.transaction.getAll.useQuery({
  walletIds: ["wallet-1", "wallet-2"],
  dateRange: {
    from: new Date('2024-01-01'),
    to: new Date('2024-12-31')
  },
  page: 1,
  limit: 20
})
```

### `transaction.create`
Create a new transaction.

**Parameters:**
```typescript
{
  amount: number
  description: string
  category: string
  paymentMethod: string
  date: Date
  walletId: string
}
```

**Returns:** Created transaction object

### `transaction.update`
Update an existing transaction.

**Parameters:**
```typescript
{
  id: string
  amount?: number
  description?: string
  category?: string
  paymentMethod?: string
  date?: Date
  walletId?: string
}
```

**Returns:** Updated transaction object

### `transaction.delete`
Delete a transaction.

**Parameters:**
```typescript
{
  id: string
}
```

**Returns:** Success confirmation

### `transaction.bulkUpdate`
Update multiple transactions at once.

**Parameters:**
```typescript
{
  transactionIds: string[]
  updates: {
    category?: string
    paymentMethod?: string
    walletId?: string
  }
}
```

**Returns:** Array of updated transaction objects

---

## 👤 User Preferences

### `user.getPreferences`
Get user preferences and settings.

**Parameters:** None

**Returns:**
```typescript
{
  currency: string
  dateFormat: string
  timeFormat: string
  theme: 'light' | 'dark' | 'system'
  language: string
}
```

### `user.updatePreferences`
Update user preferences.

**Parameters:**
```typescript
{
  currency?: string
  dateFormat?: string
  timeFormat?: string
  theme?: 'light' | 'dark' | 'system'
  language?: string
}
```

**Returns:** Updated preferences object

---

## ⚠️ Error Handling

All API endpoints follow consistent error handling patterns:

### Error Response Format
```typescript
{
  code: string
  message: string
  details?: any
}
```

### Common Error Codes

| Code | Description |
|------|-------------|
| `UNAUTHORIZED` | User is not authenticated |
| `FORBIDDEN` | User lacks permission for this action |
| `NOT_FOUND` | Requested resource doesn't exist |
| `VALIDATION_ERROR` | Invalid input parameters |
| `INTERNAL_ERROR` | Server-side error |

### Error Handling Example
```typescript
const createWallet = api.wallet.create.useMutation({
  onError: (error) => {
    if (error.data?.code === 'VALIDATION_ERROR') {
      toast.error('Please check your input')
    } else {
      toast.error('Something went wrong')
    }
  }
})
```

---

## 🚦 Rate Limiting

API endpoints are rate-limited to ensure fair usage:

- **General endpoints**: 100 requests per 15-minute window
- **Authentication endpoints**: 10 requests per 15-minute window
- **Bulk operations**: 20 requests per 15-minute window

Rate limit headers are included in responses:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Requests remaining in current window
- `X-RateLimit-Reset`: Time when the current window resets

---

## 📚 Additional Resources

- [tRPC Documentation](https://trpc.io/)
- [React Query Integration](https://tanstack.com/query/latest)
- [Error Handling Best Practices](../guides/error-handling.md)
- [Testing API Endpoints](../guides/testing-api.md)