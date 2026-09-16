import { CalendarDays, ChevronRight, Clock3, Plus } from "lucide-react";

import { MEAL_TYPES, WEEKDAYS } from "@/domain/nutrition/constants";
import type { MealSlotView, WeeklyPlanView } from "@/domain/nutrition/types";

interface WeeklyBoardProps {
  plan: WeeklyPlanView;
  onSelectSlot: (slot: MealSlotView) => void;
}

export function WeeklyBoard({ plan, onSelectSlot }: WeeklyBoardProps) {
  return (
    <section className="weekly-section" aria-labelledby="weekly-plan-heading">
      <div className="section-heading section-heading--board">
        <div>
          <span className="eyebrow">
            <CalendarDays size={14} aria-hidden="true" /> Plan recurrente
          </span>
          <h2 id="weekly-plan-heading">{plan.name}</h2>
          <p>Tu estructura se repite cada semana.</p>
        </div>
        <span className="week-badge">7 días · 5 comidas</span>
      </div>

      <div className="week-scroll" role="region" aria-label="Plan semanal completo" tabIndex={0}>
        <div className="weekly-board">
          {WEEKDAYS.map((day) => {
            const daySlots = MEAL_TYPES.map((meal) =>
              plan.slots.find((slot) => slot.day === day.id && slot.meal === meal.id),
            ).filter((slot): slot is MealSlotView => Boolean(slot));

            return (
              <article className="day-column" key={day.id}>
                <header className="day-column__header">
                  <span className="day-column__letter" aria-hidden="true">
                    {day.shortLabel}
                  </span>
                  <h3>{day.label}</h3>
                </header>

                <div className="day-column__slots">
                  {daySlots.map((slot) => (
                    <MealSlotCard
                      key={slot.id}
                      slot={slot}
                      onSelect={() => onSelectSlot(slot)}
                    />
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MealSlotCard({
  slot,
  onSelect,
}: {
  slot: MealSlotView;
  onSelect: () => void;
}) {
  const meal = MEAL_TYPES.find((item) => item.id === slot.meal);
  const mealLabel = meal?.label ?? slot.meal;
  const hasRecipes = slot.recipes.length > 0;
  const recipeNames = slot.recipes.map((recipe) => recipe.name);

  return (
    <button
      className={`meal-slot ${hasRecipes ? "meal-slot--assigned" : "meal-slot--empty"}`}
      type="button"
      onClick={onSelect}
      aria-label={`${mealLabel}: ${recipeNames.join(", ") || "sin recetas"}. ${hasRecipes ? "Editar recetas" : "Añadir recetas"}`}
    >
      <span className="meal-slot__meta">
        <span className="meal-slot__meal">
          <span aria-hidden="true">{meal?.icon}</span> {mealLabel}
        </span>
        {slot.time ? (
          <span className="meal-slot__time">
            <Clock3 size={11} aria-hidden="true" /> {slot.time}
          </span>
        ) : null}
      </span>

      {hasRecipes ? (
        <>
          <span className="meal-slot__recipe-list">
            {slot.recipes.map((recipe) => (
              <strong className="meal-slot__recipe-name" key={recipe.id}>
                {recipe.name}
              </strong>
            ))}
          </span>
          <span className="meal-slot__action">
            Editar {slot.recipes.length === 1 ? "receta" : "recetas"} <ChevronRight size={13} aria-hidden="true" />
          </span>
        </>
      ) : (
        <span className="meal-slot__empty-copy">
          <Plus size={15} aria-hidden="true" /> Añadir recetas
        </span>
      )}
    </button>
  );
}
