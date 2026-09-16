CREATE TABLE "user_default_recipe_libraries" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"version" integer NOT NULL,
	"seeded_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_default_recipe_libraries" ADD CONSTRAINT "user_default_recipe_libraries_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;