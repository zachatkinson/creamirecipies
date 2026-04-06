/**
 * Generate Midjourney prompts for recipes and blog posts missing hero images.
 * Outputs markdown tables to missing-draft-recipe-images.md and missing-blog-images.md
 *
 * Run with:
 *   source .env && export PUBLIC_SUPABASE_URL SUPABASE_SERVICE_ROLE_KEY && npx tsx scripts/generate-image-prompts.ts
 */

import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing env vars');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// --- Prompt generation helpers ---

/** Style/prop keywords keyed by ingredient or flavor cue found in title */
const FLAVOR_STYLING: Record<string, { color: string; props: string; texture: string }> = {
  // Fruits
  strawberry: { color: 'vibrant pink-red', props: 'fresh halved strawberry garnish', texture: 'smooth with visible fruit pieces' },
  mango: { color: 'bright golden orange', props: 'fresh mango slice and tropical leaf', texture: 'silky smooth tropical' },
  blueberry: { color: 'deep indigo-purple', props: 'scattered fresh blueberries', texture: 'creamy with berry swirl' },
  raspberry: { color: 'ruby red-pink', props: 'fresh raspberries and a mint sprig', texture: 'creamy with seed-flecked ripple' },
  blackberry: { color: 'dark purple-black', props: 'fresh blackberries on a slate board', texture: 'rich with dark fruit swirl' },
  cherry: { color: 'deep crimson red', props: 'fresh cherries with stems', texture: 'smooth with cherry ribbon' },
  peach: { color: 'soft coral-peach', props: 'fresh peach wedge', texture: 'velvety smooth' },
  banana: { color: 'pale creamy yellow', props: 'banana coin slices', texture: 'dense and creamy' },
  lemon: { color: 'bright sunny yellow', props: 'lemon zest curls and a lemon wedge', texture: 'smooth and glossy' },
  lime: { color: 'vibrant green-citrus', props: 'lime wheel and zest', texture: 'bright and refreshing looking' },
  coconut: { color: 'creamy white', props: 'toasted coconut flakes and coconut shell', texture: 'fluffy with shredded coconut' },
  pineapple: { color: 'golden yellow', props: 'pineapple wedge and tropical flowers', texture: 'icy and refreshing' },
  watermelon: { color: 'bright pink-red', props: 'watermelon triangle slice', texture: 'icy crystalline' },
  apple: { color: 'warm golden-amber', props: 'thin apple slices and cinnamon stick', texture: 'smooth with spiced chunks' },
  pear: { color: 'pale golden green', props: 'thin pear fan slice', texture: 'delicate and smooth' },
  fig: { color: 'deep purple-brown', props: 'halved fresh fig showing seeds', texture: 'jammy with visible fruit' },
  apricot: { color: 'warm peach-orange', props: 'fresh apricot halves', texture: 'silky with fruit swirl' },
  cranberry: { color: 'deep garnet red', props: 'scattered fresh cranberries', texture: 'tart and jewel-toned' },
  kiwi: { color: 'bright emerald green', props: 'kiwi slices showing seeds', texture: 'refreshing with tiny seeds' },
  passion: { color: 'vibrant orange-yellow', props: 'halved passion fruit showing pulp', texture: 'tropical and seedy' },
  acai: { color: 'deep purple', props: 'granola and fresh berries on top', texture: 'thick smoothie bowl consistency' },
  guava: { color: 'pink-salmon', props: 'sliced guava showing pink flesh', texture: 'smooth and tropical' },
  pomegranate: { color: 'ruby red', props: 'pomegranate arils scattered', texture: 'jeweled and glossy' },
  rhubarb: { color: 'pink-red streaked', props: 'rhubarb stalk piece', texture: 'tangy swirl through cream' },
  plum: { color: 'deep purple-magenta', props: 'sliced plum showing golden flesh', texture: 'smooth with fruit ripple' },
  grape: { color: 'deep purple', props: 'small grape cluster', texture: 'smooth and rich' },
  lychee: { color: 'translucent pale pink', props: 'peeled lychee fruit', texture: 'delicate and floral' },

  // Chocolate & sweets
  chocolate: { color: 'rich dark brown', props: 'chocolate shavings and cocoa dust', texture: 'velvety fudgy' },
  'dark chocolate': { color: 'deep espresso brown', props: 'dark chocolate shards and cocoa nibs', texture: 'intensely rich and glossy' },
  'white chocolate': { color: 'ivory cream', props: 'white chocolate curls', texture: 'ultra smooth and pale' },
  brownie: { color: 'deep chocolate brown', props: 'brownie chunks and chocolate drizzle', texture: 'chunky with fudgy pieces' },
  fudge: { color: 'dark glossy brown', props: 'fudge sauce drizzle', texture: 'thick and indulgent' },
  caramel: { color: 'golden amber', props: 'caramel sauce drizzle and flaky sea salt', texture: 'ribboned with golden swirl' },
  butterscotch: { color: 'warm amber-gold', props: 'butterscotch sauce pool', texture: 'smooth buttery swirl' },
  toffee: { color: 'deep amber', props: 'toffee bits scattered', texture: 'crunchy bits through cream' },

  // Nuts
  pistachio: { color: 'pale sage green', props: 'crushed pistachios and whole pistachios in shell', texture: 'speckled green with nut pieces' },
  almond: { color: 'creamy off-white', props: 'slivered toasted almonds', texture: 'smooth with almond pieces' },
  pecan: { color: 'warm brown', props: 'candied pecan halves', texture: 'buttery with nut chunks' },
  walnut: { color: 'warm tan-brown', props: 'walnut halves', texture: 'textured with nut pieces' },
  hazelnut: { color: 'warm golden brown', props: 'whole hazelnuts and Nutella swirl', texture: 'rich praline swirl' },
  'peanut butter': { color: 'tan-golden', props: 'peanut butter swirl and chopped peanuts', texture: 'ribboned with thick PB swirl' },
  macadamia: { color: 'pale cream', props: 'halved macadamia nuts', texture: 'buttery smooth with nut pieces' },

  // Spices & aromatics
  cinnamon: { color: 'warm spiced tan', props: 'cinnamon sticks and ground cinnamon dust', texture: 'warmly spiced' },
  ginger: { color: 'warm golden', props: 'crystallized ginger pieces', texture: 'smooth with spiced warmth' },
  vanilla: { color: 'creamy ivory-white', props: 'vanilla bean pod split open showing seeds', texture: 'classic smooth with vanilla bean specks' },
  lavender: { color: 'pale purple-lilac', props: 'dried lavender sprigs', texture: 'elegant and floral' },
  matcha: { color: 'vibrant moss green', props: 'matcha powder dusted on top with bamboo whisk', texture: 'smooth and earthy' },
  'earl grey': { color: 'pale amber-grey', props: 'loose tea leaves and bergamot', texture: 'delicate and aromatic' },
  rose: { color: 'pale blush pink', props: 'dried rose petals', texture: 'elegant and perfumed' },
  saffron: { color: 'golden-orange', props: 'saffron threads', texture: 'luxurious and exotic' },
  turmeric: { color: 'bright golden yellow', props: 'turmeric root slice', texture: 'earthy and vibrant' },
  cardamom: { color: 'pale green-cream', props: 'cardamom pods', texture: 'aromatic and complex' },
  hibiscus: { color: 'deep magenta-pink', props: 'dried hibiscus flowers', texture: 'tart and floral' },
  jasmine: { color: 'pale cream-white', props: 'jasmine flowers', texture: 'delicate and fragrant' },

  // Coffee & tea
  coffee: { color: 'rich mocha brown', props: 'espresso beans and a tiny espresso cup', texture: 'smooth with coffee swirl' },
  espresso: { color: 'deep dark brown', props: 'espresso beans scattered', texture: 'intense and bold' },
  mocha: { color: 'chocolate-coffee brown', props: 'chocolate sauce and espresso beans', texture: 'marbled chocolate and coffee' },
  tiramisu: { color: 'layered cream and coffee', props: 'cocoa powder dusting and ladyfinger cookie', texture: 'layered mascarpone' },

  // Holiday & seasonal
  peppermint: { color: 'white with red swirl', props: 'crushed candy cane and peppermint stick', texture: 'cool minty with red ribbons' },
  'candy cane': { color: 'red and white striped', props: 'candy cane pieces', texture: 'festive striped swirl' },
  gingerbread: { color: 'warm spiced brown', props: 'mini gingerbread man cookie', texture: 'warmly spiced with cookie pieces' },
  eggnog: { color: 'rich cream-yellow', props: 'freshly grated nutmeg on top', texture: 'thick and custard-like' },
  pumpkin: { color: 'warm orange', props: 'mini pumpkin and cinnamon sticks', texture: 'smooth and spiced' },

  // Cookies & cakes
  'cookie dough': { color: 'tan with dark chips', props: 'raw cookie dough balls and chocolate chips', texture: 'chunky with dough pieces' },
  oreo: { color: 'cream with black cookie', props: 'Oreo cookie pieces and whole Oreo', texture: 'cookies and cream speckled' },
  'cookies and cream': { color: 'cream with black specks', props: 'crushed chocolate sandwich cookies', texture: 'speckled black and white' },
  cheesecake: { color: 'pale cream-white', props: 'graham cracker crumbs and berry sauce', texture: 'dense and tangy' },
  'birthday cake': { color: 'pastel with rainbow sprinkles', props: 'rainbow sprinkles and confetti', texture: 'funfetti-speckled' },
  funfetti: { color: 'vanilla with rainbow', props: 'rainbow jimmies and sprinkles', texture: 'celebration confetti throughout' },
  'red velvet': { color: 'deep red', props: 'cream cheese frosting swirl', texture: 'velvety with white cream swirl' },

  // Other
  mint: { color: 'cool pale green', props: 'fresh mint leaves', texture: 'refreshing and cool' },
  honey: { color: 'warm golden amber', props: 'honey dipper with dripping honey', texture: 'smooth and glistening' },
  maple: { color: 'warm amber-brown', props: 'maple syrup drizzle and maple leaf', texture: 'rich autumn warmth' },
  dulce: { color: 'deep caramel-gold', props: 'dulce de leche sauce swirl', texture: 'thick ribboned caramel' },
  tahini: { color: 'pale tan', props: 'sesame seeds scattered', texture: 'nutty and smooth' },
  'cream cheese': { color: 'bright white-cream', props: 'cream cheese swirl', texture: 'tangy and dense' },
};

const BASE_TYPE_STYLES: Record<string, { vessel: string; angle: string }> = {
  'Ice Cream': { vessel: 'in a ceramic bowl', angle: 'Overhead photo' },
  'Gelato': { vessel: 'in an elegant glass coupe', angle: 'Side-angle shot' },
  'Sorbet': { vessel: 'on a rustic stoneware plate', angle: 'Close-up' },
  'Frozen Yogurt': { vessel: 'in a modern white bowl', angle: '45-degree angle photo' },
  'Italian Ice': { vessel: 'in a clear glass cup', angle: 'Close-up' },
  'Milkshake': { vessel: 'in a tall frosted glass with a striped straw', angle: 'Straight-on shot' },
  'Smoothie Bowl': { vessel: 'in a coconut shell bowl', angle: 'Flat-lay overhead photo' },
  'Lite Ice Cream': { vessel: 'in a minimalist white ramekin', angle: 'Clean overhead photo' },
  'Protein Ice Cream': { vessel: 'in a sleek modern bowl', angle: '45-degree angle photo' },
  'Soft Serve': { vessel: 'swirled tall on a waffle cone', angle: 'Straight-on shot' },
};

const LIGHTING_OPTIONS = [
  'soft natural window light with gentle shadows',
  'warm golden hour sunlight from the side',
  'bright airy studio lighting with white reflector',
  'moody dramatic side-lighting with dark background',
  'diffused overcast natural daylight',
  'warm afternoon backlight creating a glow',
];

function getFlavorProfile(title: string): { color: string; props: string; texture: string } {
  const lower = title.toLowerCase();

  // Check multi-word keys first (longest match wins)
  const sortedKeys = Object.keys(FLAVOR_STYLING).sort((a, b) => b.length - a.length);
  const matches: { color: string; props: string; texture: string }[] = [];

  for (const key of sortedKeys) {
    if (lower.includes(key)) {
      matches.push(FLAVOR_STYLING[key]);
      if (matches.length >= 2) break; // Take top 2 flavor matches
    }
  }

  if (matches.length === 0) {
    return { color: 'appetizing natural', props: 'elegant garnish', texture: 'creamy and smooth' };
  }

  if (matches.length === 1) return matches[0];

  // Combine two flavor profiles
  return {
    color: matches[0].color,
    props: `${matches[0].props}, ${matches[1].props}`,
    texture: matches[0].texture,
  };
}

function generateRecipePrompt(title: string, baseType: string): string {
  const flavor = getFlavorProfile(title);
  const style = BASE_TYPE_STYLES[baseType] ?? BASE_TYPE_STYLES['Ice Cream'];
  const lighting = LIGHTING_OPTIONS[Math.floor(hashCode(title) % LIGHTING_OPTIONS.length)];

  const isMillshake = baseType === 'Milkshake';
  const isSmoothieBowl = baseType === 'Smoothie Bowl';
  const isSoftServe = baseType === 'Soft Serve';

  let scoopDesc: string;
  if (isMillshake) {
    scoopDesc = `a thick creamy ${title} ${style.vessel}, ${flavor.color} color, topped with whipped cream and ${flavor.props}`;
  } else if (isSmoothieBowl) {
    scoopDesc = `a beautiful ${title} ${style.vessel}, ${flavor.color} base topped with ${flavor.props} and granola`;
  } else if (isSoftServe) {
    scoopDesc = `a tall perfect swirl of ${flavor.color} ${title} ${style.vessel}, ${flavor.props}`;
  } else {
    scoopDesc = `a generous scoop of ${flavor.color} ${title} ${style.vessel}, ${flavor.texture} texture, ${flavor.props}`;
  }

  return `${style.angle} of ${scoopDesc}, ${lighting}, editorial food photography, 4:3 aspect ratio --ar 4:3 --style raw --s 200 --q 2`;
}

function generateBlogPrompt(title: string, slug: string): string {
  const lower = title.toLowerCase();

  // Categorize blog post type
  if (lower.includes('review') || lower.includes('vs') || lower.includes('comparing') || lower.includes('which')) {
    const reviewScenes: Record<string, string> = {
      'breeze': 'Ninja Creami Breeze machine on a clean white countertop with a freshly made pint of ice cream beside it, budget-friendly kitchen setting',
      'scoop & swirl': 'Ninja Creami Scoop & Swirl machine with the soft serve attachment in action, perfect swirl on a cone, modern kitchen',
      'xl deluxe': 'Ninja Creami XL Deluxe 11-in-1 machine prominently displayed with multiple pint sizes, premium kitchen setting',
      'original vs deluxe': 'two Ninja Creami models side by side on a counter, original and deluxe, comparison layout with labels',
      'comparing all': 'full lineup of Ninja Creami models arranged in a row on a long counter, each with a finished pint, showroom-style product display',
      'traditional': 'Ninja Creami next to a traditional ice cream maker, side-by-side comparison, modern vs classic contrast',
      'cookbook': 'stack of Ninja Creami cookbooks fanned out on a kitchen counter with bookmarks, reading and cooking scene',
      'pint': 'collection of different pint containers and storage lids arranged neatly, product comparison flat-lay',
      'chocolate chip': 'various sugar-free chocolate chip brands arranged on marble with sample bowls, ingredient comparison flat-lay',
      'coconut': 'different coconut milk brands lined up with poured samples in glasses, ingredient comparison',
      'worth it': 'Ninja Creami machine hero shot on a beautiful kitchen counter with an array of homemade frozen treats around it, aspirational lifestyle',
    };

    let scene = 'Ninja Creami machine on a marble countertop with fresh ingredients arranged around it, modern kitchen setting';
    for (const [key, val] of Object.entries(reviewScenes)) {
      if (lower.includes(key)) { scene = val; break; }
    }

    return `Clean product photography, ${scene}, bright airy studio lighting, editorial product photography, 16:9 aspect ratio --ar 16:9 --style raw --s 200 --q 2`;
  }

  if (lower.includes('how to') || lower.includes('guide') || lower.includes('tips') || lower.includes('troubleshoot') || lower.includes('understanding') || lower.includes('mastering') || lower.includes('the right way') || lower.includes('the science') || lower.includes('the re-spin') || lower.includes('why your') || lower.includes('why full') || lower.includes('the condensed') || lower.includes('the cream cheese') || lower.includes('the pudding') || lower.includes('pre-chill') || lower.includes('meal prep') || lower.includes('making ice cream')) {
    const howToScenes: Record<string, string> = {
      'clean': 'Ninja Creami being cleaned with warm soapy water, sparkling clean pint containers drying on a rack, tidy kitchen counter, bright clean aesthetic',
      'milkshake': 'thick creamy milkshake being poured from a Ninja Creami pint into a tall glass, whipped cream and cherry ready to top, retro diner styling',
      'sorbet': 'vibrant fruit sorbet being scooped from a Ninja Creami pint, fresh colorful fruits arranged around, bright refreshing summer feel',
      'gelato': 'silky smooth gelato being scooped from a Ninja Creami pint with an Italian-style spatula, elegant plating, warm European cafe atmosphere',
      'protein': 'fit lifestyle scene with protein ice cream in a bowl, protein powder scoop and shaker bottle nearby, gym bag in soft background, bright energetic lighting',
      'soft serve': 'perfect soft serve swirl from the Ninja Creami Scoop & Swirl attachment, waffle cone, bright cheerful lighting',
      'scoopable': 'perfect scoop of ice cream being lifted from a pint, showing ideal creamy stretchy texture, warm kitchen lighting',
      'sugar-free': 'sugar-free frozen treats with alternative sweeteners displayed on counter, monk fruit and allulose packages visible, healthy clean aesthetic',
      'dairy-free': 'plant-based milk cartons and coconut cream around a Ninja Creami, beautiful dairy-free ice cream scoop, fresh and inclusive styling',
      'frozen yogurt': 'creamy frozen yogurt swirled in a bowl with fresh fruit toppings, Greek yogurt container visible, bright and healthy aesthetic',
      'alcohol': 'cocktail-inspired frozen treats with small liquor bottles as props, elegant bar-style presentation on dark marble, sophisticated moody lighting',
      'layered': 'cross-section of a beautifully layered Ninja Creami pint showing distinct colorful flavor stripes, cut in half to reveal layers',
      'mix-in': 'Ninja Creami pint with mix-ins being folded in — chocolate chips, cookie pieces, and nuts mid-tumble, dynamic action shot',
      'popsicle': 'colorful homemade ice cream popsicles on a bed of crushed ice, various flavors with wooden sticks, bright playful summer styling',
      'sandwich': 'ice cream sandwiches with cookies on a cooling rack, ice cream filling visible from the side, rustic baking scene',
      'store': 'neatly organized freezer shelf with labeled Ninja Creami pints, storage lids on, organized home kitchen feel',
      'respin': 'Ninja Creami machine mid-process with the lid open showing ice cream texture, before and after comparison bowls',
      'convert': 'traditional recipe book open next to a Ninja Creami with adapted ingredients measured out, bridge between old and new',
      'create': 'creative kitchen workspace with recipe notebook, measuring cups with various ingredients, Ninja Creami ready to go, inspiring and creative atmosphere',
      'swirl': 'beautiful swirl being created in ice cream with a spoon, rich thick texture, satisfying visual of the perfect spiral',
      'party': 'ice cream party setup with Ninja Creami as centerpiece, multiple pints and toppings bar, festive fun atmosphere',
      'allergies': 'allergen-free frozen treats with clear labeling, nut-free and dairy-free options displayed, safe and inclusive presentation',
      'kids': 'colorful fun ice cream with sprinkles and toppings, child-friendly bright cheerful presentation, playful and whimsical',
      'one': 'single perfect serving of ice cream in a small ramekin, cozy solo treat moment, intimate warm lighting',
      'cake': 'stunning ice cream cake on a cake stand, layered with multiple flavors, decorated with toppings, celebration-ready',
      'smoothie': 'thick colorful smoothie bowl topped with artful fruit and granola arrangement, tropical vibes, bright morning light',
      'beginner': 'welcoming kitchen scene with a brand new Ninja Creami being unboxed, simple vanilla ingredients ready, approachable first-time feel',
      'first recipe': 'welcoming kitchen scene with simple vanilla ice cream ingredients measured out, step-by-step visual, warm encouraging atmosphere',
      'italian ice': 'vibrant colorful Italian ices in clear cups, lemon and cherry flavors, bright summer boardwalk feel',
      'keto': 'low-carb ice cream with keto-friendly ingredients displayed, avocado and coconut oil, clean modern health-conscious aesthetic',
      'vegan': 'beautiful plant-based ice cream with coconut and cashew milk, fresh fruits and nuts, earthy natural wholesome styling',
      'troubleshoot': 'close-up of Ninja Creami processing ice cream with perfect texture forming, problem-solving visual with clear results',
      'science': 'ice cream base in pint containers at different freeze stages, thermometer showing temperature, educational science-of-food aesthetic',
      'condensed': 'can of condensed milk being poured into a mixing bowl with cream, rich indulgent texture, warm kitchen light',
      'cream cheese': 'block of cream cheese being blended into ice cream base, rich and tangy, cozy baking aesthetic',
      'pudding': 'pudding mix being stirred into ice cream base with a whisk, creamy smooth texture forming, helpful tutorial feel',
      'pre-chill': 'pint containers in a freezer with timer nearby, organized prep scene, clean and methodical kitchen',
      'full-fat': 'rich whole milk and heavy cream being poured together, luxurious creamy texture, indulgent dairy showcase',
      'meal prep': 'multiple labeled Ninja Creami pints lined up ready for the freezer, organized weekly meal prep scene, efficient kitchen',
      'programs': 'Ninja Creami control panel close-up showing different program buttons, clean product detail shot',
      'extra spins': 'Ninja Creami in action processing a second spin, ice cream getting creamier with each pass, dynamic process shot',
    };

    let scene = 'Ninja Creami ice cream maker on a kitchen counter with freshly made frozen treat, ingredients and tools neatly arranged, warm inviting kitchen atmosphere';
    for (const [key, val] of Object.entries(howToScenes)) {
      if (lower.includes(key)) { scene = val; break; }
    }

    return `${scene}, lifestyle food photography, 16:9 aspect ratio --ar 16:9 --style raw --s 200 --q 2`;
  }

  if (lower.includes('holiday') || lower.includes('christmas') || lower.includes('halloween') || lower.includes('thanksgiving') || lower.includes('valentine') || lower.includes('4th of july') || lower.includes('memorial') || lower.includes('labor day') || lower.includes('father') || lower.includes('mother') || lower.includes('new year') || lower.includes('super bowl') || lower.includes('game day') || lower.includes('st. patrick') || lower.includes('cinco') || lower.includes('pi day') || lower.includes('teacher')) {
    // Holiday/event posts
    const holidayProps: Record<string, string> = {
      christmas: 'festive red and green decorations, candy canes, evergreen sprigs',
      halloween: 'orange and purple decorations, mini pumpkins, spooky fun styling',
      thanksgiving: 'autumn leaves, warm golden light, rustic harvest table',
      valentine: 'romantic pink and red roses, heart-shaped decorations',
      '4th of july': 'red white and blue patriotic decorations, sparklers, American flag bunting',
      'memorial': 'outdoor summer BBQ setting, patriotic colors, backyard party',
      'labor day': 'end of summer outdoor party, warm sunset lighting, poolside',
      father: 'classic masculine styling, leather and wood textures, whiskey glass',
      mother: 'elegant floral arrangement, soft pastel colors, brunch setting',
      'new year': 'champagne glasses, gold confetti, midnight celebration sparkle',
      'super bowl': 'sports party setting, team colors, game day snack spread',
      'game day': 'sports party setting, TV in background, casual fun atmosphere',
      'st. patrick': 'green decorations, shamrocks, Irish pub inspired',
      'cinco': 'vibrant Mexican fiesta colors, papel picado, fresh limes',
      'pi day': 'pie and ice cream pairing, mathematical symbols, playful nerdy styling',
      'teacher': 'apple and school supplies styling, gift wrapping, appreciation theme',
    };

    let props = 'festive seasonal decorations';
    for (const [key, val] of Object.entries(holidayProps)) {
      if (lower.includes(key)) { props = val; break; }
    }

    return `Beautiful spread of assorted Ninja Creami frozen desserts on a styled table, ${props}, multiple ice cream flavors in attractive bowls, warm inviting atmosphere, editorial food and lifestyle photography, 16:9 aspect ratio --ar 16:9 --style raw --s 200 --q 2`;
  }

  if (lower.includes('season') || lower.includes('spring') || lower.includes('summer') || lower.includes('fall') || lower.includes('winter')) {
    const seasonProps: Record<string, string> = {
      spring: 'fresh flowers, pastel colors, bright garden setting',
      summer: 'bright sunshine, tropical vibes, poolside outdoor setting',
      fall: 'warm autumn leaves, cozy knit textures, golden light',
      winter: 'cozy warm lighting, knit blanket, hot cocoa nearby',
    };
    let props = 'seasonal decorations and ingredients';
    for (const [key, val] of Object.entries(seasonProps)) {
      if (lower.includes(key)) { props = val; break; }
    }

    return `Stunning seasonal spread of Ninja Creami frozen desserts, ${props}, artfully styled with fresh seasonal ingredients, editorial food photography, 16:9 aspect ratio --ar 16:9 --style raw --s 200 --q 2`;
  }

  if (lower.includes('ingredient') || lower.includes('milk') || lower.includes('sugar') || lower.includes('sweetener') || lower.includes('protein') || lower.includes('yogurt') || lower.includes('condensed') || lower.includes('cream cheese') || lower.includes('pudding') || lower.includes('chocolate chip') || lower.includes('vanilla extract') || lower.includes('fruit') || lower.includes('allulose')) {
    return `Beautifully arranged ingredient flat-lay on a marble surface, fresh dairy and pantry ingredients for ice cream making, measuring cups and spoons, clean organized kitchen aesthetic, bright natural overhead lighting, editorial food photography, 16:9 aspect ratio --ar 16:9 --style raw --s 200 --q 2`;
  }

  if (lower.includes('top 10') || lower.includes('best') || lower.includes('popular') || lower.includes('ranked')) {
    return `Eye-catching grid arrangement of multiple colorful ice cream scoops in various flavors, each in its own small bowl, rainbow of flavors from chocolate to strawberry to mint, bright cheerful studio lighting, editorial food photography, 16:9 aspect ratio --ar 16:9 --style raw --s 200 --q 2`;
  }

  if (lower.includes('party') || lower.includes('hosting')) {
    return `Festive ice cream party spread on a beautiful table, multiple flavors in bowls with toppings bar, guests reaching for scoops, warm and inviting party atmosphere, lifestyle food photography, 16:9 aspect ratio --ar 16:9 --style raw --s 200 --q 2`;
  }

  if (lower.includes('kids') || lower.includes('fun')) {
    return `Colorful playful ice cream creation with rainbow sprinkles and fun toppings, child-friendly bright colors, whimsical styling, cheerful bright studio lighting, family lifestyle food photography, 16:9 aspect ratio --ar 16:9 --style raw --s 200 --q 2`;
  }

  // Generic fallback
  return `Appetizing Ninja Creami frozen dessert beautifully plated on a styled surface, fresh ingredients as props, modern kitchen background slightly blurred, warm natural lighting, professional editorial food photography, 16:9 aspect ratio --ar 16:9 --style raw --s 200 --q 2`;
}

/** Simple deterministic hash for consistent but varied lighting selection */
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// --- Main ---

async function main(): Promise<void> {
  // Fetch draft recipes without images
  console.log('Fetching draft recipes without hero images...');
  const { data: draftRecipes, error: recipeErr } = await supabase
    .from('recipes')
    .select('id, title, slug, base_type')
    .eq('status', 'draft')
    .not('scheduled_publish_at', 'is', null)
    .is('hero_image_url', null)
    .order('title', { ascending: true });

  if (recipeErr) {
    console.error('Recipe fetch error:', recipeErr.message);
    process.exit(1);
  }

  console.log(`Found ${draftRecipes!.length} draft recipes without images`);

  // Fetch blog posts without images
  console.log('Fetching blog posts without hero images...');
  const { data: blogPosts, error: blogErr } = await supabase
    .from('posts')
    .select('id, title, slug, status')
    .is('hero_image_url', null)
    .order('title', { ascending: true });

  if (blogErr) {
    console.error('Blog fetch error:', blogErr.message);
    process.exit(1);
  }

  console.log(`Found ${blogPosts!.length} blog posts without images`);

  // Generate recipe image table
  let recipeMd = `# Missing Draft Recipe Images\n\n`;
  recipeMd += `${draftRecipes!.length} scheduled draft recipes need hero images. Generate each in Midjourney, export as PNG, then convert to AVIF at 800w (base), 768w, and 384w variants.\n\n`;
  recipeMd += `| # | Recipe Title | Midjourney Prompt | Filename |\n`;
  recipeMd += `|---|---|---|---|\n`;

  for (let i = 0; i < draftRecipes!.length; i++) {
    const r = draftRecipes![i];
    const prompt = generateRecipePrompt(r.title, r.base_type);
    recipeMd += `| ${i + 1} | ${r.title} | ${prompt} | ${r.slug}.avif |\n`;
  }

  recipeMd += `\n## Post-generation workflow\n\n`;
  recipeMd += '```bash\n';
  recipeMd += `# Convert and resize all PNGs to AVIF variants\n`;
  recipeMd += `for img in *.png; do\n`;
  recipeMd += `  slug="\${img%.png}"\n`;
  recipeMd += `  npx sharp-cli -i "$img" -o "public/images/recipes/\${slug}.avif" resize 800 600 --fit cover --format avif --quality 70\n`;
  recipeMd += `  npx sharp-cli -i "$img" -o "public/images/recipes/\${slug}-768w.avif" resize 768 576 --fit cover --format avif --quality 70\n`;
  recipeMd += `  npx sharp-cli -i "$img" -o "public/images/recipes/\${slug}-384w.avif" resize 384 288 --fit cover --format avif --quality 70\n`;
  recipeMd += `done\n`;
  recipeMd += '```\n';

  writeFileSync('missing-draft-recipe-images.md', recipeMd);
  console.log(`Wrote missing-draft-recipe-images.md`);

  // Generate blog image table
  let blogMd = `# Missing Blog Post Images\n\n`;
  blogMd += `${blogPosts!.length} blog posts need hero images. Generate each in Midjourney, export as PNG, then convert to AVIF at 1200w (base), 768w, and 384w variants.\n\n`;
  blogMd += `| # | Post Title | Midjourney Prompt | Filename |\n`;
  blogMd += `|---|---|---|---|\n`;

  for (let i = 0; i < blogPosts!.length; i++) {
    const p = blogPosts![i];
    const prompt = generateBlogPrompt(p.title, p.slug);
    blogMd += `| ${i + 1} | ${p.title} | ${prompt} | ${p.slug}.avif |\n`;
  }

  blogMd += `\n## Post-generation workflow\n\n`;
  blogMd += '```bash\n';
  blogMd += `# Convert and resize all PNGs to AVIF variants (16:9 for blog)\n`;
  blogMd += `for img in *.png; do\n`;
  blogMd += `  slug="\${img%.png}"\n`;
  blogMd += `  npx sharp-cli -i "$img" -o "public/images/blog/\${slug}.avif" resize 1200 675 --fit cover --format avif --quality 70\n`;
  blogMd += `  npx sharp-cli -i "$img" -o "public/images/blog/\${slug}-768w.avif" resize 768 432 --fit cover --format avif --quality 70\n`;
  blogMd += `  npx sharp-cli -i "$img" -o "public/images/blog/\${slug}-384w.avif" resize 384 216 --fit cover --format avif --quality 70\n`;
  blogMd += `done\n`;
  blogMd += '```\n';

  writeFileSync('missing-blog-images.md', blogMd);
  console.log(`Wrote missing-blog-images.md`);

  console.log('\nDone!');
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
