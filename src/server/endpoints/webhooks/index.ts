// Webhook handlers
// This directory is for webhook endpoints from external services

export const webhookEndpoints = {
  stripe: '/api/webhooks/stripe',
  github: '/api/webhooks/github',
  general: '/api/webhooks',
} as const;

// Future webhook handlers can be added here
// export * from './stripe';
// export * from './github';