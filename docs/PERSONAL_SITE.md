# Zeming Wu's personal website

The personal site uses `_config.personal.yml` on top of the starter configuration.
The overlay sets the domain, root URL, bibliography, and the four public pages, and
excludes the starter's demonstration content. The original `/al-folio` defaults
remain in `_config.yml`.

## Build and preview

```bash
bundle install
npm ci
bash bin/build_cv.sh
bundle exec jekyll build --config _config.yml,_config.personal.yml
python3 bin/preview_site.py
```

Open <http://127.0.0.1:4000/>. The preview helper supports byte-range requests
for native video seeking. Ruby 3.3 or newer is recommended; the existing
development container has the required site dependencies. Run the CV build on a
machine with TeX Live, `latexmk`, and `biber` installed.

## GitHub Pages deployment

The site is published at <https://zamesng.github.io/> from the `main` branch by
`.github/workflows/deploy.yml`. The workflow builds with the personal configuration,
purges unused CSS, uploads the generated site as a Pages artifact, and deploys it
using the official GitHub Pages actions. Repository Settings → Pages must use
**GitHub Actions** as its source. The `gh-pages` branch is no longer the deployment
source. Pull requests build for validation without publishing.

Original media uploads are excluded from the generated site. Only prepared web
videos, referenced portraits/figures, and the final downloadable PDFs are served.
The unused PDF copy in `assets/img/` is also excluded; the CV download always uses
`assets/pdf/zeming-wu-cv.pdf`.

## Update content

- Biography: `_pages/about.md`.
- Research summaries: `_pages/research.md`.
- CityUHK-inspired presentation: `assets/css/personal.css`, loaded by all four pages.
- Thesis: the plain section after Selected Publications uses `assets/img/thesis_structure.png` as a compact preview linking to `/research/#master-thesis`. Research places the full structure figure, its original Chinese labels, and an English caption in a thesis card beneath the top-level Thesis heading. Both pages link the supplied `assets/pdf/master-thesis.pdf` unchanged. The original single-frame `assets/img/thesis-exp.gif` remains local and is excluded from the personal build.
- Publications: `assets/bibliography/publications.bib`, shared by Jekyll and the LaTeX CV.
- Profile links: `_data/socials.yml`.
- People links: `_data/coauthors.yml`, matched by both surname and given name on publication cards and the CV webpage. The CV uses this shared mapping for every author; keep canonical names in the bibliography unchanged.
- Editable CV: `cv/zeming-wu-cv.tex`. Run `bash bin/build_cv.sh` after edits and inspect the PDF.

The one-page CV PDF is checked into `assets/pdf/zeming-wu-cv.pdf`; the website build serves
that file directly. The CV webpage places a smaller Download (PDF) link on the same line as its title, with no description; its portrait is 160 × 200 px on desktop and stacks above the contact information at 120 × 150 px on mobile. The left-aligned name/affiliation/contact groups fill the same height as the portrait on desktop, with matching top, bottom, and vertical center. The PDF header uses additional space between these groups to match its 22 × 27.5 mm portrait; the mobile webpage keeps natural spacing in the stacked layout. Education entries have 20 px separation on the webpage and 6 pt paragraph spacing in the PDF. PDF section headings are 12 pt and publication-group headings 10 pt; citations retain their 9.5 pt font, with a compact 2–5 pt gap below each group heading. The template's RenderCV workflow is removed. Education, skills, languages, and reviewing service are mirrored in the LaTeX source and CV webpage; keep both consistent when those facts change. Both CV versions display the PhD range as Sep 2024–Jun 2028 (Expected), without a separate completion line, and list Mandarin (Native), Cantonese (Native), English. The homepage introduction remains independent of this expected date range.

## Research media and paper downloads

The four accepted-manuscript downloads, research figures, and publication thumbnails
are prepared by `python3 bin/prepare_paper_assets.py --media-only`. See
[Research assets](RESEARCH_ASSETS.md) for source versions, build requirements,
posting notices, image origins, and CV ranking sources. The build leaves the four
paper repositories unchanged and records full provenance in
[research-assets.json](research-assets.json).

The Research page uses deep-red title headers and directly visible, non-autoplaying video players with 0:02 title posters. Only RA-L retains a standalone paper figure; a top-level Thesis heading follows the six paper cards, with a matching thesis card containing the full structure figure. Resource links sit at each card’s bottom.

The Publications page exposes six BibTeX blocks and the existing theme clipboard controls. Citation exports omit internal grouping, ranking, and asset fields; `publications.bib` itself remains authoritative. Expanded code scrolls internally on narrow screens.

Unused generated images and the unused template CV output were removed after reference checks. Assets referenced by starter fixtures or documentation remain excluded from the personal build. See [asset-cleanup.json](asset-cleanup.json) for the deletion inventory and size reduction.
The homepage displays the nickname; publication author names and the PDF header retain Zeming Wu.
The transparent website icon is `assets/img/icon-transparent.png`, edited from the unchanged `icon.jpg` with the built-in imagegen tool. The edit removes the exterior background and ground shadow while preserving the character and flame.

The bibliography uses `keywords` for authorship groups and `sortkey` for the agreed
journal-first ordering within groups. Both the Publications page and CV consume
these fields. TII uses `author+an` equal-contribution metadata for PDF daggers; the CV page uses the same metadata in its page-level bibliography template, and the Publications page adds matching display-only daggers without changing canonical names. Venue descriptors use `additional_info` on the website and `addendum` in the PDF. Add a `pdf` or `preview` filename to an entry only when the asset is
ready. Use `assets/img/research/` for research figures and
`assets/img/publication_preview/` for thumbnails. Keep original research videos in `assets/video/`; the preparation script writes
public H.264 copies to `assets/video/web/`. The personal overlay excludes the
source uploads and example videos.

## Validate

```bash
npm run lint:prettier
npm run lint:style-contract
bundle exec al-folio upgrade audit --no-fail
bundle exec al-folio upgrade overrides audit
bundle exec jekyll build --config _config.yml,_config.personal.yml
```

The original visual fixtures target the starter demo. Personal-site visual QA
should target `/`, `/research/`, `/publications/`, and `/cv/` in both light and dark
modes, at desktop and mobile widths.

With the local preview running, execute the personal-site checks with:

```bash
npx playwright test --config test/visual/personal.config.js
```

Screenshots are saved to `output/screenshots/` for visual review. Run this suite
with one worker to avoid saturating a lightweight local preview server.

## Transparent icon provenance

The original `assets/img/icon.jpg` is unchanged. The built-in imagegen tool produced
`assets/img/icon-transparent.png` as a square PNG with alpha transparency. The final edit prompt was:

> Edit the supplied orange cartoon character icon. Remove the entire white/off-white background and the gray ground shadow, making all exterior background truly transparent. Preserve the exact orange character silhouette, pose, black outlines, facial expression, pale yellow belly, raised tail and flame, original colors and soft raster appearance. Do not redesign, sharpen into a different style, add text, or add any new elements. Keep the complete character and flame visible, centered on a square canvas with modest transparent padding. Output PNG with genuine alpha transparency.
