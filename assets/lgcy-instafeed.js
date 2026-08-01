/* LGCY — Wrap the Instafeed title in a link to Instagram.
   Polls briefly because the title is injected by the Mintt app after load. */
(function () {
  var IG_URL = 'https://www.instagram.com/_lgcyclothing_/';

  function linkTitles() {
    var titles = document.querySelectorAll('#insta-feed h2, .instafeed-shopify h2');
    var any = false;
    titles.forEach(function (h) {
      if (h.dataset.lgcyLinked === '1' || h.querySelector('a')) return;
      var a = document.createElement('a');
      a.href = IG_URL;
      a.target = '_blank';
      a.rel = 'noopener';
      while (h.firstChild) a.appendChild(h.firstChild);
      // App-provided title has a stray space before the handle ("@ _lgyclothing_") and
      // misspells the handle (missing "c") — fix both.
      a.textContent = a.textContent.replace(/@\s+_/, '@_').replace(/_lgyclothing_/, '_lgcyclothing_');
      h.appendChild(a);
      h.dataset.lgcyLinked = '1';
      any = true;
    });
    return any;
  }

  // The feed's own image row scrolls horizontally. The site's global Lenis
  // smooth-scroll instance (layout/theme.liquid) doesn't know that and fights
  // it for wheel events — that's what makes vertical page scroll feel "stuck"
  // when the cursor is over this section. data-lenis-prevent tells Lenis to
  // leave this element alone entirely, same fix used for the PDP info card.
  function preventLenisOnFeed() {
    var els = document.querySelectorAll(
      '#insta-feed, .instafeed-shopify, .instafeed-new-layout-container, .instafeed-new-layout-wrapper'
    );
    var any = false;
    els.forEach(function (el) {
      if (el.hasAttribute('data-lenis-prevent')) return;
      el.setAttribute('data-lenis-prevent', '');
      any = true;
    });
    return any;
  }

  var attempts = 0;
  var max = 40;
  var timer = setInterval(function () {
    attempts++;
    var linked = linkTitles();
    var prevented = preventLenisOnFeed();
    if ((linked && prevented) || attempts >= max) clearInterval(timer);
  }, 200);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      linkTitles();
      preventLenisOnFeed();
    });
  } else {
    linkTitles();
    preventLenisOnFeed();
  }
})();
