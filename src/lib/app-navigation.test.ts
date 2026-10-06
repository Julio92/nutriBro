import { describe, expect, it } from "vitest";

import { getAppViewForTabIndex, getAppViewTabIndex } from "./app-navigation";

describe("app navigation views", () => {
  it.each([
    ["today", 0],
    ["plan", 1],
    ["recipes", 2],
  ] as const)("maps %s to tab index %i", (view, index) => {
    expect(getAppViewTabIndex(view)).toBe(index);
    expect(getAppViewForTabIndex(index)).toBe(view);
  });

  it("rejects unsupported tab indices", () => {
    expect(() => getAppViewForTabIndex(-1)).toThrow(RangeError);
    expect(() => getAppViewForTabIndex(3)).toThrow(RangeError);
  });
});
