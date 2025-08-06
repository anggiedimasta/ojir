import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'

// Mock session data
export const mockSession = {
  user: {
    id: 'test-user-id',
    name: 'Test User',
    email: 'test@example.com',
    image: 'https://example.com/avatar.jpg',
  },
  expires: '2024-12-31T23:59:59.999Z',
}

// Create a test query client
export const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: Infinity,
    },
    mutations: {
      retry: false,
    },
  },
})

// Wrapper component for providers
interface ProvidersProps {
  children: React.ReactNode
  session?: any
  queryClient?: QueryClient
}

const TestProviders: React.FC<ProvidersProps> = ({ 
  children, 
  session = null, 
  queryClient = createTestQueryClient() 
}) => {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </SessionProvider>
  )
}

// Custom render function
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  session?: any
  queryClient?: QueryClient
}

export const renderWithProviders = (
  ui: ReactElement,
  {
    session = null,
    queryClient = createTestQueryClient(),
    ...renderOptions
  }: CustomRenderOptions = {}
) => {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <TestProviders session={session} queryClient={queryClient}>
      {children}
    </TestProviders>
  )

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

// Mock data generators
export const mockTransaction = (overrides = {}) => ({
  id: 'transaction-1',
  amount: 100.00,
  description: 'Test transaction',
  category: 'Food & Dining',
  paymentMethod: 'Credit Card',
  date: new Date('2024-01-01'),
  walletId: 'wallet-1',
  userId: 'user-1',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  ...overrides,
})

export const mockWallet = (overrides = {}) => ({
  id: 'wallet-1',
  name: 'Test Wallet',
  balance: 1000.00,
  currency: 'USD',
  color: '#3B82F6',
  bankId: 'bank-1',
  userId: 'user-1',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  ...overrides,
})

export const mockBank = (overrides = {}) => ({
  id: 'bank-1',
  name: 'Test Bank',
  icon: 'test-bank-icon',
  ...overrides,
})

export const mockUser = (overrides = {}) => ({
  id: 'user-1',
  name: 'Test User',
  email: 'test@example.com',
  image: 'https://example.com/avatar.jpg',
  ...overrides,
})

// Test helpers
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0))

export const mockLocalStorage = () => {
  const store: Record<string, string> = {}
  
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key]
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key])
    }),
  }
}

// Mock fetch
export const mockFetch = (data: any, ok = true) => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok,
      json: () => Promise.resolve(data),
      text: () => Promise.resolve(JSON.stringify(data)),
    })
  ) as jest.Mock
}

// Re-export everything from testing-library/react
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'