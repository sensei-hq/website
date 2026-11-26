import { defineConfig, devices } from '@playwright/test';

// Its own port, strict: 5173 is Vite's default and usually some other app's dev
// server, and `reuseExistingServer` would run these tests against that app.
const PORT = Number(process.env.PORT ?? 4180);

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: `bun run dev --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
