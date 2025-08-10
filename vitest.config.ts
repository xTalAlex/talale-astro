import { getViteConfig } from "astro/config";
// import { configDefaults } from 'vitest/config'
import { loadEnv } from "vite";

export default getViteConfig({
  test: {
    env: loadEnv("test", process.cwd(), ""),
  },
});
