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

  // Blob config — organic random shapes, all sharing one master gradient
  var BLOB_COUNT   = 32;
  var BLOB_SIZE_VMAX = 75;       // each blob at scale 1 is huge so coverage overlaps generously
  var STAGGER_MS   = 10;          // ms per percent of distance from origin corner
  var BLOB_DUR     = 240;         // each blob's grow-in transition
  var SETTLE_MS    = 200;         // hold cover so the new page can fully render before reveal
  var FADE_MS      = 550;         // long ease-in-out reveal so it never reads as a pop

  var MASTER_GRADIENT = 'linear-gradient(135deg, #0d0d0d 0%, #2d2d2d 45%, #1a1a1a 100%)';
  var MASTER_GRADIENT_FALLBACK = '#1a1a1a';

  var blobs = [];

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

  function rand(min, max) { return min + Math.random() * (max - min); }

  function buildBlobs() {
    applyOverlayBaseStyles();
    wipe.innerHTML = '';
    blobs = [];
    for (var i = 0; i < BLOB_COUNT; i++) {
      var b = document.createElement('div');
      // Random position scattered across the viewport (in %, slight overflow at edges)
      var x = rand(-5, 105);
      var y = rand(-5, 105);
      // Random asymmetric border-radius — produces an irregular blob shape
      var r = [];
      for (var k = 0; k < 8; k++) r.push(Math.round(rand(30, 70)));
      // Random size variation — different scales make it feel organic
      var sz = BLOB_SIZE_VMAX * rand(0.55, 1.15);
      var rot = Math.round(rand(0, 360));

      b.dataset.x = x;
      b.dataset.y = y;
      b.dataset.rot = rot;

      b.style.cssText =
        'position:absolute !important;' +
        'left:' + x + '% !important;' +
        'top:'  + y + '% !important;' +
        'width:'  + sz + 'vmax !important;' +
        'height:' + sz + 'vmax !important;' +
        'min-width:'  + sz + 'vmax !important;' +
        'min-height:' + sz + 'vmax !important;' +
        'max-width:none !important;' +
        'max-height:none !important;' +
        'box-sizing:border-box !important;' +
        'display:block !important;' +
        'visibility:visible !important;' +
        'border-radius:' + r[0] + '% ' + r[1] + '% ' + r[2] + '% ' + r[3] + '% / ' +
                           r[4] + '% ' + r[5] + '% ' + r[6] + '% ' + r[7] + '% !important;' +
        'background:' + MASTER_GRADIENT + ' !important;' +
        'background-color:' + MASTER_GRADIENT_FALLBACK + ' !important;' +
        'background-attachment:fixed !important;' +     /* every blob shows the same master gradient */
        'background-size:100vw 100vh !important;' +
        'transform:translate(-50%,-50%) rotate(' + rot + 'deg) scale(0) !important;' +
        'transform-origin:center !important;' +
        'transition:transform ' + BLOB_DUR + 'ms cubic-bezier(.45,.05,.25,1) !important;' +
        'opacity:1 !important;' +
        'margin:0 !important;' +
        'padding:0 !important;' +
        'border:none !important;' +
        'float:none !important;' +
        'clip:auto !important;' +
        'clip-path:none !important;' +
        'will-change:transform !important;';
      wipe.appendChild(b);
      blobs.push(b);
    }
  }
  buildBlobs();
  setIdle();

  var resizeT;
  window.addEventListener('resize', function () {
    if (busy) return;
    if (document.documentElement.classList.contains('lgcy-wipe-incoming')) return;
    clearTimeout(resizeT);
    resizeT = setTimeout(function () {
      buildBlobs();
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
    // Solid master gradient covers the viewport via the wipe element
    wipe.style.setProperty('background', MASTER_GRADIENT, 'important');
    wipe.style.setProperty('background-color', MASTER_GRADIENT_FALLBACK, 'important');
    wipe.style.setProperty('opacity', '1', 'important');
    wipe.style.setProperty('transform', 'scale(1)', 'important');
    wipe.style.setProperty('pointer-events', 'auto', 'important');
    // All blobs fully expanded as a backup (no seams)
    blobs.forEach(function (b) {
      var rot = b.dataset.rot;
      b.style.setProperty('transition', 'none', 'important');
      b.style.setProperty('transform', 'translate(-50%,-50%) rotate(' + rot + 'deg) scale(1)', 'important');
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
        blobs.forEach(function (b) {
          var rot = b.dataset.rot;
          b.style.setProperty('transition', 'none', 'important');
          b.style.setProperty('transform', 'translate(-50%,-50%) rotate(' + rot + 'deg) scale(0)', 'important');
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

    var totalMs = maxDist() * STAGGER_MS + BLOB_DUR;

    // Stagger blob expansions from the chosen corner.
    blobs.forEach(function (b) {
      var d = distFor(+b.dataset.x, +b.dataset.y, origin);
      var delay = d * STAGGER_MS;
      var rot = b.dataset.rot;
      setTimeout(function () {
        b.style.setProperty('transform', 'translate(-50%,-50%) rotate(' + rot + 'deg) scale(1)', 'important');
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
