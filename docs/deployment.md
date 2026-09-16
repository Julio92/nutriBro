# Despliegue público en Vercel

## Alcance del primer lanzamiento

Nutribro se entrega desde el repositorio privado [Julio92/nutriBro](https://github.com/Julio92/nutriBro) a Vercel. La producción empieza con una base Neon vacía: no se trasladan recetas ni menús del entorno local. Cada persona que se registra recibe su propia biblioteca predeterminada y su plan recurrente vacío.

No forman parte de este corte una limpieza amplia, CI, endpoint de readiness, pruebas E2E, observabilidad o límites de autenticación por cuenta. El límite de acceso por IP del Firewall de Vercel sí es obligatorio antes de anunciar el sitio.

## Separación de entornos

| Entorno | Base de datos | Secreto de Auth.js | Uso |
| --- | --- | --- | --- |
| Development | Proyecto Neon local de desarrollo | Valor local en `.env.local` | Desarrollo en localhost. |
| Preview | Base o branch Neon independiente | Valor distinto de Preview | Pull requests y pruebas de Vercel. |
| Production | Proyecto Neon exclusivo de producción | Valor nuevo y estable de Production | Usuarios reales. |

`DATABASE_URL` y `AUTH_SECRET` son secretos de servidor. No se copian a Git, no se añaden como variables `NEXT_PUBLIC_*` y no se reutilizan entre entornos. Cambiar `AUTH_SECRET` invalida las sesiones JWT existentes.

## Preparar GitHub

1. Ejecutar `npm run check` y confirmar que lint, pruebas y build finalizan correctamente.
2. Inicializar Git con `main` como rama de producción y añadir `https://github.com/Julio92/nutriBro.git` como remoto `origin`.
3. Revisar el área de preparación antes del primer commit. Deben entrar el código, [package-lock.json](../package-lock.json), [drizzle](../drizzle), configuraciones y documentación.
4. Confirmar que [.gitignore](../.gitignore) deja fuera `.env.local`, `.next`, `.vercel`, `node_modules` y [data/nutrition-data.json](../data/nutrition-data.json). No forzar la inclusión de archivos ignorados.
5. Crear el commit inicial y enviar `main` al repositorio privado.

## Preparar Neon

1. Crear el proyecto Neon de producción en una región apropiada para los usuarios previstos.
2. Copiar su URL de conexión TLS estándar con `sslmode=require` a un entorno temporal del proceso de migración. No modificar ni publicar el archivo local de entorno para este fin.
3. Ejecutar `npm run db:migrate` antes del primer tráfico de Production y confirmar que se aplica el historial completo de [drizzle](../drizzle).
4. No ejecutar `npm run db:seed`, `npm run db:import-json` ni `npm run db:seed-default-recipes` en la base vacía de producción. Esos comandos están reservados a importaciones explícitas hacia una cuenta existente.
5. Repetir el patrón con otra base o branch Neon para Preview antes de habilitar pull requests.

## Configurar Vercel

1. En Vercel, importar el repositorio GitHub privado y seleccionar el preset Next.js.
2. Usar la raíz del repositorio, Node.js 22, `npm ci` como instalación y `npm run build` como comando de build.
3. Crear secretos de proyecto antes de desplegar:
   - **Production:** `DATABASE_URL` de Neon producción y `AUTH_SECRET` de producción.
   - **Preview:** `DATABASE_URL` de Neon Preview y un `AUTH_SECRET` distinto.
4. Mantener la región de funciones predeterminada inicialmente. Si se detecta latencia, seleccionar después una región Vercel cercana a Neon.
5. No usar Docker, Docker Compose ni `npm run start` como flujo de Vercel. Esos recursos siguen disponibles para ejecuciones locales o alojamiento alternativo.

El proyecto usa Auth.js con `trustHost`, por lo que no necesita `AUTH_URL` ni `NEXTAUTH_URL` para este despliegue. La falta de cualquiera de los dos secretos obligatorios produce un estado de configuración incompleta en lugar de activar el acceso.

## Límite de acceso en Firewall

Antes de anunciar Production, crear una sola regla de rate limiting en el Firewall de Vercel:

- **Condiciones:** método `POST` y ruta igual a `/sign-in`, `/sign-up` o `/api/auth/callback/credentials`; combinar las tres rutas con `OR`.
- **Clave:** dirección IP.
- **Algoritmo:** ventana fija.
- **Umbral:** 10 solicitudes en 10 minutos.
- **Respuesta al excederlo:** `429`.

Primero guardar la misma condición con acción de registro sobre un Preview y comprobar en los eventos del Firewall que alcanza las rutas esperadas. Cuando la condición sea correcta, cambiar la acción a rate limit, revisar los cambios y publicarlos. En Vercel Hobby esta regla compartida ocupa el único límite de rate limiting disponible por proyecto.

## Verificación de lanzamiento

Después del primer despliegue de `main`:

1. Abrir la URL de Production y confirmar que no se muestra el aviso de variables de entorno ausentes.
2. Crear una cuenta nueva, iniciar sesión y cerrar sesión.
3. Crear, editar y eliminar una receta.
4. Asignar varias recetas a la misma comida, recargar y confirmar que permanecen guardadas.
5. Confirmar que una cuenta nueva recibe la biblioteca inicial y los 35 slots del menú.
6. Realizar intentos controlados de acceso para confirmar la respuesta `429` una vez superado el umbral y revisar los eventos del Firewall.
7. Revisar los logs de Vercel y el consumo de Neon tras la primera sesión real.

## Operación posterior

- Configurar alertas de cuota y una estrategia de copias de seguridad/exportación en Neon.
- Añadir GitHub Actions para ejecutar `npm ci` y `npm run check` en cada pull request.
- Añadir una comprobación de readiness y pruebas de navegador para alta, acceso y asignación múltiple.
- Al crecer el uso, separar los límites de registro y acceso y añadir un límite persistente por cuenta o correo.