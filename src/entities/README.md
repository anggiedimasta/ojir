# Business Entities

This folder contains all centralized TypeScript interfaces and types for business logic entities. The entities are organized into logical modules with clear separation of concerns.

## Structure Overview

```
src/entities/
├── api/                # API types organized by domain
│   ├── common.ts       #   Shared API types and responses
│   ├── calendar.ts     #   Calendar API input/output types
│   ├── user.ts         #   User API input/output types
│   ├── auth.ts         #   Authentication API types
│   ├── organization.ts #   Organization API types
│   ├── project.ts      #   Project API types
│   ├── customer.ts     #   Customer API types
│   ├── financial.ts    #   Financial API types
│   ├── integration.ts  #   Integration API types
│   └── index.ts        #   Barrel export for all API types
├── common.ts           # Shared types used across multiple entities
├── user.ts             # User management and profiles
├── auth.ts             # Authentication and security
├── organization.ts     # Organizations, teams, and departments
├── project.ts          # Project and task management
├── customer.ts         # Customer relationship management
├── financial.ts        # Billing, payments, and products
├── calendar.ts         # Calendar and event management
├── integration.ts      # External service integrations
├── database.ts         # Database-specific entities
├── ui.ts              # UI-focused types (component-agnostic)
└── index.ts           # Barrel export for all entities
```

## Module Descriptions

### 🔧 Common (`common.ts`)
Base interfaces and utility types used across the application:
- `BaseEntity` - Standard fields for all entities (id, createdAt, updatedAt)
- `Address` - Standardized address structure
- `Attachment` - File attachment interface
- `Pagination` - API pagination types
- `ApiResponse` - Standard API response wrapper

### 🌐 API (`api/`)
Request and response types for API endpoints, organized by domain:

#### **`api/common.ts`** - Shared API types:
- `ApiResponse<T>` - Standard API response wrapper
- `TRPCErrorResponse` - tRPC-specific error structure
- `PaginatedInput` - Common pagination inputs
- `FilterInput` - Common filtering inputs
- `DateRangeInput` - Date range queries

#### **`api/calendar.ts`** - Calendar API types:
- `CalendarEventResponse` - Calendar event API responses
- `CreateCalendarEventInput` - Event creation inputs
- `GetCalendarEventsInput` - Event query inputs
- Google Calendar sync types

#### **`api/user.ts`** - User API types:
- `UserResponse` - User data from API
- `UpdateUserInput` - User update inputs
- `UserPreferencesResponse` - User preferences structure

#### **`api/auth.ts`** - Authentication API types:
- `SessionResponse` - Session data structure
- `LoginInput` - Login form inputs
- `OAuthCallbackInput` - OAuth flow inputs

#### **`api/organization.ts`** - Organization API types:
- `OrganizationResponse` - Organization data
- `TeamResponse` - Team data with member counts
- Team management inputs

#### **`api/project.ts`** - Project API types:
- `ProjectResponse` - Project data with progress
- `TaskResponse` - Task data structure
- Project and task management inputs

#### **`api/customer.ts`** - Customer API types:
- `CustomerResponse` - Customer data
- `ContactResponse` - Contact information
- CRM interaction inputs

#### **`api/financial.ts`** - Financial API types:
- `InvoiceResponse` - Invoice data structure
- `PaymentResponse` - Payment information
- Financial transaction inputs

#### **`api/integration.ts`** - Integration API types:
- `IntegrationResponse` - External integration status
- `WebhookResponse` - Webhook configuration
- OAuth and API key management

### 👤 User (`user.ts`)
User management and profile entities:
- `User` - Core user entity
- `UserProfile` - Extended user profile with preferences
- `UserPreferences` - User settings and preferences
- `Role` & `Permission` - RBAC system

### 🔐 Auth (`auth.ts`)
Authentication and security management:
- `ExtendedSession` - NextAuth session extensions
- `UserAccount` - OAuth provider accounts
- `LoginAttempt` - Authentication tracking
- `SecurityEvent` - Security monitoring

### 🏢 Organization (`organization.ts`)
Organizational structure entities:
- `Organization` - Company/organization details
- `Team` & `Department` - Organizational hierarchy
- `TeamMember` - Team membership and roles

### 📋 Project (`project.ts`)
Project and task management:
- `Project` - Project entities with budgets and timelines
- `Task` - Task management with dependencies
- `Milestone` - Project milestones
- `TaskComment` - Task collaboration

### 👥 Customer (`customer.ts`)
Customer relationship management:
- `Customer` - Customer/client entities
- `Contact` - Customer contact management
- `CustomerInteraction` - Interaction tracking
- `CustomerSource` - Lead source tracking

### 💰 Financial (`financial.ts`)
Billing and financial management:
- `Invoice` - Invoice management
- `Payment` - Payment tracking
- `Product` - Product catalog
- `Order` - Order management
- Tax and discount structures

### 📅 Calendar (`calendar.ts`)
Calendar and event management:
- `CalendarEvent` - Internal calendar events
- `Calendar` - Calendar management
- `EventAttendee` - Event participation
- `RecurrenceRule` - Recurring events

### 🔌 Integration (`integration.ts`)
External service integrations:
- `GoogleCalendarEvent` - Google Calendar specific types
- `ExternalIntegration` - Generic integration framework
- `Webhook` - Webhook management
- `ApiKey` - API access management

### 🗄️ Database (`database.ts`)
Database-specific entities:
- Record types that map to actual database tables
- Migration and schema management
- Query performance monitoring
- Backup and maintenance tracking

### 🎨 UI (`ui.ts`)
UI-focused types (component-agnostic):
- Navigation and menu structures
- Form field definitions
- Table and chart configurations
- Modal and dialog types
- Theme and styling types

## Usage Guidelines

### Import Patterns
```typescript
// Preferred: Import from the main barrel export
import type { User, Organization, CalendarEvent } from '~/entities';

// For API types specifically
import type { CalendarEventResponse, CreateCalendarEventInput } from '~/entities/api/calendar';

// For all API types from a domain
import type { UserResponse, UpdateUserInput } from '~/entities/api/user';

// For common API types
import type { ApiResponse, PaginatedInput } from '~/entities/api/common';
```

### Entity vs API Types
- **Business entities** (`calendar.ts`) represent the complete business model
- **API types** (`api/calendar.ts`) represent what APIs actually send/receive
- Use API types in components that consume tRPC endpoints
- Use business entities for business logic and comprehensive data models

### Component-Specific Types
Types that are specific to individual components should remain in the component files:
- Component prop interfaces
- Local state types
- Component-specific enums
- View-specific data transformations

### Naming Conventions
- **Business Entities**: PascalCase descriptive names (`User`, `CalendarEvent`)
- **API Response Types**: Suffix with `Response` (`UserResponse`, `CalendarEventResponse`)
- **API Input Types**: Suffix with `Input` (`CreateEventInput`, `UpdateUserInput`)
- **Enums**: Descriptive type names (`EventStatus`, `PaymentMethod`)
- **Base Types**: Generic names (`BaseEntity`, `ApiResponse<T>`)

## Best Practices

1. **Domain Separation**: API types are organized by business domain
2. **Single Responsibility**: Each API file focuses on one domain's API contracts
3. **Type Safety**: All interfaces are strongly typed with proper optional fields
4. **Reusability**: Common API patterns shared via `api/common.ts`
5. **Documentation**: Complex types include JSDoc comments
6. **Consistency**: Shared patterns across all API modules

## Adding New API Types

When adding new API types:

1. Determine the appropriate domain module in `api/`
2. Add input/response types to the relevant domain file
3. Follow existing naming conventions (`*Input`, `*Response`)
4. Use shared types from `api/common.ts` when possible
5. Update the barrel export in `api/index.ts`
6. Add documentation to this README

## Adding New Business Entities

When adding new business entities:

1. Create a new file in the appropriate domain
2. Follow existing patterns for interface structure
3. Use shared types from `common.ts` when possible
4. Add to the barrel export in `index.ts`
5. Update this README with the new module

## Migration Notes

This restructured API organization provides:
- **Better organization** of API types by business domain
- **Clearer separation** between API contracts and business entities
- **Improved maintainability** for large API surfaces
- **Domain-focused development** - work within specific business areas
- **Reduced cognitive load** - find related API types quickly