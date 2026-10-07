"use client";

import { useSyncExternalStore } from "react";

import { getRecipeDrawerSwipeDirection } from "@/lib/recipe-overlay-state";

const DESKTOP_QUERY = "(min-width: 681px)";

function subscribeToDesktopQuery(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia(DESKTOP_QUERY);
  mediaQuery.addEventListener("change", onStoreChange);
  return () => mediaQuery.removeEventListener("change", onStoreChange);
}

function getDesktopSnapshot() {
  return window.matchMedia(DESKTOP_QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

export function useRecipeDrawerSwipeDirection() {
  const isDesktop = useSyncExternalStore(
    subscribeToDesktopQuery,
    getDesktopSnapshot,
    getServerSnapshot,
  );

  return getRecipeDrawerSwipeDirection(isDesktop);
}