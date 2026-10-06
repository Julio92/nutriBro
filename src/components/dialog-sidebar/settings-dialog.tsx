"use client";

import { useState, type ReactNode } from "react";
import { Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckboxGroup, CheckboxItem } from "@/components/ui/checkbox-group";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useIcons, type IconName } from "@/lib/icon-context";
import { cn } from "@/lib/utils";
import { fontWeights } from "@/lib/font-weight";
import { useTheme, type ThemePreference } from "@/components/theme-provider";
import type { MealVisibilityPreferences } from "@/domain/preferences/types";
import type { MealTypeId } from "@/domain/nutrition/types";

// ---------------------------------------------------------------------------
// A settings dialog: the `xl` Dialog as a canvas, a non-collapsing Sidebar
// of sections down its left edge, and a scrolling panel for the section's
// controls. The sidebar is the same composable Sidebar the app shell uses —
// it just lives in a bounded frame: `collapsible="none"` drops the rail and
// the drawer, the provider is told not to persist or listen for the
// shortcut, and `h-full` pins both to the dialog's fixed height.
//
// Below the `sm` breakpoint the column would leave no room for the panel,
// so it hides and a Select at the top of the panel takes over navigation.
// ---------------------------------------------------------------------------

interface SettingsSection {
  id: PreferencesSection;
  label: string;
  icon: IconName;
  description: string;
}

type PreferencesSection = "general" | "appearance";
type MealPreferenceKey = MealTypeId;

const MEAL_OPTIONS: { key: MealPreferenceKey; label: string }[] = [
  { key: "breakfast", label: "Desayuno" },
  { key: "midMorning", label: "Media Mañana" },
  { key: "lunch", label: "Comida" },
  { key: "snack", label: "Merienda" },
  { key: "dinner", label: "Cena" },
];

const SECTIONS: SettingsSection[] = [
  { id: "general", label: "General", icon: "settings", description: "Ajustes generales de la aplicación" },
  { id: "appearance", label: "Apariencia", icon: "palette", description: "Cambia la apariencia de la aplicación." },
];

export interface SettingsDialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  mealVisibility: MealVisibilityPreferences;
  onSaveMealVisibility: (preferences: MealVisibilityPreferences) => Promise<void>;
  /** The section shown first. @default "general" */
  defaultSection?: PreferencesSection;
}

export function SettingsDialog({
  open,
  defaultOpen,
  onOpenChange,
  mealVisibility,
  onSaveMealVisibility,
  defaultSection = "general",
}: SettingsDialogProps) {
  const icons = useIcons();
  const [section, setSection] = useState<PreferencesSection>(defaultSection);
  const [draftMealVisibility, setDraftMealVisibility] = useState(mealVisibility);
  const [isSavingMealVisibility, setIsSavingMealVisibility] = useState(false);
  const [mealVisibilitySaveStatus, setMealVisibilitySaveStatus] = useState<{
    tone: "success" | "error";
    message: string;
  } | null>(null);
  const current = SECTIONS.find((s) => s.id === section) ?? SECTIONS[0];

  async function saveMealVisibility() {
    setIsSavingMealVisibility(true);
    setMealVisibilitySaveStatus(null);
    try {
      await onSaveMealVisibility(draftMealVisibility);
      setMealVisibilitySaveStatus({
        tone: "success",
        message: "Preferencias guardadas.",
      });
    } catch (error) {
      setMealVisibilitySaveStatus({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : "No se han podido guardar las preferencias. Inténtalo de nuevo.",
      });
    } finally {
      setIsSavingMealVisibility(false);
    }
  }

  return (
    <Dialog open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <DialogContent
        size="xl"
        // The dialog's padding and centering give way to the two-column
        // shell; the height is fixed so the panel scrolls inside it.
        className="flex h-[min(640px,calc(100dvh-4rem))] overflow-hidden p-0"
      >
        <SidebarProvider
          persist={false}
          shortcut={null}
          width="13rem"
          className="h-full min-h-0"
        >
          <Sidebar
            collapsible="none"
            className="hidden h-full sm:flex bg-[rgb(var(--overlay)/0.03)]"
          >
            <SidebarHeader className="px-4 pt-5 pb-2">
              {/* Headings here are labels, not a headline: the dialog's own
                  title weight would out-shout the nav beneath it. */}
              <DialogTitle style={{ fontVariationSettings: fontWeights.normal }}>
                Preferencias
              </DialogTitle>
              <DialogDescription className="sr-only">
                Preferencias de apariencia y configuración general.
              </DialogDescription>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Preferencias</SidebarGroupLabel>
                {/* Rows are the whole surface here; keyboard focus moves the
                    highlight instead of drawing a ring. */}
                <SidebarMenu focusRing={false}>
                  {SECTIONS.map((s) => (
                    <SidebarMenuItem key={s.id}>
                      <SidebarMenuButton
                        icon={icons[s.icon]}
                        isActive={s.id === section}
                        onClick={() => setSection(s.id)}
                      >
                        {s.label}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>

          <div className="flex min-w-0 flex-1 flex-col">
            {/* Panel header — pr-12 keeps clear of the dialog's ✕. */}
            <div className="flex shrink-0 flex-col gap-1 px-6 pt-5 pb-4 pr-12">
              <div className="sm:hidden">
                {/* The dialog's one DialogTitle lives in the sidebar header
                    (a referenced title names the dialog even while hidden);
                    this is the visible heading for narrow screens. */}
                <h2
                  className="mb-3 text-[16px] leading-tight text-foreground"
                  style={{ fontVariationSettings: fontWeights.normal }}
                >
                  Preferencias
                </h2>
                <Select
                  value={section}
                  onValueChange={(value) => setSection(value as PreferencesSection)}
                >
                  <SelectTrigger placeholder="Sección" aria-label="Sección de preferencias" />
                  <SelectContent>
                    {SECTIONS.map((s, i) => (
                      <SelectItem key={s.id} index={i} value={s.id} icon={icons[s.icon]}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <h3
                className="hidden text-[16px] leading-tight text-foreground sm:block"
                style={{ fontVariationSettings: fontWeights.normal }}
              >
                {current.label}
              </h3>
              <p className="hidden text-[13px] text-muted-foreground sm:block">
                {current.description}
              </p>
            </div>
            <ScrollArea className="min-h-0 flex-1">
              <div className="flex flex-col gap-6 px-6 pb-6">
                <SelectionPanel
                  id={current.id}
                  mealPreferences={draftMealVisibility}
                  savedMealPreferences={mealVisibility}
                  isSaving={isSavingMealVisibility}
                  saveStatus={mealVisibilitySaveStatus}
                  onSaveMealPreferences={saveMealVisibility}
                  onToggleMealPreference={(key) => {
                    if (isSavingMealVisibility) return;
                    setMealVisibilitySaveStatus(null);
                    setDraftMealVisibility((currentPreferences) => ({
                      ...currentPreferences,
                      [key]: !currentPreferences[key],
                    }));
                  }}
                />
              </div>
            </ScrollArea>
          </div>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Section panels use the existing NutriBro preference controls.
// ---------------------------------------------------------------------------

function SettingRow({
  label,
  description,
  children,
  className,
}: {
  label: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-6 border-b border-border/60 py-4 last:border-b-0",
        className
      )}
    >
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-[13px] text-foreground">{label}</span>
        {description && (
          <span className="text-[12px] text-muted-foreground">{description}</span>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function SelectionPanel({
  id,
  mealPreferences,
  savedMealPreferences,
  isSaving,
  saveStatus,
  onSaveMealPreferences,
  onToggleMealPreference,
}: {
  id: PreferencesSection;
  mealPreferences: MealVisibilityPreferences;
  savedMealPreferences: MealVisibilityPreferences;
  isSaving: boolean;
  saveStatus: { tone: "success" | "error"; message: string } | null;
  onSaveMealPreferences: () => void;
  onToggleMealPreference: (key: MealPreferenceKey) => void;
}) {
  if (id === "appearance") {
    return <AppearancePanel />;
  }

  return (
    <SettingsPanel
      mealPreferences={mealPreferences}
      savedMealPreferences={savedMealPreferences}
      isSaving={isSaving}
      saveStatus={saveStatus}
      onSaveMealPreferences={onSaveMealPreferences}
      onToggleMealPreference={onToggleMealPreference}
    />
  );
}

function SettingsPanel({
  mealPreferences,
  savedMealPreferences,
  isSaving,
  saveStatus,
  onSaveMealPreferences,
  onToggleMealPreference,
}: {
  mealPreferences: MealVisibilityPreferences;
  savedMealPreferences: MealVisibilityPreferences;
  isSaving: boolean;
  saveStatus: { tone: "success" | "error"; message: string } | null;
  onSaveMealPreferences: () => void;
  onToggleMealPreference: (key: MealPreferenceKey) => void;
}) {
  const checkedIndices = new Set(
    MEAL_OPTIONS.flatMap(({ key }, index) =>
      mealPreferences[key] ? [index] : []
    )
  );
  const hasChanges = MEAL_OPTIONS.some(
    ({ key }) => mealPreferences[key] !== savedMealPreferences[key],
  );

  return (
    <div className="flex flex-col gap-3">
      <p
        id="meal-preference-description"
        className="text-[12px] text-muted-foreground"
      >
        Selecciona qué comidas quieres mostrar en tu planificación.
      </p>
      <CheckboxGroup
        checkedIndices={checkedIndices}
        aria-label="Configuración de visibilidad de comidas"
        aria-describedby="meal-preference-description"
        aria-disabled={isSaving}
        className="w-full"
      >
        {MEAL_OPTIONS.map(({ key, label }, index) => (
          <CheckboxItem
            key={key}
            index={index}
            label={label}
            checked={mealPreferences[key]}
            aria-disabled={isSaving}
            onToggle={() => onToggleMealPreference(key)}
          />
        ))}
      </CheckboxGroup>
      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          leadingIcon={Save}
          loading={isSaving}
          aria-busy={isSaving}
          disabled={!hasChanges}
          onClick={onSaveMealPreferences}
        >
          Guardar cambios
        </Button>
        {saveStatus ? (
          <p
            className={saveStatus.tone === "error" ? "text-destructive" : "text-muted-foreground"}
            role={saveStatus.tone === "error" ? "alert" : "status"}
            aria-live={saveStatus.tone === "error" ? "assertive" : "polite"}
          >
            {saveStatus.message}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function AppearancePanel() {
  const icons = useIcons();
  const { themePreference, setThemePreference } = useTheme();
  const themeIcons = { system: icons.monitor, light: icons.sun, dark: icons.moon };
  return (
    <div className="flex flex-col">
      <SettingRow
        className="preferences-theme-row"
        label="Tema de la aplicación"
        description="Elige el tema del dispositivo o selecciona uno manualmente."
      >
        <Select
          value={themePreference}
          onValueChange={(value) => {
            if (value === "system" || value === "light" || value === "dark") {
              setThemePreference(value as ThemePreference);
            }
          }}
        >
          <SelectTrigger
            className="preferences-theme__select"
            icon={themeIcons[themePreference]}
            placeholder="Tema"
            aria-label="Tema de la aplicación"
          />
          <SelectContent>
            <SelectItem index={0} value="system" icon={icons.monitor}>Sistema</SelectItem>
            <SelectItem index={1} value="light" icon={icons.sun}>Claro</SelectItem>
            <SelectItem index={2} value="dark" icon={icons.moon}>Oscuro</SelectItem>
          </SelectContent>
        </Select>
      </SettingRow>
    </div>
  );
}
