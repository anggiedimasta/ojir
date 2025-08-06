// REST API endpoints
// This directory is for any REST endpoints that aren't covered by tRPC

// Example health check endpoint
export const restEndpoints = {
  healthCheck: '/api/health',
  webhooks: '/api/webhooks',
} as const;

// Future REST endpoints can be added here
// export * from './health';
// export * from './uploads';