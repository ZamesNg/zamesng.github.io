# Homepage visitor map and contact links

Home ends with an unlabeled map and contact area below the thesis, without a
separate attribution paragraph. Desktop uses a map up to
420 px wide on the left and six icon-only links in three columns and two rows on
the right. The icon grid is compact, with 64 px icons on desktop and 60 px on
mobile. Their body areas share the same grid row and height. Mobile stacks the
map above the same icon grid. The visit count and date share one centered line, joined by “during”.
The portrait no longer has a duplicate icon row.

The map ocean uses the actual page background. Both themes use orange land
(`#e07433`), matching the contact icons in both themes. Labels use the page text color. New and previous visitor markers use cyan (`cmn=00e5ff`) and yellow
(`cmo=ffe066`). Initial colors are passed to the isolated helper in its URL.
Subsequent theme messages update CSS and the generated background image URL,
without loading another provider script or data request.

The homepage loader is emitted only in production builds at
`https://zamesng.github.io`. Local previews and direct helper visits do not start
tracking. The sandbox permits scripts and user-initiated top navigation, omits
`allow-same-origin`, and contains the provider's required `unsafe-eval` allowance.
The main page CSP remains unchanged. Messages are checked against the exact
iframe or parent window; the helper also checks the parent origin and validates
all colors as six-digit hex values. Its resize reports keep the frame fitted.
Failures or a missing ready message after 30 seconds remove only the map area.

Browser checks intercept provider traffic and exercise layout, theme changes
without recounting, accessible links, the CSP boundary, source validation,
responsive dimensions, and failure behavior. Local rendered previews may replay
an ignored cached provider response; labeled sample-point illustrations never
change real statistics. Source changes are kept local until the owner approves
publication.

The earlier globe was replaced with the owner's working flat-map ID after its
data endpoint returned HTML. The active widget's statistics page is
https://mapmyvisitors.com/web/1c8y5.
