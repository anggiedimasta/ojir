# Atomic Design Component Library

This component library follows the Atomic Design methodology, breaking down user interfaces into their smallest, reusable components and building them up into more complex structures.

## Structure

### 🧪 Atoms
Basic building blocks - the smallest functional components.

**Location:** `src/components/atoms/`

**Components:**
- `Button` - Interactive button with variants and states
- `Card` - Container component with elevation variants
- `Input` - Form input with validation states
- `Label` - Form labels with required/optional variants
- `Icon` - Icon wrapper with size variants
- `Badge` - Status indicators with color variants
- `Divider` - Visual separators
- `Spinner` - Loading indicators

**Usage:**
```tsx
import { Button, Card, Input } from '~/components/atoms';

<Button variant="primary" size="lg">Click me</Button>
<Card variant="elevated">Content</Card>
<Input placeholder="Enter text..." />
```

### 🧬 Molecules
Simple groups of atoms working together as functional units.

**Location:** `src/components/molecules/`

**Components:**
- `SearchInput` - Search field with icon
- `DateInput` - Date picker with label
- `SelectInput` - Dropdown with custom styling
- `FormField` - Input with label and error handling
- `IconButton` - Button with icon
- `StatusBadge` - Badge with status-specific styling
- `LoadingSpinner` - Spinner with optional text
- `EmptyState` - Empty state with action button

**Usage:**
```tsx
import { SearchInput, FormField } from '~/components/molecules';

<SearchInput 
  value={searchQuery} 
  onChange={setSearchQuery} 
  placeholder="Search..." 
/>
<FormField 
  label="Email" 
  required 
  error="Invalid email" 
/>
```

### 🦠 Organisms
Complex components made up of molecules and/or atoms, representing distinct sections.

**Location:** `src/components/organisms/`

**Components:**
- `DateFilter` - Date filtering with custom range inputs
- `SearchAndSort` - Combined search and sorting controls
- `PaginationControls` - Pagination with navigation
- `SummaryCard` - Data summary with icon and styling
- `TransactionItem` - Individual transaction display
- `BankIcon` - Bank logo with fallback
- `WalletHeader` - Wallet page header with actions
- `WalletFilters` - Combined filtering interface
- `TransactionList` - List of transactions with pagination

**Usage:**
```tsx
import { TransactionItem, WalletHeader } from '~/components/organisms';

<WalletHeader 
  onSync={handleSync} 
  onClear={handleClear} 
  isLoading={isLoading} 
/>
<TransactionItem 
  transaction={transaction} 
  formatCurrency={formatCurrency} 
  formatDate={formatDate} 
/>
```

### 📄 Templates
Page-level objects that define the overall layout and structure.

**Location:** `src/components/templates/`

**Components:**
- `WalletTemplate` - Complete wallet page layout
- `DashboardTemplate` - Dashboard page layout
- `AuthTemplate` - Authentication page layout

**Usage:**
```tsx
import { WalletTemplate } from '~/components/templates';

<WalletTemplate
  onSync={handleSync}
  onClear={handleClear}
  isLoading={isLoading}
  summary={summary}
  formatCurrency={formatCurrency}
  // ... other props
/>
```

## Design Principles

### 1. Consistency
- All components follow the same design system
- Consistent spacing, colors, and typography
- Standardized prop interfaces

### 2. Reusability
- Components are designed to be reused across the application
- Props allow for customization without breaking the design
- Clear separation of concerns

### 3. Scalability
- Easy to add new components following the same patterns
- Clear hierarchy makes it easy to understand relationships
- Modular structure allows for easy maintenance

### 4. Efficiency
- Components are optimized for performance
- Minimal re-renders through proper prop design
- Efficient styling with Tailwind CSS

## Migration Guide

### From Legacy Components
The old components in `src/components/ui/` are being gradually migrated to the atomic design structure:

1. **Atoms** - Extract basic elements (buttons, inputs, etc.)
2. **Molecules** - Combine atoms into functional units
3. **Organisms** - Build complex components from molecules
4. **Templates** - Create page layouts from organisms

### Best Practices

1. **Import from the correct level:**
   ```tsx
   // ✅ Good - Import from atoms for basic elements
   import { Button } from '~/components/atoms';
   
   // ❌ Avoid - Don't import molecules when atoms will do
   import { IconButton } from '~/components/molecules';
   ```

2. **Compose components properly:**
   ```tsx
   // ✅ Good - Use organisms for complex sections
   <WalletHeader onSync={handleSync} />
   
   // ❌ Avoid - Don't rebuild from scratch
   <div className="header">
     <Button onClick={handleSync}>Sync</Button>
   </div>
   ```

3. **Use templates for page layouts:**
   ```tsx
   // ✅ Good - Use templates for complete pages
   <WalletTemplate {...pageProps} />
   
   // ❌ Avoid - Don't manually compose page layouts
   <div>
     <WalletHeader />
     <WalletFilters />
     <TransactionList />
   </div>
   ```

## Contributing

When adding new components:

1. **Determine the appropriate level** based on complexity
2. **Follow the existing patterns** for props and styling
3. **Add proper TypeScript interfaces** for all props
4. **Include JSDoc comments** for complex components
5. **Update this README** with new component documentation

## File Structure

```
src/components/
├── atoms/           # Basic building blocks
├── molecules/       # Simple functional units
├── organisms/       # Complex components
├── templates/       # Page layouts
├── ui/             # Legacy components (to be migrated)
├── index.ts        # Main export file
└── README.md       # This documentation
``` 