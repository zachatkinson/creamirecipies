# Recipe Duplicates — Decisions Needed

These recipes, after being reviewed and fixed during the one-by-one audit,
**still share an identical ingredient fingerprint with another recipe**. We
couldn't find a genuine ingredient-level differentiator. Each group needs a
human decision:

- **Keep all** — they differ only in title/description/mix-in ratios; leave as-is
- **Merge** — pick the canonical one, redirect others to it (use `recipe_slug_redirects`)
- **Delete** — drop the duplicates outright

## Format
Each group shows the shared ingredient fingerprint, then the candidate
recipes with their status + publish date. Pick an action per group.

---

<!-- Groups appended here as they're identified during the audit -->
