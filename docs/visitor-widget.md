# Homepage visitor map

The Home page embeds the MapMyVisitors flat map after the thesis section. It uses
the public widget ID supplied by the site owner, an HTTPS script URL with the
supplied `cl=ffffff&w=a` options, and a centered 240 px responsive container. Only
visits that load Home are counted; the other three pages do not load the widget.

The homepage loader is emitted only by production Jekyll builds and runs only at
`https://zamesng.github.io`. Local previews and alternate hosts do not contact
MapMyVisitors. A standalone helper document loads the provider asynchronously
inside a sandboxed iframe. Direct visits to the helper do not start tracking.
The parent verifies status messages against the iframe's window and resizes the
frame to its content. Script failures or missing ready messages after 30 seconds
remove the reserved space while leaving the attribution link available.
The provider manages geographic
estimates, statistics, map appearance, and dependencies. The surrounding section
follows the site's theme.

Browser tests intercept provider traffic and serve production HTML under a
simulated production origin. They verify one-time loading, placement, responsive
sizing, script/data failure behavior, and absence of tracking on local previews or
other pages without sending test visits to the live counter.

The provider evaluates its JSONP payload with `eval`, which the main site's CSP
blocks. Only the isolated helper document permits `unsafe-eval`; the main CSP is
unchanged. The iframe allows scripts and user-initiated top navigation for the
statistics link, and deliberately omits `allow-same-origin`. Tests exercise an
evaluated provider payload and reject status messages from other windows.

## Replacement of the globe

The original globe's data requests returned HTML instead of JSONP for the supplied
ID. On 18 October 2026 the owner supplied a new flat-map code and ID. Its
`/widget_call_home.js` response successfully returned JSONP during verification.
The flat map replaces the globe; no extra globe or secondary tracker is loaded.
