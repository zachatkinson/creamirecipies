import { describe, test, expect } from 'vitest';
import { buildRecipeJsonLd, buildBlogPostingJsonLd, buildBreadcrumbJsonLd, buildWebSiteJsonLd, buildOrganizationJsonLd, generateRecipeFaqs, buildFaqJsonLd } from './seo';
import { SAMPLE_RECIPE, SAMPLE_POST } from '../test/mocks';
import type { RecipeWithDetails } from './types';

describe('buildRecipeJsonLd', () => {
  const recipe = SAMPLE_RECIPE as unknown as RecipeWithDetails;
  const siteUrl = 'https://eatcreami.com';

  test('generates valid Recipe schema', () => {
    // Act
    const jsonLd = buildRecipeJsonLd(recipe, siteUrl);

    // Assert
    expect(jsonLd['@context']).toBe('https://schema.org');
    expect(jsonLd['@type']).toBe('Recipe');
    expect(jsonLd.name).toBe('Test Vanilla Ice Cream');
    expect(jsonLd.url).toBe('https://eatcreami.com/recipes/test-vanilla-ice-cream');
  });

  test('includes recipe ingredients', () => {
    // Act
    const jsonLd = buildRecipeJsonLd(recipe, siteUrl);

    // Assert
    expect(jsonLd.recipeIngredient).toHaveLength(3);
    expect(jsonLd.recipeIngredient[0]).toContain('whole milk');
  });

  test('includes HowToStep instructions with URLs', () => {
    // Act
    const jsonLd = buildRecipeJsonLd(recipe, siteUrl);

    // Assert
    expect(jsonLd.recipeInstructions).toHaveLength(2);
    expect(jsonLd.recipeInstructions[0]['@type']).toBe('HowToStep');
    expect(jsonLd.recipeInstructions[0].url).toContain('#step-1');
  });

  test('includes HowToTip when hint exists', () => {
    // Act
    const jsonLd = buildRecipeJsonLd(recipe, siteUrl);

    // Assert
    expect(jsonLd.recipeInstructions[0].tip).toBeDefined();
    expect(jsonLd.recipeInstructions[0].tip['@type']).toBe('HowToTip');
    expect(jsonLd.recipeInstructions[1].tip).toBeUndefined();
  });

  test('includes aggregateRating when rating_count > 0', () => {
    // Act
    const jsonLd = buildRecipeJsonLd(recipe, siteUrl);

    // Assert
    expect(jsonLd.aggregateRating).toBeDefined();
    expect(jsonLd.aggregateRating.ratingValue).toBe('4.5');
    expect(jsonLd.aggregateRating.ratingCount).toBe('10');
  });

  test('omits aggregateRating when rating_count is 0', () => {
    // Arrange
    const unrated = { ...recipe, rating_count: 0, avg_rating: 0 } as unknown as RecipeWithDetails;

    // Act
    const jsonLd = buildRecipeJsonLd(unrated, siteUrl);

    // Assert
    expect(jsonLd.aggregateRating).toBeUndefined();
  });

  test('includes nutrition when provided', () => {
    // Arrange
    const nutrition = { calories: 800, protein: 20, fat: 40, carbs: 80, servings: 4 };

    // Act
    const jsonLd = buildRecipeJsonLd(recipe, siteUrl, nutrition);

    // Assert
    expect(jsonLd.nutrition).toBeDefined();
    expect(jsonLd.nutrition.calories).toBe('200 calories');
    expect(jsonLd.nutrition.proteinContent).toBe('5g');
  });

  test('includes suitableForDiet for dietary categories', () => {
    // Act
    const jsonLd = buildRecipeJsonLd(recipe, siteUrl);

    // Assert
    expect(jsonLd.suitableForDiet).toBeDefined();
    expect(jsonLd.suitableForDiet).toContain('https://schema.org/GlutenFreeDiet');
  });

  test('includes recipeDifficulty', () => {
    // Act
    const jsonLd = buildRecipeJsonLd(recipe, siteUrl);

    // Assert
    expect(jsonLd.recipeDifficulty).toBe('Beginner');
  });

  test('includes tools with Ninja Creami models', () => {
    // Act
    const jsonLd = buildRecipeJsonLd(recipe, siteUrl);

    // Assert
    expect(jsonLd.tool).toHaveLength(2);
    expect(jsonLd.tool[0].name).toBe('Ninja Creami');
  });

  test('includes keywords from categories and tags', () => {
    // Act
    const jsonLd = buildRecipeJsonLd(recipe, siteUrl);

    // Assert
    expect(jsonLd.keywords).toContain('ninja creami');
    expect(jsonLd.keywords).toContain('Ice Cream');
    expect(jsonLd.keywords).toContain('Vanilla');
  });
});

describe('buildBlogPostingJsonLd', () => {
  test('generates valid BlogPosting schema', () => {
    // Act
    const jsonLd = buildBlogPostingJsonLd(SAMPLE_POST, 'https://eatcreami.com');

    // Assert
    expect(jsonLd['@type']).toBe('BlogPosting');
    expect(jsonLd.headline).toBe('Test Blog Post');
    expect(jsonLd.mainEntityOfPage['@id']).toContain('/blog/test-blog-post');
  });
});

describe('buildBreadcrumbJsonLd', () => {
  test('generates ordered ListItem elements', () => {
    // Arrange
    const breadcrumbs = [
      { name: 'Home', url: 'https://eatcreami.com' },
      { name: 'Recipes', url: 'https://eatcreami.com/recipes' },
      { name: 'Vanilla', url: 'https://eatcreami.com/recipes/vanilla' },
    ];

    // Act
    const jsonLd = buildBreadcrumbJsonLd(breadcrumbs);

    // Assert
    expect(jsonLd['@type']).toBe('BreadcrumbList');
    expect(jsonLd.itemListElement).toHaveLength(3);
    expect(jsonLd.itemListElement[0].position).toBe(1);
    expect(jsonLd.itemListElement[2].position).toBe(3);
  });
});

describe('buildWebSiteJsonLd', () => {
  test('includes SearchAction', () => {
    // Act
    const jsonLd = buildWebSiteJsonLd('https://eatcreami.com');

    // Assert
    expect(jsonLd['@type']).toBe('WebSite');
    expect(jsonLd.potentialAction['@type']).toBe('SearchAction');
    expect(jsonLd.potentialAction.target.urlTemplate).toContain('/recipes?q=');
  });
});

describe('buildOrganizationJsonLd', () => {
  test('generates Organization with logo', () => {
    // Act
    const jsonLd = buildOrganizationJsonLd('https://eatcreami.com');

    // Assert
    expect(jsonLd['@type']).toBe('Organization');
    expect(jsonLd.name).toBe('eatcreami');
    expect(jsonLd.logo).toContain('logo.avif');
  });
});

describe('generateRecipeFaqs', () => {
  test('always generates storage and model FAQs', () => {
    // Arrange
    const recipe = SAMPLE_RECIPE as unknown as RecipeWithDetails;

    // Act
    const faqs = generateRecipeFaqs(recipe);

    // Assert
    expect(faqs.length).toBeGreaterThanOrEqual(2);
    expect(faqs[0].question).toContain('freezer');
    expect(faqs[1].question).toContain('model');
  });

  test('generates beginner FAQ for beginner recipes', () => {
    // Arrange
    const recipe = { ...SAMPLE_RECIPE, difficulty: 'beginner' } as unknown as RecipeWithDetails;

    // Act
    const faqs = generateRecipeFaqs(recipe);

    // Assert
    expect(faqs.some(f => f.question.toLowerCase().includes('easy') || f.question.toLowerCase().includes('beginner'))).toBe(true);
  });

  test('generates dietary FAQ when recipe has dietary categories', () => {
    // Arrange
    const recipe = SAMPLE_RECIPE as unknown as RecipeWithDetails;

    // Act
    const faqs = generateRecipeFaqs(recipe);

    // Assert
    expect(faqs.some(f => f.question.toLowerCase().includes('diet') || f.answer.toLowerCase().includes('gluten'))).toBe(true);
  });
});

describe('buildFaqJsonLd', () => {
  test('generates FAQPage schema', () => {
    // Arrange
    const faqs = [
      { question: 'How long?', answer: '24 hours' },
      { question: 'Which model?', answer: 'All models' },
    ];

    // Act
    const jsonLd = buildFaqJsonLd(faqs);

    // Assert
    expect(jsonLd['@type']).toBe('FAQPage');
    expect(jsonLd.mainEntity).toHaveLength(2);
    expect(jsonLd.mainEntity[0]['@type']).toBe('Question');
    expect(jsonLd.mainEntity[0].acceptedAnswer['@type']).toBe('Answer');
  });
});
