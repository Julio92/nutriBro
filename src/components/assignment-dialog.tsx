"use client";

import { Check, Save, Search, X } from "lucide-react";
import { useMemo, useState } from "react";

import { getMealLabel, getWeekdayLabel } from "@/domain/nutrition/constants";
import type { MealSlotView, RecipeListItem } from "@/domain/nutrition/types";

import { RecipeArt } from "./recipe-art";

export function getAssignmentTagItems(tags: string[]): string[] {
  return tags.slice(0, 3);
}

export function getAssignmentTagOptions(tags: string[]): string[] {
  const normalizedTags = new Map<string, string>();

  for (const tag of tags) {
    const normalizedValue = tag.trim();

    if (normalizedValue.length === 0) {
      continue;
    }

    const key = normalizedValue.toLocaleLowerCase("es");

    if (!normalizedTags.has(key)) {
      normalizedTags.set(key, normalizedValue);
    }
  }

  return [...normalizedTags.values()].sort((left, right) => left.localeCompare(right, "es", { sensitivity: "base" }));
}

export function matchesAssignmentRecipeTags(recipeTags: string[] | undefined, selectedTags: string[]): boolean {
  const activeTags = getAssignmentTagOptions(selectedTags);

  if (activeTags.length === 0) {
    return true;
  }

  const normalizedRecipeTags = getAssignmentTagOptions(recipeTags ?? []);

  return activeTags.every((selectedTag) => normalizedRecipeTags.includes(selectedTag));
}

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
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedRecipeIds, setSelectedRecipeIds] = useState(
    () => new Set(slot?.recipes.map((recipe) => recipe.id) ?? []),
  );

  const availableTags = useMemo(
    () => getAssignmentTagOptions(recipes.flatMap((recipe) => recipe.tags ?? [])),
    [recipes],
  );

  const visibleRecipes = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("es");

    return recipes.filter((recipe) => {
      const matchesQuery =
        normalizedQuery.length === 0 || `${recipe.name} ${recipe.description}`.toLocaleLowerCase("es").includes(normalizedQuery);
      const matchesTags = matchesAssignmentRecipeTags(recipe.tags ?? [], selectedTags);

      return matchesQuery && matchesTags;
    });
  }, [query, recipes, selectedTags]);

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

  function toggleTag(tag: string) {
    setSelectedTags((currentTags) =>
      currentTags.includes(tag) ? currentTags.filter((currentTag) => currentTag !== tag) : [...currentTags, tag],
    );
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
          <div className="dialog-header__actions">
            <button
              className="icon-button icon-button--primary"
              type="button"
              onClick={saveSelection}
              aria-label="Guardar recetas"
              disabled={isSaving}
            >
              <Save size={18} aria-hidden="true" />
            </button>
            <button className="icon-button" type="button" onClick={onClose} aria-label="Cerrar" disabled={isSaving}>
              <X size={19} aria-hidden="true" />
            </button>
          </div>
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

        {availableTags.length > 0 ? (
          <div className="assignment-tag-filter" aria-label="Filtrar recetas por etiquetas">
            <span className="assignment-tag-filter__label">Etiquetas</span>
            <div className="assignment-tag-filter__list">
              {availableTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);

                return (
                  <button
                    key={tag}
                    type="button"
                    className={`assignment-tag-option ${isSelected ? "assignment-tag-option--selected" : ""}`}
                    onClick={() => toggleTag(tag)}
                    aria-pressed={isSelected}
                    disabled={isSaving}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

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
            const assignmentTags = getAssignmentTagItems(recipe.tags ?? []);
            const hasMoreTags = (recipe.tags ?? []).length > assignmentTags.length;

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
                  {assignmentTags.length > 0 ? (
                    <span className="recipe-card__tags" aria-label={`Etiquetas de ${recipe.name}`}>
                      {assignmentTags.map((tag) => (
                        <span className="recipe-card__tag" key={`${recipe.id}-${tag}`}>
                          {tag}
                        </span>
                      ))}
                      {hasMoreTags ? <span className="recipe-card__tag">+{(recipe.tags ?? []).length - assignmentTags.length}</span> : null}
                    </span>
                  ) : null}
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
