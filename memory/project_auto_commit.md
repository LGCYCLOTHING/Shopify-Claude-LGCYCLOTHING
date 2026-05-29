---
name: project-auto-commit
description: Repo has an automation that auto-commits and pushes file changes to origin/main as "auto: update theme files"
metadata:
  type: project
---

The LGCYCLOTHING theme repo has automation (likely a watcher/hook outside the local repo, perhaps Shopify CLI sync or a scheduled task) that detects file changes in the working tree, commits them with the message `auto: update theme files`, and pushes to `origin/main` — usually within seconds of writing a file.

**Why:** The user works visually in the Shopify theme editor and wants edits round-tripped to GitHub automatically without thinking about git.

**How to apply:**
- After editing files, `git status` will often show "working tree clean" because the auto-commit already ran. Don't assume the edit didn't happen — check `git log --stat -1` instead.
- Do NOT manually `git add` / `git commit` / `git push` unless the auto-commit hasn't fired (rare). Running your own commit can race with the automation.
- When the user says "push to GitHub when done," verifying via `git log origin/main..HEAD` (should be empty) and `git log --stat -1` (should show your files) is enough — no extra push needed.
- The automation batches by file — expect one "auto: update theme files" commit per file edited, not one combined commit.
