/* LGCY Grid Wipe — page transition controller
 *
 * Outgoing: intercept clicks on internal links → cascade tiles in → navigate.
 * Incoming: page loaded with overlay solid-white via the boot inline script
 *           → fade the overlay away → reveal the new page seamlessly.
 */
(function () {
  function badge(msg, color) {
    if (!document.body) return;
    var b = document.createElement('div');
    b.textContent = msg;
    b.style.cssText = [
      'position:fixed','top:12px','right:12px','z-index:2147483647',
      'background:' + (color || '#0a0a0a'),'color:#fff',
      'font:700 11px/1.2 system-ui,sans-serif','letter-spacing:.08em',
      'text-transform:uppercase','padding:8px 12px','border-radius:6px',
      'box-shadow:0 4px 14px rgba(0,0,0,.4)','pointer-events:none',
      'opacity:0','transition:opacity .2s ease'
    ].join(';');
    document.body.appendChild(b);
    requestAnimationFrame(function(){ b.style.opacity = '1'; });
    setTimeout(function(){ b.style.opacity = '0'; setTimeout(function(){ b.remove(); }, 220); }, 3500);
  }

  var wipe = document.getElementById('lgcy-wipe');
  if (!wipe) {
    setTimeout(function(){ badge('wipe: NO #lgcy-wipe', '#a83232'); }, 100);
    return;
  }
  setTimeout(function(){ badge('1: ready ' + window.innerWidth + 'w', '#1f6e3a'); }, 100);

  // Surface any crash with a visible error badge so we don't have to guess
  window.addEventListener('error', function (ev) {
    badge('JS ERR: ' + ((ev && ev.message) || 'unknown').slice(0, 60), '#a83232');
  });
  setTimeout(function(){ badge('2: err handler', '#3a4a8a'); }, 250);

  // Honour reduced motion
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.remove('lgcy-wipe-incoming');
    return;
  }

  // Hex config — pointy-flat tessellation, faster cascade
  var HEX_DESKTOP = 130;
  var HEX_MOBILE  = 80;
  var STAGGER_MS  = 8;
  var HEX_DUR     = 200;
  var SETTLE_MS   = 200;
  var FADE_MS     = 550;

  // Master image — same across all hexes via background-attachment:fixed
  // so the whole overlay reads as one image. Grain temporarily removed
  // until we confirm clicks work without complex multi-layer bg.
  var MASTER_BG =
    'radial-gradient(ellipse 70% 55% at 60% 28%, #6e6e6e 0%, rgba(60,60,60,0) 60%),' +
    'radial-gradient(ellipse 60% 50% at 25% 75%, #303030 0%, rgba(20,20,20,0) 55%),' +
    'linear-gradient(135deg, #050505 0%, #161616 50%, #050505 100%)';
  var MASTER_BG_SIZE = '100vw 100vh, 100vw 100vh, 100vw 100vh';
  var MASTER_BG_ATTACHMENT = 'fixed, fixed, fixed';
  var MASTER_BG_BLEND = 'normal, normal, normal';
  var MASTER_FALLBACK = '#0a0a0a';

  // Hexagon clip-path (flat-top)
  var HEX_CLIP = 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)';

  var hexes = [];

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

  function buildHexes() {
    applyOverlayBaseStyles();
    wipe.innerHTML = '';
    hexes = [];

    var hexSize = window.innerWidth < 600 ? HEX_MOBILE : HEX_DESKTOP;  // hex width (W = 2s)
    var s = hexSize / 2;
    var hexHeight = s * Math.sqrt(3);
    var horizSpacing = 1.5 * s;
    var vertSpacing  = hexHeight;

    var cols = Math.ceil(window.innerWidth  / horizSpacing) + 2;
    var rows = Math.ceil(window.innerHeight / vertSpacing)  + 2;

    for (var c = -1; c < cols; c++) {
      for (var r = -1; r < rows; r++) {
        var x = c * horizSpacing;
        var y = r * vertSpacing + ((c & 1) ? vertSpacing / 2 : 0);

        var h = document.createElement('div');
        // Position relative to the viewport so the same fixed gradient lines up
        var xPct = (x + hexSize / 2) / window.innerWidth  * 100;
        var yPct = (y + hexHeight / 2) / window.innerHeight * 100;
        h.dataset.x = xPct;
        h.dataset.y = yPct;

        h.style.cssText =
          'position:absolute !important;' +
          'left:'   + x + 'px !important;' +
          'top:'    + y + 'px !important;' +
          'width:'  + hexSize  + 'px !important;' +
          'height:' + hexHeight + 'px !important;' +
          'min-width:'  + hexSize  + 'px !important;' +
          'min-height:' + hexHeight + 'px !important;' +
          'max-width:none !important;' +
          'max-height:none !important;' +
          'box-sizing:border-box !important;' +
          'display:block !important;' +
          'visibility:visible !important;' +
          'background:' + MASTER_BG + ' !important;' +
          'background-color:' + MASTER_FALLBACK + ' !important;' +
          'background-attachment:' + MASTER_BG_ATTACHMENT + ' !important;' +
          'background-size:' + MASTER_BG_SIZE + ' !important;' +
          'background-blend-mode:' + MASTER_BG_BLEND + ' !important;' +
          '-webkit-clip-path:' + HEX_CLIP + ' !important;' +
          'clip-path:' + HEX_CLIP + ' !important;' +
          'transform:scale(0) !important;' +
          'transform-origin:center !important;' +
          'transition:transform ' + HEX_DUR + 'ms cubic-bezier(.45,.05,.25,1) !important;' +
          'opacity:1 !important;' +
          'margin:0 !important;' +
          'padding:0 !important;' +
          'border:none !important;' +
          'float:none !important;' +
          'clip:auto !important;' +
          'will-change:transform !important;';
        wipe.appendChild(h);
        hexes.push(h);
      }
    }
  }
  setTimeout(function(){ badge('3: pre-build', '#3a4a8a'); }, 400);
  try {
    buildHexes();
    setIdle();
    setTimeout(function(){ badge('4: built ' + hexes.length, '#1f6e3a'); }, 550);
  } catch (err) {
    setTimeout(function(){ badge('BUILD ERR: ' + ((err && err.message)||'').slice(0,60), '#a83232'); }, 550);
  }
  setTimeout(function(){ badge('5: post-build', '#3a4a8a'); }, 700);

  var resizeT;
  window.addEventListener('resize', function () {
    if (busy) return;
    if (document.documentElement.classList.contains('lgcy-wipe-incoming')) return;
    clearTimeout(resizeT);
    resizeT = setTimeout(function () {
      buildHexes();
      setIdle();
    }, 150);
  });

  // x and y are viewport %; origin selects which corner the wave starts from
  function distFor(x, y, origin) {
    switch (origin) {
      case 'tr': return y + (100 - x);
      case 'tl': return y + x;
      case 'br': return (100 - y) + (100 - x);
      case 'bl':
      default:   return (100 - y) + x;
    }
  }
  function maxDist() { return 200; }   // 100 + 100 across viewport

  // ───── INCOMING: page just loaded covered, fade overlay away ─────
  if (document.documentElement.classList.contains('lgcy-wipe-incoming')) {
    // Wipe element shows the master image directly so cover is solid
    wipe.style.setProperty('background', MASTER_BG, 'important');
    wipe.style.setProperty('background-color', MASTER_FALLBACK, 'important');
    wipe.style.setProperty('background-attachment', MASTER_BG_ATTACHMENT, 'important');
    wipe.style.setProperty('background-size', MASTER_BG_SIZE, 'important');
    wipe.style.setProperty('background-blend-mode', MASTER_BG_BLEND, 'important');
    wipe.style.setProperty('opacity', '1', 'important');
    wipe.style.setProperty('transform', 'scale(1)', 'important');
    wipe.style.setProperty('pointer-events', 'auto', 'important');
    hexes.forEach(function (h) {
      h.style.setProperty('transition', 'none', 'important');
      h.style.setProperty('transform', 'scale(1.04)', 'important');
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
      setTimeout(function () {
        wipe.style.transition = '';
        wipe.style.background = 'transparent';
        wipe.style.backgroundColor = 'transparent';
        wipe.style.transform = '';
        wipe.style.pointerEvents = 'none';
        hexes.forEach(function (h) {
          h.style.setProperty('transition', 'none', 'important');
          h.style.setProperty('transform', 'scale(0)', 'important');
        });
      }, FADE_MS + 40);
    };
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        setTimeout(startReveal, SETTLE_MS);
      });
    });
  }

  // ───── OUTGOING: intercept link clicks ─────
  var busy = false;
  var origins = ['tr', 'bl', 'br', 'tl'];
  var originIdx = 0;

  function prefetch(url) {
    // <link rel=prefetch> isn't well supported on Safari mobile — use a
    // fetch() to warm the browser cache so the upcoming navigation can
    // pull from cache instead of waiting on the network.
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
    busy = true;

    // Kick off a prefetch immediately so the next page is in cache by the
    // time the cascade ends — eliminates the "all-grey waiting" gap.
    prefetch(url);

    // Make sure the overlay is visible and on top
    wipe.style.setProperty('opacity', '1', 'important');
    wipe.style.setProperty('z-index', '2147483646', 'important');
    wipe.style.setProperty('display', 'block', 'important');
    wipe.style.setProperty('pointer-events', 'auto', 'important');

    var totalMs = maxDist() * STAGGER_MS + HEX_DUR;

    // Stagger hex pop-ins from the chosen corner.
    hexes.forEach(function (h) {
      var d = distFor(+h.dataset.x, +h.dataset.y, origin);
      var delay = d * STAGGER_MS;
      setTimeout(function () {
        h.style.setProperty('transform', 'scale(1.04)', 'important');
      }, delay);
    });

    // Navigate just before the very last tile lands — cascade reaches
    // (near) full cover and the page swap happens at that moment.
    setTimeout(function () {
      try { sessionStorage.setItem('lgcy-wipe-incoming', '1'); } catch (e) {}
      window.location.href = url;
    }, Math.round(totalMs * 0.95));
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

  // Diagnostic: log every click anywhere so we can see if our handler
  // is being suppressed by something earlier in the capture chain.
  window.addEventListener('click', function (e) {
    var t = e.target;
    var tag = (t.tagName || '?').toLowerCase();
    var link = t.closest && t.closest('a[href]');
    var href = link ? (link.getAttribute('href') || '').slice(0, 30) : '(no a)';
    badge('CLICK ' + tag + ' a=' + href, '#3a4a8a');
  }, true);

  window.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('a[href]');
    if (!link) return;
    if (!shouldIntercept(link, e)) {
      badge('skip: ' + (link.getAttribute('href') || '').slice(0, 36), '#9c6f1c');
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    var url = new URL(link.href, window.location.href);
    badge('wipe(' + hexes.length + ') -> ' + url.pathname.slice(0, 28), '#1f6e3a');
    navigateTo(url.href, origins[originIdx % origins.length]);
    originIdx++;
  }, true);  // capture: true on window — beats document-level listeners

  setTimeout(function(){ badge('6: handlers installed', '#1f6e3a'); }, 850);

  // If the user uses back/forward, the page is a fresh load — no incoming
  // flag, no overlay. Browser's native nav takes over.
})();
