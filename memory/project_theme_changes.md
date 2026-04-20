---
name: LGCYCLOTHING Theme — Key Customizations
description: Summary of all custom code changes made to the Shopify Dawn-based theme for LGCYCLOTHING
type: project
---

## Header color on product pages
**Why:** Header uses transparent background everywhere. On homepage it floats over a dark video hero (white text works). On product pages the background is white, so white text was invisible.
**Fix:** `sections/header.liquid` — inline `<style>` block uses Liquid conditional `{% if request.page_type == 'product' %}` to output `#000000` instead of `#ffffff` for all header text/SVG selectors including `.lgcy-shop-btn`.

## Logo invert on product pages
**Why:** Logo image has white content — invisible on white product page background.
**Fix:** `sections/header.liquid` — `{% if request.page_type == 'product' %}` block adds `filter: invert(1); mix-blend-mode: normal` to `.header__heading-logo`.

## Mobile header positioning on product pages
**Why:** `.header-wrapper` is `position: absolute` (to float over homepage video hero). On mobile product pages this caused the header to overlap the product image.
**Fix:** `sections/header.liquid` — `@media (max-width: 989px)` inside the product conditional sets `.header-wrapper { position: relative !important }`.

## Cart drawer z-index
**Why:** Nav links with `mix-blend-mode: difference` were visually compositing over the cart drawer.
**Fix:** `assets/component-cart-drawer.css` — `.drawer` z-index raised from `1000` to `9999`, added `isolation: isolate`.

## Shop button alignment
**Why:** `.lgcy-shop-btn` had `padding: 0` while other nav items (`.header__menu-item`) use `padding: 1.2rem`, causing misalignment.
**Fix:** `snippets/lgcy-shop-menu.liquid` — `.lgcy-shop-btn` padding changed to `1.2rem`.

## Mobile hamburger → lgcy shop panel
**Why:** Default Dawn mobile hamburger only showed Track/Contact/About. The lgcy shop panel has all links (LGCYCLOTHING, LGCY., ALL PRODUCTS, About, Contact, Track Order, support links).
**Fix:** `snippets/lgcy-shop-menu.liquid`:
- Removed `lgcy-side-panel` and `lgcy-menu-overlay` from the mobile `display: none` rule (only `lgcy-shop-trigger-wrap` stays hidden)
- Added mobile CSS: panel is `width: 100vw !important`, single column, images column hidden
- Added capture-phase JS click listener on `.header__icon--menu` that intercepts on mobile (≤989px) and calls `openPanel()` instead of letting Dawn drawer open

## body.template-product class
**Fix:** `layout/theme.liquid` body tag — `{% if template.name == 'product' %} template-product{% endif %}` class added (used by base.css overrides).

## Key files modified
- `sections/header.liquid` — most product-page header fixes
- `snippets/lgcy-shop-menu.liquid` — Shop panel + mobile hamburger
- `assets/component-cart-drawer.css` — z-index fix
- `assets/base.css` — product-page header color overrides (backup, mostly superseded by header.liquid inline styles)
- `layout/theme.liquid` — template-product body class
