import { getMealLabel, getWeekdayLabel } from "@/domain/nutrition/constants";
import type { MealTypeId, WeekdayId } from "@/domain/nutrition/types";

export function recipeInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export function recipeColorIndex(name: string) {
  return Array.from(name).reduce((total, character) => total + character.charCodeAt(0), 0) % 5;
}

export function formatSlotName(day: WeekdayId, meal: MealTypeId) {
  return `${getWeekdayLabel(day)} · ${getMealLabel(meal)}`;
}

export function formatRecipeUsage(count: number) {
  if (count === 0) {
    return "Sin asignar";
  }

  return `${count} ${count === 1 ? "comida" : "comidas"}`;
}

export function formatUpdateDate(isoDate: string) {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return "Actualizada recientemente";
  }

  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
  }).format(date);
}
