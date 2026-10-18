const { test, expect } = require("@playwright/test");
const fs = require("node:fs");
const path = require("node:path");

const productionOrigin = "https://zamesng.github.io";
const widgetUrl = "https://mapmyvisitors.com/globe.js?d=4Rcygij5OrVQKp3fQNl7WyaP5RijMv5RuyWIwMLe79M";

test.beforeEach(async ({ page }, testInfo) => {
  await page.addInitScript((theme) => localStorage.setItem("theme", theme), testInfo.project.use.colorScheme);
});

async function serveProductionLocally(page) {
  await page.route(`${productionOrigin}/**`, async (route) => {
    const url = new URL(route.request().url());
    let file = path.resolve(__dirname, "../../_site", `.${decodeURIComponent(url.pathname)}`);
    if (fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    await route.fulfill({ path: file });
  });
}

test("homepage globe loads once at the production origin and fits its section", async ({ page }, testInfo) => {
  await page.clock.install();
  await serveProductionLocally(page);
  const widgetRequests = [];
  await page.route("https://mapmyvisitors.com/**", async (route) => {
    widgetRequests.push(route.request().url());
    await route.fulfill({
      contentType: "application/javascript",
      body: `document.getElementById("mmvst_globe").insertAdjacentHTML("afterend", '<div class="mmvst_inner" data-testid="globe-stub" style="width:100%;aspect-ratio:1;border-radius:50%;background:var(--global-theme-color)"></div>');`,
    });
  });
  await page.goto(productionOrigin);
  const section = page.getByRole("region", { name: "Visitors", exact: true });
  await expect(section).toBeVisible();
  await expect(page.getByTestId("globe-stub")).toBeVisible();
  await expect(page.locator("#mmvst_globe")).toHaveCount(1);
  await expect(page.locator("#mmvst_globe")).toHaveAttribute("src", widgetUrl);
  expect(await page.locator("#mmvst_globe").evaluate((script) => script.async)).toBe(true);
  expect(widgetRequests).toEqual([widgetUrl]);
  expect(await section.evaluate((element) => element.previousElementSibling.classList.contains("thesis-section"))).toBe(true);
  const globe = await page.locator(".visitor-globe").boundingBox();
  const container = await section.boundingBox();
  expect(globe.width).toBe(240);
  expect(Math.abs(globe.x + globe.width / 2 - (container.x + container.width / 2))).toBeLessThan(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.clock.fastForward(30001);
  await expect(page.getByTestId("globe-stub")).toBeVisible();
  await section.screenshot({ path: `output/screenshots/${testInfo.project.name}-visitors-mocked.png` });
});

test("provider data failure removes unused globe space after the timeout", async ({ page }) => {
  await page.clock.install();
  await serveProductionLocally(page);
  await page.route("https://mapmyvisitors.com/**", (route) =>
    route.fulfill({
      contentType: "application/javascript",
      body: `document.getElementById("mmvst_globe").insertAdjacentHTML("afterend", '<div class="mmvst_inner" style="display:none"></div>');`,
    })
  );
  await page.goto(productionOrigin);
  await expect(page.locator(".visitor-globe")).toHaveCount(1);
  await page.clock.fastForward(30001);
  await expect(page.locator(".visitor-globe")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Visitor statistics by MapMyVisitors" })).toBeVisible();
});

test("unavailable provider leaves the homepage and attribution usable", async ({ page }) => {
  await serveProductionLocally(page);
  await page.route("https://mapmyvisitors.com/**", (route) => route.abort());
  await page.goto(productionOrigin);
  await expect(page.locator(".visitor-globe")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Zeming (Zames) Wu", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Visitor statistics by MapMyVisitors" })).toBeVisible();
});

test("local preview and secondary pages do not send tracking requests", async ({ page }) => {
  await serveProductionLocally(page);
  const widgetRequests = [];
  await page.route("https://mapmyvisitors.com/**", (route) => {
    widgetRequests.push(route.request().url());
    return route.abort();
  });
  for (const url of ["/", `${productionOrigin}/research/`, `${productionOrigin}/publications/`, `${productionOrigin}/cv/`]) {
    await page.goto(url);
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.locator("#mmvst_globe")).toHaveCount(0);
    if (url !== "/") await expect(page.locator(".visitor-section")).toHaveCount(0);
  }
  expect(widgetRequests).toEqual([]);
});
