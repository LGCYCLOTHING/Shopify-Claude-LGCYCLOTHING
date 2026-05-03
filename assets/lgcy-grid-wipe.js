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

  function buildGrid() {
    var px = window.innerWidth < 600 ? TILE_MOBILE : TILE_DESKTOP;
    cols = Math.max(4, Math.ceil(window.innerWidth  / px));
    rows = Math.max(4, Math.ceil(window.innerHeight / px));
    wipe.style.gridTemplateColumns = 'repeat(' + cols + ',1fr)';
    wipe.style.gridTemplateRows    = 'repeat(' + rows + ',1fr)';
    wipe.style.setProperty('--lgcy-tile-dur', TILE_DUR + 'ms');
    wipe.innerHTML = '';
    tiles = [];
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var t = document.createElement('div');
        t.className = 'lgcy-wipe__tile';
        t.dataset.r = r;
        t.dataset.c = c;
        wipe.appendChild(t);
        tiles.push(t);
      }
    }
  }
  buildGrid();

  var resizeT;
  window.addEventListener('resize', function () {
    clearTimeout(resizeT);
    resizeT = setTimeout(buildGrid, 150);
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
    // Wait one paint so the new page has a chance to render under the overlay
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        wipe.classList.add('is-fading');
        document.documentElement.classList.remove('lgcy-wipe-incoming');
        setTimeout(function () {
          wipe.classList.remove('is-fading');
          wipe.style.opacity = '';
          wipe.style.background = '';
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

    // Stagger from the chosen corner
    tiles.forEach(function (t) {
      var d = distFor(+t.dataset.r, +t.dataset.c, origin);
      t.style.animationDelay = (d * STAGGER_MS) + 'ms';
    });

    // Force reflow so the animation always starts cleanly
    wipe.classList.remove('is-running', 'is-fading');
    void wipe.offsetWidth;
    wipe.classList.add('is-running');

    // After the cover is complete, store the incoming flag and navigate
    var totalMs = maxDist() * STAGGER_MS + TILE_DUR;
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

    if (url.origin !== window.location.origin) return false;

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
    var url = new URL(link.href, window.location.href);
    navigateTo(url.href, origins[originIdx % origins.length]);
    originIdx++;
  });

  // If the user uses back/forward, the page is a fresh load — no incoming
  // flag, no overlay. Browser's native nav takes over.
})();
