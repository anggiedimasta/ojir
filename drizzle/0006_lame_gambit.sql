ALTER TABLE "ojir_payment_method" ADD COLUMN "icon" varchar(50);--> statement-breakpoint
ALTER TABLE "ojir_payment_method" DROP COLUMN "display_name";--> statement-breakpoint
ALTER TABLE "ojir_payment_method" DROP COLUMN "description";--> statement-breakpoint
ALTER TABLE "ojir_payment_method" DROP COLUMN "icon_path";--> statement-breakpoint
ALTER TABLE "ojir_payment_method" DROP COLUMN "sort_order";--> statement-breakpoint
ALTER TABLE "ojir_transaction" DROP COLUMN "virtual_account_no";