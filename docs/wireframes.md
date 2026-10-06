# Textual wireframes and UX

## Interface principles

- **Prioritize what is immediate:** the current day view appears before the full board.
- **Action close to context:** pressing a recipe for today opens its detail; multi-reassignment happens from the weekly board.
- **Visible reuse:** the library shows how many meals each recipe is used in.
- **Low-friction editing:** dynamic ingredients, short forms, and helpful placeholders.
- **Private space:** the app requests access before showing recipes or the menu and allows sign-out from the header.
- **No false promises:** future features are labeled as “Coming soon”; nutrition calculations are never simulated.

## 1. Dashboard — desktop

```text
┌──────────────────────┬───────────────────────────────────────────────────────────┐
│  [leaf] nutribro     │ Personal planner       [+ New] [◐] [AM] [Sign out] │
│                      ├───────────────────────────────────────────────────────────┤
│  ▣ Weekly plan      │ TODAY · TUESDAY                                            │
│  ▤ Recipes          │ tuesday, 16 September                                     │
│  🛒 List ... (soon) │ [Breakfast · Oatmeal… · Toast… ↗]                          │
│                      │ [Midday · Yogurt… ↗]                                     │
│                      │ [Lunch · Pasta… ↗]                                       │
│                      │ [Snack · Oatmeal… ↗]                                     │
│                      │ [Dinner · Salad… ↗]                                      │
│                      │                                                           │
│                      │ REPEATING PLAN                         [7 days · 5 meals] │
│                      │ ┌Mon─┐┌Tue─┐┌Wed─┐┌Thu─┐┌Fri─┐┌Sat─┐┌Sun─┐                 │
│                      │ │Des ││Des ││Des ││Des ││Des ││Des ││Des │                 │
│                      │ │Oat ││Toas││Oat ││Toas││Oat ││Oat ││Toas│                 │
│                      │ │ ...││ ...││ ...││ ...││ ...││ ...││ ...│                 │
│                      │ └────┘└────┘└────┘└────┘└────┘└────┘└────┘                 │
└──────────────────────┴───────────────────────────────────────────────────────────┘
```

- The board supports smooth horizontal scrolling when it does not fully fit.
- An unassigned card is differentiated by a dashed border and the text “Add recipes”.
- The time slots remain on the weekly board; the day cards prioritize meal type and recipe order.
- Day cards do not include thumbnails: recipe names are more prominent and each one opens the detail view.

## 2. Dashboard — mobile

```text
┌──────────────────────────────────┐
│ [leaf] nutribro        [+] [◐] [↩] │
├──────────────────────────────────┤
│ TODAY · TUESDAY                   │
│ tuesday, 16 September            │
│ [Breakfast · Oatmeal… · Toast…]   │
│ [Midday · Yogurt…]                │
│ [Lunch · Pasta…]                  │
│ [Snack · Oatmeal…]                │
│ [Dinner · Salad…]                 │
│                                  │
│ REPEATING PLAN   [7 days · 5]    │
│  ← swipe horizontally →          │
│ ┌ Monday ────────────────┐       │
│ │ Breakfast   Oat + Toast │      │
│ │ Midday     Yogurt ...  │       │
│ │ Lunch      Salad…      │       │
│ │ Snack      Toast…      │       │
│ │ Dinner     Salmon…     │       │
│ └───────────────────────┘         │
├──────────────────────────────────┤
│       [▣ Plan]  [+] [▤ Recipes]  │
└──────────────────────────────────┘
```

The bottom bar keeps the two main views and recipe creation available with the thumb. The content leaves room for the device safe area.

## 3. Sign-in

```text
┌──────────────────────────────────────┐
│            [leaf] nutribro           │
│                                      │
│ YOUR PERSONAL SPACE                  │
│ Organize your week at your own pace. │
│                                      │
│ Save your recipes and your recurring │
│ menu in a private space.             │
│                                      │
│ Email address                        │
│ [_______________________________]    │
│ Password                             │
│ [_______________________________]    │
│ At least 12 characters.              │
│                                      │
│ [            Sign in            ]    │
│ Don’t have an account? Create one    │
└──────────────────────────────────────┘
```

The sign-up form requests name, email, password, and password confirmation. Both forms validate on the server; only an Argon2id hash is persisted. If the Neon or Auth.js variables are missing, the screen communicates the required setup without allowing access to shared demo data.

## 4. Recipe library

```text
┌─────────────────────────────────────────────────────────┐
│ LIBRARY                                       [+ New] │
│ Your recipes                                            │
│ Save your basics and reuse them in the menu.            │
│                                                         │
│ [⌕ Search by name or description________________]    │
│ [All] [Planned] [Unassigned]                           │
│ 6 recipes                                               │
│                                                         │
│ ┌───────────┐ ┌───────────┐ ┌───────────┐             │
│ │ artwork   │ │ artwork   │ │ artwork   │             │
│ │ 5 ingred. │ │ 5 ingred. │ │ 3 ingred. │             │
│ │ Oatmeal...│ │ Toast…    │ │ Yogurt…   │             │
│ │ 5 meals   │ │ 4 meals   │ │ 7 meals   │             │
│ └───────────┘ └───────────┘ └───────────┘             │
└─────────────────────────────────────────────────────────┘
```

The cards become a two-column visual list on narrow screens. Search filters as the user types and the counter announces the number of results.

## 5. Assignment selector

```text
┌─────────────────────────────────────┐
│ ASSIGN RECIPES                 [×]    │
│ Monday · Breakfast                   │
│ Typical time: 07:30                 │
│                                     │
│ [⌕ Search recipes_________________]  │
│                                     │
│ [×] Remove all recipes              │
│ ┌────┐ Overnight oats...      [✓] │
│ │ OO │ 5 ingredients               │
│ └────┘                              │
│ ┌────┐ Hummus toast...        [✓] │
│ │ HT │ 5 ingredients               │
│ └────┘                              │
│                  [Save 2 recipes]    │
└─────────────────────────────────────┘
```

Opening this from a meal does not change data. Rows can be selected or deselected, and the change is only persisted when saved. Assigned recipes show a selection marker; “Remove all recipes” lets the user clear the slot explicitly.

## 6. Recipe detail

```text
Desktop — right-side Drawer
┌───────────────────────────────┐
│ Recipe detail            [×]  │
├───────────────────────────────┤
│       [ image / initials ]    │
│ RECIPE SAVED                  │
│ Baked salmon with vegetables   │
│ Description…                  │
│ [Edit] [Delete]               │
│                               │
│ ♨ Ingredients             5   │
│ Salmon fillet          150 g  │
│ Courgette              1/2 pc │
│ ...                           │
│                               │
│ ◷ Preparation                 │
│ 1. Preheat the oven…          │
│                               │
│ ↻ In the menu                4 │
│ [Monday · Dinner] [Friday · Dinner] │
└───────────────────────────────┘

Mobile — near-fullscreen bottom Drawer
┌──────────────────────────────────┐
│                                  │
│      (underlying app visible)     │
│   ┌──────────────────────────┐   │
│   │            ━             │   │
│   │ Recipe detail            │   │
│       [ image / initials ]       │
│ Baked salmon with vegetables      │
│ [Edit] [Delete]                  │
│ Ingredients …                    │
│ Preparation …                    │
│ In the menu …                    │
│   └──────────────────────────┘   │
└──────────────────────────────────┘
```

Recipe detail uses the shadcn Base UI Drawer composition at both sizes: it enters from the right on desktop and rises from the bottom on mobile. The desktop panel has a small inset on every viewport edge. The mobile panel has a swipe handle, rounded corners, and a small safe-area-aware inset rather than filling the screen; a darker blurred backdrop keeps the underlying app visible. The mobile panel omits the X control and can be dismissed by swiping down, pressing Escape, or tapping the backdrop. Desktop retains its close control and dismisses with a rightward swipe. Deletion asks for native confirmation and warns that assignments will be cleaned up.

## 7. Recipe editor

```text
Desktop — right-side Drawer; editing stacks above detail
┌────────────────────────────────────────────────────┐
│ NEW RECIPE                                      [×]│
│ Add a recipe                                      │
│                                                    │
│ Name * [_______________________________________] │
│ Description [__________________________________]   │
│ HTTPS image (optional) [______________________]   │
│                                                    │
│ Ingredients *                                      │
│ [Ingredient_______________] [Quantity____] [-]   │
│ [+ Add ingredient]                                  │
│                                                    │
│ Preparation *                                      │
│ [1. Prepare the ingredients...                ]  │
│                                                    │
│                              [Cancel] [Save]     │
└────────────────────────────────────────────────────┘

Mobile — near-fullscreen bottom Drawer
┌──────────────────────────────────┐
│   ┌──────────────────────────┐   │
│   │            ━             │   │
│   │ NEW RECIPE               │   │
│   │ Add a recipe             │   │
│   │ Name *                   │   │
│   │ Description              │   │
│   │ Ingredients *            │   │
│   │ Preparation *            │   │
│   │      [Cancel] [Save]     │   │
│   └──────────────────────────┘   │
└──────────────────────────────────┘
```

Create and edit use the same responsive Drawer as recipe detail. When editing from detail, the form opens as a second Drawer above the still-open detail; closing or swiping away the form reveals detail again. Create/edit enter from the right on desktop and rise from the bottom on mobile. The mobile surface has the same small inset and swipe handle, with no X control; Cancel, backdrop, Escape, or a downward swipe dismisses it. On desktop, retain the X control and rightward swipe. Unsaved form state is discarded when the form Drawer closes. Client-side validation prevents incomplete submissions and the server validates the full payload again. Error messages are communicated through an alert region.

## Theme and accessibility

- The light theme uses a white background, a sidebar `#f9f8f7`, and primary blue actions `#2783de`.
- Color tokens cover both light and dark mode from a single component structure.
- All controls have visible text or `aria-label`.
- Focus states are visible and do not rely only on color.
- Motion is reduced if the system requests less movement.
- Controls, cards, and rows are touch targets of at least 38–46 px when appropriate.
- The header shows account initials and an explicit sign-out control; on mobile, that control keeps an accessible label even if it only displays the icon.
