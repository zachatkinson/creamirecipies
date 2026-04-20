# Recipe Audit Progress

Tracking the one-by-one audit of every recipe in the database to ensure
ingredients and steps match the title/flavor. Started 2026-04-20.

## Audit criteria per recipe
1. Do the ingredients include everything the title promises (hero ingredients, distinguishing components)?
2. Do the steps reference anything special (roasting, infusing, toasting) implied by the title?
3. After fixing, is the ingredient fingerprint still identical to another recipe's? If yes, flag to `recipe-audit-duplicates-for-review.md`.

## Status codes
- `OK` — audited, no changes needed
- `FIXED` — audited + fixed (see commit)
- `FLAGGED` — audited, cannot differentiate from sibling; needs your decision in duplicates file

## Session progress

### Session 1 — 2026-04-20

#### Already fixed earlier in session (pre-audit framework)
- `FIXED` roasted-strawberry-basil-ice-cream
- `FIXED` strawberry-lemon-drop-ice-cream
- `FIXED` strawberry-oreo-ice-cream
- `FIXED` lemon-basil-gelato
- `FIXED` ginger-turmeric-honey-ice-cream
- `FIXED` mint-matcha-ice-cream
- `FIXED` strawberry-graham-cracker-ice-cream
- `FIXED` toasted-sesame-honey-ice-cream

---

#### Batch 1 — drafts publishing 2026-04-22 → 2026-05-04 (22 recipes reviewed)

Fixes applied in `scripts/fixes/2026-04-20-batch1-audit-fixes.sql`:

- `FIXED` kiwi-strawberry-sorbet — bumped strawberry from 1 tbsp to 1/4 cup (was a splash)
- `FIXED` lavender-lemon-cream-ice-cream — added dried culinary lavender + warm-milk infusion step (title promised lavender, recipe had none)
- `FIXED` strawberry-cream-cheese-ice-cream — added cream cheese to base (title promised it, was missing)
- `FIXED` strawberry-crunch-cookie-ice-cream — added freeze-dried strawberries + Golden Oreo crumbs (Strawberry Crunch = strawberry shortcake bar flavor profile; mix-ins were missing)
- `FIXED` strawberry-lemonade-milkshake — added lemon juice + zest (title said lemonade, no lemon)
- `FIXED` strawberry-pink-pepper-ice-cream — added crushed pink peppercorns
- `FIXED` strawberry-watermelon-italian-ice — split vague "strawberry-watermelon blend" into watermelon puree + strawberry puree + lemon juice

Reviewed and left as-is (title matches ingredients):

- `OK` cream-cheese-strawberry-ice-cream
- `OK` fairlife-strawberry-protein-ice-cream
- `OK` guava-passion-fruit-sorbet
- `OK` keto-matcha-ice-cream
- `OK` passion-fruit-sorbet
- `OK` salted-honey-pistachio-ice-cream
- `OK` strawberry-banana-protein-ice-cream
- `OK` strawberry-ginger-sorbet
- `OK` strawberry-mango-sorbet
- `OK` strawberry-passion-fruit-sorbet
- `OK` strawberry-protein-swirl-ice-cream
- `OK` tahini-honey-ice-cream
- `OK` vegan-cherry-garcia-ice-cream
- `OK` vegan-lemon-ice-cream
- `OK` vegan-matcha-ice-cream

---

<!-- New audits appended below by publish date ascending -->
