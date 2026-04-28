import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import vitest from "@vitest/eslint-plugin";

const importSortGroups = [
  ["^react$", "^next"],
  ["^@", "^\\w"],
  ["^@/features/"],
  ["^(@)(?!/features/)(/.*|$)"],
  ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
  ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
];

export default tseslint.config(
  {
    settings: {
      react: { version: "detect" },
      "import/resolver": {
        typescript: {
          project: [
            "./tsconfig.json",
            "./tsconfig.test.json"
          ],
        },
      },
    },
  },

  {
    ignores: [
      "**/node_modules/**",
      "dist/**",
      "build/**",
      "coverage/**",
      "playwright-report/**",
      "@mf-types/**",
      "**/*.d.ts",
      "src/lib/trpc-types.ts",
    ],
  },

  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  react.configs.flat["jsx-runtime"],

  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "simple-import-sort": simpleImportSort,
    },
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      ...reactHooks.configs.flat.recommended.rules,
      ...reactRefresh.configs.vite.rules,

      "no-console": "warn",
      "react/prop-types": "off",
      "react/display-name": "off",
      "react/react-in-jsx-scope": "off",

      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],

      "react-refresh/only-export-components": "warn",

      "simple-import-sort/imports": ["warn", { groups: importSortGroups }],
    },
  },

  {
    files: ["**/*.test.{ts,tsx}", "**/*.spec.{ts,tsx}"],
    plugins: {
      vitest,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...vitest.environments.env.globals,
      },
    },
    rules: {
      ...vitest.configs.recommended.rules,

      "vitest/max-nested-describe": ["error", { max: 3 }],

      "react/react-in-jsx-scope": "off",
    },
  }
);