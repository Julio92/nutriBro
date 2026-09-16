import {
  DEFAULT_OWNER_ID,
  DEFAULT_WEEKLY_PLAN_ID,
  SLOT_DEFAULT_TIMES,
  createSlotId,
} from "./constants";
import { MEAL_TYPE_IDS, WEEKDAY_IDS, type StoreData } from "./types";

export function createEmptyStoreData(): StoreData {
  const createdAt = new Date().toISOString();

  return {
    schemaVersion: 1,
    users: [
      {
        id: DEFAULT_OWNER_ID,
        displayName: "Tu espacio",
        email: null,
        role: "owner",
        createdAt,
      },
    ],
    recipes: [],
    weeklyPlans: [
      {
        id: DEFAULT_WEEKLY_PLAN_ID,
        ownerId: DEFAULT_OWNER_ID,
        name: "Menú semanal",
        kind: "repeating",
        startsOn: null,
        endsOn: null,
        slots: WEEKDAY_IDS.flatMap((day) =>
          MEAL_TYPE_IDS.map((meal) => ({
            id: createSlotId(day, meal),
            day,
            meal,
            time: SLOT_DEFAULT_TIMES[meal],
            recipeIds: [],
          })),
        ),
        createdAt,
        updatedAt: createdAt,
      },
    ],
  };
}
