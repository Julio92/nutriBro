"use client";

import { ArrowUpRight, CalendarDays, EyeOff, Pencil, Plus } from "lucide-react";

import { MEAL_TYPES, WEEKDAYS } from "@/domain/nutrition/constants";
import type { MealSlotView, WeekdayId, WeeklyPlanView } from "@/domain/nutrition/types";
import type { MealVisibilityPreferences } from "@/domain/preferences/types";
import { filterVisibleMealSlots } from "@/domain/preferences/visibility";

const NATIVE_DAY_TO_WEEKDAY: readonly WeekdayId[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

interface TodayMealsProps {
  plan: WeeklyPlanView;
  mealVisibility: MealVisibilityPreferences;
  onOpenRecipe: (recipeId: string) => void;
  onSelectSlot: (slot: MealSlotView) => void;
}

function getTodayWeekdayId() {
  return NATIVE_DAY_TO_WEEKDAY[new Date().getDay()];
}

function formatTodayDate() {
  const label = new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  return label.charAt(0).toLocaleUpperCase("es-ES") + label.slice(1);
}

export function TodayMeals({
  plan,
  mealVisibility,
  onOpenRecipe,
  onSelectSlot,
}: TodayMealsProps) {
  const day = getTodayWeekdayId();
  const dayLabel = WEEKDAYS.find((item) => item.id === day)?.label ?? "Hoy";
  const slots = filterVisibleMealSlots(MEAL_TYPES.map((meal) =>
    plan.slots.find((slot) => slot.day === day && slot.meal === meal.id),
  ).filter((slot): slot is MealSlotView => Boolean(slot)), mealVisibility);

  return (
    <section className="today-section" aria-labelledby="today-heading">
      <div className="today-section__heading">
        <div>
          <span className="eyebrow">
            <CalendarDays size={14} aria-hidden="true" /> Hoy
          </span>
          <h1 id="today-heading">{dayLabel}</h1>
          <p>{formatTodayDate()}</p>
        </div>
      </div>

      {slots.length > 0 ? (
        <div className="today-meals-grid">
          {slots.map((slot) => (
            <TodayMealCard
              key={slot.id}
              slot={slot}
              onOpenRecipe={onOpenRecipe}
              onSelectSlot={onSelectSlot}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state" role="status">
          <span className="empty-state__icon"><EyeOff size={20} aria-hidden="true" /></span>
          <h3>No hay comidas visibles</h3>
          <p>Activa las comidas que quieras ver en Preferencias, en la sección General.</p>
        </div>
      )}
    </section>
  );
}

function TodayMealCard({
  slot,
  onOpenRecipe,
  onSelectSlot,
}: {
  slot: MealSlotView;
  onOpenRecipe: (recipeId: string) => void;
  onSelectSlot: (slot: MealSlotView) => void;
}) {
  const meal = MEAL_TYPES.find((item) => item.id === slot.meal);
  const mealLabel = meal?.label ?? slot.meal;
  const hasRecipes = slot.recipes.length > 0;

  return (
    <article className={`today-meal-card ${hasRecipes ? "today-meal-card--assigned" : "today-meal-card--empty"}`}>
      <header className="today-meal-card__header">
        <span className="today-meal-card__meal">
          <span aria-hidden="true">{meal?.icon}</span>
          {mealLabel}
        </span>
        {hasRecipes ? (
          <button
            className="icon-button icon-button--small"
            type="button"
            onClick={() => onSelectSlot(slot)}
            aria-label={`Editar recetas de ${mealLabel}`}
            title="Editar recetas"
          >
            <Pencil size={15} aria-hidden="true" />
          </button>
        ) : null}
      </header>

      {hasRecipes ? (
        <div className="today-meal-card__content">
          <div className="today-meal-card__recipe-list">
            {slot.recipes.map((recipe) => (
              <button
                className="today-meal-card__recipe"
                type="button"
                key={recipe.id}
                onClick={() => onOpenRecipe(recipe.id)}
                aria-label={`Ver detalles de ${recipe.name}`}
              >
                <span>
                  <strong>{recipe.name}</strong>
                  <small>{recipe.ingredientCount} ingredientes</small>
                </span>
                <ArrowUpRight size={16} aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <button
          className="today-meal-card__add"
          type="button"
          onClick={() => onSelectSlot(slot)}
        >
          <Plus size={17} aria-hidden="true" />
          <span><strong>Planificar comida</strong><small>Elige una o más recetas de tu biblioteca.</small></span>
        </button>
      )}
    </article>
  );
}
