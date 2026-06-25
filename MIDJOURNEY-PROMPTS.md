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

### Swirls (`group_name: swirl`)
Soft/liquid components rippled through the base → **ribbons or swirls, never chunks**:
- Caramel sauce, chocolate sauce, fruit jam/preserves
- Peanut butter (as a swirl, not the base), lemon curd, Nutella, marshmallow fluff
- Fruit purees swirled in (as opposed to blended into the base)

#### ⭐ Proven swirl formula (IMPORTANT — read before writing any swirl prompt)
MidJourney hides swirls inside a single smooth scoop, and renders "marbled tub" framings weakly. Two things make a swirl read clearly every time:

1. **Show the cut interior.** Use a `side angle` and the exact phrase **"clean scoop ridges showing the [X] ribbons in cross-section"** plus **"dense velvety freshly scooped texture."** The scoop ridges expose the ribbon — a closed scoop or overhead tub does not.
2. **Maximize color contrast.** A deep/saturated swirl on a pale base pops (deep red jam on ivory cream cheese). A low-contrast pairing (golden passion fruit on white vanilla) barely reads — so push the swirl color darker/more saturated to compensate (e.g. "vivid deep golden-orange").

Template that works:
```
side angle of [pale base] ice cream in a white ceramic bowl, thick ribbons of [vivid, deep, saturated swirl color] swirled throughout, dense velvety freshly scooped texture, clean scoop ridges showing the [swirl] ribbons in cross-section, [props] beside the bowl, soft natural light from the left, [aesthetic], shallow depth of field, food photography --ar 4:3 --v 6.1 --style raw
```
Reference (rendered well): *side angle of pale ivory cream cheese ice cream in a white ceramic bowl, thick ribbons of deep red strawberry jam swirled throughout, dense velvety freshly scooped texture, clean scoop ridges showing the jam ribbons in cross-section, fresh strawberries and a block of cream cheese as props beside the bowl, soft natural light from the left, frozen strawberry cheesecake aesthetic, shallow depth of field, food photography*

**Avoid:** single closed scoops, overhead "marbled tub" framings, and low-contrast base/swirl color pairings — all three hide the ribbon.

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
| **Frozen Yogurt** | Creamy but a touch softer and glossier, bright/fresh feel. Scoops or a soft swirl. Loanword "Frozen Yogurt" is fine in any locale. |
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
- **Version**: `--v 6.1` (or latest)
- **Style**: `--style raw` for realistic food photography
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
