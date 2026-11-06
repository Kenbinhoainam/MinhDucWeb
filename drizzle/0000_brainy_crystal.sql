CREATE TABLE `admin_members` (
	`user_id` text PRIMARY KEY NOT NULL,
	`role` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `single_site_owner` ON `admin_members` (`role`) WHERE "admin_members"."role" = 'owner';--> statement-breakpoint
CREATE TABLE `audit_events` (
	`id` text PRIMARY KEY NOT NULL,
	`actor_id` text NOT NULL,
	`action` text NOT NULL,
	`subject_id` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `audit_created_at` ON `audit_events` (`created_at`);--> statement-breakpoint
CREATE TABLE `content_records` (
	`key` text PRIMARY KEY NOT NULL,
	`content` text NOT NULL,
	`revision` integer DEFAULT 0 NOT NULL,
	`version_id` text,
	`updated_at` integer NOT NULL,
	`updated_by` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `content_versions` (
	`id` text PRIMARY KEY NOT NULL,
	`content` text NOT NULL,
	`draft_revision` integer NOT NULL,
	`created_at` integer NOT NULL,
	`created_by` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `content_version_draft` ON `content_versions` (`draft_revision`);--> statement-breakpoint
CREATE TABLE `intakes` (
	`id` text PRIMARY KEY NOT NULL,
	`kind` text NOT NULL,
	`job_id` text,
	`payload` text NOT NULL,
	`payload_hash` text NOT NULL,
	`receipt_token` text NOT NULL,
	`client_id` text NOT NULL,
	`idempotency_key` text NOT NULL,
	`is_test` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`cv_key` text,
	`cv_name` text,
	`cv_mime` text,
	`cv_size` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `intake_idempotency` ON `intakes` (`idempotency_key`);--> statement-breakpoint
CREATE INDEX `intake_created_at` ON `intakes` (`created_at`);--> statement-breakpoint
CREATE TABLE `rate_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`count` integer DEFAULT 0 NOT NULL,
	`window_start` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `rate_window_start` ON `rate_limits` (`window_start`);