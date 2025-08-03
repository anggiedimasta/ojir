CREATE TABLE "ojir_wallet" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" varchar(50) NOT NULL,
	"bank_code" varchar(50) NOT NULL,
	"account_number" varchar(255),
	"balance" numeric(15, 2) DEFAULT '0' NOT NULL,
	"currency" varchar(10) DEFAULT 'IDR' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"color" varchar(20),
	"icon" varchar(100),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "ojir_account" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "ojir_session" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "ojir_user" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "ojir_verification_token" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "ojir_account" CASCADE;--> statement-breakpoint
DROP TABLE "ojir_session" CASCADE;--> statement-breakpoint
DROP TABLE "ojir_user" CASCADE;--> statement-breakpoint
DROP TABLE "ojir_verification_token" CASCADE;--> statement-breakpoint
ALTER TABLE "ojir_calendar_event" DROP CONSTRAINT "ojir_calendar_event_user_id_ojir_user_id_fk";
--> statement-breakpoint
DROP INDEX "calendar_event_user_id_idx";--> statement-breakpoint
ALTER TABLE "ojir_calendar_event" ALTER COLUMN "created_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "ojir_transaction" ADD COLUMN "wallet_id" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "ojir_wallet" ADD CONSTRAINT "ojir_wallet_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "wallet_user_id_idx" ON "ojir_wallet" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "wallet_bank_code_idx" ON "ojir_wallet" USING btree ("bank_code");--> statement-breakpoint
CREATE INDEX "wallet_is_active_idx" ON "ojir_wallet" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "wallet_is_default_idx" ON "ojir_wallet" USING btree ("is_default");--> statement-breakpoint
ALTER TABLE "ojir_calendar_event" ADD CONSTRAINT "ojir_calendar_event_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ojir_transaction" ADD CONSTRAINT "ojir_transaction_wallet_id_ojir_wallet_id_fk" FOREIGN KEY ("wallet_id") REFERENCES "public"."ojir_wallet"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "wallet_id_idx" ON "ojir_transaction" USING btree ("wallet_id");