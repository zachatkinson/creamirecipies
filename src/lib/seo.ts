import type { RecipeWithDetails } from './types';
import type { Locale } from '../i18n';
import { LOCALES, DEFAULT_LOCALE } from '../i18n';
import { faq } from './translations';
import { BASE_TYPE_TRANSLATIONS } from './blog';

/** Nutrition data for Recipe JSON-LD */
interface NutritionData {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  servings: number;
}

/** Generate Schema.org Recipe JSON-LD structured data */
export function buildRecipeJsonLd(recipe: RecipeWithDetails, siteUrl: string, nutrition?: NutritionData) {
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
    ...(nutrition && nutrition.calories > 0
      ? {
          nutrition: {
            '@type': 'NutritionInformation',
            calories: `${Math.round(nutrition.calories / nutrition.servings)} calories`,
            proteinContent: `${Math.round(nutrition.protein / nutrition.servings)}g`,
            fatContent: `${Math.round(nutrition.fat / nutrition.servings)}g`,
            carbohydrateContent: `${Math.round(nutrition.carbs / nutrition.servings)}g`,
          },
        }
      : {}),
  };
}

export interface BlogPostForJsonLd {
  title: string;
  slug: string;
  excerpt: string | null;
  category: string;
  hero_image_url: string | null;
  published_at: string | null;
  created_at: string;
  updated_at?: string;
}

/** Generate BlogPosting JSON-LD for blog posts */
export function buildBlogPostingJsonLd(
  post: BlogPostForJsonLd,
  siteUrl: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt ?? '',
    image: post.hero_image_url ? `${siteUrl}${post.hero_image_url}` : `${siteUrl}/images/blog/${post.category || 'news'}.svg`,
    datePublished: post.published_at ?? post.created_at,
    ...(post.updated_at ? { dateModified: post.updated_at } : {}),
    author: {
      '@type': 'Organization',
      name: 'eatcreami',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'eatcreami',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.avif`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/blog/${post.slug}`,
    },
    articleSection: post.category,
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
    name: 'eatcreami',
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
    name: 'eatcreami',
    url: siteUrl,
    logo: `${siteUrl}/logo.avif`,
    sameAs: [],
  };
}

/** Generate auto-FAQ questions for a recipe based on its data (returns raw Q&A pairs) */
export function generateRecipeFaqs(recipe: RecipeWithDetails, locale: Locale = 'en'): { question: string; answer: string }[] {
  const faqs: { question: string; answer: string }[] = [];
  const vars = { title: recipe.title, ingredientCount: recipe.ingredients.length, stepCount: recipe.steps.length };

  // Storage question
  faqs.push(faq('storage', locale, vars));

  // Model compatibility
  const isSwirl = recipe.base_type === 'Swirl' || recipe.title.toLowerCase().includes('swirl');
  faqs.push(faq(isSwirl ? 'modelSwirl' : 'modelAll', locale, vars));

  // Difficulty tip
  if (recipe.difficulty === 'beginner') {
    faqs.push(faq('beginner', locale, vars));
  }

  // Dietary info
  const dietaryCategories = recipe.categories?.filter((c) => c.type === 'dietary').map((c) => c.name) ?? [];
  if (dietaryCategories.length > 0) {
    faqs.push(faq('dietary', locale, { ...vars, diets: dietaryCategories.join(', ') }));
  }

  const baseTypeLower = recipe.base_type.toLowerCase();
  const localBaseType = BASE_TYPE_TRANSLATIONS[baseTypeLower]?.[locale] ?? baseTypeLower;
  faqs.push(faq('crumbly', locale, { ...vars, baseType: localBaseType }));

  // Intelligent ingredient-based FAQs
  const ingredientNames = recipe.ingredients.map((i) => i.name.toLowerCase());
  const allIngredients = ingredientNames.join(' ');

  if (allIngredients.match(/extract|peppermint|almond extract|vanilla extract/)) {
    faqs.push(faq('extract', locale));
  }
  if (allIngredients.match(/protein powder|protein shake/)) {
    faqs.push(faq('protein', locale));
  }
  if (allIngredients.match(/peanut butter|almond butter|cashew butter|hazelnut spread|biscoff/)) {
    faqs.push(faq('nutButter', locale));
  }
  if (allIngredients.match(/bourbon|rum|kahlua|amaretto|wine|liqueur/)) {
    faqs.push(faq('alcohol', locale));
  }
  if (allIngredients.match(/frozen.*berr|frozen.*fruit|frozen.*mango|frozen.*peach/)) {
    faqs.push(faq('freshFruit', locale));
  }
  if (ingredientNames.some((n) => n.includes('cream cheese'))) {
    faqs.push(faq('creamCheese', locale));
  }
  if (allIngredients.match(/coconut milk|coconut cream/)) {
    faqs.push(faq('coconutMilk', locale));
  }
  if (allIngredients.match(/whole milk/)) {
    faqs.push(faq('wholeMilk', locale));
  }
  if (allIngredients.match(/heavy cream/)) {
    faqs.push(faq('heavyCream', locale));
  }
  if (allIngredients.match(/granulated sugar/)) {
    faqs.push(faq('sweetener', locale));
  }
  if (ingredientNames.some((n) => n.includes('greek yogurt'))) {
    faqs.push(faq('greekYogurt', locale));
  }
  if (allIngredients.match(/condensed milk|sweetened condensed/)) {
    faqs.push(faq('condensedMilk', locale));
  }
  if (allIngredients.match(/food coloring/)) {
    faqs.push(faq('foodColoring', locale));
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

/** Build hreflang link tags for a given path */
export function buildHreflangTags(siteUrl: string, path: string): { rel: string; hreflang: string; href: string }[] {
  const localeEntries = Object.keys(LOCALES) as Locale[];
  const tags: { rel: string; hreflang: string; href: string }[] = localeEntries.map((code) => ({
    rel: 'alternate',
    hreflang: code,
    href: code === DEFAULT_LOCALE ? `${siteUrl}${path}` : `${siteUrl}/${code}${path}`,
  }));
  // x-default points to the default language version
  tags.push({
    rel: 'alternate',
    hreflang: 'x-default' as string,
    href: `${siteUrl}${path}`,
  });
  return tags;
}
