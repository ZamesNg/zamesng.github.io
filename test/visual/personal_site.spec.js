const { test, expect } = require("@playwright/test");
const fs = require("node:fs");
const path = require("node:path");

test.beforeEach(async ({ page }, testInfo) => {
  await page.addInitScript((theme) => localStorage.setItem("theme", theme), testInfo.project.use.colorScheme);
});

for (const route of ["/", "/research/", "/publications/", "/cv/"]) {
  test(`${route} has personal content, working assets, and responsive layout`, async ({ page, request, context }, testInfo) => {
    page.on("pageerror", (error) => console.error(`${route}: ${error.message}`));
    const response = await page.goto(route, { waitUntil: "load" });
    expect(response.status()).toBe(200);
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("data-theme", testInfo.project.use.colorScheme);
    await expect(page.locator("body")).not.toContainText(/Albert Einstein|Write your biography|you@example/);
    if (route !== "/cv/") await expect(page.locator("body")).not.toContainText("June 2028");
    await expect(page.locator('link[rel="shortcut icon"]')).toHaveAttribute("href", /icon-transparent\.png/);
    const expectedAccent = testInfo.project.use.colorScheme === "dark" ? "rgb(224, 116, 51)" : "rgb(164, 0, 0)";
    expect(
      await page
        .locator("h1")
        .first()
        .evaluate((el) => {
          const probe = document.createElement("span");
          probe.style.color = "var(--global-theme-color)";
          el.append(probe);
          const color = getComputedStyle(probe).color;
          probe.remove();
          return color;
        })
    ).toBe(expectedAccent);
    const layout = await page.evaluate(() => {
      const overflow = [...document.querySelectorAll("body *")]
        .filter((element) => {
          let right = element.getBoundingClientRect().right;
          // Display-only portrait cropping intentionally extends the image inside a clipped frame.
          for (let parent = element.parentElement; parent && parent !== document.body; parent = parent.parentElement) {
            if (["hidden", "clip", "auto", "scroll"].includes(getComputedStyle(parent).overflowX)) {
              right = Math.min(right, parent.getBoundingClientRect().right);
            }
          }
          return right > innerWidth + 1;
        })
        .map((element) => `${element.tagName}.${element.className}`);
      return { overflow, scrollWidth: document.documentElement.scrollWidth, viewportWidth: innerWidth };
    });
    if (layout.overflow.length) console.error({ route, ...layout });
    expect(layout.overflow).toEqual([]);
    expect(layout.scrollWidth).toBeLessThanOrEqual(layout.viewportWidth + 1);

    const localAssets = await page
      .locator('link[rel="stylesheet"], script[src], img')
      .evaluateAll((elements) =>
        elements.map((element) => element.href || element.src).filter((url) => url && new URL(url).origin === location.origin)
      );
    for (const url of new Set(localAssets)) {
      expect((await request.get(url)).status(), url).toBe(200);
    }
    for (const img of await page.locator("img[loading=lazy]").all()) {
      await img.scrollIntoViewIfNeeded();
      await expect(img).toBeVisible();
      await expect.poll(() => img.evaluate((element) => element.complete && element.naturalWidth > 0)).toBe(true);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    expect(await page.locator("img").evaluateAll((images) => images.every((img) => img.complete && img.naturalWidth > 0))).toBe(true);

    const people = {
      "Lu Liu": "https://www.cityu.edu.hk/mne/people/academic-staff/mne-faculty/prof-liu-lu",
      "Zhuping Wang": "https://ivcm.tongji.edu.cn/info/1100/1178.htm",
      "Hao Zhang": "https://ivcm.tongji.edu.cn/info/1100/1273.htm",
      "Yahui Hao": "https://teacher.nwpu.edu.cn/2026010007.html",
      "Huaicheng Yan": "https://fai.shiep.edu.cn/1e/a5/c6541a269989/page.htm",
      "Yunkai Lv": "https://cise.ecust.edu.cn/2026/0127/c16347a187643/page.htm",
      "Kai Rao": "https://ivcm.tongji.edu.cn/info/1100/1783.htm",
    };
    const authors = page.locator(".author");
    const authorText = (await authors.allTextContents()).map((text) => text.replace(/\s+/g, " ")).join("\n");
    for (const [name, url] of Object.entries(people)) {
      const occurrences = authorText.match(new RegExp(`\\b${name}\\b`, "g"))?.length || 0;
      await expect(authors.locator(`a[href="${url}"]`), `${route}: ${name}`).toHaveCount(occurrences);
      for (const link of await authors.locator(`a[href="${url}"]`).all()) {
        expect((await link.textContent()).replace(/\s+/g, " ").replace(/†/g, "").trim()).toBe(name);
      }
    }

    if (route === "/") {
      await expect(page.locator(".publications .title")).toHaveCount(3);
      await expect(page.locator(".publications .title").first()).toContainText("Cooperative Geometry-Aware");
      await expect(page.locator(".profile img")).toBeVisible();
      await expect(page.locator("h1")).toHaveText("Zeming (Zames) Wu");
      if (!testInfo.project.name.startsWith("mobile")) {
        const alignment = await page.evaluate(() => ({
          heading: document.querySelector("h1").getBoundingClientRect().top,
          portrait: document.querySelector(".profile").getBoundingClientRect().top,
        }));
        expect(Math.abs(alignment.heading - alignment.portrait)).toBeLessThanOrEqual(2);
      }
      expect(await page.locator("aside").evaluate((element) => getComputedStyle(element).borderLeftColor)).toBe(
        await page.locator("aside i").evaluate((element) => getComputedStyle(element).color)
      );
      const profiles = page.getByRole("navigation", { name: "Contact and academic profiles" });
      await expect(profiles.getByRole("link")).toHaveCount(6);
      for (const link of await profiles.getByRole("link").all()) await expect(link).toHaveAttribute("title", /.+/);
      await expect(page.locator(".social .contact-icons")).toHaveCount(0);
      await expect(page.locator('a[href="https://orcid.org/0009-0004-8751-6938"]')).toHaveCount(1);
      await expect(page.getByRole("heading", { name: "Open to research collaborations" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Information for reviewers" })).toBeVisible();
      await expect(page.locator("#reviewers-heading").locator("..")).toHaveClass(/personal-block/);
      const thesis = page.locator(".thesis-section");
      await expect(thesis.getByRole("heading", { name: "Formation Navigation in Cluttered Environments" })).toBeVisible();
      await expect(thesis.getByRole("link", { name: "Prof. Zhuping Wang" })).toHaveAttribute("href", people["Zhuping Wang"]);
      expect(await thesis.evaluate((el) => el.previousElementSibling.classList.contains("home-publications"))).toBe(true);
      const preview = thesis.locator(".thesis-preview");
      await expect(preview).toHaveAttribute("href", "/research/#master-thesis");
      await expect(thesis.locator(".thesis-title a")).toHaveAttribute("href", "/research/#master-thesis");
      const previewImage = await preview.locator("img").boundingBox();
      expect(previewImage.width).toBeCloseTo(180, 0);
      expect(previewImage.width / previewImage.height).toBeCloseTo(2000 / 1482, 2);
      const thesisText = await thesis.locator(".thesis-preview-text").boundingBox();
      if (testInfo.project.name.startsWith("mobile")) {
        expect(thesisText.y).toBeGreaterThanOrEqual(previewImage.y + previewImage.height);
      } else {
        expect(thesisText.x).toBeGreaterThan(previewImage.x + previewImage.width);
      }
      const thesisPdf = await request.head("/assets/pdf/master-thesis.pdf");
      expect(thesisPdf.status()).toBe(200);
      expect(thesisPdf.headers()["content-type"]).toContain("application/pdf");
      await expect(thesis.getByRole("link", { name: "Download thesis in Chinese (PDF)" })).toHaveAttribute("download", "");
      const scholar = profiles.getByRole("link", { name: "Google Scholar", exact: true });
      await profiles.getByRole("link", { name: "Email", exact: true }).focus();
      await page.keyboard.press("Tab");
      await expect(scholar).toBeFocused();
      expect(
        await scholar.evaluate((link) => {
          const style = getComputedStyle(link);
          return style.boxShadow !== "none" || (style.outlineStyle !== "none" && parseFloat(style.outlineWidth) > 0);
        })
      ).toBe(true);
      await expect(page.locator(".profile nav")).toHaveCount(0);
      await expect(page.locator(".visitor-section .profile-links")).toHaveCount(1);
      await scholar.blur();
    }
    if (route === "/publications/") {
      await expect(page.locator(".publications .title")).toHaveCount(6);
      await expect(page.locator(".publications .author em")).toHaveCount(6);
      const expectedKeys = [
        "wu_cooperative_2026",
        "wu_quaternion-based_2024",
        "wu_collision-free_2025",
        "wu_gpu-accelerated_2024",
        "lv_local-bearing-based_2024",
        "rao_decentralized_2026",
      ];
      expect(await page.locator(".publications li .row > div[id]").evaluateAll((entries) => entries.map((entry) => entry.id))).toEqual(expectedKeys);
      await expect(page.locator(".publications h2")).toHaveText(["First-author publications", "Co-first-author publications", "Other publications"]);
      await expect(page.locator(".publications .preview")).toHaveCount(4);
      const papers = page.locator('.publications .links a[href$="-accepted.pdf"]');
      await expect(papers).toHaveCount(4);
      for (const href of await papers.evaluateAll((links) => links.map((link) => link.href))) {
        const pdf = await request.get(href);
        expect(pdf.status()).toBe(200);
        expect(pdf.headers()["content-type"]).toContain("application/pdf");
        expect((await pdf.body()).subarray(0, 5).toString()).toBe("%PDF-");
      }
      for (const key of expectedKeys.slice(4)) {
        await expect(page.locator(`#${key} .links a[href$=".pdf"]`)).toHaveCount(0);
      }
      const tii = page.locator("#lv_local-bearing-based_2024");
      await expect(tii.locator(".author sup")).toHaveCount(2);
      await expect(tii).not.toContainText(/Co-first authors:|equal contribution/);
      await expect(page.locator("#wu_cooperative_2026 .periodical strong")).toHaveText("(Top-Level Robotics Journal)");
      await expect(page.locator("#wu_gpu-accelerated_2024 .periodical strong")).toHaveText("(Flagship Robotics Conference)");
      await expect(page.locator("#wu_collision-free_2025 .periodical strong")).toHaveText("(Flagship Robotics Conference)");
      await context.grantPermissions(["clipboard-read", "clipboard-write"]);
      await expect(page.locator("a.bibtex.btn")).toHaveCount(6);
      for (const key of expectedKeys) {
        const entry = page.locator(`#${key}`);
        const trigger = entry.locator("a.bibtex.btn");
        await expect(trigger).toHaveAttribute("tabindex", "0");
        await trigger.focus();
        await page.keyboard.press("Enter");
        const block = entry.locator(".bibtex.hidden");
        await expect(block).toHaveClass(/open/);
        const citation = (await block.locator("code").innerText()).trim();
        expect(citation).toContain(key);
        expect(citation).toContain("doi =");
        expect(citation).not.toMatch(/\n\s*(keywords|sortkey|addendum|bibtex_show|preview|pdf|video|author\+an)\s*=/);
        await block.getByRole("button", { name: "Copy code to clipboard" }).click();
        await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(citation);
        await expect(block.locator(".copy i")).toHaveClass(/fa-clipboard-check/);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
        if (key === expectedKeys[0]) {
          const directory = path.resolve(__dirname, "../../output/screenshots");
          fs.mkdirSync(directory, { recursive: true });
          await page.evaluate(() => window.scrollTo(0, 0));
          await page.screenshot({
            path: path.join(directory, `${testInfo.project.name}-bibtex-expanded.png`),
            fullPage: true,
            animations: "disabled",
          });
        }
        await trigger.click();
        await expect(block).not.toHaveClass(/open/);
      }
      for (const annotation of await page.locator(".periodical > strong").all()) {
        expect(await annotation.evaluate((el) => parseFloat(getComputedStyle(el).marginInlineStart))).toBeGreaterThan(0);
      }
      const search = page.locator("#bibsearch");
      await search.fill("GPU");
      await expect(page.locator(".publications li:visible")).toHaveCount(1);
      await search.fill("");
    }
    if (route === "/research/") {
      const sections = page.locator(".research-paper");
      await expect(sections).toHaveCount(6);
      expect(await sections.locator("h2").evaluateAll((headings) => headings.map((heading) => heading.id))).toEqual([
        "tro-2026",
        "ral-2024",
        "iros-2025",
        "icra-2024",
        "tii-2024",
        "tcyb-2026",
      ]);
      await expect(sections.locator("figure")).toHaveCount(1);
      await expect(sections.locator("figcaption")).toContainText(["Numerical illustration"]);
      await expect(page.getByRole("link", { name: "View full-size figure" })).toHaveCount(0);
      for (const section of await sections.all()) {
        const header = section.locator("h2");
        expect(await header.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe("rgb(164, 0, 0)");
        expect(await header.evaluate((el) => getComputedStyle(el).color)).toBe("rgb(255, 255, 255)");
        expect(await section.evaluate((el) => el.lastElementChild.classList.contains("research-links"))).toBe(true);
      }
      const thesis = page.locator(".research-thesis");
      await expect(thesis.locator("#master-thesis")).toHaveText("Formation Navigation in Cluttered Environments");
      await expect(page.locator("h1")).toHaveText(["Research", "Thesis"]);
      const headingSizes = await page.locator("h1").evaluateAll((headings) => headings.map((heading) => getComputedStyle(heading).fontSize));
      expect(headingSizes[0]).toBe(headingSizes[1]);
      expect(await thesis.evaluate((el) => el.previousElementSibling.previousElementSibling.classList.contains("research-paper"))).toBe(true);
      expect(await thesis.locator("h2").evaluate((el) => getComputedStyle(el).backgroundColor)).toBe("rgb(164, 0, 0)");
      expect(await thesis.locator("h2").evaluate((el) => getComputedStyle(el).color)).toBe("rgb(255, 255, 255)");
      await expect(thesis).not.toHaveClass(/research-paper/);
      await expect(thesis.getByRole("link", { name: "Prof. Zhuping Wang" })).toHaveAttribute("href", people["Zhuping Wang"]);
      const structure = thesis.locator("figure img");
      const structureSize = await structure.boundingBox();
      expect(structureSize.width / structureSize.height).toBeCloseTo(2000 / 1482, 2);
      const thesisContentWidth = await thesis.evaluate(
        (el) => el.clientWidth - parseFloat(getComputedStyle(el).paddingLeft) - parseFloat(getComputedStyle(el).paddingRight)
      );
      expect(structureSize.width).toBeCloseTo(thesisContentWidth, 0);
      await expect(thesis.locator("figcaption")).toContainText("original Chinese labels");
      await expect(thesis.locator(":scope > :last-child a")).toHaveText("Download thesis in Chinese (PDF)");
      expect((await request.head("/assets/img/thesis-exp.gif")).status()).toBe(404);
      await expect(page.getByRole("heading", { name: "Research overview" })).toBeVisible();
      await expect(page.locator("#tii-2024 + p + p")).not.toContainText(/co-first|contributed equally/);
      await expect(page.locator("details.research-video")).toHaveCount(0);
      const players = page.locator(".research-video video");
      await expect(players).toHaveCount(3);
      for (const player of await players.all()) {
        await expect(player).toBeVisible();
        await expect(player).toHaveAttribute("preload", "none");
        expect(
          await player.evaluate((video) => video.controls && video.playsInline && !video.autoplay && !video.loop && video.currentTime === 0)
        ).toBe(true);
        const source = await player.locator("source").getAttribute("src");
        const file = await request.head(source);
        expect(file.status()).toBe(200);
        expect(file.headers()["content-type"]).toContain("video/mp4");
        expect((await request.head(await player.getAttribute("poster"))).status()).toBe(200);
        await player.evaluate(async (video) => {
          video.muted = true;
          await video.play();
        });
        await expect.poll(() => player.evaluate((video) => video.currentTime)).toBeGreaterThan(0.15);
        expect(await player.evaluate((video) => video.videoWidth > 0 && video.readyState >= 2)).toBe(true);
        await player.evaluate((video) => {
          video.pause();
          video.currentTime = video.duration * 0.6;
        });
        await expect
          .poll(() => player.evaluate((video) => !video.seeking && video.readyState >= 2 && Math.abs(video.currentTime - video.duration * 0.6) < 0.5))
          .toBe(true);
        expect(await page.evaluate(() => document.fullscreenEnabled)).toBe(true);
        await player.evaluate((video) => video.requestFullscreen());
        await expect.poll(() => page.evaluate(() => Boolean(document.fullscreenElement))).toBe(true);
        await page.evaluate(() => document.exitFullscreen());
        await player.evaluate((video) => video.load());
        expect(await player.evaluate((video) => video.currentTime)).toBe(0);
      }
      await page.evaluate(() => window.scrollTo(0, 0));
    }
    if (route === "/cv/") {
      await expect(page.locator(".web-cv > section > h2")).toHaveText([
        "Education",
        "Publications",
        "Research Interests",
        "Technical Skills",
        "Languages",
        "Reviewing Service",
      ]);
      await expect(page.locator(".web-cv .publications .title")).toHaveCount(6);
      await expect(page.locator(".web-cv .author em")).toHaveCount(6);
      await expect(page.locator("#lv_local-bearing-based_2024 .author sup")).toHaveCount(2);
      await expect(page.locator(".web-cv .preview:visible")).toHaveCount(0);
      await expect(page.locator(".cv-date").first()).toHaveText("Sep 2024–Jun 2028 (Expected)");
      await expect(page.locator(".web-cv")).not.toContainText("Expected completion:");
      await expect(page.locator("#wu_quaternion-based_2024")).toContainText("vol. 9, no. 6, pp. 5783–5790");
      await expect(page.locator("#wu_gpu-accelerated_2024")).toContainText("Yokohama, Japan: IEEE, pp. 7561–7567");
      await expect(page.locator("#rao_decentralized_2026")).toContainText("vol. 56, no. 8, pp. 4391–4402");
      const downloadLink = page.locator("h1 + a.cv-download");
      await expect(downloadLink).toHaveText("Download (PDF)");
      await expect(downloadLink).toHaveAttribute("download", "");
      await expect(page.getByRole("link", { name: "Download (PDF)", exact: true })).toHaveCount(1);
      await expect(page.locator(".post-description")).toHaveCount(0);
      await expect(page.locator("body")).not.toContainText("One-page academic CV");
      const title = await page.locator("h1").boundingBox();
      const linkBox = await downloadLink.boundingBox();
      expect(linkBox.x - (title.x + title.width)).toBeCloseTo(12, 0);
      expect(linkBox.y).toBeGreaterThanOrEqual(title.y);
      expect(linkBox.y + linkBox.height).toBeLessThanOrEqual(title.y + title.height);
      expect(await downloadLink.evaluate((el) => getComputedStyle(el).fontSize)).toBe("16px");
      await expect(page.locator("#cv-languages + p")).toHaveText("Mandarin (Native), Cantonese (Native), English.");
      await expect(page.locator("#cv-reviewing + p")).toHaveText("Journals: T-RO, RA-L, T-AC, T-IE, T-II. Conferences: ICRA, IROS, CDC.");
      const entries = await page.locator(".cv-entry").all();
      for (let i = 1; i < entries.length; i++) {
        const previous = await entries[i - 1].boundingBox();
        const current = await entries[i].boundingBox();
        expect(current.y - (previous.y + previous.height)).toBeCloseTo(20, 0);
      }
      const portrait = await page.locator(".cv-header img").boundingBox();
      const contact = await page.locator(".cv-header > div").boundingBox();
      const mobile = testInfo.project.name.startsWith("mobile");
      expect(portrait.width).toBe(mobile ? 120 : 160);
      expect(portrait.height).toBe(mobile ? 150 : 200);
      if (mobile) expect(contact.y).toBeGreaterThanOrEqual(portrait.y + portrait.height);
      else {
        expect(portrait.x).toBeGreaterThanOrEqual(contact.x + contact.width);
        const name = await page.locator(".cv-header h2").boundingBox();
        expect(Math.abs(name.y - portrait.y)).toBeLessThanOrEqual(1);
        expect(contact.height).toBe(portrait.height);
        expect(Math.abs(contact.y + contact.height / 2 - (portrait.y + portrait.height / 2))).toBeLessThanOrEqual(1);
        const lastTextGroup = await page.locator(".cv-header > div > :last-child").boundingBox();
        expect(Math.abs(lastTextGroup.y + lastTextGroup.height - (portrait.y + portrait.height))).toBeLessThanOrEqual(1);
      }
      const download = await request.get("/assets/pdf/zeming-wu-cv.pdf");
      expect(download.status()).toBe(200);
      expect(download.headers()["content-type"]).toContain("application/pdf");
    }
    if (testInfo.project.name.startsWith("mobile")) {
      const toggle = page.locator(".navbar-toggler");
      await toggle.click();
      await expect(page.locator(".navbar-collapse")).toHaveClass(/show/);
      await expect(page.locator('nav a[href="/research/"]')).toBeVisible();
      await toggle.click();
    }

    await page.evaluate(() => window.scrollTo(0, 0));
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    const directory = path.resolve(__dirname, "../../output/screenshots");
    fs.mkdirSync(directory, { recursive: true });
    const slug = route === "/" ? "home" : route.replaceAll("/", "");
    await page.screenshot({ path: path.join(directory, `${testInfo.project.name}-${slug}.png`), fullPage: true, animations: "disabled" });
  });
}
