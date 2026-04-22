(function () {
  const COLS = 10;
  const ROWS = 6;
  const COL_DELAY = 55;
  const TILE_DUR = 350;
  const TOTAL = (COLS - 1) * COL_DELAY + TILE_DUR;

  const overlay = document.getElementById('tile-transition-overlay');
  if (!overlay) return;

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const tile = document.createElement('div');
      tile.className = 'tile-transition-tile';
      tile.dataset.col = c;
      overlay.appendChild(tile);
    }
  }

  const tiles = Array.from(overlay.querySelectorAll('.tile-transition-tile'));

  function resetTiles(covered) {
    tiles.forEach(tile => {
      tile.classList.remove('tile-in', 'tile-out', 'tile-covered');
      if (covered) tile.classList.add('tile-covered');
    });
    overlay.offsetHeight; // force reflow
  }

  function waveIn(callback) {
    overlay.classList.add('is-active');
    resetTiles(false);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        tiles.forEach(function (tile) {
          var col = parseInt(tile.dataset.col);
          tile.style.animationDelay = (col * COL_DELAY) + 'ms';
          tile.classList.add('tile-in');
        });
        setTimeout(callback, TOTAL);
      });
    });
  }

  function waveOut() {
    overlay.classList.add('is-active');
    resetTiles(true);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        tiles.forEach(function (tile) {
          var col = parseInt(tile.dataset.col);
          tile.style.animationDelay = (col * COL_DELAY) + 'ms';
          tile.classList.add('tile-out');
        });
        setTimeout(function () {
          resetTiles(false);
          overlay.classList.remove('is-active');
        }, TOTAL);
      });
    });
  }

  // If we navigated here from a tile transition, reveal the page
  if (sessionStorage.getItem('tile-nav') === '1') {
    sessionStorage.removeItem('tile-nav');
    waveOut();
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;

    var href = link.getAttribute('href');
    if (!href) return;

    if (
      href.charAt(0) === '#' ||
      href.indexOf('javascript:') === 0 ||
      href.indexOf('mailto:') === 0 ||
      href.indexOf('tel:') === 0 ||
      link.target === '_blank'
    ) return;

    try {
      var url = new URL(href, window.location.href);
      if (url.hostname !== window.location.hostname) return;
    } catch (err) { return; }

    e.preventDefault();
    sessionStorage.setItem('tile-nav', '1');
    waveIn(function () {
      window.location.href = href;
    });
  }, true);
})();
