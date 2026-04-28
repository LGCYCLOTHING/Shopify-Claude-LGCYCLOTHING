// Module-level cache so products aren't re-fetched on every cart update
let _storeProductsCache = null;

class CartDrawer extends HTMLElement {
  constructor() {
    super();

    this.addEventListener('keyup', (evt) => evt.code === 'Escape' && this.close());
    this.bindOverlayClose();
    this.setHeaderCartIconAccessibility();
  }

  bindOverlayClose() {
    const overlay = this.querySelector('#CartDrawer-Overlay');
    if (overlay) overlay.addEventListener('click', this.close.bind(this));
  }

  setHeaderCartIconAccessibility() {
    const cartLink = document.querySelector('#cart-icon-bubble');
    if (!cartLink) return;

    cartLink.setAttribute('role', 'button');
    cartLink.setAttribute('aria-haspopup', 'dialog');
    cartLink.addEventListener('click', (event) => {
      event.preventDefault();
      this.open(cartLink);
    });
    cartLink.addEventListener('keydown', (event) => {
      if (event.code.toUpperCase() === 'SPACE') {
        event.preventDefault();
        this.open(cartLink);
      }
    });
  }

  open(triggeredBy) {
    if (triggeredBy) this.setActiveElement(triggeredBy);
    const cartDrawerNote = this.querySelector('[id^="Details-"] summary');
    if (cartDrawerNote && !cartDrawerNote.hasAttribute('role')) this.setSummaryAccessibility(cartDrawerNote);

    setTimeout(() => {
      this.classList.add('animate', 'active');
    });

    this.addEventListener(
      'transitionend',
      () => {
        const containerToTrapFocusOn = this.classList.contains('is-empty')
          ? this.querySelector('.drawer__inner-empty')
          : document.getElementById('CartDrawer');
        const focusElement = this.querySelector('.drawer__inner') || this.querySelector('.drawer__close');
        trapFocus(containerToTrapFocusOn, focusElement);
      },
      { once: true }
    );

    document.body.classList.add('overflow-hidden');
    this.loadRecommendations();
  }

  close() {
    this.classList.remove('active');
    removeTrapFocus(this.activeElement);
    document.body.classList.remove('overflow-hidden');
  }

  setSummaryAccessibility(cartDrawerNote) {
    cartDrawerNote.setAttribute('role', 'button');
    cartDrawerNote.setAttribute('aria-expanded', 'false');

    if (cartDrawerNote.nextElementSibling.getAttribute('id')) {
      cartDrawerNote.setAttribute('aria-controls', cartDrawerNote.nextElementSibling.id);
    }

    cartDrawerNote.addEventListener('click', (event) => {
      event.currentTarget.setAttribute('aria-expanded', !event.currentTarget.closest('details').hasAttribute('open'));
    });

    cartDrawerNote.parentElement.addEventListener('keyup', onKeyUpEscape);
  }

  renderContents(parsedState) {
    this.classList.remove('is-empty');
    const drawerInner = this.querySelector('.drawer__inner');
    if (drawerInner) drawerInner.classList.remove('is-empty');

    this.productId = parsedState.id;
    this.getSectionsToRender().forEach((section) => {
      const sectionElement = section.selector
        ? document.querySelector(section.selector)
        : document.getElementById(section.id);

      if (!sectionElement) return;
      sectionElement.innerHTML = this.getSectionInnerHTML(parsedState.sections[section.id], section.selector);
    });

    setTimeout(() => {
      this.bindOverlayClose();
      this.open();
    });
  }

  getSectionInnerHTML(html, selector = '.shopify-section') {
    return new DOMParser().parseFromString(html, 'text/html').querySelector(selector).innerHTML;
  }

  getSectionsToRender() {
    return [
      {
        id: 'cart-drawer',
        selector: '#CartDrawer',
      },
      {
        id: 'cart-icon-bubble',
      },
    ];
  }

  getSectionDOM(html, selector = '.shopify-section') {
    return new DOMParser().parseFromString(html, 'text/html').querySelector(selector);
  }

  setActiveElement(element) {
    this.activeElement = element;
  }

  connectedCallback() {
    // Subscribe to Dawn's cart-update pub/sub event — fires after updateQuantity
    // has already patched the DOM, so loadRecommendations can safely re-render.
    subscribe(PUB_SUB_EVENTS.cartUpdate, () => {
      this.loadRecommendations();
    });
  }

  loadRecommendations() {
    const track = this.querySelector('[data-rec-track]');
    if (!track) return;

    // Build set of product IDs already in cart so we don't recommend them
    const cartIds = new Set((track.dataset.cartIds || '').split(',').filter(Boolean));

    const renderProducts = (products) => {
      const section = track.closest('.cart-drawer__recommendations');
      const filtered = (products || []).filter((p) => !cartIds.has(String(p.id)));
      if (!filtered.length) {
        if (section) section.style.display = 'none';
        return;
      }
      if (section) section.style.display = '';
      track.innerHTML = filtered
        .slice(0, 4)
        .map((p) => {
          // /products.json has no top-level price; use variant price (already a dollar string) or price_min (cents)
          const rawPrice = (p.variants && p.variants[0] && p.variants[0].price)
            ? parseFloat(p.variants[0].price)
            : (p.price_min || 0) / 100;
          const price = rawPrice.toFixed(2);
          // /products.json returns featured_image as an object {src:"..."}, recommendations API returns a string
          const imgSrc =
            typeof p.featured_image === 'string'
              ? p.featured_image
              : (p.featured_image && p.featured_image.src) ||
                (p.images && p.images[0] && p.images[0].src) ||
                '';
          const img = imgSrc
            ? `<img src="${imgSrc}" alt="${p.title.replace(/"/g, '&quot;')}" class="cart-rec-card__img" loading="lazy">`
            : '';
          // /products.json doesn't include a url field — build it from handle
          const url = p.url || '/products/' + p.handle;
          return `<a href="${url}" class="cart-rec-card">
            <div class="cart-rec-card__img-wrap">${img}</div>
            <div class="cart-rec-card__info">
              <span class="cart-rec-card__title">${p.title}</span>
              <span class="cart-rec-card__price">$${price}</span>
            </div>
          </a>`;
        })
        .join('');
    };

    // Use cached products if available, otherwise fetch all store products
    if (_storeProductsCache) {
      renderProducts(_storeProductsCache);
      return;
    }

    fetch('/products.json?limit=24')
      .then((r) => r.json())
      .then((d) => {
        _storeProductsCache = d.products || [];
        renderProducts(_storeProductsCache);
      })
      .catch(() => {
        const section = track.closest('.cart-drawer__recommendations');
        if (section) section.style.display = 'none';
      });
  }
}

customElements.define('cart-drawer', CartDrawer);

class CartDrawerItems extends CartItems {
  getSectionsToRender() {
    return [
      {
        id: 'CartDrawer',
        section: 'cart-drawer',
        selector: '.drawer__inner',
      },
      {
        id: 'cart-icon-bubble',
        section: 'cart-icon-bubble',
        selector: '.shopify-section',
      },
    ];
  }

}

customElements.define('cart-drawer-items', CartDrawerItems);
