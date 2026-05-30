/* LGCY — Wrap the Instafeed title in a link to Instagram.
   Polls briefly because the title is injected by the Mintt app after load. */
(function () {
  var IG_URL = 'https://www.instagram.com/lgcyclothing.store/';

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
      h.appendChild(a);
      h.dataset.lgcyLinked = '1';
      any = true;
    });
    return any;
  }

  var attempts = 0;
  var max = 40;
  var timer = setInterval(function () {
    attempts++;
    if (linkTitles() || attempts >= max) clearInterval(timer);
  }, 200);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', linkTitles);
  } else {
    linkTitles();
  }
})();
