import { env } from "./env";

export const databaseConfig = {
  url: env.DATABASE_URL,
  
  // Connection pool settings
  connection: {
    max: 10,
    min: 2,
    acquireTimeoutMillis: 30000,
    idleTimeoutMillis: 30000,
  },
  
  // Migration settings
  migrations: {
    directory: "./drizzle",
    tableName: "migrations",
  },
  
  // Development settings
  development: {
    logging: env.NODE_ENV === "development",
    debug: env.NODE_ENV === "development",
  },
} as const;