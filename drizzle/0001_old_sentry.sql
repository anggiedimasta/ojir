CREATE TABLE "ojir_shared_event" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"start_time" timestamp with time zone NOT NULL,
	"end_time" timestamp with time zone NOT NULL,
	"location" text,
	"attendees" json,
	"organizer" json,
	"creator" json,
	"html_link" text,
	"status" text,
	"visibility" text,
	"reminders" json,
	"is_google_event" boolean DEFAULT true NOT NULL,
	"shared_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "ojir_shared_event" ADD CONSTRAINT "ojir_shared_event_user_id_ojir_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."ojir_user"("id") ON DELETE cascade ON UPDATE no action;