import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: [
      "src/components/ui/combobox.tsx",
      "src/components/ui/sidebar-core.tsx",
      "src/components/ui/sidebar-menu.tsx",
      "src/hooks/use-fluid-hover.ts",
      "src/hooks/use-merge-split.tsx",
    ],
    // Preserve the registry's documented ref-driven animation behavior; these
    // copied Fluid Functionalism sources are composed by the app, not edited.
    rules: {
      "react-hooks/refs": "off",
      "react-hooks/static-components": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/immutability": "off",
      "react-hooks/exhaustive-deps": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
