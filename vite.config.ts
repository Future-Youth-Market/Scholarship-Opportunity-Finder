import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vitest/config";
import { scholarshipDataPlugin } from "./scripts/lib/data-plugin.ts";
export default defineConfig({
  plugins: [react(), tailwindcss(), scholarshipDataPlugin()],
  server: {
    host: "127.0.0.1",
    fs: {
      deny: [
        "**/.env*",
        "**/.git/**",
        "**/data/private/**",
        "**/data/incoming/**",
        "**/reports/**",
      ],
    },
  },
  test: { environment: "jsdom", setupFiles: ["./src/test/setup.ts"] },
});
