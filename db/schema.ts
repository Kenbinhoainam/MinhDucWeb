import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text, index, uniqueIndex } from 'drizzle-orm/sqlite-core';
export const contentRecords = sqliteTable('content_records', {
  key: text('key').primaryKey(), content: text('content').notNull(), revision: integer('revision').notNull().default(0),
  versionId: text('version_id'), updatedAt: integer('updated_at').notNull(), updatedBy: text('updated_by').notNull(),
});
export const contentVersions = sqliteTable('content_versions', {
  id: text('id').primaryKey(), content: text('content').notNull(), draftRevision: integer('draft_revision').notNull(),
  createdAt: integer('created_at').notNull(), createdBy: text('created_by').notNull(),
}, t => [uniqueIndex('content_version_draft').on(t.draftRevision)]);
export const adminMembers = sqliteTable('admin_members', {
  userId: text('user_id').primaryKey(), role: text('role').notNull(), createdAt: integer('created_at').notNull(),
}, t => [uniqueIndex('single_site_owner').on(t.role).where(sql`${t.role} = 'owner'`)]);
export const intakes = sqliteTable('intakes', {
  id: text('id').primaryKey(), kind: text('kind').notNull(), jobId: text('job_id'), payload: text('payload').notNull(),
  payloadHash: text('payload_hash').notNull(), receiptToken: text('receipt_token').notNull(),
  clientId: text('client_id').notNull(), idempotencyKey: text('idempotency_key').notNull(),
  isTest: integer('is_test', { mode: 'boolean' }).notNull().default(true), createdAt: integer('created_at').notNull(),
  cvKey: text('cv_key'), cvName: text('cv_name'), cvMime: text('cv_mime'), cvSize: integer('cv_size').notNull().default(0),
}, t => [uniqueIndex('intake_idempotency').on(t.idempotencyKey), index('intake_created_at').on(t.createdAt)]);
export const auditEvents = sqliteTable('audit_events', {
  id: text('id').primaryKey(), actorId: text('actor_id').notNull(), action: text('action').notNull(), subjectId: text('subject_id').notNull(), createdAt: integer('created_at').notNull(),
}, t => [index('audit_created_at').on(t.createdAt)]);
export const rateLimits = sqliteTable('rate_limits', {
  key: text('key').primaryKey(), count: integer('count').notNull().default(0), windowStart: integer('window_start').notNull(),
}, t => [index('rate_window_start').on(t.windowStart)]);
