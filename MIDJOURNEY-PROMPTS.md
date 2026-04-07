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

### Mix-Ins (added after first spin via Mix-In function)
Mix-ins are folded in after the initial processing. Their appearance depends on their texture:

**Chunky mix-ins** → visible pieces distributed throughout:
- Chocolate chips, chopped nuts, cookie pieces, candy pieces
- Crushed Oreos, graham cracker crumbs, toffee bits
- Freeze-dried fruit pieces

**Liquid/soft mix-ins** → ribbons or swirls throughout:
- Caramel sauce, chocolate sauce, fruit jam/preserves
- Peanut butter (when used as mix-in, not base)
- Lemon curd, Nutella, marshmallow fluff
- Fruit purees (when swirled in, not blended into base)

### Toppings (on top, not mixed in)
Some recipes suggest toppings for serving. These sit on top of the scoop:
- Drizzles (caramel, chocolate, cream cheese frosting)
- Whipped cream, fresh fruit, sprinkles
- Whole nuts, cookie crumbles

## Prompt Structure

```
[shot type] of [ice cream description with correct color/texture], [mix-in appearance], [topping if any], [bowl/cone/setting], [lighting], [photography style], --ar 4:3 --v 6.1 --style raw
```

## Standard Settings
- **Aspect ratio**: `--ar 4:3` (matches our 800x600 hero images)
- **Version**: `--v 6.1` (or latest)
- **Style**: `--style raw` for realistic food photography
- **Quality**: default (no `--q` flag needed)

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
