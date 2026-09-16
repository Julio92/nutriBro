"use client";

import { Check, Search, X } from "lucide-react";
import { useMemo, useState } from "react";

import { getMealLabel, getWeekdayLabel } from "@/domain/nutrition/constants";
import type { MealSlotView, RecipeListItem } from "@/domain/nutrition/types";

import { RecipeArt } from "./recipe-art";

interface AssignmentDialogProps {
  slot: MealSlotView | null;
  recipes: RecipeListItem[];
  isSaving: boolean;
  onClose: () => void;
  onSave: (recipeIds: string[]) => Promise<void>;
}

export function AssignmentDialog({
  slot,
  recipes,
  isSaving,
  onClose,
  onSave,
}: AssignmentDialogProps) {
  const [query, setQuery] = useState("");
  const [selectedRecipeIds, setSelectedRecipeIds] = useState(
    () => new Set(slot?.recipes.map((recipe) => recipe.id) ?? []),
  );

  const visibleRecipes = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("es");
    if (!normalizedQuery) {
      return recipes;
    }

    return recipes.filter((recipe) =>
      `${recipe.name} ${recipe.description}`.toLocaleLowerCase("es").includes(normalizedQuery),
    );
  }, [query, recipes]);

  if (!slot) {
    return null;
  }

  const selectionCount = selectedRecipeIds.size;

  function toggleRecipe(recipeId: string) {
    setSelectedRecipeIds((currentIds) => {
      const nextIds = new Set(currentIds);

      if (nextIds.has(recipeId)) {
        nextIds.delete(recipeId);
      } else {
        nextIds.add(recipeId);
      }

      return nextIds;
    });
  }

  function clearSelection() {
    setSelectedRecipeIds(new Set());
  }

  function saveSelection() {
    void onSave([...selectedRecipeIds]);
  }

  return (
    <div className="overlay" role="presentation">
      <button
        type="button"
        className="overlay__backdrop"
        aria-label="Cerrar selector de recetas"
        onClick={onClose}
        disabled={isSaving}
      />
      <section
        className="assignment-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="assignment-heading"
      >
        <header className="dialog-header">
          <div>
            <span className="eyebrow">Asignar recetas</span>
            <h2 id="assignment-heading">
              {getWeekdayLabel(slot.day)} · {getMealLabel(slot.meal)}
            </h2>
            <p>
              {slot.time ? `Horario habitual: ${slot.time}. ` : ""}
              Elige una o más recetas para esta comida.
            </p>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Cerrar" disabled={isSaving}>
            <X size={19} aria-hidden="true" />
          </button>
        </header>

        <label className="search-field search-field--dialog">
          <Search size={18} aria-hidden="true" />
          <span className="visually-hidden">Buscar receta para asignar</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Busca recetas"
            autoFocus
            disabled={isSaving}
          />
        </label>

        <div className="recipe-picker" aria-live="polite">
          <button
            className={`recipe-picker__empty ${selectionCount === 0 ? "recipe-picker__empty--active" : ""}`}
            type="button"
            onClick={clearSelection}
            disabled={isSaving || selectionCount === 0}
            aria-pressed={selectionCount === 0}
          >
            <span className="recipe-picker__empty-icon">×</span>
            <span>
              <strong>Quitar todas las recetas</strong>
              <small>La comida quedará disponible para planificar.</small>
            </span>
            {selectionCount === 0 ? <Check size={17} aria-hidden="true" /> : null}
          </button>

          {visibleRecipes.map((recipe) => {
            const selected = selectedRecipeIds.has(recipe.id);

            return (
              <button
                className={`recipe-picker__option ${selected ? "recipe-picker__option--selected" : ""}`}
                type="button"
                key={recipe.id}
                onClick={() => toggleRecipe(recipe.id)}
                disabled={isSaving}
                aria-pressed={selected}
              >
                <RecipeArt name={recipe.name} imageUrl={recipe.imageUrl} />
                <span>
                  <strong>{recipe.name}</strong>
                  <small>{recipe.ingredientCount} ingredientes</small>
                </span>
                {selected ? <Check size={17} aria-label="Receta seleccionada" /> : null}
              </button>
            );
          })}

          {visibleRecipes.length === 0 ? (
            <p className="picker-empty">No se han encontrado recetas.</p>
          ) : null}
        </div>

        <footer className="assignment-dialog__footer">
          <span className="assignment-dialog__selection" aria-live="polite">
            {selectionCount === 0
              ? "Sin recetas seleccionadas"
              : `${selectionCount} ${selectionCount === 1 ? "receta seleccionada" : "recetas seleccionadas"}`}
          </span>
          <button
            className="button button--primary"
            type="button"
            onClick={saveSelection}
            disabled={isSaving}
          >
            {selectionCount === 0
              ? "Guardar sin recetas"
              : `Guardar ${selectionCount} ${selectionCount === 1 ? "receta" : "recetas"}`}
          </button>
        </footer>
      </section>
    </div>
  );
}
