const { test, expect } = require("@playwright/test");
const fs = require("node:fs");
const path = require("node:path");

const productionOrigin = "https://zamesng.github.io";
const widgetUrl = "https://mapmyvisitors.com/map.js?d=cGqGU6zkTTfrtKO8TyYTcdzV9cK16rlZUBjIc2K392Y&cl=ffffff&w=a";

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

test("homepage map loads once at the production origin and fits its section", async ({ page }, testInfo) => {
  await page.clock.install();
  await serveProductionLocally(page);
  const widgetRequests = [];
  await page.route("https://mapmyvisitors.com/**", async (route) => {
    widgetRequests.push(route.request().url());
    await route.fulfill({
      contentType: "application/javascript",
      body: `document.getElementById("mapmyvisitors").insertAdjacentHTML("afterend", '<div id="mapmyvisitors-widget" data-testid="map-stub" style="width:100%;aspect-ratio:2.04;border-radius:0.25rem;background:var(--global-theme-color)"></div>');`,
    });
  });
  await page.goto(productionOrigin);
  const section = page.getByRole("region", { name: "Visitors", exact: true });
  await expect(section).toBeVisible();
  await expect(page.getByTestId("map-stub")).toBeVisible();
  await expect(page.locator("#mapmyvisitors")).toHaveCount(1);
  await expect(page.locator("#mapmyvisitors")).toHaveAttribute("src", widgetUrl);
  expect(await page.locator("#mapmyvisitors").evaluate((script) => script.async)).toBe(true);
  expect(widgetRequests).toEqual([widgetUrl]);
  expect(await section.evaluate((element) => element.previousElementSibling.classList.contains("thesis-section"))).toBe(true);
  const map = await page.locator(".visitor-map").boundingBox();
  const container = await section.boundingBox();
  expect(map.width).toBe(240);
  expect(Math.abs(map.x + map.width / 2 - (container.x + container.width / 2))).toBeLessThan(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.clock.fastForward(30001);
  await expect(page.getByTestId("map-stub")).toBeVisible();
  await section.screenshot({ path: `output/screenshots/${testInfo.project.name}-visitors-mocked.png` });
});

test("provider data failure removes unused map space after the timeout", async ({ page }) => {
  await page.clock.install();
  await serveProductionLocally(page);
  await page.route("https://mapmyvisitors.com/**", (route) =>
    route.fulfill({
      contentType: "application/javascript",
      body: `document.getElementById("mapmyvisitors").insertAdjacentHTML("afterend", '<div id="mapmyvisitors-widget"><span class="mapmyvisitors-loading">Loading data...</span></div>');`,
    })
  );
  await page.goto(productionOrigin);
  await expect(page.locator(".visitor-map")).toHaveCount(1);
  await page.clock.fastForward(30001);
  await expect(page.locator(".visitor-map")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Visitor statistics by MapMyVisitors" })).toBeVisible();
});

test("unavailable provider leaves the homepage and attribution usable", async ({ page }) => {
  await serveProductionLocally(page);
  await page.route("https://mapmyvisitors.com/**", (route) => route.abort());
  await page.goto(productionOrigin);
  await expect(page.locator(".visitor-map")).toHaveCount(0);
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
    await expect(page.locator("#mapmyvisitors")).toHaveCount(0);
    if (url !== "/") await expect(page.locator(".visitor-section")).toHaveCount(0);
  }
  expect(widgetRequests).toEqual([]);
});
