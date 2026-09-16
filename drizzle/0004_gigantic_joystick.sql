CREATE TABLE "meal_slot_recipe_assignments" (
	"weekly_plan_id" uuid NOT NULL,
	"slot_id" text NOT NULL,
	"recipe_id" uuid NOT NULL,
	"position" integer NOT NULL,
	CONSTRAINT "meal_slot_recipe_assignments_weekly_plan_id_slot_id_recipe_id_pk" PRIMARY KEY("weekly_plan_id","slot_id","recipe_id")
);
--> statement-breakpoint
ALTER TABLE "meal_slot_recipe_assignments" ADD CONSTRAINT "meal_slot_recipe_assignments_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "meal_slot_recipe_assignments" ADD CONSTRAINT "meal_slot_recipe_assignments_slot_fk" FOREIGN KEY ("weekly_plan_id","slot_id") REFERENCES "public"."meal_slots"("weekly_plan_id","id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
INSERT INTO "meal_slot_recipe_assignments" ("weekly_plan_id", "slot_id", "recipe_id", "position")
SELECT "weekly_plan_id", "id", "recipe_id", 0
FROM "meal_slots"
WHERE "recipe_id" IS NOT NULL;
--> statement-breakpoint
ALTER TABLE "meal_slots" DROP CONSTRAINT "meal_slots_recipe_id_recipes_id_fk";
--> statement-breakpoint
DROP INDEX "meal_slots_recipe_id_idx";
--> statement-breakpoint
CREATE UNIQUE INDEX "meal_slot_recipe_assignments_plan_slot_position_idx" ON "meal_slot_recipe_assignments" USING btree ("weekly_plan_id","slot_id","position");
--> statement-breakpoint
CREATE INDEX "meal_slot_recipe_assignments_recipe_id_idx" ON "meal_slot_recipe_assignments" USING btree ("recipe_id");
--> statement-breakpoint
ALTER TABLE "meal_slots" DROP COLUMN "recipe_id";