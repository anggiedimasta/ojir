// API Queries
// This file contains all the API query definitions for the application

// Auth Queries
export const GET_CURRENT_USER_QUERY = 'auth.currentUser';
export const GET_USER_PROFILE_QUERY = 'auth.userProfile';
export const GET_USER_PREFERENCES_QUERY = 'auth.userPreferences';
export const GET_USER_SETTINGS_QUERY = 'auth.userSettings';
export const GET_SESSION_QUERY = 'auth.session';
export const GET_SESSIONS_QUERY = 'auth.sessions';
export const GET_TWO_FACTOR_STATUS_QUERY = 'auth.twoFactorStatus';
export const GET_BACKUP_CODES_QUERY = 'auth.backupCodes';
export const GET_OAUTH_PROVIDERS_QUERY = 'auth.oauthProviders';
export const GET_OAUTH_PROFILE_QUERY = 'auth.oauthProfile';

// User Queries
export const GET_USERS_QUERY = 'user.list';
export const GET_USER_BY_ID_QUERY = 'user.byId';
export const GET_USER_BY_EMAIL_QUERY = 'user.byEmail';
export const GET_USER_AVATAR_QUERY = 'user.avatar';
export const GET_USER_ACTIVITY_QUERY = 'user.activity';
export const GET_USER_STATS_QUERY = 'user.stats';
export const GET_USER_REPORTS_QUERY = 'user.reports';
export const GET_USER_NOTIFICATIONS_QUERY = 'user.notifications';
export const GET_USER_PERMISSIONS_QUERY = 'user.permissions';
export const GET_USER_ROLES_QUERY = 'user.roles';

// Wallet Queries
export const GET_WALLETS_QUERY = 'wallet.list';
export const GET_WALLET_BY_ID_QUERY = 'wallet.byId';
export const GET_WALLET_BALANCE_QUERY = 'wallet.balance';
export const GET_WALLET_STATS_QUERY = 'wallet.stats';
export const GET_WALLET_REPORTS_QUERY = 'wallet.reports';
export const GET_TRANSACTIONS_QUERY = 'wallet.transactions';
export const GET_TRANSACTION_BY_ID_QUERY = 'wallet.transactionById';
export const GET_TRANSACTION_STATS_QUERY = 'wallet.transactionStats';
export const GET_TRANSACTION_REPORTS_QUERY = 'wallet.transactionReports';
export const GET_BANKS_QUERY = 'wallet.banks';
export const GET_BANK_BY_ID_QUERY = 'wallet.bankById';
export const GET_PAYMENT_METHODS_QUERY = 'wallet.paymentMethods';
export const GET_PAYMENT_METHOD_BY_ID_QUERY = 'wallet.paymentMethodById';
export const GET_WALLET_ANALYTICS_QUERY = 'wallet.analytics';
export const GET_WALLET_EXPORT_QUERY = 'wallet.export';
export const GET_WALLET_IMPORT_TEMPLATE_QUERY = 'wallet.importTemplate';

// Calendar Queries
export const GET_CALENDARS_QUERY = 'calendar.list';
export const GET_CALENDAR_BY_ID_QUERY = 'calendar.byId';
export const GET_CALENDAR_EVENTS_QUERY = 'calendar.events';
export const GET_EVENT_BY_ID_QUERY = 'calendar.eventById';
export const GET_EVENT_ATTENDEES_QUERY = 'calendar.eventAttendees';
export const GET_EVENT_REMINDERS_QUERY = 'calendar.eventReminders';
export const GET_EVENT_ATTACHMENTS_QUERY = 'calendar.eventAttachments';
export const GET_CALENDAR_SHARES_QUERY = 'calendar.shares';
export const GET_CALENDAR_PERMISSIONS_QUERY = 'calendar.permissions';
export const GET_CALENDAR_SETTINGS_QUERY = 'calendar.settings';
export const GET_CALENDAR_ANALYTICS_QUERY = 'calendar.analytics';
export const GET_CALENDAR_EXPORT_QUERY = 'calendar.export';
export const GET_CALENDAR_SYNC_STATUS_QUERY = 'calendar.syncStatus';

// Organization Queries
export const GET_ORGANIZATIONS_QUERY = 'organization.list';
export const GET_ORGANIZATION_BY_ID_QUERY = 'organization.byId';
export const GET_ORGANIZATION_MEMBERS_QUERY = 'organization.members';
export const GET_ORGANIZATION_INVITATIONS_QUERY = 'organization.invitations';
export const GET_ORGANIZATION_ROLES_QUERY = 'organization.roles';
export const GET_ORGANIZATION_PERMISSIONS_QUERY = 'organization.permissions';
export const GET_ORGANIZATION_SETTINGS_QUERY = 'organization.settings';
export const GET_ORGANIZATION_STATS_QUERY = 'organization.stats';
export const GET_ORGANIZATION_REPORTS_QUERY = 'organization.reports';
export const GET_ORGANIZATION_ANALYTICS_QUERY = 'organization.analytics';

// Notification Queries
export const GET_NOTIFICATIONS_QUERY = 'notification.list';
export const GET_NOTIFICATION_BY_ID_QUERY = 'notification.byId';
export const GET_NOTIFICATION_SETTINGS_QUERY = 'notification.settings';
export const GET_NOTIFICATION_TEMPLATES_QUERY = 'notification.templates';
export const GET_NOTIFICATION_STATS_QUERY = 'notification.stats';
export const GET_UNREAD_NOTIFICATIONS_QUERY = 'notification.unread';
export const GET_NOTIFICATION_HISTORY_QUERY = 'notification.history';

// File Queries
export const GET_FILES_QUERY = 'file.list';
export const GET_FILE_BY_ID_QUERY = 'file.byId';
export const GET_FILE_METADATA_QUERY = 'file.metadata';
export const GET_FILE_VERSIONS_QUERY = 'file.versions';
export const GET_FILE_SHARES_QUERY = 'file.shares';
export const GET_FILE_PERMISSIONS_QUERY = 'file.permissions';
export const GET_FILE_STATS_QUERY = 'file.stats';
export const GET_FILE_ANALYTICS_QUERY = 'file.analytics';

// Settings Queries
export const GET_APP_SETTINGS_QUERY = 'settings.app';
export const GET_USER_SETTINGS_CONFIG_QUERY = 'settings.user';
export const GET_ORGANIZATION_SETTINGS_CONFIG_QUERY = 'settings.organization';
export const GET_SYSTEM_SETTINGS_QUERY = 'settings.system';
export const GET_FEATURE_FLAGS_QUERY = 'settings.featureFlags';
export const GET_CONFIGURATION_QUERY = 'settings.configuration';

// Analytics Queries
export const GET_ANALYTICS_DASHBOARD_QUERY = 'analytics.dashboard';
export const GET_ANALYTICS_REPORTS_QUERY = 'analytics.reports';
export const GET_ANALYTICS_EVENTS_QUERY = 'analytics.events';
export const GET_ANALYTICS_METRICS_QUERY = 'analytics.metrics';
export const GET_ANALYTICS_PERFORMANCE_QUERY = 'analytics.performance';
export const GET_ANALYTICS_ERRORS_QUERY = 'analytics.errors';
export const GET_ANALYTICS_USERS_QUERY = 'analytics.users';
export const GET_ANALYTICS_SESSIONS_QUERY = 'analytics.sessions';

// Backup & Sync Queries
export const GET_BACKUPS_QUERY = 'backup.list';
export const GET_BACKUP_BY_ID_QUERY = 'backup.byId';
export const GET_BACKUP_STATUS_QUERY = 'backup.status';
export const GET_SYNC_STATUS_QUERY = 'sync.status';
export const GET_SYNC_HISTORY_QUERY = 'sync.history';
export const GET_SYNC_CONFLICTS_QUERY = 'sync.conflicts';
export const GET_SYNC_SETTINGS_QUERY = 'sync.settings';

// Integration Queries
export const GET_INTEGRATIONS_QUERY = 'integration.list';
export const GET_INTEGRATION_BY_ID_QUERY = 'integration.byId';
export const GET_INTEGRATION_STATUS_QUERY = 'integration.status';
export const GET_INTEGRATION_SETTINGS_QUERY = 'integration.settings';
export const GET_INTEGRATION_LOGS_QUERY = 'integration.logs';
export const GET_INTEGRATION_METRICS_QUERY = 'integration.metrics';
export const GET_AVAILABLE_INTEGRATIONS_QUERY = 'integration.available';

// Webhook Queries
export const GET_WEBHOOKS_QUERY = 'webhook.list';
export const GET_WEBHOOK_BY_ID_QUERY = 'webhook.byId';
export const GET_WEBHOOK_LOGS_QUERY = 'webhook.logs';
export const GET_WEBHOOK_DELIVERIES_QUERY = 'webhook.deliveries';
export const GET_WEBHOOK_STATS_QUERY = 'webhook.stats';
export const GET_WEBHOOK_SETTINGS_QUERY = 'webhook.settings';

// API Key Queries
export const GET_API_KEYS_QUERY = 'apiKey.list';
export const GET_API_KEY_BY_ID_QUERY = 'apiKey.byId';
export const GET_API_KEY_USAGE_QUERY = 'apiKey.usage';
export const GET_API_KEY_PERMISSIONS_QUERY = 'apiKey.permissions';
export const GET_API_KEY_LOGS_QUERY = 'apiKey.logs';
export const GET_API_KEY_STATS_QUERY = 'apiKey.stats';

// Audit Log Queries
export const GET_AUDIT_LOGS_QUERY = 'auditLog.list';
export const GET_AUDIT_LOG_BY_ID_QUERY = 'auditLog.byId';
export const GET_AUDIT_LOG_STATS_QUERY = 'auditLog.stats';
export const GET_AUDIT_LOG_REPORTS_QUERY = 'auditLog.reports';
export const GET_AUDIT_LOG_EXPORT_QUERY = 'auditLog.export';

// Report Queries
export const GET_REPORTS_QUERY = 'report.list';
export const GET_REPORT_BY_ID_QUERY = 'report.byId';
export const GET_REPORT_TEMPLATES_QUERY = 'report.templates';
export const GET_REPORT_SCHEDULES_QUERY = 'report.schedules';
export const GET_REPORT_GENERATION_STATUS_QUERY = 'report.generationStatus';
export const GET_REPORT_EXPORT_QUERY = 'report.export';

// Template Queries
export const GET_TEMPLATES_QUERY = 'template.list';
export const GET_TEMPLATE_BY_ID_QUERY = 'template.byId';
export const GET_TEMPLATE_CATEGORIES_QUERY = 'template.categories';
export const GET_TEMPLATE_VERSIONS_QUERY = 'template.versions';
export const GET_TEMPLATE_SHARES_QUERY = 'template.shares';
export const GET_TEMPLATE_STATS_QUERY = 'template.stats';
export const GET_TEMPLATE_EXPORT_QUERY = 'template.export';

// Workflow Queries
export const GET_WORKFLOWS_QUERY = 'workflow.list';
export const GET_WORKFLOW_BY_ID_QUERY = 'workflow.byId';
export const GET_WORKFLOW_EXECUTIONS_QUERY = 'workflow.executions';
export const GET_WORKFLOW_LOGS_QUERY = 'workflow.logs';
export const GET_WORKFLOW_STATS_QUERY = 'workflow.stats';
export const GET_WORKFLOW_TEMPLATES_QUERY = 'workflow.templates';
export const GET_WORKFLOW_EXPORT_QUERY = 'workflow.export';

// Automation Queries
export const GET_AUTOMATIONS_QUERY = 'automation.list';
export const GET_AUTOMATION_BY_ID_QUERY = 'automation.byId';
export const GET_AUTOMATION_EXECUTIONS_QUERY = 'automation.executions';
export const GET_AUTOMATION_LOGS_QUERY = 'automation.logs';
export const GET_AUTOMATION_STATS_QUERY = 'automation.stats';
export const GET_AUTOMATION_TRIGGERS_QUERY = 'automation.triggers';
export const GET_AUTOMATION_ACTIONS_QUERY = 'automation.actions';

// Comment Queries
export const GET_COMMENTS_QUERY = 'comment.list';
export const GET_COMMENT_BY_ID_QUERY = 'comment.byId';
export const GET_COMMENT_REPLIES_QUERY = 'comment.replies';
export const GET_COMMENT_LIKES_QUERY = 'comment.likes';
export const GET_COMMENT_STATS_QUERY = 'comment.stats';
export const GET_COMMENT_REPORTS_QUERY = 'comment.reports';

// Tag Queries
export const GET_TAGS_QUERY = 'tag.list';
export const GET_TAG_BY_ID_QUERY = 'tag.byId';
export const GET_TAG_USAGE_QUERY = 'tag.usage';
export const GET_TAG_STATS_QUERY = 'tag.stats';
export const GET_TAG_SUGGESTIONS_QUERY = 'tag.suggestions';
export const GET_TAG_CATEGORIES_QUERY = 'tag.categories';

// Category Queries
export const GET_CATEGORIES_QUERY = 'category.list';
export const GET_CATEGORY_BY_ID_QUERY = 'category.byId';
export const GET_CATEGORY_HIERARCHY_QUERY = 'category.hierarchy';
export const GET_CATEGORY_ITEMS_QUERY = 'category.items';
export const GET_CATEGORY_STATS_QUERY = 'category.stats';
export const GET_CATEGORY_SUGGESTIONS_QUERY = 'category.suggestions';

// Search Queries
export const SEARCH_GLOBAL_QUERY = 'search.global';
export const SEARCH_WALLET_QUERY = 'search.wallet';
export const SEARCH_CALENDAR_QUERY = 'search.calendar';
export const SEARCH_USERS_QUERY = 'search.users';
export const SEARCH_FILES_QUERY = 'search.files';
export const GET_SAVED_SEARCHES_QUERY = 'search.saved';
export const GET_SEARCH_SUGGESTIONS_QUERY = 'search.suggestions';
export const GET_SEARCH_HISTORY_QUERY = 'search.history';
export const GET_SEARCH_ANALYTICS_QUERY = 'search.analytics';

// Export/Import Queries
export const GET_EXPORT_STATUS_QUERY = 'export.status';
export const GET_EXPORT_HISTORY_QUERY = 'export.history';
export const GET_IMPORT_STATUS_QUERY = 'import.status';
export const GET_IMPORT_HISTORY_QUERY = 'import.history';
export const GET_IMPORT_TEMPLATES_QUERY = 'import.templates';
export const GET_IMPORT_VALIDATION_QUERY = 'import.validation';

// System Queries
export const GET_SYSTEM_STATUS_QUERY = 'system.status';
export const GET_SYSTEM_HEALTH_QUERY = 'system.health';
export const GET_SYSTEM_METRICS_QUERY = 'system.metrics';
export const GET_SYSTEM_LOGS_QUERY = 'system.logs';
export const GET_SYSTEM_CONFIGURATION_QUERY = 'system.configuration';
export const GET_SYSTEM_UPDATES_QUERY = 'system.updates';
export const GET_SYSTEM_BACKUPS_QUERY = 'system.backups';
export const GET_SYSTEM_MAINTENANCE_QUERY = 'system.maintenance';

// Health Check Queries
export const GET_HEALTH_STATUS_QUERY = 'health.status';
export const GET_HEALTH_CHECKS_QUERY = 'health.checks';
export const GET_HEALTH_METRICS_QUERY = 'health.metrics';
export const GET_HEALTH_ISSUES_QUERY = 'health.issues';
export const GET_HEALTH_REPORTS_QUERY = 'health.reports';
export const GET_HEALTH_HISTORY_QUERY = 'health.history';

// Maintenance Queries
export const GET_MAINTENANCE_STATUS_QUERY = 'maintenance.status';
export const GET_MAINTENANCE_SCHEDULE_QUERY = 'maintenance.schedule';
export const GET_MAINTENANCE_HISTORY_QUERY = 'maintenance.history';
export const GET_MAINTENANCE_TASKS_QUERY = 'maintenance.tasks';
export const GET_MAINTENANCE_LOGS_QUERY = 'maintenance.logs';

// Migration Queries
export const GET_MIGRATION_STATUS_QUERY = 'migration.status';
export const GET_MIGRATION_HISTORY_QUERY = 'migration.history';
export const GET_MIGRATION_PENDING_QUERY = 'migration.pending';
export const GET_MIGRATION_FAILED_QUERY = 'migration.failed';
export const GET_MIGRATION_LOGS_QUERY = 'migration.logs';

// Seed Queries
export const GET_SEED_STATUS_QUERY = 'seed.status';
export const GET_SEED_HISTORY_QUERY = 'seed.history';
export const GET_SEED_DATA_QUERY = 'seed.data';
export const GET_SEED_TEMPLATES_QUERY = 'seed.templates';

// Test Queries
export const GET_TEST_STATUS_QUERY = 'test.status';
export const GET_TEST_RESULTS_QUERY = 'test.results';
export const GET_TEST_HISTORY_QUERY = 'test.history';
export const GET_TEST_REPORTS_QUERY = 'test.reports';
export const GET_TEST_COVERAGE_QUERY = 'test.coverage';
export const GET_TEST_METRICS_QUERY = 'test.metrics';

// Dashboard Queries
export const GET_DASHBOARD_DATA_QUERY = 'dashboard.data';
export const GET_DASHBOARD_WIDGETS_QUERY = 'dashboard.widgets';
export const GET_DASHBOARD_LAYOUT_QUERY = 'dashboard.layout';
export const GET_DASHBOARD_SETTINGS_QUERY = 'dashboard.settings';
export const GET_DASHBOARD_ANALYTICS_QUERY = 'dashboard.analytics';

// Menu Queries
export const GET_MENU_ITEMS_QUERY = 'menu.items';
export const GET_MENU_STRUCTURE_QUERY = 'menu.structure';
export const GET_MENU_PERMISSIONS_QUERY = 'menu.permissions';
export const GET_MENU_SETTINGS_QUERY = 'menu.settings';

// Navigation Queries
export const GET_NAVIGATION_ITEMS_QUERY = 'navigation.items';
export const GET_NAVIGATION_BREADCRUMBS_QUERY = 'navigation.breadcrumbs';
export const GET_NAVIGATION_HISTORY_QUERY = 'navigation.history';
export const GET_NAVIGATION_SUGGESTIONS_QUERY = 'navigation.suggestions';

// Cache Queries
export const GET_CACHE_STATUS_QUERY = 'cache.status';
export const GET_CACHE_METRICS_QUERY = 'cache.metrics';
export const GET_CACHE_KEYS_QUERY = 'cache.keys';
export const GET_CACHE_STATS_QUERY = 'cache.stats';

// Queue Queries
export const GET_QUEUE_STATUS_QUERY = 'queue.status';
export const GET_QUEUE_JOBS_QUERY = 'queue.jobs';
export const GET_QUEUE_METRICS_QUERY = 'queue.metrics';
export const GET_QUEUE_STATS_QUERY = 'queue.stats';
export const GET_QUEUE_FAILED_QUERY = 'queue.failed';

// Job Queries
export const GET_JOB_STATUS_QUERY = 'job.status';
export const GET_JOB_PROGRESS_QUERY = 'job.progress';
export const GET_JOB_LOGS_QUERY = 'job.logs';
export const GET_JOB_RESULT_QUERY = 'job.result';
export const GET_JOB_HISTORY_QUERY = 'job.history';

// Task Queries
export const GET_TASKS_QUERY = 'task.list';
export const GET_TASK_BY_ID_QUERY = 'task.byId';
export const GET_TASK_STATUS_QUERY = 'task.status';
export const GET_TASK_PROGRESS_QUERY = 'task.progress';
export const GET_TASK_LOGS_QUERY = 'task.logs';
export const GET_TASK_RESULT_QUERY = 'task.result';
export const GET_TASK_HISTORY_QUERY = 'task.history';
export const GET_TASK_SCHEDULE_QUERY = 'task.schedule';
export const GET_TASK_DEPENDENCIES_QUERY = 'task.dependencies';

// Schedule Queries
export const GET_SCHEDULES_QUERY = 'schedule.list';
export const GET_SCHEDULE_BY_ID_QUERY = 'schedule.byId';
export const GET_SCHEDULE_STATUS_QUERY = 'schedule.status';
export const GET_SCHEDULE_NEXT_RUN_QUERY = 'schedule.nextRun';
export const GET_SCHEDULE_HISTORY_QUERY = 'schedule.history';
export const GET_SCHEDULE_LOGS_QUERY = 'schedule.logs';

// Cron Queries
export const GET_CRON_JOBS_QUERY = 'cron.jobs';
export const GET_CRON_STATUS_QUERY = 'cron.status';
export const GET_CRON_HISTORY_QUERY = 'cron.history';
export const GET_CRON_LOGS_QUERY = 'cron.logs';
export const GET_CRON_METRICS_QUERY = 'cron.metrics';

// Event Queries
export const GET_EVENTS_QUERY = 'event.list';
export const GET_SYSTEM_EVENT_BY_ID_QUERY = 'event.byId';
export const GET_EVENT_TYPES_QUERY = 'event.types';
export const GET_EVENT_HANDLERS_QUERY = 'event.handlers';
export const GET_EVENT_LOGS_QUERY = 'event.logs';
export const GET_EVENT_STATS_QUERY = 'event.stats';

// Listener Queries
export const GET_LISTENERS_QUERY = 'listener.list';
export const GET_LISTENER_BY_ID_QUERY = 'listener.byId';
export const GET_LISTENER_STATUS_QUERY = 'listener.status';
export const GET_LISTENER_LOGS_QUERY = 'listener.logs';
export const GET_LISTENER_METRICS_QUERY = 'listener.metrics';

// Middleware Queries
export const GET_MIDDLEWARE_QUERY = 'middleware.list';
export const GET_MIDDLEWARE_BY_ID_QUERY = 'middleware.byId';
export const GET_MIDDLEWARE_STATUS_QUERY = 'middleware.status';
export const GET_MIDDLEWARE_LOGS_QUERY = 'middleware.logs';
export const GET_MIDDLEWARE_METRICS_QUERY = 'middleware.metrics';

// Route Queries
export const GET_ROUTES_QUERY = 'route.list';
export const GET_ROUTE_BY_ID_QUERY = 'route.byId';
export const GET_ROUTE_STATUS_QUERY = 'route.status';
export const GET_ROUTE_LOGS_QUERY = 'route.logs';
export const GET_ROUTE_METRICS_QUERY = 'route.metrics';
export const GET_ROUTE_PERMISSIONS_QUERY = 'route.permissions';

// Controller Queries
export const GET_CONTROLLERS_QUERY = 'controller.list';
export const GET_CONTROLLER_BY_ID_QUERY = 'controller.byId';
export const GET_CONTROLLER_METHODS_QUERY = 'controller.methods';
export const GET_CONTROLLER_LOGS_QUERY = 'controller.logs';
export const GET_CONTROLLER_METRICS_QUERY = 'controller.metrics';

// Service Queries
export const GET_SERVICES_QUERY = 'service.list';
export const GET_SERVICE_BY_ID_QUERY = 'service.byId';
export const GET_SERVICE_STATUS_QUERY = 'service.status';
export const GET_SERVICE_LOGS_QUERY = 'service.logs';
export const GET_SERVICE_METRICS_QUERY = 'service.metrics';
export const GET_SERVICE_DEPENDENCIES_QUERY = 'service.dependencies';

// Repository Queries
export const GET_REPOSITORIES_QUERY = 'repository.list';
export const GET_REPOSITORY_BY_ID_QUERY = 'repository.byId';
export const GET_REPOSITORY_STATUS_QUERY = 'repository.status';
export const GET_REPOSITORY_LOGS_QUERY = 'repository.logs';
export const GET_REPOSITORY_METRICS_QUERY = 'repository.metrics';

// Model Queries
export const GET_MODELS_QUERY = 'model.list';
export const GET_MODEL_BY_ID_QUERY = 'model.byId';
export const GET_MODEL_SCHEMA_QUERY = 'model.schema';
export const GET_MODEL_RELATIONS_QUERY = 'model.relations';
export const GET_MODEL_VALIDATIONS_QUERY = 'model.validations';
export const GET_MODEL_METRICS_QUERY = 'model.metrics';

// Database Queries
export const GET_DATABASE_STATUS_QUERY = 'database.status';
export const GET_DATABASE_METRICS_QUERY = 'database.metrics';
export const GET_DATABASE_LOGS_QUERY = 'database.logs';
export const GET_DATABASE_CONNECTIONS_QUERY = 'database.connections';
export const GET_DATABASE_TABLES_QUERY = 'database.tables';
export const GET_DATABASE_INDEXES_QUERY = 'database.indexes';
export const GET_DATABASE_CONSTRAINTS_QUERY = 'database.constraints';
export const GET_DATABASE_TRIGGERS_QUERY = 'database.triggers';
export const GET_DATABASE_PROCEDURES_QUERY = 'database.procedures';
export const GET_DATABASE_FUNCTIONS_QUERY = 'database.functions';
export const GET_DATABASE_VIEWS_QUERY = 'database.views';
export const GET_DATABASE_SEQUENCES_QUERY = 'database.sequences';
export const GET_DATABASE_USERS_QUERY = 'database.users';
export const GET_DATABASE_ROLES_QUERY = 'database.roles';
export const GET_DATABASE_PERMISSIONS_QUERY = 'database.permissions';
export const GET_DATABASE_BACKUPS_QUERY = 'database.backups';
export const GET_DATABASE_RESTORES_QUERY = 'database.restores';
export const GET_DATABASE_MIGRATIONS_QUERY = 'database.migrations';
export const GET_DATABASE_SEEDS_QUERY = 'database.seeds';
export const GET_DATABASE_TESTS_QUERY = 'database.tests';