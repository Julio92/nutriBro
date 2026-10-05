"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";

type Theme = "light" | "dark";
export type ThemePreference = Theme | "system";

interface ThemeContextValue {
  theme: Theme;
  themePreference: ThemePreference;
  setThemePreference: (preference: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);
const THEME_STORAGE_KEY = "nutribro-theme";
const LEGACY_THEME_STORAGE_KEY = "nutria-theme";
const THEME_CHANGE_EVENT = "nutribro-theme-change";
const SYSTEM_THEME_QUERY = "(prefers-color-scheme: dark)";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

function isThemePreference(value: string | null): value is ThemePreference {
  return value === "system" || value === "light" || value === "dark";
}

function getThemePreferenceSnapshot(): ThemePreference {
  if (typeof window === "undefined") return "system";

  try {
    const storedPreference =
      window.localStorage.getItem(THEME_STORAGE_KEY) ??
      window.localStorage.getItem(LEGACY_THEME_STORAGE_KEY);
    return isThemePreference(storedPreference) ? storedPreference : "system";
  } catch {
    return "system";
  }
}

function resolveTheme(preference: ThemePreference): Theme {
  if (preference !== "system") return preference;
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return "light";
  }

  return window.matchMedia(SYSTEM_THEME_QUERY).matches ? "dark" : "light";
}

function getThemeSnapshot(): Theme {
  if (typeof document === "undefined") {
    return "light";
  }

  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function subscribeToTheme(callback: () => void) {
  function handleStorage(event: StorageEvent) {
    if (
      event.key !== null &&
      event.key !== THEME_STORAGE_KEY &&
      event.key !== LEGACY_THEME_STORAGE_KEY
    ) {
      return;
    }

    applyTheme(resolveTheme(getThemePreferenceSnapshot()));
    callback();
  }

  window.addEventListener("storage", handleStorage);
  window.addEventListener(THEME_CHANGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(THEME_CHANGE_EVENT, callback);
  };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const themePreference = useSyncExternalStore<ThemePreference>(
    subscribeToTheme,
    getThemePreferenceSnapshot,
    () => "system",
  );
  const theme = useSyncExternalStore<Theme>(
    subscribeToTheme,
    getThemeSnapshot,
    () => "light",
  );

  const setThemePreference = useCallback((preference: ThemePreference) => {
    window.localStorage.setItem(THEME_STORAGE_KEY, preference);
    applyTheme(resolveTheme(preference));
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }, []);

  useEffect(() => {
    if (
      themePreference !== "system" ||
      typeof window.matchMedia !== "function"
    ) {
      return;
    }

    const mediaQuery = window.matchMedia(SYSTEM_THEME_QUERY);
    const syncSystemTheme = () => {
      applyTheme(resolveTheme("system"));
      window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
    };

    syncSystemTheme();
    mediaQuery.addEventListener("change", syncSystemTheme);
    return () => mediaQuery.removeEventListener("change", syncSystemTheme);
  }, [themePreference]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      themePreference,
      setThemePreference,
    }),
    [theme, themePreference, setThemePreference],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme debe utilizarse dentro de ThemeProvider.");
  }

  return context;
}
