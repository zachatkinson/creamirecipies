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
    .not(column, 'is', null) as unknown as { data: Record<string, unknown>[] | null };
  const map = new Map<string, string>();
  if (data) {
    for (const row of data) {
      const translated = row[column] as string | null;
      if (translated) map.set(row.id as string, translated);
    }
  }
  return map;
}

/**
 * Get translated step instructions from step_translations table.
 * Returns a map of english_instruction -> translated_instruction
 */
export async function getStepTranslations(
  client: Client,
  locale: Locale,
): Promise<Map<string, { instruction: string; hint: string | null }>> {
  if (locale === DEFAULT_LOCALE) return new Map();
  const instrCol = `instruction_${locale}`;
  const hintCol = `hint_${locale}`;
  const { data } = await client
    .from('step_translations')
    .select(`instruction_en, ${instrCol}, hint_en, ${hintCol}`)
    .not(instrCol, 'is', null) as unknown as { data: Record<string, unknown>[] | null };
  const map = new Map<string, { instruction: string; hint: string | null }>();
  if (data) {
    for (const row of data) {
      const enInstr = row.instruction_en as string;
      const localInstr = row[instrCol] as string | null;
      const localHint = row[hintCol] as string | null;
      if (localInstr) {
        map.set(enInstr, { instruction: localInstr, hint: localHint });
      }
    }
  }
  return map;
}

/** UI label translations for recipe pages */
export const RECIPE_UI: Record<string, Record<Locale, string>> = {
  'stepImageAlt': { en: 'Step', fr: 'Étape', es: 'Paso', de: 'Schritt', pt: 'Passo' },
  'previousArticle': { en: 'Previous', fr: 'Précédent', es: 'Anterior', de: 'Vorheriger', pt: 'Anterior' },
  'nextArticle': { en: 'Next', fr: 'Suivant', es: 'Siguiente', de: 'Nächster', pt: 'Próximo' },
  'relatedArticles': { en: 'Related Articles', fr: 'Articles connexes', es: 'Artículos relacionados', de: 'Verwandte Artikel', pt: 'Artigos relacionados' },
  'affiliateDisclosure': {
    en: 'This post contains affiliate links. If you make a purchase through these links, we may earn a small commission at no extra cost to you.',
    fr: 'Cet article contient des liens affiliés. Si vous effectuez un achat via ces liens, nous pouvons recevoir une petite commission sans frais supplémentaires pour vous.',
    es: 'Este artículo contiene enlaces de afiliados. Si realiza una compra a través de estos enlaces, podemos recibir una pequeña comisión sin costo adicional para usted.',
    de: 'Dieser Beitrag enthält Affiliate-Links. Wenn Sie über diese Links einen Kauf tätigen, erhalten wir möglicherweise eine kleine Provision ohne zusätzliche Kosten für Sie.',
    pt: 'Este artigo contém links de afiliados. Se você fizer uma compra através desses links, podemos receber uma pequena comissão sem custo adicional para você.',
  },
  'changeLanguage': { en: 'Change language', fr: 'Changer de langue', es: 'Cambiar idioma', de: 'Sprache aendern', pt: 'Mudar idioma' },
  'affiliateNotice': { en: 'Affiliate Notice', fr: 'Avis d\'affiliation', es: 'Aviso de afiliación', de: 'Affiliate-Hinweis', pt: 'Aviso de afiliação' },
  'sponsor': { en: 'Sponsor', fr: 'Sponsor', es: 'Patrocinador', de: 'Sponsor', pt: 'Patrocinador' },
  'ingredients': { en: 'Ingredients', fr: 'Ingrédients', es: 'Ingredientes', de: 'Zutaten', pt: 'Ingredientes' },
  'directions': { en: 'Directions', fr: 'Instructions', es: 'Instrucciones', de: 'Zubereitung', pt: 'Modo de Preparo' },
  'cookMode': { en: 'Cook Mode', fr: 'Mode Cuisine', es: 'Modo Cocina', de: 'Kochmodus', pt: 'Modo Cozinha' },
  'beforeYouBegin': { en: 'Before You Begin', fr: 'Avant de Commencer', es: 'Antes de Comenzar', de: 'Bevor Sie Beginnen', pt: 'Antes de Começar' },
  'yourModel': { en: 'What Creami model do you have?', fr: 'Quel modèle Creami avez-vous ?', es: '¿Qué modelo Creami tiene?', de: 'Welches Creami-Modell haben Sie?', pt: 'Qual modelo Creami você tem?' },
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
  'ozPint': { en: 'oz pint', fr: 'oz', es: 'oz', de: 'oz Becher', pt: 'oz' },
  'printModelWarning': { en: 'You haven\'t selected your Creami model. Ingredients are shown for a standard 16oz pint. Select your model first to scale ingredients, or press OK to print anyway.', fr: 'Vous n\'avez pas sélectionné votre modèle Creami. Les ingrédients sont affichés pour un pot standard de 16 oz. Sélectionnez d\'abord votre modèle pour ajuster les quantités, ou appuyez sur OK pour imprimer quand même.', es: 'No ha seleccionado su modelo Creami. Los ingredientes se muestran para un recipiente estándar de 16 oz. Seleccione primero su modelo para ajustar las cantidades, o presione Aceptar para imprimir de todos modos.', de: 'Sie haben Ihr Creami-Modell nicht ausgewählt. Die Zutaten sind für einen Standard-16-oz-Becher angegeben. Wählen Sie zuerst Ihr Modell, um die Mengen anzupassen, oder klicken Sie auf OK, um trotzdem zu drucken.', pt: 'Você não selecionou seu modelo Creami. Os ingredientes são mostrados para um recipiente padrão de 16 oz. Selecione primeiro seu modelo para ajustar as quantidades, ou pressione OK para imprimir mesmo assim.' },
  'makes': { en: 'Makes', fr: 'Quantité', es: 'Rinde', de: 'Ergibt', pt: 'Rende' },
  'nutritionEstimate': { en: 'Estimated Nutrition (per serving)', fr: 'Nutrition Estimée (par portion)', es: 'Nutrición Estimada (por porción)', de: 'Geschätzte Nährwerte (pro Portion)', pt: 'Nutrição Estimada (por porção)' },
  'calories': { en: 'Calories', fr: 'Calories', es: 'Calorías', de: 'Kalorien', pt: 'Calorias' },
  'proteinLabel': { en: 'Protein', fr: 'Protéines', es: 'Proteína', de: 'Eiweiß', pt: 'Proteína' },
  'fatLabel': { en: 'Fat', fr: 'Lipides', es: 'Grasa', de: 'Fett', pt: 'Gordura' },
  'carbsLabel': { en: 'Carbs', fr: 'Glucides', es: 'Carbos', de: 'Kohlenhydrate', pt: 'Carboidratos' },
  'nutritionDisclaimer': { en: 'Estimates based on ingredient database. Actual values may vary.', fr: 'Estimations basées sur la base de données d\'ingrédients. Les valeurs réelles peuvent varier.', es: 'Estimaciones basadas en la base de datos de ingredientes. Los valores reales pueden variar.', de: 'Schätzungen basierend auf der Zutatendatenbank. Tatsächliche Werte können abweichen.', pt: 'Estimativas baseadas no banco de dados de ingredientes. Os valores reais podem variar.' },
  'youMayAlsoLike': { en: 'You May Also Like', fr: 'Vous Aimerez Aussi', es: 'También Te Puede Gustar', de: 'Das Könnte Ihnen Auch Gefallen', pt: 'Você Também Pode Gostar' },
  'swirlNoticeTitle': { en: 'Soft Serve Dispensing — Scoop & Swirl Only', fr: 'Distribution Glace Molle — Scoop & Swirl Uniquement', es: 'Dispensación de Helado Suave — Solo Scoop & Swirl', de: 'Softeis-Ausgabe — Nur Scoop & Swirl', pt: 'Dispensação de Sorvete Soft — Apenas Scoop & Swirl' },
  'swirlNoticeDesc': { en: 'This recipe uses the soft serve dispensing feature, which is exclusive to the Ninja CREAMi Scoop & Swirl (NC701). You can still make the base on any Creami model and scoop it, but the soft serve texture and dispensing experience require the Scoop & Swirl. For other models, our regular ice cream recipes may give better results.', fr: 'Cette recette utilise la fonction de distribution de glace molle, exclusive au Ninja CREAMi Scoop & Swirl (NC701). Vous pouvez toujours préparer la base avec n\'importe quel modèle Creami et la servir à la cuillère, mais la texture glace molle et l\'expérience de distribution nécessitent le Scoop & Swirl. Pour les autres modèles, nos recettes de crème glacée classiques donneront de meilleurs résultats.', es: 'Esta receta utiliza la función de dispensación de helado suave, exclusiva del Ninja CREAMi Scoop & Swirl (NC701). Aún puede preparar la base con cualquier modelo Creami y servirla con cuchara, pero la textura de helado suave y la experiencia de dispensación requieren el Scoop & Swirl. Para otros modelos, nuestras recetas de helado clásico pueden dar mejores resultados.', de: 'Dieses Rezept nutzt die Softeis-Ausgabefunktion, die exklusiv dem Ninja CREAMi Scoop & Swirl (NC701) vorbehalten ist. Sie können die Grundmasse mit jedem Creami-Modell zubereiten und portionieren, aber die Softeis-Textur und das Ausgabeerlebnis erfordern den Scoop & Swirl. Für andere Modelle liefern unsere klassischen Eiscreme-Rezepte möglicherweise bessere Ergebnisse.', pt: 'Esta receita utiliza a função de dispensação de sorvete soft, exclusiva do Ninja CREAMi Scoop & Swirl (NC701). Você ainda pode preparar a base com qualquer modelo Creami e servir com colher, mas a textura de sorvete soft e a experiência de dispensação exigem o Scoop & Swirl. Para outros modelos, nossas receitas de sorvete clássico podem dar melhores resultados.' },
  'italianIceNoticeTitle': { en: 'Italian Ice Program — Deluxe Models Only', fr: 'Programme Glace Italienne — Modeles Deluxe Uniquement', es: 'Programa de Helado Italiano — Solo Modelos Deluxe', de: 'Italian-Ice-Programm — Nur Deluxe-Modelle', pt: 'Programa Italian Ice — Apenas Modelos Deluxe' },
  'italianIceNoticeDesc': { en: 'This recipe uses the Italian Ice program, available only on the Ninja CREAMi Deluxe (NC501) and XL Deluxe 11-in-1. If your model does not have Italian Ice, use the Sorbet setting for a similar result. The texture will be slightly smoother than traditional Italian ice, but still delicious.', fr: 'Cette recette utilise le programme Italian Ice, disponible uniquement sur le Ninja CREAMi Deluxe (NC501) et XL Deluxe 11-in-1. Si votre modele ne dispose pas de ce programme, utilisez le reglage Sorbet pour un resultat similaire. La texture sera legerement plus lisse que la glace italienne traditionnelle, mais tout aussi delicieuse.', es: 'Esta receta utiliza el programa Italian Ice, disponible solo en el Ninja CREAMi Deluxe (NC501) y XL Deluxe 11-in-1. Si su modelo no tiene Italian Ice, use el modo Sorbete para un resultado similar. La textura sera ligeramente mas suave que el helado italiano tradicional, pero igualmente delicioso.', de: 'Dieses Rezept nutzt das Italian-Ice-Programm, das nur auf dem Ninja CREAMi Deluxe (NC501) und XL Deluxe 11-in-1 verfuegbar ist. Wenn Ihr Modell kein Italian Ice hat, verwenden Sie die Sorbet-Einstellung fuer ein aehnliches Ergebnis. Die Textur wird etwas glatter als traditionelles Italian Ice sein, aber dennoch koestlich.', pt: 'Esta receita utiliza o programa Italian Ice, disponivel apenas no Ninja CREAMi Deluxe (NC501) e XL Deluxe 11-in-1. Se seu modelo nao tem Italian Ice, use o modo Sorbet para um resultado similar. A textura sera ligeiramente mais suave que o Italian Ice tradicional, mas igualmente delicioso.' },
  'ingredientsScaled': { en: 'Ingredients scaled to {size}oz for your model.', fr: 'Ingrédients ajustés à {size} oz pour votre modèle.', es: 'Ingredientes ajustados a {size} oz para su modelo.', de: 'Zutaten auf {size} oz für Ihr Modell angepasst.', pt: 'Ingredientes ajustados para {size} oz do seu modelo.' },
  // Difficulty levels
  'beginner': { en: 'Beginner', fr: 'Débutant', es: 'Principiante', de: 'Anfänger', pt: 'Iniciante' },
  'intermediate': { en: 'Intermediate', fr: 'Intermédiaire', es: 'Intermedio', de: 'Mittel', pt: 'Intermediário' },
  'advanced': { en: 'Advanced', fr: 'Avancé', es: 'Avanzado', de: 'Fortgeschritten', pt: 'Avançado' },
  // Base types
  'Ice Cream': { en: 'Ice Cream', fr: 'Crème Glacée', es: 'Helado', de: 'Eiscreme', pt: 'Sorvete' },
  'Sorbet': { en: 'Sorbet', fr: 'Sorbet', es: 'Sorbete', de: 'Sorbet', pt: 'Sorbet' },
  'Gelato': { en: 'Gelato', fr: 'Gelato', es: 'Gelato', de: 'Gelato', pt: 'Gelato' },
  'Frozen Yogurt': { en: 'Frozen Yogurt', fr: 'Yaourt Glacé', es: 'Yogur Helado', de: 'Frozen Joghurt', pt: 'Iogurte Gelado' },
  'Milkshake': { en: 'Milkshake', fr: 'Milkshake', es: 'Batido', de: 'Milkshake', pt: 'Milkshake' },
  'Smoothie Bowl': { en: 'Smoothie Bowl', fr: 'Smoothie Bowl', es: 'Smoothie Bowl', de: 'Smoothie Bowl', pt: 'Smoothie Bowl' },
  'Lite Ice Cream': { en: 'Lite Ice Cream', fr: 'Crème Glacée Légère', es: 'Helado Ligero', de: 'Leichtes Eis', pt: 'Sorvete Light' },
  'Soft Serve': { en: 'Soft Serve', fr: 'Glace Molle', es: 'Helado Suave', de: 'Softeis', pt: 'Sorvete Soft' },
  'Italian Ice': { en: 'Italian Ice', fr: 'Granité Italien', es: 'Hielo Italiano', de: 'Italienisches Eis', pt: 'Granita Italiana' },
  // Reviews
  'reviews': { en: 'reviews', fr: 'avis', es: 'reseñas', de: 'Bewertungen', pt: 'avaliações' },
  'review': { en: 'review', fr: 'avis', es: 'reseña', de: 'Bewertung', pt: 'avaliação' },
  // Allergens
  'Dairy': { en: 'Dairy', fr: 'Produits laitiers', es: 'Lácteos', de: 'Milchprodukte', pt: 'Laticínios' },
  'Nuts': { en: 'Nuts', fr: 'Fruits à coque', es: 'Frutos secos', de: 'Nüsse', pt: 'Oleaginosas' },
  'Peanuts': { en: 'Peanuts', fr: 'Arachides', es: 'Cacahuetes', de: 'Erdnüsse', pt: 'Amendoim' },
  'Gluten': { en: 'Gluten', fr: 'Gluten', es: 'Gluten', de: 'Gluten', pt: 'Glúten' },
  'Eggs': { en: 'Eggs', fr: 'Œufs', es: 'Huevos', de: 'Eier', pt: 'Ovos' },
  'Soy': { en: 'Soy', fr: 'Soja', es: 'Soja', de: 'Soja', pt: 'Soja' },
  'Sesame': { en: 'Sesame', fr: 'Sésame', es: 'Sésamo', de: 'Sesam', pt: 'Gergelim' },
  // Dietary categories
  'Dairy-Free': { en: 'Dairy-Free', fr: 'Sans Produits Laitiers', es: 'Sin Lácteos', de: 'Milchfrei', pt: 'Sem Laticínios' },
  'Gluten-Free': { en: 'Gluten-Free', fr: 'Sans Gluten', es: 'Sin Gluten', de: 'Glutenfrei', pt: 'Sem Glúten' },
  'High Protein': { en: 'High Protein', fr: 'Riche en Protéines', es: 'Alto en Proteína', de: 'Proteinreich', pt: 'Rico em Proteína' },
  'Keto': { en: 'Keto', fr: 'Cétogène', es: 'Keto', de: 'Keto', pt: 'Cetogênico' },
  'Sugar-Free': { en: 'Sugar-Free', fr: 'Sans Sucre', es: 'Sin Azúcar', de: 'Zuckerfrei', pt: 'Sem Açúcar' },
  'Vegan': { en: 'Vegan', fr: 'Végan', es: 'Vegano', de: 'Vegan', pt: 'Vegano' },
  // Flavor profile categories
  'Candy & Cookie': { en: 'Candy & Cookie', fr: 'Bonbons & Biscuits', es: 'Dulces y Galletas', de: 'Süßigkeiten & Kekse', pt: 'Doces e Biscoitos' },
  'Caramel': { en: 'Caramel', fr: 'Caramel', es: 'Caramelo', de: 'Karamell', pt: 'Caramelo' },
  'Chocolate': { en: 'Chocolate', fr: 'Chocolat', es: 'Chocolate', de: 'Schokolade', pt: 'Chocolate' },
  'Coffee': { en: 'Coffee', fr: 'Café', es: 'Café', de: 'Kaffee', pt: 'Café' },
  'Fruity': { en: 'Fruity', fr: 'Fruité', es: 'Afrutado', de: 'Fruchtig', pt: 'Frutado' },
  'Mint': { en: 'Mint', fr: 'Menthe', es: 'Menta', de: 'Minze', pt: 'Hortelã' },
  'Nutty': { en: 'Nutty', fr: 'Aux Noix', es: 'De Frutos Secos', de: 'Nussig', pt: 'De Oleaginosas' },
  'Tropical': { en: 'Tropical', fr: 'Tropical', es: 'Tropical', de: 'Tropisch', pt: 'Tropical' },
  'Vanilla': { en: 'Vanilla', fr: 'Vanille', es: 'Vainilla', de: 'Vanille', pt: 'Baunilha' },
  'Spice & Floral': { en: 'Spice & Floral', fr: 'Épices & Fleurs', es: 'Especias y Flores', de: 'Gewürze & Blüten', pt: 'Especiarias e Flores' },
  'Tea & Matcha': { en: 'Tea & Matcha', fr: 'Thé & Matcha', es: 'Té y Matcha', de: 'Tee & Matcha', pt: 'Chá e Matcha' },
};

export function ui(key: string, locale: Locale): string {
  return RECIPE_UI[key]?.[locale] ?? RECIPE_UI[key]?.['en'] ?? key;
}

/** FAQ template translations — each returns {question, answer} with dynamic values */
type FaqTemplate = (vars: Record<string, string | number>) => { question: string; answer: string };

const FAQ_TEMPLATES: Record<string, Record<Locale, FaqTemplate>> = {
  storage: {
    en: (v) => ({ question: `How long does ${v.title} last in the freezer?`, answer: `Once processed in the Ninja Creami, ${v.title} is best enjoyed immediately for the creamiest texture. You can refreeze it for up to 2 weeks — just let it sit at room temperature for 5-10 minutes before re-processing with the Re-Spin function.` }),
    fr: (v) => ({ question: `Combien de temps se conserve ${v.title} au congélateur ?`, answer: `Une fois préparé dans le Ninja Creami, ${v.title} se déguste de préférence immédiatement pour une texture optimale. Vous pouvez le recongeler jusqu'à 2 semaines — laissez-le reposer 5 à 10 minutes à température ambiante avant de le retraiter avec la fonction Re-Spin.` }),
    es: (v) => ({ question: `¿Cuánto dura ${v.title} en el congelador?`, answer: `Una vez procesado en el Ninja Creami, ${v.title} se disfruta mejor inmediatamente para obtener la textura más cremosa. Puede recongelarlo hasta 2 semanas — déjelo reposar 5-10 minutos a temperatura ambiente antes de reprocesarlo con la función Re-Spin.` }),
    de: (v) => ({ question: `Wie lange hält sich ${v.title} im Gefrierfach?`, answer: `Nach der Verarbeitung im Ninja Creami schmeckt ${v.title} sofort am besten. Sie können es bis zu 2 Wochen wieder einfrieren — lassen Sie es 5-10 Minuten bei Raumtemperatur stehen, bevor Sie es mit der Re-Spin-Funktion erneut verarbeiten.` }),
    pt: (v) => ({ question: `Quanto tempo ${v.title} dura no congelador?`, answer: `Depois de processado no Ninja Creami, ${v.title} fica melhor servido imediatamente para a textura mais cremosa. Você pode recongelar por até 2 semanas — deixe descansar 5-10 minutos em temperatura ambiente antes de reprocessar com a função Re-Spin.` }),
  },
  modelSwirl: {
    en: (v) => ({ question: `Which Ninja Creami models can make ${v.title}?`, answer: `This recipe uses the swirl dispensing feature, which is exclusive to the Ninja CREAMi Scoop & Swirl (NC701). Other models can make the base recipe but cannot dispense it as a swirl.` }),
    fr: (v) => ({ question: `Quels modèles Ninja Creami peuvent préparer ${v.title} ?`, answer: `Cette recette utilise la fonction de distribution en spirale, exclusive au Ninja CREAMi Scoop & Swirl (NC701). Les autres modèles peuvent préparer la base mais ne peuvent pas la distribuer en spirale.` }),
    es: (v) => ({ question: `¿Qué modelos Ninja Creami pueden preparar ${v.title}?`, answer: `Esta receta utiliza la función de dispensación en espiral, exclusiva del Ninja CREAMi Scoop & Swirl (NC701). Los demás modelos pueden preparar la base pero no pueden dispensarla en espiral.` }),
    de: (v) => ({ question: `Welche Ninja Creami Modelle können ${v.title} zubereiten?`, answer: `Dieses Rezept nutzt die Swirl-Dispensfunktion, die exklusiv dem Ninja CREAMi Scoop & Swirl (NC701) vorbehalten ist. Andere Modelle können die Grundmasse zubereiten, aber nicht als Swirl ausgeben.` }),
    pt: (v) => ({ question: `Quais modelos Ninja Creami podem preparar ${v.title}?`, answer: `Esta receita utiliza a função de dispensação em espiral, exclusiva do Ninja CREAMi Scoop & Swirl (NC701). Os outros modelos podem preparar a base, mas não podem dispensá-la em espiral.` }),
  },
  modelAll: {
    en: (v) => ({ question: `Which Ninja Creami models can make ${v.title}?`, answer: `This recipe works with all Ninja CREAMi models — the 7-in-1 (NC301), Deluxe, XL Deluxe 11-in-1 (NC501), and Scoop & Swirl (NC701). It also works with discontinued models like the Breeze (NC100) and original 5-in-1 (NC300). The ingredients are sized for a standard 16oz pint. If you have a 24oz Deluxe or XL Deluxe model, use our built-in ingredient scaler to adjust the quantities up.` }),
    fr: (v) => ({ question: `Quels modèles Ninja Creami peuvent préparer ${v.title} ?`, answer: `Cette recette fonctionne avec tous les modèles Ninja CREAMi — le 7-en-1 (NC301), le Deluxe, le XL Deluxe 11-en-1 (NC501) et le Scoop & Swirl (NC701). Elle fonctionne aussi avec les modèles discontinués comme le Breeze (NC100) et l'original 5-en-1 (NC300). Les quantités sont prévues pour un pot standard de 16 oz. Si vous avez un modèle Deluxe ou XL Deluxe de 24 oz, utilisez notre outil de mise à l'échelle pour ajuster les quantités.` }),
    es: (v) => ({ question: `¿Qué modelos Ninja Creami pueden preparar ${v.title}?`, answer: `Esta receta funciona con todos los modelos Ninja CREAMi — el 7-en-1 (NC301), el Deluxe, el XL Deluxe 11-en-1 (NC501) y el Scoop & Swirl (NC701). También funciona con modelos descontinuados como el Breeze (NC100) y el original 5-en-1 (NC300). Las cantidades son para un recipiente estándar de 16 oz. Si tiene un modelo Deluxe o XL Deluxe de 24 oz, use nuestro escalador de ingredientes para ajustar las cantidades.` }),
    de: (v) => ({ question: `Welche Ninja Creami Modelle können ${v.title} zubereiten?`, answer: `Dieses Rezept funktioniert mit allen Ninja CREAMi Modellen — dem 7-in-1 (NC301), dem Deluxe, dem XL Deluxe 11-in-1 (NC501) und dem Scoop & Swirl (NC701). Es funktioniert auch mit eingestellten Modellen wie dem Breeze (NC100) und dem Original 5-in-1 (NC300). Die Zutaten sind für einen Standard-16-oz-Becher bemessen. Wenn Sie ein 24-oz-Deluxe- oder XL-Deluxe-Modell haben, nutzen Sie unseren Zutaten-Umrechner, um die Mengen anzupassen.` }),
    pt: (v) => ({ question: `Quais modelos Ninja Creami podem preparar ${v.title}?`, answer: `Esta receita funciona com todos os modelos Ninja CREAMi — o 7-em-1 (NC301), o Deluxe, o XL Deluxe 11-em-1 (NC501) e o Scoop & Swirl (NC701). Também funciona com modelos descontinuados como o Breeze (NC100) e o original 5-em-1 (NC300). Os ingredientes são para um recipiente padrão de 16 oz. Se você tem um modelo Deluxe ou XL Deluxe de 24 oz, use nosso escalador de ingredientes para ajustar as quantidades.` }),
  },
  beginner: {
    en: (v) => ({ question: `Is ${v.title} easy to make?`, answer: `Yes! This is a beginner-friendly recipe with just ${v.ingredientCount} ingredients and ${v.stepCount} simple steps. It's a great recipe if you're new to the Ninja Creami.` }),
    fr: (v) => ({ question: `Est-ce que ${v.title} est facile à préparer ?`, answer: `Oui ! C'est une recette idéale pour les débutants avec seulement ${v.ingredientCount} ingrédients et ${v.stepCount} étapes simples. Parfaite si vous débutez avec le Ninja Creami.` }),
    es: (v) => ({ question: `¿Es fácil preparar ${v.title}?`, answer: `¡Sí! Esta es una receta ideal para principiantes con solo ${v.ingredientCount} ingredientes y ${v.stepCount} pasos sencillos. Es perfecta si eres nuevo con el Ninja Creami.` }),
    de: (v) => ({ question: `Ist ${v.title} einfach zuzubereiten?`, answer: `Ja! Dies ist ein anfängerfreundliches Rezept mit nur ${v.ingredientCount} Zutaten und ${v.stepCount} einfachen Schritten. Perfekt, wenn Sie neu beim Ninja Creami sind.` }),
    pt: (v) => ({ question: `${v.title} é fácil de preparar?`, answer: `Sim! Esta é uma receita ideal para iniciantes com apenas ${v.ingredientCount} ingredientes e ${v.stepCount} passos simples. Perfeita se você é novo com o Ninja Creami.` }),
  },
  dietary: {
    en: (v) => ({ question: `Is ${v.title} suitable for special diets?`, answer: `Yes, this recipe is: ${v.diets}. Always check individual ingredient labels to confirm they meet your specific dietary requirements.` }),
    fr: (v) => ({ question: `${v.title} convient-il aux régimes spéciaux ?`, answer: `Oui, cette recette est : ${v.diets}. Vérifiez toujours les étiquettes de chaque ingrédient pour confirmer qu'ils correspondent à vos besoins alimentaires.` }),
    es: (v) => ({ question: `¿${v.title} es apto para dietas especiales?`, answer: `Sí, esta receta es: ${v.diets}. Siempre verifique las etiquetas de cada ingrediente para confirmar que cumplen con sus requisitos dietéticos.` }),
    de: (v) => ({ question: `Ist ${v.title} für spezielle Ernährungsformen geeignet?`, answer: `Ja, dieses Rezept ist: ${v.diets}. Überprüfen Sie immer die Etiketten der einzelnen Zutaten, um sicherzustellen, dass sie Ihren Ernährungsanforderungen entsprechen.` }),
    pt: (v) => ({ question: `${v.title} é adequado para dietas especiais?`, answer: `Sim, esta receita é: ${v.diets}. Sempre verifique os rótulos de cada ingrediente para confirmar que atendem às suas necessidades alimentares.` }),
  },
  crumbly: {
    en: (v) => ({ question: `What if my ${v.baseType} comes out crumbly?`, answer: `This is normal after the first spin. Select the Re-Spin function for a smoother, creamier result. If it's still crumbly after two re-spins, let the pint sit at room temperature for 3-5 minutes, then try again.` }),
    fr: (v) => ({ question: `Que faire si mon ${v.baseType} est granuleux ?`, answer: `C'est normal après le premier cycle. Sélectionnez la fonction Re-Spin pour un résultat plus lisse et crémeux. Si c'est encore granuleux après deux cycles, laissez le pot reposer 3 à 5 minutes à température ambiante, puis réessayez.` }),
    es: (v) => ({ question: `¿Qué hago si mi ${v.baseType} sale grumoso?`, answer: `Es normal después del primer ciclo. Seleccione la función Re-Spin para un resultado más suave y cremoso. Si sigue grumoso después de dos ciclos, deje el recipiente reposar 3-5 minutos a temperatura ambiente e intente de nuevo.` }),
    de: (v) => ({ question: `Was tun, wenn mein ${v.baseType} krümelig ist?`, answer: `Das ist nach dem ersten Durchgang normal. Wählen Sie die Re-Spin-Funktion für ein glatteres, cremigeres Ergebnis. Wenn es nach zwei Durchgängen noch krümelig ist, lassen Sie den Becher 3-5 Minuten bei Raumtemperatur stehen und versuchen Sie es erneut.` }),
    pt: (v) => ({ question: `E se meu ${v.baseType} ficar granuloso?`, answer: `Isso é normal após o primeiro ciclo. Selecione a função Re-Spin para um resultado mais liso e cremoso. Se ainda estiver granuloso após dois ciclos, deixe o recipiente descansar 3-5 minutos em temperatura ambiente e tente novamente.` }),
  },
  extract: {
    en: () => ({ question: `How much extract should I use? Can I add more for stronger flavor?`, answer: `Extracts are highly concentrated — a little goes a long way. Start with the amount listed and taste the base before freezing. You can always add more, but you can't remove it. Peppermint extract is especially potent — even 1/4 teaspoon extra can make it overpowering.` }),
    fr: () => ({ question: `Quelle quantité d'extrait dois-je utiliser ? Puis-je en ajouter pour un goût plus prononcé ?`, answer: `Les extraits sont très concentrés — une petite quantité suffit. Commencez par la quantité indiquée et goûtez la base avant de congeler. Vous pouvez toujours en ajouter, mais vous ne pouvez pas en retirer. L'extrait de menthe poivrée est particulièrement puissant — même 1/4 de cuillère à café de trop peut rendre le goût trop fort.` }),
    es: () => ({ question: `¿Cuánto extracto debo usar? ¿Puedo agregar más para un sabor más intenso?`, answer: `Los extractos son muy concentrados — un poco rinde mucho. Comience con la cantidad indicada y pruebe la base antes de congelar. Siempre puede agregar más, pero no puede quitarlo. El extracto de menta es especialmente potente — incluso 1/4 de cucharadita extra puede hacerlo demasiado fuerte.` }),
    de: () => ({ question: `Wie viel Extrakt soll ich verwenden? Kann ich mehr für intensiveren Geschmack hinzufügen?`, answer: `Extrakte sind hochkonzentriert — eine kleine Menge reicht weit. Beginnen Sie mit der angegebenen Menge und probieren Sie die Grundmasse vor dem Einfrieren. Sie können immer mehr hinzufügen, aber nicht entfernen. Pfefferminzextrakt ist besonders intensiv — selbst 1/4 Teelöffel zu viel kann den Geschmack überwältigend machen.` }),
    pt: () => ({ question: `Quanto extrato devo usar? Posso adicionar mais para um sabor mais intenso?`, answer: `Os extratos são altamente concentrados — um pouco rende muito. Comece com a quantidade indicada e prove a base antes de congelar. Você sempre pode adicionar mais, mas não pode remover. O extrato de hortelã é especialmente potente — mesmo 1/4 de colher de chá a mais pode tornar o sabor muito forte.` }),
  },
  protein: {
    en: () => ({ question: `Why does my protein ice cream need more re-spins?`, answer: `Protein-based recipes are denser and harder when frozen. It's completely normal to need 2-3 re-spins to achieve a creamy texture. Adding a tablespoon of cream cheese to the base can dramatically improve the texture of protein recipes.` }),
    fr: () => ({ question: `Pourquoi ma glace protéinée nécessite-t-elle plus de cycles ?`, answer: `Les recettes à base de protéines sont plus denses et plus dures une fois congelées. Il est tout à fait normal de devoir relancer 2 à 3 fois pour obtenir une texture crémeuse. Ajouter une cuillère à soupe de fromage frais à la base peut considérablement améliorer la texture des recettes protéinées.` }),
    es: () => ({ question: `¿Por qué mi helado de proteína necesita más reprocesamiento?`, answer: `Las recetas a base de proteína son más densas y duras cuando están congeladas. Es completamente normal necesitar 2-3 reprocesados para lograr una textura cremosa. Agregar una cucharada de queso crema a la base puede mejorar drásticamente la textura de las recetas de proteína.` }),
    de: () => ({ question: `Warum braucht mein Protein-Eis mehr Durchgänge?`, answer: `Proteinbasierte Rezepte sind dichter und härter im gefrorenen Zustand. Es ist völlig normal, 2-3 erneute Durchgänge zu benötigen, um eine cremige Textur zu erreichen. Ein Esslöffel Frischkäse in der Grundmasse kann die Textur von Proteinrezepten deutlich verbessern.` }),
    pt: () => ({ question: `Por que meu sorvete de proteína precisa de mais reprocessamentos?`, answer: `Receitas à base de proteína são mais densas e duras quando congeladas. É completamente normal precisar de 2-3 reprocessamentos para obter uma textura cremosa. Adicionar uma colher de sopa de cream cheese à base pode melhorar drasticamente a textura das receitas de proteína.` }),
  },
  nutButter: {
    en: () => ({ question: `Should I warm the nut butter before adding it?`, answer: `For mix-ins and swirls, yes — microwave the nut butter for 10-15 seconds so it's drizzleable. This creates beautiful swirl ribbons. For the base, blend it cold with the other ingredients until completely smooth.` }),
    fr: () => ({ question: `Faut-il réchauffer le beurre de noix avant de l'ajouter ?`, answer: `Pour les garnitures et les spirales, oui — passez le beurre de noix au micro-ondes 10-15 secondes pour qu'il soit fluide. Cela crée de belles spirales. Pour la base, mixez-le froid avec les autres ingrédients jusqu'à obtenir un mélange parfaitement lisse.` }),
    es: () => ({ question: `¿Debo calentar la mantequilla de frutos secos antes de agregarla?`, answer: `Para los mix-ins y remolinos, sí — caliente la mantequilla en el microondas 10-15 segundos para que sea vertible. Esto crea hermosas líneas en espiral. Para la base, licúela fría con los demás ingredientes hasta obtener una mezcla completamente homogénea.` }),
    de: () => ({ question: `Sollte ich die Nussbutter vor dem Hinzufügen erwärmen?`, answer: `Für Mix-Ins und Wirbel, ja — erwärmen Sie die Nussbutter 10-15 Sekunden in der Mikrowelle, damit sie gießbar ist. Das erzeugt wunderschöne Wirbelstreifen. Für die Grundmasse mixen Sie sie kalt mit den anderen Zutaten, bis alles vollständig glatt ist.` }),
    pt: () => ({ question: `Devo aquecer a manteiga de oleaginosas antes de adicionar?`, answer: `Para mix-ins e espirais, sim — aqueça a manteiga no micro-ondas por 10-15 segundos para que fique fluida. Isso cria lindas faixas em espiral. Para a base, bata-a fria com os outros ingredientes até ficar completamente homogêneo.` }),
  },
  alcohol: {
    en: () => ({ question: `Will the alcohol prevent this from freezing?`, answer: `Small amounts of alcohol (1-2 tablespoons) actually improve texture by slightly lowering the freezing point. However, too much will prevent the base from freezing solid, which is required for the Ninja Creami to process it. Stick to the amount listed in the recipe.` }),
    fr: () => ({ question: `L'alcool empêchera-t-il la congélation ?`, answer: `De petites quantités d'alcool (1-2 cuillères à soupe) améliorent en fait la texture en abaissant légèrement le point de congélation. Cependant, trop d'alcool empêchera la base de geler complètement, ce qui est nécessaire pour que le Ninja Creami puisse la traiter. Respectez la quantité indiquée dans la recette.` }),
    es: () => ({ question: `¿El alcohol evitará que se congele?`, answer: `Pequeñas cantidades de alcohol (1-2 cucharadas) mejoran la textura al reducir ligeramente el punto de congelación. Sin embargo, demasiado alcohol impedirá que la base se congele por completo, lo cual es necesario para que el Ninja Creami la procese. Respete la cantidad indicada en la receta.` }),
    de: () => ({ question: `Verhindert der Alkohol das Einfrieren?`, answer: `Kleine Mengen Alkohol (1-2 Esslöffel) verbessern tatsächlich die Textur, da sie den Gefrierpunkt leicht senken. Zu viel verhindert jedoch, dass die Grundmasse fest gefriert, was für die Verarbeitung im Ninja Creami erforderlich ist. Halten Sie sich an die im Rezept angegebene Menge.` }),
    pt: () => ({ question: `O álcool vai impedir o congelamento?`, answer: `Pequenas quantidades de álcool (1-2 colheres de sopa) na verdade melhoram a textura ao reduzir levemente o ponto de congelamento. No entanto, muito álcool impedirá a base de congelar completamente, o que é necessário para o Ninja Creami processá-la. Siga a quantidade indicada na receita.` }),
  },
  freshFruit: {
    en: () => ({ question: `Can I use fresh fruit instead of frozen?`, answer: `Yes! Fresh fruit works great — just blend it smooth before pouring into the Creami pint. The frozen fruit in this recipe is for convenience and sometimes creates a thicker base. Either way, the Creami will freeze and process it the same way.` }),
    fr: () => ({ question: `Puis-je utiliser des fruits frais au lieu de surgelés ?`, answer: `Oui ! Les fruits frais fonctionnent très bien — mixez-les simplement jusqu'à obtenir un mélange lisse avant de verser dans le pot Creami. Les fruits surgelés dans cette recette sont utilisés par commodité et créent parfois une base plus épaisse. Dans les deux cas, le Creami congèlera et traitera le mélange de la même manière.` }),
    es: () => ({ question: `¿Puedo usar fruta fresca en lugar de congelada?`, answer: `¡Sí! La fruta fresca funciona muy bien — simplemente licúela hasta obtener una mezcla homogénea antes de verterla en el recipiente Creami. La fruta congelada en esta receta es por comodidad y a veces crea una base más espesa. De cualquier manera, el Creami la congelará y procesará igual.` }),
    de: () => ({ question: `Kann ich frisches Obst statt gefrorenem verwenden?`, answer: `Ja! Frisches Obst funktioniert hervorragend — mixen Sie es einfach glatt, bevor Sie es in den Creami-Becher gießen. Das gefrorene Obst in diesem Rezept ist der Einfachheit halber und erzeugt manchmal eine dickere Grundmasse. So oder so friert und verarbeitet der Creami es auf die gleiche Weise.` }),
    pt: () => ({ question: `Posso usar frutas frescas em vez de congeladas?`, answer: `Sim! Frutas frescas funcionam muito bem — basta batê-las até ficar homogêneo antes de despejar no recipiente Creami. As frutas congeladas nesta receita são por conveniência e às vezes criam uma base mais espessa. De qualquer forma, o Creami congela e processa da mesma maneira.` }),
  },
  creamCheese: {
    en: () => ({ question: `Why does this recipe use cream cheese?`, answer: `Cream cheese is a Ninja Creami secret weapon — it acts as a natural stabilizer, preventing icy texture and creating an incredibly smooth, scoopable result. Make sure to soften it completely (microwave 10-15 seconds) and whisk until smooth before adding other liquids.` }),
    fr: () => ({ question: `Pourquoi cette recette utilise-t-elle du fromage frais ?`, answer: `Le fromage frais est l'arme secrète du Ninja Creami — il agit comme stabilisant naturel, empêchant la formation de cristaux de glace et créant un résultat incroyablement lisse et facile à servir. Assurez-vous de bien le ramollir (micro-ondes 10-15 secondes) et de fouetter jusqu'à obtenir un mélange lisse avant d'ajouter les autres liquides.` }),
    es: () => ({ question: `¿Por qué esta receta usa queso crema?`, answer: `El queso crema es el arma secreta del Ninja Creami — actúa como estabilizante natural, evitando una textura helada y creando un resultado increíblemente suave y fácil de servir. Asegúrese de ablandarlo completamente (microondas 10-15 segundos) y batir hasta que esté homogéneo antes de agregar los demás líquidos.` }),
    de: () => ({ question: `Warum verwendet dieses Rezept Frischkäse?`, answer: `Frischkäse ist die Geheimwaffe des Ninja Creami — er wirkt als natürlicher Stabilisator, verhindert eine eisige Textur und sorgt für ein unglaublich glattes, portionierbares Ergebnis. Achten Sie darauf, ihn vollständig weich werden zu lassen (Mikrowelle 10-15 Sekunden) und glatt zu rühren, bevor Sie andere Flüssigkeiten hinzufügen.` }),
    pt: () => ({ question: `Por que esta receita usa cream cheese?`, answer: `O cream cheese é a arma secreta do Ninja Creami — ele age como estabilizante natural, evitando textura gelada e criando um resultado incrivelmente liso e fácil de servir. Certifique-se de amolecê-lo completamente (micro-ondas 10-15 segundos) e misturar até ficar homogêneo antes de adicionar os outros líquidos.` }),
  },
  coconutMilk: {
    en: () => ({ question: `Do I need full-fat coconut milk?`, answer: `Yes — full-fat coconut milk (17-22% fat) is essential for a creamy result. Lite coconut milk (5-7% fat) has too much water and will produce an icy, hard texture. Look for canned coconut milk (not the carton kind meant for drinking, which is only 2-4% fat). Shake the can vigorously before opening to combine the separated cream and water layers. Brands like Thai Kitchen and Aroy-D are popular choices.` }),
    fr: () => ({ question: `Faut-il du lait de coco entier ?`, answer: `Oui — le lait de coco entier (17-22 % de matières grasses) est indispensable pour un résultat crémeux. Le lait de coco allégé (5-7 % de MG) contient trop d'eau et produira une texture dure et glacée. Choisissez du lait de coco en conserve (pas celui en brique destiné à être bu, qui ne contient que 2-4 % de MG). Secouez vigoureusement la boîte avant de l'ouvrir pour mélanger la crème et l'eau séparées. Les marques Thai Kitchen et Aroy-D sont des choix populaires.` }),
    es: () => ({ question: `¿Necesito leche de coco entera?`, answer: `Sí — la leche de coco entera (17-22% de grasa) es esencial para un resultado cremoso. La leche de coco light (5-7% de grasa) tiene demasiada agua y producirá una textura dura y helada. Busque leche de coco enlatada (no la de cartón para beber, que solo tiene 2-4% de grasa). Agite bien la lata antes de abrirla para mezclar las capas de crema y agua separadas. Thai Kitchen y Aroy-D son marcas populares.` }),
    de: () => ({ question: `Brauche ich Vollfett-Kokosmilch?`, answer: `Ja — Vollfett-Kokosmilch (17-22% Fett) ist für ein cremiges Ergebnis unerlässlich. Fettarme Kokosmilch (5-7% Fett) enthält zu viel Wasser und erzeugt eine harte, eisige Textur. Wählen Sie Kokosmilch aus der Dose (nicht die Trinkvariante aus dem Karton mit nur 2-4% Fett). Schütteln Sie die Dose vor dem Öffnen kräftig, um die getrennte Sahne- und Wasserschicht zu vermischen. Thai Kitchen und Aroy-D sind beliebte Marken.` }),
    pt: () => ({ question: `Preciso de leite de coco integral?`, answer: `Sim — o leite de coco integral (17-22% de gordura) é essencial para um resultado cremoso. O leite de coco light (5-7% de gordura) tem muita água e produzirá uma textura dura e gelada. Procure leite de coco em lata (não o de caixinha para beber, que tem apenas 2-4% de gordura). Agite bem a lata antes de abrir para misturar as camadas separadas de creme e água. Thai Kitchen e Aroy-D são marcas populares.` }),
  },
  wholeMilk: {
    en: () => ({ question: `What kind of milk should I use? Is whole milk the same as homo milk?`, answer: `Yes — whole milk, homogenized milk (homo milk), vitamin D milk, and full-fat milk are all the same thing: 3.25% milk fat (MF). Do NOT substitute with 2%, 1%, or skim/0%. The fat is critical for creamy texture. International equivalents: UK "full-fat milk" (3.5%), Australia "full cream milk" (3.4%), France "lait entier" (3.5%). All work perfectly.` }),
    fr: () => ({ question: `Quel type de lait dois-je utiliser ? Le lait entier est-il le même que le lait homogénéisé ?`, answer: `Oui — le lait entier, le lait homogénéisé et le lait vitaminé D sont tous identiques : 3,25 % de matières grasses (MG). Ne substituez PAS avec du lait 2 %, 1 % ou écrémé/0 %. La matière grasse est essentielle pour une texture crémeuse. Équivalents internationaux : Royaume-Uni « full-fat milk » (3,5 %), Australie « full cream milk » (3,4 %). Tous fonctionnent parfaitement.` }),
    es: () => ({ question: `¿Qué tipo de leche debo usar? ¿La leche entera es lo mismo que la leche homogeneizada?`, answer: `Sí — la leche entera, la leche homogeneizada y la leche con vitamina D son lo mismo: 3,25% de grasa láctea. NO sustituya con leche al 2%, 1% o descremada/0%. La grasa es fundamental para una textura cremosa. Equivalentes internacionales: Reino Unido "full-fat milk" (3,5%), Australia "full cream milk" (3,4%), Francia "lait entier" (3,5%). Todos funcionan perfectamente.` }),
    de: () => ({ question: `Welche Milch soll ich verwenden? Ist Vollmilch dasselbe wie homogenisierte Milch?`, answer: `Ja — Vollmilch, homogenisierte Milch und Vitamin-D-Milch sind alle dasselbe: 3,25% Milchfett. Ersetzen Sie sie NICHT durch 2%-, 1%- oder Magermilch/0%. Das Fett ist entscheidend für eine cremige Textur. Internationale Entsprechungen: UK „full-fat milk" (3,5%), Australien „full cream milk" (3,4%), Frankreich „lait entier" (3,5%). Alle funktionieren perfekt.` }),
    pt: () => ({ question: `Que tipo de leite devo usar? Leite integral é o mesmo que leite homogeneizado?`, answer: `Sim — leite integral, leite homogeneizado e leite com vitamina D são todos a mesma coisa: 3,25% de gordura láctea. NÃO substitua por leite 2%, 1% ou desnatado/0%. A gordura é fundamental para uma textura cremosa. Equivalentes internacionais: Reino Unido "full-fat milk" (3,5%), Austrália "full cream milk" (3,4%), França "lait entier" (3,5%). Todos funcionam perfeitamente.` }),
  },
  heavyCream: {
    en: () => ({ question: `What's the difference between heavy cream, heavy whipping cream, and whipping cream?`, answer: `Heavy cream and heavy whipping cream are the same thing: 36% milk fat (MF). Use either interchangeably. Whipping cream (30-35% MF) works well too, slightly lighter. Half-and-half (10-12% MF) — do NOT use as a substitute. International equivalents: UK "double cream" (48% MF — use 3/4 the amount), Australia "thickened cream" (35% MF), France "crème entière" (30-40% MF).` }),
    fr: () => ({ question: `Quelle est la différence entre crème épaisse, crème à fouetter et crème fleurette ?`, answer: `La crème épaisse et la crème à fouetter épaisse sont identiques : 36 % de MG. Utilisez l'une ou l'autre. La crème fleurette (30-35 % MG) fonctionne aussi, légèrement plus légère. Le demi-crème (10-12 % MG) — ne l'utilisez PAS comme substitut. Équivalents internationaux : UK « double cream » (48 % MG — utilisez 3/4 de la quantité), Australie « thickened cream » (35 % MG).` }),
    es: () => ({ question: `¿Cuál es la diferencia entre crema espesa, crema para batir y nata?`, answer: `La crema espesa y la crema para batir espesa son lo mismo: 36% de grasa láctea. Use cualquiera indistintamente. La crema para batir (30-35% MG) también funciona, ligeramente más ligera. La media crema (10-12% MG) — NO la use como sustituto. Equivalentes internacionales: UK "double cream" (48% MG — use 3/4 de la cantidad), Australia "thickened cream" (35% MG), Francia "crème entière" (30-40% MG).` }),
    de: () => ({ question: `Was ist der Unterschied zwischen Schlagsahne, schwerer Sahne und Sahne?`, answer: `Schlagsahne und schwere Sahne (heavy cream) sind dasselbe: 36% Milchfett. Verwenden Sie beide austauschbar. Schlagsahne (30-35% MF) funktioniert auch gut, etwas leichter. Kaffeesahne (10-12% MF) — NICHT als Ersatz verwenden. Internationale Entsprechungen: UK „double cream" (48% MF — verwenden Sie 3/4 der Menge), Australien „thickened cream" (35% MF), Frankreich „crème entière" (30-40% MF).` }),
    pt: () => ({ question: `Qual a diferença entre creme de leite fresco, creme de leite para bater e creme de leite?`, answer: `O creme de leite fresco e o creme de leite para bater espesso são a mesma coisa: 36% de gordura láctea. Use qualquer um. O creme de leite para bater (30-35% MG) também funciona, ligeiramente mais leve. O creme de leite de caixinha (10-12% MG) — NÃO use como substituto. Equivalentes internacionais: UK "double cream" (48% MG — use 3/4 da quantidade), Austrália "thickened cream" (35% MG), França "crème entière" (30-40% MG).` }),
  },
  sweetener: {
    en: () => ({ question: `Can I substitute a different sweetener for granulated sugar?`, answer: `Sugar does more than sweeten — it lowers the freezing point and prevents icy texture. You can substitute with: allulose (best for keto — doesn't crystallize when frozen), coconut sugar (1:1 swap but darker color), or monk fruit blend (1:1 swap). Avoid liquid sweeteners like honey or maple syrup as a full replacement — they change the liquid ratio.` }),
    fr: () => ({ question: `Puis-je utiliser un autre édulcorant à la place du sucre en poudre ?`, answer: `Le sucre fait plus que sucrer — il abaisse le point de congélation et empêche la formation de cristaux de glace. Vous pouvez le remplacer par : de l'allulose (idéal pour le régime cétogène — ne cristallise pas une fois congelé), du sucre de coco (substitution 1:1 mais couleur plus foncée) ou un mélange de fruit du moine (substitution 1:1). Évitez les édulcorants liquides comme le miel ou le sirop d'érable en remplacement total — ils modifient le ratio de liquide.` }),
    es: () => ({ question: `¿Puedo sustituir el azúcar granulada por otro endulzante?`, answer: `El azúcar hace más que endulzar — reduce el punto de congelación y evita la textura helada. Puede sustituirlo con: alulosa (ideal para keto — no cristaliza al congelarse), azúcar de coco (cambio 1:1 pero color más oscuro) o mezcla de fruto del monje (cambio 1:1). Evite endulzantes líquidos como miel o jarabe de arce como reemplazo total — alteran la proporción de líquidos.` }),
    de: () => ({ question: `Kann ich einen anderen Süßstoff anstelle von Kristallzucker verwenden?`, answer: `Zucker tut mehr als süßen — er senkt den Gefrierpunkt und verhindert eine eisige Textur. Sie können ersetzen mit: Allulose (am besten für Keto — kristallisiert nicht beim Einfrieren), Kokoszucker (1:1 Tausch, aber dunklere Farbe) oder Mönchsfrucht-Mischung (1:1 Tausch). Vermeiden Sie flüssige Süßungsmittel wie Honig oder Ahornsirup als vollständigen Ersatz — sie verändern das Flüssigkeitsverhältnis.` }),
    pt: () => ({ question: `Posso substituir o açúcar refinado por outro adoçante?`, answer: `O açúcar faz mais do que adoçar — ele reduz o ponto de congelamento e evita textura gelada. Você pode substituir por: alulose (melhor para keto — não cristaliza quando congelado), açúcar de coco (troca 1:1 mas cor mais escura) ou mistura de fruta-do-monge (troca 1:1). Evite adoçantes líquidos como mel ou xarope de bordo como substituição total — eles alteram a proporção de líquidos.` }),
  },
  greekYogurt: {
    en: () => ({ question: `Does the brand of Greek yogurt matter? Full-fat or non-fat?`, answer: `Use full-fat (whole milk) Greek yogurt (8-10% MF) for the best, creamiest results. 2% Greek yogurt will work but produces a slightly icier texture — add a tablespoon of cream cheese to compensate. Non-fat/0% Greek yogurt is not recommended — it will be icy without stabilizers. Any brand works, but thicker brands like Fage or Chobani tend to give better results.` }),
    fr: () => ({ question: `La marque du yaourt grec est-elle importante ? Entier ou allégé ?`, answer: `Utilisez du yaourt grec entier (8-10 % de MG) pour les meilleurs résultats. Le yaourt grec à 2 % fonctionne mais donne une texture légèrement plus glacée — ajoutez une cuillère à soupe de fromage frais pour compenser. Le yaourt grec 0 % n'est pas recommandé — il sera glacé sans stabilisants. Toutes les marques fonctionnent, mais les marques plus épaisses comme Fage ou Chobani donnent de meilleurs résultats.` }),
    es: () => ({ question: `¿Importa la marca del yogur griego? ¿Entero o descremado?`, answer: `Use yogur griego entero (8-10% MG) para los mejores resultados. El yogur griego al 2% funciona pero produce una textura ligeramente más helada — agregue una cucharada de queso crema para compensar. El yogur griego descremado/0% no es recomendable — quedará helado sin estabilizantes. Cualquier marca funciona, pero las más espesas como Fage o Chobani dan mejores resultados.` }),
    de: () => ({ question: `Ist die Marke des griechischen Joghurts wichtig? Vollfett oder fettfrei?`, answer: `Verwenden Sie Vollfett-Joghurt (8-10% MF) für die besten, cremigsten Ergebnisse. 2%-Joghurt funktioniert, erzeugt aber eine etwas eisigere Textur — fügen Sie einen Esslöffel Frischkäse hinzu. Fettfreier/0%-Joghurt wird nicht empfohlen — er wird ohne Stabilisatoren eisig. Jede Marke funktioniert, aber dickere Marken wie Fage oder Chobani liefern bessere Ergebnisse.` }),
    pt: () => ({ question: `A marca do iogurte grego importa? Integral ou desnatado?`, answer: `Use iogurte grego integral (8-10% MG) para os melhores resultados. O iogurte grego 2% funciona mas produz uma textura ligeiramente mais gelada — adicione uma colher de sopa de cream cheese para compensar. O iogurte grego desnatado/0% não é recomendado — ficará gelado sem estabilizantes. Qualquer marca funciona, mas marcas mais espessas como Fage ou Chobani dão melhores resultados.` }),
  },
  condensedMilk: {
    en: () => ({ question: `Can I use evaporated milk instead of sweetened condensed milk?`, answer: `No — they are very different. Sweetened condensed milk is thick, sweet, and acts as both sweetener and stabilizer. Evaporated milk is unsweetened and thin. Using evaporated milk instead would result in a much less sweet, icier texture. Stick with sweetened condensed milk for this recipe.` }),
    fr: () => ({ question: `Puis-je utiliser du lait évaporé au lieu du lait concentré sucré ?`, answer: `Non — ce sont deux produits très différents. Le lait concentré sucré est épais, sucré et agit à la fois comme édulcorant et stabilisant. Le lait évaporé est non sucré et liquide. L'utiliser à la place donnerait un résultat beaucoup moins sucré et plus glacé. Utilisez du lait concentré sucré pour cette recette.` }),
    es: () => ({ question: `¿Puedo usar leche evaporada en lugar de leche condensada?`, answer: `No — son muy diferentes. La leche condensada es espesa, dulce y actúa como endulzante y estabilizante. La leche evaporada no es dulce y es líquida. Usarla en su lugar resultaría en una textura mucho menos dulce y más helada. Use leche condensada para esta receta.` }),
    de: () => ({ question: `Kann ich Kondensmilch statt gezuckerter Kondensmilch verwenden?`, answer: `Nein — das sind zwei sehr verschiedene Produkte. Gezuckerte Kondensmilch ist dickflüssig, süß und wirkt sowohl als Süßungsmittel als auch als Stabilisator. Kondensmilch (ungesüßt) ist dünnflüssig und nicht süß. Die Verwendung als Ersatz würde zu einem viel weniger süßen, eisigeren Ergebnis führen. Verwenden Sie für dieses Rezept gezuckerte Kondensmilch.` }),
    pt: () => ({ question: `Posso usar leite evaporado em vez de leite condensado?`, answer: `Não — são produtos muito diferentes. O leite condensado é espesso, doce e age como adoçante e estabilizante. O leite evaporado não é doce e é líquido. Usá-lo no lugar resultaria em uma textura muito menos doce e mais gelada. Use leite condensado para esta receita.` }),
  },
  foodColoring: {
    en: () => ({ question: `Is the food coloring necessary?`, answer: `No — food coloring is purely optional and cosmetic. It has no effect on flavor or texture. Skip it if you prefer a natural look.` }),
    fr: () => ({ question: `Le colorant alimentaire est-il nécessaire ?`, answer: `Non — le colorant alimentaire est purement optionnel et cosmétique. Il n'a aucun effet sur le goût ou la texture. Vous pouvez l'omettre si vous préférez un aspect naturel.` }),
    es: () => ({ question: `¿Es necesario el colorante alimentario?`, answer: `No — el colorante alimentario es puramente opcional y cosmético. No tiene efecto en el sabor ni la textura. Omítalo si prefiere un aspecto natural.` }),
    de: () => ({ question: `Ist die Lebensmittelfarbe notwendig?`, answer: `Nein — Lebensmittelfarbe ist rein optional und kosmetisch. Sie hat keinen Einfluss auf Geschmack oder Textur. Lassen Sie sie weg, wenn Sie ein natürliches Aussehen bevorzugen.` }),
    pt: () => ({ question: `O corante alimentar é necessário?`, answer: `Não — o corante alimentar é puramente opcional e cosmético. Não tem efeito no sabor nem na textura. Omita-o se preferir uma aparência natural.` }),
  },
};

export function faq(key: string, locale: Locale, vars: Record<string, string | number> = {}): { question: string; answer: string } {
  const template = FAQ_TEMPLATES[key]?.[locale] ?? FAQ_TEMPLATES[key]?.['en'];
  if (!template) return { question: key, answer: '' };
  return template(vars);
}
