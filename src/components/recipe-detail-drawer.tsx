"use client";

import { ChefHat, Clock3, Pencil, Trash2, X } from "lucide-react";
import type { ReactNode } from "react";

import { formatSlotName } from "@/lib/format";
import type { RecipeDetail } from "@/domain/nutrition/types";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useRecipeDrawerSwipeDirection } from "@/hooks/use-recipe-drawer-swipe-direction";

import { RecipeArt } from "./recipe-art";

interface RecipeDetailDrawerProps {
  recipe: RecipeDetail | null;
  isLoading: boolean;
  onClose: () => void;
  onEdit: (recipe: RecipeDetail) => void;
  onDelete: (recipe: RecipeDetail) => void;
  children?: ReactNode;
}

export function RecipeDetailDrawer({
  recipe,
  isLoading,
  onClose,
  onEdit,
  onDelete,
  children,
}: RecipeDetailDrawerProps) {
  const swipeDirection = useRecipeDrawerSwipeDirection();

  return (
    <Drawer
      open={Boolean(recipe) || isLoading}
      swipeDirection={swipeDirection}
      showSwipeHandle
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DrawerContent>
        <aside className="recipe-drawer">
          <div className="drawer__toolbar">
            <DrawerTitle>
              {recipe?.name ?? "Detalle de receta"}
            </DrawerTitle>
            <DrawerClose className="icon-button recipe-drawer-close" aria-label="Cerrar">
              <X size={19} aria-hidden="true" />
            </DrawerClose>
          </div>

          {isLoading || !recipe ? (
            <div className="drawer-skeleton" aria-live="polite">
              <DrawerDescription className="visually-hidden">
                Información de la receta, sus ingredientes y su lugar en el menú.
              </DrawerDescription>
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
                {recipe.description ? (
                  <DrawerDescription>{recipe.description}</DrawerDescription>
                ) : (
                  <DrawerDescription className="visually-hidden">
                    Información de la receta, sus ingredientes y su lugar en el menú.
                  </DrawerDescription>
                )}
              </div>

              {recipe.tags.length > 0 ? (
                <div className="tag-list tag-list--detail" aria-label="Etiquetas de la receta">
                  {recipe.tags.map((tag) => (
                    <Badge key={tag}>
                      {tag}
                    </Badge>
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
      </DrawerContent>
      {children}
    </Drawer>
  );
}
