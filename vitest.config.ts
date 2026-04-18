import { defineConfig } from "vitest/config";

import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    include: ["tests/**/*.test.ts", "src/**/*.test.ts", "src/**/*.test.tsx"],
    environment: "jsdom",
  },
});
