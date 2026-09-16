/* eslint-disable @next/next/no-img-element -- Las URLs HTTPS de imagen son configurables por la persona usuaria. */

import { ImageIcon } from "lucide-react";

import { recipeColorIndex, recipeInitials } from "@/lib/format";

interface RecipeArtProps {
  name: string;
  imageUrl: string | null;
  className?: string;
}

export function RecipeArt({ name, imageUrl, className = "" }: RecipeArtProps) {
  if (imageUrl) {
    return (
      <img
        className={`recipe-art recipe-art--image ${className}`}
        src={imageUrl}
        alt={`Imagen de ${name}`}
      />
    );
  }

  const colorIndex = recipeColorIndex(name);

  return (
    <div
      className={`recipe-art recipe-art--placeholder recipe-art--tone-${colorIndex} ${className}`}
      aria-label={`Receta: ${name}`}
      role="img"
    >
      <span className="recipe-art__orb recipe-art__orb--one" />
      <span className="recipe-art__orb recipe-art__orb--two" />
      <span className="recipe-art__pattern" aria-hidden="true">
        <ImageIcon size={16} strokeWidth={1.7} />
      </span>
      <strong>{recipeInitials(name)}</strong>
    </div>
  );
}
