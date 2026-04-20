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

#### Batch 2 — drafts publishing 2026-05-05 → 2026-05-18 (28 recipes reviewed)

Fixes applied in `scripts/fixes/2026-04-20-batch2-audit-fixes.sql`:

- `FIXED` cherry-almond-chip-ice-cream — added almond extract + mini chocolate chips (both missing)
- `FIXED` cherry-pomegranate-sorbet — rebalanced pomegranate from 1 tbsp to 1/2 cup
- `FIXED` chocolate-cherry-ice-cream — removed duplicate cocoa row + added cherry preserves as swirl
- `FIXED` lemon-almond-gelato — added almond extract + toasted sliced almonds mix-in
- `FIXED` saffron-rose-ice-cream — added saffron threads + crushed pistachios + saffron-bloom step (title promised saffron + pistachios, neither present)
- `FIXED` salted-honey-almond-ice-cream — added flaky sea salt + toasted sliced almonds
- `FIXED` strawberry-basil-cream-ice-cream — added fresh basil leaves (minced)
- `FIXED` strawberry-basil-gelato — added fresh basil + warm-dairy infusion step
- `FIXED` strawberry-champagne-ice-cream — added champagne
- `FIXED` strawberry-cookie-butter-ice-cream — added Biscoff cookie butter as swirl
- `FIXED` strawberry-shortcake-crunch-ice-cream — added freeze-dried strawberries + shortbread crumbles as mix-ins
- `FIXED` strawberry-vanilla-cookie-ice-cream — added vanilla sandwich cookies
- `FIXED` toasted-oat-honey-ice-cream — added toasted rolled oats + toasting step
- `FIXED` vanilla-passion-fruit-swirl-ice-cream — added passion fruit puree as swirl
- `FIXED` vegan-lemon-poppy-seed-ice-cream — added lemon zest + poppy seeds
- `FIXED` vegan-strawberry-banana-ice-cream — added ripe banana

Reviewed and left as-is:

- `OK` chocolate-covered-cherry-ice-cream, chocolate-covered-strawberry-milkshake, hibiscus-sorbet, keto-strawberry-ice-cream, lemon-bar-ice-cream, lemon-curd-ice-cream, lemon-poppy-seed-ice-cream, pistachio-rose-ice-cream, salted-honey-ice-cream, strawberry-acai-smoothie-bowl, strawberry-pretzel-ice-cream, vegan-lavender-ice-cream

#### Batch 3 — all 119 published recipes reviewed one-by-one

Fixes applied in `scripts/fixes/2026-04-20-batch3-published-fixes.sql`:

- `FIXED` banana-split-frozen-yogurt — added strawberry jam + chocolate sauce + crushed pineapple (title promised the banana split treatment, had plain banana-yogurt base)
- `FIXED` frozen-yogurt-with-mixed-berries — added actual frozen mixed berries as mix-in (had only mixed-berry jam)

Reviewed and left as-is (117 recipes — all correctly aligned with their titles). Full list skipped for brevity; verified by the same grep that found the 2 above.

---

#### Batch 4 — drafts publishing 2026-05-20 → 2026-05-30 (14 recipes fixed)

`scripts/fixes/2026-04-20-batch4-audit-fixes.sql`:

- `FIXED` dark-chocolate-cherry-cordial-ice-cream — kirsch + maraschino cherries for "cordial" character
- `FIXED` honey-bee-pollen-ice-cream — bee pollen granules
- `FIXED` honeycomb-crunch-ice-cream — honeycomb candy pieces
- `FIXED` lavender-honey-vanilla-ice-cream — dried lavender + infusion step
- `FIXED` mascarpone-honey-gelato — wildflower honey
- `FIXED` matcha-almond-butter-ice-cream — almond butter as swirl
- `FIXED` peanut-butter-honey-ice-cream — honey
- `FIXED` roasted-cherry-vanilla-ice-cream — swap puree for fresh cherries + roasting step
- `FIXED` rosewater-pistachio-crunch-ice-cream — rose water + crushed pistachios mix-in
- `FIXED` strawberry-almond-butter-ice-cream — almond butter as swirl
- `FIXED` strawberry-pecan-ice-cream — toasted pecans
- `FIXED` strawberry-rhubarb-ice-cream — rhubarb compote swirl + streusel mix-in
- `FIXED` strawberry-walnut-ice-cream — toasted walnuts
- `FIXED` toasted-almond-honey-ice-cream — toasted almonds + toasting step

#### Batch 5 — drafts publishing 2026-06-01 → 2026-06-26 (14 recipes fixed)

`scripts/fixes/2026-04-20-batch5-audit-fixes.sql`:

- `FIXED` banana-walnut-greek-frozen-yogurt — chopped walnuts
- `FIXED` blackberry-sage-honey-ice-cream — sage leaves + honey + sage infusion step
- `FIXED` chocolate-peanut-butter-greek-frozen-yogurt — peanut butter swirl
- `FIXED` chocolate-raspberry-truffle-ice-cream — moved raspberry puree to swirl + chopped truffles mix-in
- `FIXED` coconut-lime-crunch-ice-cream — fixed lemon→lime typo, added coconut cream + lime zest + toasted coconut flakes
- `FIXED` lavender-blueberry-cream-ice-cream — dried lavender + infusion step
- `FIXED` lemon-blueberry-crumble-ice-cream — blueberry compote swirl + oat streusel mix-in
- `FIXED` mango-coconut-cream-ice-cream — coconut cream
- `FIXED` mango-lime-coconut-ice-cream — fixed lemon→lime typo, added mango puree + coconut cream
- `FIXED` mango-lime-greek-frozen-yogurt — lime juice + zest
- `FIXED` peach-cobbler-protein-ice-cream — oat-almond streusel crumbles
- `FIXED` peach-vanilla-cream-gelato — vanilla extract (was missing entirely)
- `FIXED` tropical-sunrise-sorbet — replaced vague "tropical fruit blend" with mango + pineapple + orange
- `FIXED` vegan-mango-lime-ice-cream — lime juice + zest

---

<!-- New audits appended below by publish date ascending -->
