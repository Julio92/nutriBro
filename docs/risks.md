# Riesgos técnicos y mitigaciones

| Riesgo | Impacto | Probabilidad actual | Mitigación actual | Acción antes de escalar |
| --- | --- | --- | --- | --- |
| Variables Neon/Auth.js sin configurar | El acceso y los datos no están disponibles | Alta antes de la primera configuración | Pantalla de acceso y APIs fallan de forma explícita sin usar datos compartidos | Configurar secretos por entorno, comprobar conexión y añadir verificaciones de despliegue. |
| Ataques de fuerza bruta o credential stuffing | Acceso no autorizado a cuentas locales | Media en una app pública | Contraseñas de 12+ caracteres, hash Argon2id y error genérico de inicio de sesión | Rate limiting por IP/cuenta, CAPTCHA adaptativo, MFA y monitorización. |
| Recuperación de contraseña ausente | Una cuenta puede quedar inaccesible | Media | Alcance explícitamente limitado a desarrollo local | Implementar enlace de un solo uso, expiración, verificación de email y revocación de sesiones. |
| Secretos expuestos o rotados sin control | Secuestro de sesiones o acceso a base de datos | Baja con buenas prácticas | `.env*` se ignora, no hay secretos públicos y Vercel gestiona variables | Rotación, acceso mínimo, alertas de secretos y revisión de logs. |
| Límites o cold starts del plan gratuito de Neon | Latencia inicial o indisponibilidad al superar cuota | Media | Conexión HTTP serverless y esquema compacto | Alertas de cuota, exportaciones, plan de pago y prueba de restauración. |
| Escrituras concurrentes sobre el mismo menú | Una actualización puede sobrescribir una edición reciente | Baja en uso personal; media al crecer | El lote de Neon mantiene cada sincronización atómica y el agregado se limita a un usuario | Añadir revisión/versionado optimista o mutaciones SQL granulares antes de colaboración o alta concurrencia. |
| Importación JSON destructiva | Pérdida de datos de la cuenta destino | Media durante la migración | Exige `NUTRITION_IMPORT_CONFIRM=replace`, UUID destino y remapea IDs | Copia de seguridad previa, modo de previsualización y registro de importaciones. |
| Transcripción incompleta del plan fuente | Ingredientes o pasos ambiguos en la biblioteca inicial | Media al actualizar el plan | Las recetas se versionan, se validan con Zod y las porciones sin elaboración no se convierten en recetas | Revisar cada nueva versión con la persona usuaria y registrar las correcciones de origen. |
| Borrado de receta limpia asignaciones | Una acción afecta múltiples comidas | Media | Confirmación, contador de huecos limpiados y FK `ON DELETE SET NULL` | Historial, papelera y confirmación con detalle de huecos afectados. |
| Ingredientes como texto libre | No se pueden sumar unidades de forma fiable | Alta | Deliberado: no hay cálculos ni datos nutricionales | Catálogo de alimentos, cantidades decimales y unidades canónicas. |
| URLs de imagen externas | Privacidad, contenido cambiante o imagen rota | Media | Solo HTTPS, sin carga de archivos ni proxy | Media propia, lista de dominios o proxy seguro con análisis de archivos. |
| Cobertura solo unitaria | Fallos de registro, sesión, UI o navegador no detectados | Media | Pruebas de dominio, servicio y respuestas HTTP | Añadir Playwright para registro, acceso, aislamiento de cuentas, CRUD y accesibilidad. |
| Dependencias npm | Vulnerabilidades aguas arriba | Media | Lockfile y auditoría de npm; hay vulnerabilidades moderadas pendientes de revisión | Renovación automática, SCA, evaluación de advisories y parches en CI. |
| CSP con `unsafe-inline` | Protección de scripts menos estricta | Baja | CSP, origen único y ausencia de HTML no confiable; `unsafe-eval` solo en desarrollo | Usar nonce por solicitud para script y estilos al añadir terceros. |

## Operación de base de datos

- Aplica la migración antes de desplegar una versión que dependa de tablas o columnas nuevas.
- Conserva el JSON heredado hasta comprobar la importación y hacer una copia de seguridad de Neon.
- Usa una base y credenciales diferentes para desarrollo, preview y producción.
- Rota `AUTH_SECRET` de forma planificada: cambiarlo invalida todas las sesiones JWT existentes.

## Límites de producto que deben mantenerse explícitos

La aplicación no debe presentar las recetas como consejo médico ni simular datos nutricionales. Si se añaden metas o cálculos, deben indicar fuente de datos, fechas, incertidumbre y una advertencia para necesidades clínicas.
