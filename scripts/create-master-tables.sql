-- Create bank table
CREATE TABLE IF NOT EXISTS "ojir_bank" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"code" varchar(50) NOT NULL,
	"name" varchar(255) NOT NULL,
	"display_name" varchar(255) NOT NULL,
	"icon_path" varchar(500),
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "ojir_bank_code_unique" UNIQUE("code")
);

-- Create payment method table
CREATE TABLE IF NOT EXISTS "ojir_payment_method" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"code" varchar(50) NOT NULL,
	"name" varchar(255) NOT NULL,
	"display_name" varchar(255) NOT NULL,
	"description" text,
	"icon_path" varchar(500),
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "ojir_payment_method_code_unique" UNIQUE("code")
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "bank_code_idx" ON "ojir_bank" USING btree ("code");
CREATE INDEX IF NOT EXISTS "bank_is_active_idx" ON "ojir_bank" USING btree ("is_active");
CREATE INDEX IF NOT EXISTS "payment_method_code_idx" ON "ojir_payment_method" USING btree ("code");
CREATE INDEX IF NOT EXISTS "payment_method_is_active_idx" ON "ojir_payment_method" USING btree ("is_active"); 