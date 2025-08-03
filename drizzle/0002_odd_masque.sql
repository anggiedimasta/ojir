ALTER TABLE "ojir_shared_event" ADD COLUMN "google_event_id" varchar(255);--> statement-breakpoint
CREATE INDEX "shared_event_google_event_id_idx" ON "ojir_shared_event" USING btree ("google_event_id");--> statement-breakpoint
CREATE INDEX "shared_event_user_id_idx" ON "ojir_shared_event" USING btree ("user_id");