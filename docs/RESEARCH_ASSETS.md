# Research assets and publication downloads

## Prepare assets

Run `python3 bin/prepare_paper_assets.py --media-only` to update research figures,
publication thumbnails, video posters, and web videos while preserving the four
existing accepted-manuscript PDFs. Run without `--media-only` only when rebuilding
the manuscript downloads as well. The default paper source root is `~/Papers`;
override it with `--papers-root /path/to/Papers`.

Requirements: Python 3 (standard library only), TeX Live (`latexmk`, `biber`,
`epstopdf`), Poppler, ImageMagick, and FFmpeg/FFprobe. Builds use ignored
`tmp/papers/` staging directories. Git archives are read-only inputs, with no
checkout or source edits. The script compares HEAD, Git status, and SHA-256 hashes
of tracked files before and after preparation, including existing modifications.
Full provenance and output hashes are in [research-assets.json](research-assets.json).

To update only the three 0:02 posters, run:

```bash
python3 bin/prepare_paper_assets.py --posters-only
```

This mode reads existing web videos, verifies their hashes, and updates poster
commands/timestamps/hashes without accessing paper repositories or re-encoding.
The source repositories are needed only for the other preparation modes.

## Author manuscripts

| Paper     | Source commit          | TeX entry point               | Download                 |
| --------- | ---------------------- | ----------------------------- | ------------------------ |
| T-RO 2026 | `bb3d1c3`              | `final/source/manuscript.tex` | `tro-2026-accepted.pdf`  |
| RA-L 2024 | `8872254`              | `RAL_version/main.tex`        | `ral-2024-accepted.pdf`  |
| IROS 2025 | `b4064a0` (`IROS2025`) | `paper/main.tex`              | `iros-2025-accepted.pdf` |
| ICRA 2024 | `3843ccd`              | `note/main.tex`               | `icra-2024-accepted.pdf` |

The author confirmed that the supplied RA-L source is the accepted manuscript.
Its original title spelling and content are retained, apart from the authorized
correction of one empty figure reference on manuscript page 6 to
`\ref{fig:quaternion_interpolation}` (Fig. 3). Only the staged copy is corrected;
the original repository remains unchanged. The IROS build uses the archived
conference source rather than the current journal revision. TII and TCYB have
short descriptions and DOI links only.

The manuscript build runs `latexmk -gg -pdf -interaction=nonstopmode
-halt-on-error -shell-escape ENTRY.tex`. A separate LaTeX notice document takes
citations from `publications.bib`. Each notice is prepended with `pdfunite`,
identifying the accepted version, published citation, DOI, and applicable IEEE
copyright statement. See the [IEEE author-posting policy](https://journals.ieeeauthorcenter.ieee.org/become-an-ieee-journal-author/publishing-ethics/guidelines-and-policies/post-publication-policies/).
Publisher versions, copyright receipts, and reviewer correspondence are excluded.

## Research presentation

The Research page has six paper cards in the agreed order: T-RO, RA-L, IROS,
ICRA, TII, TCYB. Each published title appears in a deep-red header. T-RO, IROS,
and ICRA use videos instead of standalone figures; RA-L retains its formation
illustration. Resource links appear at the bottom of each card. Venue/year
anchors still connect publication-card Video links to the corresponding card.

| Paper | Publication thumbnail source                                  | Research media         |
| ----- | ------------------------------------------------------------- | ---------------------- |
| T-RO  | Fig. 4: `final/source/distributed_framework.pdf`              | Video                  |
| RA-L  | `photo/ellipsoid_interp.eps`                                  | Formation illustration |
| IROS  | Fig. 1: `paper/photo/separating_hyperplane.eps` on `IROS2025` | Video                  |
| ICRA  | Fig. 3: `photo/overview_new.jpg`                              | Video                  |

Vector sources are rendered at 180 dpi and thumbnails fit within 640 pixels.
Only the RA-L standalone image is retained under `assets/img/research/`, fitting
within 1600 pixels. Other full-size figures are temporary thumbnail intermediates.
Scientific labels are not cropped. Obsolete exports have been removed; see
[asset-cleanup.json](asset-cleanup.json) for paths, sizes, and hashes.

## Research videos

The original uploads remain unchanged in `assets/video/`. Prepared copies are in
`assets/video/web/`; only these three copies are included in the public build.
Template videos and the source uploads are excluded by the personal overlay.

| Upload          | Duration | Resolution  | Source codec      | Preparation                                             |
| --------------- | -------- | ----------- | ----------------- | ------------------------------------------------------- |
| `tro-2026.mp4`  | 4:04     | 1280 × 720  | H.264 + AAC audio | Stream copy, fast-start MP4                             |
| `iros-2025.mp4` | 1:37     | 1920 × 1080 | H.264, no audio   | Stream copy, fast-start MP4                             |
| `icra-2024.mp4` | 1:53     | 1280 × 720  | HEVC, no audio    | H.264, CRF 20, medium preset, YUV 4:2:0, fast-start MP4 |

Resolution and duration are checked after preparation, as is preservation of audio
streams. The title frame at exactly 0:02 provides each poster. Each native player sits
directly inside its paper card, with native controls,
`playsinline`, and `preload="none"`; autoplay and looping are disabled. Codec
choice follows [MDN's codec compatibility guide](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Video_codecs).
The manifest records source/output hashes, commands, dimensions, duration, audio,
and poster timestamps.

## Publication metadata and compact CV

`publications.bib` remains authoritative for citation text, authorship groups
(`keywords`), display order (`sortkey`), PDF bindings, previews, and video links.
First-author papers use sort keys 01–04, the TII co-first paper 05, and TCYB 06.
The website and CV consume the same groups and order. `addendum` holds CV-only
venue annotations; the website publication cards do not display it. The TII
`author+an` marks the two equal contributors for PDF daggers; content-level formatting adds the same daggers on the website. Author order is preserved.

The editable CV is a single A4 page with 10-point body text, 9.5-point publication
text, 15 mm margins, compact spacing, and a 22 × 27.5 mm formal portrait. Its section
order is Education, Publications, Research Interests, Technical Skills, Reviewing
Service. All six complete author lists remain, with Zeming Wu bold. Month labels
are abbreviated; institution locations and expected June 2028 completion remain.
The expected date appears in the PDF and on the full CV webpage. The footer is removed.

Journal annotations use **JCR 2025 JIF quartiles, June 2026 release**, checked on
15 October 2026; the release statement appears once in the CV.

| Journal | Category                     | JIF quartile | Table page |
| ------- | ---------------------------- | ------------ | ---------- |
| T-RO    | Robotics                     | Q1           | 892        |
| RA-L    | Robotics                     | Q2           | 892        |
| TII     | Automation & Control Systems | Q1           | 46         |
| TCYB    | Automation & Control Systems | Q1           | 46         |

Sources: [UEFISCDI release page](https://uefiscdi.gov.ro/scientometrie-reviste),
[complete category/quartile table](https://uefiscdi.gov.ro/resource-832709-JCR-2025.iunie-2026.site.pdf).
RA-L's AIS quartile is Q1, but its JIF quartile is Q2 in this table. ICRA and IROS
are described as flagship robotics conferences by [IEEE RAS](https://www.ieee-ras.org/publications/ra-l).

## Portrait, contact links, and homepage notes

Original portraits are preserved. The homepage uses a native 4:5 display crop
around `zeming-wu.jpg`, tightly framing head and shoulders with no facial edits.
The formal CV portrait uses `zeming-wu-cv.jpg` with fractional vertical trimming.
Six icon-only contact/profile links sit directly beneath the website portrait,
with accessible labels, tooltips, keyboard focus rings, and responsive wrapping.
They use the existing social data. The old duplicate large icon row is disabled.

The homepage includes a collaboration callout adapted to Zeming's research and an
author-requested reviewer note. The latter acknowledges the limits of the work,
welcomes discussion, and offers a drink or lunch as thanks after the review
process is complete, when meeting in person.

## Preservation and validation

The earlier manuscript build's before/after source snapshots matched. During that
session, later comparisons detected macOS `.DS_Store` metadata changes and newly
appearing `.DS_Store` files; all scientific source files remained byte-identical.
Those metadata files were not changed or restored by asset preparation.

For the current update, hashes of original portraits, uploaded videos, existing
manuscript PDFs, and the unrelated devcontainer lock file are preserved. Paper
repositories are checked before/after full or media preparation; poster-only preparation does not access them. Validation includes PDF
render inspection, video decoding/playback/seeking/fullscreen, desktop/mobile
light/dark layouts, publication order and link checks, formatting, the style
contract, the personal Jekyll build, and upgrade audits. No public deployment is
performed.

## Verification results for this update

- The previously compiled and visually inspected one-page A4 CV is preserved byte-for-byte.
- All 16 page checks pass across desktop/mobile and light/dark modes, including playback, seeking, fullscreen, profile placement, keyboard focus, publication order, and downloads.
- Original and prepared video hashes match the previously decoded versions; playback, seeking, and fullscreen are tested again. All three new posters use exactly 0:02.
- The generated site includes only the three prepared web videos, and all local links and paper anchors resolve.
- Formatting and style-contract checks pass. Upgrade audits report zero blocking findings, six existing notices in excluded demo content, and no runtime overrides.
- `python3 bin/preview_site.py` serves the local build with byte-range support for native video seeking.
- Hashes of preserved inputs and active media match their records. This poster-only update does not access paper repositories. No public deployment was performed.
