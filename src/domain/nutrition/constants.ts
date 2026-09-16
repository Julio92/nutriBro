import {
  MEAL_TYPE_IDS,
  WEEKDAY_IDS,
  type MealTypeId,
  type WeekdayId,
} from "./types";

export const DEFAULT_OWNER_ID = "00000000-0000-4000-8000-000000000001";
export const DEFAULT_WEEKLY_PLAN_ID = "00000000-0000-4000-8000-000000000010";

export const WEEKDAYS: ReadonlyArray<{
  id: WeekdayId;
  label: string;
  shortLabel: string;
}> = [
  { id: "monday", label: "Lunes", shortLabel: "L" },
  { id: "tuesday", label: "Martes", shortLabel: "M" },
  { id: "wednesday", label: "Miércoles", shortLabel: "X" },
  { id: "thursday", label: "Jueves", shortLabel: "J" },
  { id: "friday", label: "Viernes", shortLabel: "V" },
  { id: "saturday", label: "Sábado", shortLabel: "S" },
  { id: "sunday", label: "Domingo", shortLabel: "D" },
];

export const MEAL_TYPES: ReadonlyArray<{
  id: MealTypeId;
  label: string;
  icon: string;
}> = [
  { id: "breakfast", label: "Desayuno", icon: "☀" },
  { id: "midMorning", label: "Media mañana", icon: "◌" },
  { id: "lunch", label: "Comida", icon: "◐" },
  { id: "snack", label: "Merienda", icon: "◒" },
  { id: "dinner", label: "Cena", icon: "☾" },
];

export const SLOT_DEFAULT_TIMES: Record<MealTypeId, string> = {
  breakfast: "07:30",
  midMorning: "10:30",
  lunch: "14:00",
  snack: "17:30",
  dinner: "21:00",
};

export function createSlotId(day: WeekdayId, meal: MealTypeId) {
  return `${day}-${meal}`;
}

export function getWeekdayLabel(day: WeekdayId) {
  return WEEKDAYS.find((item) => item.id === day)?.label ?? day;
}

export function getMealLabel(meal: MealTypeId) {
  return MEAL_TYPES.find((item) => item.id === meal)?.label ?? meal;
}

export function formatSlotLabel(day: WeekdayId, meal: MealTypeId) {
  return `${getWeekdayLabel(day)} · ${getMealLabel(meal)}`;
}

export function isWeekdayId(value: string): value is WeekdayId {
  return (WEEKDAY_IDS as readonly string[]).includes(value);
}

export function isMealTypeId(value: string): value is MealTypeId {
  return (MEAL_TYPE_IDS as readonly string[]).includes(value);
}
