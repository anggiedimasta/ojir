ALTER TABLE "ojir_shared_event" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "ojir_shared_event" CASCADE;--> statement-breakpoint
ALTER TABLE "ojir_account" DROP CONSTRAINT "ojir_account_userId_ojir_user_id_fk";
--> statement-breakpoint
ALTER TABLE "ojir_calendar_event" DROP CONSTRAINT "ojir_calendar_event_userId_ojir_user_id_fk";
--> statement-breakpoint
ALTER TABLE "ojir_session" DROP CONSTRAINT "ojir_session_userId_ojir_user_id_fk";
--> statement-breakpoint
DROP INDEX "t_user_id_idx";--> statement-breakpoint
DROP INDEX "account_user_id_idx";--> statement-breakpoint
DROP INDEX "calendar_event_user_id_idx";--> statement-breakpoint
ALTER TABLE "ojir_account" DROP CONSTRAINT "ojir_account_provider_providerAccountId_pk";--> statement-breakpoint
ALTER TABLE "ojir_account" ADD CONSTRAINT "ojir_account_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id");--> statement-breakpoint
ALTER TABLE "ojir_account" ADD COLUMN "user_id" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "ojir_account" ADD COLUMN "provider_account_id" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "ojir_calendar_event" ADD COLUMN "start_time" timestamp with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "ojir_calendar_event" ADD COLUMN "end_time" timestamp with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "ojir_calendar_event" ADD COLUMN "user_id" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "ojir_calendar_event" ADD COLUMN "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE "ojir_calendar_event" ADD COLUMN "updated_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "ojir_session" ADD COLUMN "session_token" varchar(255) PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "ojir_session" ADD COLUMN "user_id" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "ojir_user" ADD COLUMN "email_verified" timestamp with time zone DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE "ojir_account" ADD CONSTRAINT "ojir_account_user_id_ojir_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."ojir_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ojir_calendar_event" ADD CONSTRAINT "ojir_calendar_event_user_id_ojir_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."ojir_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ojir_session" ADD CONSTRAINT "ojir_session_user_id_ojir_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."ojir_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "session_user_id_idx" ON "ojir_session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "account_user_id_idx" ON "ojir_account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "calendar_event_user_id_idx" ON "ojir_calendar_event" USING btree ("user_id");--> statement-breakpoint
ALTER TABLE "ojir_account" DROP COLUMN "userId";--> statement-breakpoint
ALTER TABLE "ojir_account" DROP COLUMN "providerAccountId";--> statement-breakpoint
ALTER TABLE "ojir_calendar_event" DROP COLUMN "startTime";--> statement-breakpoint
ALTER TABLE "ojir_calendar_event" DROP COLUMN "endTime";--> statement-breakpoint
ALTER TABLE "ojir_calendar_event" DROP COLUMN "userId";--> statement-breakpoint
ALTER TABLE "ojir_calendar_event" DROP COLUMN "createdAt";--> statement-breakpoint
ALTER TABLE "ojir_calendar_event" DROP COLUMN "updatedAt";--> statement-breakpoint
ALTER TABLE "ojir_session" DROP COLUMN "sessionToken";--> statement-breakpoint
ALTER TABLE "ojir_session" DROP COLUMN "userId";--> statement-breakpoint
ALTER TABLE "ojir_user" DROP COLUMN "emailVerified";