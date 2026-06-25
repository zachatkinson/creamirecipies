/**
 * Resize + convert a source image into the project's responsive AVIF variant set.
 *
 * Blog featured images are 16:9 (1200x675); recipe heroes are 4:3 (800x600).
 * Both ship three variants: full, -768w, and -384w.
 *
 * Usage:
 *   npx tsx scripts/optimize-hero-image.ts <inputPath> <blog|recipe> <slug>
 *
 * Example:
 *   npx tsx scripts/optimize-hero-image.ts cinco.png blog cinco-de-mayo-mexican-inspired-frozen-treats
 *
 * Output: public/images/<blog|recipes>/<slug>{,-768w,-384w}.avif
 * Prints the hero_image_url path to set on the post (for blog, pass to set-post-hero.ts).
 */

import sharp from 'sharp';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

type Kind = 'blog' | 'recipe';

const VARIANTS: Record<Kind, { dir: string; sizes: Array<{ suffix: string; w: number; h: number }> }> = {
  blog: {
    dir: 'public/images/blog',
    sizes: [
      { suffix: '', w: 1200, h: 675 },
      { suffix: '-768w', w: 768, h: 432 },
      { suffix: '-384w', w: 384, h: 216 },
    ],
  },
  recipe: {
    dir: 'public/images/recipes',
    sizes: [
      { suffix: '', w: 800, h: 600 },
      { suffix: '-768w', w: 768, h: 576 },
      { suffix: '-384w', w: 384, h: 288 },
    ],
  },
};

const [input, kindArg, slug] = process.argv.slice(2);
if (!input || !kindArg || !slug) {
  console.error('Usage: optimize-hero-image.ts <inputPath> <blog|recipe> <slug>');
  process.exit(1);
}
if (kindArg !== 'blog' && kindArg !== 'recipe') {
  console.error(`Invalid type "${kindArg}" — must be "blog" or "recipe"`);
  process.exit(1);
}
const kind: Kind = kindArg;
if (!existsSync(input)) {
  console.error(`Input not found: ${input}`);
  process.exit(1);
}

(async () => {
  const cfg = VARIANTS[kind];
  if (!existsSync(cfg.dir)) mkdirSync(cfg.dir, { recursive: true });

  const meta = await sharp(input).metadata();
  console.log(`Source: ${input} (${meta.width}x${meta.height})`);

  for (const { suffix, w, h } of cfg.sizes) {
    const out = join(cfg.dir, `${slug}${suffix}.avif`);
    await sharp(input)
      .resize(w, h, { fit: 'cover', position: 'attention' })
      .avif({ quality: 55, effort: 6 })
      .toFile(out);
    const written = await sharp(out).metadata();
    console.log(`  wrote ${out} (${written.width}x${written.height})`);
  }

  const heroUrl = `/images/${kind === 'blog' ? 'blog' : 'recipes'}/${slug}.avif`;
  console.log(`\nhero_image_url: ${heroUrl}`);
  if (kind === 'blog') {
    console.log(`Next: npx tsx scripts/set-post-hero.ts ${slug} ${heroUrl}`);
  }
})();
