const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: __dirname,
  testMatch: "personal_site.spec.js",
  outputDir: "../../output/playwright-personal",
  workers: 1,
  timeout: 45000,
  use: {
    baseURL: "http://127.0.0.1:4000",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop-light", use: { viewport: { width: 1440, height: 1000 }, colorScheme: "light" } },
    { name: "desktop-dark", use: { viewport: { width: 1440, height: 1000 }, colorScheme: "dark" } },
    { name: "mobile-light", use: { viewport: { width: 390, height: 844 }, isMobile: true, colorScheme: "light" } },
    { name: "mobile-dark", use: { viewport: { width: 390, height: 844 }, isMobile: true, colorScheme: "dark" } },
  ],
});
