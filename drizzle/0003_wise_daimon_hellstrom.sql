ALTER TABLE "ojir_calendar_event" ADD COLUMN "start_date" timestamp with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "ojir_calendar_event" ADD COLUMN "end_date" timestamp with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "ojir_transaction" ADD COLUMN "fee" numeric(15, 2) DEFAULT '0.00' NOT NULL;--> statement-breakpoint
ALTER TABLE "ojir_transaction" ADD COLUMN "total_amount" numeric(15, 2) DEFAULT '0.00' NOT NULL;--> statement-breakpoint
ALTER TABLE "ojir_transaction" ADD COLUMN "recipient_bank" varchar(255);--> statement-breakpoint
ALTER TABLE "ojir_transaction" ADD COLUMN "recipient_bank_account" varchar(255);--> statement-breakpoint
ALTER TABLE "ojir_transaction" ADD COLUMN "transfer_purpose" varchar(255);--> statement-breakpoint
CREATE INDEX "transaction_fee_idx" ON "ojir_transaction" USING btree ("fee");--> statement-breakpoint
CREATE INDEX "transaction_total_amount_idx" ON "ojir_transaction" USING btree ("total_amount");--> statement-breakpoint
CREATE INDEX "transaction_recipient_bank_idx" ON "ojir_transaction" USING btree ("recipient_bank");--> statement-breakpoint
CREATE INDEX "transaction_transfer_purpose_idx" ON "ojir_transaction" USING btree ("transfer_purpose");--> statement-breakpoint
ALTER TABLE "ojir_calendar_event" DROP COLUMN "start_time";--> statement-breakpoint
ALTER TABLE "ojir_calendar_event" DROP COLUMN "end_time";