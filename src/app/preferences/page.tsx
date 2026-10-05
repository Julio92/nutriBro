"use client";

import Link from "next/link";
import { ArrowLeft, Check, Save } from "lucide-react";
import { useState } from "react";

const initialMealPreferences = {
  desayuno: true,
  mediaManana: true,
  comida: true,
  merienda: true,
  cena: true,
};

const mealOptions = [
  { key: "desayuno", label: "Desayuno" },
  { key: "mediaManana", label: "Media Mañana" },
  { key: "comida", label: "Comida" },
  { key: "merienda", label: "Merienda" },
  { key: "cena", label: "Cena" },
] as const;

export default function PreferencesPage() {
  const [preferences, setPreferences] = useState(initialMealPreferences);

  function toggleMealPreference(key: keyof typeof initialMealPreferences) {
    setPreferences((currentPreferences) => ({
      ...currentPreferences,
      [key]: !currentPreferences[key],
    }));
  }

  return (
    <div className="preferences-page">
      <section className="preferences-panel" aria-label="Ajustes">
        <header className="preferences-header" aria-label="Cabecera de ajustes">
          <div className="preferences-header__left">
            <Link href="/" className="icon-button preferences-back" aria-label="Volver al inicio" title="Volver">
              <ArrowLeft size={16} aria-hidden="true" />
            </Link>
            <div className="preferences-header__meta">
              <h1 className="preferences-header__label">Ajustes</h1>
            </div>
          </div>

          <div className="preferences-header__actions">
            <button className="icon-button icon-button--primary" type="button" aria-label="Guardar ajustes">
              <Save size={18} aria-hidden="true" />
            </button>
          </div>
        </header>

        <p className="preferences-description">
          Elige qué comidas quieres mostrar en tu vista semanal.
        </p>

        <div className="preferences-list" role="group" aria-label="Configuración de visibilidad de comidas">
          {mealOptions.map(({ key, label }) => {
            const isChecked = preferences[key];

            return (
              <label key={key} className="preferences-item">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleMealPreference(key)}
                  aria-label={`Mostrar ${label}`}
                />
                <span className="preferences-item__control" aria-hidden="true">
                  {isChecked ? <Check size={12} /> : null}
                </span>
                <span className="preferences-item__label">{label}</span>
              </label>
            );
          })}
        </div>
      </section>
    </div>
  );
}
