"use client";

import { ImageIcon, Minus, Plus, Save, X } from "lucide-react";
import { useState } from "react";

import type { RecipeDetail, RecipeInput } from "@/domain/nutrition/types";
import { ApiClientError } from "@/lib/api-client";

interface DraftIngredient {
  key: string;
  name: string;
  quantity: string;
}

interface RecipeFormDialogProps {
  recipe: RecipeDetail | null;
  onClose: () => void;
  onSave: (input: RecipeInput, recipeId?: string) => Promise<void>;
}

function createBlankIngredient(key = "ingredient-initial"): DraftIngredient {
  return { key, name: "", quantity: "" };
}

function recipeToDraft(recipe: RecipeDetail | null) {
  return {
    name: recipe?.name ?? "",
    description: recipe?.description ?? "",
    instructions: recipe?.instructions ?? "",
    imageUrl: recipe?.imageUrl ?? "",
    tags: recipe?.tags ?? [],
    ingredients:
      recipe?.ingredients.map((ingredient) => ({
        key: ingredient.id,
        name: ingredient.name,
        quantity: ingredient.quantity,
      })) ?? [createBlankIngredient()],
  };
}

export function RecipeFormDialog({ recipe, onClose, onSave }: RecipeFormDialogProps) {
  const [draft, setDraft] = useState(() => recipeToDraft(recipe));
  const [tagInput, setTagInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isEditing = Boolean(recipe);

  function updateIngredient(index: number, field: "name" | "quantity", value: string) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      ingredients: currentDraft.ingredients.map((ingredient, ingredientIndex) =>
        ingredientIndex === index ? { ...ingredient, [field]: value } : ingredient,
      ),
    }));
  }

  function addIngredient() {
    setDraft((currentDraft) => ({
      ...currentDraft,
      ingredients: [
        ...currentDraft.ingredients,
        createBlankIngredient(`ingredient-${Date.now()}-${currentDraft.ingredients.length}`),
      ],
    }));
  }

  function addTag() {
    const normalizedTag = tagInput.trim();
    if (!normalizedTag) {
      return;
    }

    setDraft((currentDraft) => {
      const existingValues = currentDraft.tags ?? [];
      const key = normalizedTag.toLocaleLowerCase("en-US");

      if (existingValues.some((value) => value.toLocaleLowerCase("en-US") === key)) {
        return currentDraft;
      }

      return {
        ...currentDraft,
        tags: [...existingValues, normalizedTag],
      };
    });
    setTagInput("");
  }

  function removeTag(tagToRemove: string) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      tags: (currentDraft.tags ?? []).filter((tag) => tag !== tagToRemove),
    }));
  }

  function removeIngredient(index: number) {
    setDraft((currentDraft) => {
      if (currentDraft.ingredients.length === 1) {
        return currentDraft;
      }

      return {
        ...currentDraft,
        ingredients: currentDraft.ingredients.filter((_, ingredientIndex) => ingredientIndex !== index),
      };
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    const input: RecipeInput = {
      name: draft.name.trim(),
      description: draft.description.trim(),
      instructions: draft.instructions.trim(),
      imageUrl: draft.imageUrl.trim(),
      tags: draft.tags.map((tag) => tag.trim()).filter(Boolean),
      ingredients: draft.ingredients.map((ingredient) => ({
        name: ingredient.name.trim(),
        quantity: ingredient.quantity.trim(),
      })),
    };

    if (!input.name || !input.instructions || input.ingredients.some((ingredient) => !ingredient.name)) {
      setErrorMessage("Añade un nombre, las instrucciones y un nombre para cada ingrediente.");
      return;
    }

    setIsSaving(true);
    try {
      await onSave(input, recipe?.id);
      onClose();
    } catch (error) {
      setErrorMessage(
        error instanceof ApiClientError
          ? error.message
          : "No se ha podido guardar la receta. Inténtalo de nuevo.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="overlay" role="presentation">
      <button
        type="button"
        className="overlay__backdrop"
        aria-label="Cancelar edición de receta"
        onClick={onClose}
        disabled={isSaving}
      />
      <section
        className="recipe-form-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="recipe-form-heading"
      >
        <header className="dialog-header">
          <div>
            <span className="eyebrow">{isEditing ? "Editar receta" : "Nueva receta"}</span>
            <h2 id="recipe-form-heading">{isEditing ? recipe?.name : "Añade una receta"}</h2>
            <p>Los campos con asterisco son obligatorios.</p>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Cerrar" disabled={isSaving}>
            <X size={19} aria-hidden="true" />
          </button>
        </header>

        <form className="recipe-form" onSubmit={handleSubmit} noValidate>
          {errorMessage ? <p className="form-error" role="alert">{errorMessage}</p> : null}

          <label className="form-field form-field--wide">
            <span>Nombre <b aria-hidden="true">*</b></span>
            <input
              value={draft.name}
              onChange={(event) => setDraft((currentDraft) => ({ ...currentDraft, name: event.target.value }))}
              maxLength={120}
              placeholder="Ej. Curry de verduras"
              autoFocus
              disabled={isSaving}
            />
          </label>

          <label className="form-field form-field--wide">
            <span>Descripción</span>
            <textarea
              value={draft.description}
              onChange={(event) => setDraft((currentDraft) => ({ ...currentDraft, description: event.target.value }))}
              maxLength={600}
              rows={2}
              placeholder="Una breve descripción para reconocerla rápido."
              disabled={isSaving}
            />
          </label>

          <div className="tag-editor form-field form-field--wide">
            <label className="tag-editor__label" htmlFor="recipe-tag-input">
              Etiquetas
            </label>
            <div className="tag-input-row">
              <input
                id="recipe-tag-input"
                value={tagInput}
                onChange={(event) => setTagInput(event.target.value)}
                placeholder="Ej. Desayuno"
                maxLength={32}
                disabled={isSaving}
              />
              <button type="button" className="button button--secondary" onClick={addTag} disabled={isSaving || !tagInput.trim()}>
                Añadir
              </button>
            </div>
            {draft.tags.length > 0 ? (
              <div className="tag-list" aria-label="Etiquetas de la receta">
                {draft.tags.map((tag) => (
                  <span className="tag-pill" key={tag}>
                    <span>{tag}</span>
                    <button type="button" className="tag-pill__remove" onClick={() => removeTag(tag)} aria-label={`Quitar etiqueta ${tag}`}>
                      ×
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="muted-copy">Añade categorías para organizar la receta.</p>
            )}
          </div>

          <label className="form-field form-field--wide">
            <span className="form-field__label-with-icon"><ImageIcon size={15} aria-hidden="true" /> Imagen (URL HTTPS, opcional)</span>
            <input
              type="url"
              value={draft.imageUrl}
              onChange={(event) => setDraft((currentDraft) => ({ ...currentDraft, imageUrl: event.target.value }))}
              maxLength={2048}
              placeholder="https://…"
              inputMode="url"
              disabled={isSaving}
            />
          </label>

          <fieldset className="ingredient-editor">
            <legend>
              Ingredientes <b aria-hidden="true">*</b>
              <small>Indica la cantidad si la conoces.</small>
            </legend>
            <div className="ingredient-editor__rows">
              {draft.ingredients.map((ingredient, index) => (
                <div className="ingredient-row" key={ingredient.key}>
                  <label>
                    <span className="visually-hidden">Ingrediente {index + 1}</span>
                    <input
                      value={ingredient.name}
                      onChange={(event) => updateIngredient(index, "name", event.target.value)}
                      placeholder="Ingrediente"
                      maxLength={120}
                      disabled={isSaving}
                    />
                  </label>
                  <label>
                    <span className="visually-hidden">Cantidad de ingrediente {index + 1}</span>
                    <input
                      value={ingredient.quantity}
                      onChange={(event) => updateIngredient(index, "quantity", event.target.value)}
                      placeholder="Cantidad"
                      maxLength={48}
                      disabled={isSaving}
                    />
                  </label>
                  <button
                    className="icon-button icon-button--small"
                    type="button"
                    onClick={() => removeIngredient(index)}
                    disabled={isSaving || draft.ingredients.length === 1}
                    aria-label={`Eliminar ingrediente ${index + 1}`}
                    title="Eliminar ingrediente"
                  >
                    <Minus size={15} aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
            <button className="text-button" type="button" onClick={addIngredient} disabled={isSaving}>
              <Plus size={16} aria-hidden="true" /> Añadir ingrediente
            </button>
          </fieldset>

          <label className="form-field form-field--wide">
            <span>Elaboración <b aria-hidden="true">*</b></span>
            <textarea
              value={draft.instructions}
              onChange={(event) => setDraft((currentDraft) => ({ ...currentDraft, instructions: event.target.value }))}
              rows={7}
              maxLength={8000}
              placeholder={"1. Prepara los ingredientes.\n2. Cocina y sirve."}
              disabled={isSaving}
            />
          </label>

          <footer className="form-footer">
            <button className="button button--ghost" type="button" onClick={onClose} disabled={isSaving}>
              Cancelar
            </button>
            <button className="button button--primary" type="submit" disabled={isSaving}>
              <Save size={16} aria-hidden="true" />
              {isSaving ? "Guardando…" : isEditing ? "Guardar cambios" : "Crear receta"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
