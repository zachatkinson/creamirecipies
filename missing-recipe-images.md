# Missing Recipe Featured Images

12 published recipes need hero images. Generate each in Midjourney, export as PNG, then convert to AVIF at 800w (base), 768w, and 384w variants.

| Recipe Title | Midjourney Prompt | Filename |
|---|---|---|
| Apple Pie Protein Ice Cream | Overhead photo of a creamy scoop of apple pie ice cream in a white ceramic bowl, visible cinnamon swirl and diced caramelized apple chunks folded through, crumbled golden pie crust topping, warm autumn light, shallow depth of field, food photography, 4:3 aspect ratio --ar 4:3 --style raw --s 200 --q 2 | apple-pie-protein-ice-cream.avif |
| Apricot Sorbet | Close-up of a vibrant orange apricot sorbet scoop on a rustic stoneware plate, fresh halved apricot beside it showing the pit cavity, tiny mint leaf garnish, soft diffused natural daylight, condensation droplets on the plate, editorial food photography, 4:3 aspect ratio --ar 4:3 --style raw --s 200 --q 2 | apricot-sorbet.avif |
| Banana Pudding Ice Cream | Top-down shot of two generous scoops of banana pudding ice cream in a vintage glass dessert dish, layered with crumbled vanilla wafer cookies and fresh banana slices, drizzle of caramel, nostalgic Southern dessert aesthetic, warm golden hour lighting, food photography, 4:3 aspect ratio --ar 4:3 --style raw --s 200 --q 2 | banana-pudding-ice-cream.avif |
| Apple Butter Ice Cream | A single elegant scoop of deep amber apple butter ice cream in a handmade ceramic bowl, swirl of dark apple butter ribbon visible through the cross-section, cinnamon stick and star anise as props on a wooden cutting board, moody autumn styling, food photography, 4:3 aspect ratio --ar 4:3 --style raw --s 200 --q 2 | apple-butter-ice-cream.avif |
| Banana Cream Protein Ice Cream | Two scoops of pale yellow banana cream ice cream in a modern matte black bowl, topped with fresh banana coin slices and a light dusting of graham cracker crumbs, clean minimalist background, bright airy studio lighting, commercial food photography, 4:3 aspect ratio --ar 4:3 --style raw --s 200 --q 2 | banana-cream-protein-ice-cream.avif |
| Avocado Ice Cream | A striking scoop of pale green avocado ice cream in a coconut shell bowl, creamy smooth texture with a lime wedge garnish, tropical leaf underneath as styling prop, bright natural light with soft shadows, unique and appetizing color, editorial food photography, 4:3 aspect ratio --ar 4:3 --style raw --s 200 --q 2 | avocado-ice-cream.avif |
| Banana Coconut Sorbet | Beautiful scoop of banana coconut sorbet on a tropical wooden plate, toasted coconut flakes scattered on top, thin banana chip garnish, lush green palm leaf as background prop, bright Caribbean-inspired natural lighting, refreshing summer vibe, food photography, 4:3 aspect ratio --ar 4:3 --style raw --s 200 --q 2 | banana-coconut-sorbet.avif |
| Apricot Swirl Ice Cream | Side-angle shot of apricot swirl ice cream in a glass parfait dish, dramatic orange-gold apricot ribbon swirled through creamy vanilla base, fresh apricot wedge on the rim, linen napkin underneath, soft window light creating gentle highlights, food photography, 4:3 aspect ratio --ar 4:3 --style raw --s 200 --q 2 | apricot-swirl-ice-cream.avif |
| Banana Split Ice Cream | Indulgent banana split ice cream scoop in a classic elongated banana split dish, three colorful scoops with chocolate drizzle strawberry sauce and crushed peanuts, maraschino cherry on top, whipped cream, retro diner aesthetic with checkered background, vibrant and fun, food photography, 4:3 aspect ratio --ar 4:3 --style raw --s 200 --q 2 | banana-split-ice-cream.avif |
| Bananas Foster Ice Cream | Dramatic shot of bananas foster ice cream with a caramelized banana half on top, rich amber caramel sauce pooling around the scoop, hint of blue flame for the flambé effect, dark moody background, copper pan as prop, luxurious restaurant-style plating, food photography, 4:3 aspect ratio --ar 4:3 --style raw --s 200 --q 2 | bananas-foster-ice-cream.avif |
| Banana Walnut Frozen Yogurt | Wholesome scoop of banana walnut frozen yogurt in a speckled ceramic bowl, generous toasted walnut pieces on top and folded through, drizzle of raw honey, rustic wooden table surface, warm morning light from a side window, cozy and inviting, food photography, 4:3 aspect ratio --ar 4:3 --style raw --s 200 --q 2 | banana-walnut-frozen-yogurt.avif |
| Banana Split Frozen Yogurt | Colorful banana split frozen yogurt served in a waffle bowl, rainbow of toppings including strawberry sauce chocolate chips rainbow sprinkles and a dollop of whipped cream, sliced banana framing the bowl, bright cheerful pop-art inspired lighting, playful and eye-catching, food photography, 4:3 aspect ratio --ar 4:3 --style raw --s 200 --q 2 | banana-split-frozen-yogurt.avif |

## Post-generation workflow

```bash
# 1. Convert and resize all PNGs to AVIF variants
for img in *.png; do
  slug="${img%.png}"
  # Base (800w)
  npx sharp-cli -i "$img" -o "public/images/recipes/${slug}.avif" resize 800 600 --fit cover --format avif --quality 70
  # 768w
  npx sharp-cli -i "$img" -o "public/images/recipes/${slug}-768w.avif" resize 768 576 --fit cover --format avif --quality 70
  # 384w
  npx sharp-cli -i "$img" -o "public/images/recipes/${slug}-384w.avif" resize 384 288 --fit cover --format avif --quality 70
done

# 2. Update hero_image_url in Supabase for each recipe
# (run after images are in public/images/recipes/)
```
