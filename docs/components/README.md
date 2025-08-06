# Component Library

This document provides comprehensive documentation for all reusable components in the Ojir application.

## 📋 Table of Contents

- [Component Architecture](#component-architecture)
- [UI Components](#ui-components)
- [Form Components](#form-components)
- [Layout Components](#layout-components)
- [Feature Components](#feature-components)
- [Modal Components](#modal-components)
- [Table Components](#table-components)
- [Chart Components](#chart-components)
- [Usage Guidelines](#usage-guidelines)

## 🏗️ Component Architecture

Our component library follows atomic design principles organized by functionality:

```
src/components/
├── ui/              # Core reusable UI components
├── forms/           # Form-specific components
├── layout/          # Layout and navigation components
├── features/        # Feature-specific components
├── modals/          # Modal and dialog components
├── tables/          # Table and list components
├── charts/          # Data visualization components
└── index.ts         # Consolidated exports
```

### Design Principles

- **Reusability**: Components are designed to be reused across different features
- **Accessibility**: All components follow WCAG 2.1 guidelines
- **TypeScript**: Full type safety with comprehensive prop interfaces
- **Consistency**: Unified styling with Tailwind CSS and design tokens
- **Testing**: All components are unit tested

---

## 🎨 UI Components

### Button

A flexible button component with multiple variants and sizes.

**Props:**
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  asChild?: boolean
}
```

**Usage:**
```tsx
import { Button } from '~/components/ui/button'

// Basic usage
<Button>Click me</Button>

// With variants
<Button variant="outline">Outline Button</Button>
<Button variant="destructive">Delete</Button>

// Different sizes
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>

// As link
<Button asChild>
  <Link href="/dashboard">Go to Dashboard</Link>
</Button>
```

### Card

A container component for grouping related content.

**Props:**
```typescript
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}
```

**Usage:**
```tsx
import { Card } from '~/components/ui/card'

<Card className="p-6">
  <h2>Card Title</h2>
  <p>Card content goes here...</p>
</Card>
```

### Toast

Notification component for displaying feedback messages.

**Usage:**
```tsx
import { useToast } from '~/components/ui/use-toast'

const { toast } = useToast()

// Success toast
toast({
  title: "Success!",
  description: "Your changes have been saved.",
})

// Error toast
toast({
  title: "Error",
  description: "Something went wrong.",
  variant: "destructive",
})
```

---

## 📝 Form Components

### TransactionEditForm

Form component for creating and editing transactions.

**Props:**
```typescript
interface TransactionEditFormProps {
  transaction?: TransactionResponse
  wallets: WalletWithBank[]
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: TransactionFormData) => void
}
```

**Usage:**
```tsx
import { TransactionEditForm } from '~/components/forms'

<TransactionEditForm
  transaction={selectedTransaction}
  wallets={wallets}
  isOpen={isFormOpen}
  onClose={() => setIsFormOpen(false)}
  onSubmit={handleTransactionSubmit}
/>
```

### WalletForm

Form component for creating and editing wallets.

**Props:**
```typescript
interface WalletFormProps {
  wallet?: WalletWithBank
  banks: Bank[]
  onSubmit: (data: WalletFormData) => void
  onCancel: () => void
}
```

---

## 🖼️ Layout Components

### Navbar

Main navigation component with user authentication and menu items.

**Usage:**
```tsx
import { Navbar } from '~/components/layout'

<Navbar />
```

### Footer

Application footer with links and branding.

**Usage:**
```tsx
import { Footer } from '~/components/layout'

<Footer />
```

### GlobalLoadingBar

Application-wide loading indicator.

**Usage:**
```tsx
import { GlobalLoadingBar } from '~/components/layout'

// Automatically shows/hides based on loading state
<GlobalLoadingBar />
```

---

## 🎯 Feature Components

### Wallet Components

#### WalletHeader
Header component for wallet pages with actions and filters.

#### WalletSummary
Displays wallet balance and summary statistics.

#### WalletFilters
Filter controls for wallet and transaction views.

#### WalletList
List component for displaying multiple wallets.

**Usage:**
```tsx
import { 
  WalletHeader, 
  WalletSummary, 
  WalletFilters, 
  WalletList 
} from '~/components/features/wallet'

<WalletHeader />
<WalletSummary wallets={wallets} />
<WalletFilters onFilterChange={handleFilterChange} />
<WalletList wallets={wallets} onSelect={handleWalletSelect} />
```

### Calendar Components

#### MonthView
Calendar component displaying transactions in month view.

#### WeekView
Calendar component displaying transactions in week view.

#### DayView
Calendar component displaying transactions in day view.

**Usage:**
```tsx
import { MonthView, WeekView, DayView } from '~/components/features/calendar'

<MonthView 
  currentDate={currentDate}
  transactions={transactions}
  onDateSelect={handleDateSelect}
/>
```

---

## 🗂️ Modal Components

### Modal

Base modal component with overlay and close functionality.

**Props:**
```typescript
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}
```

**Usage:**
```tsx
import { Modal } from '~/components/modals'

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Modal Title"
  size="md"
>
  Modal content goes here...
</Modal>
```

### WalletFormModal

Modal wrapper for wallet creation/editing form.

### BulkUpdateModal

Modal for bulk updating multiple transactions.

---

## 📊 Table Components

### TransactionList

Component for displaying paginated transaction lists.

**Props:**
```typescript
interface TransactionListProps {
  transactions: TransactionResponse[]
  isLoading: boolean
  pagination: PaginationData
  onTransactionEdit: (transaction: TransactionResponse) => void
  onTransactionDelete: (id: string) => void
  onPageChange: (page: number) => void
}
```

### TransactionItem

Individual transaction row component.

### PaginationControls

Pagination navigation component.

---

## 📈 Chart Components

### CountingStats

Animated counter component for displaying statistics.

**Props:**
```typescript
interface CountingStatsProps {
  value: number
  label: string
  format?: 'currency' | 'number' | 'percentage'
  currency?: string
  duration?: number
}
```

**Usage:**
```tsx
import { CountingStats } from '~/components/charts'

<CountingStats
  value={1234.56}
  label="Total Balance"
  format="currency"
  currency="USD"
/>
```

### SummaryCard

Card component for displaying key metrics and statistics.

---

## 📝 Usage Guidelines

### Importing Components

Use the centralized index file for imports:

```tsx
// ✅ Good - use main index
import { Button, Card, Modal } from '~/components'

// ✅ Also good - use specific category
import { TransactionEditForm } from '~/components/forms'
import { WalletHeader } from '~/components/features/wallet'

// ❌ Avoid - direct file imports
import { Button } from '~/components/ui/button'
```

### Styling Guidelines

- Use the `cn()` utility for conditional classes
- Leverage CSS variables for consistent theming
- Follow Tailwind CSS best practices

```tsx
import { cn } from '~/utils'

<Button 
  className={cn(
    "custom-base-styles",
    isActive && "active-styles",
    className
  )}
>
  Button Text
</Button>
```

### Accessibility

All components include proper ARIA attributes and keyboard navigation:

```tsx
// Components automatically include accessibility features
<Button aria-label="Close modal" onClick={onClose}>
  ×
</Button>

// Custom accessibility attributes
<Modal
  isOpen={isOpen}
  onClose={onClose}
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <h2 id="modal-title">Modal Title</h2>
  <p id="modal-description">Modal description...</p>
</Modal>
```

### Testing Components

Use the provided test utilities for consistent testing:

```tsx
import { renderWithProviders, screen, userEvent } from '~/test-utils'
import { Button } from '~/components/ui/button'

test('button handles click events', async () => {
  const handleClick = jest.fn()
  const user = userEvent.setup()
  
  renderWithProviders(<Button onClick={handleClick}>Click me</Button>)
  
  await user.click(screen.getByRole('button'))
  expect(handleClick).toHaveBeenCalledTimes(1)
})
```

---

## 🔗 Related Documentation

- [API Documentation](../api/README.md)
- [Hooks Documentation](../hooks/README.md)
- [Testing Guide](../guides/testing.md)
- [Styling Guide](../guides/styling.md)