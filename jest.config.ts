// jest.config.ts
import dotenv from "dotenv";
import nextJest from "next/jest.js";

dotenv.config({ path: ".env.test" });

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jsdom",
  moduleNameMapper: {
    // Support for @/ paths (same as tsconfig)
    "^@/(.*)$": "<rootDir>/$1",
    "^@supabase/supabase-js$": "<rootDir>/__mocks__/supabase.js",
  },
  moduleDirectories: ["node_modules", "<rootDir>/"],
  // Exclude Playwright test files - they should only run with Playwright
  testMatch: ["**/__tests__/**/*.(ts|tsx|js)", "**/*.(test|spec).(ts|tsx|js)"],
  testPathIgnorePatterns: [
    "<rootDir>/.next/",
    "<rootDir>/node_modules/",
    "<rootDir>/tests/", // Exclude the tests directory (Playwright tests)
  ],
};

export default createJestConfig(customJestConfig);
