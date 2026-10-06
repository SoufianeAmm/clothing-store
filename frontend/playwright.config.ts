import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:5173",
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      command: "npm run dev",
      url: "http://localhost:5173",
      reuseExistingServer: true,
      timeout: 30_000,
    },
    {
      command: "mvnw.cmd spring-boot:run",
      cwd: "../backend",
      url: "http://localhost:8080/api/products",
      reuseExistingServer: true,
      timeout: 120_000,
    },
  ],
});
