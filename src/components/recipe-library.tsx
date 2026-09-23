"use client";

import { BookOpen, Plus, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

import type { RecipeListItem } from "@/domain/nutrition/types";
import { formatRecipeUsage, formatUpdateDate } from "@/lib/format";

import { RecipeArt } from "./recipe-art";

type AvailabilityFilter = "all" | "assigned" | "unassigned";

interface RecipeLibraryProps {
  recipes: RecipeListItem[];
  onCreateRecipe: () => void;
  onOpenRecipe: (recipeId: string) => void;
}

export function RecipeLibrary({
  recipes,
  onCreateRecipe,
  onOpenRecipe,
}: RecipeLibraryProps) {
  const [query, setQuery] = useState("");
  const [availability, setAvailability] = useState<AvailabilityFilter>("all");

  const visibleRecipes = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("es");

    return recipes.filter((recipe) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        `${recipe.name} ${recipe.description}`
          .toLocaleLowerCase("es")
          .includes(normalizedQuery);
      const matchesAvailability =
        availability === "all" ||
        (availability === "assigned" && recipe.assignedSlotCount > 0) ||
        (availability === "unassigned" && recipe.assignedSlotCount === 0);

      return matchesQuery && matchesAvailability;
    });
  }, [availability, query, recipes]);

  return (
    <section className="recipe-library" aria-labelledby="recipe-library-heading">
      <div className="section-heading recipe-library__heading">
        <div>
          <span className="eyebrow">
            <BookOpen size={14} aria-hidden="true" /> Biblioteca
          </span>
          <h2 id="recipe-library-heading">Tus recetas</h2>
          <p>Guarda tus básicos y reutilízalos en el menú.</p>
        </div>
        <button className="button button--primary" type="button" onClick={onCreateRecipe}>
          <Plus size={17} aria-hidden="true" /> Nueva receta
        </button>
      </div>

      <div className="recipe-library__controls">
        <label className="search-field">
          <Search size={18} aria-hidden="true" />
          <span className="visually-hidden">Buscar recetas</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nombre o descripción"
          />
        </label>
        <div className="filter-group" aria-label="Filtrar recetas">
          <span className="filter-group__label">
            <SlidersHorizontal size={14} aria-hidden="true" /> Mostrar
          </span>
          {(
            [
              ["all", "Todas"],
              ["assigned", "Planificadas"],
              ["unassigned", "Sin asignar"],
            ] as const
          ).map(([value, label]) => (
            <button
              className={`filter-button ${availability === value ? "filter-button--active" : ""}`}
              type="button"
              key={value}
              onClick={() => setAvailability(value)}
              aria-pressed={availability === value}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <p className="result-count" aria-live="polite">
        {visibleRecipes.length} {visibleRecipes.length === 1 ? "receta" : "recetas"}
      </p>

      {visibleRecipes.length > 0 ? (
        <div className="recipe-grid">
          {visibleRecipes.map((recipe) => (
            <button
              className="recipe-card"
              type="button"
              key={recipe.id}
              onClick={() => onOpenRecipe(recipe.id)}
            >
              <RecipeArt name={recipe.name} imageUrl={recipe.imageUrl} />
              <span className="recipe-card__body">
                <span className="recipe-card__topline">
                  <span>{recipe.ingredientCount} ingredientes</span>
                  <span>{formatRecipeUsage(recipe.assignedSlotCount)}</span>
                </span>
                <strong>{recipe.name}</strong>
                <span className="recipe-card__description">{recipe.description || "Sin descripción"}</span>
                {recipe.tags.length > 0 ? (
                  <span className="recipe-card__tags" aria-label={`Etiquetas de ${recipe.name}`}>
                    {recipe.tags.slice(0, 3).map((tag) => (
                      <span className="recipe-card__tag" key={tag}>
                        {tag}
                      </span>
                    ))}
                    {recipe.tags.length > 3 ? <span className="recipe-card__tag">+{recipe.tags.length - 3}</span> : null}
                  </span>
                ) : null}
                <span className="recipe-card__footer">Actualizada {formatUpdateDate(recipe.updatedAt)}</span>
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state__icon">
            <BookOpen size={22} aria-hidden="true" />
          </div>
          <h3>No hay recetas que coincidan</h3>
          <p>Prueba a cambiar la búsqueda o crea una receta nueva.</p>
          <button className="button button--secondary" type="button" onClick={onCreateRecipe}>
            <Plus size={16} aria-hidden="true" /> Crear receta
          </button>
        </div>
      )}
    </section>
  );
}
