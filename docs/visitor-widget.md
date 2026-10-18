# Homepage visitor globe

The Home page embeds the MapMyVisitors globe after the thesis section. It uses the
public widget ID supplied by the site owner, an HTTPS script URL, and a centered
240 px responsive container. Only visits that load Home are counted; the other
three pages do not load the widget.

The loader is emitted only by production Jekyll builds and runs only at
`https://zamesng.github.io`. Local previews and alternate hosts do not contact
MapMyVisitors. The provider script loads asynchronously; a failed script load
removes the reserved globe space while leaving the attribution link available.
The provider manages geographic estimates, statistics, globe appearance, and its
dependencies. The surrounding section follows the site's theme.

Browser tests intercept provider traffic and serve the production HTML under a
simulated production origin. They verify one-time loading, placement, responsive
sizing, failure behavior, and absence of tracking on local previews or other pages
without sending test visits to the live counter.
