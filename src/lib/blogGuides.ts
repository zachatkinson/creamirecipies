import type { Locale } from '../i18n';

/** A blog guide surfaced as an internal link on recipe and collection pages */
export interface BlogGuide {
  /** Slug of the published blog post (linked as /blog/<slug>) */
  postSlug: string;
  /** Collection hub slugs that surface this guide */
  collections: string[];
  /** Recipe category slugs (any type) that surface this guide on recipe pages */
  categories: string[];
  /** Localized anchor text for the link */
  label: Record<Locale, string>;
  /** Localized one-line teaser shown under the link */
  teaser: Record<Locale, string>;
}

/** Guides mapped to the recipe categories and collection hubs they support */
export const BLOG_GUIDES: BlogGuide[] = [
  {
    postSlug: 'best-protein-powders-creami',
    collections: ['protein-ice-cream', 'lite-ice-cream'],
    categories: ['high-protein'],
    label: {
      en: 'Best Protein Powder for Ninja Creami: 8 Tested, 3 Win',
      fr: 'La meilleure protéine en poudre pour Ninja Creami : 8 testées',
      es: 'La mejor proteína en polvo para Ninja Creami: 8 probadas',
      de: 'Das beste Proteinpulver für die Ninja Creami: 8 im Test',
      pt: 'A melhor proteína em pó para Ninja Creami: 8 testadas',
    },
    teaser: {
      en: 'Which powders blend creamy instead of chalky — our independent test results.',
      fr: 'Quelles poudres donnent une texture crémeuse plutôt que crayeuse — nos résultats de tests indépendants.',
      es: 'Qué proteínas quedan cremosas y no arenosas: nuestros resultados independientes.',
      de: 'Welche Pulver cremig statt kreidig werden — unsere unabhängigen Testergebnisse.',
      pt: 'Quais proteínas ficam cremosas em vez de farinhentas — nossos resultados independentes.',
    },
  },
  {
    postSlug: 'best-cocoa-powders-creami',
    collections: [],
    categories: ['chocolate'],
    label: {
      en: 'Best Cocoa Powders for Creami Ice Cream',
      fr: 'Les meilleurs cacaos en poudre pour vos glaces Creami',
      es: 'Los mejores cacaos en polvo para helado en la Creami',
      de: 'Die besten Kakaopulver für Creami-Eis',
      pt: 'Os melhores cacaus em pó para sorvete na Creami',
    },
    teaser: {
      en: 'Dutch-process vs natural, and which brands give the deepest chocolate flavor.',
      fr: 'Cacao alcalinisé ou naturel, et quelles marques donnent le goût de chocolat le plus intense.',
      es: 'Cacao alcalinizado o natural, y qué marcas dan el sabor a chocolate más intenso.',
      de: 'Stark entölt oder natur — und welche Marken den intensivsten Schokoladengeschmack liefern.',
      pt: 'Cacau alcalino ou natural, e quais marcas dão o sabor de chocolate mais intenso.',
    },
  },
];

/** Guides matching any of a recipe's category slugs */
export function getGuidesForRecipe(categorySlugs: string[]): BlogGuide[] {
  const slugs = new Set(categorySlugs);
  return BLOG_GUIDES.filter((g) => g.categories.some((c) => slugs.has(c)));
}

/** Guides configured for a collection hub */
export function getGuidesForCollection(collectionSlug: string): BlogGuide[] {
  return BLOG_GUIDES.filter((g) => g.collections.includes(collectionSlug));
}
