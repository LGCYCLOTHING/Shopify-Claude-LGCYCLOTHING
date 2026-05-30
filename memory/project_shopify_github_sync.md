---
name: project-shopify-github-sync
description: Pushing to GitHub overwrites in-Shopify theme-editor changes (e.g. app blocks added via editor get nuked). Always sync state before pushing if editor work is at stake.
metadata:
  type: project
---

The repo has Shopify ↔ GitHub integration enabled. When commits land on `origin/main`, Shopify pulls them into the live theme and **overwrites whatever was changed in the theme editor since the last GitHub push**. App blocks the user added via the editor (e.g. the Mintt Instafeed block on the collection page) are not in the GitHub template JSONs, so a push removes them.

Confirmed pattern (2026-05-29): every time I pushed CSS / theme.liquid edits while the user had a Mintt Instafeed app block live in Shopify but absent from `templates/collection.json`, the block vanished from the live page. Reverting + waiting for the user to re-add fixed it, until the next push.

**Why:** Shopify's GitHub integration treats the GitHub branch as the source of truth for the synced theme. Editor-only additions that aren't committed back are transient.

**How to apply:**
- Before pushing changes that touch the theme (CSS, theme.liquid, snippets, templates), check if the user has unsaved editor additions on the live theme — especially app blocks, custom-liquid sections, or Mintt/POWR-style app embeds.
- If the user wants to style an app block, **prefer the app's own "Custom CSS" / "Custom HTML" field** (Mintt's Instafeed has one in the block settings). That keeps styling out of GitHub and avoids the overwrite.
- If styling must live in theme code, **first sync the editor's additions into the template JSON in GitHub** (ask the user to share their current template JSON via Shopify CLI `shopify theme pull`, or rebuild the block reference manually). Then push CSS — the block survives because it's now in GitHub state.
- App-block references in template JSON look like `"type": "shopify://apps/{handle}/blocks/{block}/{uuid}"` — see `config/settings_data.json` for examples (inbox, parcelwill-parcel-panel, omnisend, etc.).
- The auto-commit/auto-push automation [[project-auto-commit]] makes this trap easy to fall into — file edits push within seconds, not giving the user time to commit editor state first.
