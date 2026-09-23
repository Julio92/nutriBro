"use client";

import {
  BookOpen,
  CheckCircle2,
  CircleAlert,
  LayoutGrid,
  Leaf,
  LogOut,
  Moon,
  Plus,
  Settings2,
  ShoppingBasket,
  Sparkles,
  Sun,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

import type {
  DashboardData,
  MealSlotView,
  RecipeDetail,
  RecipeInput,
} from "@/domain/nutrition/types";
import { ApiClientError, nutritionApi } from "@/lib/api-client";

import { AssignmentDialog } from "./assignment-dialog";
import { RecipeDetailDrawer } from "./recipe-detail-drawer";
import { RecipeFormDialog } from "./recipe-form-dialog";
import { RecipeLibrary } from "./recipe-library";
import { useTheme } from "./theme-provider";
import { TodayMeals } from "./today-meals";
import { WeeklyBoard } from "./weekly-board";

type AppView = "plan" | "recipes";
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
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [dashboard, setDashboard] = useState(initialData);
  const [activeView, setActiveView] = useState<AppView>("plan");
  const [assignmentSlot, setAssignmentSlot] = useState<MealSlotView | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeDetail | null>(null);
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(false);
  const [isRecipeFormOpen, setIsRecipeFormOpen] = useState(false);
  const [recipeBeingEdited, setRecipeBeingEdited] = useState<RecipeDetail | null>(null);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [toast, setToast] = useState<Toast>(null);
  const detailRequestId = useRef(0);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

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
        <button className="brand" type="button" onClick={() => navigate("plan")}>
          <span className="brand__mark" aria-hidden="true"><Leaf size={19} /></span>
          <span>nutriBro</span>
        </button>

        <nav className="sidebar__nav">
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
          <button className="brand brand--mobile" type="button" onClick={() => navigate("plan")}>
            <span className="brand__mark" aria-hidden="true"><Leaf size={18} /></span>
            <span>nutriBro</span>
          </button>
          <div className="topbar__context">
            <span className="topbar__eyebrow">Planificador personal</span>
            <span className="topbar__title">Tu semana, a tu ritmo</span>
          </div>
          <div className="topbar__actions">
            <button className="new-recipe-top-action" type="button" onClick={startCreatingRecipe}>
              <Plus size={17} aria-hidden="true" />
              <span>Nueva receta</span>
            </button>
            <div className="topbar__account" ref={accountMenuRef}>
              <button
                className="avatar-button"
                type="button"
                onClick={() => setIsAccountMenuOpen((current) => !current)}
                aria-label="Abrir menú de cuenta"
                aria-expanded={isAccountMenuOpen}
                aria-controls="account-menu"
                title={identity.displayName}
              >
                <span className="avatar" aria-hidden="true">
                  {getInitials(identity.displayName)}
                </span>
              </button>

              {isAccountMenuOpen ? (
                <div
                  id="account-menu"
                  className="account-menu"
                  role="menu"
                  aria-label="Menú de cuenta"
                  onMouseDown={(event) => event.stopPropagation()}
                >
                  <button
                    className="account-menu__item theme-toggle theme-toggle--menu"
                    type="button"
                    onClick={() => {
                      toggleTheme();
                    }}
                    aria-label={theme === "light" ? "Activar modo oscuro" : "Activar modo claro"}
                    title={theme === "light" ? "Activar modo oscuro" : "Activar modo claro"}
                  >
                    {theme === "light" ? <Moon size={16} aria-hidden="true" /> : <Sun size={16} aria-hidden="true" />}
                    <span>{theme === "light" ? "Modo oscuro" : "Modo claro"}</span>
                  </button>
                  <button
                    className="account-menu__item sign-out-action sign-out-action--menu"
                    type="button"
                    onClick={() => {
                      closeSession();
                    }}
                    aria-label="Cerrar sesión"
                    title={`Cerrar sesión${identity.email ? ` (${identity.email})` : ""}`}
                  >
                    <LogOut size={16} aria-hidden="true" />
                    <span>Cerrar sesión</span>
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <main className="content">
          {activeView === "plan" ? (
            <>
              <TodayMeals
                plan={dashboard.plan}
                onOpenRecipe={(recipeId) => void openRecipe(recipeId)}
                onSelectSlot={setAssignmentSlot}
              />

              <WeeklyBoard plan={dashboard.plan} onSelectSlot={setAssignmentSlot} />
            </>
          ) : (
            <RecipeLibrary
              recipes={dashboard.recipes}
              onCreateRecipe={startCreatingRecipe}
              onOpenRecipe={(recipeId) => void openRecipe(recipeId)}
            />
          )}
        </main>

        <nav className="mobile-nav" aria-label="Navegación móvil">
          <NavigationButton
            active={activeView === "plan"}
            icon={<LayoutGrid size={19} aria-hidden="true" />}
            label="Plan"
            onClick={() => navigate("plan")}
          />
          <button className="mobile-nav__create" type="button" onClick={startCreatingRecipe} aria-label="Crear receta">
            <Plus size={21} aria-hidden="true" />
          </button>
          <NavigationButton
            active={activeView === "recipes"}
            icon={<BookOpen size={19} aria-hidden="true" />}
            label="Recetas"
            onClick={() => navigate("recipes")}
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
          onClose={() => setIsRecipeFormOpen(false)}
          onSave={saveRecipe}
        />
      ) : null}

      {toast ? (
        <div className={`toast toast--${toast.tone}`} role="status" aria-live="polite">
          {toast.tone === "success" ? <CheckCircle2 size={18} aria-hidden="true" /> : <CircleAlert size={18} aria-hidden="true" />}
          <span>{toast.message}</span>
        </div>
      ) : null}
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
