CREATE TABLE "ojir_category" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"icon" varchar(50),
	"color" varchar(7) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "ojir_subcategory" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"icon" varchar(50),
	"color" varchar(7) NOT NULL,
	"category_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "ojir_transaction" ADD COLUMN "category_id" varchar(255);--> statement-breakpoint
ALTER TABLE "ojir_transaction" ADD COLUMN "subcategory_id" varchar(255);--> statement-breakpoint
ALTER TABLE "ojir_category" ADD CONSTRAINT "ojir_category_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ojir_subcategory" ADD CONSTRAINT "ojir_subcategory_category_id_ojir_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."ojir_category"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ojir_subcategory" ADD CONSTRAINT "ojir_subcategory_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "category_user_id_idx" ON "ojir_category" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "subcategory_category_id_idx" ON "ojir_subcategory" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "subcategory_user_id_idx" ON "ojir_subcategory" USING btree ("user_id");--> statement-breakpoint
ALTER TABLE "ojir_transaction" ADD CONSTRAINT "ojir_transaction_category_id_ojir_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."ojir_category"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ojir_transaction" ADD CONSTRAINT "ojir_transaction_subcategory_id_ojir_subcategory_id_fk" FOREIGN KEY ("subcategory_id") REFERENCES "public"."ojir_subcategory"("id") ON DELETE no action ON UPDATE no action;