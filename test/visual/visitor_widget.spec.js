const { test, expect } = require("@playwright/test");
const fs = require("node:fs");
const path = require("node:path");

const productionOrigin = "https://zamesng.github.io";
const widgetId = "cGqGU6zkTTfrtKO8TyYTcdzV9cK16rlZUBjIc2K392Y";

test.beforeEach(async ({ page }, testInfo) => {
  await page.addInitScript((theme) => {
    if (window.top === window) localStorage.setItem("theme", theme);
  }, testInfo.project.use.colorScheme);
});

async function serveProductionLocally(page) {
  await page.route(`${productionOrigin}/**`, async (route) => {
    const url = new URL(route.request().url());
    let file = path.resolve(__dirname, "../../_site", `.${decodeURIComponent(url.pathname)}`);
    if (fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    await route.fulfill({ path: file });
  });
}

test("footer aligns contacts and map and changes theme without recounting", async ({ page }, testInfo) => {
  await page.clock.install();
  await serveProductionLocally(page);
  const widgetRequests = [];
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("https://mapmyvisitors.com/**", async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname !== "/map.js")
      return route.fulfill({ contentType: "image/gif", body: Buffer.from("R0lGODlhAQABAIAAAP///////yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64") });
    widgetRequests.push(url);
    const p = url.searchParams;
    const image = `https://mapmyvisitors.com/generated_content/backs/bg-w_420-co_${p.get("co")}-cl_${p.get("cl")}.png`;
    const markup = `<div id="mapmyvisitors-widget" data-testid="map-stub"><div class="mapmyvisitors-map-container" style="padding-top:32px"><div class="mapmyvisitors-visitors">Preview</div><div class="mapmyvisitors-map" style='background-image:url("${image}")'></div></div></div>`;
    const payload = `document.getElementById("mapmyvisitors").insertAdjacentHTML("afterend", ${JSON.stringify(markup)});`;
    await route.fulfill({ contentType: "application/javascript", body: `eval(${JSON.stringify(payload)});` });
  });
  await page.goto(productionOrigin);
  const section = page.locator(".home-footer-contact");
  const frame = page.locator("#visitor-map-frame");
  const widget = page.frameLocator("#visitor-map-frame");
  const profiles = page.getByRole("navigation", { name: "Contact and academic profiles" });
  await expect(frame).toHaveAttribute("data-ready", "true");
  await expect(widget.getByTestId("map-stub")).toBeVisible();
  await expect(frame).toHaveAttribute("sandbox", "allow-scripts allow-top-navigation-by-user-activation");
  expect(await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute("content")).not.toContain("unsafe-eval");
  await expect(page.locator(".profile nav")).toHaveCount(0);
  await expect(profiles.getByRole("link")).toHaveCount(6);
  await expect(section.getByRole("heading")).toHaveCount(0);
  await expect(section.getByText("Visitor statistics by MapMyVisitors")).toHaveCount(0);
  expect(await profiles.getByRole("link").evaluateAll((links) => links.map((link) => link.getAttribute("aria-label")))).toEqual([
    "Email",
    "Google Scholar",
    "GitHub",
    "LinkedIn",
    "ORCID",
    "Download CV",
  ]);
  const boxes = await profiles.getByRole("link").evaluateAll((links) =>
    links.map((link) => {
      const r = link.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height };
    })
  );
  for (const box of boxes) {
    expect(box.width).toBeGreaterThanOrEqual(64);
    expect(box.height).toBeGreaterThanOrEqual(64);
  }
  expect(boxes[0].y).toBeCloseTo(boxes[2].y, 0);
  expect(boxes[3].y).toBeCloseTo(boxes[5].y, 0);
  expect(boxes[3].y).toBeGreaterThan(boxes[0].y);
  const map = await page.locator(".visitor-map").boundingBox();
  const contacts = await profiles.boundingBox();
  if (testInfo.project.name.startsWith("mobile")) expect(contacts.y).toBeGreaterThan(map.y + map.height);
  else {
    expect(contacts.x).toBeGreaterThan(map.x + map.width);
    expect(contacts.y).toBeCloseTo(map.y, 0);
    expect(contacts.height).toBeCloseTo(map.height, 0);
  }
  const initialTheme = testInfo.project.use.colorScheme;
  for (const theme of [initialTheme, initialTheme === "light" ? "dark" : "light", initialTheme]) {
    await page.evaluate((value) => document.documentElement.setAttribute("data-theme", value), theme);
    await expect(widget.locator("html")).toHaveAttribute("data-theme", theme);
    const background = theme === "dark" ? "1c1c1d" : "ffffff";
    const land = "e07433";
    await expect(widget.locator(".mapmyvisitors-map")).toHaveCSS("background-image", new RegExp(`co_${background}-cl_${land}`));
    expect(await widget.locator("#map-container").evaluate((el) => getComputedStyle(el).getPropertyValue("--visitor-background").trim())).toBe(
      "#" + background
    );
  }
  expect(widgetRequests).toHaveLength(1);
  const params = widgetRequests[0].searchParams;
  expect(params.get("d")).toBe(widgetId);
  expect(params.get("cmn")).toBe("00e5ff");
  expect(params.get("cmo")).toBe("ffe066");
  await expect(widget.locator("#mapmyvisitors")).toHaveCount(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.clock.fastForward(30001);
  await expect(widget.getByTestId("map-stub")).toBeVisible();
  expect(errors).toEqual([]);
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
  await expect(page.frameLocator("#visitor-map-frame").locator(".mapmyvisitors-loading")).toBeVisible();
  await page.evaluate(() => window.postMessage({ type: "visitor-map-status", state: "ready", height: 1 }, location.origin));
  await page.clock.fastForward(30001);
  await expect(page.locator(".visitor-map")).toHaveCount(0);
  await expect(page.getByRole("navigation", { name: "Contact and academic profiles" }).getByRole("link")).toHaveCount(6);
});

test("unavailable provider leaves the homepage and contacts usable", async ({ page }) => {
  await serveProductionLocally(page);
  await page.route("https://mapmyvisitors.com/**", (route) => route.abort());
  await page.goto(productionOrigin);
  await expect(page.locator(".visitor-map")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Zeming (Zames) Wu", exact: true })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Contact and academic profiles" }).getByRole("link")).toHaveCount(6);
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
    await expect(page.locator("#visitor-map-frame")).toHaveCount(0);
    if (url !== "/") await expect(page.locator(".visitor-section")).toHaveCount(0);
  }
  await page.goto(`${productionOrigin}/assets/visitor-map.html`);
  await expect(page.locator("#mapmyvisitors")).toHaveCount(0);
  expect(widgetRequests).toEqual([]);
});
