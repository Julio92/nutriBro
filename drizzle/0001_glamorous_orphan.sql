DROP INDEX "meal_slots_plan_day_meal_idx";--> statement-breakpoint
CREATE UNIQUE INDEX "meal_slots_plan_day_meal_idx" ON "meal_slots" USING btree ("weekly_plan_id","day","meal");