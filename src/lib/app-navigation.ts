export const APP_VIEWS = ["today", "plan", "recipes"] as const;

export type AppView = (typeof APP_VIEWS)[number];

const APP_VIEW_TAB_INDEX: Record<AppView, number> = {
  today: 0,
  plan: 1,
  recipes: 2,
};

export function getAppViewTabIndex(view: AppView): number {
  return APP_VIEW_TAB_INDEX[view];
}

export function getAppViewForTabIndex(index: number): AppView {
  if (!Number.isInteger(index) || index < 0 || index >= APP_VIEWS.length) {
    throw new RangeError(`Unsupported app view tab index: ${index}`);
  }

  return APP_VIEWS[index];
}
