export interface RecipeOverlayState {
  detailOpen: boolean;
  formOpen: boolean;
}

export type RecipeOverlayAction =
  | { type: "open-detail" }
  | { type: "close-detail" }
  | { type: "open-form" }
  | { type: "close-form" };

export const initialRecipeOverlayState: RecipeOverlayState = {
  detailOpen: false,
  formOpen: false,
};

export function recipeOverlayReducer(
  state: RecipeOverlayState,
  action: RecipeOverlayAction,
): RecipeOverlayState {
  switch (action.type) {
    case "open-detail":
      return { ...state, detailOpen: true };
    case "close-detail":
      return { ...state, detailOpen: false };
    case "open-form":
      return { ...state, formOpen: true };
    case "close-form":
      return { ...state, formOpen: false };
  }
}

export function getRecipeDrawerSwipeDirection(isDesktop: boolean): "right" | "down" {
  return isDesktop ? "right" : "down";
}