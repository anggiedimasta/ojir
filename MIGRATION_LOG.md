# Codebase Migration Log

## Overview
This document tracks the migration of the codebase from its current structure to a more modular, organized, and maintainable architecture.

## Current State Analysis
- **Frontend**: Next.js 15 with App Router
- **Backend**: tRPC with Drizzle ORM
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Neon

## Migration Plan

### Phase 1: Core Infrastructure (Foundation)
**Priority: High | Estimated Time: 2-3 days**

#### 1.1 Types & Interfaces Organization
**Status: COMPLETED** | **Started: 2024-12-19** | **Completed: 2024-12-19**

- [x] Create modular type definitions in `src/entities/`
  - [x] `src/entities/types/` - Core type definitions
  - [x] `src/entities/interfaces/` - Interface definitions
  - [x] `src/entities/enums/` - Enum definitions
  - [x] `src/entities/schemas/` - Zod schemas
- [x] Organize by domain:
  - [x] `src/entities/types/common.ts` - Common types
  - [x] `src/entities/interfaces/common.ts` - Common interfaces
  - [x] `src/entities/enums/common.ts` - Common enums
  - [x] `src/entities/schemas/common.ts` - Common schemas
  - [x] `src/entities/types/wallet.ts` - Wallet types
  - [x] `src/entities/interfaces/wallet.ts` - Wallet interfaces
  - [x] `src/entities/enums/wallet.ts` - Wallet enums
  - [x] `src/entities/schemas/wallet.ts` - Wallet schemas
  - [x] `src/entities/types/auth.ts` - Auth types
  - [x] `src/entities/interfaces/auth.ts` - Auth interfaces
  - [x] `src/entities/enums/auth.ts` - Auth enums
  - [x] `src/entities/schemas/auth.ts` - Auth schemas
  - [x] `src/entities/types/calendar.ts` - Calendar types
  - [x] `src/entities/interfaces/calendar.ts` - Calendar interfaces
  - [x] `src/entities/enums/calendar.ts` - Calendar enums
  - [x] `src/entities/schemas/calendar.ts` - Calendar schemas
  - [x] `src/entities/types/api.ts` - API types
  - [x] `src/entities/interfaces/api.ts` - API interfaces
  - [x] `src/entities/enums/api.ts` - API enums
  - [x] `src/entities/schemas/api.ts` - API schemas
  - [x] `src/entities/types/ui.ts` - UI types
  - [x] `src/entities/interfaces/ui.ts` - UI interfaces
  - [x] `src/entities/enums/ui.ts` - UI enums
  - [x] `src/entities/schemas/ui.ts` - UI schemas
- [x] Create index files for easy imports
- [ ] Update all imports across the codebase

**Current Task**: Phase 1.1 completed, ready for Phase 1.2

**Progress**:
- ✅ Created new entities structure
- ✅ Migrated common types, interfaces, enums, and schemas
- ✅ Migrated wallet domain types, interfaces, enums, and schemas
- ✅ Migrated auth domain types, interfaces, enums, and schemas
- ✅ Migrated calendar domain types, interfaces, enums, and schemas
- ✅ Migrated API domain types, interfaces, enums, and schemas
- ✅ Migrated UI domain types, interfaces, enums, and schemas
- ✅ Updated all index files
- 🔄 Next: Phase 1.2 - Client-side API Organization

#### 1.2 API Layer Organization
**Status: COMPLETED** | **Started: 2024-12-19** | **Completed: 2024-12-19**

- [x] Create `src/api/` structure:
  - [x] `src/api/trpc/` - tRPC client setup
  - [x] `src/api/hooks/` - Custom API hooks
  - [x] `src/api/mutations/` - tRPC mutations
  - [x] `src/api/queries/` - tRPC queries
- [x] Organize by domain:
  - [x] `src/api/queries/wallet.ts` - Wallet queries
  - [x] `src/api/mutations/wallet.ts` - Wallet mutations
  - [x] `src/api/queries/calendar.ts` - Calendar queries
  - [x] `src/api/mutations/calendar.ts` - Calendar mutations
  - [x] `src/api/queries/master-data.ts` - Master data queries
- [x] Migrate existing hooks:
  - [x] `src/api/hooks/use-wallet-management.ts` - Wallet management hook
  - [x] `src/api/hooks/use-transaction-management.ts` - Transaction management hook
  - [x] `src/api/hooks/use-bulk-update.ts` - Bulk update hook
- [x] Create index files for easy imports
- [ ] Update all imports across the codebase

**Current Task**: Phase 1.2 completed, ready for Phase 1.3

**Progress**:
- ✅ Created new API structure with modular organization
- ✅ Organized tRPC client setup and provider
- ✅ Created domain-specific query and mutation files
- ✅ Migrated existing custom hooks to new structure
- ✅ Created comprehensive index files for easy imports
- 🔄 Next: Phase 1.3 - Server Endpoints Organization

#### 1.3 Server Endpoints Organization
**Status: COMPLETED** | **Started: 2024-12-19** | **Completed: 2024-12-19**

- [x] Create `src/server/endpoints/` structure:
  - [x] `src/server/endpoints/trpc/` - tRPC routers
  - [ ] `src/server/endpoints/rest/` - REST endpoints (if any)
  - [ ] `src/server/endpoints/webhooks/` - Webhook handlers
- [x] Organize by domain:
  - [x] `src/server/endpoints/trpc/wallet/` - Wallet router with queries and mutations
  - [x] `src/server/endpoints/trpc/calendar/` - Calendar router with queries and mutations
  - [ ] `src/server/endpoints/trpc/auth/` - Auth router (if needed)
  - [x] `src/server/endpoints/trpc/master-data/` - Master data router with queries
- [x] Break down large routers into smaller files:
  - [x] `src/server/endpoints/trpc/wallet/queries.ts` - Wallet queries
  - [x] `src/server/endpoints/trpc/wallet/mutations.ts` - Wallet mutations
  - [x] `src/server/endpoints/trpc/wallet/index.ts` - Main wallet router
  - [x] `src/server/endpoints/trpc/calendar/queries.ts` - Calendar queries
  - [x] `src/server/endpoints/trpc/calendar/mutations.ts` - Calendar mutations
  - [x] `src/server/endpoints/trpc/calendar/index.ts` - Main calendar router
  - [x] `src/server/endpoints/trpc/master-data/queries.ts` - Master data queries
  - [x] `src/server/endpoints/trpc/master-data/index.ts` - Main master data router
- [x] Create main endpoints index file
- [x] Migrate remaining routers (calendar, master-data)
- [x] Update all imports across the codebase

**Current Task**: Phase 1.3 completed, ready for Phase 2.1

**Progress**:
- ✅ Created new endpoints structure
- ✅ Migrated wallet router with proper separation of queries and mutations
- ✅ Migrated calendar router with proper separation of queries and mutations
- ✅ Migrated master-data router with queries
- ✅ Created modular router organization
- ✅ Updated main server API root to use new structure
- ✅ Fixed import paths and resolved linter errors

### Phase 2: Application Layer (Components & Pages)
**Priority: High | Estimated Time: 3-4 days**

#### 2.1 Pages Organization
**Status: COMPLETED** | **Started: 2024-12-19** | **Completed: 2024-12-19**

- [x] Create `src/pages/` structure:
  - [x] `src/pages/auth/` - Authentication pages
  - [x] `src/pages/dashboard/` - Dashboard pages
  - [x] `src/pages/wallet/` - Wallet pages
  - [x] `src/pages/calendar/` - Calendar pages
  - [x] `src/pages/settings/` - Settings pages
  - [x] `src/pages/error/` - Error pages
- [x] Move existing pages from `src/app/`
- [x] Update routing configuration

**Current Task**: Phase 2.1 completed, ready for Phase 2.2

**Progress**:
- ✅ Created new pages directory structure with organized subdirectories
- ✅ Migrated authentication pages (signin) from app to pages structure
- ✅ Migrated dashboard pages including layout and components
- ✅ Migrated wallet pages with full functionality
- ✅ Migrated calendar pages including all dynamic routes and components
- ✅ Created error pages (404, 500) for better error handling
- ✅ Updated routing paths in migrated components
- ✅ Created home page in new pages structure
- 🔄 Next: Phase 2.2 - Components Organization

#### 2.2 Components Organization
**Status: COMPLETED** | **Started: 2024-12-19** | **Completed: 2024-12-19**

- [x] Reorganize `src/components/`:
  - [x] `src/components/ui/` - Reusable UI components
  - [x] `src/components/forms/` - Form components
  - [x] `src/components/layout/` - Layout components
  - [x] `src/components/features/` - Feature-specific components
  - [x] `src/components/modals/` - Modal components
  - [x] `src/components/tables/` - Table components
  - [x] `src/components/charts/` - Chart components
- [x] Organize by domain:
  - [x] `src/components/features/wallet/`
  - [x] `src/components/features/calendar/`
  - [x] `src/components/features/auth/`

**Current Task**: Phase 2.2 completed, ready for Phase 3

**Progress**:
- ✅ Created organized component directory structure with clear separation of concerns
- ✅ Migrated layout components (navbar, footer, loading bar, animated sections)
- ✅ Migrated form components (transaction edit form, wallet form)
- ✅ Migrated modal components (modal base, bulk update modal, wallet form modal)
- ✅ Migrated table components (transaction list, transaction item, pagination controls)
- ✅ Migrated chart components (counting stats, summary card)
- ✅ Organized feature-specific components by domain (wallet, calendar)
- ✅ Updated all import statements across the codebase
- ✅ Cleaned up old atomic design structure
- ✅ Created comprehensive index files for easy imports
- 🔄 Next: Phase 3 - Business Logic Layer

### Phase 3: Business Logic Layer
**Priority: Medium | Estimated Time: 2-3 days**

#### 3.1 Hooks Organization
- [ ] Create `src/hooks/` structure:
  - [ ] `src/hooks/api/` - API-related hooks
  - [ ] `src/hooks/ui/` - UI-related hooks
  - [ ] `src/hooks/state/` - State management hooks
  - [ ] `src/hooks/utils/` - Utility hooks
  - [ ] `src/hooks/features/` - Feature-specific hooks
- [ ] Organize by domain:
  - [ ] `src/hooks/features/wallet/`
  - [ ] `src/hooks/features/calendar/`
  - [ ] `src/hooks/features/auth/`

#### 3.2 Utils Organization
- [ ] Create `src/utils/` structure:
  - [ ] `src/utils/formatting/` - Formatting utilities
  - [ ] `src/utils/validation/` - Validation utilities
  - [ ] `src/utils/date/` - Date utilities
  - [ ] `src/utils/currency/` - Currency utilities
  - [ ] `src/utils/storage/` - Storage utilities
  - [ ] `src/utils/api/` - API utilities
  - [ ] `src/utils/constants/` - Constants

### Phase 4: Infrastructure & Configuration
**Priority: Medium | Estimated Time: 1-2 days**

#### 4.1 Configuration Organization
- [ ] Create `src/config/` structure:
  - [ ] `src/config/database.ts`
  - [ ] `src/config/auth.ts`
  - [ ] `src/config/api.ts`
  - [ ] `src/config/env.ts`
  - [ ] `src/config/constants.ts`

#### 4.2 Styles Organization
- [ ] Create `src/styles/` structure:
  - [ ] `src/styles/components/` - Component-specific styles
  - [ ] `src/styles/layouts/` - Layout styles
  - [ ] `src/styles/themes/` - Theme configurations
  - [ ] `src/styles/utilities/` - Utility classes
  - [ ] `src/styles/variables/` - CSS variables

#### 4.3 Assets Organization
- [ ] Create `src/assets/` structure:
  - [ ] `src/assets/images/` - Images
  - [ ] `src/assets/icons/` - Icons
  - [ ] `src/assets/fonts/` - Fonts
  - [ ] `src/assets/data/` - Static data files

### Phase 5: Testing & Documentation
**Priority: Low | Estimated Time: 2-3 days**

#### 5.1 Testing Organization
- [ ] Create `src/tests/` structure:
  - [ ] `src/tests/unit/` - Unit tests
  - [ ] `src/tests/integration/` - Integration tests
  - [ ] `src/tests/e2e/` - End-to-end tests
  - [ ] `src/tests/mocks/` - Test mocks
  - [ ] `src/tests/fixtures/` - Test fixtures

#### 5.2 Documentation Organization
- [ ] Create `src/docs/` structure:
  - [ ] `src/docs/api/` - API documentation
  - [ ] `src/docs/components/` - Component documentation
  - [ ] `src/docs/architecture/` - Architecture documentation
  - [ ] `src/docs/guides/` - Development guides

### Phase 6: Loading System Implementation
**Priority: High | Estimated Time: 1-2 days**

#### 6.1 Loading State Management
- [ ] Implement global loading system
- [ ] Create loading hooks for API requests
- [ ] Add loading states to all components
- [ ] Implement loading UI components
- [ ] Add loading indicators for user actions

## Recommended Folder Structure

```
src/
├── api/                          # Client-side API layer
│   ├── trpc/                     # tRPC client setup
│   ├── hooks/                    # Custom API hooks
│   ├── mutations/                # tRPC mutations
│   ├── queries/                  # tRPC queries
│   └── rest/                     # REST API clients
├── components/                   # React components
│   ├── ui/                       # Reusable UI components
│   ├── forms/                    # Form components
│   ├── layout/                   # Layout components
│   ├── features/                 # Feature-specific components
│   └── modals/                   # Modal components
├── config/                       # Configuration files
├── docs/                         # Documentation
├── entities/                     # Type definitions
│   ├── types/                    # Core types
│   ├── interfaces/               # Interfaces
│   ├── enums/                    # Enums
│   └── schemas/                  # Zod schemas
├── hooks/                        # Custom hooks
│   ├── api/                      # API hooks
│   ├── ui/                       # UI hooks
│   ├── state/                    # State hooks
│   └── features/                 # Feature hooks
├── pages/                        # Page components
│   ├── auth/                     # Auth pages
│   ├── dashboard/                # Dashboard pages
│   ├── wallet/                   # Wallet pages
│   └── calendar/                 # Calendar pages
├── server/                       # Server-side code
│   ├── endpoints/                # API endpoints
│   │   ├── trpc/                 # tRPC routers
│   │   ├── rest/                 # REST endpoints
│   │   └── webhooks/             # Webhook handlers
│   ├── db/                       # Database setup
│   └── auth/                     # Authentication
├── styles/                       # Styles and themes
├── tests/                        # Test files
├── utils/                        # Utility functions
└── assets/                       # Static assets
```

## Migration Strategy

### 1. Incremental Migration
- Migrate one module at a time
- Maintain backward compatibility during transition
- Use feature flags for gradual rollout

### 2. Automated Refactoring
- Use TypeScript path mapping for smooth imports
- Create migration scripts for bulk file moves
- Update import statements automatically

### 3. Testing Strategy
- Write tests before migration
- Ensure all functionality works after migration
- Update test configurations for new structure

### 4. Documentation Updates
- Update README files
- Create migration guides
- Document new folder structure

## Benefits of This Structure

1. **Scalability**: Easy to add new features and modules
2. **Maintainability**: Clear separation of concerns
3. **Reusability**: Shared components and utilities
4. **Testability**: Isolated modules for easier testing
5. **Developer Experience**: Clear file organization and imports
6. **Performance**: Better code splitting and lazy loading

## Migration Checklist

### Phase 1: Core Infrastructure
- [x] Set up new folder structure
- [x] Migrate common types and interfaces
- [x] Migrate wallet domain types and interfaces
- [x] Migrate auth domain types and interfaces
- [x] Migrate calendar domain types and interfaces
- [ ] Migrate API and UI domain types
- [ ] Reorganize API layer
- [ ] Update server endpoints
- [ ] Update all imports

### Phase 2: Application Layer
- [ ] Migrate pages
- [ ] Reorganize components
- [ ] Update routing
- [ ] Test page functionality

### Phase 3: Business Logic
- [ ] Migrate hooks
- [ ] Reorganize utilities
- [ ] Update component imports
- [ ] Test business logic

### Phase 4: Infrastructure
- [ ] Migrate configurations
- [ ] Reorganize styles
- [ ] Move assets
- [ ] Update build configuration

### Phase 5: Quality Assurance
- [ ] Set up testing structure
- [ ] Create documentation
- [ ] Run full test suite
- [ ] Performance testing

### Phase 6: Loading System
- [ ] Implement loading state management
- [ ] Add loading hooks
- [ ] Create loading UI components
- [ ] Test loading states

## Notes

- Each phase should be completed and tested before moving to the next
- Keep the existing functionality working during migration
- Create backup branches for each major change
- Document any breaking changes
- Update CI/CD pipelines for new structure

## Timeline

- **Week 1**: Phase 1 (Core Infrastructure)
- **Week 2**: Phase 2 (Application Layer)
- **Week 3**: Phase 3 (Business Logic) + Phase 4 (Infrastructure)
- **Week 4**: Phase 5 (Testing & Documentation) + Phase 6 (Loading System)

Total estimated time: 4 weeks

## Progress Log

### 2024-12-19 - Phase 1.1 Started
- ✅ Created new entities structure
- ✅ Migrated common types, interfaces, enums, and schemas
- ✅ Created index files for easy imports
- 🔄 Next: Migrate wallet domain types and interfaces

### 2024-12-19 - Phase 1.1 Progress Update
- ✅ Completed common domain migration
- ✅ Created modular structure with proper separation
- ✅ Added comprehensive Zod schemas for validation
- 🔄 Currently working on wallet domain migration

### 2024-12-19 - Phase 1.1 Wallet Domain Completed
- ✅ Migrated wallet types with comprehensive type definitions
- ✅ Migrated wallet interfaces with proper inheritance
- ✅ Created wallet enums for all wallet-related constants
- ✅ Added comprehensive Zod schemas for wallet validation
- 🔄 Next: Migrate auth domain types and interfaces

### 2024-12-19 - Phase 1.1 Auth Domain Completed
- ✅ Migrated auth types with comprehensive authentication types
- ✅ Migrated auth interfaces with proper database entity interfaces
- ✅ Created auth enums for all authentication-related constants
- ✅ Added comprehensive Zod schemas for auth validation including password strength validation
- 🔄 Next: Migrate calendar domain types and interfaces

### 2024-12-19 - Phase 1.1 Calendar Domain Completed
- ✅ Migrated calendar types with comprehensive calendar and event types
- ✅ Migrated calendar interfaces with proper calendar entity interfaces
- ✅ Created calendar enums for all calendar-related constants
- ✅ Added comprehensive Zod schemas for calendar validation
- 🔄 Next: Migrate API and UI domain types

### 2024-12-19 - Phase 2.1 Pages Organization Completed
- ✅ Created comprehensive pages directory structure with organized subdirectories
- ✅ Migrated authentication pages (signin) with updated routing
- ✅ Migrated dashboard pages including layout and all components
- ✅ Migrated wallet pages with complete functionality
- ✅ Migrated calendar pages including dynamic routes and view components
- ✅ Created professional error pages (404, 500) for better UX
- ✅ Updated all routing paths to use new pages structure
- ✅ Created home page in new pages structure with updated links
- 🔄 Next: Phase 2.2 - Components Organization

### 2024-12-19 - Phase 2.2 Components Organization Completed
- ✅ Created organized component directory structure with clear separation of concerns
- ✅ Migrated layout components (navbar, footer, global loading bar, animated sections)
- ✅ Migrated form components (transaction edit form, wallet form)
- ✅ Migrated modal components (modal base, bulk update modal, wallet form modal)
- ✅ Migrated table components (transaction list, transaction item, pagination controls, skeleton)
- ✅ Migrated chart components (counting stats, summary card)
- ✅ Organized feature-specific components by domain (wallet, calendar)
- ✅ Updated all import statements across the codebase for new component paths
- ✅ Cleaned up old atomic design structure (atoms, molecules, organisms, templates)
- ✅ Created comprehensive index files for easy imports and better modularity
- 🔄 Next: Phase 3 - Business Logic Layer

## Summary of Completed Work

### Phase 1.1 - Types & Interfaces Organization ✅ COMPLETED

**What was accomplished:**
1. **Created modular entities structure** with proper separation of concerns
2. **Migrated 4 major domains** with comprehensive type definitions:
   - **Common Domain**: Base entities, pagination, filters, notifications, UI components
   - **Wallet Domain**: Transactions, banks, payment methods, filters, Gmail integration
   - **Auth Domain**: Users, sessions, permissions, OAuth, 2FA, security events
   - **Calendar Domain**: Events, calendars, attendees, recurrence, reminders, sync

**Key Features Implemented:**
- **Type Safety**: Comprehensive TypeScript types for all domains
- **Interface Consistency**: Proper inheritance from BaseEntity
- **Enum Organization**: Domain-specific enums for constants
- **Zod Validation**: Complete validation schemas with proper constraints
- **Modular Structure**: Easy imports with index files
- **Extensibility**: Easy to add new domains and types

**Files Created:**
- `src/entities/types/` - 4 domain type files
- `src/entities/interfaces/` - 4 domain interface files
- `src/entities/enums/` - 4 domain enum files
- `src/entities/schemas/` - 4 domain Zod schema files
- Index files for easy imports

**Next Steps:**
- Complete API and UI domain types
- Begin Phase 1.2 (API Layer Organization)
- Update imports across the codebase
- Start Phase 2 (Application Layer)