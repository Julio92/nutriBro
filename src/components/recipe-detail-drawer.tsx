"use client";

import { ChefHat, Clock3, Pencil, Trash2, X } from "lucide-react";

import { formatSlotName } from "@/lib/format";
import type { RecipeDetail } from "@/domain/nutrition/types";

import { RecipeArt } from "./recipe-art";

interface RecipeDetailDrawerProps {
  recipe: RecipeDetail | null;
  isLoading: boolean;
  onClose: () => void;
  onEdit: (recipe: RecipeDetail) => void;
  onDelete: (recipe: RecipeDetail) => void;
}

export function RecipeDetailDrawer({
  recipe,
  isLoading,
  onClose,
  onEdit,
  onDelete,
}: RecipeDetailDrawerProps) {
  if (!recipe && !isLoading) {
    return null;
  }

  return (
    <div className="overlay" role="presentation">
      <button
        type="button"
        className="overlay__backdrop"
        aria-label="Cerrar detalle de receta"
        onClick={onClose}
      />
      <aside
        className="recipe-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="recipe-detail-heading"
      >
        <div className="drawer__toolbar">
          <span>Detalle de receta</span>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Cerrar">
            <X size={19} aria-hidden="true" />
          </button>
        </div>

        {isLoading || !recipe ? (
          <div className="drawer-skeleton" aria-live="polite">
            <span className="skeleton skeleton--art" />
            <span className="skeleton skeleton--title" />
            <span className="skeleton skeleton--line" />
            <span className="skeleton skeleton--line" />
          </div>
        ) : (
          <div className="drawer__content">
            <RecipeArt name={recipe.name} imageUrl={recipe.imageUrl} className="recipe-art--hero" />
            <div className="drawer__headline">
              <span className="eyebrow">Receta guardada</span>
              <h2 id="recipe-detail-heading">{recipe.name}</h2>
              {recipe.description ? <p>{recipe.description}</p> : null}
            </div>

            {recipe.tags.length > 0 ? (
              <div className="tag-list tag-list--detail" aria-label="Etiquetas de la receta">
                {recipe.tags.map((tag) => (
                  <span className="tag-pill" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="drawer__actions">
              <button className="button button--secondary" type="button" onClick={() => onEdit(recipe)}>
                <Pencil size={16} aria-hidden="true" /> Editar
              </button>
              <button className="button button--danger-quiet" type="button" onClick={() => onDelete(recipe)}>
                <Trash2 size={16} aria-hidden="true" /> Eliminar
              </button>
            </div>

            <section className="drawer-section" aria-labelledby="ingredients-heading">
              <div className="drawer-section__heading">
                <ChefHat size={18} aria-hidden="true" />
                <h3 id="ingredients-heading">Ingredientes</h3>
                <span>{recipe.ingredientCount}</span>
              </div>
              <ul className="ingredient-list">
                {recipe.ingredients.map((ingredient) => (
                  <li key={ingredient.id}>
                    <span>{ingredient.name}</span>
                    {ingredient.quantity ? <strong>{ingredient.quantity}</strong> : null}
                  </li>
                ))}
              </ul>
            </section>

            <section className="drawer-section" aria-labelledby="preparation-heading">
              <div className="drawer-section__heading">
                <Clock3 size={18} aria-hidden="true" />
                <h3 id="preparation-heading">Elaboración</h3>
              </div>
              <div className="instruction-copy">
                {recipe.instructions.split("\n").map((step, index) => (
                  <p key={`${step}-${index}`}>{step}</p>
                ))}
              </div>
            </section>

            <section className="drawer-section" aria-labelledby="assignments-heading">
              <div className="drawer-section__heading">
                <span className="assignment-icon" aria-hidden="true">↻</span>
                <h3 id="assignments-heading">En el menú</h3>
                <span>{recipe.assignedSlots.length}</span>
              </div>
              {recipe.assignedSlots.length > 0 ? (
                <div className="assignment-chips">
                  {recipe.assignedSlots.map((slot) => (
                    <span className="assignment-chip" key={slot.slotId}>
                      {formatSlotName(slot.day, slot.meal)}
                      {slot.time ? <small>{slot.time}</small> : null}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="muted-copy">Esta receta aún no se ha añadido al menú.</p>
              )}
            </section>
          </div>
        )}
      </aside>
    </div>
  );
}
