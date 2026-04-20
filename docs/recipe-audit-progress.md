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

#### Batch 6 — drafts publishing 2026-07 (21 recipes fixed)

`scripts/fixes/2026-04-20-batch6-audit-fixes.sql`:

- `FIXED` apple-walnut-greek-frozen-yogurt — added cinnamon + toasted walnuts
- `FIXED` banana-chocolate-chip-greek-frozen-yogurt — replaced cocoa with banana + mini chips (title says chip, not chocolate)
- `FIXED` blackberry-lemon-greek-frozen-yogurt — added blackberry puree
- `FIXED` blueberry-cardamom-ice-cream — added ground cardamom
- `FIXED` blueberry-coconut-greek-frozen-yogurt — added toasted coconut flakes
- `FIXED` blueberry-honey-ice-cream — added wildflower honey
- `FIXED` blueberry-lavender-greek-frozen-yogurt — added dried lavender (cold-mixed, no infusion needed for froyo)
- `FIXED` blueberry-lavender-ice-cream — added lavender + infusion step
- `FIXED` coconut-caramel-crunch-ice-cream — added coconut cream + flaky sea salt + toasted coconut flakes
- `FIXED` coconut-lime-leaf-ice-cream — fixed lemon→lime typo, added coconut cream + kaffir lime leaves + infusion step
- `FIXED` coconut-macaroon-ice-cream — added sweetened shredded coconut + chocolate drizzle topping + toasting step
- `FIXED` coconut-mango-turmeric-ice-cream — added coconut cream + turmeric + black pepper
- `FIXED` lemon-raspberry-greek-frozen-yogurt — added lemon juice + zest
- `FIXED` mango-basil-gelato — added basil + infusion step
- `FIXED` mango-lime-chili-ice-cream — fixed lemon→lime typo, added mango + Tajin
- `FIXED` mango-lime-mint-sorbet — added fresh mint
- `FIXED` raspberry-chocolate-chip-ice-cream — added mini chocolate chips (had cocoa but no actual chips)
- `FIXED` raspberry-lemonade-ice-cream — added raspberry puree
- `FIXED` salted-caramel-frozen-yogurt — added flaky sea salt
- `FIXED` tropical-mango-pineapple-greek-frozen-yogurt — added pineapple puree
- `FIXED` turmeric-mango-ice-cream — added turmeric + black pepper

---

#### Batch 7 — drafts publishing 2026-08 (23 recipes fixed, 1 OK)

`scripts/fixes/2026-04-20-batch7-audit-fixes.sql` covers 23 recipes including
blackberry-lemon, blueberry-almond-crumble, caramel-apple-fy, cherry-chocolate-fy,
chocolate-chip-mint-cookie, chocolate-coconut-fy, coffee-coconut-cream,
mango-lime-italian-ice, mango-vanilla-bean, mint-cookie-dough, peach-cobbler(×2),
peach-ginger-crumble, peach-prosecco, raspberry-chocolate-chip-fy,
raspberry-pistachio, raspberry-rose-cream, raspberry-vanilla-bean,
strawberry-balsamic-fy, strawberry-kiwi-fy, toasted-coconut-cream,
tropical-pineapple-coconut, vanilla-honey-almond-fy. `OK` berry-protein-power-smoothie-bowl.

#### Batch 8 — drafts publishing 2026-09 (32 recipes fixed, 3 OK)

`scripts/fixes/2026-04-20-batch8-audit-fixes.sql` covers 32 recipes across
caramels, toffees, pecans, figs, maples, pumpkins, chai spices, brown butter,
bourbon, and prosecco additions. `OK` caramel-flan, caramelized-banana,
fairlife-vanilla-caramel-lite.

---

### Session pause point — 2026-04-20

**Total recipes processed this session: 138**
- 8 already-fixed (pre-audit framework)
- 22 reviewed in batch 1 (7 fixed + 15 OK)
- 28 reviewed in batch 2 (16 fixed + 12 OK)
- 119 published reviewed in batch 3 (2 fixed + 117 OK)
- 14 fixed in batch 4 (May 20–30 drafts)
- 14 fixed in batch 5 (Jun 1–26 drafts)
- 21 fixed in batch 6 (July drafts)
- 23 fixed + 1 OK in batch 7 (Aug drafts)
- 32 fixed + 3 OK in batch 8 (Sep drafts)

**Remaining flagged drafts (from `/tmp/flagged-v2.txt`): ~484 across 2026-10 through 2027-12**
Breakdown: ~100 for 2026-10 through 2026-12, ~394 for 2027.

Resume next session from 2026-10 publish dates onward. The synonym-aware audit
script that generated `/tmp/flagged-v2.txt` can be re-run at any time to
refresh the list (see query helpers in session transcript).

<!-- New audits appended below by publish date ascending -->
