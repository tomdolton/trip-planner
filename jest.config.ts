// jest.config.ts
import nextJest from "next/jest.js";
import dotenv from "dotenv";
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
};

export default createJestConfig(customJestConfig);
