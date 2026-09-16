# Wireframes textuales y UX

## Principios de interfaz

- **Priorizar lo inmediato:** la vista del día actual aparece antes del tablero completo.
- **Acción cerca del contexto:** pulsar una receta de hoy abre su detalle; la reasignación múltiple se realiza desde el tablero semanal.
- **Reutilización visible:** la biblioteca indica en cuántas comidas se utiliza cada receta.
- **Edición sin fricción:** ingredientes dinámicos, formularios cortos y placeholders orientativos.
- **Espacio privado:** la aplicación pide acceso antes de mostrar recetas o menú, y permite cerrar sesión desde la cabecera.
- **Sin falsas promesas:** las funciones futuras se identifican como “Próximamente”; no se simulan cálculos nutricionales.

## 1. Dashboard — escritorio

```text
┌──────────────────────┬───────────────────────────────────────────────────────────┐
│  [hoja] nutribro     │ Planificador personal       [+ Nueva] [◐] [AM] [Salir] │
│                      ├───────────────────────────────────────────────────────────┤
│  ▣ Plan semanal      │ HOY · MARTES                                                │
│  ▤ Recetas           │ martes, 16 de septiembre                                   │
│  🛒 Lista ... (soon) │ [Desayuno · Avena… · Tostada… ↗]                           │
│                      │ [Media mañana · Yogur… ↗]                                  │
│                      │ [Comida · Pasta… ↗]                                        │
│                      │ [Merienda · Avena… ↗]                                      │
│                      │ [Cena · Ensalada… ↗]                                       │
│                      │                                                           │
│                      │ PLAN RECURRENTE                         [7 días · 5 comidas]│
│                      │ ┌Lun─┐┌Mar─┐┌Mié─┐┌Jue─┐┌Vie─┐┌Sáb─┐┌Dom─┐                 │
│                      │ │Des ││Des ││Des ││Des ││Des ││Des ││Des │                 │
│                      │ │Aven││Tost││Aven││Tost││Aven││Aven││Tost│                 │
│                      │ │ ...││ ...││ ...││ ...││ ...││ ...││ ...│                 │
│                      │ └────┘└────┘└────┘└────┘└────┘└────┘└────┘                 │
└──────────────────────┴───────────────────────────────────────────────────────────┘
```

- El tablero tiene desplazamiento horizontal suave cuando no cabe por completo.
- Una tarjeta no asignada se diferencia mediante borde discontinuo y el texto “Añadir recetas”.
- Las horas permanecen en el tablero semanal; las tarjetas del día priorizan el tipo de comida y sus recetas en orden.
- Las tarjetas del día no incluyen miniatura: los nombres de las recetas ganan presencia y cada uno abre su detalle.

## 2. Dashboard — móvil

```text
┌──────────────────────────────────┐
│ [hoja] nutribro         [+] [◐] [↪] │
├──────────────────────────────────┤
│ HOY · MARTES                      │
│ martes, 16 de septiembre          │
│ [Desayuno · Avena… · Tostada…]    │
│ [Media mañana · Yogur…]           │
│ [Comida · Pasta…]                 │
│ [Merienda · Avena…]               │
│ [Cena · Ensalada…]                │
│                                  │
│ PLAN RECURRENTE    [7 días · 5]   │
│  ← desliza horizontalmente →      │
│ ┌ Lunes ────────────────┐         │
│ │ Desayuno   Avena + Tostada │    │
│ │ Media      Yogur ...  │         │
│ │ Comida     Ensalada…  │         │
│ │ Merienda   Tostada…   │         │
│ │ Cena       Salmón…    │         │
│ └───────────────────────┘         │
├──────────────────────────────────┤
│       [▣ Plan]  [+] [▤ Recetas]   │
└──────────────────────────────────┘
```

La barra inferior mantiene disponibles las dos vistas principales y el alta de recetas con el pulgar. El contenido deja espacio para la barra segura del dispositivo.

## 3. Acceso

```text
┌──────────────────────────────────────┐
│            [hoja] nutribro           │
│                                      │
│ TU ESPACIO PERSONAL                   │
│ Organiza tu semana a tu ritmo.        │
│                                      │
│ Guarda tus recetas y tu menú          │
│ recurrente en un espacio privado.     │
│                                      │
│ Correo electrónico                    │
│ [_______________________________]    │
│ Contraseña                            │
│ [_______________________________]    │
│ Al menos 12 caracteres.               │
│                                      │
│ [            Acceder             ]   │
│ ¿Aún no tienes cuenta? Crear cuenta   │
└──────────────────────────────────────┘
```

El registro solicita nombre, correo, contraseña y repetición de contraseña. Ambos formularios validan en servidor; solo se persiste un hash Argon2id. Si faltan las variables de Neon o Auth.js, la pantalla comunica la configuración requerida sin dejar entrar a datos de demostración compartidos.

## 4. Biblioteca de recetas

```text
┌─────────────────────────────────────────────────────────┐
│ BIBLIOTECA                                    [+ Nueva] │
│ Tus recetas                                            │
│ Guarda tus básicos y reutilízalos en el menú.          │
│                                                         │
│ [⌕ Buscar por nombre o descripción________________]    │
│ [Todas] [Planificadas] [Sin asignar]                   │
│ 6 recetas                                              │
│                                                         │
│ ┌───────────┐ ┌───────────┐ ┌───────────┐             │
│ │ ilustrac. │ │ ilustrac. │ │ ilustrac. │             │
│ │ 5 ingred. │ │ 5 ingred. │ │ 3 ingred. │             │
│ │ Avena...  │ │ Tostada…  │ │ Yogur…    │             │
│ │ 5 comidas │ │ 4 comidas │ │ 7 comidas │             │
│ └───────────┘ └───────────┘ └───────────┘             │
└─────────────────────────────────────────────────────────┘
```

Las tarjetas se convierten en una lista de dos columnas visuales en pantallas estrechas. La búsqueda filtra al escribir y el contador anuncia el número de resultados.

## 5. Selector de asignación

```text
┌─────────────────────────────────────┐
│ ASIGNAR RECETAS                  [×]│
│ Lunes · Desayuno                    │
│ Horario habitual: 07:30             │
│                                     │
│ [⌕ Busca recetas_________________]  │
│                                     │
│ [×] Quitar todas las recetas        │
│ ┌────┐ Avena nocturna...         [✓]│
│ │ AN │ 5 ingredientes               │
│ └────┘                              │
│ ┌────┐ Tostada de hummus...      [✓]│
│ │ TH │ 5 ingredientes               │
│ └────┘                              │
│                  [Guardar 2 recetas]│
└─────────────────────────────────────┘
```

Abrir desde una comida no modifica datos. Las filas se pueden marcar o desmarcar y el cambio solo se persiste al guardar. Las recetas asignadas muestran una marca de selección; “Quitar todas las recetas” permite vaciar el hueco explícitamente.

## 6. Detalle de receta

```text
┌───────────────────────────────┐
│ Detalle de receta          [×]│
├───────────────────────────────┤
│       [ imagen / iniciales ]  │
│ RECETA GUARDADA               │
│ Salmón al horno con verduras  │
│ Descripción…                  │
│ [Editar] [Eliminar]           │
│                               │
│ ♨ Ingredientes             5  │
│ Lomo de salmón          150 g │
│ Calabacín            1/2 ud.  │
│ ...                           │
│                               │
│ ◷ Elaboración                 │
│ 1. Calienta el horno…         │
│                               │
│ ↻ En el menú                4 │
│ [Lunes · Cena] [Viernes · Cena]│
└───────────────────────────────┘
```

Se usa un cajón lateral en escritorio y pantalla completa en móvil. La eliminación pide confirmación nativa y avisa que las asignaciones se limpiarán.

## 7. Editor de receta

```text
┌────────────────────────────────────────────────────┐
│ NUEVA RECETA                                     [×]│
│ Añade una receta                                   │
│                                                    │
│ Nombre * [_______________________________________] │
│ Descripción [__________________________________]   │
│ Imagen HTTPS (opcional) [______________________]   │
│                                                    │
│ Ingredientes *                                     │
│ [Ingrediente_______________] [Cantidad____] [-]   │
│ [+ Añadir ingrediente]                             │
│                                                    │
│ Elaboración *                                      │
│ [1. Prepara los ingredientes...                ]  │
│                                                    │
│                              [Cancelar] [Guardar] │
└────────────────────────────────────────────────────┘
```

La validación cliente evita envíos incompletos y el servidor vuelve a validar toda la carga. Los mensajes de error se comunican mediante una región de alerta.

## Tema y accesibilidad

- El modo claro usa fondo blanco, una barra lateral `#f9f8f7` y acciones principales azules `#2783de`.
- Los tokens de color cubren modo claro y oscuro desde una única estructura de componentes.
- Todos los controles tienen texto o `aria-label`.
- Los focos son visibles y no dependen solo del color.
- La animación se reduce si el sistema solicita menos movimiento.
- Los controles, tarjetas y filas son objetivos táctiles de al menos 38–46 px cuando corresponde.
- La cabecera muestra iniciales de la cuenta y un control explícito de cierre de sesión; en móvil este último conserva una etiqueta accesible aunque solo muestre el icono.
