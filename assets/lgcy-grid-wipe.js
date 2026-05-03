/* LGCY Grid Wipe — page transition controller
 *
 * Outgoing: intercept clicks on internal links → cascade tiles in → navigate.
 * Incoming: page loaded with overlay solid-white via the boot inline script
 *           → fade the overlay away → reveal the new page seamlessly.
 */
(function () {
  var wipe = document.getElementById('lgcy-wipe');
  if (!wipe) return;

  // Honour reduced motion
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.remove('lgcy-wipe-incoming');
    return;
  }

  // Tile config — a touch smaller than the demo
  var TILE_DESKTOP = 110;
  var TILE_MOBILE  = 80;
  var STAGGER_MS   = 26;
  var TILE_DUR     = 300;
  var FADE_MS      = 150;

  var cols = 0, rows = 0, tiles = [];

  // Inline-style the overlay so we don't depend on the external CSS file
  // loading or winning against other theme CSS. Only positional /
  // structural styles — visibility (opacity/background/pointer-events) is
  // managed separately so resize-triggered rebuilds don't wipe state mid-run.
  function applyOverlayBaseStyles() {
    wipe.style.position = 'fixed';
    wipe.style.top = '0';
    wipe.style.right = '0';
    wipe.style.bottom = '0';
    wipe.style.left = '0';
    wipe.style.zIndex = '2147483646';
    wipe.style.display = 'block';   // not grid — tiles are absolute-positioned
    wipe.style.margin = '0';
    wipe.style.padding = '0';
    wipe.style.overflow = 'hidden';
  }
  function setIdle() {
    wipe.style.opacity = '0';
    wipe.style.background = 'transparent';
    wipe.style.pointerEvents = 'none';
    wipe.style.transition = '';
  }

  function buildGrid() {
    applyOverlayBaseStyles();
    var px = window.innerWidth < 600 ? TILE_MOBILE : TILE_DESKTOP;
    cols = Math.max(4, Math.ceil(window.innerWidth  / px));
    rows = Math.max(4, Math.ceil(window.innerHeight / px));
    var tileW = window.innerWidth  / cols;
    var tileH = window.innerHeight / rows;
    wipe.innerHTML = '';
    tiles = [];
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var t = document.createElement('div');
        t.dataset.r = r;
        t.dataset.c = c;
        t.style.cssText =
          'position:absolute !important;' +
          'top:'         + (r * tileH) + 'px !important;' +
          'left:'        + (c * tileW) + 'px !important;' +
          'width:'       + tileW + 'px !important;' +
          'height:'      + tileH + 'px !important;' +
          'min-width:'   + tileW + 'px !important;' +
          'min-height:'  + tileH + 'px !important;' +
          'max-width:none !important;' +
          'max-height:none !important;' +
          'box-sizing:border-box !important;' +
          'display:block !important;' +
          'visibility:visible !important;' +
          'background:#ffffff !important;' +
          'transform:scale(0) !important;' +
          'transform-origin:center !important;' +
          'transition:transform ' + TILE_DUR + 'ms cubic-bezier(.65,0,.35,1) !important;' +
          'opacity:1 !important;' +
          'margin:0 !important;' +
          'padding:0 !important;' +
          'border:none !important;' +
          'float:none !important;' +
          'clip:auto !important;' +
          'clip-path:none !important;' +
          'will-change:transform !important;';
        wipe.appendChild(t);
        tiles.push(t);
      }
    }
  }
  buildGrid();
  setIdle();

  var resizeT;
  window.addEventListener('resize', function () {
    // Don't rebuild during a transition — would wipe state mid-cascade.
    if (busy) return;
    if (document.documentElement.classList.contains('lgcy-wipe-incoming')) return;
    clearTimeout(resizeT);
    resizeT = setTimeout(function () {
      buildGrid();
      setIdle();
    }, 150);
  });

  function distFor(r, c, origin) {
    switch (origin) {
      case 'tr': return r + (cols - 1 - c);
      case 'tl': return r + c;
      case 'br': return (rows - 1 - r) + (cols - 1 - c);
      case 'bl':
      default:   return (rows - 1 - r) + c;
    }
  }
  function maxDist() { return (rows - 1) + (cols - 1); }

  // ───── INCOMING: page just loaded covered, fade overlay away ─────
  if (document.documentElement.classList.contains('lgcy-wipe-incoming')) {
    // Cover the screen with solid white immediately
    wipe.style.background = '#ffffff';
    wipe.style.opacity = '1';
    wipe.style.pointerEvents = 'auto';
    // Make all tiles fully covered as a fallback if grid renders before fade
    tiles.forEach(function (t) {
      t.style.transition = 'none';
      t.style.transform = 'scale(1.02)';
    });
    // Wait one paint, then fade the overlay away
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        wipe.style.transition = 'opacity ' + FADE_MS + 'ms cubic-bezier(.4,0,1,1)';
        wipe.style.opacity = '0';
        document.documentElement.classList.remove('lgcy-wipe-incoming');
        setTimeout(function () {
          wipe.style.transition = '';
          wipe.style.background = 'transparent';
          wipe.style.pointerEvents = 'none';
          tiles.forEach(function (t) {
            t.style.transition = 'none';
            t.style.transform = 'scale(0)';
          });
        }, FADE_MS + 40);
      });
    });
  }

  // ───── OUTGOING: intercept link clicks ─────
  var busy = false;
  var origins = ['tr', 'bl', 'br', 'tl'];
  var originIdx = 0;

  function navigateTo(url, origin) {
    if (busy) return;
    busy = true;

    // Make sure the overlay is visible and on top
    wipe.style.setProperty('opacity', '1', 'important');
    wipe.style.setProperty('z-index', '2147483646', 'important');
    wipe.style.setProperty('display', 'block', 'important');
    wipe.style.setProperty('pointer-events', 'auto', 'important');

    var totalMs = maxDist() * STAGGER_MS + TILE_DUR;

    // Stagger tile transforms from the chosen corner. transition is set on
    // the tiles at build time so this just triggers it.
    tiles.forEach(function (t) {
      var d = distFor(+t.dataset.r, +t.dataset.c, origin);
      var delay = d * STAGGER_MS;
      setTimeout(function () {
        t.style.setProperty('transform', 'scale(1.02)', 'important');
      }, delay);
    });

    // After the cover is complete, store the incoming flag and navigate
    setTimeout(function () {
      try { sessionStorage.setItem('lgcy-wipe-incoming', '1'); } catch (e) {}
      window.location.href = url;
    }, totalMs);
  }

  // Public API for inline scripts that do programmatic navigation
  window.lgcyWipe = {
    navigate: function (url, origin) {
      navigateTo(url, origin || origins[(originIdx++) % origins.length]);
    },
    isBusy: function () { return busy; }
  };

  function shouldIntercept(link, evt) {
    if (!link || !link.href) return false;
    if (evt.defaultPrevented) return false;
    if (evt.metaKey || evt.ctrlKey || evt.shiftKey || evt.altKey) return false;
    if (evt.button !== 0) return false;
    if (link.target && link.target !== '' && link.target !== '_self') return false;
    if (link.hasAttribute('download')) return false;
    if (link.hasAttribute('data-no-wipe')) return false;
    var rel = (link.getAttribute('rel') || '').toLowerCase();
    if (rel.indexOf('external') !== -1) return false;

    var url;
    try { url = new URL(link.href, window.location.href); }
    catch (e) { return false; }

    // Treat the store's own myshopify.com domain as same-origin so links
    // hardcoded to *.myshopify.com still get the wipe when viewing the
    // custom storefront domain.
    var sameOrigin = url.origin === window.location.origin;
    var sameStore  = /(^|\.)myshopify\.com$/i.test(url.hostname) ||
                     /(^|\.)myshopify\.com$/i.test(window.location.hostname);
    if (!sameOrigin && !sameStore) return false;

    // Skip same-page anchors
    if (url.pathname === window.location.pathname &&
        url.search === window.location.search &&
        url.hash) return false;

    // Skip checkout / cart-permalink / file routes — they shouldn't be
    // intercepted; they trigger their own navigations or downloads.
    var p = url.pathname;
    if (p.indexOf('/checkout') === 0) return false;
    if (p.indexOf('/cart/') === 0)    return false;
    if (p.indexOf('/account/logout') === 0) return false;
    if (p.match(/\.(pdf|zip|jpg|jpeg|png|gif|webp|svg|mp4|webm|mp3)(\?|$)/i)) return false;

    return true;
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!shouldIntercept(link, e)) return;
    e.preventDefault();
    e.stopPropagation();
    var url = new URL(link.href, window.location.href);
    navigateTo(url.href, origins[originIdx % origins.length]);
    originIdx++;
  }, true);  // capture: true — beat other delegated handlers

  // If the user uses back/forward, the page is a fresh load — no incoming
  // flag, no overlay. Browser's native nav takes over.
})();
