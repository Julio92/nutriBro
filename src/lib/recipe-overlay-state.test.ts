import { describe, expect, it } from "vitest";

import {
  getRecipeDrawerSwipeDirection,
  initialRecipeOverlayState,
  recipeOverlayReducer,
} from "./recipe-overlay-state";

describe("recipe drawer behavior", () => {
  it("uses a downward swipe on mobile and a rightward swipe on desktop", () => {
    expect(getRecipeDrawerSwipeDirection(false)).toBe("down");
    expect(getRecipeDrawerSwipeDirection(true)).toBe("right");
  });

  it("updates the swipe direction without changing open overlay state when resized", () => {
    const openState = recipeOverlayReducer(initialRecipeOverlayState, { type: "open-detail" });
    const desktopDirection = getRecipeDrawerSwipeDirection(true);
    const mobileDirection = getRecipeDrawerSwipeDirection(false);

    expect(desktopDirection).toBe("right");
    expect(mobileDirection).toBe("down");
    expect(openState).toEqual({ detailOpen: true, formOpen: false });
  });

  it("opens the detail drawer for the view flow and closes it on dismissal", () => {
    const openState = recipeOverlayReducer(initialRecipeOverlayState, { type: "open-detail" });

    expect(openState).toEqual({ detailOpen: true, formOpen: false });
    expect(recipeOverlayReducer(openState, { type: "close-detail" })).toEqual(
      initialRecipeOverlayState,
    );
  });

  it("stacks edit over detail and dismisses only the top form drawer", () => {
    const detailState = recipeOverlayReducer(initialRecipeOverlayState, { type: "open-detail" });
    const editState = recipeOverlayReducer(detailState, { type: "open-form" });

    expect(editState).toEqual({ detailOpen: true, formOpen: true });
    expect(recipeOverlayReducer(editState, { type: "close-form" })).toEqual({
      detailOpen: true,
      formOpen: false,
    });
  });

  it("opens creation without a detail layer and closes the draft layer independently", () => {
    const createState = recipeOverlayReducer(initialRecipeOverlayState, { type: "open-form" });

    expect(createState).toEqual({ detailOpen: false, formOpen: true });
    expect(recipeOverlayReducer(createState, { type: "close-form" })).toEqual(
      initialRecipeOverlayState,
    );
  });
});