# Nutribro

Planificador personal de recetas con un menú recurrente de siete días y cinco comidas. Cada cuenta tiene su propio espacio: crea recetas reutilizables, asigna una o más a cada comida y consulta primero las comidas del día actual.

## Incluye

- Vista del día actual seguida del tablero semanal de lunes a domingo.
- CRUD de recetas con ingredientes dinámicos, elaboración e imagen HTTPS opcional.
- Selector para asignar o quitar una o más recetas de cada comida, y biblioteca con búsqueda y filtros.
- Registro e inicio de sesión local con email, contraseña y hashes Argon2id.
- Sesiones JWT firmadas por Auth.js y datos de producto persistentes en PostgreSQL.
- Biblioteca inicial de 21 recetas del plan proporcionado, copiada de forma privada para cada cuenta nueva.
- Aislamiento de datos por usuario y creación automática de un menú vacío de 35 comidas al registrarse.
- Tema claro/oscuro, diseño responsive, accesibilidad básica, cabeceras de seguridad y pruebas unitarias.

No calcula nutrientes, no genera menús con IA y no ofrece lista de la compra todavía.

## Stack elegido

| Área | Tecnología | Motivo |
| --- | --- | --- |
| Web full-stack | Next.js 16 + React 19 | Renderizado en servidor, rutas API y cliente interactivo en un único despliegue. |
| Persistencia | Neon PostgreSQL + Drizzle ORM | Base de datos gestionada apta para Vercel, esquema tipado y migraciones SQL versionadas. |
| Identidad | Auth.js Credentials + Argon2id | Registro local y sesiones JWT, sin depender aún de OAuth. |
| Tipado y validación | TypeScript + Zod | Contratos explícitos y validación de toda entrada HTTP. |
| UI | CSS moderno + Lucide | Interfaz ligera, responsive y sin kit de componentes rígido. |
| Pruebas | Vitest | Pruebas rápidas de reglas de dominio y casos de uso. |
| Despliegue | Vercel + Neon | Infraestructura serverless y base de datos externa persistente. |

Consulta las decisiones detalladas en [docs/architecture.md](docs/architecture.md).

## Requisitos

- Node.js 22.12 o superior.
- Una base de datos Neon PostgreSQL de desarrollo. La aplicación se ejecuta en localhost y sus datos se guardan en esa base remota aislada.
- Docker opcional para ejecutar el contenedor localmente.

## Instalación y ejecución local

1. Instala dependencias y crea el archivo local de variables:

	```bash
	npm install
	cp .env.example .env.local
	```

2. Completa `DATABASE_URL` con la conexión de tu proyecto Neon de desarrollo y `AUTH_SECRET` con un valor aleatorio largo. No subas ese archivo a Git.
3. Aplica las migraciones y arranca la aplicación:

	```bash
	npm run db:migrate
	npm run dev
	```

Abre http://localhost:3000, crea una cuenta y accede con ella. La primera llegada al tablero crea su menú recurrente vacío de 35 comidas.

Los comandos que se conectan a Neon usan el almacén de certificados del sistema en Linux para conservar la verificación TLS incluso detrás de una red con certificados corporativos. No cambies la URL para desactivar la comprobación SSL ni uses `rejectUnauthorized: false`.

### Scripts disponibles

| Script | Acción |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo. |
| `npm run build` | Crea el artefacto optimizado y prepara sus recursos estáticos. |
| `npm run start` | Ejecuta el build standalone de producción y, en local, carga `.env.local` si existe. |
| `npm run lint` | Ejecuta ESLint. |
| `npm run test` | Ejecuta las pruebas unitarias una vez. |
| `npm run test:watch` | Ejecuta Vitest en modo observación. |
| `npm run db:generate` | Genera una migración desde el esquema Drizzle. |
| `npm run db:migrate` | Aplica las migraciones pendientes a `DATABASE_URL`. |
| `npm run db:import-json` | Importa datos del JSON heredado en una cuenta existente. |
| `npm run db:seed-default-recipes` | Añade una vez la biblioteca predeterminada a una cuenta existente. |
| `npm run db:seed` / `npm run seed` | Importa los datos de demostración en una cuenta existente. |
| `npm run check` | Ejecuta lint, tests y build secuencialmente. |

### Importar datos JSON heredados

Los ficheros de [data](data) permanecen como fuente de datos reproducible y no se leen en el runtime de producción. Crea una cuenta destino y obtén su UUID de la tabla `users`; después importa de forma explícita:

```bash
NUTRITION_IMPORT_USER_ID=<uuid> \
NUTRITION_IMPORT_CONFIRM=replace \
npm run db:seed
```

`replace` borra las recetas y el menú existentes de esa cuenta antes de cargar el origen. Para usar el archivo activo heredado en lugar de la demo, añade `NUTRITION_IMPORT_FILE=data/nutrition-data.json` al mismo comando. Las recetas reciben UUID nuevos para no colisionar con datos de otras cuentas.

### Biblioteca inicial del plan

Las cuentas locales nuevas reciben 21 recetas extraídas del plan semanal, con ingredientes e instrucciones. Los alimentos que el documento presenta como porciones sin elaboración —por ejemplo fruta, leche, pan, yogur o chocolate— no se convierten en recetas. Cada cuenta recibe copias propias, por lo que puede editarlas o borrarlas sin modificar la biblioteca de otras personas.

Para añadir la biblioteca una sola vez a una cuenta existente, usa una confirmación explícita. Si hay una sola cuenta en la base de desarrollo, activa `NUTRITION_DEFAULT_RECIPES_USE_SOLE_USER=1`; con varias cuentas, proporciona el UUID destino mediante `NUTRITION_DEFAULT_RECIPES_USER_ID`. La marca de versión evita duplicados.

## Estructura de carpetas

```text
.
├── data/                           # Fuente JSON heredada y datos demo reproducibles
├── drizzle/                        # Migraciones SQL y metadatos de Drizzle
├── docs/                           # Arquitectura, datos, UX, roadmap y riesgos
├── scripts/
│   ├── import-json.ts              # Importación explícita JSON → PostgreSQL
│   └── seed.ts                     # Alias de importación de datos demo
├── src/
│   ├── app/                        # Páginas, Route Handlers y estilos globales
│   ├── auth.ts                     # Configuración central de Auth.js
│   ├── components/                 # Componentes de UI y diálogos
│   ├── domain/auth/                # Contratos y validación de cuentas locales
│   ├── domain/nutrition/           # Entidades, reglas, contratos y esquemas
│   ├── lib/                        # Cliente API y formato de presentación
│   └── server/
│       ├── auth/                   # Identidad autenticada y configuración
│       ├── http/                   # Respuestas HTTP seguras
│       ├── infrastructure/         # Drizzle, Neon y repositorio PostgreSQL
│       ├── repositories/           # Puerto de persistencia
│       └── services/               # Casos de uso de nutrición
├── Dockerfile
├── docker-compose.yml
└── drizzle.config.ts
```

## Pruebas

Las pruebas cubren validación de recetas y URLs de imagen, credenciales locales, hash de contraseña, aislamiento de propietarios y el ciclo de crear, asignar, consultar y borrar una receta. Ejecuta el conjunto completo antes de integrar cambios:

```bash
npm run check
```

## Despliegue en Vercel

El lanzamiento público usa un repositorio GitHub privado, Vercel y una base Neon exclusiva para cada entorno. La aplicación no usa un disco local ni un volumen para datos de producto.

1. Sube el código, el lockfile y todas las migraciones a GitHub, pero nunca `.env.local`, `data/nutrition-data.json`, `.next` ni `node_modules`.
2. Crea una base Neon de producción vacía y ejecuta `npm run db:migrate` con su `DATABASE_URL` antes del primer despliegue. No importes los JSON heredados: el alta normal crea una biblioteca inicial privada y un menú vacío para cada cuenta.
3. Importa el repositorio en Vercel con el preset Next.js, Node.js 22, `npm ci` y `npm run build`.
4. Configura `DATABASE_URL` y `AUTH_SECRET` como secretos de Production. Configura valores distintos y una base Neon/branch independiente para Preview. No expongas ninguno mediante variables `NEXT_PUBLIC_*`.
5. En el Firewall de Vercel, limita por IP las solicitudes `POST` de `/sign-in`, `/sign-up` y `/api/auth/callback/credentials` a 10 solicitudes por 10 minutos y responde con `429`. Prueba primero la regla en modo de registro sobre un Preview antes de publicarla.
6. Comprueba en Production el registro, inicio y cierre de sesión, CRUD de recetas, asignación múltiple y persistencia tras recargar antes de anunciar la aplicación.

El fallback de `.env.local` de `npm run start` solo facilita la ejecución local desde la raíz del proyecto; no se copia dentro del artefacto standalone ni sustituye las variables inyectadas por Vercel.

El detalle operativo, la separación de entornos y el checklist de lanzamiento están en [docs/deployment.md](docs/deployment.md). Para Docker, exporta las dos variables requeridas y ejecuta `docker compose up --build`; el contenedor se conecta igualmente a Neon externo.

## Documentación de producto y diseño

- [Arquitectura y decisiones](docs/architecture.md)
- [Modelo de datos y API](docs/data-model.md)
- [Wireframes textuales](docs/wireframes.md)
- [Roadmap](docs/roadmap.md)
- [Riesgos técnicos](docs/risks.md)
