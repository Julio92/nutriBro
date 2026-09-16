# Instrucciones del proyecto Nutribro

- [x] Requisitos definidos: MVP web de nutrición semanal, TypeScript, UI responsive, persistencia local y pruebas.
- [x] Proyecto inicializado con Next.js App Router, TypeScript, Tailwind CSS y ESLint.
- [x] Aplicación personalizada con un dominio desacoplado, Route Handlers, repositorio JSON, biblioteca de recetas y tablero semanal.
- [x] No requiere extensiones adicionales de VS Code.
- [x] Validar los cambios con `npm run check` antes de integrar.
- [x] Usar `npm run dev` para desarrollo local. No iniciar servidores persistentes durante una tarea salvo que sea necesario para una comprobación puntual.
- [x] Mantener README y documentación en `docs/` cuando cambie arquitectura, modelo, endpoints o alcance.

## Convenciones

- Mantener TypeScript estricto y validar toda entrada HTTP con Zod.
- No acceder a la persistencia directamente desde componentes ni Route Handlers; usar `NutritionService` y `NutritionRepository`.
- Respetar la separación: UI en `src/components`, dominio en `src/domain`, aplicación en `src/server/services` e infraestructura en `src/server/infrastructure`.
- El menú recurrente es la fuente de verdad del MVP. No añadir cálculos nutricionales, IA, autenticación o lista de compra sin actualizar el alcance y la documentación.
- El archivo activo `data/nutrition-data.json` es local y no debe versionarse. Los datos reproducibles están en `data/demo-nutrition-data.json`.
- Antes de reemplazar JSON por una base de datos, conservar el contrato `NutritionRepository` y añadir migraciones y pruebas de integración.
- Preservar accesibilidad: etiquetas, foco visible, contraste y preferencia de reducción de movimiento.
