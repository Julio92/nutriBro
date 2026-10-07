"use client";

import type { ReactNode } from "react";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useRecipeDrawerSwipeDirection } from "@/hooks/use-recipe-drawer-swipe-direction";

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
      <DrawerContent data-drawer-variant={variant}>
        <DrawerTitle className="visually-hidden">{title}</DrawerTitle>
        <DrawerDescription className="visually-hidden">{description}</DrawerDescription>
        {children}
      </DrawerContent>
      {nestedContent}
    </Drawer>
  );
}