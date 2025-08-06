# Ojir Documentation

Welcome to the comprehensive documentation for Ojir - a modern expense tracking application built with Next.js 15, tRPC, and PostgreSQL.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Architecture Overview](#architecture-overview)
- [API Documentation](#api-documentation)
- [Component Library](#component-library)
- [Hooks & Utilities](#hooks--utilities)
- [Development Guides](#development-guides)
- [Deployment](#deployment)

## 🚀 Getting Started

### Quick Start
```bash
# Clone the repository
git clone <repository-url>
cd ojir

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env.local

# Start the database
./start-database.sh

# Run database migrations
bun run db:push

# Start the development server
bun run dev
```

### Prerequisites
- Node.js 18.0.0 or higher
- Bun 1.0.0 or higher
- PostgreSQL database (Neon recommended)
- Google OAuth credentials

## 🏗️ Architecture Overview

Ojir follows a modular, domain-driven architecture with clear separation of concerns:

```
src/
├── app/              # Next.js App Router (legacy routes)
├── pages/            # Organized page components
├── components/       # Reusable UI components
├── hooks/            # Custom React hooks
├── utils/            # Utility functions
├── config/           # Configuration files
├── assets/           # Static assets
├── styles/           # CSS and styling
├── api/              # API layer
├── server/           # Server-side code
├── entities/         # Type definitions
├── store/            # State management
└── __tests__/        # Test files
```

### Key Technologies
- **Frontend**: Next.js 15 with App Router, React 19, TypeScript
- **Backend**: tRPC, Drizzle ORM, NextAuth.js
- **Database**: PostgreSQL with Neon
- **Styling**: Tailwind CSS, CSS Variables
- **State Management**: Zustand
- **Testing**: Jest, React Testing Library

## 📚 Documentation Sections

### [API Documentation](./api/README.md)
Complete reference for all tRPC endpoints, including:
- Authentication endpoints
- Wallet management
- Transaction operations
- User preferences

### [Component Library](./components/README.md)
Documentation for all reusable components:
- UI Components (buttons, cards, modals)
- Form Components (inputs, selectors)
- Layout Components (navbar, sidebar)
- Feature Components (wallet, calendar)

### [Hooks & Utilities](./hooks/README.md)
Custom hooks and utility functions:
- API hooks for data fetching
- UI hooks for common patterns
- State management hooks
- Utility functions for formatting, validation

### [Development Guides](./guides/README.md)
Step-by-step guides for common development tasks:
- Adding new features
- Creating components
- Testing strategies
- Performance optimization

### [Deployment](./deployment/README.md)
Production deployment guides:
- Vercel deployment
- Environment configuration
- Database setup
- Monitoring and logging

## 🎯 Key Features

- **💰 Wallet Management**: Create and manage multiple wallets with different currencies
- **📊 Transaction Tracking**: Record, categorize, and analyze your expenses
- **📅 Calendar Integration**: View transactions in calendar format
- **🔐 Secure Authentication**: Google OAuth integration with NextAuth.js
- **📱 Responsive Design**: Mobile-first, responsive user interface
- **🎨 Modern UI**: Beautiful, accessible components with Tailwind CSS
- **⚡ High Performance**: Optimized with Next.js 15 and React 19
- **🧪 Well Tested**: Comprehensive test coverage with Jest

## 📖 Quick Examples

### Creating a New Component
```tsx
// src/components/ui/my-component.tsx
import { cn } from '~/utils'

interface MyComponentProps {
  className?: string
  children: React.ReactNode
}

export const MyComponent: React.FC<MyComponentProps> = ({
  className,
  children
}) => {
  return (
    <div className={cn('base-styles', className)}>
      {children}
    </div>
  )
}
```

### Using API Hooks
```tsx
// In your component
import { api } from '~/trpc/react'

export const WalletList = () => {
  const { data: wallets, isLoading } = api.wallet.getAll.useQuery()
  
  if (isLoading) return <div>Loading...</div>
  
  return (
    <div>
      {wallets?.map(wallet => (
        <div key={wallet.id}>{wallet.name}</div>
      ))}
    </div>
  )
}
```

### Adding Configuration
```typescript
// src/config/my-feature.ts
export const myFeatureConfig = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL,
  timeout: 5000,
  retries: 3,
} as const
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes and add tests
4. Run tests: `bun run test`
5. Commit your changes: `git commit -m 'Add my feature'`
6. Push to the branch: `git push origin feature/my-feature`
7. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- [GitHub Issues](https://github.com/your-repo/issues)
- [Documentation](./README.md)
- [API Reference](./api/README.md)

---

*Built with ❤️ using modern web technologies*