# Homepage visitor map

The Home page embeds the MapMyVisitors flat map after the thesis section. It uses
the public widget ID supplied by the site owner, an HTTPS script URL with the
supplied `cl=ffffff&w=a` options, and a centered 240 px responsive container. Only
visits that load Home are counted; the other three pages do not load the widget.

The loader is emitted only by production Jekyll builds and runs only at
`https://zamesng.github.io`. Local previews and alternate hosts do not contact
MapMyVisitors. The provider script loads asynchronously; a failed script load
removes the reserved map space while leaving the attribution link available.
If the provider fails to create the map or leaves its loading indicator present
after 30 seconds, the unused space is removed. The provider manages geographic
estimates, statistics, map appearance, and dependencies. The surrounding section
follows the site's theme.

Browser tests intercept provider traffic and serve production HTML under a
simulated production origin. They verify one-time loading, placement, responsive
sizing, script/data failure behavior, and absence of tracking on local previews or
other pages without sending test visits to the live counter.

## Replacement of the globe

The original globe's data requests returned HTML instead of JSONP for the supplied
ID. On 18 October 2026 the owner supplied a new flat-map code and ID. Its
`/widget_call_home.js` response successfully returned JSONP during verification.
The flat map replaces the globe; no extra globe or secondary tracker is loaded.
