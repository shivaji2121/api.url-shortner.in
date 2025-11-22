CREATE TABLE "links" (
	"id" serial PRIMARY KEY NOT NULL,
	"linkCode" varchar,
	"target_url" text NOT NULL,
	"total_clicks" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"deleted_at" timestamp,
	"last_clicked_at" timestamp
);
