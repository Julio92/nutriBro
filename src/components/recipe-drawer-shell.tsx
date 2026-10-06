"use client";

import { useSyncExternalStore, type ReactNode } from "react";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import { getRecipeDrawerSwipeDirection } from "@/lib/recipe-overlay-state";

const DESKTOP_QUERY = "(min-width: 681px)";

interface RecipeDrawerShellProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  variant: "detail" | "form";
  preventDismissal?: boolean;
  nestedContent?: ReactNode;
  children: ReactNode;
}

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

function useRecipeDrawerSwipeDirection() {
  const isDesktop = useSyncExternalStore(
    subscribeToDesktopQuery,
    getDesktopSnapshot,
    getServerSnapshot,
  );

  return getRecipeDrawerSwipeDirection(isDesktop);
}

export function RecipeDrawerShell({
  open,
  onOpenChange,
  title,
  description,
  variant,
  preventDismissal = false,
  nestedContent,
  children,
}: RecipeDrawerShellProps) {
  const swipeDirection = useRecipeDrawerSwipeDirection();

  return (
    <Drawer
      open={open}
      swipeDirection={swipeDirection}
      showSwipeHandle
      disablePointerDismissal={preventDismissal}
      onOpenChange={(nextOpen, eventDetails) => {
        if (!nextOpen && preventDismissal) {
          eventDetails.cancel();
          return;
        }

        onOpenChange(nextOpen);
      }}
    >
      <DrawerContent className={`recipe-drawer-popup recipe-drawer-popup--${variant}`}>
        <DrawerTitle className="visually-hidden">{title}</DrawerTitle>
        <DrawerDescription className="visually-hidden">{description}</DrawerDescription>
        {children}
      </DrawerContent>
      {nestedContent}
    </Drawer>
  );
}