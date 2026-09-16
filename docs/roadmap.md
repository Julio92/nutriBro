# Roadmap de evolución

## Versión 1.0 — Menú recurrente (implementada)

- Menú de 7 días × 5 comidas y vista prioritaria del día actual.
- Recetas reutilizables con CRUD, ingredientes dinámicos, búsqueda y asignación a huecos.
- Tema claro/oscuro, responsive, accesibilidad básica y pruebas de dominio.

## Versión 1.1 — Datos y cuentas personales (implementada; pendiente de conexión Neon)

- Neon PostgreSQL, esquema Drizzle y migraciones SQL versionadas.
- Registro e inicio local con email/contraseña, hashes Argon2id y sesiones JWT de Auth.js.
- Aislamiento de recetas y menú por usuario, con aprovisionamiento automático de 35 huecos.
- Biblioteca inicial versionada de 21 recetas del plan, copiada y editable de forma privada por cuenta.
- Importación explícita del JSON heredado y datos demo, sin exposición compartida al registro.
- Preparación para despliegue Vercel sin dependencia de un disco local.

La verificación final de migraciones, registro y persistencia queda condicionada a configurar una base Neon de desarrollo y las variables locales `DATABASE_URL` y `AUTH_SECRET`.

## Versión 1.2 — Calidad operativa

- Edición de horarios y nombres de comidas.
- Reordenación de comidas y personalización de la estructura semanal.
- Exportación JSON para portabilidad y copia de seguridad verificable.
- Pantalla de perfil con nombre, imagen, borrado de cuenta y control de sesiones.
- Cambio y recuperación de contraseña, verificación de email, rate limiting y pruebas E2E.
- Añadir OAuth o enlaces mágicos solo cuando aporte valor y con una estrategia explícita de vinculación de cuentas.

## Versión 2.0 — Espacios y planificación por fechas

- Calendario con semanas ISO y navegación temporal.
- Plan recurrente base más sobrescrituras fechadas, plantillas y excepciones puntuales.
- Espacios compartidos, membresías, roles explícitos y auditoría de cambios.
- Histórico de planes y recetas utilizadas.

## Versión 3.0 — Nutrición y objetivos

- Catálogo de alimentos con unidades normalizadas.
- Nutrientes por ingrediente, receta, comida y día.
- Objetivos personales, preferencias, alergias y avisos de información incompleta.
- Trazabilidad de fuentes, fechas y redondeos transparentes.

## Versión 3.1 — Lista de la compra

- Agregación de ingredientes según los huecos seleccionados.
- Consolidación de unidades equivalentes con revisión manual.
- Exclusiones de despensa, categorías y estado de compra.
- Compartir o imprimir la lista.

## Versión 4.0 — Automatización responsable

- Sugerencias opcionales basadas en preferencias explícitas.
- Explicación de cada sugerencia y control humano antes de aplicarla.
- Ningún cálculo o recomendación de salud sin datos, fuente y límites claros.

## Criterios de prioridad

1. Mantener la autorización por recurso incluso al añadir roles o espacios compartidos.
2. No introducir nutrición antes de normalizar ingredientes y unidades.
3. Aplicar migraciones y copias de seguridad antes de activar cambios de esquema en producción.
4. Mantener siempre la edición manual como camino principal, incluso con automatizaciones.
