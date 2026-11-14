import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    // Run against Vercel with: CYPRESS_BASE_URL=https://<app>.vercel.app npm run cy:run
    baseUrl: process.env.CYPRESS_BASE_URL || "http://localhost:3000",
    supportFile: false,
    video: false,
  },
});
