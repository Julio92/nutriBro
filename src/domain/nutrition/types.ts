export const WEEKDAY_IDS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export const MEAL_TYPE_IDS = [
  "breakfast",
  "midMorning",
  "lunch",
  "snack",
  "dinner",
] as const;

export type WeekdayId = (typeof WEEKDAY_IDS)[number];
export type MealTypeId = (typeof MEAL_TYPE_IDS)[number];

export interface User {
  id: string;
  displayName: string;
  email: string | null;
  role: "owner";
  createdAt: string;
}

export interface IngredientInput {
  name: string;
  quantity: string;
}

export interface Ingredient extends IngredientInput {
  id: string;
}

export interface RecipeInput {
  name: string;
  description: string;
  instructions: string;
  imageUrl: string;
  ingredients: IngredientInput[];
}

export interface Recipe {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  instructions: string;
  imageUrl: string | null;
  ingredients: Ingredient[];
  createdAt: string;
  updatedAt: string;
}

export interface MealSlot {
  id: string;
  day: WeekdayId;
  meal: MealTypeId;
  time: string | null;
  recipeIds: string[];
}

export interface WeeklyPlan {
  id: string;
  ownerId: string;
  name: string;
  kind: "repeating";
  startsOn: string | null;
  endsOn: string | null;
  slots: MealSlot[];
  createdAt: string;
  updatedAt: string;
}

export interface StoreData {
  schemaVersion: 1;
  users: User[];
  recipes: Recipe[];
  weeklyPlans: WeeklyPlan[];
}

export interface RecipeSummary {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  ingredientCount: number;
}

export interface RecipeListItem extends RecipeSummary {
  updatedAt: string;
  assignedSlotCount: number;
}

export interface AssignedSlotReference {
  slotId: string;
  day: WeekdayId;
  meal: MealTypeId;
  time: string | null;
}

export interface RecipeDetail extends RecipeSummary {
  ingredients: Ingredient[];
  instructions: string;
  createdAt: string;
  updatedAt: string;
  assignedSlots: AssignedSlotReference[];
}

export interface MealSlotView extends Omit<MealSlot, "recipeIds"> {
  recipes: RecipeSummary[];
}

export interface WeeklyPlanView extends Omit<WeeklyPlan, "slots"> {
  slots: MealSlotView[];
}

export interface DashboardData {
  plan: WeeklyPlanView;
  recipes: RecipeListItem[];
  stats: {
    assignedMeals: number;
    totalMeals: number;
    recipeCount: number;
  };
}

export interface FutureNutritionValues {
  calories: number;
  proteinGrams: number;
  fatGrams: number;
  carbohydrateGrams: number;
}

export interface FutureUserGoal {
  objective: "weight-loss" | "muscle-gain" | "maintenance";
  targetNutrition?: FutureNutritionValues;
}

export interface ApiSuccess<T> {
  data: T;
}

export interface ApiFailure {
  error: {
    code: string;
    message: string;
    fields?: Record<string, string[]>;
  };
}
