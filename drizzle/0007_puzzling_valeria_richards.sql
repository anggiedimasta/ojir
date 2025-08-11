ALTER TABLE "ojir_category" ALTER COLUMN "color" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "ojir_subcategory" ALTER COLUMN "color" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "ojir_subcategory" ADD COLUMN "color_intensity" integer DEFAULT 100 NOT NULL;