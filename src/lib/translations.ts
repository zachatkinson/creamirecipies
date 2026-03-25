import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';
import type { Locale } from '../i18n';
import { DEFAULT_LOCALE } from '../i18n';

type Client = SupabaseClient<Database>;

interface RecipeTranslation {
  title: string;
  description: string;
  steps: { instruction: string; hint: string }[] | null;
  ingredients: { name: string; amount: string; unit: string }[] | null;
}

export async function getRecipeTranslation(
  client: Client,
  recipeId: string,
  locale: Locale,
): Promise<RecipeTranslation | null> {
  if (locale === DEFAULT_LOCALE) return null;

  const { data } = await client
    .from('recipe_translations')
    .select('title, description, steps, ingredients')
    .eq('recipe_id', recipeId)
    .eq('locale', locale)
    .single();

  return data as RecipeTranslation | null;
}

export function applyTranslation<T extends { title: string; description: string }>(
  recipe: T,
  translation: RecipeTranslation | null,
): T {
  if (!translation) return recipe;
  return {
    ...recipe,
    title: translation.title || recipe.title,
    description: translation.description || recipe.description,
  };
}

/**
 * Get translated ingredient names from master_ingredients table.
 * Returns a map of master_ingredient_id -> translated name
 */
export async function getIngredientTranslations(
  client: Client,
  locale: Locale,
): Promise<Map<string, string>> {
  if (locale === DEFAULT_LOCALE) return new Map();

  const column = `name_${locale}` as const;
  const { data } = await client
    .from('master_ingredients')
    .select(`id, ${column}`)
    .not(column, 'is', null);

  const map = new Map<string, string>();
  if (data) {
    for (const row of data) {
      const translated = (row as Record<string, unknown>)[column] as string | null;
      if (translated) map.set(row.id, translated);
    }
  }
  return map;
}

/** Common Creami step patterns translated */
const STEP_TRANSLATIONS: Record<string, Record<string, string>> = {
  'fr': {
    'Pour into Ninja Creami pint container': 'Versez dans le contenant du Ninja Creami',
    'Freeze for 24 hours': 'Congelez pendant 24 heures',
    'Freeze for 24 hours on a level surface': 'Congelez pendant 24 heures sur une surface plane',
    'Process using the Ice Cream function': 'Traitez en utilisant la fonction Crème Glacée',
    'Process using the Lite Ice Cream function': 'Traitez en utilisant la fonction Crème Glacée Légère',
    'Process using the Sorbet function': 'Traitez en utilisant la fonction Sorbet',
    'Process using the Gelato function': 'Traitez en utilisant la fonction Gelato',
    'Re-spin for creamier texture if desired': 'Relancez pour une texture plus onctueuse si désiré',
    'Serve immediately or refreeze for firmer texture': 'Servez immédiatement ou recongelez pour une texture plus ferme',
    'Enjoy immediately for best texture': 'Dégustez immédiatement pour la meilleure texture',
  },
  'es': {
    'Pour into Ninja Creami pint container': 'Vierta en el recipiente del Ninja Creami',
    'Freeze for 24 hours': 'Congele durante 24 horas',
    'Freeze for 24 hours on a level surface': 'Congele durante 24 horas en una superficie plana',
    'Process using the Ice Cream function': 'Procese usando la función Helado',
    'Process using the Lite Ice Cream function': 'Procese usando la función Helado Ligero',
    'Process using the Sorbet function': 'Procese usando la función Sorbete',
    'Process using the Gelato function': 'Procese usando la función Gelato',
    'Re-spin for creamier texture if desired': 'Re-procese para una textura más cremosa si lo desea',
    'Serve immediately or refreeze for firmer texture': 'Sirva inmediatamente o recongele para una textura más firme',
    'Enjoy immediately for best texture': 'Disfrute inmediatamente para la mejor textura',
  },
  'de': {
    'Pour into Ninja Creami pint container': 'In den Ninja Creami Behälter gießen',
    'Freeze for 24 hours': '24 Stunden einfrieren',
    'Freeze for 24 hours on a level surface': '24 Stunden auf einer ebenen Fläche einfrieren',
    'Process using the Ice Cream function': 'Mit der Eiscreme-Funktion verarbeiten',
    'Process using the Lite Ice Cream function': 'Mit der leichten Eiscreme-Funktion verarbeiten',
    'Process using the Sorbet function': 'Mit der Sorbet-Funktion verarbeiten',
    'Process using the Gelato function': 'Mit der Gelato-Funktion verarbeiten',
    'Re-spin for creamier texture if desired': 'Für eine cremigere Textur erneut mixen',
    'Serve immediately or refreeze for firmer texture': 'Sofort servieren oder für festere Textur erneut einfrieren',
    'Enjoy immediately for best texture': 'Sofort genießen für die beste Textur',
  },
  'pt': {
    'Pour into Ninja Creami pint container': 'Despeje no recipiente do Ninja Creami',
    'Freeze for 24 hours': 'Congele por 24 horas',
    'Freeze for 24 hours on a level surface': 'Congele por 24 horas em uma superfície plana',
    'Process using the Ice Cream function': 'Processe usando a função Sorvete',
    'Process using the Lite Ice Cream function': 'Processe usando a função Sorvete Leve',
    'Process using the Sorbet function': 'Processe usando a função Sorbet',
    'Process using the Gelato function': 'Processe usando a função Gelato',
    'Re-spin for creamier texture if desired': 'Re-processe para uma textura mais cremosa se desejar',
    'Serve immediately or refreeze for firmer texture': 'Sirva imediatamente ou recongele para uma textura mais firme',
    'Enjoy immediately for best texture': 'Aproveite imediatamente para a melhor textura',
  },
};

/** Common step verb patterns for fuzzy matching */
const STEP_VERB_PATTERNS: Record<string, Record<string, string>> = {
  'fr': {
    'Whisk': 'Fouettez',
    'Blend': 'Mixez',
    'Mix': 'Mélangez',
    'Add': 'Ajoutez',
    'Stir': 'Remuez',
    'Combine': 'Combinez',
    'Pour': 'Versez',
    'Freeze': 'Congelez',
    'Process': 'Traitez',
    'Serve': 'Servez',
    'Remove': 'Retirez',
    'Place': 'Placez',
    'Let': 'Laissez',
    'Create': 'Créez',
    'Make': 'Faites',
    'Strain': 'Filtrez',
    'Microwave': 'Passez au micro-ondes',
    'Heat': 'Chauffez',
    'Cool': 'Refroidissez',
    'Warm': 'Réchauffez',
  },
  'es': {
    'Whisk': 'Bata',
    'Blend': 'Licúe',
    'Mix': 'Mezcle',
    'Add': 'Agregue',
    'Stir': 'Revuelva',
    'Combine': 'Combine',
    'Pour': 'Vierta',
    'Freeze': 'Congele',
    'Process': 'Procese',
    'Serve': 'Sirva',
    'Remove': 'Retire',
    'Place': 'Coloque',
    'Let': 'Deje',
    'Create': 'Cree',
    'Make': 'Haga',
    'Strain': 'Cuele',
    'Microwave': 'Caliente en microondas',
    'Heat': 'Caliente',
    'Cool': 'Enfríe',
    'Warm': 'Entibie',
  },
  'de': {
    'Whisk': 'Verquirlen Sie',
    'Blend': 'Mixen Sie',
    'Mix': 'Mischen Sie',
    'Add': 'Fügen Sie',
    'Stir': 'Rühren Sie',
    'Combine': 'Kombinieren Sie',
    'Pour': 'Gießen Sie',
    'Freeze': 'Frieren Sie',
    'Process': 'Verarbeiten Sie',
    'Serve': 'Servieren Sie',
    'Remove': 'Entfernen Sie',
    'Place': 'Platzieren Sie',
    'Let': 'Lassen Sie',
    'Create': 'Erstellen Sie',
    'Make': 'Machen Sie',
    'Strain': 'Sieben Sie',
    'Microwave': 'Erwärmen Sie in der Mikrowelle',
    'Heat': 'Erhitzen Sie',
    'Cool': 'Kühlen Sie',
    'Warm': 'Wärmen Sie',
  },
  'pt': {
    'Whisk': 'Bata',
    'Blend': 'Bata no liquidificador',
    'Mix': 'Misture',
    'Add': 'Adicione',
    'Stir': 'Mexa',
    'Combine': 'Combine',
    'Pour': 'Despeje',
    'Freeze': 'Congele',
    'Process': 'Processe',
    'Serve': 'Sirva',
    'Remove': 'Remova',
    'Place': 'Coloque',
    'Let': 'Deixe',
    'Create': 'Crie',
    'Make': 'Faça',
    'Strain': 'Coe',
    'Microwave': 'Aqueça no micro-ondas',
    'Heat': 'Aqueça',
    'Cool': 'Esfrie',
    'Warm': 'Esquente',
  },
};

/**
 * Translate a step instruction using pattern matching.
 * Returns the original if no translation pattern matches.
 */
export function translateStep(instruction: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) return instruction;

  const patterns = STEP_TRANSLATIONS[locale];
  if (!patterns) return instruction;

  // Try exact match first
  if (patterns[instruction]) return patterns[instruction];

  // Try partial matches for common phrases
  let translated = instruction;
  for (const [en, localized] of Object.entries(patterns)) {
    if (translated.includes(en)) {
      translated = translated.replace(en, localized);
    }
  }

  // If still English, try translating the leading verb
  if (translated === instruction) {
    const verbs = STEP_VERB_PATTERNS[locale];
    if (verbs) {
      for (const [enVerb, localVerb] of Object.entries(verbs)) {
        if (instruction.startsWith(enVerb + ' ') || instruction.startsWith(enVerb + '.')) {
          translated = instruction.replace(new RegExp(`^${enVerb}`), localVerb);
          break;
        }
      }
    }
  }

  return translated;
}

/** UI label translations for recipe pages */
export const RECIPE_UI: Record<string, Record<Locale, string>> = {
  'ingredients': { en: 'Ingredients', fr: 'Ingrédients', es: 'Ingredientes', de: 'Zutaten', pt: 'Ingredientes' },
  'directions': { en: 'Directions', fr: 'Instructions', es: 'Instrucciones', de: 'Zubereitung', pt: 'Modo de Preparo' },
  'cookMode': { en: 'Cook Mode', fr: 'Mode Cuisine', es: 'Modo Cocina', de: 'Kochmodus', pt: 'Modo Cozinha' },
  'beforeYouBegin': { en: 'Before You Begin', fr: 'Avant de Commencer', es: 'Antes de Comenzar', de: 'Bevor Sie Beginnen', pt: 'Antes de Começar' },
  'yourModel': { en: 'Your Creami Model', fr: 'Votre Modèle Creami', es: 'Su Modelo Creami', de: 'Ihr Creami-Modell', pt: 'Seu Modelo Creami' },
  'selectModel': { en: 'Select your model — ingredients will auto-scale to your pint size.', fr: "Sélectionnez votre modèle — les ingrédients s'ajusteront automatiquement.", es: 'Seleccione su modelo — los ingredientes se ajustarán automáticamente.', de: 'Wählen Sie Ihr Modell — die Zutaten werden automatisch angepasst.', pt: 'Selecione seu modelo — os ingredientes serão ajustados automaticamente.' },
  'selectYourModel': { en: 'Select your Creami model...', fr: 'Choisissez votre modèle Creami...', es: 'Seleccione su modelo Creami...', de: 'Wählen Sie Ihr Creami-Modell...', pt: 'Selecione seu modelo Creami...' },
  'commonQuestions': { en: 'Common Questions', fr: 'Questions Fréquentes', es: 'Preguntas Frecuentes', de: 'Häufige Fragen', pt: 'Perguntas Frequentes' },
  'proTip': { en: 'Pro Tip', fr: 'Astuce de Pro', es: 'Consejo Pro', de: 'Profi-Tipp', pt: 'Dica Profissional' },
  'allergenWarning': { en: 'Allergen Warning — Contains:', fr: 'Avertissement Allergènes — Contient :', es: 'Advertencia de Alérgenos — Contiene:', de: 'Allergen-Warnung — Enthält:', pt: 'Aviso de Alérgenos — Contém:' },
  'checkLabels': { en: 'Always verify individual ingredient labels for specific allergen information.', fr: 'Vérifiez toujours les étiquettes individuelles des ingrédients.', es: 'Siempre verifique las etiquetas individuales de los ingredientes.', de: 'Überprüfen Sie immer die einzelnen Zutatenetiketten.', pt: 'Sempre verifique os rótulos individuais dos ingredientes.' },
  'share': { en: 'Share:', fr: 'Partager :', es: 'Compartir:', de: 'Teilen:', pt: 'Compartilhar:' },
  'print': { en: 'Print', fr: 'Imprimer', es: 'Imprimir', de: 'Drucken', pt: 'Imprimir' },
  'prep': { en: 'Prep', fr: 'Préparation', es: 'Preparación', de: 'Vorbereitung', pt: 'Preparo' },
  'freeze': { en: 'Freeze', fr: 'Congélation', es: 'Congelación', de: 'Einfrieren', pt: 'Congelamento' },
  'total': { en: 'Total', fr: 'Total', es: 'Total', de: 'Gesamt', pt: 'Total' },
  'servings': { en: 'Servings', fr: 'Portions', es: 'Porciones', de: 'Portionen', pt: 'Porções' },
  'creamiProgram': { en: 'Creami Program:', fr: 'Programme Creami :', es: 'Programa Creami:', de: 'Creami-Programm:', pt: 'Programa Creami:' },
  'watchVideo': { en: 'Watch How to Make It', fr: 'Regardez Comment le Préparer', es: 'Mira Cómo Prepararlo', de: 'Schau dir die Zubereitung an', pt: 'Veja Como Preparar' },
  'units': { en: 'Units:', fr: 'Unités :', es: 'Unidades:', de: 'Einheiten:', pt: 'Unidades:' },
};

export function ui(key: string, locale: Locale): string {
  return RECIPE_UI[key]?.[locale] ?? RECIPE_UI[key]?.['en'] ?? key;
}
