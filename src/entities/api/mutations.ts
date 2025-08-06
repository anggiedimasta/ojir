// API Mutations
// This file contains all the API mutation definitions for the application

// Auth Mutations
export const LOGIN_MUTATION = 'auth.login';
export const REGISTER_MUTATION = 'auth.register';
export const LOGOUT_MUTATION = 'auth.logout';
export const FORGOT_PASSWORD_MUTATION = 'auth.forgotPassword';
export const RESET_PASSWORD_MUTATION = 'auth.resetPassword';
export const CHANGE_PASSWORD_MUTATION = 'auth.changePassword';
export const VERIFY_EMAIL_MUTATION = 'auth.verifyEmail';
export const RESEND_VERIFICATION_MUTATION = 'auth.resendVerification';
export const ENABLE_TWO_FACTOR_MUTATION = 'auth.enableTwoFactor';
export const DISABLE_TWO_FACTOR_MUTATION = 'auth.disableTwoFactor';
export const VERIFY_TWO_FACTOR_MUTATION = 'auth.verifyTwoFactor';
export const GENERATE_BACKUP_CODES_MUTATION = 'auth.generateBackupCodes';
export const VERIFY_BACKUP_CODE_MUTATION = 'auth.verifyBackupCode';
export const OAUTH_LOGIN_MUTATION = 'auth.oauthLogin';
export const OAUTH_CALLBACK_MUTATION = 'auth.oauthCallback';
export const REFRESH_TOKEN_MUTATION = 'auth.refreshToken';
export const REVOKE_TOKEN_MUTATION = 'auth.revokeToken';

// User Mutations
export const UPDATE_PROFILE_MUTATION = 'user.updateProfile';
export const UPDATE_AVATAR_MUTATION = 'user.updateAvatar';
export const DELETE_AVATAR_MUTATION = 'user.deleteAvatar';
export const UPDATE_PREFERENCES_MUTATION = 'user.updatePreferences';
export const DELETE_ACCOUNT_MUTATION = 'user.deleteAccount';
export const EXPORT_USER_DATA_MUTATION = 'user.exportData';
export const IMPORT_USER_DATA_MUTATION = 'user.importData';

// Wallet Mutations
export const CREATE_WALLET_MUTATION = 'wallet.create';
export const UPDATE_WALLET_MUTATION = 'wallet.update';
export const DELETE_WALLET_MUTATION = 'wallet.delete';
export const CREATE_TRANSACTION_MUTATION = 'wallet.createTransaction';
export const UPDATE_TRANSACTION_MUTATION = 'wallet.updateTransaction';
export const DELETE_TRANSACTION_MUTATION = 'wallet.deleteTransaction';
export const BULK_CREATE_TRANSACTIONS_MUTATION = 'wallet.bulkCreateTransactions';
export const BULK_UPDATE_TRANSACTIONS_MUTATION = 'wallet.bulkUpdateTransactions';
export const BULK_DELETE_TRANSACTIONS_MUTATION = 'wallet.bulkDeleteTransactions';
export const CREATE_BANK_MUTATION = 'wallet.createBank';
export const UPDATE_BANK_MUTATION = 'wallet.updateBank';
export const DELETE_BANK_MUTATION = 'wallet.deleteBank';
export const CREATE_PAYMENT_METHOD_MUTATION = 'wallet.createPaymentMethod';
export const UPDATE_PAYMENT_METHOD_MUTATION = 'wallet.updatePaymentMethod';
export const DELETE_PAYMENT_METHOD_MUTATION = 'wallet.deletePaymentMethod';
export const IMPORT_TRANSACTIONS_MUTATION = 'wallet.importTransactions';
export const EXPORT_TRANSACTIONS_MUTATION = 'wallet.exportTransactions';
export const SYNC_BANK_ACCOUNT_MUTATION = 'wallet.syncBankAccount';
export const DISCONNECT_BANK_ACCOUNT_MUTATION = 'wallet.disconnectBankAccount';

// Calendar Mutations
export const CREATE_CALENDAR_MUTATION = 'calendar.create';
export const UPDATE_CALENDAR_MUTATION = 'calendar.update';
export const DELETE_CALENDAR_MUTATION = 'calendar.delete';
export const CREATE_EVENT_MUTATION = 'calendar.createEvent';
export const UPDATE_EVENT_MUTATION = 'calendar.updateEvent';
export const DELETE_EVENT_MUTATION = 'calendar.deleteEvent';
export const BULK_CREATE_EVENTS_MUTATION = 'calendar.bulkCreateEvents';
export const BULK_UPDATE_EVENTS_MUTATION = 'calendar.bulkUpdateEvents';
export const BULK_DELETE_EVENTS_MUTATION = 'calendar.bulkDeleteEvents';
export const SHARE_CALENDAR_MUTATION = 'calendar.share';
export const UNSHARE_CALENDAR_MUTATION = 'calendar.unshare';
export const ACCEPT_CALENDAR_SHARE_MUTATION = 'calendar.acceptShare';
export const DECLINE_CALENDAR_SHARE_MUTATION = 'calendar.declineShare';
export const CREATE_EVENT_ATTENDEE_MUTATION = 'calendar.createAttendee';
export const UPDATE_EVENT_ATTENDEE_MUTATION = 'calendar.updateAttendee';
export const DELETE_EVENT_ATTENDEE_MUTATION = 'calendar.deleteAttendee';
export const RESPOND_TO_EVENT_MUTATION = 'calendar.respondToEvent';
export const CREATE_EVENT_REMINDER_MUTATION = 'calendar.createReminder';
export const UPDATE_EVENT_REMINDER_MUTATION = 'calendar.updateReminder';
export const DELETE_EVENT_REMINDER_MUTATION = 'calendar.deleteReminder';
export const CREATE_EVENT_ATTACHMENT_MUTATION = 'calendar.createAttachment';
export const DELETE_EVENT_ATTACHMENT_MUTATION = 'calendar.deleteAttachment';
export const SYNC_GOOGLE_CALENDAR_MUTATION = 'calendar.syncGoogle';
export const DISCONNECT_GOOGLE_CALENDAR_MUTATION = 'calendar.disconnectGoogle';

// Organization Mutations
export const CREATE_ORGANIZATION_MUTATION = 'organization.create';
export const UPDATE_ORGANIZATION_MUTATION = 'organization.update';
export const DELETE_ORGANIZATION_MUTATION = 'organization.delete';
export const INVITE_MEMBER_MUTATION = 'organization.inviteMember';
export const REMOVE_MEMBER_MUTATION = 'organization.removeMember';
export const UPDATE_MEMBER_ROLE_MUTATION = 'organization.updateMemberRole';
export const ACCEPT_INVITATION_MUTATION = 'organization.acceptInvitation';
export const DECLINE_INVITATION_MUTATION = 'organization.declineInvitation';
export const LEAVE_ORGANIZATION_MUTATION = 'organization.leave';
export const TRANSFER_OWNERSHIP_MUTATION = 'organization.transferOwnership';

// Notification Mutations
export const MARK_NOTIFICATION_READ_MUTATION = 'notification.markRead';
export const MARK_ALL_NOTIFICATIONS_READ_MUTATION = 'notification.markAllRead';
export const DELETE_NOTIFICATION_MUTATION = 'notification.delete';
export const DELETE_ALL_NOTIFICATIONS_MUTATION = 'notification.deleteAll';
export const UPDATE_NOTIFICATION_SETTINGS_MUTATION = 'notification.updateSettings';
export const SUBSCRIBE_TO_NOTIFICATIONS_MUTATION = 'notification.subscribe';
export const UNSUBSCRIBE_FROM_NOTIFICATIONS_MUTATION = 'notification.unsubscribe';

// File Upload Mutations
export const UPLOAD_FILE_MUTATION = 'file.upload';
export const DELETE_FILE_MUTATION = 'file.delete';
export const UPDATE_FILE_MUTATION = 'file.update';
export const BULK_UPLOAD_FILES_MUTATION = 'file.bulkUpload';
export const BULK_DELETE_FILES_MUTATION = 'file.bulkDelete';

// Settings Mutations
export const UPDATE_APP_SETTINGS_MUTATION = 'settings.updateApp';
export const UPDATE_USER_SETTINGS_MUTATION = 'settings.updateUser';
export const UPDATE_ORGANIZATION_SETTINGS_MUTATION = 'settings.updateOrganization';
export const RESET_SETTINGS_MUTATION = 'settings.reset';
export const EXPORT_SETTINGS_MUTATION = 'settings.export';
export const IMPORT_SETTINGS_MUTATION = 'settings.import';

// Analytics Mutations
export const TRACK_EVENT_MUTATION = 'analytics.track';
export const TRACK_PAGE_VIEW_MUTATION = 'analytics.pageView';
export const TRACK_ERROR_MUTATION = 'analytics.error';
export const TRACK_PERFORMANCE_MUTATION = 'analytics.performance';

// Backup & Sync Mutations
export const CREATE_BACKUP_MUTATION = 'backup.create';
export const RESTORE_BACKUP_MUTATION = 'backup.restore';
export const DELETE_BACKUP_MUTATION = 'backup.delete';
export const SYNC_DATA_MUTATION = 'sync.data';
export const CONFLICT_RESOLUTION_MUTATION = 'sync.resolveConflict';

// Integration Mutations
export const CONNECT_INTEGRATION_MUTATION = 'integration.connect';
export const DISCONNECT_INTEGRATION_MUTATION = 'integration.disconnect';
export const UPDATE_INTEGRATION_SETTINGS_MUTATION = 'integration.updateSettings';
export const TEST_INTEGRATION_MUTATION = 'integration.test';
export const SYNC_INTEGRATION_DATA_MUTATION = 'integration.sync';

// Webhook Mutations
export const CREATE_WEBHOOK_MUTATION = 'webhook.create';
export const UPDATE_WEBHOOK_MUTATION = 'webhook.update';
export const DELETE_WEBHOOK_MUTATION = 'webhook.delete';
export const TEST_WEBHOOK_MUTATION = 'webhook.test';
export const REGENERATE_WEBHOOK_SECRET_MUTATION = 'webhook.regenerateSecret';

// API Key Mutations
export const CREATE_API_KEY_MUTATION = 'apiKey.create';
export const UPDATE_API_KEY_MUTATION = 'apiKey.update';
export const DELETE_API_KEY_MUTATION = 'apiKey.delete';
export const REGENERATE_API_KEY_MUTATION = 'apiKey.regenerate';
export const REVOKE_API_KEY_MUTATION = 'apiKey.revoke';

// Audit Log Mutations
export const CREATE_AUDIT_LOG_MUTATION = 'auditLog.create';
export const EXPORT_AUDIT_LOGS_MUTATION = 'auditLog.export';
export const CLEAR_AUDIT_LOGS_MUTATION = 'auditLog.clear';

// Report Mutations
export const GENERATE_REPORT_MUTATION = 'report.generate';
export const SCHEDULE_REPORT_MUTATION = 'report.schedule';
export const CANCEL_SCHEDULED_REPORT_MUTATION = 'report.cancelSchedule';
export const EXPORT_REPORT_MUTATION = 'report.export';

// Template Mutations
export const CREATE_TEMPLATE_MUTATION = 'template.create';
export const UPDATE_TEMPLATE_MUTATION = 'template.update';
export const DELETE_TEMPLATE_MUTATION = 'template.delete';
export const DUPLICATE_TEMPLATE_MUTATION = 'template.duplicate';
export const SHARE_TEMPLATE_MUTATION = 'template.share';
export const IMPORT_TEMPLATE_MUTATION = 'template.import';
export const EXPORT_TEMPLATE_MUTATION = 'template.export';

// Workflow Mutations
export const CREATE_WORKFLOW_MUTATION = 'workflow.create';
export const UPDATE_WORKFLOW_MUTATION = 'workflow.update';
export const DELETE_WORKFLOW_MUTATION = 'workflow.delete';
export const ACTIVATE_WORKFLOW_MUTATION = 'workflow.activate';
export const DEACTIVATE_WORKFLOW_MUTATION = 'workflow.deactivate';
export const DUPLICATE_WORKFLOW_MUTATION = 'workflow.duplicate';
export const EXPORT_WORKFLOW_MUTATION = 'workflow.export';
export const IMPORT_WORKFLOW_MUTATION = 'workflow.import';

// Automation Mutations
export const CREATE_AUTOMATION_MUTATION = 'automation.create';
export const UPDATE_AUTOMATION_MUTATION = 'automation.update';
export const DELETE_AUTOMATION_MUTATION = 'automation.delete';
export const ACTIVATE_AUTOMATION_MUTATION = 'automation.activate';
export const DEACTIVATE_AUTOMATION_MUTATION = 'automation.deactivate';
export const TEST_AUTOMATION_MUTATION = 'automation.test';
export const DUPLICATE_AUTOMATION_MUTATION = 'automation.duplicate';

// Comment Mutations
export const CREATE_COMMENT_MUTATION = 'comment.create';
export const UPDATE_COMMENT_MUTATION = 'comment.update';
export const DELETE_COMMENT_MUTATION = 'comment.delete';
export const LIKE_COMMENT_MUTATION = 'comment.like';
export const UNLIKE_COMMENT_MUTATION = 'comment.unlike';
export const REPORT_COMMENT_MUTATION = 'comment.report';

// Tag Mutations
export const CREATE_TAG_MUTATION = 'tag.create';
export const UPDATE_TAG_MUTATION = 'tag.update';
export const DELETE_TAG_MUTATION = 'tag.delete';
export const MERGE_TAGS_MUTATION = 'tag.merge';
export const BULK_CREATE_TAGS_MUTATION = 'tag.bulkCreate';
export const BULK_UPDATE_TAGS_MUTATION = 'tag.bulkUpdate';
export const BULK_DELETE_TAGS_MUTATION = 'tag.bulkDelete';

// Category Mutations
export const CREATE_CATEGORY_MUTATION = 'category.create';
export const UPDATE_CATEGORY_MUTATION = 'category.update';
export const DELETE_CATEGORY_MUTATION = 'category.delete';
export const REORDER_CATEGORIES_MUTATION = 'category.reorder';
export const MERGE_CATEGORIES_MUTATION = 'category.merge';

// Search Mutations
export const SAVE_SEARCH_MUTATION = 'search.save';
export const UPDATE_SAVED_SEARCH_MUTATION = 'search.update';
export const DELETE_SAVED_SEARCH_MUTATION = 'search.delete';
export const SHARE_SEARCH_MUTATION = 'search.share';

// Export/Import Mutations
export const EXPORT_SYSTEM_DATA_MUTATION = 'export.data';
export const IMPORT_SYSTEM_DATA_MUTATION = 'import.data';
export const VALIDATE_IMPORT_DATA_MUTATION = 'import.validate';
export const PREVIEW_IMPORT_DATA_MUTATION = 'import.preview';

// System Mutations
export const CLEAR_CACHE_MUTATION = 'system.clearCache';
export const OPTIMIZE_DATABASE_MUTATION = 'system.optimizeDatabase';
export const BACKUP_DATABASE_MUTATION = 'system.backupDatabase';
export const RESTORE_DATABASE_MUTATION = 'system.restoreDatabase';
export const UPDATE_SYSTEM_MUTATION = 'system.update';
export const RESTART_SYSTEM_MUTATION = 'system.restart';
export const SHUTDOWN_SYSTEM_MUTATION = 'system.shutdown';

// Health Check Mutations
export const RUN_HEALTH_CHECK_MUTATION = 'health.runCheck';
export const FIX_HEALTH_ISSUE_MUTATION = 'health.fixIssue';
export const GENERATE_HEALTH_REPORT_MUTATION = 'health.generateReport';

// Maintenance Mutations
export const START_MAINTENANCE_MUTATION = 'maintenance.start';
export const END_MAINTENANCE_MUTATION = 'maintenance.end';
export const SCHEDULE_MAINTENANCE_MUTATION = 'maintenance.schedule';
export const CANCEL_MAINTENANCE_MUTATION = 'maintenance.cancel';

// Migration Mutations
export const RUN_MIGRATION_MUTATION = 'migration.run';
export const ROLLBACK_MIGRATION_MUTATION = 'migration.rollback';
export const CHECK_MIGRATION_STATUS_MUTATION = 'migration.checkStatus';
export const GENERATE_MIGRATION_MUTATION = 'migration.generate';

// Seed Mutations
export const RUN_SEED_MUTATION = 'seed.run';
export const CLEAR_SEED_DATA_MUTATION = 'seed.clear';
export const GENERATE_SEED_DATA_MUTATION = 'seed.generate';

// Test Mutations
export const RUN_TESTS_MUTATION = 'test.run';
export const RUN_SPECIFIC_TEST_MUTATION = 'test.runSpecific';
export const GENERATE_TEST_REPORT_MUTATION = 'test.generateReport';
export const CLEAR_TEST_RESULTS_MUTATION = 'test.clearResults';