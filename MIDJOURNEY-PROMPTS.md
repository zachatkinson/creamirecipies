# Midjourney Prompt Guide for Recipe Images

## Core Principle
The image must match what the user will actually make. If the recipe blends an ingredient into the base, it should not appear as visible chunks. If something is a mix-in, it should appear distributed through the ice cream in the correct form.

## How Ninja Creami Recipes Work

### Base Ingredients
Everything blended into the base before freezing becomes **part of the ice cream itself**. The Creami blade processes the frozen block into a smooth, creamy texture. Base ingredients affect **color and flavor** but are not individually visible.

Examples:
- Carrots blended into base → orange-tinted ice cream, no visible carrot pieces
- Strawberry puree in base → pink ice cream, no visible strawberry chunks
- Matcha powder in base → green ice cream, uniform color
- Peanut butter in base → tan/brown tint, smooth throughout
- Espresso powder in base → coffee-colored ice cream

> **The ingredient groups map to the `group_name` field in the `ingredients` DB table.** When writing a prompt, pull the recipe's ingredients and read each row's `group_name` — don't guess. The four real values are `base`, `mix-ins`, `swirl`, and `topping`.

### Mix-Ins (`group_name: mix-ins`)
Chunky pieces folded in after the first spin → **visible pieces distributed throughout**:
- Chocolate chips, chopped nuts, cookie pieces, candy pieces
- Crushed Oreos, graham cracker crumbs, toffee bits
- Freeze-dried fruit pieces

#### ⭐ Proven mix-in formula (IMPORTANT — read before writing any mix-in prompt)
MidJourney defaults to a smooth scoop and either omits chunky pieces or renders them too small and fully buried, so they vanish. Three things make mix-ins read every time:

1. **Force pieces to protrude, and put some on top.** Use the exact cues **"generously studded with [pieces], chunks poking out of the scooped surface, with a few scattered on top."** Fully-embedded pieces disappear — only protruding + on-top pieces read as chunks. Pair with a `45-degree angle` and **"dense creamy freshly scooped texture"** so the interior shows.
2. **Make them big and explicit.** Say **"large chunky pieces"** / **"generous [X] chunks"**, never "small bits." Give a size/shape cue.
3. **Maximize color contrast — this is the #1 failure.** Dark pieces on a dark base (brownie on chocolate, chocolate chips on chocolate) are brown-on-brown and disappear. When the mix-in shares the base's color family, either render the **base lighter** (e.g. "light mocha-brown" instead of "dark chocolate") so the dark chunks pop, describe the pieces with **defined edges / lighter fudgy cracks**, or lean on a contrasting piece (pale cookie). High-contrast pairings (dark chips on pale vanilla, golden crumble on purple) read best.

Template that works:
```
45-degree angle of [base, rendered light enough to contrast the pieces] ice cream in a white ceramic bowl, generously studded with large [high-contrast mix-in] chunks throughout, pieces poking out of the scooped surface and a few scattered on top, dense creamy freshly scooped texture, [props] beside the bowl, [lighting], food photography --ar 4:3 --v 6.1 --style raw
```

**Avoid:** smooth closed scoops, "small bits/flecks" wording, and dark-on-dark base/mix-in pairings — all three hide the pieces.

#### ⭐ Cookie mix-ins (Oreo / cookies-and-cream / Thin Mint) — special case
Describing "chocolate sandwich cookie chunks" backfires: MidJourney renders them as smooth glossy **chocolate chunks**, not cookies. Two fixes that work together:

1. **Name the flavor, don't describe the piece.** Lead with the known dessert — **"cookies-and-cream ice cream"**, **"mint chocolate cookies-and-cream"** — MidJourney has strong training on these and renders the characteristic look correctly.
2. **Ask for crumbs + speckle, not chunks.** Use **"densely speckled and studded throughout with crushed [cookie] — irregular matte-black cookie crumbs and small broken pieces, some showing white cream filling"**. Drop the "large chunks poking out" wording here — that's exactly what biases toward glossy chocolate. For Thin Mint / mint-choc, pair with a **pale mint-green base** for contrast (not mocha-brown).

Template that works:
```
45-degree angle of [flavor] cookies-and-cream ice cream in a white ceramic bowl, creamy [base color] ice cream densely speckled and studded throughout with crushed [cookie] — irregular matte-black cookie crumbs and small broken pieces, some showing white cream filling, a few pieces on top, dense creamy freshly scooped texture, whole [cookie] and [props] beside the bowl, soft natural light from the left, shallow depth of field, food photography --ar 4:3 --v 6.1 --style raw
```

#### ⭐ Golden crumb mix-ins (graham cracker / pie crust / cobbler) — extends the cookie case
Golden baked crumbs (graham cracker, pie crust, cobbler/biscuit) hit the **same** wall as cookies, but worse: MidJourney reads "graham cracker crumble" / "pie crust pieces" as a **crust or a topping pile on the crown**, never distributed. Fighting it word-by-word ("throughout", "in cross-section") fails. What works — hijack the cookies-and-cream render and recolor:

1. **Lead with "cookies-and-cream ice cream," then swap the piece color.** "cookies-and-cream ice cream, but with a [base] and **golden [graham cracker / pie crust / cobbler] bits in place of the usual dark chocolate cookie pieces**." Anchoring to cookies-and-cream (a render MJ knows cold) forces the even internal distribution — you're only changing brown→golden.
2. **Say "fine crumbs," not "pieces/chunks."** Default renders them too big — use **"fine golden crumbs, tiny crumb-size specks, small like fine cookie crumbs, not big chunks."**
3. Proven on blueberry-cheesecake-crumble, blueberry-pie, vanilla-blueberry-cobbler (all had the mix-in only in the title — the recipe was fixed to add a real `mix-ins` row + Mix-In step first).

Template:
```
45-degree angle of cookies-and-cream ice cream in a white ceramic bowl, but with a [base color/flavor] base and fine golden [graham cracker / pie crust / cobbler] crumbs in place of the usual dark chocolate cookie pieces — tiny crumb-size golden-brown specks scattered densely and evenly all the way through the scoop, small like fine cookie crumbs not big chunks, [base] with the crumbs suspended throughout and visible across the whole scooped surface, dense creamy freshly scooped texture, [props] beside the bowl, soft natural light from the left, shallow depth of field, food photography --ar 4:3 --v 6.1 --style raw
```

#### ⭐ White flake mix-ins in dark bases (shredded coconut in chocolate) — named-flavor anchor
Two approaches that FAIL for white flakes in a dark base: (1) plain description ("chocolate ice cream studded with shredded coconut, a few scattered on top") renders ALL the coconut as a garnish sprinkle on the crown — the training data for this pairing is dominated by garnish shots; (2) the inverted cookies-and-cream hijack ("cookies-and-cream but with a dark chocolate base and white coconut in place of the cookie pieces") loses to the anchor — it renders actual cookies-and-cream (pale base, dark crumbs).

What works — **anchor to a named flavor whose reference photos natively have the pieces distributed**, then describe the flecks as embedded:

1. **Lead with the candy/dessert name.** "Mounds candy bar inspired dark chocolate coconut ice cream" — distribution comes free from the anchor's imagery instead of from instructions MidJourney ignores.
2. **Say "embedded across the freshly scooped face,"** never "scattered on top" — that phrase is what causes the garnish render.
3. **Expect the anchor to drag in a glossy/melty fudge look** (candy-bar photography skews wet). Counter it with **"firm dense scoops straight from the freezer, matte frosty surface with sharp scoop ridges"** plus **`--no melting, drips, glossy sheen, syrup`** — the `--no` parameter actually works, unlike negations in prose.

Proven on chocolate-coconut-cream-ice-cream (2026-08-17). Template:
```
45-degree angle of [named candy/dessert] inspired [base] ice cream in a white ceramic bowl, [base color] ice cream densely speckled all the way through with [white flake mix-in], flecks embedded across the whole freshly scooped face, firm dense scoops straight from the freezer, matte frosty surface with sharp scoop ridges, [props] beside the bowl, soft natural light from the left, shallow depth of field, food photography --ar 4:3 --style raw --no melting, drips, glossy sheen, syrup
```

### Swirls (`group_name: swirl`)
Soft/liquid components rippled through the base → **ribbons or swirls, never chunks**:
- Caramel sauce, chocolate sauce, fruit jam/preserves
- Peanut butter (as a swirl, not the base), lemon curd, Nutella, marshmallow fluff
- Fruit purees swirled in (as opposed to blended into the base)

#### ⭐ Proven swirl formula (IMPORTANT — read before writing any swirl prompt)
MidJourney hides swirls inside a single smooth scoop, and renders "marbled tub" framings weakly. Three things make a swirl read clearly every time:

1. **Show the swirl in TWO places: surface + cut face.** Relying on the cut interior alone fails when MidJourney renders a rounded (uncut) scoop. Use a `side angle` with **"boldly marbled with thick distinct ribbons of [X] — the swirl clearly visible both streaking across the surface and exposed in cross-section on the freshly scooped face"** plus **"dense velvety two-tone texture."** Naming both places gives the ribbon two chances to render.
2. **Maximize color contrast — this is the #1 swirl-killer.** A deep/saturated swirl on a pale base pops (deep red jam on ivory cream cheese). Low-contrast pairings barely read: golden passion fruit on white vanilla, **tan almond/peanut butter on green matcha**, white marshmallow on vanilla, **golden caramel on pale ivory froyo** (drizzles on the crown instead of marbling — the classic caramel failure). When the swirl is naturally close to the base, **push it darker/richer** — e.g. render almond butter as "rich golden-brown caramelized almond butter," passion fruit as "vivid deep golden-orange," **caramel as "deep dark amber caramel"** (proven fix for salted-caramel froyo: dark amber marbles through the body, plain golden just drizzles). If it can't be pushed, expect a weak swirl.
3. **Use bold marbling verbs, not gentle ones.** "boldly marbled," "thick distinct ribbons," "unmistakable two-tone swirl" — never "subtle," "hint of," or "delicate."

Template that works:
```
side angle of [pale base] ice cream in a white ceramic bowl, boldly marbled with thick distinct ribbons of [vivid, deep, saturated swirl color] — the swirl clearly visible both streaking across the surface and exposed in cross-section on the freshly scooped face, dense velvety two-tone texture, [props] beside the bowl, soft natural light from the left, [aesthetic], shallow depth of field, food photography --ar 4:3 --v 6.1 --style raw
```
Reference (rendered well): *side angle of pale ivory cream cheese ice cream in a white ceramic bowl, thick ribbons of deep red strawberry jam swirled throughout, dense velvety freshly scooped texture, clean scoop ridges showing the jam ribbons in cross-section, fresh strawberries and a block of cream cheese as props beside the bowl, soft natural light from the left, frozen strawberry cheesecake aesthetic, shallow depth of field, food photography*

**Avoid:** single closed scoops, overhead "marbled tub" framings, "subtle/delicate swirl" wording, and low-contrast base/swirl color pairings — all hide the ribbon.

### Toppings (`group_name: topping`)
On top of the scoop, not mixed in:
- Drizzles (caramel, chocolate, cream cheese frosting)
- Whipped cream, fresh fruit, sprinkles
- Whole nuts, cookie crumbles

> ⚠️ Only a handful of recipes itemize toppings as `group_name: topping` rows — most garnishes are described only in the recipe **title/description/body**. Always read the description for garnish and styling cues, not just the ingredients table.

## Base Type → Texture & Presentation

The recipe's `base_type` field (matches `churn_program`) sets the overall look. **Match it or the image will be wrong** — e.g. a sorbet rendered as fluffy creamy scoops, a milkshake rendered as a bowl, or an Italian ice rendered smooth instead of crystalline. The eight real base types and how to render each:

| `base_type` | How to render it |
|---|---|
| **Ice Cream** | Classic creamy, smooth, scoopable. Rounded scoops in a white ceramic bowl. The default. |
| **Lite Ice Cream** | Visually identical to ice cream (it's protein/low-cal) — creamy scoops. Do **not** imply a thin or "diet" look. |
| **Gelato** | Denser and silkier than ice cream, glossier, less air. Render as dense, slightly flattened scoops or a smooth spade-swept surface; Italian styling suits it. |
| **Frozen Yogurt** | Creamy but a touch softer and glossier, bright/fresh feel. **Scoops only** — never a piped soft-serve swirl; Creami froyo is spun in a pint and scooped, it doesn't pipe. Loanword "Frozen Yogurt" is fine in any locale. |
| **Sorbet** | Dairy-free, **dense and smooth** with vivid saturated fruit color, slightly glossy/wet look. Scoops in a bowl or glass with fresh fruit. **Not** crystalline, not airy. |
| **Italian Ice** | **Coarse, crystalline, granita-like shaved-ice** — NOT creamy. Often a clear glass cup; icy crystals catching the light, condensation. |
| **Milkshake** | Drinkable and thick. Serve in a **tall glass with a straw**, usually whipped cream on top and maybe a drizzle. Never a scoop in a bowl. |
| **Smoothie Bowl** | Thick smoothie base in a **wide shallow bowl**, surface artfully arranged with toppings (sliced fruit, granola, chia/seeds, coconut, nuts) in neat rows. Spoon, bright healthy styling. Not a scoop. |

## Prompt Structure

```
[shot type] of [ice cream description with correct color/texture], [mix-in appearance], [topping if any], [bowl/cone/setting], [lighting], [photography style], --ar 4:3 --v 6.1 --style raw
```

## Standard Settings
- **Aspect ratio** — depends on where the image is used:
  - **Recipe hero images**: `--ar 4:3` → delivered at 800x600, `public/images/recipes/<slug>.avif`
  - **Blog featured images**: `--ar 16:9` → delivered at 1200x675, `public/images/blog/<slug>.avif`
- **Version**: do NOT pin `--v 6.1` — omit the version flag and use the current default. Newer versions have better prompt adherence (mix-in distribution especially). Older templates in this doc still show `--v 6.1`; drop it when using them.
- **Style**: `--style raw` for realistic food photography
- **Negatives**: `--no melting, drips, glossy sheen, syrup` when a render comes back wet/melty — the `--no` parameter works; negations written in prose ("no melting") do not
- **Quality**: default (no `--q` flag needed)
- **Format**: always deliver final as AVIF (project standard). After generating, downscale to the target size and convert to `.avif`.

> Note: blog roundup posts (multiple recipes) look best as a festive overhead *spread* in 16:9, with each treat showing its correct color/texture per the base/mix-in rules above. Single-recipe posts can use a single hero scoop.

## Shot Types
- `overhead shot` — best for bowls with visible toppings
- `45-degree angle` — best for scoops showing interior texture
- `side angle` — best for showing layers or swirls
- `close-up` — best for texture detail

## Lighting
- `soft natural light from the left` — standard, warm feel
- `bright natural daylight` — fresh/summer recipes
- `warm golden hour light` — cozy/fall/winter recipes

## Common Descriptors
- **Texture**: creamy, smooth, velvety, dense, airy, fluffy
- **Surface**: freshly scooped, slightly melted edge, frost crystals
- **Bowl**: white ceramic bowl, waffle cone, glass dish

## Examples

### Carrot Cake Ice Cream
Base: milk, cream, carrots, sugar, cinnamon, cream cheese (all cooked and blended)
Mix-ins: toasted walnuts, shredded coconut, golden raisins
Toppings: cream cheese frosting drizzle

```
45-degree angle of a scoop of smooth orange-tinted ice cream in a white ceramic bowl, visible pieces of toasted walnuts and shredded coconut and golden raisins throughout, cream cheese frosting drizzle on top, warm spiced autumn feel, soft natural light from the left, shallow depth of field, food photography --ar 4:3 --v 6.1 --style raw
```

### Mint Chocolate Chip Ice Cream
Base: cream, milk, sugar, peppermint extract, green food coloring
Mix-ins: mini chocolate chips

```
overhead shot of pale green mint ice cream in a white ceramic bowl, small dark chocolate chip pieces scattered throughout, freshly scooped texture, clean spring aesthetic, bright natural daylight, food photography --ar 4:3 --v 6.1 --style raw
```

### Strawberry Vanilla Swirl Soft Serve
Base: cream, milk, sugar, vanilla pudding mix
Mix-in (swirl): strawberry puree

```
side angle of soft serve in a waffle cone, white vanilla soft serve with pink strawberry puree ribbons swirled throughout, slightly melted drip, pastel spring setting, soft natural light from the left, food photography --ar 4:3 --v 6.1 --style raw
```

### Coffee Soft Serve
Base: milk, cream, sugar, espresso powder, vanilla (all blended)
No mix-ins

```
45-degree angle of smooth coffee-brown soft serve in a white ceramic bowl, uniform rich brown color, creamy velvety texture, no visible chunks, dark roast coffee beans as prop beside bowl, soft natural light from the left, food photography --ar 4:3 --v 6.1 --style raw
```
