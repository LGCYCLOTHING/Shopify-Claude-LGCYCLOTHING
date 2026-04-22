(function () {
  const COLS = 10;
  const ROWS = 6;
  const COL_DELAY = 60;   // ms between each column
  const TILE_DUR = 350;   // ms for one tile animation

  const overlay = document.getElementById('tile-transition-overlay');
  if (!overlay) return;

  // Build the tile grid
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const tile = document.createElement('div');
      tile.className = 'tile-transition-tile';
      tile.dataset.col = c;
      overlay.appendChild(tile);
    }
  }

  const tiles = overlay.querySelectorAll('.tile-transition-tile');

  function waveIn(callback) {
    overlay.classList.add('is-active');
    tiles.forEach(tile => {
      tile.classList.remove('tile-out');
      const col = parseInt(tile.dataset.col);
      tile.style.animationDelay = col * COL_DELAY + 'ms';
      tile.classList.add('tile-in');
    });
    const totalDuration = (COLS - 1) * COL_DELAY + TILE_DUR;
    setTimeout(callback, totalDuration);
  }

  function waveOut() {
    tiles.forEach(tile => {
      tile.classList.remove('tile-in');
      const col = parseInt(tile.dataset.col);
      tile.style.animationDelay = col * COL_DELAY + 'ms';
      tile.classList.add('tile-out');
    });
    const totalDuration = (COLS - 1) * COL_DELAY + TILE_DUR;
    setTimeout(() => {
      overlay.classList.remove('is-active');
      tiles.forEach(tile => {
        tile.classList.remove('tile-out');
        tile.style.animationDelay = '';
      });
    }, totalDuration);
  }

  // Intercept internal link clicks
  document.addEventListener('click', function (e) {
    const link = e.target.closest('a[href]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    // Skip anchors, external links, javascript:, mailto:, tel:
    if (
      href.startsWith('#') ||
      href.startsWith('javascript:') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      link.hostname !== window.location.hostname ||
      link.target === '_blank'
    ) return;

    e.preventDefault();
    waveIn(function () {
      window.location.href = href;
    });
  });

  // On page load, play the exit wave
  window.addEventListener('pageshow', function () {
    waveOut();
  });
})();
