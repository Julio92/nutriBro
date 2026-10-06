"use client";

import {
  BookOpen,
  CheckCircle2,
  CircleAlert,
  LayoutGrid,
  Leaf,
  LogOut,
  Plus,
  Settings2,
  ShoppingBasket,
  Sparkles,
  Sun,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useRef, useState, type ReactNode } from "react";

import type {
  DashboardData,
  MealSlotView,
  RecipeDetail,
  RecipeInput,
} from "@/domain/nutrition/types";
import { ApiClientError, nutritionApi } from "@/lib/api-client";
import {
  getAppViewForTabIndex,
  getAppViewTabIndex,
  type AppView,
} from "@/lib/app-navigation";

import { AssignmentDialog } from "./assignment-dialog";
import { RecipeDetailDrawer } from "./recipe-detail-drawer";
import { RecipeFormDialog } from "./recipe-form-dialog";
import { RecipeLibrary } from "./recipe-library";
import { SettingsDialog } from "./dialog-sidebar/settings-dialog";
import { TodayMeals } from "./today-meals";
import { DropdownContent, DropdownMenu, DropdownTrigger } from "./ui/dropdown";
import { MenuItem } from "./ui/menu-item";
import { TabsSubtle, TabsSubtleItem, TabsSubtlePanel } from "./ui/tabs-subtle";
import { WeeklyBoard } from "./weekly-board";

type ToastTone = "success" | "error";
type Toast = { message: string; tone: ToastTone } | null;

interface AppShellProps {
  initialData: DashboardData;
  identity: {
    displayName: string;
    email: string | null;
  };
}

export function AppShell({ initialData, identity }: AppShellProps) {
  const router = useRouter();
  const [dashboard, setDashboard] = useState(initialData);
  const [activeView, setActiveView] = useState<AppView>("today");
  const selectedTabIndex = getAppViewTabIndex(activeView);
  const [assignmentSlot, setAssignmentSlot] = useState<MealSlotView | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeDetail | null>(null);
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(false);
  const [isRecipeFormOpen, setIsRecipeFormOpen] = useState(false);
  const [recipeBeingEdited, setRecipeBeingEdited] = useState<RecipeDetail | null>(null);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [toast, setToast] = useState<Toast>(null);
  const detailRequestId = useRef(0);

  function showToast(message: string, tone: ToastTone = "success") {
    setToast({ message, tone });
    window.setTimeout(() => {
      setToast((currentToast) => (currentToast?.message === message ? null : currentToast));
    }, 4_000);
  }

  function navigate(view: AppView) {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function openRecipe(recipeId: string) {
    const requestId = detailRequestId.current + 1;
    detailRequestId.current = requestId;
    setSelectedRecipe(null);
    setIsLoadingRecipe(true);

    try {
      const recipe = await nutritionApi.getRecipe(recipeId);
      if (detailRequestId.current === requestId) {
        setSelectedRecipe(recipe);
      }
    } catch (error) {
      if (detailRequestId.current === requestId) {
        showToast(getErrorMessage(error, () => router.replace("/sign-in")), "error");
      }
    } finally {
      if (detailRequestId.current === requestId) {
        setIsLoadingRecipe(false);
      }
    }
  }

  function closeRecipeDetail() {
    detailRequestId.current += 1;
    setSelectedRecipe(null);
    setIsLoadingRecipe(false);
  }

  function startCreatingRecipe() {
    setRecipeBeingEdited(null);
    setIsRecipeFormOpen(true);
  }

  function startEditingRecipe(recipe: RecipeDetail) {
    setRecipeBeingEdited(recipe);
    setIsRecipeFormOpen(true);
  }

  function closeSession() {
    void signOut({ redirectTo: "/sign-in" });
  }

  async function saveRecipe(input: RecipeInput, recipeId?: string) {
    const recipe = recipeId
      ? await nutritionApi.updateRecipe(recipeId, input)
      : await nutritionApi.createRecipe(input);
    const refreshedDashboard = await nutritionApi.getDashboard();

    setDashboard(refreshedDashboard);
    setSelectedRecipe(recipe);
    showToast(recipeId ? "Cambios guardados en la receta." : "Receta creada y disponible en tu menú.");
  }

  async function deleteRecipe(recipe: RecipeDetail) {
    const shouldDelete = window.confirm(
      `¿Eliminar “${recipe.name}”? También se quitará de las comidas donde esté asignada.`,
    );

    if (!shouldDelete) {
      return;
    }

    try {
      const result = await nutritionApi.deleteRecipe(recipe.id);
      const refreshedDashboard = await nutritionApi.getDashboard();
      setDashboard(refreshedDashboard);
      closeRecipeDetail();
      showToast(
        result.clearedAssignments > 0
          ? "Receta eliminada y menú actualizado."
          : "Receta eliminada.",
      );
    } catch (error) {
      showToast(getErrorMessage(error, () => router.replace("/sign-in")), "error");
    }
  }

  async function saveSlotRecipes(recipeIds: string[]) {
    if (!assignmentSlot) {
      return;
    }

    setIsAssigning(true);
    try {
      const refreshedDashboard = await nutritionApi.setSlotRecipes(
        assignmentSlot.id,
        recipeIds,
      );
      setDashboard(refreshedDashboard);
      setAssignmentSlot(null);
      showToast(
        recipeIds.length === 0
          ? "La comida se ha dejado sin recetas."
          : recipeIds.length === 1
            ? "Receta guardada en la comida."
            : `${recipeIds.length} recetas guardadas en la comida.`,
      );
    } catch (error) {
      showToast(getErrorMessage(error, () => router.replace("/sign-in")), "error");
    } finally {
      setIsAssigning(false);
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Navegación principal">
        <button className="brand" type="button" onClick={() => navigate("today")}>
          <span className="brand__mark" aria-hidden="true"><Leaf size={19} /></span>
          <span>nutriBro</span>
        </button>

        <nav className="sidebar__nav">
          <NavigationButton
            active={activeView === "today"}
            icon={<Sun size={18} aria-hidden="true" />}
            label="Hoy"
            onClick={() => navigate("today")}
          />
          <NavigationButton
            active={activeView === "plan"}
            icon={<LayoutGrid size={18} aria-hidden="true" />}
            label="Plan semanal"
            onClick={() => navigate("plan")}
          />
          <NavigationButton
            active={activeView === "recipes"}
            icon={<BookOpen size={18} aria-hidden="true" />}
            label="Recetas"
            onClick={() => navigate("recipes")}
          />
          <button className="sidebar-nav__item sidebar-nav__item--disabled" type="button" disabled>
            <ShoppingBasket size={18} aria-hidden="true" />
            <span>Lista de la compra</span>
            <small>Próximamente</small>
          </button>
        </nav>

        <div className="sidebar__spacer" />

        <div className="sidebar__future-card">
          <span className="sidebar__future-icon"><Sparkles size={16} aria-hidden="true" /></span>
          <strong>Más adelante</strong>
          <p>Objetivos y datos nutricionales, sin rehacer tu menú.</p>
        </div>

        <button className="sidebar__settings" type="button" disabled title="Próximamente">
          <Settings2 size={17} aria-hidden="true" /> Ajustes
        </button>
      </aside>

      <div className="app-main">
        <header className="topbar">
          <div className="topbar__context">
            <span className="topbar__eyebrow">Planificador personal</span>
            <span className="topbar__title">Tu semana, a tu ritmo</span>
          </div>
          <div className="topbar__actions">
            <button className="new-recipe-top-action" type="button" onClick={startCreatingRecipe}>
              <Plus size={17} aria-hidden="true" />
              <span>Nueva receta</span>
            </button>
            <AccountMenu
              className="topbar__account"
              identity={identity}
              onOpenPreferences={() => setIsPreferencesOpen(true)}
              onSignOut={closeSession}
            />
          </div>
        </header>

        <main className="content">
          <TabsSubtlePanel index={0} selectedIndex={selectedTabIndex} idPrefix="mobile-navigation">
            <TodayMeals
              plan={dashboard.plan}
              onOpenRecipe={(recipeId) => void openRecipe(recipeId)}
              onSelectSlot={setAssignmentSlot}
            />
          </TabsSubtlePanel>
          <TabsSubtlePanel index={1} selectedIndex={selectedTabIndex} idPrefix="mobile-navigation">
            <WeeklyBoard plan={dashboard.plan} onSelectSlot={setAssignmentSlot} />
          </TabsSubtlePanel>
          <TabsSubtlePanel index={2} selectedIndex={selectedTabIndex} idPrefix="mobile-navigation">
            <RecipeLibrary
              recipes={dashboard.recipes}
              onCreateRecipe={startCreatingRecipe}
              onOpenRecipe={(recipeId) => void openRecipe(recipeId)}
            />
          </TabsSubtlePanel>
        </main>

        <nav className="mobile-nav" aria-label="Navegación móvil">
          <button className="mobile-nav__create" type="button" onClick={startCreatingRecipe} aria-label="Crear receta">
            <Plus size={21} aria-hidden="true" />
          </button>
          <TabsSubtle
            selectedIndex={selectedTabIndex}
            onSelect={(index) => navigate(getAppViewForTabIndex(index))}
            idPrefix="mobile-navigation"
            activeLabel
            className="mobile-nav__tabs"
            aria-label="Secciones principales"
          >
            <TabsSubtleItem
              index={0}
              icon={Sun}
              label="Hoy"
              className="mobile-nav__tab"
            />
            <TabsSubtleItem
              index={1}
              icon={LayoutGrid}
              label="Plan"
              className="mobile-nav__tab"
            />
            <TabsSubtleItem
              index={2}
              icon={BookOpen}
              label="Recetas"
              className="mobile-nav__tab"
            />
          </TabsSubtle>
          <AccountMenu
            className="mobile-nav__account"
            identity={identity}
            mobile
            onOpenPreferences={() => setIsPreferencesOpen(true)}
            onSignOut={closeSession}
          />
        </nav>
      </div>

      <AssignmentDialog
        key={assignmentSlot?.id ?? "no-slot"}
        slot={assignmentSlot}
        recipes={dashboard.recipes}
        isSaving={isAssigning}
        onClose={() => setAssignmentSlot(null)}
        onSave={saveSlotRecipes}
      />
      <RecipeDetailDrawer
        recipe={selectedRecipe}
        isLoading={isLoadingRecipe}
        onClose={closeRecipeDetail}
        onEdit={startEditingRecipe}
        onDelete={(recipe) => void deleteRecipe(recipe)}
      />
      {isRecipeFormOpen ? (
        <RecipeFormDialog
          key={recipeBeingEdited?.id ?? "new-recipe"}
          recipe={recipeBeingEdited}
          existingTags={dashboard.recipes.flatMap((item) => item.tags)}
          onClose={() => setIsRecipeFormOpen(false)}
          onSave={saveRecipe}
        />
      ) : null}

      <SettingsDialog open={isPreferencesOpen} onOpenChange={setIsPreferencesOpen} />

      {toast ? (
        <div className={`toast toast--${toast.tone}`} role="status" aria-live="polite">
          {toast.tone === "success" ? <CheckCircle2 size={18} aria-hidden="true" /> : <CircleAlert size={18} aria-hidden="true" />}
          <span>{toast.message}</span>
        </div>
      ) : null}
    </div>
  );
}

function AccountMenu({
  className,
  identity,
  mobile = false,
  onOpenPreferences,
  onSignOut,
}: {
  className: string;
  identity: AppShellProps["identity"];
  mobile?: boolean;
  onOpenPreferences: () => void;
  onSignOut: () => void;
}) {
  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownTrigger
          render={
            <button
              className="avatar-button"
              type="button"
              aria-label="Abrir menú de cuenta"
              title={identity.displayName}
            >
              <span className="avatar" aria-hidden="true">
                {getInitials(identity.displayName)}
              </span>
            </button>
          }
        />
        <DropdownContent
          side={mobile ? "top" : "bottom"}
          align="end"
        >
          <MenuItem
            index={0}
            icon={Settings2}
            label="Preferencias"
            onSelect={onOpenPreferences}
            aria-label="Abrir preferencias"
            title="Preferencias"
          />
          <MenuItem
            index={1}
            icon={LogOut}
            label="Cerrar sesión"
            onSelect={onSignOut}
            aria-label="Cerrar sesión"
            title={`Cerrar sesión${identity.email ? ` (${identity.email})` : ""}`}
          />
        </DropdownContent>
      </DropdownMenu>
    </div>
  );
}

function NavigationButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className={`sidebar-nav__item ${active ? "sidebar-nav__item--active" : ""}`}
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function getErrorMessage(error: unknown, onAuthenticationRequired?: () => void) {
  if (error instanceof ApiClientError) {
    if (error.status === 401) {
      onAuthenticationRequired?.();
      return "Tu sesión ha terminado. Redirigiendo al acceso…";
    }

    return error.message;
  }

  return "No se ha podido completar la operación. Inténtalo de nuevo.";
}

function getInitials(displayName: string) {
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  return initials.toLocaleUpperCase("es-ES") || "N";
}
