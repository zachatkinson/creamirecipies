import type { RecipeWithDetails } from './types';

/** Generate Schema.org Recipe JSON-LD structured data */
export function buildRecipeJsonLd(recipe: RecipeWithDetails, siteUrl: string) {
  const totalMinutes =
    (recipe.prep_time_minutes ?? 0) + (recipe.freeze_time_hours ?? 24) * 60;

  return {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.title,
    description: recipe.description,
    image: recipe.hero_image_url ? [recipe.hero_image_url] : [],
    author: {
      '@type': 'Person',
      name: recipe.author.display_name || recipe.author.username,
    },
    datePublished: recipe.published_at,
    prepTime: recipe.prep_time_minutes ? `PT${recipe.prep_time_minutes}M` : undefined,
    cookTime: recipe.freeze_time_hours ? `PT${recipe.freeze_time_hours}H` : undefined,
    totalTime: `PT${totalMinutes}M`,
    recipeYield: recipe.servings ? `${recipe.servings} servings` : undefined,
    recipeCategory: recipe.base_type,
    recipeCuisine: 'American',
    cookingMethod: 'Ninja Creami',
    keywords: [
      'ninja creami',
      recipe.base_type,
      ...recipe.categories.map((c) => c.name),
      ...recipe.tags.map((t) => t.name),
    ].join(', '),
    recipeIngredient: recipe.ingredients.map(
      (i) => `${i.amount}${i.unit ? ' ' + i.unit : ''} ${i.name}`
    ),
    recipeInstructions: recipe.steps.map((step) => ({
      '@type': 'HowToStep',
      position: step.step_number,
      name: `Step ${step.step_number}`,
      text: step.instruction,
      ...(step.hint ? { tip: { '@type': 'HowToTip', text: step.hint } } : {}),
      ...(step.image_url ? { image: step.image_url } : {}),
    })),
    ...(recipe.rating_count > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: recipe.avg_rating.toFixed(1),
            ratingCount: recipe.rating_count.toString(),
            bestRating: '5',
            worstRating: '1',
          },
        }
      : {}),
    tool: [
      { '@type': 'HowToTool', name: 'Ninja Creami' },
      ...(recipe.models ?? []).map((m) => ({ '@type': 'HowToTool', name: m.name })),
    ],
    url: `${siteUrl}/recipes/${recipe.slug}`,
    ...(recipe.video_url
      ? {
          video: {
            '@type': 'VideoObject',
            name: `How to Make ${recipe.title}`,
            description: recipe.description,
            thumbnailUrl: recipe.video_thumbnail_url || recipe.hero_image_url || '',
            contentUrl: recipe.video_url,
            uploadDate: recipe.published_at,
          },
        }
      : {}),
  };
}

/** Generate BreadcrumbList JSON-LD */
export function buildBreadcrumbJsonLd(
  items: { name: string; url: string }[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** Generate WebSite JSON-LD with SearchAction (for Google sitelinks search box) */
export function buildWebSiteJsonLd(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Creami Recipes',
    url: siteUrl,
    description: 'Discover and share delicious Ninja Creami recipes with step-by-step guidance and pro tips.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/recipes?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/** Generate ItemList JSON-LD for recipe listing pages */
export function buildRecipeListJsonLd(
  recipes: { title: string; slug: string; description: string; avg_rating: number; hero_image_url: string | null }[],
  siteUrl: string,
  listName: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    numberOfItems: recipes.length,
    itemListElement: recipes.map((recipe, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${siteUrl}/recipes/${recipe.slug}`,
      name: recipe.title,
      description: recipe.description,
      ...(recipe.hero_image_url ? { image: recipe.hero_image_url } : {}),
    })),
  };
}

/** Generate Organization JSON-LD */
export function buildOrganizationJsonLd(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Creami Recipes',
    url: siteUrl,
    logo: `${siteUrl}/logo.avif`,
    sameAs: [],
  };
}

/** Generate auto-FAQ questions for a recipe based on its data (returns raw Q&A pairs) */
export function generateRecipeFaqs(recipe: RecipeWithDetails): { question: string; answer: string }[] {
  const faqs: { question: string; answer: string }[] = [];

  // Storage question
  faqs.push({
    question: `How long does ${recipe.title} last in the freezer?`,
    answer: `Once processed in the Ninja Creami, ${recipe.title} is best enjoyed immediately for the creamiest texture. You can refreeze it for up to 2 weeks — just let it sit at room temperature for 5-10 minutes before re-processing with the Re-Spin function.`,
  });

  // Model compatibility
  const isSwirl = recipe.base_type === 'Swirl' || recipe.title.toLowerCase().includes('swirl');
  if (isSwirl) {
    faqs.push({
      question: `Which Ninja Creami models can make ${recipe.title}?`,
      answer: `This recipe uses the swirl dispensing feature, which is exclusive to the Ninja CREAMi Scoop & Swirl (NC701). Other models can make the base recipe but cannot dispense it as a swirl.`,
    });
  } else {
    faqs.push({
      question: `Which Ninja Creami models can make ${recipe.title}?`,
      answer: `This recipe works with all Ninja CREAMi models — the 7-in-1 (NC301), Deluxe, XL Deluxe 11-in-1 (NC501), and Scoop & Swirl (NC701). It also works with discontinued models like the Breeze (NC100) and original 5-in-1 (NC300). The ingredients are sized for a standard 16oz pint. If you have a 24oz Deluxe or XL Deluxe model, use our built-in ingredient scaler to adjust the quantities up.`,
    });
  }

  // Difficulty tip
  if (recipe.difficulty === 'beginner') {
    faqs.push({
      question: `Is ${recipe.title} easy to make?`,
      answer: `Yes! This is a beginner-friendly recipe with just ${recipe.ingredients.length} ingredients and ${recipe.steps.length} simple steps. It's a great recipe if you're new to the Ninja Creami.`,
    });
  }

  // Dietary info
  const dietaryCategories = recipe.categories?.filter((c) => c.type === 'dietary').map((c) => c.name) ?? [];
  if (dietaryCategories.length > 0) {
    faqs.push({
      question: `Is ${recipe.title} suitable for special diets?`,
      answer: `Yes, this recipe is: ${dietaryCategories.join(', ')}. Always check individual ingredient labels to confirm they meet your specific dietary requirements.`,
    });
  }

  // Texture troubleshooting
  faqs.push({
    question: `What if my ${recipe.base_type.toLowerCase()} comes out crumbly?`,
    answer: `This is normal after the first spin. Select the Re-Spin function for a smoother, creamier result. If it's still crumbly after two re-spins, let the pint sit at room temperature for 3-5 minutes, then try again.`,
  });

  // Intelligent ingredient-based FAQs
  const ingredientNames = recipe.ingredients.map((i) => i.name.toLowerCase());
  const allIngredients = ingredientNames.join(' ');

  // Extract warnings
  if (allIngredients.match(/extract|peppermint|almond extract|vanilla extract/)) {
    faqs.push({
      question: `How much extract should I use? Can I add more for stronger flavor?`,
      answer: `Extracts are highly concentrated — a little goes a long way. Start with the amount listed and taste the base before freezing. You can always add more, but you can't remove it. Peppermint extract is especially potent — even 1/4 teaspoon extra can make it overpowering.`,
    });
  }

  // Protein powder tips
  if (allIngredients.match(/protein powder|protein shake/)) {
    faqs.push({
      question: `Why does my protein ice cream need more re-spins?`,
      answer: `Protein-based recipes are denser and harder when frozen. It's completely normal to need 2-3 re-spins to achieve a creamy texture. Adding a tablespoon of cream cheese to the base can dramatically improve the texture of protein recipes.`,
    });
  }

  // Nut butter tips
  if (allIngredients.match(/peanut butter|almond butter|cashew butter|hazelnut spread|biscoff/)) {
    faqs.push({
      question: `Should I warm the nut butter before adding it?`,
      answer: `For mix-ins and swirls, yes — microwave the nut butter for 10-15 seconds so it's drizzleable. This creates beautiful swirl ribbons. For the base, blend it cold with the other ingredients until completely smooth.`,
    });
  }

  // Alcohol warning
  if (allIngredients.match(/bourbon|rum|kahlua|amaretto|wine|liqueur/)) {
    faqs.push({
      question: `Will the alcohol prevent this from freezing?`,
      answer: `Small amounts of alcohol (1-2 tablespoons) actually improve texture by slightly lowering the freezing point. However, too much will prevent the base from freezing solid, which is required for the Ninja Creami to process it. Stick to the amount listed in the recipe.`,
    });
  }

  // Fruit-based tips
  if (allIngredients.match(/frozen.*berr|frozen.*fruit|frozen.*mango|frozen.*peach/)) {
    faqs.push({
      question: `Can I use fresh fruit instead of frozen?`,
      answer: `Yes! Fresh fruit works great — just blend it smooth before pouring into the Creami pint. The frozen fruit in this recipe is for convenience and sometimes creates a thicker base. Either way, the Creami will freeze and process it the same way.`,
    });
  }

  // Cream cheese base tips
  if (ingredientNames.some((n) => n.includes('cream cheese'))) {
    faqs.push({
      question: `Why does this recipe use cream cheese?`,
      answer: `Cream cheese is a Ninja Creami secret weapon — it acts as a natural stabilizer, preventing icy texture and creating an incredibly smooth, scoopable result. Make sure to soften it completely (microwave 10-15 seconds) and whisk until smooth before adding other liquids.`,
    });
  }

  // Coconut milk tips
  if (allIngredients.match(/coconut milk|coconut cream/)) {
    faqs.push({
      question: `Do I need full-fat coconut milk?`,
      answer: `Yes — full-fat coconut milk (17-22% fat) is essential for a creamy result. Lite coconut milk (5-7% fat) has too much water and will produce an icy, hard texture. Look for canned coconut milk (not the carton kind meant for drinking, which is only 2-4% fat). Shake the can vigorously before opening to combine the separated cream and water layers. Brands like Thai Kitchen and Aroy-D are popular choices.`,
    });
  }

  // Dairy clarification - whole milk
  if (allIngredients.match(/whole milk/)) {
    faqs.push({
      question: `What kind of milk should I use? Is whole milk the same as homo milk?`,
      answer: `Yes — whole milk, homogenized milk (homo milk), vitamin D milk, and full-fat milk are all the same thing: 3.25% milk fat (MF). Do NOT substitute with 2% (too lean), 1% (way too lean), or skim/0% (will be rock-hard and icy). The fat is critical for creamy texture. International equivalents: UK "full-fat milk" (3.5%), Australia "full cream milk" (3.4%), France "lait entier" (3.5%). All work perfectly.`,
    });
  }

  // Dairy clarification - heavy cream
  if (allIngredients.match(/heavy cream/)) {
    faqs.push({
      question: `What's the difference between heavy cream, heavy whipping cream, and whipping cream?`,
      answer: `Heavy cream and heavy whipping cream are the same thing: 36% milk fat (MF). Use either interchangeably. Here's the full breakdown: Heavy/heavy whipping cream (36% MF) — best results, richest texture. Whipping cream (30-35% MF) — works well, slightly lighter. Half-and-half (10-12% MF) — do NOT use as a substitute, not enough fat. Coffee creamer — do NOT use. International equivalents: UK "double cream" (48% MF — use 3/4 the amount), Australia "thickened cream" (35% MF), France "crème entière" (30-40% MF). The higher the fat percentage, the creamier and smoother your result.`,
    });
  }

  // Sweetener clarification
  if (allIngredients.match(/granulated sugar/)) {
    faqs.push({
      question: `Can I substitute a different sweetener for granulated sugar?`,
      answer: `Sugar does more than sweeten — it lowers the freezing point and prevents icy texture. You can substitute with: allulose (best for keto — doesn't crystallize when frozen), coconut sugar (1:1 swap but darker color), or monk fruit blend (1:1 swap). Avoid liquid sweeteners like honey or maple syrup as a full replacement — they change the liquid ratio.`,
    });
  }

  // Greek yogurt clarification
  if (ingredientNames.some((n) => n.includes('greek yogurt'))) {
    faqs.push({
      question: `Does the brand of Greek yogurt matter? Full-fat or non-fat?`,
      answer: `Use full-fat (whole milk) Greek yogurt (8-10% MF) for the best, creamiest results. 2% Greek yogurt will work but produces a slightly icier texture — add a tablespoon of cream cheese to compensate. Non-fat/0% Greek yogurt is not recommended — it will be icy without stabilizers. Any brand works, but thicker brands like Fage (10% MF) or Chobani tend to give better results than runnier ones. Regular yogurt (non-Greek) is too liquid — don't substitute it 1:1.`,
    });
  }

  // Condensed milk clarification
  if (allIngredients.match(/condensed milk|sweetened condensed/)) {
    faqs.push({
      question: `Can I use evaporated milk instead of sweetened condensed milk?`,
      answer: `No — they are very different. Sweetened condensed milk is thick, sweet, and acts as both sweetener and stabilizer. Evaporated milk is unsweetened and thin. Using evaporated milk instead would result in a much less sweet, icier texture. Stick with sweetened condensed milk for this recipe.`,
    });
  }

  // Food coloring
  if (allIngredients.match(/food coloring/)) {
    faqs.push({
      question: `Is the food coloring necessary?`,
      answer: `No — food coloring is purely optional and cosmetic. It has no effect on flavor or texture. Skip it if you prefer a natural look.`,
    });
  }

  return faqs;
}

/** Generate auto-FAQ JSON-LD for a recipe */
export function buildRecipeFaqJsonLd(recipe: RecipeWithDetails) {
  return buildFaqJsonLd(generateRecipeFaqs(recipe));
}

/** Generate FAQ JSON-LD */
export function buildFaqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/** Supported languages for i18n */
export const SUPPORTED_LOCALES = [
  { code: 'en', label: 'English', default: true },
  // Future: uncomment to enable
  // { code: 'es', label: 'Español' },
  // { code: 'fr', label: 'Français' },
  // { code: 'de', label: 'Deutsch' },
  // { code: 'ja', label: '日本語' },
  // { code: 'pt', label: 'Português' },
] as const;

/** Build hreflang link tags for a given path */
export function buildHreflangTags(siteUrl: string, path: string): { rel: string; hreflang: string; href: string }[] {
  const activeLocales = SUPPORTED_LOCALES.filter(() => true); // all for now
  const tags = activeLocales.map((locale) => ({
    rel: 'alternate',
    hreflang: locale.code,
    href: locale.default ? `${siteUrl}${path}` : `${siteUrl}/${locale.code}${path}`,
  }));
  // x-default points to the default language version
  tags.push({
    rel: 'alternate',
    hreflang: 'x-default',
    href: `${siteUrl}${path}`,
  });
  return tags;
}
