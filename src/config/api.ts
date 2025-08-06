import { env } from "./env";

export const apiConfig = {
  // Base URLs
  baseUrl: env.NODE_ENV === "production" 
    ? "https://your-production-domain.com" 
    : "http://localhost:3000",
  
  // API Routes
  routes: {
    auth: "/api/auth",
    trpc: "/api/trpc",
    healthCheck: "/api/health",
  },
  
  // Request settings
  requests: {
    timeout: 30000, // 30 seconds
    retries: 3,
    retryDelay: 1000, // 1 second
  },
  
  // Rate limiting
  rateLimit: {
    max: 100, // requests per window
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  
  // CORS settings
  cors: {
    origin: env.NODE_ENV === "production" 
      ? ["https://your-production-domain.com"]
      : ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
} as const;