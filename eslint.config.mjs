// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import nextPlugin from "@next/eslint-plugin-next";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import tseslint from "typescript-eslint";

const eslintConfig = tseslint.config(
  {
    ignores: [".next/", "node_modules/", "playwright-report/", "test-results/"],
  },
  ...tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: [
            "eslint.config.mjs",
            "postcss.config.mjs",
            ".storybook/main.ts",
            ".storybook/preview.ts",
          ],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    plugins: {
      "@next/next": nextPlugin,
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports" },
      ],
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: { attributes: false } },
      ],
    },
  },
  // Disable type-checked rules for config files outside tsconfig — must be last
  {
    files: ["*.config.{ts,mjs}", "playwright.config.ts"],
    ...tseslint.configs.disableTypeChecked,
  },
);

export default eslintConfig;
