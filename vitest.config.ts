/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config";
import { loadEnv } from "vite";

export default getViteConfig({
  test: {
    env: loadEnv("test", process.cwd(), ""),
  },
});
