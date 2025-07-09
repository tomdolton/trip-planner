import { dirname } from "path";
import { fileURLToPath } from "url";

import { FlatCompat } from "@eslint/eslintrc";

// Required to get correct __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create FlatCompat instance for using legacy configs
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// ESM-compatible config export
const eslintConfig = async () => {
  const importPlugin = await import("eslint-plugin-import");
  const prettierPlugin = await import("eslint-plugin-prettier");

  return [
    // Base Next.js and TS rules
    ...compat.extends("next/core-web-vitals", "next/typescript"),

    {
      plugins: {
        import: importPlugin.default,
        prettier: prettierPlugin.default,
      },
      rules: {
        // Import ordering
        "import/order": [
          "error",
          {
            groups: ["builtin", "external", "internal", ["parent", "sibling", "index"]],
            pathGroups: [
              { pattern: "@/components/**", group: "internal", position: "after" },
              { pattern: "@/lib/**", group: "internal", position: "after" },
              { pattern: "@/hooks/**", group: "internal", position: "after" },
            ],
            alphabetize: { order: "asc", caseInsensitive: true },
            "newlines-between": "always",
          },
        ],
        // Prettier formatting
        "prettier/prettier": "error",
      },
    },
  ];
};

export default eslintConfig();
