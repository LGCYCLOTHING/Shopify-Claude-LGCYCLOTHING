/* LGCY — Per-collection hero title swap.
   Replaces the hardcoded "THE LEGACY COLLECTION." h1 in the
   collection.json custom_liquid block based on which collection
   is currently being viewed. Easy to extend — just add an entry
   to TITLES below as new collections are created. */
(function () {
  var TITLES = {
    'lgcy-glasses': 'LGCY EYEWEAR',
    'the-legacy-collection': 'THE LEGACY COLLECTION.',
    'all': 'LGCYCLOTHING'
  };

  var match = window.location.pathname.match(/\/collections\/([^\/?#]+)/);
  var handle = match ? match[1] : null;
  var target = handle && TITLES[handle];
  if (!target) return;

  function trySwap() {
    var h1 = document.querySelector('#hero-title-collection h1');
    if (!h1) return false;
    if (h1.dataset.lgcyTitled === '1') return true;
    h1.textContent = target;
    h1.dataset.lgcyTitled = '1';
    return true;
  }

  if (trySwap()) return;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', trySwap);
  }

  if (window.MutationObserver) {
    var obs = new MutationObserver(function () {
      if (trySwap()) obs.disconnect();
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(function () { obs.disconnect(); }, 8000);
  }
})();
