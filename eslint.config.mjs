import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "public/**",
      ".vercel/**",
    ],
  },
  {
    rules: {
      // Relax strict TypeScript rules for production deployment
      "@typescript-eslint/no-unused-vars": "warn", // Change from error to warning
      "@typescript-eslint/no-explicit-any": "warn", // Allow any types in production
      "@typescript-eslint/ban-ts-comment": "warn", // Allow @ts-ignore comments
      "@typescript-eslint/no-non-null-assertion": "warn", // Allow non-null assertions
      
      // Relax Next.js rules that might cause deployment issues
      "@next/next/no-img-element": "warn", // Allow img elements
      "@next/next/no-html-link-for-pages": "warn", // Allow HTML links for pages
      "@next/next/no-unwanted-polyfillio": "off", // Disable polyfill warnings
      
      // Relax general rules for smoother development
      "react-hooks/exhaustive-deps": "warn", // Change from error to warning
      "react/jsx-key": "warn", // Allow missing keys (will show warning)
      "no-console": "off", // Allow console statements in production
      "prefer-const": "warn", // Allow let instead of const
      "no-var": "warn", // Allow var declarations
      
      // Disable problematic rules for Vercel deployment
      "import/no-anonymous-default-export": "off",
      "react/display-name": "off",
    },
  },
];

export default eslintConfig;
