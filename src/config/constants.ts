// Application constants

export const APP_CONFIG = {
  name: "Ojir",
  description: "Track your expenses with ease",
  version: "1.0.0",
  author: "Ojir Team",
  
  // UI Constants
  ui: {
    sidebarWidth: {
      expanded: 280,
      collapsed: 80,
    },
    navbarHeight: 64,
    maxContentWidth: 1200,
  },
  
  // Pagination
  pagination: {
    defaultPageSize: 20,
    pageSizeOptions: [10, 20, 50, 100],
    maxPageSize: 100,
  },
  
  // File upload
  fileUpload: {
    maxSizeBytes: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
  },
  
  // Animation durations (ms)
  animations: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
} as const;

// Wallet specific constants
export const WALLET_CONFIG = {
  currencies: {
    default: "USD",
    supported: ["USD", "EUR", "GBP", "JPY", "CAD", "AUD"],
  },
  
  transactionLimits: {
    minAmount: 0.01,
    maxAmount: 999999.99,
  },
  
  categories: {
    default: "Uncategorized",
    system: ["Uncategorized", "Income", "Transfer"],
  },
} as const;

// Calendar specific constants
export const CALENDAR_CONFIG = {
  views: ["month", "week", "day"] as const,
  defaultView: "month" as const,
  
  timeFormats: {
    "12h": "h:mm A",
    "24h": "HH:mm",
  },
  
  dateFormats: {
    short: "MM/dd/yyyy",
    medium: "MMM dd, yyyy",
    long: "MMMM dd, yyyy",
  },
} as const;