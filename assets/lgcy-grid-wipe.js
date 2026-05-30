/* LGCY Grid Wipe — page transition controller (desktop only).
 *
 * Outgoing: intercept clicks on internal links → cascade white rectangle
 *           tiles in from a corner → navigate.
 * Incoming: page loaded with overlay solid-white via the boot inline script
 *           → fade the overlay away → reveal the new page seamlessly.
 *
 * Mobile (≤749px) bails entirely on outgoing — links navigate normally,
 * no cascade, no overlay. Incoming reveal still runs on all viewports as
 * a safety net (e.g. user resized between desktop nav start and load).
 */
(function () {
  var wipe = document.getElementById('lgcy-wipe');
  if (!wipe) return;

  var MOBILE_MAX = 749;
  function isMobile() { return window.innerWidth <= MOBILE_MAX; }

  // Tile config — large white rectangles, snappy cascade
  var TILE_SIZE   = 220;
  var STAGGER_MS  = 3;
  var TILE_DUR    = 130;
  var SETTLE_MS   = 100;
  var FADE_MS     = 400;

  var MASTER_BG = '#ffffff';

  var tiles = [];

  function applyOverlayBaseStyles() {
    wipe.style.position = 'fixed';
    wipe.style.top = '0';
    wipe.style.right = '0';
    wipe.style.bottom = '0';
    wipe.style.left = '0';
    wipe.style.zIndex = '2147483646';
    wipe.style.display = 'block';
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

  function buildTiles() {
    if (isMobile()) {
      wipe.innerHTML = '';
      tiles = [];
      return;
    }
    applyOverlayBaseStyles();
    wipe.innerHTML = '';
    tiles = [];

    var cols = Math.ceil(window.innerWidth  / TILE_SIZE) + 1;
    var rows = Math.ceil(window.innerHeight / TILE_SIZE) + 1;

    for (var c = 0; c < cols; c++) {
      for (var r = 0; r < rows; r++) {
        var x = c * TILE_SIZE;
        var y = r * TILE_SIZE;

        var t = document.createElement('div');
        var xPct = (x + TILE_SIZE / 2) / window.innerWidth  * 100;
        var yPct = (y + TILE_SIZE / 2) / window.innerHeight * 100;
        t.dataset.x = xPct;
        t.dataset.y = yPct;

        t.style.cssText =
          'position:absolute !important;' +
          'left:'   + x + 'px !important;' +
          'top:'    + y + 'px !important;' +
          'width:'  + TILE_SIZE + 'px !important;' +
          'height:' + TILE_SIZE + 'px !important;' +
          'min-width:'  + TILE_SIZE + 'px !important;' +
          'min-height:' + TILE_SIZE + 'px !important;' +
          'max-width:none !important;' +
          'max-height:none !important;' +
          'box-sizing:border-box !important;' +
          'display:block !important;' +
          'visibility:visible !important;' +
          'background:' + MASTER_BG + ' !important;' +
          'background-color:' + MASTER_BG + ' !important;' +
          'transform:scale(0) !important;' +
          'transform-origin:center !important;' +
          'transition:transform ' + TILE_DUR + 'ms cubic-bezier(.45,.05,.25,1) !important;' +
          'opacity:1 !important;' +
          'margin:0 !important;' +
          'padding:0 !important;' +
          'border:none !important;' +
          'float:none !important;' +
          'clip:auto !important;' +
          'will-change:transform !important;';
        wipe.appendChild(t);
        tiles.push(t);
      }
    }
  }
  buildTiles();
  setIdle();

  var resizeT;
  window.addEventListener('resize', function () {
    if (busy) return;
    if (document.documentElement.classList.contains('lgcy-wipe-incoming')) return;
    clearTimeout(resizeT);
    resizeT = setTimeout(function () {
      buildTiles();
      setIdle();
    }, 150);
  });

  function distFor(x, y, origin) {
    switch (origin) {
      case 'tr': return y + (100 - x);
      case 'tl': return y + x;
      case 'br': return (100 - y) + (100 - x);
      case 'bl':
      default:   return (100 - y) + x;
    }
  }
  function maxDist() { return 200; }

  // ───── INCOMING — runs on all viewports ─────
  if (document.documentElement.classList.contains('lgcy-wipe-incoming')) {
    applyOverlayBaseStyles();
    wipe.style.setProperty('background', MASTER_BG, 'important');
    wipe.style.setProperty('background-color', MASTER_BG, 'important');
    wipe.style.setProperty('opacity', '1', 'important');
    wipe.style.setProperty('transform', 'scale(1)', 'important');
    wipe.style.setProperty('pointer-events', 'auto', 'important');
    tiles.forEach(function (t) {
      t.style.setProperty('transition', 'none', 'important');
      t.style.setProperty('transform', 'scale(1.04)', 'important');
    });
    var startReveal = function () {
      wipe.style.setProperty(
        'transition',
        'opacity ' + FADE_MS + 'ms cubic-bezier(.4,0,.2,1), transform ' + FADE_MS + 'ms cubic-bezier(.4,0,.2,1)',
        'important'
      );
      wipe.style.setProperty('opacity', '0', 'important');
      wipe.style.setProperty('transform', 'scale(1.03)', 'important');
      document.documentElement.classList.remove('lgcy-wipe-incoming');
      try { sessionStorage.removeItem('lgcy-wipe-incoming'); } catch (e) {}
      setTimeout(function () {
        wipe.style.transition = '';
        wipe.style.background = 'transparent';
        wipe.style.backgroundColor = 'transparent';
        wipe.style.transform = '';
        wipe.style.pointerEvents = 'none';
        tiles.forEach(function (t) {
          t.style.setProperty('transition', 'none', 'important');
          t.style.setProperty('transform', 'scale(0)', 'important');
        });
      }, FADE_MS + 40);
    };
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        setTimeout(startReveal, SETTLE_MS);
      });
    });
  }

  // ───── OUTGOING — desktop only ─────
  var busy = false;
  var origins = ['tr', 'bl', 'br', 'tl'];
  var originIdx = 0;

  function prefetch(url) {
    try {
      if (typeof fetch === 'function') {
        fetch(url, { credentials: 'same-origin', cache: 'force-cache', mode: 'no-cors' })
          .catch(function () {});
      }
      var l = document.createElement('link');
      l.rel = 'prefetch';
      l.href = url;
      l.as = 'document';
      document.head.appendChild(l);
    } catch (_) {}
  }

  function navigateTo(url, origin) {
    if (busy) return;
    // Mobile safety net — even if someone calls navigateTo programmatically
    // on mobile (e.g. from window.lgcyWipe.navigate), just go.
    if (isMobile()) {
      window.location.href = url;
      return;
    }
    busy = true;
    prefetch(url);

    wipe.style.setProperty('opacity', '1', 'important');
    wipe.style.setProperty('z-index', '2147483646', 'important');
    wipe.style.setProperty('display', 'block', 'important');
    wipe.style.setProperty('pointer-events', 'auto', 'important');

    var totalMs = maxDist() * STAGGER_MS + TILE_DUR;

    tiles.forEach(function (t) {
      var d = distFor(+t.dataset.x, +t.dataset.y, origin);
      var delay = d * STAGGER_MS;
      setTimeout(function () {
        t.style.setProperty('transform', 'scale(1.04)', 'important');
      }, delay);
    });

    setTimeout(function () {
      try { sessionStorage.setItem('lgcy-wipe-incoming', '1'); } catch (e) {}
      window.location.href = url;
    }, Math.round(totalMs * 0.95));
  }

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

    var sameOrigin = url.origin === window.location.origin;
    var sameStore  = /(^|\.)myshopify\.com$/i.test(url.hostname) ||
                     /(^|\.)myshopify\.com$/i.test(window.location.hostname);
    if (!sameOrigin && !sameStore) return false;

    if (url.pathname === window.location.pathname &&
        url.search === window.location.search &&
        url.hash) return false;

    var p = url.pathname;
    if (p.indexOf('/checkout') === 0) return false;
    if (p.indexOf('/cart/') === 0)    return false;
    if (p.indexOf('/account/logout') === 0) return false;
    if (p.match(/\.(pdf|zip|jpg|jpeg|png|gif|webp|svg|mp4|webm|mp3)(\?|$)/i)) return false;

    return true;
  }

  window.addEventListener('click', function (e) {
    if (isMobile()) return;                       // mobile bail — let browser navigate
    var link = e.target.closest && e.target.closest('a[href]');
    if (!link) return;
    if (!shouldIntercept(link, e)) return;
    e.preventDefault();
    e.stopPropagation();
    var url = new URL(link.href, window.location.href);
    navigateTo(url.href, origins[originIdx % origins.length]);
    originIdx++;
  }, true);
})();
