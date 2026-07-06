import type { Locale } from '../i18n';
import type { RecipeQueryParams } from './recipes';

/** A curated recipe collection / hub page */
export interface Collection {
  slug: string;
  /** Query params to filter recipes for this collection */
  query: Omit<RecipeQueryParams, 'page' | 'pageSize' | 'locale' | 'sort'>;
  /** Default sort for this collection */
  sort: RecipeQueryParams['sort'];
}

/** All defined collections */
export const COLLECTIONS: Collection[] = [
  {
    slug: 'protein-ice-cream',
    query: { dietary: ['high-protein'] },
    sort: 'rating',
  },
  {
    slug: 'ice-cream',
    query: { base: ['ice-cream'] },
    sort: 'rating',
  },
  {
    slug: 'sorbet',
    query: { base: ['sorbet'] },
    sort: 'rating',
  },
  {
    slug: 'gelato',
    query: { base: ['gelato'] },
    sort: 'rating',
  },
  {
    slug: 'frozen-yogurt',
    query: { base: ['frozen-yogurt'] },
    sort: 'rating',
  },
  {
    slug: 'milkshake',
    query: { base: ['milkshake'] },
    sort: 'rating',
  },
  {
    slug: 'smoothie-bowl',
    query: { base: ['smoothie-bowl'] },
    sort: 'rating',
  },
  {
    slug: 'lite-ice-cream',
    query: { base: ['lite-ice-cream'] },
    sort: 'rating',
  },
  {
    slug: 'italian-ice',
    query: { base: ['italian-ice'] },
    sort: 'rating',
  },
  {
    slug: 'soft-serve',
    query: { tag: ['soft-serve'] },
    sort: 'rating',
  },
];

/** One layout block in a long-form collection intro */
export type CollectionIntroSection =
  | { layout: 'prose'; markdown: string }        // single-column flowing prose
  | { layout: 'two-col'; markdown: string }      // CSS multi-column text flow on md+
  | { layout: 'cards'; heading?: string; cards: { title: string; body: string }[] }; // 3-col grid of titled blocks

/** Collection metadata type */
interface CollectionMeta {
  title: string;
  description: string;
  metaDescription: string;
  /** Legacy long-form intro (single-column markdown). Prefer longIntroSections for new content. */
  longIntro?: string;
  /** Structured intro blocks with per-block layout */
  longIntroSections?: CollectionIntroSection[];
  /** FAQ entries rendered at bottom of page + emitted as FAQPage JSON-LD */
  faqs?: { question: string; answer: string }[];
}

/** Translation keys for collection metadata — keyed by slug */
const COLLECTION_I18N: Record<string, Record<Locale, CollectionMeta>> = {
  'protein-ice-cream': {
    en: {
      title: 'Protein Ice Cream Recipes for Ninja Creami',
      description: 'High-protein Ninja Creami recipes that taste like real ice cream. Cottage cheese bases, protein powder add-ins, and macro-friendly frozen treats — all tested with step-by-step instructions.',
      metaDescription: 'High-protein Ninja Creami ice cream recipes with macros. Cottage cheese, protein powder, and low-calorie bases — tested step-by-step for perfect results every time.',
      longIntroSections: [
        {
          layout: 'prose',
          markdown: `Protein ice cream is the reason a lot of people buy a Ninja Creami in the first place. The machine is uniquely good at turning high-protein, low-fat bases — which would be icy and grainy in a traditional ice cream maker — into something that legitimately tastes like dessert. Every recipe on this page lands between 20 and 40 grams of protein per pint, with macros listed up front so you know exactly what you're eating.`,
        },
        {
          layout: 'prose',
          markdown: `We've split the recipes into three approaches, so you can pick based on what's in your cupboard.`,
        },
        {
          layout: 'cards',
          heading: 'The three high-protein approaches',
          cards: [
            {
              title: 'Protein powder bases',
              body: 'Whey, casein, or plant-based powder blended with milk, Greek yogurt, and a sweetener. Closest to "classic" ice cream texture. Whey isolate stays creamiest after freezing; casein gives a denser, gelato-like bite; plant protein works but needs to hydrate in the fridge for an hour before freezing.',
            },
            {
              title: 'Cottage cheese bases',
              body: 'The surprise of the Creami world — a full 2% cottage cheese container blended smooth with sweetener and flavoring produces 40+ grams of protein and a shockingly creamy pint. No protein powder required, no chalkiness. We prefer Good Culture or Daisy low-sodium.',
            },
            {
              title: 'Greek yogurt bases',
              body: 'The middle ground. Lower protein than cottage cheese but higher than powder-only, and the tang works beautifully with fruit and honey flavors. These recipes freeze fast and spin into a dense, frozen-yogurt-adjacent texture.',
            },
          ],
        },
        {
          layout: 'two-col',
          markdown: `**How to use these recipes:** every recipe page shows the full ingredient list scaled for your Creami pint size (16oz Original or 24oz Deluxe XL), the exact program to run (most protein recipes use Lite Ice Cream, not Ice Cream — this matters), freeze time, step-by-step instructions, and full macros per serving. If your first pint comes out chalky, check the recipe's "Pro tips" section — usually the fix is a tablespoon of milk on top and a Re-Spin.

**Matching your protein powder:** if you haven't picked one yet, our [Best Protein Powders for Ninja Creami](/blog/best-protein-powders-creami) guide ranks the 8 we've tested and points you to the ones that don't taste chalky when frozen.`,
        },
      ],
      faqs: [
        {
          question: 'What is the best protein powder for Ninja Creami ice cream?',
          answer: 'Whey protein isolate gives the smoothest, creamiest texture after freezing — we recommend Ghost or Ascent for neutral vanilla flavors. Casein freezes denser (gelato-like) and works well for chocolate and cookies-and-cream recipes. Plant-based protein can work but needs to hydrate in the fridge for 1 hour before freezing. See our full protein powder comparison for tested picks.',
        },
        {
          question: 'How much protein does a Ninja Creami pint actually have?',
          answer: 'It depends on the base. A single-scoop whey protein recipe typically delivers 25–30g per pint. Cottage cheese bases push 40g+ per pint. Greek yogurt recipes land around 20–25g. Every recipe on this page lists exact macros per serving.',
        },
        {
          question: 'Why does my protein ice cream taste chalky?',
          answer: 'Three common causes: (1) the protein powder isn\'t hydrating — let the base sit in the fridge 30–60 minutes before freezing to let powder fully dissolve, (2) the protein is low-quality — whey concentrate tastes chalkier than isolate when frozen, (3) you\'re using the Ice Cream program instead of Lite Ice Cream. Switch to Lite Ice Cream for any low-fat or protein-heavy base.',
        },
        {
          question: 'Can I make Ninja Creami protein ice cream without protein powder?',
          answer: 'Yes — use cottage cheese (2% full-fat, blended until completely smooth) or Greek yogurt as the base. Cottage cheese gives 40g+ protein per pint naturally; Greek yogurt gives 20–25g. Both spin into creamy pints without any added powder.',
        },
        {
          question: 'Which program do I use for protein ice cream?',
          answer: 'Use the "Lite Ice Cream" program for protein bases — it\'s designed for lower-fat mixtures and handles them without making them icy. The regular "Ice Cream" program is meant for full-fat cream bases and can make protein pints crumbly.',
        },
        {
          question: 'How many calories are in Ninja Creami protein ice cream?',
          answer: 'Most recipes on this page land between 250 and 450 calories per pint (4 servings), with 20–40g protein. That\'s one-third to one-half the calories of store-bought high-protein brands like Halo Top, at a fraction of the cost per pint.',
        },
      ],
    },
    fr: {
      title: 'Recettes de Glace Protéinée pour Ninja Creami',
      description: 'Recettes Ninja Creami riches en protéines qui ont le goût de vraie glace. Bases au fromage blanc, poudre de protéine et desserts glacés équilibrés — tous testés avec des instructions étape par étape.',
      metaDescription: 'Recettes de glace protéinée Ninja Creami avec macros. Fromage blanc, protéines en poudre et bases faibles en calories — testées étape par étape.',
      longIntroSections: [
        {
          layout: 'prose',
          markdown: `La glace protéinée est la raison pour laquelle beaucoup de gens achètent un Ninja Creami. La machine est particulièrement douée pour transformer des bases riches en protéines et pauvres en matières grasses — qui seraient glacées et granuleuses dans une sorbetière classique — en quelque chose qui a vraiment le goût d'un dessert. Chaque recette sur cette page apporte entre 20 et 40 grammes de protéines par pot, avec les macros affichées clairement pour que vous sachiez exactement ce que vous mangez.`,
        },
        {
          layout: 'prose',
          markdown: `Nous avons réparti les recettes en trois approches, à vous de choisir selon ce qui se trouve dans vos placards.`,
        },
        {
          layout: 'cards',
          heading: 'Les trois approches riches en protéines',
          cards: [
            {
              title: 'Bases à la poudre de protéine',
              body: 'Whey, caséine ou protéine végétale mélangée avec du lait, du yaourt grec et un édulcorant. La texture la plus proche de la glace classique. L\'isolat de whey reste le plus crémeux après congélation ; la caséine donne une texture plus dense, façon gelato ; la protéine végétale fonctionne mais doit reposer une heure au réfrigérateur avant congélation pour bien s\'hydrater.',
            },
            {
              title: 'Bases au fromage blanc (cottage cheese)',
              body: 'La grande surprise du monde Creami — un pot entier de cottage cheese à 2% mixé lisse avec un édulcorant et un arôme donne plus de 40 grammes de protéines et un pot étonnamment crémeux. Pas de poudre de protéine nécessaire, aucun effet farineux. En France, le fromage blanc 3% bien égoutté ou le skyr font parfaitement l\'affaire.',
            },
            {
              title: 'Bases au yaourt grec',
              body: 'Le juste milieu. Moins de protéines que le cottage cheese mais plus que la poudre seule, et l\'acidité se marie parfaitement avec les fruits et le miel. Ces recettes congèlent vite et tournent en une texture dense, proche du frozen yogurt.',
            },
          ],
        },
        {
          layout: 'two-col',
          markdown: `**Comment utiliser ces recettes :** chaque page de recette affiche la liste complète d'ingrédients ajustée à la taille de votre Creami (pot de 16oz Original ou 24oz Deluxe XL), le programme exact (la plupart des recettes protéinées utilisent Lite Ice Cream, pas Ice Cream — c'est important), le temps de congélation, les instructions étape par étape et les macros complètes par portion. Si votre premier pot sort farineux, consultez la section "Pro tips" de la recette — c'est généralement réglé avec une cuillère à soupe de lait sur le dessus et un Re-Spin.

**Choisir votre poudre de protéine :** si vous n'en avez pas encore, notre guide [Les meilleures protéines en poudre pour Ninja Creami](/fr/blog/best-protein-powders-creami) classe les 8 que nous avons testées et indique celles qui n'ont pas d'arrière-goût farineux une fois congelées.`,
        },
      ],
      faqs: [
        {
          question: 'Quelle est la meilleure poudre de protéine pour la glace Ninja Creami ?',
          answer: 'L\'isolat de whey donne la texture la plus lisse et crémeuse après congélation — nous recommandons Ghost ou Ascent pour des saveurs vanille neutres. La caséine congèle plus dense (façon gelato) et fonctionne bien avec les recettes au chocolat et cookies-and-cream. La protéine végétale peut convenir mais doit s\'hydrater 1 heure au frigo avant congélation. Consultez notre comparatif complet des protéines testées.',
        },
        {
          question: 'Combien de protéines contient réellement un pot Ninja Creami ?',
          answer: 'Cela dépend de la base. Une recette avec une dose de whey apporte généralement 25 à 30 g par pot. Les bases au cottage cheese dépassent 40 g par pot. Les recettes au yaourt grec se situent autour de 20 à 25 g. Chaque recette de cette page indique les macros exactes par portion.',
        },
        {
          question: 'Pourquoi ma glace protéinée a-t-elle un goût farineux ?',
          answer: 'Trois causes fréquentes : (1) la poudre de protéine ne s\'hydrate pas — laissez la base 30 à 60 minutes au frigo avant de congeler pour que la poudre se dissolve complètement, (2) la protéine est de qualité médiocre — le concentré de whey a un goût plus farineux que l\'isolat une fois congelé, (3) vous utilisez le programme Ice Cream au lieu de Lite Ice Cream. Passez à Lite Ice Cream pour toute base faible en matières grasses ou riche en protéines.',
        },
        {
          question: 'Puis-je faire de la glace protéinée Ninja Creami sans poudre de protéine ?',
          answer: 'Oui — utilisez du cottage cheese (2% entier, mixé jusqu\'à être parfaitement lisse) ou du yaourt grec comme base. Le cottage cheese apporte naturellement plus de 40 g de protéines par pot ; le yaourt grec, 20 à 25 g. Les deux tournent en pots crémeux sans ajout de poudre.',
        },
        {
          question: 'Quel programme utiliser pour la glace protéinée ?',
          answer: 'Utilisez le programme "Lite Ice Cream" pour les bases protéinées — il est conçu pour les mélanges faibles en matières grasses et les traite sans les rendre glacées. Le programme "Ice Cream" classique est prévu pour les bases riches en crème et peut rendre les pots protéinés friables.',
        },
        {
          question: 'Combien de calories dans la glace protéinée Ninja Creami ?',
          answer: 'La plupart des recettes de cette page se situent entre 250 et 450 calories par pot (4 portions), avec 20 à 40 g de protéines. C\'est un tiers à la moitié des calories des marques commerciales riches en protéines comme Halo Top, pour une fraction du prix par pot.',
        },
      ],
    },
    es: {
      title: 'Recetas de Helado Proteico para Ninja Creami',
      description: 'Recetas de Ninja Creami altas en proteína que saben a helado de verdad. Bases de requesón, proteína en polvo y postres helados saludables — todos probados con instrucciones paso a paso.',
      metaDescription: 'Recetas de helado proteico Ninja Creami con macros. Requesón, proteína en polvo y bases bajas en calorías — probadas paso a paso.',
      longIntroSections: [
        {
          layout: 'prose',
          markdown: `El helado proteico es la razón por la que mucha gente compra un Ninja Creami. La máquina es especialmente buena convirtiendo bases altas en proteína y bajas en grasa — que en una heladera tradicional quedarían heladas y granulosas — en algo que realmente sabe a postre. Cada receta de esta página aporta entre 20 y 40 gramos de proteína por pote, con las macros bien visibles para que sepas exactamente lo que comes.`,
        },
        {
          layout: 'prose',
          markdown: `Hemos dividido las recetas en tres enfoques para que elijas según lo que tengas en la despensa.`,
        },
        {
          layout: 'cards',
          heading: 'Los tres enfoques altos en proteína',
          cards: [
            {
              title: 'Bases con proteína en polvo',
              body: 'Whey, caseína o proteína vegetal mezclada con leche, yogurt griego y un edulcorante. La textura más parecida al helado clásico. El aislado de whey queda más cremoso al congelarse; la caseína da una textura más densa tipo gelato; la proteína vegetal funciona, pero conviene dejarla hidratar en la nevera una hora antes de congelar.',
            },
            {
              title: 'Bases de requesón (cottage cheese)',
              body: 'La gran sorpresa del mundo Creami — un envase entero de requesón al 2% licuado hasta quedar liso, con edulcorante y saborizante, produce más de 40 gramos de proteína y un pote asombrosamente cremoso. Sin proteína en polvo, sin pastosidad. Preferimos Good Culture o Daisy bajo en sodio.',
            },
            {
              title: 'Bases de yogurt griego',
              body: 'El término medio. Menos proteína que el requesón pero más que el polvo solo, y la acidez combina genial con frutas y miel. Estas recetas congelan rápido y giran a una textura densa, cercana al yogurt helado.',
            },
          ],
        },
        {
          layout: 'two-col',
          markdown: `**Cómo usar estas recetas:** cada página muestra la lista completa de ingredientes escalada al tamaño de tu Creami (pote de 16oz Original o 24oz Deluxe XL), el programa exacto (la mayoría de recetas proteicas usan Lite Ice Cream, no Ice Cream — esto importa), el tiempo de congelado, las instrucciones paso a paso y las macros completas por porción. Si tu primer pote sale pastoso, revisa la sección "Pro tips" — normalmente se arregla con una cucharada de leche encima y un Re-Spin.

**Elegir tu proteína en polvo:** si aún no tienes una, nuestra guía [Las mejores proteínas en polvo para Ninja Creami](/es/blog/best-protein-powders-creami) clasifica las 8 que hemos probado y señala las que no dejan sabor pastoso una vez congeladas.`,
        },
      ],
      faqs: [
        {
          question: '¿Cuál es la mejor proteína en polvo para el helado del Ninja Creami?',
          answer: 'El aislado de whey da la textura más suave y cremosa al congelarse — recomendamos Ghost o Ascent para sabores neutros de vainilla. La caseína queda más densa (tipo gelato) y va bien con recetas de chocolate y cookies-and-cream. La proteína vegetal funciona pero debe hidratarse en la nevera 1 hora antes de congelar. Consulta nuestra comparativa completa para ver las opciones probadas.',
        },
        {
          question: '¿Cuánta proteína tiene realmente un pote del Ninja Creami?',
          answer: 'Depende de la base. Una receta con una medida de whey aporta normalmente 25–30 g por pote. Las bases de requesón superan los 40 g por pote. Las de yogurt griego quedan en torno a 20–25 g. Cada receta de esta página indica las macros exactas por porción.',
        },
        {
          question: '¿Por qué mi helado proteico tiene sabor pastoso?',
          answer: 'Tres causas habituales: (1) la proteína en polvo no se hidrata — deja la base en la nevera 30–60 minutos antes de congelar para que el polvo se disuelva del todo, (2) la proteína es de baja calidad — el concentrado de whey queda más pastoso que el aislado al congelarse, (3) estás usando el programa Ice Cream en vez de Lite Ice Cream. Cambia a Lite Ice Cream para cualquier base baja en grasa o alta en proteína.',
        },
        {
          question: '¿Puedo hacer helado proteico Ninja Creami sin proteína en polvo?',
          answer: 'Sí — usa requesón (2% entero, licuado hasta quedar completamente liso) o yogurt griego como base. El requesón aporta más de 40 g de proteína por pote de forma natural; el yogurt griego, 20–25 g. Ambos giran a potes cremosos sin necesidad de añadir polvo.',
        },
        {
          question: '¿Qué programa uso para el helado proteico?',
          answer: 'Usa el programa "Lite Ice Cream" para bases proteicas — está diseñado para mezclas bajas en grasa y las procesa sin que queden heladas. El programa "Ice Cream" normal es para bases ricas en crema y puede dejar los potes proteicos granulados.',
        },
        {
          question: '¿Cuántas calorías tiene el helado proteico del Ninja Creami?',
          answer: 'La mayoría de recetas de esta página quedan entre 250 y 450 calorías por pote (4 porciones), con 20–40 g de proteína. Es un tercio o la mitad de las calorías de marcas comerciales como Halo Top, a una fracción del coste por pote.',
        },
      ],
    },
    de: {
      title: 'Protein-Eis Rezepte für Ninja Creami',
      description: 'Proteinreiche Ninja Creami Rezepte, die wie echtes Eis schmecken. Quark-Basen, Proteinpulver und makrofreundliche Eiskreationen — alle mit Schritt-für-Schritt-Anleitung getestet.',
      metaDescription: 'Proteinreiche Ninja Creami Eis-Rezepte mit Makros. Quark, Proteinpulver und kalorienarme Basen — Schritt für Schritt getestet.',
      longIntroSections: [
        {
          layout: 'two-col',
          markdown: `Protein-Eis ist der Grund, warum viele überhaupt einen Ninja Creami kaufen. Die Maschine ist besonders gut darin, proteinreiche, fettarme Basen — die in einer klassischen Eismaschine vereist und körnig würden — in etwas zu verwandeln, das wirklich nach Dessert schmeckt. Jedes Rezept auf dieser Seite liefert zwischen 20 und 40 Gramm Protein pro Pint, mit offen ausgewiesenen Makros, damit du genau weißt, was du isst.

Wir haben die Rezepte in drei Ansätze unterteilt, damit du nach dem wählst, was gerade im Schrank steht.`,
        },
        {
          layout: 'cards',
          heading: 'Die drei proteinreichen Ansätze',
          cards: [
            {
              title: 'Basen mit Proteinpulver',
              body: 'Whey, Casein oder pflanzliches Protein gemischt mit Milch, griechischem Joghurt und Süßungsmittel. Am nächsten an klassischer Eiscreme-Textur. Whey-Isolat bleibt nach dem Einfrieren am cremigsten; Casein gibt eine dichtere, gelato-artige Konsistenz; pflanzliches Protein funktioniert, sollte aber eine Stunde im Kühlschrank hydratisieren, bevor die Basis eingefroren wird.',
            },
            {
              title: 'Quark- bzw. Hüttenkäse-Basen',
              body: 'Die große Überraschung der Creami-Welt — ein ganzer 2%-Hüttenkäse (oder Magerquark in Europa) cremig gemixt mit Süße und Aroma ergibt über 40 Gramm Protein und ein erstaunlich cremiges Pint. Kein Proteinpulver nötig, kein kreidiges Gefühl. In den USA empfehlen wir Good Culture oder Daisy Low-Sodium.',
            },
            {
              title: 'Basen aus griechischem Joghurt',
              body: 'Der Mittelweg. Weniger Protein als Hüttenkäse, aber mehr als reines Pulver, und die Säure harmoniert wunderbar mit Frucht- und Honignoten. Diese Rezepte frieren schnell ein und ergeben eine dichte, frozen-yogurt-artige Textur.',
            },
          ],
        },
        {
          layout: 'two-col',
          markdown: `**So nutzt du diese Rezepte:** jede Rezeptseite zeigt die komplette Zutatenliste, skaliert auf deine Creami-Größe (16oz Original oder 24oz Deluxe XL), das genaue Programm (die meisten Protein-Rezepte nutzen Lite Ice Cream, nicht Ice Cream — das ist wichtig), Gefrierzeit, Schritt-für-Schritt-Anleitung und vollständige Makros pro Portion. Wenn dein erstes Pint kreidig ist, schau in den "Pro Tipps"-Abschnitt — meistens hilft ein Esslöffel Milch und ein Re-Spin.

**Das richtige Proteinpulver:** Wenn du noch keines hast, unser Guide [Die besten Proteinpulver für den Ninja Creami](/de/blog/best-protein-powders-creami) bewertet die 8 getesteten Sorten und zeigt, welche gefroren nicht kreidig schmecken.`,
        },
      ],
      faqs: [
        {
          question: 'Welches Proteinpulver eignet sich am besten für Ninja Creami Eis?',
          answer: 'Whey-Isolat ergibt die glatteste, cremigste Textur nach dem Einfrieren — wir empfehlen Ghost oder Ascent für neutrale Vanillegeschmäcker. Casein friert dichter ein (gelato-artig) und passt gut zu Schokoladen- und Cookies-and-Cream-Rezepten. Pflanzliches Protein funktioniert, muss aber 1 Stunde im Kühlschrank hydratisieren, bevor es eingefroren wird. Schau in unseren Vergleich getesteter Proteinpulver.',
        },
        {
          question: 'Wie viel Protein steckt wirklich in einem Ninja Creami Pint?',
          answer: 'Das hängt von der Basis ab. Ein Rezept mit einem Messlöffel Whey liefert typischerweise 25–30 g pro Pint. Quark-/Hüttenkäse-Basen kommen auf über 40 g pro Pint. Joghurt-Rezepte landen bei 20–25 g. Jedes Rezept auf dieser Seite nennt die exakten Makros pro Portion.',
        },
        {
          question: 'Warum schmeckt mein Protein-Eis kreidig?',
          answer: 'Drei häufige Ursachen: (1) das Proteinpulver hydratisiert nicht — lass die Basis 30–60 Minuten im Kühlschrank ruhen, damit sich das Pulver vollständig löst, (2) minderwertiges Protein — Whey-Konzentrat schmeckt gefroren kreidiger als Isolat, (3) du verwendest das Ice-Cream-Programm statt Lite Ice Cream. Wechsle für fettarme oder proteinreiche Basen immer zu Lite Ice Cream.',
        },
        {
          question: 'Kann ich Ninja Creami Protein-Eis ohne Proteinpulver machen?',
          answer: 'Ja — verwende Hüttenkäse bzw. Quark (2% vollfett, komplett cremig gemixt) oder griechischen Joghurt als Basis. Hüttenkäse liefert natürlich über 40 g Protein pro Pint; griechischer Joghurt 20–25 g. Beide ergeben cremige Pints ganz ohne zusätzliches Pulver.',
        },
        {
          question: 'Welches Programm nutze ich für Protein-Eis?',
          answer: 'Nutze das Programm "Lite Ice Cream" für Protein-Basen — es ist für fettärmere Mischungen ausgelegt und verarbeitet sie, ohne dass sie vereisen. Das normale "Ice Cream"-Programm ist für vollfette Sahnebasen gedacht und kann Protein-Pints bröselig machen.',
        },
        {
          question: 'Wie viele Kalorien hat Ninja Creami Protein-Eis?',
          answer: 'Die meisten Rezepte auf dieser Seite liegen zwischen 250 und 450 Kalorien pro Pint (4 Portionen), mit 20–40 g Protein. Das ist ein Drittel bis die Hälfte der Kalorien von gekauften proteinreichen Marken wie Halo Top — zu einem Bruchteil des Preises pro Pint.',
        },
      ],
    },
    pt: {
      title: 'Receitas de Sorvete Proteico para Ninja Creami',
      description: 'Receitas Ninja Creami ricas em proteína que têm gosto de sorvete de verdade. Bases de cottage cheese, whey protein e sobremesas geladas saudáveis — todas testadas com instruções passo a passo.',
      metaDescription: 'Receitas de sorvete proteico Ninja Creami com macros. Cottage cheese, whey protein e bases de baixa caloria — testadas passo a passo.',
      longIntroSections: [
        {
          layout: 'prose',
          markdown: `O sorvete proteico é a razão pela qual muita gente compra o Ninja Creami. A máquina é especialmente boa em transformar bases ricas em proteína e com pouca gordura — que ficariam geladas e arenosas numa sorveteira tradicional — em algo que realmente tem gosto de sobremesa. Cada receita desta página entrega entre 20 e 40 gramas de proteína por pote, com as macros bem visíveis para você saber exatamente o que está comendo.`,
        },
        {
          layout: 'prose',
          markdown: `Dividimos as receitas em três abordagens para você escolher de acordo com o que tem no armário.`,
        },
        {
          layout: 'cards',
          heading: 'As três abordagens ricas em proteína',
          cards: [
            {
              title: 'Bases com whey protein (ou caseína)',
              body: 'Whey, caseína ou proteína vegetal batidas com leite, iogurte grego e adoçante. A textura mais próxima do sorvete clássico. O isolado de whey fica o mais cremoso depois de congelar; a caseína dá uma textura mais densa, tipo gelato; a proteína vegetal funciona, mas precisa hidratar por uma hora na geladeira antes de congelar.',
            },
            {
              title: 'Bases de cottage cheese',
              body: 'A grande surpresa do mundo Creami — um pote inteiro de cottage cheese 2% batido liso com adoçante e aromatizante produz mais de 40 gramas de proteína e um pote surpreendentemente cremoso. Sem whey protein, sem gosto arenoso. No Brasil, o queijo cottage ou a ricota fresca bem batida funcionam muito bem.',
            },
            {
              title: 'Bases de iogurte grego',
              body: 'O meio-termo. Menos proteína que o cottage cheese mas mais que só whey, e o sabor ácido combina muito bem com frutas e mel. Essas receitas congelam rápido e giram em uma textura densa, próxima do frozen yogurt.',
            },
          ],
        },
        {
          layout: 'two-col',
          markdown: `**Como usar essas receitas:** cada página mostra a lista completa de ingredientes ajustada ao tamanho do seu Creami (pote de 16oz Original ou 24oz Deluxe XL), o programa exato (a maioria das receitas proteicas usa Lite Ice Cream, não Ice Cream — isso importa), tempo de congelamento, instruções passo a passo e macros completas por porção. Se seu primeiro pote sair arenoso, veja a seção "Pro tips" da receita — geralmente se resolve com uma colher de sopa de leite por cima e um Re-Spin.

**Escolhendo sua whey protein:** se ainda não tem uma, nosso guia [As melhores proteínas em pó para Ninja Creami](/pt/blog/best-protein-powders-creami) classifica as 8 que testamos e aponta quais não têm gosto arenoso quando congeladas.`,
        },
      ],
      faqs: [
        {
          question: 'Qual a melhor whey protein para sorvete no Ninja Creami?',
          answer: 'O isolado de whey dá a textura mais lisa e cremosa após o congelamento — recomendamos Ghost ou Ascent para sabores neutros de baunilha. A caseína congela mais densa (tipo gelato) e funciona bem com receitas de chocolate e cookies-and-cream. A proteína vegetal pode funcionar mas precisa hidratar por 1 hora na geladeira antes de congelar. Veja nossa comparação completa de proteínas em pó testadas.',
        },
        {
          question: 'Quanta proteína tem de verdade um pote do Ninja Creami?',
          answer: 'Depende da base. Uma receita com um scoop de whey entrega tipicamente 25–30 g por pote. Bases de cottage cheese ultrapassam 40 g por pote. Receitas de iogurte grego ficam em torno de 20–25 g. Cada receita desta página lista as macros exatas por porção.',
        },
        {
          question: 'Por que meu sorvete proteico tem gosto arenoso?',
          answer: 'Três causas comuns: (1) o whey não está hidratando — deixe a base na geladeira de 30 a 60 minutos antes de congelar para o pó dissolver completamente, (2) a proteína é de baixa qualidade — o concentrado de whey tem gosto mais arenoso que o isolado quando congelado, (3) você está usando o programa Ice Cream em vez de Lite Ice Cream. Mude para Lite Ice Cream em qualquer base com pouca gordura ou muita proteína.',
        },
        {
          question: 'Posso fazer sorvete proteico no Ninja Creami sem whey protein?',
          answer: 'Sim — use cottage cheese (2% integral, batido até ficar completamente liso) ou iogurte grego como base. O cottage cheese entrega naturalmente mais de 40 g de proteína por pote; o iogurte grego, 20–25 g. Ambos giram em potes cremosos sem adicionar pó.',
        },
        {
          question: 'Qual programa uso para sorvete proteico?',
          answer: 'Use o programa "Lite Ice Cream" para bases proteicas — ele foi feito para misturas com menos gordura e as processa sem deixá-las geladas. O programa "Ice Cream" comum é para bases ricas em creme e pode deixar potes proteicos quebradiços.',
        },
        {
          question: 'Quantas calorias tem o sorvete proteico do Ninja Creami?',
          answer: 'A maioria das receitas desta página fica entre 250 e 450 calorias por pote (4 porções), com 20–40 g de proteína. Isso é um terço a metade das calorias de marcas prontas como a Halo Top, por uma fração do custo por pote.',
        },
      ],
    },
  },
  'frozen-yogurt': {
    en: {
      title: 'Frozen Yogurt Recipes for Ninja Creami',
      description: 'Creamy frozen yogurt recipes made with your Ninja Creami. Greek yogurt bases, fresh fruit mix-ins, and lighter alternatives to traditional ice cream — all with step-by-step instructions.',
      metaDescription: 'Ninja Creami frozen yogurt recipes with Greek yogurt, fruit, and lighter bases. Step-by-step instructions for perfect homemade froyo every time.',
      longIntroSections: [
        {
          layout: 'two-col',
          markdown: `Homemade frozen yogurt used to mean dragging out a countertop machine, churning for 25 minutes, and ending up with something icy that melted in ten. The Ninja Creami changes the math entirely — you can make a better-than-the-mall frozen yogurt in your freezer overnight, spin it in 90 seconds, and top it with anything you want. Every recipe on this page has been tested with a real Creami, with exact freeze times and the program settings that work.

Frozen yogurt in a Creami works because the machine handles dense, tangy bases beautifully. We use plain full-fat Greek yogurt as the foundation (the fat content keeps things creamy — avoid 0% for better texture), add a touch of sweetener, and let fresh fruit, honey, or mix-ins do the flavor work. The result is dense, scoopable, and lands around 12–20g of protein per pint depending on the yogurt brand.`,
        },
        {
          layout: 'cards',
          heading: 'The three froyo styles on this site',
          cards: [
            {
              title: 'Classic Greek froyo',
              body: 'Plain Greek yogurt + honey + vanilla + fruit. The simplest possible base, and the one to start with if you\'re new to the Creami. Spins smooth in one pass and pairs with any fruit you have.',
            },
            {
              title: 'High-protein froyo',
              body: 'Skyr, Icelandic-style yogurt, or 5% Greek yogurt paired with a scoop of vanilla protein powder. Push the protein per pint above 25g without losing the creamy texture. Use the Lite Ice Cream program, not the Frozen Yogurt program, for these — the slightly more aggressive blade action handles higher-protein bases better.',
            },
            {
              title: 'Fruit-forward froyo',
              body: 'Heavier on the fruit (berry puree, mango, passion fruit) with yogurt as the carrier. These are closer to frozen-yogurt-meets-sorbet and are our most popular summer recipes.',
            },
          ],
        },
        {
          layout: 'two-col',
          markdown: `**How to use these recipes:** every recipe page shows the full ingredient list scaled for your Creami pint size, the exact program (usually "Frozen Yogurt" or "Lite Ice Cream"), freeze time (24 hours is standard), and step-by-step directions. If your first pint is icy, add a tablespoon of milk on top and Re-Spin — the extra liquid fixes 90% of texture issues.

**Choosing yogurt:** the brand matters. Chobani, Fage 5%, and Siggi's all work well. Avoid fat-free Greek yogurt — it produces icy, grainy pints. If you're shopping for a thicker base, Icelandic-style skyr gives the densest frozen yogurt texture we've tested.`,
        },
      ],
      faqs: [
        {
          question: 'What setting do I use for frozen yogurt in the Ninja Creami?',
          answer: 'Use the "Frozen Yogurt" program for traditional Greek-yogurt-based recipes. For high-protein yogurt bases (with added protein powder), use "Lite Ice Cream" — its blade action handles higher-protein mixtures without making them icy.',
        },
        {
          question: 'What yogurt is best for Ninja Creami frozen yogurt?',
          answer: 'Full-fat (5%) plain Greek yogurt gives the creamiest results — we recommend Fage 5%, Chobani whole milk, or Icelandic-style skyr (Siggi\'s). Avoid 0% Greek yogurt — the lack of fat makes pints icy and grainy. If you want lower calories, 2% Greek yogurt is a fair middle ground.',
        },
        {
          question: 'How long do I freeze frozen yogurt in the Creami?',
          answer: 'Freeze your filled pint for 24 hours at 0°F (-18°C). Less than 24 hours means the block isn\'t fully solid and the blade will shave unevenly. You can safely freeze longer (up to a week) — if it\'s been frozen more than 5 days, let the pint sit at room temp for 5 minutes before spinning.',
        },
        {
          question: 'Why is my Ninja Creami frozen yogurt icy?',
          answer: 'Usually one of three things: (1) you used fat-free or 0% yogurt — switch to 2% or full-fat, (2) your sweetener isn\'t dissolving — use honey or maple syrup instead of granulated sugar and whisk thoroughly before freezing, (3) the pint needs to Re-Spin with 1 tablespoon of milk added on top.',
        },
        {
          question: 'Can I use regular (not Greek) yogurt in the Ninja Creami?',
          answer: 'Yes, but the texture will be softer and closer to soft-serve than scoopable frozen yogurt. For a firmer pint, strain regular yogurt through cheesecloth for 2 hours before using (DIY Greek yogurt), or add 1 tablespoon of cream cheese to thicken.',
        },
        {
          question: 'How much protein is in Ninja Creami frozen yogurt?',
          answer: 'A plain full-fat Greek yogurt base delivers roughly 18–24g protein per pint. Icelandic-style skyr pushes that to 24–28g. Adding a scoop of protein powder to either takes you into the 30–40g per pint range — see our high-protein frozen yogurt recipes for tested ratios.',
        },
      ],
    },
    fr: {
      title: 'Recettes de Frozen Yogurt pour Ninja Creami',
      description: 'Recettes de yaourt glacé crémeux préparées avec votre Ninja Creami. Bases au yaourt grec, fruits frais et alternatives légères — toutes avec des instructions étape par étape.',
      metaDescription: 'Recettes de yaourt glacé Ninja Creami avec yaourt grec et fruits. Instructions étape par étape pour un frozen yogurt maison parfait.',
      longIntroSections: [
        {
          layout: 'two-col',
          markdown: `Le yaourt glacé maison signifiait autrefois sortir une sorbetière de comptoir, turbiner pendant 25 minutes, et finir avec quelque chose de glacé qui fondait en dix. Le Ninja Creami change complètement la donne — vous pouvez faire un frozen yogurt meilleur que celui des centres commerciaux dans votre congélateur du jour au lendemain, le turbiner en 90 secondes, et le garnir de ce que vous voulez. Chaque recette de cette page a été testée avec un vrai Creami, avec les temps de congélation exacts et les réglages de programme qui fonctionnent.

Le frozen yogurt dans un Creami fonctionne parce que la machine gère à merveille les bases denses et acidulées. Nous utilisons du yaourt grec nature entier comme fondation (la matière grasse garde la texture crémeuse — évitez le 0% pour un meilleur résultat), ajoutons une touche d'édulcorant, et laissons les fruits frais, le miel ou les mix-ins porter la saveur. Le résultat est dense, à la cuillère, et apporte environ 12 à 20 g de protéines par pot selon la marque de yaourt.`,
        },
        {
          layout: 'cards',
          heading: 'Les trois styles de frozen yogurt sur ce site',
          cards: [
            {
              title: 'Frozen yogurt grec classique',
              body: 'Yaourt grec nature + miel + vanille + fruits. La base la plus simple possible, et celle par laquelle commencer si vous débutez avec le Creami. Tourne lisse en un seul passage et s\'accompagne de n\'importe quel fruit.',
            },
            {
              title: 'Frozen yogurt riche en protéines',
              body: 'Skyr, yaourt style islandais, ou yaourt grec 5% associé à une dose de poudre de protéine vanille. Dépassez les 25 g de protéines par pot sans perdre la texture crémeuse. Utilisez le programme Lite Ice Cream, pas Frozen Yogurt, pour ces recettes — l\'action de lame légèrement plus agressive gère mieux les bases riches en protéines.',
            },
            {
              title: 'Frozen yogurt fruité',
              body: 'Plus axé sur les fruits (purée de baies, mangue, fruit de la passion) avec le yaourt comme support. Ces recettes se rapprochent du frozen-yogurt-rencontre-sorbet et font partie de nos recettes d\'été les plus populaires.',
            },
          ],
        },
        {
          layout: 'two-col',
          markdown: `**Comment utiliser ces recettes :** chaque page de recette affiche la liste complète d'ingrédients ajustée à la taille de votre pot Creami, le programme exact (généralement "Frozen Yogurt" ou "Lite Ice Cream"), le temps de congélation (24 heures est la norme) et les instructions étape par étape. Si votre premier pot est glacé, ajoutez une cuillère à soupe de lait sur le dessus et faites un Re-Spin — le liquide supplémentaire corrige 90% des problèmes de texture.

**Choisir son yaourt :** la marque compte. Fage 5%, yaourt grec Carrefour ou Siggi\'s fonctionnent tous bien. Évitez le yaourt grec 0% — il produit des pots glacés et granuleux. Si vous cherchez une base plus épaisse, le skyr islandais donne la texture de frozen yogurt la plus dense que nous ayons testée.`,
        },
      ],
      faqs: [
        {
          question: 'Quel réglage utiliser pour le frozen yogurt avec le Ninja Creami ?',
          answer: 'Utilisez le programme "Frozen Yogurt" pour les recettes classiques à base de yaourt grec. Pour les bases riches en protéines (avec poudre ajoutée), utilisez "Lite Ice Cream" — l\'action de lame gère mieux les mélanges plus protéinés sans les glacer.',
        },
        {
          question: 'Quel yaourt est le meilleur pour le frozen yogurt Ninja Creami ?',
          answer: 'Le yaourt grec nature entier (5%) donne les résultats les plus crémeux — nous recommandons Fage 5%, yaourt grec style méditerranéen, ou skyr islandais (Siggi\'s). Évitez le yaourt grec 0% — l\'absence de matière grasse rend les pots glacés et granuleux. Si vous voulez moins de calories, le yaourt grec 2% est un compromis correct.',
        },
        {
          question: 'Combien de temps congeler le frozen yogurt dans le Creami ?',
          answer: 'Congelez votre pot rempli pendant 24 heures à -18°C ou plus froid. Moins de 24 heures signifie que le bloc n\'est pas totalement solide et la lame rasera de manière inégale. Vous pouvez congeler plus longtemps en toute sécurité (jusqu\'à une semaine) — si c\'est plus de 5 jours, laissez le pot à température ambiante 5 minutes avant de turbiner.',
        },
        {
          question: 'Pourquoi mon frozen yogurt Ninja Creami est-il glacé ?',
          answer: 'Généralement l\'une de ces trois causes : (1) vous avez utilisé un yaourt 0% ou sans matières grasses — passez au 2% ou entier, (2) votre édulcorant ne se dissout pas — utilisez du miel ou du sirop d\'érable au lieu de sucre granulé et fouettez bien avant congélation, (3) le pot a besoin d\'un Re-Spin avec 1 cuillère à soupe de lait ajoutée sur le dessus.',
        },
        {
          question: 'Puis-je utiliser du yaourt ordinaire (pas grec) dans le Ninja Creami ?',
          answer: 'Oui, mais la texture sera plus souple et plus proche du soft serve que d\'un frozen yogurt à la cuillère. Pour un pot plus ferme, filtrez le yaourt ordinaire à travers une étamine pendant 2 heures avant utilisation (yaourt grec maison), ou ajoutez 1 cuillère à soupe de cream cheese pour épaissir.',
        },
        {
          question: 'Combien de protéines dans le frozen yogurt Ninja Creami ?',
          answer: 'Une base de yaourt grec nature entier apporte environ 18 à 24 g de protéines par pot. Le skyr islandais monte à 24–28 g. Ajouter une dose de poudre de protéine vous fait passer à 30–40 g par pot — consultez nos recettes de frozen yogurt riches en protéines pour les ratios testés.',
        },
      ],
    },
    es: {
      title: 'Recetas de Yogurt Helado para Ninja Creami',
      description: 'Recetas cremosas de yogurt helado con tu Ninja Creami. Bases de yogurt griego, frutas frescas y alternativas más ligeras al helado tradicional — todas con instrucciones paso a paso.',
      metaDescription: 'Recetas de yogurt helado Ninja Creami con yogurt griego y frutas. Instrucciones paso a paso para un froyo casero perfecto.',
      longIntroSections: [
        {
          layout: 'two-col',
          markdown: `El yogurt helado casero solía significar sacar una heladera de encimera, batir durante 25 minutos y acabar con algo helado que se derretía en diez. El Ninja Creami cambia las reglas por completo — puedes hacer un frozen yogurt mejor que el del centro comercial en tu congelador durante la noche, girarlo en 90 segundos y cubrirlo con lo que quieras. Cada receta de esta página ha sido probada con un Creami real, con los tiempos de congelado exactos y los programas que funcionan.

El yogurt helado en un Creami funciona porque la máquina maneja muy bien las bases densas y ácidas. Usamos yogurt griego natural entero como base (la grasa mantiene la textura cremosa — evita el 0% para mejor resultado), añadimos un toque de edulcorante y dejamos que las frutas frescas, la miel o los mix-ins aporten el sabor. El resultado es denso, para cuchara, y aporta unos 12–20 g de proteína por pote según la marca de yogurt.`,
        },
        {
          layout: 'cards',
          heading: 'Los tres estilos de yogurt helado en este sitio',
          cards: [
            {
              title: 'Yogurt helado griego clásico',
              body: 'Yogurt griego natural + miel + vainilla + fruta. La base más sencilla posible, y la que recomendamos si recién empiezas con el Creami. Gira liso en una sola pasada y combina con cualquier fruta que tengas.',
            },
            {
              title: 'Yogurt helado alto en proteína',
              body: 'Skyr, yogurt estilo islandés o yogurt griego 5% con una medida de proteína vanilla en polvo. Supera los 25 g de proteína por pote sin perder cremosidad. Usa el programa Lite Ice Cream, no Frozen Yogurt, para estos — la acción de cuchilla algo más agresiva maneja mejor las bases altas en proteína.',
            },
            {
              title: 'Yogurt helado frutal',
              body: 'Con más peso en la fruta (puré de bayas, mango, maracuyá) y el yogurt como vehículo. Están más cerca del frozen-yogurt-que-sorbete y son nuestras recetas de verano más populares.',
            },
          ],
        },
        {
          layout: 'two-col',
          markdown: `**Cómo usar estas recetas:** cada página muestra la lista completa de ingredientes escalada al tamaño de tu pote Creami, el programa exacto (normalmente "Frozen Yogurt" o "Lite Ice Cream"), el tiempo de congelado (24 horas es el estándar) y las instrucciones paso a paso. Si tu primer pote queda helado, añade una cucharada de leche encima y haz un Re-Spin — el líquido extra arregla el 90% de los problemas de textura.

**Elegir el yogurt:** la marca importa. Fage 5%, Danone Oikos y Siggi\'s funcionan bien. Evita el yogurt griego 0% — produce potes helados y granulados. Si buscas una base más espesa, el skyr islandés da la textura de yogurt helado más densa que hemos probado.`,
        },
      ],
      faqs: [
        {
          question: '¿Qué programa uso para el yogurt helado en el Ninja Creami?',
          answer: 'Usa el programa "Frozen Yogurt" para recetas tradicionales con base de yogurt griego. Para bases altas en proteína (con proteína en polvo añadida), usa "Lite Ice Cream" — su acción de cuchilla maneja mejor las mezclas con más proteína sin dejarlas heladas.',
        },
        {
          question: '¿Qué yogurt es mejor para el yogurt helado Ninja Creami?',
          answer: 'El yogurt griego natural entero (5%) da los resultados más cremosos — recomendamos Fage 5%, Oikos entero o skyr islandés (Siggi\'s). Evita el yogurt griego 0% — la falta de grasa deja los potes helados y granulados. Si quieres menos calorías, el yogurt griego 2% es un término medio razonable.',
        },
        {
          question: '¿Cuánto tiempo congelo el yogurt helado en el Creami?',
          answer: 'Congela el pote lleno durante 24 horas a -18°C o más frío. Menos de 24 horas significa que el bloque no está del todo sólido y la cuchilla no rasurará bien. Puedes congelar más tiempo sin problema (hasta una semana) — si han pasado más de 5 días, deja el pote a temperatura ambiente 5 minutos antes de girar.',
        },
        {
          question: '¿Por qué mi yogurt helado Ninja Creami queda helado?',
          answer: 'Normalmente una de estas tres causas: (1) usaste yogurt 0% o desnatado — cambia a 2% o entero, (2) tu edulcorante no se disuelve — usa miel o sirope de arce en vez de azúcar granulado y mezcla bien antes de congelar, (3) el pote necesita un Re-Spin con 1 cucharada de leche añadida encima.',
        },
        {
          question: '¿Puedo usar yogurt normal (no griego) en el Ninja Creami?',
          answer: 'Sí, pero la textura será más blanda y cercana al soft serve que a un yogurt helado para cuchara. Para un pote más firme, cuela el yogurt normal con una gasa durante 2 horas antes de usarlo (yogurt griego casero), o añade 1 cucharada de queso crema para espesar.',
        },
        {
          question: '¿Cuánta proteína tiene el yogurt helado Ninja Creami?',
          answer: 'Una base de yogurt griego natural entero aporta aproximadamente 18–24 g de proteína por pote. El skyr islandés sube a 24–28 g. Añadir una medida de proteína en polvo te lleva al rango de 30–40 g por pote — revisa nuestras recetas de yogurt helado alto en proteína para proporciones probadas.',
        },
      ],
    },
    de: {
      title: 'Frozen Yogurt Rezepte für Ninja Creami',
      description: 'Cremige Frozen-Yogurt-Rezepte für deinen Ninja Creami. Griechischer Joghurt, frische Früchte und leichtere Alternativen zu herkömmlichem Eis — alle mit Schritt-für-Schritt-Anleitung.',
      metaDescription: 'Ninja Creami Frozen-Yogurt-Rezepte mit griechischem Joghurt und Früchten. Schritt für Schritt zum perfekten selbstgemachten Froyo.',
      longIntroSections: [
        {
          layout: 'two-col',
          markdown: `Hausgemachter Frozen Yogurt bedeutete früher, eine Tisch-Eismaschine rauszuholen, 25 Minuten zu rühren und am Ende etwas Eisiges zu haben, das in zehn Minuten schmolz. Der Ninja Creami ändert die Rechnung komplett — du kannst einen Frozen Yogurt besser als im Einkaufszentrum über Nacht in deinem Gefrierschrank machen, ihn in 90 Sekunden verarbeiten und mit allem toppen, was du willst. Jedes Rezept auf dieser Seite wurde mit einem echten Creami getestet, mit genauen Gefrierzeiten und den Programmen, die funktionieren.

Frozen Yogurt im Creami funktioniert, weil die Maschine dichte, säuerliche Basen hervorragend verarbeitet. Wir verwenden puren griechischen Vollfett-Joghurt als Grundlage (der Fettanteil sorgt für Cremigkeit — meide 0% für bessere Textur), fügen etwas Süße hinzu und lassen frische Früchte, Honig oder Mix-ins die Geschmacksarbeit übernehmen. Das Ergebnis ist dicht, löffelbar und liefert etwa 12–20 g Protein pro Pint, je nach Joghurtmarke.`,
        },
        {
          layout: 'cards',
          heading: 'Die drei Frozen-Yogurt-Stile auf dieser Seite',
          cards: [
            {
              title: 'Klassischer griechischer Frozen Yogurt',
              body: 'Reiner griechischer Joghurt + Honig + Vanille + Früchte. Die einfachste Basis überhaupt und die, mit der du starten solltest, wenn du neu am Creami bist. Dreht sich in einem Durchgang cremig und passt zu jeder Frucht.',
            },
            {
              title: 'Proteinreicher Frozen Yogurt',
              body: 'Skyr, isländischer Joghurt oder griechischer 5%-Joghurt kombiniert mit einem Löffel Vanille-Proteinpulver. Schiebt den Proteinanteil pro Pint über 25 g, ohne die cremige Textur zu verlieren. Nutze für diese Rezepte das Lite-Ice-Cream-Programm, nicht das Frozen-Yogurt-Programm — die etwas aggressivere Klinge verarbeitet proteinreichere Basen besser.',
            },
            {
              title: 'Fruchtiger Frozen Yogurt',
              body: 'Mehr Frucht (Beerenpüree, Mango, Passionsfrucht) mit Joghurt als Träger. Diese sind näher an Frozen-Yogurt-trifft-Sorbet und gehören zu unseren beliebtesten Sommerrezepten.',
            },
          ],
        },
        {
          layout: 'two-col',
          markdown: `**So nutzt du diese Rezepte:** jede Rezeptseite zeigt die komplette Zutatenliste, skaliert auf deine Creami-Pint-Größe, das genaue Programm (meistens "Frozen Yogurt" oder "Lite Ice Cream"), die Gefrierzeit (24 Stunden sind Standard) und Schritt-für-Schritt-Anleitung. Wenn dein erstes Pint vereist ist, gib einen Esslöffel Milch obendrauf und mach einen Re-Spin — die zusätzliche Flüssigkeit behebt 90% aller Texturprobleme.

**Den richtigen Joghurt wählen:** Die Marke zählt. Fage 5%, Elinas griechischer Joghurt und Siggi\'s funktionieren alle gut. Meide fettfreien griechischen Joghurt — er erzeugt eisige, körnige Pints. Für eine dichtere Basis liefert isländischer Skyr die dichteste Frozen-Yogurt-Textur, die wir getestet haben.`,
        },
      ],
      faqs: [
        {
          question: 'Welches Programm nutze ich für Frozen Yogurt im Ninja Creami?',
          answer: 'Nutze das Programm "Frozen Yogurt" für klassische Rezepte mit griechischem Joghurt. Für proteinreiche Joghurt-Basen (mit zusätzlichem Proteinpulver) nutze "Lite Ice Cream" — seine Klingenaktion verarbeitet proteinreichere Mischungen, ohne sie vereisen zu lassen.',
        },
        {
          question: 'Welcher Joghurt eignet sich am besten für Ninja Creami Frozen Yogurt?',
          answer: 'Vollfett-Griechischer-Joghurt (5%) liefert die cremigsten Ergebnisse — wir empfehlen Fage 5%, Elinas Vollfett oder isländischen Skyr (Siggi\'s). Meide 0%-Joghurt — der fehlende Fettanteil macht Pints eisig und körnig. Für weniger Kalorien ist 2%-Joghurt ein fairer Mittelweg.',
        },
        {
          question: 'Wie lange friere ich Frozen Yogurt im Creami ein?',
          answer: 'Friere das gefüllte Pint 24 Stunden bei -18°C oder kälter ein. Weniger als 24 Stunden bedeutet, dass der Block nicht vollständig fest ist und die Klinge ungleichmäßig shavt. Du kannst sicher länger einfrieren (bis zu einer Woche) — nach mehr als 5 Tagen lass das Pint 5 Minuten bei Raumtemperatur stehen, bevor du es verarbeitest.',
        },
        {
          question: 'Warum ist mein Ninja Creami Frozen Yogurt vereist?',
          answer: 'Meistens einer dieser drei Gründe: (1) du hast fettfreien oder 0%-Joghurt verwendet — wechsle zu 2% oder Vollfett, (2) deine Süße löst sich nicht auf — nutze Honig oder Ahornsirup statt Haushaltszucker und verrühre gründlich vor dem Einfrieren, (3) das Pint braucht einen Re-Spin mit 1 Esslöffel Milch obendrauf.',
        },
        {
          question: 'Kann ich normalen (nicht griechischen) Joghurt im Ninja Creami verwenden?',
          answer: 'Ja, aber die Textur wird weicher und näher an Softeis als an löffelbarem Frozen Yogurt. Für ein festeres Pint sieb normalen Joghurt 2 Stunden durch ein Mulltuch (DIY-Griechisch-Joghurt) oder gib 1 Esslöffel Frischkäse zum Verdicken dazu.',
        },
        {
          question: 'Wie viel Protein ist in Ninja Creami Frozen Yogurt?',
          answer: 'Eine Basis aus Vollfett-Griechisch-Joghurt liefert etwa 18–24 g Protein pro Pint. Isländischer Skyr bringt es auf 24–28 g. Ein Löffel Proteinpulver zusätzlich bringt dich in den Bereich von 30–40 g pro Pint — schau in unsere proteinreichen Frozen-Yogurt-Rezepte für getestete Verhältnisse.',
        },
      ],
    },
    pt: {
      title: 'Receitas de Frozen Yogurt para Ninja Creami',
      description: 'Receitas cremosas de frozen yogurt feitas com seu Ninja Creami. Bases de iogurte grego, frutas frescas e alternativas mais leves ao sorvete tradicional — todas com instruções passo a passo.',
      metaDescription: 'Receitas de frozen yogurt Ninja Creami com iogurte grego e frutas. Instruções passo a passo para um froyo caseiro perfeito.',
      longIntroSections: [
        {
          layout: 'two-col',
          markdown: `Fazer frozen yogurt em casa costumava significar tirar uma sorveteira de bancada, bater por 25 minutos e acabar com algo gelado que derretia em dez. O Ninja Creami muda a matemática por completo — você consegue fazer um frozen yogurt melhor que o do shopping no seu freezer da noite para o dia, girar em 90 segundos e cobrir com o que quiser. Cada receita desta página foi testada com um Creami de verdade, com tempos de congelamento exatos e os programas que funcionam.

Frozen yogurt no Creami funciona porque a máquina lida muito bem com bases densas e ácidas. Usamos iogurte grego natural integral como base (a gordura mantém a textura cremosa — evite 0% para melhor resultado), adicionamos um toque de adoçante e deixamos as frutas frescas, o mel ou os mix-ins fazerem o trabalho de sabor. O resultado é denso, para colher, e rende cerca de 12–20 g de proteína por pote dependendo da marca do iogurte.`,
        },
        {
          layout: 'cards',
          heading: 'Os três estilos de frozen yogurt neste site',
          cards: [
            {
              title: 'Frozen yogurt grego clássico',
              body: 'Iogurte grego natural + mel + baunilha + frutas. A base mais simples possível, e a recomendada para quem está começando com o Creami. Gira liso em uma única passada e combina com qualquer fruta que você tenha.',
            },
            {
              title: 'Frozen yogurt rico em proteína',
              body: 'Skyr, iogurte estilo islandês ou iogurte grego 5% combinado com uma dose de whey protein sabor baunilha. Ultrapasse 25 g de proteína por pote sem perder a cremosidade. Use o programa Lite Ice Cream, não o Frozen Yogurt, para essas receitas — a ação de lâmina um pouco mais agressiva lida melhor com bases mais proteicas.',
            },
            {
              title: 'Frozen yogurt frutado',
              body: 'Com mais peso nas frutas (purê de frutas vermelhas, manga, maracujá) e o iogurte como veículo. Essas ficam mais próximas do frozen-yogurt-com-sorbete e são nossas receitas de verão mais populares.',
            },
          ],
        },
        {
          layout: 'two-col',
          markdown: `**Como usar essas receitas:** cada página mostra a lista completa de ingredientes ajustada ao tamanho do seu pote Creami, o programa exato (geralmente "Frozen Yogurt" ou "Lite Ice Cream"), tempo de congelamento (24 horas é o padrão) e instruções passo a passo. Se seu primeiro pote sair gelado, adicione uma colher de sopa de leite por cima e faça um Re-Spin — o líquido extra resolve 90% dos problemas de textura.

**Escolhendo o iogurte:** a marca importa. Fage 5%, Chobani integral e Siggi\'s funcionam bem. Evite iogurte grego 0% — produz potes gelados e granulados. Se quiser uma base mais grossa, o skyr islandês dá a textura de frozen yogurt mais densa que já testamos.`,
        },
      ],
      faqs: [
        {
          question: 'Qual programa uso para frozen yogurt no Ninja Creami?',
          answer: 'Use o programa "Frozen Yogurt" para receitas tradicionais com base de iogurte grego. Para bases ricas em proteína (com whey protein adicionado), use "Lite Ice Cream" — sua ação de lâmina lida melhor com misturas mais proteicas sem deixá-las geladas.',
        },
        {
          question: 'Qual iogurte é melhor para o frozen yogurt do Ninja Creami?',
          answer: 'O iogurte grego natural integral (5%) dá os resultados mais cremosos — recomendamos Fage 5%, Chobani integral ou skyr islandês (Siggi\'s). Evite iogurte grego 0% — a falta de gordura deixa os potes gelados e granulados. Se quiser menos calorias, o iogurte grego 2% é um meio-termo razoável.',
        },
        {
          question: 'Quanto tempo congelo o frozen yogurt no Creami?',
          answer: 'Congele o pote cheio por 24 horas a -18°C ou mais frio. Menos de 24 horas significa que o bloco não está totalmente sólido e a lâmina vai raspar de forma desigual. Você pode congelar por mais tempo sem problema (até uma semana) — se passou de 5 dias, deixe o pote em temperatura ambiente por 5 minutos antes de girar.',
        },
        {
          question: 'Por que meu frozen yogurt do Ninja Creami está gelado?',
          answer: 'Geralmente uma destas três causas: (1) você usou iogurte 0% ou desnatado — mude para 2% ou integral, (2) seu adoçante não está dissolvendo — use mel ou xarope de bordo em vez de açúcar granulado e misture bem antes de congelar, (3) o pote precisa de um Re-Spin com 1 colher de sopa de leite adicionada por cima.',
        },
        {
          question: 'Posso usar iogurte comum (não grego) no Ninja Creami?',
          answer: 'Sim, mas a textura ficará mais macia e próxima do soft serve do que de um frozen yogurt para colher. Para um pote mais firme, coe o iogurte comum em um pano por 2 horas antes de usar (iogurte grego caseiro), ou adicione 1 colher de sopa de cream cheese para engrossar.',
        },
        {
          question: 'Quanta proteína tem o frozen yogurt do Ninja Creami?',
          answer: 'Uma base de iogurte grego natural integral entrega cerca de 18–24 g de proteína por pote. O skyr islandês vai a 24–28 g. Adicionar uma dose de whey protein te leva para a faixa de 30–40 g por pote — veja nossas receitas de frozen yogurt rico em proteína para proporções testadas.',
        },
      ],
    },
  },
  'ice-cream': {
    en: {
      title: 'Ice Cream Recipes for Ninja Creami',
      description: 'Classic and creative ice cream recipes made with your Ninja Creami. Rich, creamy bases with endless flavor combinations — all tested with step-by-step instructions and pro tips.',
      metaDescription: 'Ninja Creami ice cream recipes with step-by-step instructions. Classic vanilla to creative flavors — tested for perfect homemade ice cream every time.',
      longIntroSections: [
        {
          layout: 'two-col',
          markdown: `The Ninja Creami is at its best when you feed it a proper ice cream base. A real cream base — heavy cream, whole milk, and sugar — freezes into a dense block that the Creami blade shaves into that velvety, scoopable texture you can't get from a blender or a regular ice cream maker. Every recipe on this page starts with that foundation and adds a flavor profile we've tested end-to-end, so you know exactly how the finished pint will taste and scoop.

If you're brand new to the machine, start with a classic: vanilla, chocolate, or strawberry. These are the recipes that teach you how the "Ice Cream" program behaves, how long to freeze your pint, and when to reach for the Re-Spin button. Once your first pint comes out glossy instead of crumbly, you'll know your freezer and your Creami are calibrated, and the more advanced recipes — swirls, mix-ins, layered flavors — become much easier to nail.`,
        },
        {
          layout: 'prose',
          markdown: `We also include recipes that use unconventional bases. Cream cheese adds richness and helps prevent iciness. Sweetened condensed milk takes the place of sugar and gives a gelato-like density. Egg yolks (optional, for classic custard-style ice cream) deliver old-school French vanilla without the churn. Each recipe specifies which base it uses and why, so you can pick based on what's in your fridge and what texture you want.`,
        },
        {
          layout: 'two-col',
          markdown: `**How to use these recipes:** click into any recipe and you'll see the full ingredient list scaled for either the 16oz Original Creami pint or the 24oz Deluxe XL, the exact program to run (Ice Cream, Sorbet, Lite Ice Cream, or a combination), freeze time, and step-by-step instructions with troubleshooting notes. If your first pint comes out crumbly, the recipe will tell you to Re-Spin — never give up after one spin.

**Looking for something specific?** Use the filters to narrow by difficulty, prep time, dietary tags (keto, dairy-free, gluten-free, high-protein), or flavor profile. Every recipe includes a star rating from readers who've actually made it.`,
        },
      ],
      faqs: [
        {
          question: 'What is the best Ninja Creami ice cream base?',
          answer: 'The standard base is 1 cup heavy cream + 1/2 cup whole milk + 1/4 cup sugar + 1 tsp vanilla extract. This ratio produces a dense, scoopable pint after one Ice Cream spin. Add cream cheese (1–2 tbsp) for extra richness, or swap in sweetened condensed milk to replace sugar for a gelato-like texture.',
        },
        {
          question: 'How long do you freeze ice cream in the Ninja Creami?',
          answer: 'Freeze your filled pint for 24 hours at 0°F (-18°C) or colder. Less than 24 hours and the block won\'t be solid enough for the blade to shave properly — you\'ll get uneven texture. You can freeze longer (up to a week) without any quality loss.',
        },
        {
          question: 'Why is my Ninja Creami ice cream crumbly?',
          answer: 'Crumbly texture almost always means your pint needs to Re-Spin. The first spin breaks up the frozen block, but it often leaves small unprocessed pieces. Add 1 tablespoon of milk on top, run the Re-Spin program, and it will come out smooth. If it\'s still crumbly after two Re-Spins, your base may be too low-fat.',
        },
        {
          question: 'Can I make ice cream in the Ninja Creami without sugar?',
          answer: 'Yes — use a sweetener that doesn\'t crystallize when frozen. Allulose, monk fruit, and erythritol blends all work well. Avoid stevia alone (it tastes off frozen) and pure erythritol (gets grainy). See our keto ice cream recipes for tested low-sugar bases.',
        },
        {
          question: 'What\'s the difference between Ice Cream and Lite Ice Cream on the Creami?',
          answer: 'The Ice Cream program is for traditional full-fat bases (heavy cream-based recipes). Lite Ice Cream is for low-calorie or lower-fat bases like milk-only, Greek yogurt, or protein powder recipes — it uses a slightly different blade action to handle lower-fat bases without making them icy.',
        },
        {
          question: 'How many scoops does a Ninja Creami pint make?',
          answer: 'A 16oz Original Creami pint makes 3–4 medium scoops (about 4 servings). The 24oz Deluxe XL pint makes 5–6 scoops (about 6 servings). All recipes list exact servings based on pint size.',
        },
      ],
    },
    fr: {
      title: 'Recettes de Crème Glacée pour Ninja Creami',
      description: 'Recettes de crème glacée classiques et créatives pour votre Ninja Creami. Bases riches et crémeuses avec des combinaisons de saveurs infinies — toutes testées avec des instructions étape par étape.',
      metaDescription: 'Recettes de crème glacée Ninja Creami avec instructions étape par étape. De la vanille classique aux saveurs créatives — testées pour un résultat parfait.',
      longIntroSections: [
        {
          layout: 'two-col',
          markdown: `Le Ninja Creami donne le meilleur de lui-même quand vous lui donnez une vraie base de crème glacée. Une base à base de crème — crème liquide entière, lait entier et sucre — congèle en un bloc dense que la lame du Creami rase pour obtenir cette texture veloutée, à la cuillère, que vous ne pouvez pas obtenir d'un blender ou d'une sorbetière classique. Chaque recette de cette page part de cette fondation et ajoute un profil de saveur que nous avons testé de bout en bout, pour que vous sachiez exactement quel goût et quelle texture attendre du pot final.

Si vous débutez avec la machine, commencez par un classique : vanille, chocolat ou fraise. Ce sont les recettes qui vous apprennent comment le programme "Ice Cream" se comporte, combien de temps congeler votre pot et quand utiliser le Re-Spin. Une fois que votre premier pot sort brillant plutôt que friable, vous saurez que votre congélateur et votre Creami sont calibrés, et les recettes plus avancées — swirls, mix-ins, saveurs superposées — deviennent beaucoup plus faciles à maîtriser.`,
        },
        {
          layout: 'prose',
          markdown: `Nous incluons aussi des recettes qui utilisent des bases peu conventionnelles. Le cream cheese apporte de la richesse et aide à éviter l'effet glacé. Le lait concentré sucré remplace le sucre et donne une densité proche du gelato. Les jaunes d'œuf (optionnels, pour une crème glacée style custard classique) offrent une vraie vanille française à l'ancienne sans turbinage. Chaque recette précise quelle base elle utilise et pourquoi, pour que vous puissiez choisir selon ce que vous avez dans le frigo et la texture recherchée.`,
        },
        {
          layout: 'two-col',
          markdown: `**Comment utiliser ces recettes :** cliquez sur une recette et vous verrez la liste complète d'ingrédients ajustée soit au pot 16oz Original Creami soit au 24oz Deluxe XL, le programme exact à lancer (Ice Cream, Sorbet, Lite Ice Cream ou une combinaison), le temps de congélation et les instructions étape par étape avec des notes de dépannage. Si votre premier pot sort friable, la recette vous dira de faire un Re-Spin — n'abandonnez jamais après une seule passe.

**Vous cherchez quelque chose de précis ?** Utilisez les filtres pour affiner par difficulté, temps de préparation, tags diététiques (keto, sans lactose, sans gluten, riche en protéines) ou profil de saveur. Chaque recette inclut une note étoilée de lecteurs qui l'ont réellement faite.`,
        },
      ],
      faqs: [
        {
          question: 'Quelle est la meilleure base de crème glacée Ninja Creami ?',
          answer: 'La base standard est 1 tasse de crème liquide entière + 1/2 tasse de lait entier + 1/4 tasse de sucre + 1 c. à café d\'extrait de vanille. Ce ratio produit un pot dense et à la cuillère après un seul programme Ice Cream. Ajoutez du cream cheese (1–2 c. à soupe) pour plus de richesse, ou remplacez le sucre par du lait concentré sucré pour une texture façon gelato.',
        },
        {
          question: 'Combien de temps congeler la crème glacée dans le Ninja Creami ?',
          answer: 'Congelez votre pot rempli pendant 24 heures à -18°C ou plus froid. Moins de 24 heures et le bloc ne sera pas assez solide pour que la lame le rase correctement — vous obtiendrez une texture inégale. Vous pouvez congeler plus longtemps (jusqu\'à une semaine) sans perte de qualité.',
        },
        {
          question: 'Pourquoi ma crème glacée Ninja Creami est-elle friable ?',
          answer: 'La texture friable signifie presque toujours que votre pot a besoin d\'un Re-Spin. La première passe casse le bloc congelé, mais laisse souvent de petits morceaux non traités. Ajoutez 1 cuillère à soupe de lait sur le dessus, lancez le programme Re-Spin et elle sortira lisse. Si elle est encore friable après deux Re-Spins, votre base est peut-être trop faible en matières grasses.',
        },
        {
          question: 'Puis-je faire de la crème glacée dans le Ninja Creami sans sucre ?',
          answer: 'Oui — utilisez un édulcorant qui ne cristallise pas au congelé. L\'allulose, le fruit du moine et les mélanges d\'érythritol fonctionnent tous bien. Évitez la stévia seule (goût désagréable congelé) et l\'érythritol pur (devient granuleux). Voyez nos recettes de crème glacée keto pour des bases faibles en sucre testées.',
        },
        {
          question: 'Quelle différence entre Ice Cream et Lite Ice Cream sur le Creami ?',
          answer: 'Le programme Ice Cream est pour les bases traditionnelles riches en matières grasses (recettes à base de crème liquide). Lite Ice Cream est pour les bases faibles en calories ou en matières grasses comme celles au lait seul, au yaourt grec ou à la poudre de protéine — il utilise une action de lame légèrement différente pour traiter les bases maigres sans les glacer.',
        },
        {
          question: 'Combien de boules dans un pot Ninja Creami ?',
          answer: 'Un pot Original Creami de 16oz donne 3–4 boules moyennes (environ 4 portions). Le pot Deluxe XL de 24oz donne 5–6 boules (environ 6 portions). Toutes les recettes indiquent le nombre exact de portions selon la taille du pot.',
        },
      ],
    },
    es: {
      title: 'Recetas de Helado para Ninja Creami',
      description: 'Recetas de helado clásicas y creativas hechas con tu Ninja Creami. Bases ricas y cremosas con infinitas combinaciones de sabores — todas probadas con instrucciones paso a paso.',
      metaDescription: 'Recetas de helado Ninja Creami con instrucciones paso a paso. Desde vainilla clásica hasta sabores creativos — probadas para un helado casero perfecto.',
      longIntroSections: [
        {
          layout: 'two-col',
          markdown: `El Ninja Creami da su mejor versión cuando le das una base de helado de verdad. Una base con crema — nata para montar, leche entera y azúcar — se congela en un bloque denso que la cuchilla del Creami raspa hasta esa textura aterciopelada y para cuchara que no vas a conseguir con una licuadora ni con una heladera común. Cada receta de esta página parte de esa base y añade un perfil de sabor que hemos probado de principio a fin, para que sepas exactamente cómo sabrá y se servirá el pote final.

Si empiezas con la máquina, comienza por un clásico: vainilla, chocolate o fresa. Son las recetas que te enseñan cómo se comporta el programa "Ice Cream", cuánto congelar tu pote y cuándo recurrir al Re-Spin. Cuando tu primer pote salga brillante en vez de granulado, sabrás que tu congelador y tu Creami están calibrados, y las recetas más avanzadas — swirls, mix-ins, sabores en capas — resultan mucho más fáciles de clavar.`,
        },
        {
          layout: 'prose',
          markdown: `También incluimos recetas que usan bases poco convencionales. El queso crema aporta riqueza y ayuda a evitar que quede granulado. La leche condensada sustituye al azúcar y da una densidad tipo gelato. Las yemas de huevo (opcionales, para helado tipo custard clásico) consiguen una vainilla francesa a la antigua sin tener que batirla. Cada receta especifica qué base usa y por qué, para que elijas según lo que tengas en la nevera y la textura que busques.`,
        },
        {
          layout: 'two-col',
          markdown: `**Cómo usar estas recetas:** entra en cualquier receta y verás la lista completa de ingredientes escalada al pote de 16oz Original Creami o al 24oz Deluxe XL, el programa exacto a ejecutar (Ice Cream, Sorbet, Lite Ice Cream o una combinación), tiempo de congelado e instrucciones paso a paso con notas de solución de problemas. Si tu primer pote sale granulado, la receta te dirá que hagas un Re-Spin — nunca te rindas tras una sola pasada.

**¿Buscas algo concreto?** Usa los filtros para acotar por dificultad, tiempo de preparación, etiquetas dietéticas (keto, sin lácteos, sin gluten, alto en proteína) o perfil de sabor. Cada receta incluye una puntuación de estrellas de lectores que realmente la han preparado.`,
        },
      ],
      faqs: [
        {
          question: '¿Cuál es la mejor base de helado para el Ninja Creami?',
          answer: 'La base estándar es 1 taza de nata para montar + 1/2 taza de leche entera + 1/4 taza de azúcar + 1 cdta de extracto de vainilla. Esta proporción produce un pote denso para cuchara después de un solo ciclo Ice Cream. Añade queso crema (1–2 cdas) para más riqueza, o cambia el azúcar por leche condensada para una textura tipo gelato.',
        },
        {
          question: '¿Cuánto tiempo congelo el helado en el Ninja Creami?',
          answer: 'Congela el pote lleno durante 24 horas a -18°C o más frío. Menos de 24 horas y el bloque no estará lo bastante sólido para que la cuchilla raspe bien — la textura será irregular. Puedes congelar más tiempo (hasta una semana) sin pérdida de calidad.',
        },
        {
          question: '¿Por qué mi helado Ninja Creami queda granulado?',
          answer: 'La textura granulada casi siempre significa que tu pote necesita un Re-Spin. La primera pasada rompe el bloque congelado pero suele dejar pequeños trozos sin procesar. Añade 1 cucharada de leche encima, lanza el programa Re-Spin y saldrá liso. Si sigue granulado tras dos Re-Spins, tu base puede tener poca grasa.',
        },
        {
          question: '¿Puedo hacer helado en el Ninja Creami sin azúcar?',
          answer: 'Sí — usa un edulcorante que no cristalice al congelar. La alulosa, el monk fruit y las mezclas de eritritol funcionan bien. Evita la estevia sola (sabor raro al congelar) y el eritritol puro (queda granuloso). Mira nuestras recetas de helado keto para bases bajas en azúcar probadas.',
        },
        {
          question: '¿Qué diferencia hay entre Ice Cream y Lite Ice Cream en el Creami?',
          answer: 'El programa Ice Cream es para bases tradicionales altas en grasa (recetas con nata para montar). Lite Ice Cream es para bases bajas en calorías o en grasa como las de solo leche, yogurt griego o proteína en polvo — usa una acción de cuchilla algo distinta para manejar bases magras sin dejarlas heladas.',
        },
        {
          question: '¿Cuántas bolas da un pote del Ninja Creami?',
          answer: 'Un pote Original Creami de 16oz da 3–4 bolas medianas (unas 4 porciones). El pote Deluxe XL de 24oz da 5–6 bolas (unas 6 porciones). Todas las recetas indican el número exacto de porciones según el tamaño del pote.',
        },
      ],
    },
    de: {
      title: 'Eis-Rezepte für Ninja Creami',
      description: 'Klassische und kreative Eis-Rezepte für deinen Ninja Creami. Reichhaltige, cremige Basen mit endlosen Geschmackskombinationen — alle mit Schritt-für-Schritt-Anleitung getestet.',
      metaDescription: 'Ninja Creami Eis-Rezepte mit Schritt-für-Schritt-Anleitung. Von klassischer Vanille bis zu kreativen Geschmacksrichtungen — für perfektes selbstgemachtes Eis.',
      longIntroSections: [
        {
          layout: 'two-col',
          markdown: `Der Ninja Creami ist in seinem Element, wenn du ihm eine echte Eisbasis gibst. Eine richtige Sahnebasis — Schlagsahne, Vollmilch und Zucker — gefriert zu einem dichten Block, den die Creami-Klinge in diese samtige, löffelbare Textur shavt, die du weder mit einem Mixer noch mit einer klassischen Eismaschine hinbekommst. Jedes Rezept auf dieser Seite startet mit dieser Grundlage und ergänzt ein Geschmacksprofil, das wir von Anfang bis Ende getestet haben — damit du genau weißt, wie das fertige Pint schmeckt und sich löffeln lässt.

Wenn du ganz neu mit der Maschine bist, starte mit einem Klassiker: Vanille, Schokolade oder Erdbeere. Diese Rezepte zeigen dir, wie sich das Programm "Ice Cream" verhält, wie lange du dein Pint einfrieren musst und wann der Re-Spin-Knopf ins Spiel kommt. Sobald dein erstes Pint glänzend statt bröselig herauskommt, weißt du, dass Gefrierschrank und Creami eingespielt sind — und die fortgeschrittenen Rezepte mit Swirls, Mix-ins und geschichteten Aromen werden deutlich einfacher.`,
        },
        {
          layout: 'prose',
          markdown: `Wir haben auch Rezepte mit unkonventionellen Basen. Frischkäse bringt Reichhaltigkeit und verhindert Vereisung. Gezuckerte Kondensmilch ersetzt den Zucker und sorgt für eine gelatoartige Dichte. Eigelbe (optional, für klassisches Custard-Eis) liefern altmodische französische Vanille ohne Rühren. Jedes Rezept sagt dir, welche Basis es nutzt und warum — damit du nach Kühlschrankinhalt und gewünschter Textur wählen kannst.`,
        },
        {
          layout: 'two-col',
          markdown: `**So nutzt du diese Rezepte:** klick in ein Rezept und du siehst die komplette Zutatenliste, skaliert entweder auf das 16oz Original Creami Pint oder das 24oz Deluxe XL, das genaue Programm (Ice Cream, Sorbet, Lite Ice Cream oder eine Kombination), Gefrierzeit und Schritt-für-Schritt-Anleitung mit Troubleshooting-Hinweisen. Wenn dein erstes Pint bröselig herauskommt, verweist das Rezept auf den Re-Spin — gib nie nach einer einzigen Runde auf.

**Suchst du etwas Bestimmtes?** Nutze die Filter nach Schwierigkeitsgrad, Vorbereitungszeit, Ernährungs-Tags (Keto, milchfrei, glutenfrei, proteinreich) oder Geschmacksprofil. Jedes Rezept enthält eine Sternebewertung von Lesern, die es tatsächlich gemacht haben.`,
        },
      ],
      faqs: [
        {
          question: 'Was ist die beste Ninja Creami Eisbasis?',
          answer: 'Die Standardbasis ist 1 Tasse Schlagsahne + 1/2 Tasse Vollmilch + 1/4 Tasse Zucker + 1 TL Vanilleextrakt. Dieses Verhältnis ergibt nach einem Ice-Cream-Durchgang ein dichtes, löffelbares Pint. Für mehr Reichhaltigkeit 1–2 EL Frischkäse dazugeben oder den Zucker durch gezuckerte Kondensmilch ersetzen für gelato-artige Textur.',
        },
        {
          question: 'Wie lange friere ich Eis im Ninja Creami ein?',
          answer: 'Friere das gefüllte Pint 24 Stunden bei -18°C oder kälter ein. Weniger als 24 Stunden und der Block ist nicht fest genug, damit die Klinge richtig shavt — du bekommst ungleichmäßige Textur. Länger einfrieren (bis zu einer Woche) ist problemlos möglich.',
        },
        {
          question: 'Warum ist mein Ninja Creami Eis bröselig?',
          answer: 'Bröselige Textur bedeutet fast immer, dass dein Pint einen Re-Spin braucht. Der erste Durchgang bricht den gefrorenen Block auf, lässt aber oft kleine, unbearbeitete Stücke zurück. Einen Esslöffel Milch obendrauf, Re-Spin laufen lassen, und es wird glatt. Wenn es nach zwei Re-Spins noch bröselig ist, ist deine Basis eventuell zu fettarm.',
        },
        {
          question: 'Kann ich im Ninja Creami Eis ohne Zucker machen?',
          answer: 'Ja — nimm ein Süßungsmittel, das beim Gefrieren nicht kristallisiert. Allulose, Mönchsfrucht und Erythrit-Blends funktionieren gut. Meide Stevia allein (schmeckt gefroren unangenehm) und reines Erythrit (wird körnig). Schau in unsere Keto-Eis-Rezepte für getestete zuckerarme Basen.',
        },
        {
          question: 'Was ist der Unterschied zwischen Ice Cream und Lite Ice Cream beim Creami?',
          answer: 'Das Ice-Cream-Programm ist für klassische fettreiche Basen (Sahne-Rezepte). Lite Ice Cream ist für kalorienärmere oder fettärmere Basen wie reine Milch, griechischen Joghurt oder Proteinpulver-Rezepte — es nutzt eine leicht andere Klingenaktion, damit fettärmere Basen nicht vereisen.',
        },
        {
          question: 'Wie viele Kugeln ergibt ein Ninja Creami Pint?',
          answer: 'Ein 16oz Original Creami Pint ergibt 3–4 mittlere Kugeln (etwa 4 Portionen). Das 24oz Deluxe XL Pint ergibt 5–6 Kugeln (etwa 6 Portionen). Alle Rezepte geben die exakten Portionen je nach Pint-Größe an.',
        },
      ],
    },
    pt: {
      title: 'Receitas de Sorvete para Ninja Creami',
      description: 'Receitas de sorvete clássicas e criativas feitas com seu Ninja Creami. Bases ricas e cremosas com combinações infinitas de sabores — todas testadas com instruções passo a passo.',
      metaDescription: 'Receitas de sorvete Ninja Creami com instruções passo a passo. Da baunilha clássica a sabores criativos — testadas para um sorvete caseiro perfeito.',
      longIntroSections: [
        {
          layout: 'two-col',
          markdown: `O Ninja Creami dá o seu melhor quando você coloca uma base de sorvete de verdade. Uma base com creme — creme de leite fresco, leite integral e açúcar — congela em um bloco denso que a lâmina do Creami raspa até aquela textura aveludada, de colher, que você não consegue com um liquidificador nem com uma sorveteira comum. Cada receita desta página parte dessa fundação e adiciona um perfil de sabor que testamos do começo ao fim, para você saber exatamente como o pote final vai ter gosto e servir.

Se você é novo na máquina, comece por um clássico: baunilha, chocolate ou morango. São as receitas que te ensinam como o programa "Ice Cream" se comporta, quanto tempo congelar seu pote e quando usar o Re-Spin. Quando seu primeiro pote sair brilhante em vez de quebradiço, você vai saber que seu freezer e seu Creami estão calibrados, e as receitas mais avançadas — swirls, mix-ins, sabores em camadas — ficam bem mais fáceis de acertar.`,
        },
        {
          layout: 'prose',
          markdown: `Também incluímos receitas que usam bases não convencionais. O cream cheese traz riqueza e ajuda a evitar que fique gelado. O leite condensado substitui o açúcar e dá uma densidade tipo gelato. Gemas de ovo (opcionais, para sorvete estilo custard clássico) entregam baunilha francesa à moda antiga sem precisar bater. Cada receita especifica qual base usa e por quê, para você escolher de acordo com o que tem na geladeira e a textura que deseja.`,
        },
        {
          layout: 'two-col',
          markdown: `**Como usar essas receitas:** clique em qualquer receita e verá a lista completa de ingredientes ajustada ao pote de 16oz Original Creami ou ao 24oz Deluxe XL, o programa exato a rodar (Ice Cream, Sorbet, Lite Ice Cream ou uma combinação), tempo de congelamento e instruções passo a passo com notas de solução de problemas. Se seu primeiro pote sair quebradiço, a receita vai pedir um Re-Spin — nunca desista depois de uma única passada.

**Procurando algo específico?** Use os filtros para refinar por dificuldade, tempo de preparo, tags dietéticas (keto, sem lactose, sem glúten, rico em proteína) ou perfil de sabor. Cada receita inclui uma avaliação por estrelas de leitores que realmente fizeram a receita.`,
        },
      ],
      faqs: [
        {
          question: 'Qual é a melhor base de sorvete para o Ninja Creami?',
          answer: 'A base padrão é 1 xícara de creme de leite fresco + 1/2 xícara de leite integral + 1/4 xícara de açúcar + 1 colher de chá de extrato de baunilha. Essa proporção produz um pote denso para colher depois de um único ciclo Ice Cream. Adicione cream cheese (1–2 colheres de sopa) para mais riqueza, ou troque o açúcar por leite condensado para uma textura tipo gelato.',
        },
        {
          question: 'Quanto tempo congelo o sorvete no Ninja Creami?',
          answer: 'Congele o pote cheio por 24 horas a -18°C ou mais frio. Menos de 24 horas e o bloco não estará sólido o bastante para a lâmina raspar direito — a textura fica irregular. Você pode congelar por mais tempo (até uma semana) sem perda de qualidade.',
        },
        {
          question: 'Por que meu sorvete do Ninja Creami está quebradiço?',
          answer: 'Textura quebradiça quase sempre significa que seu pote precisa de um Re-Spin. A primeira passada quebra o bloco congelado, mas costuma deixar pequenos pedaços sem processar. Adicione 1 colher de sopa de leite por cima, rode o programa Re-Spin e ele sairá liso. Se ainda ficar quebradiço depois de dois Re-Spins, sua base pode estar com pouca gordura.',
        },
        {
          question: 'Posso fazer sorvete no Ninja Creami sem açúcar?',
          answer: 'Sim — use um adoçante que não cristalize quando congelado. Alulose, monk fruit e blends de eritritol funcionam bem. Evite estévia sozinha (fica com gosto estranho congelada) e eritritol puro (fica granuloso). Veja nossas receitas de sorvete keto para bases com pouco açúcar testadas.',
        },
        {
          question: 'Qual a diferença entre Ice Cream e Lite Ice Cream no Creami?',
          answer: 'O programa Ice Cream é para bases tradicionais com gordura alta (receitas à base de creme de leite). Lite Ice Cream é para bases com menos calorias ou gordura, como só leite, iogurte grego ou proteína em pó — usa uma ação de lâmina um pouco diferente para processar bases magras sem deixá-las geladas.',
        },
        {
          question: 'Quantas bolas rende um pote Ninja Creami?',
          answer: 'Um pote Original Creami de 16oz rende 3–4 bolas médias (cerca de 4 porções). O pote Deluxe XL de 24oz rende 5–6 bolas (cerca de 6 porções). Todas as receitas listam o número exato de porções de acordo com o tamanho do pote.',
        },
      ],
    },
  },
  'sorbet': {
    en: {
      title: 'Sorbet Recipes for Ninja Creami',
      description: 'Refreshing dairy-free sorbet recipes for your Ninja Creami. Fresh fruit bases, vibrant flavors, and naturally lighter frozen treats — all with step-by-step instructions.',
      metaDescription: 'Dairy-free Ninja Creami sorbet recipes — fresh fruit bases, vibrant color, no added cream. Classics like strawberry plus gourmet twists like cherry-balsamic.',
      longIntroSections: [
        {
          layout: 'two-col',
          markdown: `Sorbet is where the Ninja Creami shines brightest for anyone dairy-free, vegan, or just looking for something lighter than ice cream. The machine is uniquely good at turning a fruit puree into a smooth, intensely-flavored frozen pint — no cream, no milk, just fruit, water, and a bit of sugar — that tastes like a gelato cafe on the Italian coast. Every recipe on this page uses fresh or frozen fruit and has been tested on the Sorbet program.

The secret to a creamy sorbet (instead of an icy one) is the sugar-to-fruit ratio. Too little sugar and you get a rock-hard block that the blade can\'t shave properly; too much and it stays soft and syrupy. Our recipes are dialed in to the sweet spot: around 1/3 cup of sugar per 2 cups of fruit puree, adjusted for the natural sweetness of each fruit. This ratio gives you a pint that scoops out soft, holds its shape, and actually tastes like the fruit instead of just sugar.`,
        },
        {
          layout: 'cards',
          heading: 'The three sorbet styles on this site',
          cards: [
            {
              title: 'Classic fruit sorbets',
              body: 'Strawberry, raspberry, mango, lemon. Pure fruit + sugar + water, balanced for creaminess. The simplest sorbets and the easiest to nail on your first try — start here if you\'re new to the Sorbet program.',
            },
            {
              title: 'Gourmet twist sorbets',
              body: 'Cherry-balsamic, strawberry-lemon-basil, blackberry-lime-ginger. Classic fruit bases with one unexpected ingredient that elevates the flavor into something cafe-worthy. Same technique, more interesting flavor.',
            },
            {
              title: 'Tropical and exotic sorbets',
              body: 'Lychee, passion fruit, pineapple-mint, açaí. Made with frozen tropical purees or packets, these skip the freeze-a-fresh-fruit step and deliver intense, restaurant-style flavor in one spin.',
            },
          ],
        },
        {
          layout: 'two-col',
          markdown: `**How to use these recipes:** every recipe page lists the exact fruit ratio, sugar amount, and whether to use frozen or fresh fruit. Use the "Sorbet" program for any pure-fruit base; if your pint comes out icy after one spin, add a tablespoon of water and Re-Spin — sorbet responds to extra liquid even better than ice cream does.

**Choosing your fruit:** ripe, in-season fruit gives the best sorbet, but frozen fruit works almost as well and is available year-round. We note which works best for each recipe. Avoid canned fruit in syrup — the preserving syrup throws off the sugar balance and makes the pint overly sweet and soft.`,
        },
      ],
      faqs: [
        {
          question: 'What is the best sugar-to-fruit ratio for Ninja Creami sorbet?',
          answer: 'About 1/3 cup of sugar per 2 cups of fruit puree — adjusted up or down depending on the natural sweetness of the fruit. Very tart fruit like raspberry needs more sugar; very sweet fruit like ripe mango needs less. Too little sugar and the block is rock-hard and icy; too much and the pint stays soft.',
        },
        {
          question: 'Why is my Ninja Creami sorbet icy?',
          answer: 'Usually the sugar-to-fruit ratio is off (not enough sugar) or the pint needs a Re-Spin with a tablespoon of water added on top. Sugar disrupts ice crystal formation, which is why low-sugar sorbets freeze harder and come out icier. If you want lower sugar, replace with allulose — it has the same cryoprotective effect without the calories.',
        },
        {
          question: 'Can I use frozen fruit in Ninja Creami sorbet recipes?',
          answer: 'Yes — frozen fruit works perfectly. Most of our recipes call for frozen fruit because it\'s cheaper, available year-round, and already blanched/stabilized. Just thaw enough to puree smoothly, then freeze the final pint for 24 hours as normal.',
        },
        {
          question: 'Is Ninja Creami sorbet vegan and dairy-free?',
          answer: 'Yes — classic sorbet contains only fruit, water, and sugar, all plant-based. Every recipe marked "Sorbet" on this page is vegan and dairy-free. Some variations add honey for sweetener; if you\'re strictly vegan, sub maple syrup or agave for the same effect.',
        },
        {
          question: 'Which program do I use for sorbet on the Creami?',
          answer: 'Use the "Sorbet" program on any Creami model. It\'s designed for harder, denser frozen blocks and uses more torque than the Ice Cream program to shave the fruit-water base into smooth texture. Using the Ice Cream program on sorbet will often leave it icy or crumbly.',
        },
        {
          question: 'How do I make a sorbet less sweet?',
          answer: 'Don\'t just cut sugar — sugar is a structural ingredient that prevents ice crystals. Instead, swap half the sugar for allulose (or monk fruit + erythritol blend), which provides similar cryoprotection with fewer calories and less sweetness. You can also add a squeeze of lemon juice to balance sweetness without touching the sugar ratio.',
        },
      ],
    },
    fr: {
      title: 'Recettes de Sorbet pour Ninja Creami',
      description: 'Recettes de sorbet rafraîchissantes et sans produits laitiers pour votre Ninja Creami. Bases de fruits frais, saveurs vibrantes et desserts glacés naturellement légers — avec instructions étape par étape.',
      metaDescription: 'Recettes de sorbet Ninja Creami sans lactose — bases aux fruits frais, couleurs vibrantes, zéro crème ajoutée. Fraise classique ou cerise-balsamique gourmet.',
      longIntroSections: [
        {
          layout: 'two-col',
          markdown: `Le sorbet, c\'est là que le Ninja Creami brille le plus pour ceux qui sont sans lactose, végans, ou simplement en quête de quelque chose de plus léger qu\'une glace. La machine est particulièrement douée pour transformer une purée de fruits en un pot lisse et intensément parfumé — pas de crème, pas de lait, juste des fruits, de l\'eau et un peu de sucre — qui a le goût d\'un café de gelato sur la côte italienne. Chaque recette de cette page utilise des fruits frais ou surgelés et a été testée sur le programme Sorbet.

Le secret d\'un sorbet crémeux (au lieu de glacé) est le ratio sucre-fruits. Trop peu de sucre et vous obtenez un bloc dur comme du roc que la lame ne peut pas raser correctement ; trop et il reste mou et sirupeux. Nos recettes sont calées sur le point idéal : environ 1/3 de tasse de sucre pour 2 tasses de purée de fruits, ajusté selon la douceur naturelle de chaque fruit. Ce ratio vous donne un pot qui se récupère tendre, garde sa forme et a vraiment le goût du fruit plutôt que du sucre.`,
        },
        {
          layout: 'cards',
          heading: 'Les trois styles de sorbet sur ce site',
          cards: [
            {
              title: 'Sorbets de fruits classiques',
              body: 'Fraise, framboise, mangue, citron. Pur fruit + sucre + eau, équilibré pour la crémeux. Les sorbets les plus simples et les plus faciles à réussir dès le premier essai — commencez ici si vous débutez avec le programme Sorbet.',
            },
            {
              title: 'Sorbets gourmet revisités',
              body: 'Cerise-balsamique, fraise-citron-basilic, mûre-citron vert-gingembre. Des bases de fruits classiques avec un ingrédient inattendu qui élève la saveur à quelque chose digne d\'un café. Même technique, saveur plus intéressante.',
            },
            {
              title: 'Sorbets tropicaux et exotiques',
              body: 'Litchi, fruit de la passion, ananas-menthe, açaï. Faits avec des purées ou sachets tropicaux surgelés, ces sorbets sautent l\'étape "congeler un fruit frais" et livrent une saveur intense style restaurant en un seul turbinage.',
            },
          ],
        },
        {
          layout: 'two-col',
          markdown: `**Comment utiliser ces recettes :** chaque page de recette indique le ratio de fruits exact, la quantité de sucre et s\'il faut utiliser des fruits surgelés ou frais. Utilisez le programme "Sorbet" pour toute base pure-fruit ; si votre pot sort glacé après un tour, ajoutez une cuillère à soupe d\'eau et faites un Re-Spin — le sorbet répond encore mieux au liquide supplémentaire que la crème glacée.

**Choisir ses fruits :** un fruit mûr de saison donne le meilleur sorbet, mais le fruit surgelé fonctionne presque aussi bien et est disponible toute l\'année. Nous indiquons lequel convient le mieux à chaque recette. Évitez les fruits en conserve dans du sirop — le sirop de conservation déséquilibre le dosage sucre et rend le pot trop sucré et mou.`,
        },
      ],
      faqs: [
        {
          question: 'Quel est le meilleur ratio sucre-fruits pour le sorbet Ninja Creami ?',
          answer: 'Environ 1/3 de tasse de sucre pour 2 tasses de purée de fruits — à ajuster selon la douceur naturelle du fruit. Un fruit très acide comme la framboise a besoin de plus de sucre ; un fruit très sucré comme la mangue mûre en a besoin de moins. Trop peu de sucre et le bloc est dur comme du roc et glacé ; trop et le pot reste mou.',
        },
        {
          question: 'Pourquoi mon sorbet Ninja Creami est-il glacé ?',
          answer: 'Généralement le ratio sucre-fruits est déséquilibré (pas assez de sucre) ou le pot a besoin d\'un Re-Spin avec une cuillère à soupe d\'eau ajoutée sur le dessus. Le sucre empêche la formation de cristaux de glace, c\'est pourquoi les sorbets peu sucrés congèlent plus dur et sortent plus glacés. Si vous voulez moins de sucre, remplacez par de l\'allulose — elle a le même effet cryoprotecteur sans les calories.',
        },
        {
          question: 'Puis-je utiliser des fruits surgelés dans les recettes de sorbet Ninja Creami ?',
          answer: 'Oui — les fruits surgelés fonctionnent parfaitement. La plupart de nos recettes demandent des fruits surgelés parce que c\'est moins cher, disponible toute l\'année et déjà blanchi/stabilisé. Il suffit de les décongeler juste assez pour pouvoir les mixer en purée lisse, puis de congeler le pot final 24 heures comme d\'habitude.',
        },
        {
          question: 'Le sorbet Ninja Creami est-il végan et sans lactose ?',
          answer: 'Oui — le sorbet classique ne contient que des fruits, de l\'eau et du sucre, tous d\'origine végétale. Chaque recette marquée "Sorbet" sur cette page est végane et sans lactose. Certaines variantes ajoutent du miel comme édulcorant ; si vous êtes strictement végan, remplacez par du sirop d\'érable ou de l\'agave pour le même effet.',
        },
        {
          question: 'Quel programme utiliser pour le sorbet sur le Creami ?',
          answer: 'Utilisez le programme "Sorbet" sur n\'importe quel modèle Creami. Il est conçu pour les blocs congelés plus durs et denses, et utilise plus de couple que le programme Ice Cream pour raser la base fruit-eau en une texture lisse. Utiliser le programme Ice Cream sur un sorbet le laissera souvent glacé ou friable.',
        },
        {
          question: 'Comment faire un sorbet moins sucré ?',
          answer: 'Ne réduisez pas juste le sucre — le sucre est un ingrédient structurel qui empêche la formation de cristaux de glace. Remplacez plutôt la moitié du sucre par de l\'allulose (ou un mélange monk fruit + érythritol), qui offre une cryoprotection similaire avec moins de calories et moins de goût sucré. Vous pouvez aussi ajouter un trait de jus de citron pour équilibrer la douceur sans toucher au ratio de sucre.',
        },
      ],
    },
    es: {
      title: 'Recetas de Sorbete para Ninja Creami',
      description: 'Recetas de sorbete refrescantes y sin lácteos para tu Ninja Creami. Bases de frutas frescas, sabores vibrantes y postres helados naturalmente ligeros — con instrucciones paso a paso.',
      metaDescription: 'Recetas de sorbete Ninja Creami sin lácteos — bases de fruta fresca, color vibrante, sin crema añadida. Fresa clásica y versiones gourmet como cereza-balsámico.',
      longIntroSections: [
        {
          layout: 'two-col',
          markdown: `El sorbete es donde el Ninja Creami brilla más para quien no consume lácteos, es vegano, o simplemente busca algo más ligero que un helado. La máquina es especialmente buena convirtiendo un puré de fruta en un pote liso e intensamente sabroso — sin crema, sin leche, solo fruta, agua y un poco de azúcar — que sabe como un café de gelato en la costa italiana. Cada receta de esta página usa fruta fresca o congelada y se ha probado con el programa Sorbet.

El secreto de un sorbete cremoso (en lugar de granulado) está en la proporción azúcar-fruta. Muy poco azúcar y obtienes un bloque duro como piedra que la cuchilla no puede raspar bien; demasiado y se queda blando y pegajoso. Nuestras recetas están calibradas al punto exacto: unos 1/3 de taza de azúcar por cada 2 tazas de puré de fruta, ajustado según la dulzura natural de cada fruta. Esta proporción te da un pote que se saca suave, mantiene forma y sabe realmente a fruta en vez de solo a azúcar.`,
        },
        {
          layout: 'cards',
          heading: 'Los tres estilos de sorbete en este sitio',
          cards: [
            {
              title: 'Sorbetes de fruta clásicos',
              body: 'Fresa, frambuesa, mango, limón. Fruta pura + azúcar + agua, equilibrados para la cremosidad. Los sorbetes más simples y los más fáciles de clavar al primer intento — empieza aquí si eres nuevo con el programa Sorbet.',
            },
            {
              title: 'Sorbetes gourmet con giro',
              body: 'Cereza-balsámico, fresa-limón-albahaca, mora-lima-jengibre. Bases de fruta clásicas con un ingrediente inesperado que eleva el sabor a algo digno de café. Misma técnica, sabor más interesante.',
            },
            {
              title: 'Sorbetes tropicales y exóticos',
              body: 'Lichi, maracuyá, piña-menta, açaí. Hechos con purés o sobres tropicales congelados, estos sorbetes se saltan el paso de congelar-una-fruta-fresca y entregan un sabor intenso estilo restaurante en un solo giro.',
            },
          ],
        },
        {
          layout: 'two-col',
          markdown: `**Cómo usar estas recetas:** cada página indica la proporción exacta de fruta, la cantidad de azúcar y si usar fruta fresca o congelada. Usa el programa "Sorbet" para cualquier base pura de fruta; si tu pote sale helado tras una pasada, añade una cucharada de agua y haz un Re-Spin — el sorbete responde aún mejor al líquido extra que el helado.

**Eligiendo la fruta:** la fruta madura de temporada da el mejor sorbete, pero la fruta congelada funciona casi igual de bien y está disponible todo el año. Indicamos cuál va mejor para cada receta. Evita la fruta en conserva con almíbar — el almíbar rompe el equilibrio de azúcar y deja el pote demasiado dulce y blando.`,
        },
      ],
      faqs: [
        {
          question: '¿Cuál es la mejor proporción azúcar-fruta para el sorbete Ninja Creami?',
          answer: 'Unos 1/3 de taza de azúcar por cada 2 tazas de puré de fruta — ajustado según la dulzura natural del fruto. Fruta muy ácida como la frambuesa necesita más azúcar; fruta muy dulce como el mango maduro necesita menos. Muy poco azúcar y el bloque queda duro como piedra y granulado; demasiado y el pote se queda blando.',
        },
        {
          question: '¿Por qué mi sorbete Ninja Creami sale granulado?',
          answer: 'Normalmente la proporción azúcar-fruta está mal (poco azúcar) o el pote necesita un Re-Spin con una cucharada de agua añadida encima. El azúcar impide la formación de cristales de hielo, por eso los sorbetes bajos en azúcar se congelan más duros y salen más granulados. Si quieres menos azúcar, sustitúyelo por alulosa — tiene el mismo efecto crioprotector sin las calorías.',
        },
        {
          question: '¿Puedo usar fruta congelada en las recetas de sorbete Ninja Creami?',
          answer: 'Sí — la fruta congelada funciona perfectamente. La mayoría de nuestras recetas piden fruta congelada porque es más barata, está disponible todo el año y ya viene escaldada/estabilizada. Basta con descongelarla lo justo para triturarla en puré liso y después congelar el pote final 24 horas como siempre.',
        },
        {
          question: '¿El sorbete Ninja Creami es vegano y sin lácteos?',
          answer: 'Sí — el sorbete clásico contiene solo fruta, agua y azúcar, todos de origen vegetal. Cada receta marcada como "Sorbet" en esta página es vegana y sin lácteos. Algunas variantes añaden miel como endulzante; si eres estrictamente vegano, sustituye por sirope de arce o agave para el mismo efecto.',
        },
        {
          question: '¿Qué programa uso para el sorbete en el Creami?',
          answer: 'Usa el programa "Sorbet" en cualquier modelo de Creami. Está diseñado para bloques congelados más duros y densos, y usa más torque que el programa Ice Cream para raspar la base fruta-agua hasta una textura lisa. Usar el programa Ice Cream en un sorbete lo deja a menudo granulado o quebradizo.',
        },
        {
          question: '¿Cómo hago un sorbete menos dulce?',
          answer: 'No reduzcas el azúcar sin más — el azúcar es un ingrediente estructural que impide los cristales de hielo. Cambia mejor la mitad del azúcar por alulosa (o una mezcla de monk fruit + eritritol), que da una crioprotección similar con menos calorías y menos dulzor. También puedes añadir un chorrito de limón para equilibrar la dulzura sin tocar la proporción de azúcar.',
        },
      ],
    },
    de: {
      title: 'Sorbet-Rezepte für Ninja Creami',
      description: 'Erfrischende milchfreie Sorbet-Rezepte für deinen Ninja Creami. Frische Fruchtbasen, lebhafte Aromen und natürlich leichtere Eiskreationen — mit Schritt-für-Schritt-Anleitung.',
      metaDescription: 'Milchfreie Ninja Creami Sorbet-Rezepte — frische Fruchtbasen, leuchtende Farben, keine Sahne. Klassische Erdbeere bis Gourmet wie Kirsch-Balsamico.',
      longIntroSections: [
        {
          layout: 'two-col',
          markdown: `Sorbet ist das, worin der Ninja Creami für alle, die milchfrei, vegan oder einfach auf etwas Leichteres als Eis aus sind, am stärksten strahlt. Die Maschine ist besonders gut darin, ein Fruchtpüree in ein glattes, intensiv aromatisches Pint zu verwandeln — keine Sahne, keine Milch, nur Frucht, Wasser und etwas Zucker — das schmeckt wie ein Gelato-Café an der italienischen Küste. Jedes Rezept auf dieser Seite nutzt frische oder gefrorene Früchte und wurde mit dem Sorbet-Programm getestet.

Der Schlüssel zu cremigem Sorbet (statt eisigem) ist das Zucker-Frucht-Verhältnis. Zu wenig Zucker und du bekommst einen steinharten Block, den die Klinge nicht richtig shavt; zu viel und es bleibt weich und sirupartig. Unsere Rezepte treffen den Sweet Spot: etwa 1/3 Tasse Zucker auf 2 Tassen Fruchtpüree, angepasst an die natürliche Süße jeder Frucht. Dieses Verhältnis liefert ein Pint, das weich auslöffelbar ist, seine Form hält und tatsächlich nach Frucht schmeckt — nicht nach Zucker.`,
        },
        {
          layout: 'cards',
          heading: 'Die drei Sorbet-Stile auf dieser Seite',
          cards: [
            {
              title: 'Klassische Fruchtsorbets',
              body: 'Erdbeere, Himbeere, Mango, Zitrone. Reine Frucht + Zucker + Wasser, auf Cremigkeit abgestimmt. Die einfachsten Sorbets und die, die beim ersten Versuch am leichtesten gelingen — starte hier, wenn du das Sorbet-Programm neu ausprobierst.',
            },
            {
              title: 'Gourmet-Sorbets mit Twist',
              body: 'Kirsch-Balsamico, Erdbeer-Zitrone-Basilikum, Brombeer-Limette-Ingwer. Klassische Fruchtbasen mit einer unerwarteten Zutat, die den Geschmack in etwas Café-würdiges hebt. Gleiche Technik, interessanterer Geschmack.',
            },
            {
              title: 'Tropische und exotische Sorbets',
              body: 'Lychee, Passionsfrucht, Ananas-Minze, Açaí. Mit gefrorenen tropischen Pürees oder Päckchen gemacht, überspringen diese den "Frisches-Obst-einfrieren"-Schritt und liefern in einem Durchgang intensiven Restaurant-Geschmack.',
            },
          ],
        },
        {
          layout: 'two-col',
          markdown: `**So nutzt du diese Rezepte:** Jede Rezeptseite nennt das genaue Fruchtverhältnis, die Zuckermenge und ob frische oder gefrorene Frucht verwendet wird. Nutze das Programm "Sorbet" für jede reine Fruchtbasis; wenn dein Pint nach einem Durchgang eisig herauskommt, einen Esslöffel Wasser obendrauf und Re-Spin — Sorbet reagiert auf zusätzliche Flüssigkeit sogar besser als Eis.

**Die richtige Frucht wählen:** Reifes, saisonales Obst ergibt das beste Sorbet, aber gefrorenes Obst funktioniert fast genauso gut und ist ganzjährig verfügbar. Wir geben für jedes Rezept an, was am besten passt. Meide eingelegte Früchte in Sirup — der Sirup verschiebt das Zucker-Gleichgewicht und macht das Pint zu süß und weich.`,
        },
      ],
      faqs: [
        {
          question: 'Was ist das beste Zucker-Frucht-Verhältnis für Ninja Creami Sorbet?',
          answer: 'Etwa 1/3 Tasse Zucker auf 2 Tassen Fruchtpüree — je nach natürlicher Süße der Frucht nach oben oder unten angepasst. Sehr saure Früchte wie Himbeere brauchen mehr Zucker; sehr süße wie reife Mango weniger. Zu wenig Zucker und der Block ist steinhart und eisig; zu viel und das Pint bleibt weich.',
        },
        {
          question: 'Warum ist mein Ninja Creami Sorbet eisig?',
          answer: 'Meistens stimmt das Zucker-Frucht-Verhältnis nicht (zu wenig Zucker) oder das Pint braucht einen Re-Spin mit einem Esslöffel Wasser obendrauf. Zucker verhindert Eiskristallbildung, deshalb gefrieren zuckerarme Sorbets härter und kommen eisiger heraus. Willst du weniger Zucker, ersetze ihn durch Allulose — sie wirkt kryoprotektiv ähnlich, aber ohne die Kalorien.',
        },
        {
          question: 'Kann ich gefrorene Früchte in Ninja Creami Sorbet-Rezepten verwenden?',
          answer: 'Ja — gefrorene Früchte funktionieren perfekt. Die meisten unserer Rezepte nutzen gefrorene Früchte, weil sie günstiger sind, ganzjährig verfügbar und bereits blanchiert/stabilisiert. Einfach so weit antauen, dass sie zu glattem Püree werden, dann das fertige Pint wie gewohnt 24 Stunden einfrieren.',
        },
        {
          question: 'Ist Ninja Creami Sorbet vegan und milchfrei?',
          answer: 'Ja — klassisches Sorbet enthält nur Frucht, Wasser und Zucker, alle pflanzlich. Jedes mit "Sorbet" markierte Rezept auf dieser Seite ist vegan und milchfrei. Manche Varianten nutzen Honig als Süße; bist du streng vegan, ersetze ihn durch Ahornsirup oder Agavendicksaft für denselben Effekt.',
        },
        {
          question: 'Welches Programm nutze ich für Sorbet am Creami?',
          answer: 'Nutze das Programm "Sorbet" bei jedem Creami-Modell. Es ist für härtere, dichtere gefrorene Blöcke ausgelegt und nutzt mehr Drehmoment als das Ice-Cream-Programm, um die Frucht-Wasser-Basis glatt zu shaven. Das Ice-Cream-Programm auf Sorbet anzuwenden führt oft zu eisiger oder bröseliger Textur.',
        },
        {
          question: 'Wie mache ich ein weniger süßes Sorbet?',
          answer: 'Reduziere nicht einfach den Zucker — Zucker ist eine strukturelle Zutat, die Eiskristalle verhindert. Ersetze stattdessen die Hälfte des Zuckers durch Allulose (oder einen Mönchsfrucht+Erythrit-Blend), die eine ähnliche Kryoprotektion bei weniger Kalorien und weniger Süße bietet. Du kannst auch einen Spritzer Zitronensaft hinzugeben, um die Süße auszubalancieren, ohne am Zuckeranteil zu drehen.',
        },
      ],
    },
    pt: {
      title: 'Receitas de Sorbet para Ninja Creami',
      description: 'Receitas refrescantes de sorbet sem lactose para seu Ninja Creami. Bases de frutas frescas, sabores vibrantes e sobremesas geladas naturalmente leves — com instruções passo a passo.',
      metaDescription: 'Receitas de sorbet Ninja Creami sem lactose — bases de fruta fresca, cor vibrante, zero creme adicionado. Do morango clássico ao cereja-balsâmico gourmet.',
      longIntroSections: [
        {
          layout: 'two-col',
          markdown: `O sorbet é onde o Ninja Creami brilha mais para quem é intolerante à lactose, vegano ou simplesmente quer algo mais leve que sorvete. A máquina é especialmente boa em transformar um purê de fruta num pote liso e intensamente saboroso — sem creme, sem leite, só fruta, água e um pouco de açúcar — com gosto de café de gelato na costa italiana. Cada receita desta página usa fruta fresca ou congelada e foi testada no programa Sorbet.

O segredo de um sorbet cremoso (em vez de gelado) é a proporção açúcar-fruta. Pouco açúcar e você obtém um bloco duro como pedra que a lâmina não consegue raspar direito; muito e fica mole e melado. Nossas receitas estão calibradas no ponto certo: cerca de 1/3 de xícara de açúcar para 2 xícaras de purê de fruta, ajustado conforme a doçura natural de cada fruta. Essa proporção dá um pote que sai macio, mantém a forma e tem gosto de fruta de verdade em vez de só açúcar.`,
        },
        {
          layout: 'cards',
          heading: 'Os três estilos de sorbet neste site',
          cards: [
            {
              title: 'Sorbets clássicos de fruta',
              body: 'Morango, framboesa, manga, limão. Fruta pura + açúcar + água, equilibrados para a cremosidade. Os sorbets mais simples e fáceis de acertar na primeira tentativa — comece aqui se é iniciante no programa Sorbet.',
            },
            {
              title: 'Sorbets gourmet com uma virada',
              body: 'Cereja-balsâmico, morango-limão-manjericão, amora-limão-gengibre. Bases clássicas de fruta com um ingrediente inesperado que eleva o sabor a algo digno de café. Mesma técnica, sabor mais interessante.',
            },
            {
              title: 'Sorbets tropicais e exóticos',
              body: 'Lichia, maracujá, abacaxi-hortelã, açaí. Feitos com purês ou saquinhos tropicais congelados, esses sorbets pulam a etapa de congelar fruta fresca e entregam sabor intenso estilo restaurante em um único giro.',
            },
          ],
        },
        {
          layout: 'two-col',
          markdown: `**Como usar essas receitas:** cada página lista a proporção exata de fruta, quantidade de açúcar e se usa fruta congelada ou fresca. Use o programa "Sorbet" para qualquer base pura de fruta; se seu pote sair gelado depois de uma passada, adicione uma colher de sopa de água e faça um Re-Spin — o sorbet responde ao líquido extra até melhor que o sorvete.

**Escolhendo a fruta:** fruta madura da estação dá o melhor sorbet, mas a fruta congelada funciona quase tão bem e está disponível o ano todo. Indicamos qual vai melhor em cada receita. Evite fruta em conserva em calda — a calda desequilibra o açúcar e deixa o pote doce demais e mole.`,
        },
      ],
      faqs: [
        {
          question: 'Qual a melhor proporção açúcar-fruta para sorbet no Ninja Creami?',
          answer: 'Cerca de 1/3 de xícara de açúcar para 2 xícaras de purê de fruta — ajustado conforme a doçura natural da fruta. Fruta muito ácida como framboesa precisa de mais açúcar; fruta muito doce como manga madura precisa de menos. Pouco açúcar e o bloco fica duro como pedra e gelado; muito e o pote fica mole.',
        },
        {
          question: 'Por que meu sorbet do Ninja Creami está gelado?',
          answer: 'Geralmente a proporção açúcar-fruta está errada (pouco açúcar) ou o pote precisa de um Re-Spin com uma colher de sopa de água adicionada por cima. O açúcar interrompe a formação de cristais de gelo, por isso sorbets com pouco açúcar congelam mais duro e saem mais gelados. Se quiser menos açúcar, substitua por alulose — tem o mesmo efeito crioprotetor sem as calorias.',
        },
        {
          question: 'Posso usar fruta congelada nas receitas de sorbet Ninja Creami?',
          answer: 'Sim — a fruta congelada funciona perfeitamente. A maioria das nossas receitas pede fruta congelada porque é mais barata, disponível o ano todo e já branqueada/estabilizada. Basta descongelar o suficiente para bater em purê liso, depois congelar o pote final por 24 horas como de costume.',
        },
        {
          question: 'O sorbet do Ninja Creami é vegano e sem lactose?',
          answer: 'Sim — sorbet clássico contém apenas fruta, água e açúcar, todos de origem vegetal. Toda receita marcada como "Sorbet" nesta página é vegana e sem lactose. Algumas variações adicionam mel como adoçante; se você é estritamente vegano, substitua por xarope de bordo ou agave para o mesmo efeito.',
        },
        {
          question: 'Qual programa uso para sorbet no Creami?',
          answer: 'Use o programa "Sorbet" em qualquer modelo de Creami. Ele foi feito para blocos congelados mais duros e densos e usa mais torque que o programa Ice Cream para raspar a base fruta-água até uma textura lisa. Usar o programa Ice Cream num sorbet deixa ele gelado ou quebradiço com frequência.',
        },
        {
          question: 'Como faço um sorbet menos doce?',
          answer: 'Não corte só o açúcar — o açúcar é um ingrediente estrutural que impede cristais de gelo. Em vez disso, troque metade do açúcar por alulose (ou um blend de monk fruit + eritritol), que dá crioproteção parecida com menos calorias e menos doçura. Você também pode adicionar um toque de suco de limão para equilibrar a doçura sem mexer na proporção de açúcar.',
        },
      ],
    },
  },
  'gelato': {
    en: {
      title: 'Gelato Recipes for Ninja Creami',
      description: 'Authentic Italian-style gelato recipes for your Ninja Creami. Denser, silkier, and more intensely flavored than regular ice cream — all tested with step-by-step instructions.',
      metaDescription: 'Authentic Italian Ninja Creami gelato recipes — denser than ice cream, silkier texture, bold flavor. Pistachio, stracciatella, lemon ricotta and more.',
      longIntroSections: [
        {
          layout: 'two-col',
          markdown: `Gelato is ice cream\'s denser, silkier Italian cousin. The Ninja Creami\'s Gelato program is specifically tuned for this texture — lower air content, more intense flavor concentration, and that characteristic elastic, almost chewy pull that separates a real gelato from a pint of ice cream. Every recipe on this page has been tested to match the texture you\'d find at a proper Italian gelateria.

The technical difference is about fat ratio and air. Classic American ice cream is roughly 14–16% fat, while gelato is 4–9% fat. That lower fat makes gelato feel denser (less air is whipped in) and allows the flavor to come forward unmasked by heavy cream. Our recipes use whole milk as the primary base with a smaller amount of heavy cream — the inverse ratio of traditional ice cream. Result: intensely flavored pints that taste almost more of the ingredient than the cream itself.`,
        },
        {
          layout: 'cards',
          heading: 'The three gelato styles on this site',
          cards: [
            {
              title: 'Classic Italian flavors',
              body: 'Pistachio, stracciatella, nocciola (hazelnut), fior di latte (sweet cream). The time-honored Italian gelato flavors, made with real ingredients like pistachio paste, chopped dark chocolate, and toasted hazelnuts. Start here if you want a proper Italian cafe experience.',
            },
            {
              title: 'Citrus and fruit gelato',
              body: 'Lemon ricotta, blood orange, amarena cherry. Italian cafes have always excelled at fruit gelato; these recipes use real fruit juice, zest, or whole preserved cherries for the authentic cafe flavor. Lighter than cream gelato but still denser than sorbet.',
            },
            {
              title: 'Dessert-inspired gelato',
              body: 'Tiramisu, bacio, amaretto. Italian dessert classics translated into gelato form — with real mascarpone, espresso, and almond extract. These are the richer, indulgent end of the gelato spectrum, closer to a liquid dessert than a light palate cleanser.',
            },
          ],
        },
        {
          layout: 'two-col',
          markdown: `**How to use these recipes:** every recipe page specifies the exact milk-to-cream ratio, sugar amount, and the Gelato program cycle. The Gelato program is slower and denser than Ice Cream — it preserves the lower-air texture you need. If your first pint comes out too dense to scoop comfortably, add a tablespoon of warm milk and Re-Spin on the Ice Cream program instead.

**Getting that real Italian flavor:** the secret is quality inclusions. Use real pistachio paste (not syrup or extract alone), actual shaved dark chocolate (70%+) for stracciatella, toasted hazelnuts for nocciola. These are the details that separate "ice cream with a nut flavoring" from "real Italian gelato" in a pint.`,
        },
      ],
      faqs: [
        {
          question: 'Can you make gelato in a Ninja Creami?',
          answer: 'Yes — the Ninja Creami makes excellent gelato. Both the Original and Deluxe have a Gelato program that spins slower and adds less air for that dense, silky texture; if your model doesn\'t have one, the Ice Cream setting works too. What matters most is the recipe, not the machine: gelato uses more milk and less cream than ice cream (typically 1 cup milk to 1/2 cup cream) plus a little extra sugar. Freeze the base for 24 hours, run the Gelato program, and Re-Spin once or twice until it\'s smooth.',
        },
        {
          question: 'How do you make gelato in the Ninja Creami?',
          answer: 'Start with a gelato-style base: about 1 cup whole milk to 1/2 cup cream, 1/3 cup sugar, and your flavoring (fruit, pistachio paste, cocoa). Warm it gently to dissolve the sugar for the silkiest result, then chill and freeze it in the Creami pint for a full 24 hours. Run the Gelato program (or Ice Cream if your model lacks it), then Re-Spin — the first pass often looks crumbly, which is normal. Add a tablespoon of warm milk before the final Re-Spin if it needs loosening. The lower fat and reduced air are what make it gelato rather than ice cream.',
        },
        {
          question: 'What\'s the difference between gelato and ice cream in the Ninja Creami?',
          answer: 'Gelato is lower in fat (4–9% vs 14–16% for ice cream) and incorporates less air during processing, giving it a denser, silkier texture and more intense flavor. The Ninja Creami\'s Gelato program is tuned for this — slower blade action, less aeration. Gelato recipes also use a different ratio: more milk, less cream.',
        },
        {
          question: 'Can I make gelato on the Ninja Creami Original (not Deluxe)?',
          answer: 'Yes — both Original and Deluxe have the Gelato program. The Deluxe XL handles larger 24oz pints but the texture is identical. If your Creami model doesn\'t have a Gelato program, use Ice Cream with a 24-hour freeze — the texture won\'t be quite as silky but it will still be dense and flavorful.',
        },
        {
          question: 'Why is my Ninja Creami gelato too icy?',
          answer: 'Gelato with not enough fat or sugar will come out icy. Make sure your milk-to-cream ratio is correct (typically 1 cup milk + 1/2 cup cream) and you\'re using real sugar (not mostly sugar substitutes — sugar prevents ice crystals). If the recipe is correct and it\'s still icy, add 1 tablespoon warm milk and Re-Spin.',
        },
        {
          question: 'What\'s the best pistachio paste for Ninja Creami gelato?',
          answer: 'Look for "100% pistachio paste" or "pure pistachio cream" — no added sugar, oil, or milk powder. Fiasconaro and Babbi are the gold-standard Italian brands. Avoid "pistachio butter" or "pistachio spread" which usually contain sugar and other ingredients that throw off the gelato balance.',
        },
        {
          question: 'Which program do I use for gelato?',
          answer: 'The "Gelato" program. It uses slower blade speed than Ice Cream for less aeration, producing the denser, silkier texture gelato is known for. If your Creami model doesn\'t have Gelato, use Ice Cream — the texture will be slightly airier but still good.',
        },
        {
          question: 'How long does homemade gelato keep in the freezer?',
          answer: 'Up to 1 week in the original Creami pint, sealed with the lid. After that it\'s safe to eat but the texture starts crystallizing. For longer storage (up to a month), cover the surface of the gelato with plastic wrap before putting the lid on — this blocks air contact and prevents freezer burn.',
        },
      ],
    },
    fr: {
      title: 'Recettes de Gelato pour Ninja Creami',
      description: 'Recettes de gelato authentiques à l\'italienne pour votre Ninja Creami. Plus dense, plus soyeux et plus intensément parfumé que la crème glacée — avec des instructions étape par étape.',
      metaDescription: 'Recettes authentiques de gelato Ninja Creami — plus dense que la glace, texture soyeuse, saveur intense. Pistache, stracciatella, ricotta-citron et plus.',
      longIntroSections: [
        {
          layout: 'two-col',
          markdown: `Le gelato est le cousin italien plus dense et plus soyeux de la crème glacée. Le programme Gelato du Ninja Creami est spécifiquement calibré pour cette texture — moins d\'air, plus de concentration aromatique et cette élasticité caractéristique, presque mâchable, qui distingue un vrai gelato d\'un pot de crème glacée. Chaque recette de cette page a été testée pour obtenir la texture d\'une vraie gelateria italienne.

La différence technique tient au ratio de matières grasses et d\'air. La crème glacée américaine classique contient environ 14 à 16% de matières grasses, alors que le gelato est à 4–9%. Cette teneur plus faible rend le gelato plus dense (moins d\'air incorporé) et laisse les saveurs s\'exprimer sans être masquées par la crème. Nos recettes utilisent du lait entier comme base principale avec une quantité plus modeste de crème — l\'inverse du ratio de la crème glacée traditionnelle. Résultat : des pots intensément parfumés qui goûtent presque plus l\'ingrédient que la crème elle-même.`,
        },
        {
          layout: 'cards',
          heading: 'Les trois styles de gelato sur ce site',
          cards: [
            {
              title: 'Saveurs italiennes classiques',
              body: 'Pistache, stracciatella, nocciola (noisette), fior di latte (crème douce). Les saveurs italiennes consacrées, faites avec de vrais ingrédients comme la pâte de pistache, le chocolat noir haché et les noisettes grillées. Commencez ici si vous voulez une vraie expérience de café italien.',
            },
            {
              title: 'Gelato aux agrumes et fruits',
              body: 'Citron-ricotta, orange sanguine, cerise amarena. Les cafés italiens ont toujours excellé dans le gelato aux fruits ; ces recettes utilisent du jus, du zeste ou des cerises confites entières pour la saveur authentique. Plus léger que le gelato crémeux mais toujours plus dense qu\'un sorbet.',
            },
            {
              title: 'Gelato inspirés des desserts',
              body: 'Tiramisu, bacio, amaretto. Des classiques de la pâtisserie italienne transposés en gelato — avec du vrai mascarpone, de l\'espresso et de l\'extrait d\'amande. L\'extrémité plus riche et indulgente du spectre gelato, plus proche d\'un dessert liquide que d\'un rafraîchissement de palais.',
            },
          ],
        },
        {
          layout: 'two-col',
          markdown: `**Comment utiliser ces recettes :** chaque page de recette indique le ratio exact lait-crème, la quantité de sucre et le cycle du programme Gelato. Le programme Gelato est plus lent et plus dense que Ice Cream — il préserve la texture moins aérée dont vous avez besoin. Si votre premier pot sort trop dense pour être servi confortablement, ajoutez une cuillère à soupe de lait tiède et faites un Re-Spin sur le programme Ice Cream à la place.

**Obtenir cette vraie saveur italienne :** le secret, c\'est la qualité des ajouts. Utilisez de la vraie pâte de pistache (pas du sirop ni de l\'extrait seul), du chocolat noir véritable haché (70%+) pour la stracciatella, des noisettes grillées pour la nocciola. Ce sont les détails qui séparent "glace avec arôme noisette" d\'un "vrai gelato italien" dans un pot.`,
        },
      ],
      faqs: [
        {
          question: 'Peut-on faire du gelato dans un Ninja Creami ?',
          answer: 'Oui — le Ninja Creami fait un excellent gelato. L\'Original comme le Deluxe ont un programme Gelato qui tourne plus lentement et incorpore moins d\'air pour cette texture dense et soyeuse ; si votre modèle n\'en a pas, le programme Ice Cream fonctionne aussi. Ce qui compte le plus, c\'est la recette, pas la machine : le gelato utilise plus de lait et moins de crème que la crème glacée (typiquement 1 tasse de lait pour 1/2 tasse de crème) plus un peu de sucre en plus. Congelez la base pendant 24 heures, lancez le programme Gelato, et faites un ou deux Re-Spin jusqu\'à obtenir une texture lisse.',
        },
        {
          question: 'Comment faire du gelato dans le Ninja Creami ?',
          answer: 'Commencez par une base type gelato : environ 1 tasse de lait entier pour 1/2 tasse de crème, 1/3 de tasse de sucre, et votre parfum (fruits, pâte de pistache, cacao). Chauffez-la doucement pour dissoudre le sucre — c\'est ce qui donne la texture la plus soyeuse — puis refroidissez et congelez dans le pot Creami pendant 24 heures complètes. Lancez le programme Gelato (ou Ice Cream si votre modèle n\'en a pas), puis faites un Re-Spin — le premier passage a souvent l\'air friable, c\'est normal. Ajoutez une cuillère à soupe de lait tiède avant le dernier Re-Spin s\'il faut l\'assouplir. C\'est la teneur plus faible en matières grasses et le moindre air qui en font un gelato plutôt qu\'une crème glacée.',
        },
        {
          question: 'Quelle est la différence entre gelato et crème glacée dans le Ninja Creami ?',
          answer: 'Le gelato est plus pauvre en matières grasses (4–9% contre 14–16% pour la crème glacée) et incorpore moins d\'air pendant le traitement, ce qui lui donne une texture plus dense et soyeuse et une saveur plus intense. Le programme Gelato du Ninja Creami est calibré pour cela — action de lame plus lente, moins d\'aération. Les recettes de gelato utilisent aussi un ratio différent : plus de lait, moins de crème.',
        },
        {
          question: 'Puis-je faire du gelato sur le Ninja Creami Original (pas Deluxe) ?',
          answer: 'Oui — Original et Deluxe ont tous deux le programme Gelato. Le Deluxe XL gère des pots plus grands de 24oz mais la texture est identique. Si votre modèle n\'a pas de programme Gelato, utilisez Ice Cream avec une congélation de 24 heures — la texture ne sera pas aussi soyeuse mais restera dense et parfumée.',
        },
        {
          question: 'Pourquoi mon gelato Ninja Creami est-il trop glacé ?',
          answer: 'Un gelato avec pas assez de matières grasses ou de sucre sortira glacé. Vérifiez que votre ratio lait-crème est correct (typiquement 1 tasse de lait + 1/2 tasse de crème) et que vous utilisez du vrai sucre (pas principalement des substituts — le sucre empêche les cristaux de glace). Si la recette est correcte et que c\'est encore glacé, ajoutez 1 cuillère à soupe de lait tiède et faites un Re-Spin.',
        },
        {
          question: 'Quelle est la meilleure pâte de pistache pour le gelato Ninja Creami ?',
          answer: 'Cherchez "pâte de pistache 100%" ou "crème de pistache pure" — sans sucre, huile ou lait en poudre ajouté. Fiasconaro et Babbi sont les marques italiennes de référence. Évitez le "beurre de pistache" ou la "pâte à tartiner pistache" qui contiennent généralement du sucre et d\'autres ingrédients qui déséquilibrent le gelato.',
        },
        {
          question: 'Quel programme utiliser pour le gelato ?',
          answer: 'Le programme "Gelato". Il utilise une vitesse de lame plus lente qu\'Ice Cream pour moins d\'aération, produisant la texture plus dense et soyeuse qui caractérise le gelato. Si votre modèle Creami n\'a pas Gelato, utilisez Ice Cream — la texture sera légèrement plus aérée mais toujours bonne.',
        },
        {
          question: 'Combien de temps se conserve un gelato maison au congélateur ?',
          answer: 'Jusqu\'à 1 semaine dans le pot Creami d\'origine, fermé avec le couvercle. Au-delà, c\'est sûr à manger mais la texture commence à cristalliser. Pour une conservation plus longue (jusqu\'à un mois), couvrez la surface du gelato avec du film alimentaire avant de mettre le couvercle — cela bloque le contact avec l\'air et évite les brûlures de congélation.',
        },
      ],
    },
    es: {
      title: 'Recetas de Gelato para Ninja Creami',
      description: 'Recetas auténticas de gelato estilo italiano para tu Ninja Creami. Más denso, más sedoso y con sabores más intensos que el helado común — con instrucciones paso a paso.',
      metaDescription: 'Recetas auténticas de gelato Ninja Creami — más denso que el helado, textura sedosa, sabor intenso. Pistacho, stracciatella, limón-ricotta y más.',
      longIntroSections: [
        {
          layout: 'two-col',
          markdown: `El gelato es el primo italiano más denso y sedoso del helado. El programa Gelato del Ninja Creami está ajustado específicamente para esa textura — menos aire, mayor concentración de sabor y ese tirón elástico, casi masticable, que distingue un gelato de verdad de un pote de helado común. Cada receta de esta página se ha probado para conseguir la textura que encontrarías en una gelatería italiana auténtica.

La diferencia técnica está en la grasa y el aire. El helado americano clásico tiene entre 14 y 16% de grasa; el gelato se queda en 4–9%. Esa grasa menor hace que el gelato se sienta más denso (se incorpora menos aire) y permite que el sabor salga al frente sin quedar enmascarado por la nata. Nuestras recetas usan leche entera como base principal con una cantidad menor de nata — la proporción inversa al helado tradicional. Resultado: potes intensamente sabrosos que saben casi más al ingrediente que a la crema misma.`,
        },
        {
          layout: 'cards',
          heading: 'Los tres estilos de gelato en este sitio',
          cards: [
            {
              title: 'Sabores italianos clásicos',
              body: 'Pistacho, stracciatella, nocciola (avellana), fior di latte (nata dulce). Los sabores italianos consagrados, hechos con ingredientes reales como pasta de pistacho, chocolate negro troceado y avellanas tostadas. Empieza aquí si quieres la experiencia de una cafetería italiana de verdad.',
            },
            {
              title: 'Gelato cítrico y frutal',
              body: 'Limón-ricotta, naranja sanguina, cereza amarena. Los cafés italianos siempre han destacado con el gelato de fruta; estas recetas usan jugo real, ralladura o cerezas enteras en conserva para ese sabor auténtico. Más ligero que el gelato de nata pero aún más denso que un sorbete.',
            },
            {
              title: 'Gelato inspirado en postres',
              body: 'Tiramisú, bacio, amaretto. Clásicos de la pastelería italiana trasladados a formato gelato — con mascarpone real, espresso y extracto de almendra. El extremo más rico e indulgente del espectro gelato, más cerca de un postre líquido que de un refrescante entre platos.',
            },
          ],
        },
        {
          layout: 'two-col',
          markdown: `**Cómo usar estas recetas:** cada página indica la proporción exacta leche-nata, la cantidad de azúcar y el ciclo del programa Gelato. El programa Gelato es más lento y más denso que Ice Cream — preserva la textura menos aireada que necesitas. Si tu primer pote sale demasiado denso como para servir cómodamente, añade una cucharada de leche tibia y haz un Re-Spin en el programa Ice Cream.

**Conseguir ese sabor italiano auténtico:** el secreto son los añadidos de calidad. Usa pasta de pistacho real (no sirope ni extracto solo), chocolate negro de verdad troceado (70%+) para la stracciatella, avellanas tostadas para la nocciola. Esos detalles son los que separan "helado con sabor a fruto seco" de "gelato italiano auténtico" en un pote.`,
        },
      ],
      faqs: [
        {
          question: '¿Se puede hacer gelato en un Ninja Creami?',
          answer: 'Sí — el Ninja Creami hace un gelato excelente. Tanto el Original como el Deluxe tienen un programa Gelato que gira más lento e incorpora menos aire para esa textura densa y sedosa; si tu modelo no lo tiene, el programa Ice Cream también sirve. Lo que más importa es la receta, no la máquina: el gelato usa más leche y menos nata que el helado (típicamente 1 taza de leche por 1/2 taza de nata) más un poco de azúcar extra. Congela la base 24 horas, ejecuta el programa Gelato y haz uno o dos Re-Spin hasta que quede suave.',
        },
        {
          question: '¿Cómo se hace gelato en el Ninja Creami?',
          answer: 'Empieza con una base estilo gelato: alrededor de 1 taza de leche entera por 1/2 taza de nata, 1/3 de taza de azúcar y tu saborizante (fruta, pasta de pistacho, cacao). Caliéntala suavemente para disolver el azúcar — eso da la textura más sedosa — luego enfría y congela en el pote Creami durante 24 horas completas. Ejecuta el programa Gelato (o Ice Cream si tu modelo no lo tiene), luego haz un Re-Spin — la primera pasada suele verse desmenuzada, es normal. Añade una cucharada de leche tibia antes del último Re-Spin si necesita soltarse. La menor grasa y el menor aire son lo que lo hacen gelato y no helado.',
        },
        {
          question: '¿Cuál es la diferencia entre gelato y helado en el Ninja Creami?',
          answer: 'El gelato tiene menos grasa (4–9% vs 14–16% del helado) e incorpora menos aire durante el procesado, lo que le da una textura más densa y sedosa y un sabor más intenso. El programa Gelato del Ninja Creami está ajustado a eso — acción de cuchilla más lenta, menos aireación. Las recetas de gelato también usan otra proporción: más leche, menos nata.',
        },
        {
          question: '¿Puedo hacer gelato en el Ninja Creami Original (no Deluxe)?',
          answer: 'Sí — tanto el Original como el Deluxe tienen programa Gelato. El Deluxe XL maneja potes más grandes de 24oz pero la textura es idéntica. Si tu modelo de Creami no tiene programa Gelato, usa Ice Cream con 24 horas de congelado — la textura no será tan sedosa pero seguirá siendo densa y sabrosa.',
        },
        {
          question: '¿Por qué mi gelato Ninja Creami queda muy helado?',
          answer: 'Un gelato con poca grasa o azúcar saldrá helado. Asegúrate de que tu proporción leche-nata es correcta (típicamente 1 taza de leche + 1/2 taza de nata) y que usas azúcar de verdad (no mayoritariamente sustitutos — el azúcar impide los cristales de hielo). Si la receta es correcta y aún sale helado, añade 1 cucharada de leche tibia y haz un Re-Spin.',
        },
        {
          question: '¿Cuál es la mejor pasta de pistacho para el gelato Ninja Creami?',
          answer: 'Busca "pasta de pistacho 100%" o "crema de pistacho pura" — sin azúcar, aceite ni leche en polvo añadidos. Fiasconaro y Babbi son las marcas italianas de referencia. Evita "mantequilla de pistacho" o "crema para untar de pistacho" que suelen contener azúcar y otros ingredientes que desequilibran el gelato.',
        },
        {
          question: '¿Qué programa uso para el gelato?',
          answer: 'El programa "Gelato". Usa una velocidad de cuchilla más lenta que Ice Cream para menos aireación, produciendo la textura más densa y sedosa característica del gelato. Si tu modelo de Creami no tiene Gelato, usa Ice Cream — la textura será algo más aireada pero buena.',
        },
        {
          question: '¿Cuánto dura el gelato casero en el congelador?',
          answer: 'Hasta 1 semana en el pote Creami original, cerrado con la tapa. Pasado ese tiempo sigue siendo seguro pero la textura empieza a cristalizar. Para una conservación más larga (hasta un mes), cubre la superficie del gelato con film transparente antes de poner la tapa — eso bloquea el contacto con el aire y evita las quemaduras por congelación.',
        },
      ],
    },
    de: {
      title: 'Gelato-Rezepte für Ninja Creami',
      description: 'Authentische italienische Gelato-Rezepte für deinen Ninja Creami. Dichter, seidiger und geschmacksintensiver als normales Eis — mit Schritt-für-Schritt-Anleitung getestet.',
      metaDescription: 'Authentische italienische Ninja Creami Gelato-Rezepte — dichter als Eis, seidige Textur, intensiver Geschmack. Pistazie, Stracciatella, Zitrone-Ricotta u.v.m.',
      longIntroSections: [
        {
          layout: 'two-col',
          markdown: `Gelato ist der dichtere, seidigere italienische Cousin von Eiscreme. Das Gelato-Programm des Ninja Creami ist genau auf diese Textur abgestimmt — weniger Luftanteil, konzentrierterer Geschmack und dieser charakteristische elastische, fast kaubare Zug, der echtes Gelato von einem normalen Pint unterscheidet. Jedes Rezept auf dieser Seite wurde getestet, um der Textur einer echten italienischen Gelateria zu entsprechen.

Der technische Unterschied liegt im Fettanteil und der Luft. Klassische amerikanische Eiscreme hat etwa 14–16% Fett, Gelato dagegen 4–9%. Dieser geringere Fettanteil macht Gelato dichter (weniger Luft wird eingerührt) und lässt den Geschmack unverdeckt nach vorne kommen. Unsere Rezepte nutzen Vollmilch als Hauptbasis mit einer kleineren Menge Sahne — das umgekehrte Verhältnis zu traditioneller Eiscreme. Das Ergebnis: intensiv aromatische Pints, die fast mehr nach der Zutat selbst schmecken als nach Sahne.`,
        },
        {
          layout: 'cards',
          heading: 'Die drei Gelato-Stile auf dieser Seite',
          cards: [
            {
              title: 'Klassische italienische Sorten',
              body: 'Pistazie, Stracciatella, Nocciola (Haselnuss), Fior di Latte (süße Sahne). Die traditionsreichen italienischen Gelato-Sorten, gemacht mit echten Zutaten wie Pistazienpaste, gehackter dunkler Schokolade und gerösteten Haselnüssen. Starte hier, wenn du ein echtes italienisches Café-Erlebnis willst.',
            },
            {
              title: 'Zitrus- und Frucht-Gelato',
              body: 'Zitrone-Ricotta, Blutorange, Amarena-Kirsche. Italienische Cafés waren schon immer stark bei Frucht-Gelato; diese Rezepte nutzen echten Saft, Abrieb oder eingelegte Amarena-Kirschen für den authentischen Café-Geschmack. Leichter als Sahne-Gelato, aber dichter als Sorbet.',
            },
            {
              title: 'Dessert-inspiriertes Gelato',
              body: 'Tiramisu, Bacio, Amaretto. Italienische Dessertklassiker ins Gelato-Format übersetzt — mit echtem Mascarpone, Espresso und Mandelextrakt. Das reichhaltigere, opulentere Ende des Gelato-Spektrums, näher an flüssigem Dessert als an leichter Erfrischung.',
            },
          ],
        },
        {
          layout: 'two-col',
          markdown: `**So nutzt du diese Rezepte:** Jede Rezeptseite nennt das genaue Milch-Sahne-Verhältnis, die Zuckermenge und den Gelato-Programmzyklus. Das Gelato-Programm ist langsamer und dichter als Ice Cream — es bewahrt die weniger luftige Textur, die du brauchst. Kommt dein erstes Pint zu dicht heraus zum komfortablen Löffeln, gib einen Esslöffel warme Milch dazu und mach einen Re-Spin im Ice-Cream-Programm.

**Echten italienischen Geschmack erreichen:** Das Geheimnis sind hochwertige Zutaten. Verwende echte Pistazienpaste (nicht nur Sirup oder Extrakt), echte gehackte dunkle Schokolade (70%+) für Stracciatella, geröstete Haselnüsse für Nocciola. Das sind die Details, die "Eiscreme mit Nussaroma" von "echtem italienischen Gelato" im Pint unterscheiden.`,
        },
      ],
      faqs: [
        {
          question: 'Kann man im Ninja Creami Gelato machen?',
          answer: 'Ja — der Ninja Creami macht hervorragendes Gelato. Sowohl das Original als auch das Deluxe haben ein Gelato-Programm, das langsamer dreht und weniger Luft einarbeitet, für diese dichte, seidige Textur; hat dein Modell keines, funktioniert auch das Ice-Cream-Programm. Am wichtigsten ist das Rezept, nicht die Maschine: Gelato nutzt mehr Milch und weniger Sahne als Eiscreme (typisch 1 Tasse Milch auf 1/2 Tasse Sahne) plus etwas mehr Zucker. Friere die Basis 24 Stunden ein, starte das Gelato-Programm und mach ein bis zwei Re-Spins, bis es glatt ist.',
        },
        {
          question: 'Wie macht man Gelato im Ninja Creami?',
          answer: 'Beginne mit einer Gelato-Basis: etwa 1 Tasse Vollmilch auf 1/2 Tasse Sahne, 1/3 Tasse Zucker und dein Aroma (Früchte, Pistazienpaste, Kakao). Erwärme sie sanft, um den Zucker aufzulösen — das gibt die seidigste Textur — dann kühle sie ab und friere sie im Creami-Pint volle 24 Stunden ein. Starte das Gelato-Programm (oder Ice Cream, falls dein Modell keines hat), dann mach einen Re-Spin — der erste Durchgang sieht oft krümelig aus, das ist normal. Gib vor dem letzten Re-Spin einen Esslöffel warme Milch dazu, falls es aufgelockert werden muss. Der geringere Fettanteil und die geringere Luft machen es zu Gelato statt Eiscreme.',
        },
        {
          question: 'Was ist der Unterschied zwischen Gelato und Eiscreme im Ninja Creami?',
          answer: 'Gelato hat weniger Fett (4–9% vs 14–16% bei Eiscreme) und nimmt beim Verarbeiten weniger Luft auf, was zu dichterer, seidigerer Textur und intensiverem Geschmack führt. Das Gelato-Programm des Ninja Creami ist darauf ausgelegt — langsamere Klingenaktion, weniger Belüftung. Gelato-Rezepte nutzen zudem ein anderes Verhältnis: mehr Milch, weniger Sahne.',
        },
        {
          question: 'Kann ich Gelato auf dem Ninja Creami Original (nicht Deluxe) machen?',
          answer: 'Ja — sowohl Original als auch Deluxe haben das Gelato-Programm. Der Deluxe XL verarbeitet größere 24oz-Pints, aber die Textur ist identisch. Wenn dein Creami-Modell kein Gelato-Programm hat, nutze Ice Cream mit 24 Stunden Gefrierzeit — die Textur wird nicht ganz so seidig, aber trotzdem dicht und aromatisch.',
        },
        {
          question: 'Warum ist mein Ninja Creami Gelato zu eisig?',
          answer: 'Gelato mit zu wenig Fett oder Zucker wird eisig. Stelle sicher, dass dein Milch-Sahne-Verhältnis stimmt (typisch 1 Tasse Milch + 1/2 Tasse Sahne) und dass du echten Zucker verwendest (nicht überwiegend Ersatzstoffe — Zucker verhindert Eiskristalle). Wenn das Rezept stimmt und es trotzdem eisig ist, gib 1 Esslöffel warme Milch dazu und mach einen Re-Spin.',
        },
        {
          question: 'Welche Pistazienpaste ist die beste für Ninja Creami Gelato?',
          answer: 'Suche nach "100% Pistazienpaste" oder "pure Pistaziencreme" — ohne zugesetzten Zucker, Öl oder Milchpulver. Fiasconaro und Babbi sind die italienischen Gold-Standard-Marken. Meide "Pistaziencreme" oder "Pistazien-Brotaufstrich", die meist Zucker und andere Zutaten enthalten, die das Gelato-Gleichgewicht stören.',
        },
        {
          question: 'Welches Programm nutze ich für Gelato?',
          answer: 'Das Programm "Gelato". Es nutzt eine langsamere Klingenaktion als Ice Cream für weniger Belüftung und erzeugt die dichtere, seidigere Textur, die Gelato auszeichnet. Wenn dein Creami-Modell kein Gelato-Programm hat, nutze Ice Cream — die Textur wird leicht luftiger, aber trotzdem gut.',
        },
        {
          question: 'Wie lange hält selbstgemachtes Gelato im Gefrierschrank?',
          answer: 'Bis zu 1 Woche im originalen Creami-Pint, mit Deckel verschlossen. Danach ist es noch sicher zu essen, aber die Textur kristallisiert. Für längere Lagerung (bis zu einem Monat) decke die Oberfläche des Gelato mit Frischhaltefolie ab, bevor du den Deckel aufsetzt — das blockiert den Luftkontakt und verhindert Gefrierbrand.',
        },
      ],
    },
    pt: {
      title: 'Receitas de Gelato para Ninja Creami',
      description: 'Receitas autênticas de gelato estilo italiano para seu Ninja Creami. Mais denso, mais sedoso e com sabores mais intensos que sorvete comum — com instruções passo a passo.',
      metaDescription: 'Receitas autênticas de gelato Ninja Creami — mais denso que sorvete, textura sedosa, sabor intenso. Pistache, stracciatella, limão-ricota e mais.',
      longIntroSections: [
        {
          layout: 'two-col',
          markdown: `O gelato é o primo italiano mais denso e sedoso do sorvete. O programa Gelato do Ninja Creami é especificamente ajustado para essa textura — menos ar, maior concentração de sabor e aquele puxão elástico, quase mastigável, que distingue um gelato de verdade de um pote de sorvete comum. Cada receita desta página foi testada para corresponder à textura que você encontraria numa gelateria italiana de verdade.

A diferença técnica está na gordura e no ar. Sorvete americano clássico tem cerca de 14–16% de gordura; gelato fica em 4–9%. Essa gordura menor faz o gelato parecer mais denso (menos ar é incorporado) e permite que o sabor apareça sem ser mascarado pelo creme. Nossas receitas usam leite integral como base principal com uma quantidade menor de creme de leite — a proporção inversa do sorvete tradicional. Resultado: potes intensamente saborosos que têm gosto quase mais do ingrediente do que do próprio creme.`,
        },
        {
          layout: 'cards',
          heading: 'Os três estilos de gelato neste site',
          cards: [
            {
              title: 'Sabores italianos clássicos',
              body: 'Pistache, stracciatella, nocciola (avelã), fior di latte (creme doce). Os sabores italianos consagrados, feitos com ingredientes de verdade como pasta de pistache, chocolate meio amargo picado e avelãs torradas. Comece aqui se quer a experiência de um café italiano de verdade.',
            },
            {
              title: 'Gelato cítrico e de frutas',
              body: 'Limão-ricota, laranja-sanguínea, cereja amarena. Os cafés italianos sempre foram excelentes em gelato de fruta; essas receitas usam suco de verdade, raspas ou cerejas inteiras em calda para aquele sabor autêntico. Mais leve que gelato de creme, mas ainda mais denso que um sorbet.',
            },
            {
              title: 'Gelato inspirado em sobremesas',
              body: 'Tiramisù, bacio, amaretto. Clássicos da confeitaria italiana traduzidos em formato gelato — com mascarpone de verdade, espresso e extrato de amêndoa. A ponta mais rica e indulgente do espectro gelato, mais próxima de uma sobremesa líquida do que de um refrescante.',
            },
          ],
        },
        {
          layout: 'two-col',
          markdown: `**Como usar essas receitas:** cada página especifica a proporção exata leite-creme, a quantidade de açúcar e o ciclo do programa Gelato. O programa Gelato é mais lento e mais denso que Ice Cream — preserva a textura menos aerada que você precisa. Se seu primeiro pote sair denso demais para servir confortavelmente, adicione uma colher de sopa de leite morno e faça um Re-Spin no programa Ice Cream.

**Conseguir aquele sabor italiano de verdade:** o segredo é a qualidade das adições. Use pasta de pistache de verdade (não xarope nem extrato sozinhos), chocolate meio amargo real picado (70%+) para stracciatella, avelãs torradas para nocciola. Esses detalhes separam "sorvete com sabor de castanha" de "gelato italiano de verdade" num pote.`,
        },
      ],
      faqs: [
        {
          question: 'Dá para fazer gelato no Ninja Creami?',
          answer: 'Sim — o Ninja Creami faz um gelato excelente. Tanto o Original quanto o Deluxe têm um programa Gelato que gira mais devagar e incorpora menos ar para aquela textura densa e sedosa; se seu modelo não tiver, o programa Ice Cream também funciona. O que mais importa é a receita, não a máquina: o gelato usa mais leite e menos creme que o sorvete (tipicamente 1 xícara de leite para 1/2 xícara de creme de leite) mais um pouco de açúcar extra. Congele a base por 24 horas, rode o programa Gelato e faça um ou dois Re-Spin até ficar liso.',
        },
        {
          question: 'Como fazer gelato no Ninja Creami?',
          answer: 'Comece com uma base estilo gelato: cerca de 1 xícara de leite integral para 1/2 xícara de creme de leite, 1/3 de xícara de açúcar e seu sabor (fruta, pasta de pistache, cacau). Aqueça suavemente para dissolver o açúcar — é o que dá a textura mais sedosa — depois resfrie e congele no pote Creami por 24 horas completas. Rode o programa Gelato (ou Ice Cream se seu modelo não tiver), depois faça um Re-Spin — a primeira passada costuma parecer esfarelada, o que é normal. Adicione uma colher de sopa de leite morno antes do último Re-Spin se precisar soltar. A menor gordura e o menor ar são o que fazem dele gelato em vez de sorvete.',
        },
        {
          question: 'Qual a diferença entre gelato e sorvete no Ninja Creami?',
          answer: 'O gelato tem menos gordura (4–9% vs 14–16% do sorvete) e incorpora menos ar durante o processamento, o que dá uma textura mais densa e sedosa e sabor mais intenso. O programa Gelato do Ninja Creami é ajustado para isso — ação de lâmina mais lenta, menos aeração. Receitas de gelato também usam outra proporção: mais leite, menos creme.',
        },
        {
          question: 'Posso fazer gelato no Ninja Creami Original (não Deluxe)?',
          answer: 'Sim — tanto o Original quanto o Deluxe têm programa Gelato. O Deluxe XL trabalha com potes maiores de 24oz mas a textura é idêntica. Se seu modelo de Creami não tem programa Gelato, use Ice Cream com 24 horas de congelamento — a textura não ficará tão sedosa mas ainda será densa e saborosa.',
        },
        {
          question: 'Por que meu gelato do Ninja Creami está muito gelado?',
          answer: 'Gelato com pouca gordura ou açúcar fica gelado. Garanta que sua proporção leite-creme está correta (tipicamente 1 xícara de leite + 1/2 xícara de creme de leite) e que está usando açúcar de verdade (não majoritariamente substitutos — o açúcar impede cristais de gelo). Se a receita está correta e ainda está gelado, adicione 1 colher de sopa de leite morno e faça um Re-Spin.',
        },
        {
          question: 'Qual a melhor pasta de pistache para gelato no Ninja Creami?',
          answer: 'Procure por "pasta de pistache 100%" ou "creme de pistache puro" — sem açúcar, óleo ou leite em pó adicionados. Fiasconaro e Babbi são as marcas italianas de referência. Evite "manteiga de pistache" ou "pasta de pistache para passar" que geralmente contêm açúcar e outros ingredientes que desequilibram o gelato.',
        },
        {
          question: 'Qual programa uso para gelato?',
          answer: 'O programa "Gelato". Ele usa velocidade de lâmina mais lenta que Ice Cream para menos aeração, produzindo a textura mais densa e sedosa pela qual o gelato é conhecido. Se seu modelo de Creami não tem Gelato, use Ice Cream — a textura ficará um pouco mais aerada mas ainda boa.',
        },
        {
          question: 'Quanto tempo dura o gelato caseiro no freezer?',
          answer: 'Até 1 semana no pote Creami original, fechado com a tampa. Depois disso ainda é seguro comer mas a textura começa a cristalizar. Para armazenamento mais longo (até um mês), cubra a superfície do gelato com filme plástico antes de colocar a tampa — isso bloqueia o contato com o ar e evita queimadura por congelamento.',
        },
      ],
    },
  },
  'milkshake': {
    en: {
      title: 'Milkshake Recipes for Ninja Creami',
      description: 'Thick and creamy milkshake recipes made with your Ninja Creami. Classic flavors, indulgent mix-ins, and perfectly blended frozen drinks — all with step-by-step instructions.',
      metaDescription: 'Ninja Creami milkshake recipes — thicker, creamier, and quicker than a blender. Classic chocolate, strawberry, banana caramel plus creative mix-ins.',
      longIntroSections: [
        {
          layout: 'two-col',
          markdown: `The Ninja Creami makes milkshakes that put a blender to shame. Because the Creami starts with a properly frozen pint — not ice cubes that water down your shake — you get thick, spoon-standing-up consistency with none of the watery dilution a blender introduces. Every recipe on this page has been calibrated to the Milkshake program, so you get diner-style pours without the trial and error.

The technique is different from a traditional milkshake. Instead of blending ice cream with milk (which thins it), you freeze a milkshake-specific base as a pint — cream, milk, sugar, flavoring — and let the Milkshake program bring it to that perfect drinkable-but-thick consistency. Think Steak \'n Shake level of thickness, not McDonald\'s thin. For extra-thick, use the Ice Cream program first and stop at the drinkable stage.`,
        },
        {
          layout: 'cards',
          heading: 'The three milkshake styles on this site',
          cards: [
            {
              title: 'Classic diner shakes',
              body: 'Chocolate, strawberry, vanilla, cookies and cream. The nostalgic shake flavors that made the format famous. Thick, frothy, and tall — exactly what you\'d order at a 1950s-style diner. Start here if you\'re new to the Milkshake program.',
            },
            {
              title: 'Dessert-shakes',
              body: 'Banana caramel, Birthday Cake, Nutella. Shakes that are basically dessert in liquid form, topped with whipped cream and fun garnishes. Richer than classic shakes and better suited as an after-dinner treat than a drink.',
            },
            {
              title: 'Fruit and tropical shakes',
              body: 'Strawberry, peach, mango, pineapple. Lighter, fruit-forward shakes that use real fruit puree alongside the cream base. Less dessert-heavy, more summery and refreshing.',
            },
          ],
        },
        {
          layout: 'two-col',
          markdown: `**How to use these recipes:** each recipe specifies the base ratio, the exact Milkshake program cycle, and any mix-ins to add during the Mix-In stage. The Milkshake program is the only one designed for drinkable (not scoopable) texture — use it instead of Ice Cream followed by extra milk, which produces a more liquid result.

**Choosing your cup:** milkshakes in a Creami pour best into tall, chilled glasses. Put your serving glass in the freezer for 10 minutes before pouring — a cold glass keeps the shake thick longer and delivers that classic "stays thick to the bottom" diner experience.`,
        },
      ],
      faqs: [
        {
          question: 'What\'s the difference between a Ninja Creami milkshake and ice cream?',
          answer: 'A milkshake in the Creami is specifically drinkable — the Milkshake program processes the frozen pint to a thick-but-pourable consistency (like a thick diner shake). Ice cream is processed to scoopable texture. You use the same type of base but a different program cycle.',
        },
        {
          question: 'Which program do I use for milkshakes?',
          answer: 'Use the "Milkshake" program on the Creami Deluxe — it\'s tuned to leave the pint pourable rather than scoopable. On the Original Creami (no Milkshake program), use Ice Cream and add 2–3 tablespoons of milk at the end, then Re-Spin — the result is nearly identical.',
        },
        {
          question: 'Can I make a milkshake from an already-spun pint of ice cream?',
          answer: 'Yes — add 2–3 tablespoons of milk on top of a spun pint, then run the Milkshake program (or Re-Spin if you don\'t have Milkshake). This is the easiest way to turn leftover ice cream into a shake without making a new pint.',
        },
        {
          question: 'Why is my Ninja Creami milkshake too thick to drink through a straw?',
          answer: 'The pint is over-frozen or the base is too low in liquid. Add 1–2 tablespoons of milk and run the Milkshake or Re-Spin program again. Every additional tablespoon thins the shake — add gradually until it flows through a thick straw but still coats the sides of the glass.',
        },
        {
          question: 'Can I make a protein milkshake in the Creami?',
          answer: 'Yes — use a protein ice cream base (protein powder + milk + sweetener) and run the Milkshake program at the end. You\'ll get 25–30g of protein per serving in a shake that actually tastes like dessert, not a chalky protein drink.',
        },
        {
          question: 'How do I make a thick milkshake without added sugar?',
          answer: 'Use allulose instead of sugar — it has the same texture-building effect (sugar is what makes shakes thick, not just sweet). Avoid zero-sugar sweeteners like pure stevia or erythritol alone for shakes; they don\'t provide the same thickness. Banana or avocado can also thicken a low-sugar shake.',
        },
      ],
    },
    fr: {
      title: 'Recettes de Milkshake pour Ninja Creami',
      description: 'Recettes de milkshakes épais et crémeux pour votre Ninja Creami. Saveurs classiques, garnitures gourmandes et boissons glacées parfaitement mixées — avec instructions étape par étape.',
      metaDescription: 'Recettes de milkshake Ninja Creami — plus épais, plus crémeux et plus rapides qu\'un blender. Chocolat, fraise, banane-caramel et mélanges créatifs.',
      longIntroSections: [
        {
          layout: 'two-col',
          markdown: `Le Ninja Creami fait des milkshakes à faire rougir un blender. Parce que le Creami part d\'un pot correctement congelé — pas de glaçons qui diluent votre shake — vous obtenez une consistance épaisse, cuillère-tient-droite, sans aucune dilution aqueuse d\'un blender. Chaque recette de cette page a été calibrée pour le programme Milkshake, pour des versés style diner sans essais ratés.

La technique est différente du milkshake traditionnel. Au lieu de mixer de la glace avec du lait (ce qui la dilue), vous congelez une base spécifique au milkshake comme pot — crème, lait, sucre, arôme — et laissez le programme Milkshake l\'amener à la consistance idéale : buvable mais épaisse. Niveau Steak \'n Shake d\'épaisseur, pas McDonald\'s liquide. Pour extra-épais, utilisez d\'abord le programme Ice Cream et arrêtez à l\'étape buvable.`,
        },
        {
          layout: 'cards',
          heading: 'Les trois styles de milkshake sur ce site',
          cards: [
            {
              title: 'Shakes de diner classiques',
              body: 'Chocolat, fraise, vanille, cookies and cream. Les saveurs de shake nostalgiques qui ont rendu le format célèbre. Épais, mousseux, généreux — exactement ce qu\'on commanderait dans un diner années 50. Commencez ici si vous débutez avec le programme Milkshake.',
            },
            {
              title: 'Shakes-desserts',
              body: 'Banane-caramel, Birthday Cake, Nutella. Des shakes qui sont essentiellement des desserts sous forme liquide, garnis de chantilly et de garnitures ludiques. Plus riches que les shakes classiques, mieux placés comme douceur d\'après-dîner que comme boisson.',
            },
            {
              title: 'Shakes fruités et tropicaux',
              body: 'Fraise, pêche, mangue, ananas. Des shakes plus légers, orientés fruits qui utilisent une vraie purée de fruits à côté de la base crémeuse. Moins dessert, plus estivaux et rafraîchissants.',
            },
          ],
        },
        {
          layout: 'two-col',
          markdown: `**Comment utiliser ces recettes :** chaque recette indique le ratio de la base, le cycle exact du programme Milkshake et les éventuels mix-ins à ajouter pendant l\'étape Mix-In. Le programme Milkshake est le seul conçu pour une texture buvable (pas à la cuillère) — utilisez-le plutôt que Ice Cream suivi de lait en plus, qui produit un résultat plus liquide.

**Choisir son verre :** les milkshakes d\'un Creami se versent le mieux dans des verres hauts et froids. Mettez votre verre au congélateur 10 minutes avant de servir — un verre froid garde le shake épais plus longtemps et livre cette expérience classique "reste épais jusqu\'au fond" du diner.`,
        },
      ],
      faqs: [
        {
          question: 'Quelle est la différence entre un milkshake et une glace Ninja Creami ?',
          answer: 'Un milkshake dans le Creami est spécifiquement buvable — le programme Milkshake traite le pot congelé jusqu\'à une consistance épaisse mais versable (comme un shake de diner épais). La crème glacée est traitée jusqu\'à une texture à la cuillère. Vous utilisez le même type de base mais un cycle de programme différent.',
        },
        {
          question: 'Quel programme utiliser pour les milkshakes ?',
          answer: 'Utilisez le programme "Milkshake" sur le Creami Deluxe — il est réglé pour laisser le pot versable plutôt qu\'à la cuillère. Sur le Creami Original (sans programme Milkshake), utilisez Ice Cream et ajoutez 2 à 3 cuillères à soupe de lait à la fin, puis Re-Spin — le résultat est presque identique.',
        },
        {
          question: 'Puis-je faire un milkshake à partir d\'un pot de glace déjà turbiné ?',
          answer: 'Oui — ajoutez 2 à 3 cuillères à soupe de lait sur un pot déjà turbiné, puis lancez le programme Milkshake (ou Re-Spin si vous n\'avez pas Milkshake). C\'est la façon la plus simple de transformer une glace restante en shake sans faire un nouveau pot.',
        },
        {
          question: 'Pourquoi mon milkshake Ninja Creami est-il trop épais pour passer dans une paille ?',
          answer: 'Le pot est trop congelé ou la base a trop peu de liquide. Ajoutez 1 à 2 cuillères à soupe de lait et relancez le programme Milkshake ou Re-Spin. Chaque cuillère supplémentaire fluidifie le shake — ajoutez progressivement jusqu\'à ce qu\'il passe dans une grosse paille tout en tapissant les côtés du verre.',
        },
        {
          question: 'Puis-je faire un milkshake protéiné dans le Creami ?',
          answer: 'Oui — utilisez une base de glace protéinée (poudre de protéine + lait + édulcorant) et lancez le programme Milkshake à la fin. Vous obtenez 25 à 30 g de protéines par portion dans un shake qui a vraiment le goût d\'un dessert, pas d\'une boisson protéinée farineuse.',
        },
        {
          question: 'Comment faire un milkshake épais sans sucre ajouté ?',
          answer: 'Utilisez de l\'allulose au lieu du sucre — elle a le même effet épaississant (c\'est le sucre qui rend les shakes épais, pas juste sucrés). Évitez les édulcorants zéro sucre comme la stévia pure ou l\'érythritol seul pour les shakes ; ils n\'apportent pas la même épaisseur. La banane ou l\'avocat peuvent aussi épaissir un shake peu sucré.',
        },
      ],
    },
    es: {
      title: 'Recetas de Milkshake para Ninja Creami',
      description: 'Recetas de milkshakes espesos y cremosos con tu Ninja Creami. Sabores clásicos, mezclas indulgentes y bebidas heladas perfectamente mezcladas — con instrucciones paso a paso.',
      metaDescription: 'Recetas de milkshake Ninja Creami — más espesos, cremosos y rápidos que una licuadora. Chocolate, fresa, banana-caramelo y mezclas creativas.',
      longIntroSections: [
        {
          layout: 'two-col',
          markdown: `El Ninja Creami hace milkshakes que dejan en ridículo a cualquier licuadora. Como el Creami parte de un pote correctamente congelado — no cubitos de hielo que aguan el batido — consigues una consistencia espesa, cuchara-se-queda-de-pie, sin la dilución acuosa que mete una licuadora. Cada receta de esta página se ha calibrado al programa Milkshake para que consigas batidos de estilo diner sin errores.

La técnica es distinta a la del milkshake tradicional. En lugar de licuar helado con leche (que lo afina), congelas una base específica para milkshake como pote — nata, leche, azúcar, saborizante — y dejas que el programa Milkshake lo lleve a esa consistencia perfecta: bebible pero espesa. Nivel de espesor tipo Steak \'n Shake, no tipo McDonald\'s fino. Para extra-espeso, usa primero el programa Ice Cream y párate en la etapa bebible.`,
        },
        {
          layout: 'cards',
          heading: 'Los tres estilos de milkshake en este sitio',
          cards: [
            {
              title: 'Batidos de diner clásicos',
              body: 'Chocolate, fresa, vainilla, cookies and cream. Los sabores nostálgicos que hicieron famoso el formato. Espesos, espumosos, altos — justo lo que pedirías en un diner de los años 50. Empieza aquí si eres nuevo con el programa Milkshake.',
            },
            {
              title: 'Batidos-postre',
              body: 'Banana-caramelo, Birthday Cake, Nutella. Batidos que son básicamente postre en forma líquida, rematados con nata montada y toppings divertidos. Más ricos que los clásicos y mejor colocados como capricho después de cenar que como bebida.',
            },
            {
              title: 'Batidos frutales y tropicales',
              body: 'Fresa, melocotón, mango, piña. Batidos más ligeros y centrados en la fruta que usan puré de fruta real junto a la base de nata. Menos de postre, más veraniegos y refrescantes.',
            },
          ],
        },
        {
          layout: 'two-col',
          markdown: `**Cómo usar estas recetas:** cada receta indica la proporción de la base, el ciclo exacto del programa Milkshake y los mix-ins para añadir en la etapa Mix-In. El programa Milkshake es el único diseñado para textura bebible (no para cuchara) — úsalo en vez de Ice Cream seguido de leche extra, que da un resultado más líquido.

**Eligiendo tu vaso:** los milkshakes de un Creami se sirven mejor en vasos altos y fríos. Mete tu vaso al congelador 10 minutos antes de servir — un vaso frío mantiene el batido espeso más tiempo y entrega esa experiencia clásica de diner "sigue espeso hasta el fondo".`,
        },
      ],
      faqs: [
        {
          question: '¿Cuál es la diferencia entre un milkshake y un helado Ninja Creami?',
          answer: 'Un milkshake en el Creami es específicamente bebible — el programa Milkshake procesa el pote congelado hasta una consistencia espesa pero vertible (como un batido grueso de diner). El helado se procesa hasta textura para cuchara. Usas el mismo tipo de base pero un ciclo de programa distinto.',
        },
        {
          question: '¿Qué programa uso para los milkshakes?',
          answer: 'Usa el programa "Milkshake" en el Creami Deluxe — está ajustado para dejar el pote vertible en lugar de para cuchara. En el Creami Original (sin programa Milkshake), usa Ice Cream y añade 2–3 cucharadas de leche al final, luego Re-Spin — el resultado es casi idéntico.',
        },
        {
          question: '¿Puedo hacer un milkshake a partir de un pote de helado ya batido?',
          answer: 'Sí — añade 2–3 cucharadas de leche encima de un pote ya batido y ejecuta el programa Milkshake (o Re-Spin si no tienes Milkshake). Es la forma más sencilla de convertir helado sobrante en batido sin hacer un pote nuevo.',
        },
        {
          question: '¿Por qué mi milkshake Ninja Creami queda demasiado espeso para una pajita?',
          answer: 'El pote está demasiado congelado o la base tiene poco líquido. Añade 1–2 cucharadas de leche y vuelve a ejecutar Milkshake o Re-Spin. Cada cucharada extra afina el batido — añade poco a poco hasta que pase por una pajita gruesa pero siga cubriendo los lados del vaso.',
        },
        {
          question: '¿Puedo hacer un milkshake proteico en el Creami?',
          answer: 'Sí — usa una base de helado proteico (proteína en polvo + leche + edulcorante) y ejecuta el programa Milkshake al final. Consigues 25–30 g de proteína por ración en un batido que realmente sabe a postre, no a bebida proteica pastosa.',
        },
        {
          question: '¿Cómo hago un milkshake espeso sin azúcar añadido?',
          answer: 'Usa alulosa en vez de azúcar — tiene el mismo efecto espesante (el azúcar es lo que hace espesos los batidos, no solo dulces). Evita edulcorantes cero azúcar como la estevia pura o eritritol solo para batidos; no aportan la misma espesor. El plátano o el aguacate también pueden espesar un batido con poca azúcar.',
        },
      ],
    },
    de: {
      title: 'Milkshake-Rezepte für Ninja Creami',
      description: 'Dicke und cremige Milkshake-Rezepte für deinen Ninja Creami. Klassische Geschmacksrichtungen, verwöhnende Mix-ins und perfekt gemixte Eisgetränke — mit Schritt-für-Schritt-Anleitung.',
      metaDescription: 'Ninja Creami Milkshake-Rezepte — dicker, cremiger und schneller als jeder Mixer. Schokolade, Erdbeere, Banane-Karamell und kreative Mix-ins.',
      longIntroSections: [
        {
          layout: 'two-col',
          markdown: `Der Ninja Creami macht Milkshakes, die jeden Mixer blass aussehen lassen. Weil der Creami mit einem richtig eingefrorenen Pint startet — nicht mit Eiswürfeln, die deinen Shake wässern — bekommst du dicke, "Löffel-bleibt-stehen"-Konsistenz ohne die wässrige Verdünnung eines Mixers. Jedes Rezept auf dieser Seite ist auf das Milkshake-Programm abgestimmt, damit du diner-style Shakes ohne Experimente hinbekommst.

Die Technik unterscheidet sich vom klassischen Milkshake. Statt Eis mit Milch zu mixen (was es verdünnt), frierst du eine milkshake-spezifische Basis als Pint ein — Sahne, Milch, Zucker, Aroma — und lässt das Milkshake-Programm sie auf diese perfekte trinkbar-aber-dicke Konsistenz bringen. Steak-\'n-Shake-Dichte, nicht McDonald\'s-dünn. Für extra-dick nimm zuerst das Ice-Cream-Programm und stoppe beim trinkbaren Stadium.`,
        },
        {
          layout: 'cards',
          heading: 'Die drei Milkshake-Stile auf dieser Seite',
          cards: [
            {
              title: 'Klassische Diner-Shakes',
              body: 'Schokolade, Erdbeere, Vanille, Cookies and Cream. Die nostalgischen Shake-Sorten, die das Format berühmt gemacht haben. Dick, schaumig, hoch — genau das, was du in einem 50er-Jahre-Diner bestellen würdest. Starte hier, wenn du neu im Milkshake-Programm bist.',
            },
            {
              title: 'Dessert-Shakes',
              body: 'Banane-Karamell, Birthday Cake, Nutella. Shakes, die im Grunde Desserts in flüssiger Form sind, belegt mit Schlagsahne und verspielten Garnituren. Reichhaltiger als klassische Shakes und besser als Nach-dem-Essen-Leckerei denn als Getränk.',
            },
            {
              title: 'Frucht- und Tropical-Shakes',
              body: 'Erdbeere, Pfirsich, Mango, Ananas. Leichtere, fruchtbetonte Shakes, die echtes Fruchtpüree neben der Sahnebasis nutzen. Weniger Dessert-schwer, sommerlicher und erfrischender.',
            },
          ],
        },
        {
          layout: 'two-col',
          markdown: `**So nutzt du diese Rezepte:** Jedes Rezept gibt das Basis-Verhältnis, den genauen Milkshake-Programmzyklus und eventuelle Mix-ins während der Mix-In-Phase an. Das Milkshake-Programm ist als einziges auf trinkbare (nicht löffelbare) Textur ausgelegt — nutze es statt Ice Cream plus Extra-Milch, was ein flüssigeres Ergebnis liefert.

**Das richtige Glas wählen:** Milkshakes aus einem Creami gießen sich am besten in hohe, gekühlte Gläser. Stell dein Serviereisglas 10 Minuten vor dem Eingießen in den Gefrierschrank — ein kaltes Glas hält den Shake länger dick und liefert dieses klassische "bleibt bis zum Boden dick"-Diner-Erlebnis.`,
        },
      ],
      faqs: [
        {
          question: 'Was ist der Unterschied zwischen einem Ninja Creami Milkshake und Eiscreme?',
          answer: 'Ein Milkshake im Creami ist spezifisch trinkbar — das Milkshake-Programm verarbeitet das gefrorene Pint zu dicker, aber gießbarer Konsistenz (wie ein dicker Diner-Shake). Eiscreme wird bis zur löffelbaren Textur verarbeitet. Du nutzt die gleiche Art Basis, aber einen anderen Programmzyklus.',
        },
        {
          question: 'Welches Programm nutze ich für Milkshakes?',
          answer: 'Nutze das "Milkshake"-Programm am Creami Deluxe — es ist darauf abgestimmt, das Pint gießbar statt löffelbar zu belassen. Am Creami Original (ohne Milkshake-Programm) nutze Ice Cream und gib am Ende 2–3 Esslöffel Milch dazu, dann Re-Spin — das Ergebnis ist nahezu identisch.',
        },
        {
          question: 'Kann ich aus einem bereits gespinnten Eis-Pint einen Milkshake machen?',
          answer: 'Ja — gib 2–3 Esslöffel Milch auf ein gespinntes Pint und starte das Milkshake-Programm (oder Re-Spin, wenn du kein Milkshake hast). Das ist der einfachste Weg, Eisreste in einen Shake zu verwandeln, ohne ein neues Pint zu machen.',
        },
        {
          question: 'Warum ist mein Ninja Creami Milkshake zu dick für einen Strohhalm?',
          answer: 'Das Pint ist überfroren oder die Basis hat zu wenig Flüssigkeit. Gib 1–2 Esslöffel Milch dazu und starte Milkshake oder Re-Spin erneut. Jeder zusätzliche Esslöffel verdünnt den Shake — graduell hinzufügen, bis er durch einen dicken Strohhalm fließt, aber noch die Glaswand bedeckt.',
        },
        {
          question: 'Kann ich einen Protein-Milkshake im Creami machen?',
          answer: 'Ja — nutze eine Protein-Eisbasis (Proteinpulver + Milch + Süßungsmittel) und starte am Ende das Milkshake-Programm. Du bekommst 25–30 g Protein pro Portion in einem Shake, der tatsächlich nach Dessert schmeckt — nicht nach kreidigem Proteingetränk.',
        },
        {
          question: 'Wie mache ich einen dicken Milkshake ohne zugesetzten Zucker?',
          answer: 'Nutze Allulose statt Zucker — sie hat den gleichen dickmachenden Effekt (Zucker macht Shakes dick, nicht nur süß). Meide Null-Zucker-Süßungsmittel wie reines Stevia oder Erythrit allein für Shakes; sie liefern nicht die gleiche Dicke. Banane oder Avocado können einen zuckerarmen Shake ebenfalls andicken.',
        },
      ],
    },
    pt: {
      title: 'Receitas de Milkshake para Ninja Creami',
      description: 'Receitas de milkshakes espessos e cremosos com seu Ninja Creami. Sabores clássicos, combinações indulgentes e bebidas geladas perfeitamente batidas — com instruções passo a passo.',
      metaDescription: 'Receitas de milkshake Ninja Creami — mais espessos, cremosos e rápidos que um liquidificador. Chocolate, morango, banana-caramelo e combinações criativas.',
      longIntroSections: [
        {
          layout: 'two-col',
          markdown: `O Ninja Creami faz milkshakes que envergonham qualquer liquidificador. Como o Creami parte de um pote corretamente congelado — não cubos de gelo que aguam o shake — você consegue consistência espessa, colher-fica-em-pé, sem a diluição aguada que um liquidificador introduz. Cada receita desta página foi calibrada para o programa Milkshake, para você conseguir derramados estilo diner sem tentativa e erro.

A técnica é diferente do milkshake tradicional. Em vez de bater sorvete com leite (o que afina), você congela uma base específica para milkshake como pote — creme, leite, açúcar, saborizante — e deixa o programa Milkshake levar à consistência perfeita: bebível, mas espessa. Nível Steak \'n Shake de espessura, não McDonald\'s aguado. Para extra-espesso, use primeiro o programa Ice Cream e pare no estágio bebível.`,
        },
        {
          layout: 'cards',
          heading: 'Os três estilos de milkshake neste site',
          cards: [
            {
              title: 'Shakes clássicos de diner',
              body: 'Chocolate, morango, baunilha, cookies and cream. Os sabores nostálgicos que tornaram o formato famoso. Espessos, espumosos, altos — exatamente o que você pediria num diner dos anos 50. Comece aqui se for novo no programa Milkshake.',
            },
            {
              title: 'Shakes-sobremesa',
              body: 'Banana-caramelo, Birthday Cake, Nutella. Shakes que são basicamente sobremesas em forma líquida, finalizados com chantilly e enfeites divertidos. Mais ricos que os clássicos e melhor posicionados como doce depois do jantar do que como bebida.',
            },
            {
              title: 'Shakes frutados e tropicais',
              body: 'Morango, pêssego, manga, abacaxi. Shakes mais leves e focados em fruta que usam purê de fruta de verdade junto com a base de creme. Menos sobremesa, mais veranil e refrescante.',
            },
          ],
        },
        {
          layout: 'two-col',
          markdown: `**Como usar essas receitas:** cada receita especifica a proporção da base, o ciclo exato do programa Milkshake e quaisquer mix-ins para adicionar na etapa Mix-In. O programa Milkshake é o único projetado para textura bebível (não para colher) — use-o em vez de Ice Cream seguido de mais leite, que dá um resultado mais líquido.

**Escolhendo o copo:** milkshakes do Creami vão melhor servidos em copos altos e gelados. Coloque seu copo no freezer por 10 minutos antes de servir — um copo gelado mantém o shake espesso por mais tempo e entrega aquela experiência clássica de diner "fica espesso até o fundo".`,
        },
      ],
      faqs: [
        {
          question: 'Qual a diferença entre um milkshake e um sorvete Ninja Creami?',
          answer: 'Um milkshake no Creami é especificamente bebível — o programa Milkshake processa o pote congelado até uma consistência espessa mas derramável (como um shake de diner grosso). O sorvete é processado até a textura para colher. Você usa o mesmo tipo de base mas um ciclo de programa diferente.',
        },
        {
          question: 'Qual programa uso para milkshakes?',
          answer: 'Use o programa "Milkshake" no Creami Deluxe — ele foi ajustado para deixar o pote derramável em vez de para colher. No Creami Original (sem programa Milkshake), use Ice Cream e adicione 2–3 colheres de sopa de leite no fim, depois Re-Spin — o resultado fica quase idêntico.',
        },
        {
          question: 'Posso fazer um milkshake a partir de um pote de sorvete já rodado?',
          answer: 'Sim — adicione 2–3 colheres de sopa de leite em cima de um pote já rodado, depois rode o programa Milkshake (ou Re-Spin se não tiver Milkshake). Essa é a forma mais simples de transformar sorvete que sobrou num shake sem fazer um pote novo.',
        },
        {
          question: 'Por que meu milkshake do Ninja Creami está espesso demais para o canudo?',
          answer: 'O pote está congelado demais ou a base tem pouco líquido. Adicione 1–2 colheres de sopa de leite e rode Milkshake ou Re-Spin de novo. Cada colher extra afina o shake — adicione aos poucos até ele passar por um canudo grosso mas ainda cobrir as laterais do copo.',
        },
        {
          question: 'Posso fazer um milkshake proteico no Creami?',
          answer: 'Sim — use uma base de sorvete proteico (whey protein + leite + adoçante) e rode o programa Milkshake no fim. Você consegue 25–30 g de proteína por porção num shake que realmente tem gosto de sobremesa, não de bebida proteica arenosa.',
        },
        {
          question: 'Como faço um milkshake espesso sem açúcar adicionado?',
          answer: 'Use alulose em vez de açúcar — tem o mesmo efeito de textura (é o açúcar que deixa shakes espessos, não só doces). Evite adoçantes zero açúcar como estévia pura ou eritritol sozinhos para shakes; não dão a mesma espessura. Banana ou abacate também podem engrossar um shake com pouco açúcar.',
        },
      ],
    },
  },
  'smoothie-bowl': {
    en: {
      title: 'Smoothie Bowl Recipes for Ninja Creami',
      description: 'Thick, scoopable smoothie bowl recipes for your Ninja Creami. Frozen fruit bases, nutritious toppings, and beautiful breakfast bowls — all with step-by-step instructions.',
      metaDescription: 'Ninja Creami smoothie bowl recipes — thick enough to scoop, topped like a café. Açaí, berry-protein, tropical mango. Packed with fruit, no ice shards.',
      longIntroSections: [
        {
          layout: 'two-col',
          markdown: `A smoothie bowl is a smoothie thick enough to eat with a spoon — the texture that makes it a breakfast, not a drink. The Ninja Creami is uniquely suited to this: the Smoothie Bowl program dials in on the exact "thicker than a smoothie, not quite ice cream" consistency that's frustrating to nail in a blender. Every recipe on this page is tested in a real Creami, with exact freeze times and topping pairings that work.

What makes a Creami smoothie bowl different from a blender version is the starting point. Instead of pulverizing ice cubes (which water down the bowl), you freeze your blended fruit base into a pint overnight, then the Creami shaves and re-blends it into a dense, cold, scoopable bowl. Result: no ice shards, no half-melted slush in three minutes, and real fruit flavor that isn't diluted.`,
        },
        {
          layout: 'cards',
          heading: 'The three smoothie bowl styles on this site',
          cards: [
            {
              title: 'Classic fruit bowls',
              body: 'Mixed berry, tropical mango, strawberry-banana. Real frozen fruit as the base, a splash of milk or coconut water to help it blend, topped with granola, fresh fruit, and seeds. The foundation of smoothie bowl culture — vibrant colors, real fruit flavor, no shortcuts.',
            },
            {
              title: 'Açaí and superfood bowls',
              body: 'Açaí puree as the base, often layered with banana and mixed berries. The Instagram-famous version — deep purple, richly flavored, and loaded with antioxidants. Topped liberally with coconut flakes, bee pollen, cacao nibs, and tropical fruit.',
            },
            {
              title: 'Protein smoothie bowls',
              body: 'Greek yogurt, skyr, or a scoop of protein powder blended into a fruit base for 20–30g of protein per bowl. This is the version that turns a smoothie bowl into a legitimate post-workout meal or a breakfast that actually keeps you full until lunch — not just a sweet snack.',
            },
          ],
        },
        {
          layout: 'two-col',
          markdown: `**How to use these recipes:** each recipe page lists the exact frozen fruit, liquid ratio, and program cycle (most use "Smoothie Bowl"; a few use "Lite Ice Cream" with extra milk for the protein-dense versions). Freeze the filled pint for 24 hours — anything less and the block won't be fully solid, and the blade will shave unevenly instead of creating that dense spoon-scoop texture.

**Choosing your toppings:** store only the base in the Creami pint and add toppings fresh to each serving. Granola loses its crunch on a frozen bowl within ten minutes, so always top at the last second. Freeze-dried fruit, nuts, and seeds stay crisp much longer than fresh toppings and are the smart pick if you're meal-prepping.`,
        },
      ],
      faqs: [
        {
          question: 'What\'s the difference between a smoothie and a smoothie bowl in the Ninja Creami?',
          answer: 'A smoothie is drinkable (thin enough to sip through a straw), while a smoothie bowl is spoon-thick (dense enough to stand up to toppings without sinking). The Creami\'s Smoothie Bowl program is specifically tuned for the bowl texture — slower blade speed, less aeration. For a drinkable smoothie, use the Smoothie Bowl program plus 2 tablespoons of extra liquid and Re-Spin, or run the base through a blender after spinning.',
        },
        {
          question: 'Which program do I use for smoothie bowls in the Ninja Creami?',
          answer: 'Use the "Smoothie Bowl" program on the Creami Deluxe — it\'s tuned specifically for a thicker, spoon-scoopable texture. On the Original Creami (no dedicated Smoothie Bowl program), use Lite Ice Cream — it produces a similar result for fruit-forward bases. Both give the dense, spoon-standing-up consistency that defines a real smoothie bowl.',
        },
        {
          question: 'Can I use fresh fruit instead of frozen fruit in a Creami smoothie bowl?',
          answer: 'No — the Creami needs a fully frozen base to work. The blade shaves and re-blends a frozen pint, so if the fruit is fresh and unfrozen you\'ll end up with a soupy mess, not a smoothie bowl. Freeze your fruit first (cut into small pieces for easy blending) or buy pre-frozen bags from the freezer aisle.',
        },
        {
          question: 'How do I prevent my smoothie bowl from melting too quickly?',
          answer: 'Three fixes: (1) serve in a chilled bowl — put your serving bowl in the freezer for 10 minutes before spinning the pint, (2) serve immediately after the Creami finishes — don\'t let the spun base sit on the counter, (3) avoid warm toppings like honey drizzle or peanut butter swirl until just before eating. A bowl served cold stays dense and spoonable for 10–15 minutes.',
        },
        {
          question: 'Can I make a smoothie bowl without dairy?',
          answer: 'Absolutely — most smoothie bowls on this page are naturally dairy-free. Use coconut milk, almond milk, oat milk, or just fruit juice as the liquid. Açaí bowls are traditionally dairy-free anyway. For protein content without dairy, add a scoop of plant-based protein powder (pea or rice) instead of Greek yogurt.',
        },
        {
          question: 'How much protein is in a Ninja Creami smoothie bowl?',
          answer: 'Classic fruit bowls (without protein additions) land at 4–8g of protein, mostly from toppings like nuts and seeds. Adding Greek yogurt or skyr to the base pushes this to 15–20g. A scoop of protein powder on top of a yogurt base takes you to 25–35g per bowl — a genuine meal-replacement option.',
        },
      ],
    },
    fr: {
      title: 'Recettes de Smoothie Bowl pour Ninja Creami',
      description: 'Recettes de smoothie bowls épais et crémeux pour votre Ninja Creami. Bases de fruits surgelés, garnitures nutritives et bols petit-déjeuner colorés — avec instructions étape par étape.',
      metaDescription: 'Recettes de smoothie bowl Ninja Creami — assez épais pour être à la cuillère, garnis comme au café. Açaï, baies-protéines, mangue tropicale, sans glaçons.',
      longIntroSections: [
        {
          layout: 'two-col',
          markdown: `Un smoothie bowl est un smoothie assez épais pour se manger à la cuillère — la texture qui en fait un petit-déjeuner, pas une boisson. Le Ninja Creami est particulièrement adapté à cela : le programme Smoothie Bowl verrouille cette consistance précise "plus épais qu'un smoothie, pas tout à fait une glace" qui est frustrante à obtenir dans un blender. Chaque recette de cette page est testée dans un vrai Creami, avec les temps de congélation exacts et des associations de garnitures qui fonctionnent.

Ce qui rend un smoothie bowl du Creami différent d'une version au blender, c'est le point de départ. Au lieu de pulvériser des glaçons (qui diluent le bol), vous congelez votre base de fruits mixés comme pot pendant la nuit, puis le Creami la rabote et la remixe en un bol dense, froid et à la cuillère. Résultat : pas d'éclats de glace, pas de bouillie à moitié fondue en trois minutes, et un vrai goût de fruit qui n'est pas dilué.`,
        },
        {
          layout: 'cards',
          heading: 'Les trois styles de smoothie bowl sur ce site',
          cards: [
            {
              title: 'Bols aux fruits classiques',
              body: 'Fruits rouges mélangés, mangue tropicale, fraise-banane. De vrais fruits surgelés comme base, un filet de lait ou d\'eau de coco pour faciliter le mélange, garnis de granola, fruits frais et graines. Le socle de la culture smoothie bowl — couleurs vives, saveurs de fruits véritables, aucun raccourci.',
            },
            {
              title: 'Bols açaï et superaliments',
              body: 'Purée d\'açaï en base, souvent superposée avec banane et fruits rouges mélangés. La version célèbre sur Instagram — violet profond, goût riche, chargée en antioxydants. Garnie généreusement de flocons de noix de coco, pollen d\'abeille, éclats de cacao et fruits tropicaux.',
            },
            {
              title: 'Smoothie bowls protéinés',
              body: 'Yaourt grec, skyr ou une dose de poudre de protéine incorporée à une base de fruits pour 20 à 30 g de protéines par bol. C\'est la version qui transforme un smoothie bowl en vrai repas post-entraînement ou en petit-déjeuner qui tient vraiment jusqu\'au déjeuner — pas juste une collation sucrée.',
            },
          ],
        },
        {
          layout: 'two-col',
          markdown: `**Comment utiliser ces recettes :** chaque page de recette indique les fruits surgelés exacts, le ratio de liquide et le cycle de programme (la plupart utilisent "Smoothie Bowl" ; quelques-unes utilisent "Lite Ice Cream" avec un peu plus de lait pour les versions les plus protéinées). Congelez le pot rempli pendant 24 heures — en-dessous, le bloc n'est pas entièrement solide et la lame rabote de manière inégale au lieu de créer cette texture dense à la cuillère.

**Choisir ses garnitures :** ne conservez que la base dans le pot Creami et ajoutez les garnitures fraîches à chaque portion. Le granola perd son croquant sur un bol glacé en dix minutes, donc garnissez toujours à la dernière seconde. Les fruits lyophilisés, les noix et les graines restent bien plus croquants que les garnitures fraîches et sont le choix malin si vous préparez vos repas à l'avance.`,
        },
      ],
      faqs: [
        {
          question: 'Quelle est la différence entre un smoothie et un smoothie bowl dans le Ninja Creami ?',
          answer: 'Un smoothie est buvable (assez fluide pour passer dans une paille), alors qu\'un smoothie bowl est épais à la cuillère (assez dense pour porter les garnitures sans qu\'elles coulent). Le programme Smoothie Bowl du Creami est calibré pour cette texture de bol — vitesse de lame plus lente, moins d\'aération. Pour un smoothie buvable, utilisez le programme Smoothie Bowl + 2 cuillères à soupe de liquide en plus et faites un Re-Spin, ou passez la base au blender après le turbinage.',
        },
        {
          question: 'Quel programme utiliser pour les smoothie bowls dans le Ninja Creami ?',
          answer: 'Utilisez le programme "Smoothie Bowl" sur le Creami Deluxe — il est calibré spécifiquement pour une texture plus épaisse, à la cuillère. Sur le Creami Original (sans programme Smoothie Bowl dédié), utilisez Lite Ice Cream — il donne un résultat similaire pour les bases axées sur les fruits. Les deux produisent cette consistance dense "la cuillère tient droite" qui définit un vrai smoothie bowl.',
        },
        {
          question: 'Puis-je utiliser des fruits frais au lieu de fruits surgelés dans un smoothie bowl Creami ?',
          answer: 'Non — le Creami a besoin d\'une base entièrement congelée pour fonctionner. La lame rabote et remixe un pot congelé, donc si les fruits sont frais et non congelés, vous obtiendrez une soupe, pas un smoothie bowl. Congelez vos fruits d\'abord (coupés en petits morceaux pour un meilleur mixage) ou achetez des sachets de fruits déjà surgelés.',
        },
        {
          question: 'Comment empêcher mon smoothie bowl de fondre trop vite ?',
          answer: 'Trois solutions : (1) servir dans un bol refroidi — mettez votre bol de service au congélateur 10 minutes avant de turbiner le pot, (2) servir immédiatement après la fin du Creami — ne laissez pas la base turbinée traîner sur le plan de travail, (3) évitez les garnitures tièdes comme le filet de miel ou le beurre de cacahuète juste avant de manger. Un bol servi froid reste dense et à la cuillère pendant 10 à 15 minutes.',
        },
        {
          question: 'Puis-je faire un smoothie bowl sans produits laitiers ?',
          answer: 'Absolument — la plupart des smoothie bowls de cette page sont naturellement sans produits laitiers. Utilisez du lait de coco, d\'amande, d\'avoine ou simplement du jus de fruit comme liquide. Les bols açaï sont traditionnellement sans produits laitiers de toute façon. Pour la protéine sans lait, ajoutez une dose de poudre de protéine végétale (pois ou riz) au lieu du yaourt grec.',
        },
        {
          question: 'Combien de protéines contient un smoothie bowl Ninja Creami ?',
          answer: 'Les bols aux fruits classiques (sans ajout protéiné) apportent 4 à 8 g de protéines, principalement des garnitures comme les noix et les graines. Ajouter du yaourt grec ou du skyr à la base monte à 15–20 g. Une dose de poudre de protéine sur une base au yaourt vous amène à 25–35 g par bol — une vraie option de substitut de repas.',
        },
      ],
    },
    es: {
      title: 'Recetas de Smoothie Bowl para Ninja Creami',
      description: 'Recetas de smoothie bowls espesos y cremosos para tu Ninja Creami. Bases de frutas congeladas, toppings nutritivos y hermosos bowls de desayuno — con instrucciones paso a paso.',
      metaDescription: 'Recetas de smoothie bowl Ninja Creami — tan espesos que se comen a cuchara, servidos como en un café. Açaí, bayas-proteína, mango tropical, sin trozos de hielo.',
      longIntroSections: [
        {
          layout: 'two-col',
          markdown: `Un smoothie bowl es un smoothie lo bastante espeso para comerlo con cuchara — la textura que lo convierte en desayuno, no en bebida. El Ninja Creami está especialmente preparado para esto: el programa Smoothie Bowl clava exactamente esa consistencia "más espesa que un smoothie, menos que un helado" que es frustrante conseguir en una licuadora. Cada receta de esta página está probada en un Creami real, con tiempos de congelado exactos y combinaciones de toppings que funcionan.

Lo que diferencia un smoothie bowl del Creami de la versión de licuadora es el punto de partida. En vez de pulverizar cubos de hielo (que aguan el bowl), congelas tu base de fruta licuada como pote durante la noche, y luego el Creami la rasura y la vuelve a mezclar en un bowl denso, frío y para cuchara. Resultado: sin trozos de hielo, sin granizado a medio derretir en tres minutos, y sabor real de fruta que no se diluye.`,
        },
        {
          layout: 'cards',
          heading: 'Los tres estilos de smoothie bowl en este sitio',
          cards: [
            {
              title: 'Bowls clásicos de fruta',
              body: 'Bayas mixtas, mango tropical, fresa-plátano. Fruta congelada de verdad como base, un chorrito de leche o agua de coco para ayudar a mezclar, rematados con granola, fruta fresca y semillas. La base de la cultura smoothie bowl — colores vivos, sabores de fruta auténticos, sin atajos.',
            },
            {
              title: 'Bowls de açaí y superalimentos',
              body: 'Puré de açaí como base, a menudo con capas de plátano y bayas mixtas. La versión famosa en Instagram — morado intenso, sabor rico y cargado de antioxidantes. Rematado con generosidad con copos de coco, polen de abeja, nibs de cacao y fruta tropical.',
            },
            {
              title: 'Smoothie bowls proteicos',
              body: 'Yogurt griego, skyr o una medida de proteína en polvo mezclados en una base de fruta para 20–30 g de proteína por bowl. Es la versión que convierte un smoothie bowl en una comida post-entreno legítima o un desayuno que de verdad te mantiene saciado hasta el almuerzo — no solo un capricho dulce.',
            },
          ],
        },
        {
          layout: 'two-col',
          markdown: `**Cómo usar estas recetas:** cada página muestra la fruta congelada exacta, la proporción de líquido y el ciclo de programa (la mayoría usa "Smoothie Bowl"; algunas usan "Lite Ice Cream" con un poco más de leche para las versiones más proteicas). Congela el pote lleno 24 horas — con menos, el bloque no está totalmente sólido y la cuchilla rasura de forma irregular en vez de crear esa textura densa para cuchara.

**Eligiendo tus toppings:** guarda solo la base en el pote Creami y añade los toppings frescos a cada ración. La granola pierde el crujiente sobre un bowl congelado en diez minutos, así que siempre añádela al último segundo. La fruta liofilizada, los frutos secos y las semillas aguantan crujientes mucho más que los toppings frescos y son la elección inteligente si preparas comidas con antelación.`,
        },
      ],
      faqs: [
        {
          question: '¿Cuál es la diferencia entre un smoothie y un smoothie bowl en el Ninja Creami?',
          answer: 'Un smoothie es bebible (lo suficientemente líquido para pasar por una pajita), mientras que un smoothie bowl es espeso para cuchara (denso como para sostener toppings sin que se hundan). El programa Smoothie Bowl del Creami está ajustado para esta textura de bowl — velocidad de cuchilla más lenta, menos aireación. Para un smoothie bebible, usa el programa Smoothie Bowl + 2 cucharadas de líquido extra y haz un Re-Spin, o pasa la base por la licuadora después del batido.',
        },
        {
          question: '¿Qué programa uso para smoothie bowls en el Ninja Creami?',
          answer: 'Usa el programa "Smoothie Bowl" en el Creami Deluxe — está ajustado específicamente para una textura más espesa y de cuchara. En el Creami Original (sin programa Smoothie Bowl dedicado), usa Lite Ice Cream — da un resultado similar para bases centradas en fruta. Ambos producen esa consistencia densa "la cuchara se queda de pie" que define un smoothie bowl auténtico.',
        },
        {
          question: '¿Puedo usar fruta fresca en lugar de fruta congelada en un smoothie bowl Creami?',
          answer: 'No — el Creami necesita una base completamente congelada para funcionar. La cuchilla rasura y vuelve a mezclar un pote congelado, así que si la fruta es fresca y no está congelada, vas a terminar con un caldo, no con un smoothie bowl. Congela tu fruta primero (cortada en trozos pequeños para mezclar mejor) o compra bolsas de fruta ya congelada en el pasillo del congelador.',
        },
        {
          question: '¿Cómo evito que mi smoothie bowl se derrita demasiado rápido?',
          answer: 'Tres soluciones: (1) sirve en un bowl frío — mete tu bowl de servir al congelador 10 minutos antes de batir el pote, (2) sirve inmediatamente después de que termine el Creami — no dejes la base batida reposando en la encimera, (3) evita toppings tibios como chorros de miel o mantequilla de cacahuete hasta justo antes de comer. Un bowl servido frío se mantiene denso y para cuchara durante 10–15 minutos.',
        },
        {
          question: '¿Puedo hacer un smoothie bowl sin lácteos?',
          answer: 'Por supuesto — la mayoría de smoothie bowls de esta página son naturalmente sin lácteos. Usa leche de coco, almendra, avena o simplemente jugo de fruta como líquido. Los bowls de açaí son tradicionalmente sin lácteos de todos modos. Para proteína sin lácteos, añade una medida de proteína vegetal en polvo (guisante o arroz) en lugar de yogurt griego.',
        },
        {
          question: '¿Cuánta proteína tiene un smoothie bowl del Ninja Creami?',
          answer: 'Los bowls clásicos de fruta (sin añadidos proteicos) quedan en 4–8 g de proteína, sobre todo de toppings como frutos secos y semillas. Añadir yogurt griego o skyr a la base sube a 15–20 g. Una medida de proteína en polvo sobre una base de yogurt te lleva a 25–35 g por bowl — una opción real como sustituto de comida.',
        },
      ],
    },
    de: {
      title: 'Smoothie-Bowl-Rezepte für Ninja Creami',
      description: 'Dicke, löffelbare Smoothie-Bowl-Rezepte für deinen Ninja Creami. Gefrorene Fruchtbasen, nahrhafte Toppings und wunderschöne Frühstücksschalen — mit Schritt-für-Schritt-Anleitung.',
      metaDescription: 'Ninja Creami Smoothie-Bowl-Rezepte — dick genug zum Löffeln, wie im Café getoppt. Açaí, Beeren-Protein, tropische Mango. Viel Obst, keine Eissplitter.',
      longIntroSections: [
        {
          layout: 'two-col',
          markdown: `Eine Smoothie Bowl ist ein Smoothie, der dick genug ist, um ihn zu löffeln — genau die Textur, die ihn zum Frühstück macht, nicht zum Getränk. Der Ninja Creami ist dafür prädestiniert: Das Smoothie-Bowl-Programm trifft diese Konsistenz "dicker als ein Smoothie, nicht ganz Eis" exakt, die in einem Mixer frustrierend schwer hinzubekommen ist. Jedes Rezept auf dieser Seite wurde in einem echten Creami getestet, mit genauen Gefrierzeiten und Topping-Kombinationen, die funktionieren.

Was eine Creami-Smoothie-Bowl von der Mixer-Version unterscheidet, ist der Startpunkt. Statt Eiswürfel zu pulverisieren (die die Bowl wässern), frierst du deine gemixte Fruchtbasis über Nacht als Pint ein, dann hobelt und remixt der Creami sie zu einer dichten, kalten, löffelbaren Bowl. Ergebnis: keine Eissplitter, kein halbgeschmolzener Matsch nach drei Minuten und echter Fruchtgeschmack, der nicht verdünnt wird.`,
        },
        {
          layout: 'cards',
          heading: 'Die drei Smoothie-Bowl-Stile auf dieser Seite',
          cards: [
            {
              title: 'Klassische Fruchtbowls',
              body: 'Gemischte Beeren, tropische Mango, Erdbeere-Banane. Echte gefrorene Früchte als Basis, ein Schuss Milch oder Kokoswasser, damit sie sich binden, getoppt mit Granola, frischen Früchten und Samen. Das Fundament der Smoothie-Bowl-Kultur — leuchtende Farben, echter Fruchtgeschmack, keine Abkürzungen.',
            },
            {
              title: 'Açaí- und Superfood-Bowls',
              body: 'Açaí-Püree als Basis, oft mit Banane und gemischten Beeren geschichtet. Die Instagram-berühmte Version — tief violett, reich im Geschmack und voller Antioxidantien. Großzügig getoppt mit Kokosraspeln, Bienenpollen, Kakao-Nibs und Tropenfrüchten.',
            },
            {
              title: 'Protein-Smoothie-Bowls',
              body: 'Griechischer Joghurt, Skyr oder eine Portion Proteinpulver in eine Fruchtbasis gemixt für 20–30 g Protein pro Bowl. Das ist die Version, die eine Smoothie Bowl in eine echte Post-Workout-Mahlzeit verwandelt oder in ein Frühstück, das dich wirklich bis zum Mittag satt hält — kein bloßer süßer Snack.',
            },
          ],
        },
        {
          layout: 'two-col',
          markdown: `**So nutzt du diese Rezepte:** Jede Rezeptseite nennt die genaue gefrorene Frucht, das Flüssigkeitsverhältnis und den Programmzyklus (die meisten nutzen "Smoothie Bowl"; einige nutzen "Lite Ice Cream" mit etwas mehr Milch für die proteinreichen Versionen). Friere das gefüllte Pint 24 Stunden ein — bei weniger ist der Block nicht vollständig fest, und die Klinge hobelt ungleichmäßig, statt diese dichte Löffel-Textur zu schaffen.

**Die Toppings wählen:** Lagere nur die Basis im Creami-Pint und gib Toppings frisch pro Portion dazu. Granola verliert seinen Crunch auf einer gefrorenen Bowl innerhalb von zehn Minuten — toppe also immer in der letzten Sekunde. Gefriergetrocknete Früchte, Nüsse und Samen bleiben viel länger knusprig als frische Toppings und sind die clevere Wahl beim Meal-Prep.`,
        },
      ],
      faqs: [
        {
          question: 'Was ist der Unterschied zwischen einem Smoothie und einer Smoothie Bowl im Ninja Creami?',
          answer: 'Ein Smoothie ist trinkbar (dünn genug für einen Strohhalm), eine Smoothie Bowl dagegen löffeldick (dicht genug, um Toppings zu tragen, ohne dass sie einsinken). Das Smoothie-Bowl-Programm des Creami ist auf diese Bowl-Textur abgestimmt — langsamere Klingenaktion, weniger Belüftung. Für einen trinkbaren Smoothie nutze das Smoothie-Bowl-Programm plus 2 Esslöffel zusätzliche Flüssigkeit und mache einen Re-Spin, oder mixe die Basis nach dem Spinnen nochmal im Standmixer.',
        },
        {
          question: 'Welches Programm nutze ich für Smoothie Bowls im Ninja Creami?',
          answer: 'Nutze das "Smoothie Bowl"-Programm am Creami Deluxe — es ist speziell auf eine dickere, löffelbare Textur abgestimmt. Am Creami Original (ohne eigenes Smoothie-Bowl-Programm) nutze Lite Ice Cream — es liefert ein ähnliches Ergebnis für fruchtbetonte Basen. Beide erzeugen diese dichte, "Löffel-steht-aufrecht"-Konsistenz, die eine echte Smoothie Bowl ausmacht.',
        },
        {
          question: 'Kann ich frische statt gefrorene Früchte für eine Creami Smoothie Bowl verwenden?',
          answer: 'Nein — der Creami braucht eine vollständig gefrorene Basis, um zu funktionieren. Die Klinge hobelt und remixt ein gefrorenes Pint — sind die Früchte frisch und nicht gefroren, bekommst du Suppe, keine Smoothie Bowl. Friere deine Früchte vorher ein (in kleine Stücke geschnitten für bessere Mixbarkeit) oder kauf vorgefrorene Beutel aus dem Tiefkühlregal.',
        },
        {
          question: 'Wie verhindere ich, dass meine Smoothie Bowl zu schnell schmilzt?',
          answer: 'Drei Tricks: (1) in einer gekühlten Schale servieren — stelle deine Servierschale 10 Minuten vor dem Spinnen in den Gefrierschrank, (2) sofort nach Programmende servieren — lass die gespinnte Basis nicht auf der Arbeitsplatte stehen, (3) meide warme Toppings wie Honigfaden oder Erdnussbutter bis kurz vor dem Essen. Eine kalt servierte Bowl bleibt 10–15 Minuten dicht und löffelbar.',
        },
        {
          question: 'Kann ich eine Smoothie Bowl ohne Milchprodukte machen?',
          answer: 'Absolut — die meisten Smoothie Bowls auf dieser Seite sind von Natur aus milchfrei. Nutze Kokos-, Mandel- oder Hafermilch oder einfach Fruchtsaft als Flüssigkeit. Açaí-Bowls sind traditionell sowieso milchfrei. Für Protein ohne Milch füge eine Portion pflanzliches Proteinpulver (Erbse oder Reis) statt griechischem Joghurt hinzu.',
        },
        {
          question: 'Wie viel Protein steckt in einer Ninja Creami Smoothie Bowl?',
          answer: 'Klassische Fruchtbowls (ohne Protein-Zusätze) liegen bei 4–8 g Protein, vor allem aus Toppings wie Nüssen und Samen. Mit griechischem Joghurt oder Skyr in der Basis kommst du auf 15–20 g. Eine Portion Proteinpulver auf einer Joghurt-Basis bringt dich auf 25–35 g pro Bowl — eine echte Mahlzeit-Ersatz-Option.',
        },
      ],
    },
    pt: {
      title: 'Receitas de Smoothie Bowl para Ninja Creami',
      description: 'Receitas de smoothie bowls espessos e cremosos para seu Ninja Creami. Bases de frutas congeladas, coberturas nutritivas e lindos bowls de café da manhã — com instruções passo a passo.',
      metaDescription: 'Receitas de smoothie bowl Ninja Creami — espessos o bastante para colher, servidos como em café. Açaí, frutas-proteína, manga tropical, sem pedaços de gelo.',
      longIntroSections: [
        {
          layout: 'two-col',
          markdown: `Um smoothie bowl é um smoothie espesso o suficiente para comer de colher — a textura que o transforma em café da manhã, não em bebida. O Ninja Creami é especialmente adequado para isso: o programa Smoothie Bowl acerta exatamente aquela consistência "mais espessa que smoothie, não tão firme quanto sorvete" que é frustrante de conseguir no liquidificador. Cada receita desta página foi testada num Creami de verdade, com tempos de congelamento exatos e combinações de coberturas que funcionam.

O que diferencia um smoothie bowl do Creami da versão no liquidificador é o ponto de partida. Em vez de pulverizar cubos de gelo (que aguam o bowl), você congela sua base de fruta batida como pote durante a noite, e aí o Creami raspa e remistura tudo num bowl denso, gelado e de colher. Resultado: sem pedaços de gelo, sem raspadinha meio derretida em três minutos e sabor de fruta de verdade que não dilui.`,
        },
        {
          layout: 'cards',
          heading: 'Os três estilos de smoothie bowl neste site',
          cards: [
            {
              title: 'Bowls clássicos de fruta',
              body: 'Frutas vermelhas mistas, manga tropical, morango-banana. Fruta congelada de verdade como base, um fio de leite ou água de coco para ajudar a misturar, coberto com granola, fruta fresca e sementes. A base da cultura smoothie bowl — cores vibrantes, sabores de fruta autênticos, sem atalhos.',
            },
            {
              title: 'Bowls de açaí e superalimentos',
              body: 'Polpa de açaí como base, frequentemente em camadas com banana e frutas vermelhas mistas. A versão famosa no Instagram — roxo intenso, sabor rico e carregado de antioxidantes. Coberto generosamente com flocos de coco, pólen de abelha, nibs de cacau e frutas tropicais.',
            },
            {
              title: 'Smoothie bowls proteicos',
              body: 'Iogurte grego, skyr ou uma dose de whey protein batida numa base de fruta para 20–30 g de proteína por bowl. É a versão que transforma um smoothie bowl numa refeição pós-treino de verdade ou num café da manhã que realmente te segura até o almoço — não apenas um lanche doce.',
            },
          ],
        },
        {
          layout: 'two-col',
          markdown: `**Como usar essas receitas:** cada página lista a fruta congelada exata, a proporção de líquido e o ciclo de programa (a maioria usa "Smoothie Bowl"; algumas usam "Lite Ice Cream" com um pouco mais de leite para as versões mais proteicas). Congele o pote cheio por 24 horas — menos do que isso, o bloco não fica totalmente sólido e a lâmina raspa de forma irregular em vez de criar aquela textura densa de colher.

**Escolhendo as coberturas:** guarde só a base no pote Creami e adicione as coberturas fresquinhas em cada porção. A granola perde a crocância sobre um bowl congelado em dez minutos, então cubra sempre no último segundo. Fruta liofilizada, castanhas e sementes ficam crocantes por muito mais tempo que coberturas frescas e são a escolha inteligente se você prepara as refeições com antecedência.`,
        },
      ],
      faqs: [
        {
          question: 'Qual a diferença entre um smoothie e um smoothie bowl no Ninja Creami?',
          answer: 'Um smoothie é bebível (fino o suficiente para passar no canudo), enquanto um smoothie bowl é espesso para colher (denso o bastante para segurar as coberturas sem afundar). O programa Smoothie Bowl do Creami é ajustado para essa textura de bowl — velocidade de lâmina mais lenta, menos aeração. Para um smoothie bebível, use o programa Smoothie Bowl + 2 colheres de sopa de líquido extra e faça um Re-Spin, ou passe a base no liquidificador depois de bater.',
        },
        {
          question: 'Qual programa uso para smoothie bowls no Ninja Creami?',
          answer: 'Use o programa "Smoothie Bowl" no Creami Deluxe — ele é ajustado especificamente para uma textura mais espessa, de colher. No Creami Original (sem programa Smoothie Bowl dedicado), use Lite Ice Cream — ele dá um resultado similar para bases focadas em fruta. Ambos produzem aquela consistência densa "a colher fica de pé" que define um smoothie bowl de verdade.',
        },
        {
          question: 'Posso usar fruta fresca em vez de congelada no smoothie bowl do Creami?',
          answer: 'Não — o Creami precisa de uma base totalmente congelada para funcionar. A lâmina raspa e remistura um pote congelado, então se a fruta está fresca e não congelada, você vai acabar com uma sopa, não um smoothie bowl. Congele sua fruta antes (cortada em pedaços pequenos para misturar melhor) ou compre pacotes de fruta já congelada no congelador do supermercado.',
        },
        {
          question: 'Como evito que meu smoothie bowl derreta rápido demais?',
          answer: 'Três soluções: (1) sirva num bowl gelado — coloque seu bowl de servir no freezer por 10 minutos antes de bater o pote, (2) sirva imediatamente depois que o Creami terminar — não deixe a base batida esperando no balcão, (3) evite coberturas mornas como fio de mel ou pasta de amendoim até bem na hora de comer. Um bowl servido gelado fica denso e de colher por 10 a 15 minutos.',
        },
        {
          question: 'Posso fazer um smoothie bowl sem laticínios?',
          answer: 'Com certeza — a maioria dos smoothie bowls desta página é naturalmente sem laticínios. Use leite de coco, de amêndoa, de aveia ou só suco de fruta como líquido. Bowls de açaí são tradicionalmente sem laticínios de qualquer forma. Para proteína sem laticínios, adicione uma dose de proteína vegetal em pó (ervilha ou arroz) em vez de iogurte grego.',
        },
        {
          question: 'Quanta proteína tem um smoothie bowl do Ninja Creami?',
          answer: 'Bowls clássicos de fruta (sem adições proteicas) ficam em 4–8 g de proteína, principalmente das coberturas como castanhas e sementes. Adicionar iogurte grego ou skyr à base sobe para 15–20 g. Uma dose de whey protein sobre uma base de iogurte te leva a 25–35 g por bowl — uma opção real de substituição de refeição.',
        },
      ],
    },
  },
  'lite-ice-cream': {
    en: {
      title: 'Lite Ice Cream Recipes for Ninja Creami',
      description: 'Lower-calorie ice cream recipes for your Ninja Creami. All the creamy satisfaction with fewer calories — lighter bases, smart swaps, and guilt-free frozen treats with step-by-step instructions.',
      metaDescription: 'Ninja Creami lite ice cream recipes — under 400 calories per pint with full flavor. Protein-boosted bases and macro-friendly pints with no chalky aftertaste.',
      longIntroSections: [
        {
          layout: 'two-col',
          markdown: `Lite ice cream is the sweet spot between "diet dessert" and "real ice cream." The Ninja Creami's Lite Ice Cream program is specifically designed for lower-fat, lower-sugar bases — the kind that come out crumbly and icy on a regular Ice Cream program but creamy and scoopable under Lite Ice Cream. Every pint on this page lands under 400 calories total, with 20–30g of protein typical, and tastes like actual ice cream. No chalk, no weird aftertaste.

The trick to good lite ice cream isn't cutting everything — it's swapping smartly. Use 2% milk instead of heavy cream (cuts calories by roughly 60%), allulose instead of granulated sugar (it bulks and sweetens without calories and doesn't crystallize), and a single scoop of vanilla whey isolate to add protein without the chalky mouthfeel. These aren't "diet fakes" — they're the same techniques modern gelato parlors use to bring pints under 350 calories without sacrificing flavor.`,
        },
        {
          layout: 'cards',
          heading: 'The three lite ice cream styles on this site',
          cards: [
            {
              title: 'Lower-cal classics',
              body: 'Chocolate, vanilla, strawberry, cookies and cream at 300–380 calories per pint. The same flavors you love, reformulated with lighter dairy and allulose. Perfect for everyday eating — they taste like the full-fat originals but fit comfortably into a normal eating pattern.',
            },
            {
              title: 'Protein-boosted lite',
              body: 'A single scoop of whey isolate pushes protein to 25–35g per pint while staying under 400 calories total. A dessert that doubles as legitimate post-workout fuel. Use Lite Ice Cream program — never regular Ice Cream — or you\'ll end up with a crumbly, dry pint.',
            },
            {
              title: 'Fruit-forward lite',
              body: 'Berry bases, stone fruit bases, citrus. Real fruit drives the flavor so you can run lower on fat and still get a satisfying pint. Typically 250–330 calories per pint and naturally lower in sugar thanks to the fiber and water that comes with whole fruit.',
            },
          ],
        },
        {
          layout: 'two-col',
          markdown: `**How to use these recipes:** every recipe on this page uses the Lite Ice Cream program (not regular Ice Cream). The Lite Ice Cream program has different blade action specifically tuned for lower-fat bases — running these recipes on the Ice Cream program instead will produce crumbly, dry pints. If your Creami doesn't have the Lite Ice Cream program, use Ice Cream plus an immediate Re-Spin with 1 tablespoon of milk on top to compensate.

**Choosing your sweetener:** allulose is the workhorse of lite Creami recipes — it adds texture (prevents iciness) the same way sugar does, without the calories. Avoid erythritol alone for ice cream (it goes gritty and cooling when frozen) and avoid liquid stevia as your only sweetener (watery, flat result). Monk fruit and allulose blends (Lakanto, Wholesome Allulose) work especially well.`,
        },
      ],
      faqs: [
        {
          question: 'What counts as "lite" ice cream in the Ninja Creami?',
          answer: 'On this site, lite means under 400 calories per pint (the full Creami pint, divided into 4 servings that\'s 100 calories each). Most recipes land at 280–380 calories per pint, with 20–30g of protein. Compare that to a full-fat homemade ice cream pint at 1,000–1,400 calories — you\'re eating roughly one-third to one-quarter of the calories for nearly identical texture and flavor.',
        },
        {
          question: 'Which program do I use for lite ice cream in the Creami?',
          answer: 'Always use the "Lite Ice Cream" program — it has slower, more aggressive blade action designed for lower-fat bases. Running lite recipes on the regular Ice Cream program produces crumbly, dry pints because that program assumes a higher-fat base. If your Creami model doesn\'t have Lite Ice Cream, use Ice Cream and then Re-Spin with 1 tablespoon of milk on top.',
        },
        {
          question: 'What\'s the difference between lite ice cream and protein ice cream?',
          answer: 'Lite ice cream is defined by calorie count (under 400 per pint) — protein may or may not be a focus. Protein ice cream is defined by protein content (typically 25g+ per pint) — calories may or may not be cut. The two overlap often: most protein recipes are also lite, and most lite recipes include some protein boost. Pick based on your goal: lower calories vs higher protein.',
        },
        {
          question: 'Why is my lite ice cream icy in the Creami?',
          answer: 'Three common causes: (1) you\'re using an artificial sweetener that doesn\'t bulk (like pure stevia or sucralose alone) — add allulose, (2) your fat content is too low, below about 2% total — switch from skim milk to 2%, (3) you\'re using the regular Ice Cream program instead of Lite Ice Cream. The Lite Ice Cream program + allulose + 2% dairy is the combination that works.',
        },
        {
          question: 'Can I use allulose in any Ninja Creami recipe?',
          answer: 'Yes — allulose is the most "sugar-like" of the zero-calorie sweeteners for the Creami. It bulks like sugar, prevents iciness like sugar, and browns like sugar. Substitute 1-to-1 by weight for regular sugar in any Creami recipe. The only caveat: allulose is about 70% as sweet as sugar, so you can either use slightly more by volume or add a pinch of stevia to boost sweetness without adding calories.',
        },
        {
          question: 'How does Ninja Creami lite ice cream compare to Halo Top or Enlightened?',
          answer: 'Texturally, homemade lite ice cream from the Creami is creamier — store-bought lite brands often have a slightly chalky or icy aftertaste from processing and shipping. On cost, the Creami wins easily: a homemade pint runs about $2–3 in ingredients vs $5–7 for Halo Top. On flavor, you can dial in exactly what you want (less sweet, higher protein, specific flavor combos) instead of picking from pre-made options.',
        },
      ],
    },
    fr: {
      title: 'Recettes de Glace Légère pour Ninja Creami',
      description: 'Recettes de crème glacée légère et faible en calories pour votre Ninja Creami. Toute la satisfaction crémeuse avec moins de calories — bases allégées et desserts glacés sans culpabilité.',
      metaDescription: 'Recettes de glace légère Ninja Creami — moins de 400 cal par pot, saveur complète. Bases protéinées et pots adaptés aux macros, sans arrière-goût farineux.',
      longIntroSections: [
        {
          layout: 'two-col',
          markdown: `La glace légère, c'est le juste milieu entre "dessert de régime" et "vraie crème glacée". Le programme Lite Ice Cream du Ninja Creami est spécifiquement conçu pour des bases plus pauvres en matières grasses et en sucre — celles qui sortent friables et glacées sur un programme Ice Cream classique, mais crémeuses et à la cuillère sous Lite Ice Cream. Chaque pot de cette page reste sous les 400 calories au total, avec typiquement 20 à 30 g de protéines, et a vraiment le goût de crème glacée. Pas de goût farineux, pas d'arrière-goût bizarre.

Le secret d'une bonne glace légère, ce n'est pas de tout couper — c'est de bien substituer. Utilisez du lait demi-écrémé au lieu de la crème entière (environ 60% de calories en moins), de l'allulose à la place du sucre cristallisé (il apporte du volume et sucre sans calories, et ne cristallise pas), et une dose de whey isolate vanille pour ajouter des protéines sans la sensation farineuse. Ce ne sont pas de "faux desserts de régime" — ce sont les mêmes techniques que les gelaterias modernes utilisent pour passer sous les 350 calories par pot sans sacrifier le goût.`,
        },
        {
          layout: 'cards',
          heading: 'Les trois styles de glace légère sur ce site',
          cards: [
            {
              title: 'Classiques allégés',
              body: 'Chocolat, vanille, fraise, cookies and cream à 300–380 calories par pot. Les mêmes saveurs que vous aimez, reformulées avec du laitier plus léger et de l\'allulose. Parfait pour tous les jours — elles ont le goût des versions entières mais s\'intègrent confortablement à une alimentation normale.',
            },
            {
              title: 'Glace légère protéinée',
              body: 'Une dose de whey isolate fait monter les protéines à 25–35 g par pot tout en restant sous les 400 calories au total. Un dessert qui fait office de vraie collation post-entraînement. Utilisez le programme Lite Ice Cream — jamais Ice Cream classique — sinon vous finirez avec un pot friable et sec.',
            },
            {
              title: 'Glace légère fruitée',
              body: 'Bases aux fruits rouges, aux fruits à noyau, aux agrumes. Le fruit porte la saveur, ce qui permet de baisser le gras tout en obtenant un pot satisfaisant. Typiquement 250 à 330 calories par pot, et naturellement moins sucré grâce aux fibres et à l\'eau du fruit entier.',
            },
          ],
        },
        {
          layout: 'two-col',
          markdown: `**Comment utiliser ces recettes :** chaque recette de cette page utilise le programme Lite Ice Cream (pas Ice Cream classique). Le programme Lite Ice Cream a une action de lame différente, calibrée pour les bases plus pauvres en matières grasses — lancer ces recettes sur Ice Cream produira des pots friables et secs. Si votre Creami n'a pas le programme Lite Ice Cream, utilisez Ice Cream puis faites un Re-Spin immédiat avec 1 cuillère à soupe de lait sur le dessus pour compenser.

**Choisir son édulcorant :** l'allulose est la pièce maîtresse des recettes Creami allégées — il apporte de la texture (empêche les cristaux) comme le sucre, sans les calories. Évitez l'érythritol seul pour la glace (il devient granuleux et donne une sensation de froid une fois congelé) et évitez la stévia liquide comme seul édulcorant (résultat aqueux et plat). Les mélanges monk fruit + allulose (Lakanto, Wholesome Allulose) fonctionnent particulièrement bien.`,
        },
      ],
      faqs: [
        {
          question: 'Qu\'est-ce qui compte comme glace "légère" dans le Ninja Creami ?',
          answer: 'Sur ce site, légère signifie moins de 400 calories par pot entier (divisé en 4 portions, soit 100 calories chacune). La plupart des recettes se situent entre 280 et 380 calories par pot, avec 20 à 30 g de protéines. À comparer à un pot de glace maison au gras complet à 1000–1400 calories — vous mangez environ un tiers à un quart des calories pour une texture et un goût quasi identiques.',
        },
        {
          question: 'Quel programme utiliser pour la glace légère dans le Creami ?',
          answer: 'Utilisez toujours le programme "Lite Ice Cream" — il a une action de lame plus lente et plus agressive, conçue pour les bases plus pauvres en matières grasses. Lancer des recettes légères sur le programme Ice Cream classique produit des pots friables et secs parce que ce programme suppose une base plus grasse. Si votre modèle de Creami n\'a pas Lite Ice Cream, utilisez Ice Cream puis faites un Re-Spin avec 1 cuillère à soupe de lait sur le dessus.',
        },
        {
          question: 'Quelle différence entre glace légère et glace protéinée ?',
          answer: 'La glace légère se définit par les calories (moins de 400 par pot) — les protéines peuvent ou non être un objectif. La glace protéinée se définit par la teneur en protéines (typiquement 25 g+ par pot) — les calories peuvent ou non être réduites. Les deux se chevauchent souvent : la plupart des recettes protéinées sont aussi légères, et la plupart des recettes légères incluent un apport en protéines. Choisissez selon votre objectif : moins de calories vs plus de protéines.',
        },
        {
          question: 'Pourquoi ma glace légère est-elle glacée dans le Creami ?',
          answer: 'Trois causes fréquentes : (1) vous utilisez un édulcorant artificiel qui n\'apporte pas de volume (comme la stévia pure ou le sucralose seul) — ajoutez de l\'allulose, (2) votre teneur en matières grasses est trop basse, sous environ 2% au total — passez du lait écrémé au demi-écrémé, (3) vous utilisez le programme Ice Cream classique au lieu de Lite Ice Cream. Le programme Lite Ice Cream + allulose + laitier à 2% est la combinaison qui marche.',
        },
        {
          question: 'Puis-je utiliser de l\'allulose dans n\'importe quelle recette Ninja Creami ?',
          answer: 'Oui — l\'allulose est le plus "proche du sucre" parmi les édulcorants zéro calorie pour le Creami. Il apporte du volume comme le sucre, empêche les cristaux comme le sucre et caramélise comme le sucre. Substituez 1 pour 1 en poids au sucre classique dans n\'importe quelle recette Creami. Seul bémol : l\'allulose est environ 70% aussi sucrant que le sucre, vous pouvez donc en mettre un peu plus en volume ou ajouter une pincée de stévia pour booster la douceur sans calories.',
        },
        {
          question: 'Comment la glace légère du Ninja Creami se compare-t-elle à Halo Top ou aux glaces "light" du commerce ?',
          answer: 'Côté texture, la glace légère maison du Creami est plus crémeuse — les marques "light" du commerce ont souvent un arrière-goût légèrement farineux ou glacé dû à la transformation et au transport. Côté coût, le Creami gagne largement : un pot maison coûte environ 2 à 3 € d\'ingrédients contre 5 à 7 € pour Halo Top. Côté goût, vous pouvez ajuster exactement ce que vous voulez (moins sucré, plus protéiné, combinaisons précises) au lieu de choisir parmi des options pré-faites.',
        },
      ],
    },
    es: {
      title: 'Recetas de Helado Light para Ninja Creami',
      description: 'Recetas de helado bajo en calorías para tu Ninja Creami. Toda la satisfacción cremosa con menos calorías — bases ligeras y postres helados sin culpa con instrucciones paso a paso.',
      metaDescription: 'Recetas de helado light Ninja Creami — menos de 400 cal por pote, sabor completo. Bases proteicas y potes macro-friendly, sin regusto pastoso.',
      longIntroSections: [
        {
          layout: 'two-col',
          markdown: `El helado light es el término medio entre "postre de dieta" y "helado de verdad". El programa Lite Ice Cream del Ninja Creami está diseñado específicamente para bases con menos grasa y menos azúcar — esas que salen desmigajadas y heladas en un programa Ice Cream normal, pero cremosas y cucharables con Lite Ice Cream. Cada pote de esta página se queda bajo las 400 calorías en total, con 20–30 g de proteína típicamente, y sabe a helado de verdad. Sin regusto pastoso, sin dejes raros.

El truco del buen helado light no es recortar todo — es sustituir con criterio. Usa leche al 2% en vez de nata entera (recorta calorías un 60% aproximadamente), alulosa en lugar de azúcar normal (da volumen y endulza sin calorías, y no cristaliza), y una medida de whey isolate de vainilla para sumar proteína sin la sensación pastosa en boca. No son "imitaciones dietéticas" — son las mismas técnicas que usan las gelaterías modernas para bajar los potes a menos de 350 calorías sin perder sabor.`,
        },
        {
          layout: 'cards',
          heading: 'Los tres estilos de helado light en este sitio',
          cards: [
            {
              title: 'Clásicos con menos calorías',
              body: 'Chocolate, vainilla, fresa, cookies and cream a 300–380 calorías por pote. Los mismos sabores de siempre, reformulados con lácteos más ligeros y alulosa. Perfectos para el día a día — saben igual que las versiones enteras pero encajan cómodamente en una alimentación normal.',
            },
            {
              title: 'Helado light proteico',
              body: 'Una medida de whey isolate empuja la proteína a 25–35 g por pote manteniéndose bajo las 400 calorías totales. Un postre que sirve como auténtico combustible post-entreno. Usa el programa Lite Ice Cream — nunca Ice Cream normal — o acabarás con un pote desmigajado y seco.',
            },
            {
              title: 'Helado light afrutado',
              body: 'Bases de bayas, de frutas de hueso, de cítricos. La fruta lleva el sabor, así que puedes bajar la grasa y aún obtener un pote satisfactorio. Típicamente 250–330 calorías por pote, y naturalmente más bajo en azúcar gracias a la fibra y el agua que trae la fruta entera.',
            },
          ],
        },
        {
          layout: 'two-col',
          markdown: `**Cómo usar estas recetas:** cada receta de esta página usa el programa Lite Ice Cream (no Ice Cream normal). El programa Lite Ice Cream tiene una acción de cuchilla distinta, ajustada para bases con menos grasa — lanzar estas recetas en el programa Ice Cream producirá potes desmigajados y secos. Si tu Creami no tiene programa Lite Ice Cream, usa Ice Cream y luego haz un Re-Spin inmediato con 1 cucharada de leche encima para compensar.

**Eligiendo tu edulcorante:** la alulosa es la pieza clave de las recetas Creami light — aporta textura (evita los cristales) igual que el azúcar, sin las calorías. Evita el eritritol solo para helado (queda arenoso y genera sensación fría al congelarse) y evita la estevia líquida como único edulcorante (resultado aguado y plano). Las mezclas de monk fruit + alulosa (Lakanto, Wholesome Allulose) funcionan especialmente bien.`,
        },
      ],
      faqs: [
        {
          question: '¿Qué cuenta como helado "light" en el Ninja Creami?',
          answer: 'En este sitio, light significa menos de 400 calorías por pote (el pote Creami entero, dividido en 4 raciones, son 100 calorías cada una). La mayoría de recetas quedan entre 280 y 380 calorías por pote, con 20–30 g de proteína. Compáralo con un pote de helado casero entero a 1000–1400 calorías — comes aproximadamente un tercio o un cuarto de las calorías para una textura y sabor casi idénticos.',
        },
        {
          question: '¿Qué programa uso para helado light en el Creami?',
          answer: 'Usa siempre el programa "Lite Ice Cream" — tiene una acción de cuchilla más lenta y agresiva, diseñada para bases con menos grasa. Lanzar recetas light en el programa Ice Cream normal produce potes desmigajados y secos porque ese programa asume una base con más grasa. Si tu modelo de Creami no tiene Lite Ice Cream, usa Ice Cream y luego haz un Re-Spin con 1 cucharada de leche encima.',
        },
        {
          question: '¿Cuál es la diferencia entre helado light y helado proteico?',
          answer: 'El helado light se define por las calorías (menos de 400 por pote) — la proteína puede ser o no un foco. El helado proteico se define por el contenido proteico (típicamente 25 g+ por pote) — las calorías pueden o no estar recortadas. Los dos se solapan con frecuencia: la mayoría de recetas proteicas también son light, y la mayoría de recetas light incluyen algún aporte proteico. Elige según tu objetivo: menos calorías vs más proteína.',
        },
        {
          question: '¿Por qué mi helado light sale helado en el Creami?',
          answer: 'Tres causas comunes: (1) usas un edulcorante artificial que no aporta volumen (como estevia pura o sucralosa solos) — añade alulosa, (2) tu contenido de grasa es demasiado bajo, por debajo del 2% total — cambia de leche desnatada a semidesnatada (2%), (3) estás usando el programa Ice Cream normal en vez de Lite Ice Cream. El programa Lite Ice Cream + alulosa + lácteo al 2% es la combinación que funciona.',
        },
        {
          question: '¿Puedo usar alulosa en cualquier receta del Ninja Creami?',
          answer: 'Sí — la alulosa es el edulcorante cero calorías más "parecido al azúcar" para el Creami. Aporta volumen como el azúcar, evita los cristales como el azúcar y carameliza como el azúcar. Sustituye 1 a 1 por peso al azúcar normal en cualquier receta Creami. Única advertencia: la alulosa endulza alrededor del 70% que el azúcar, así que puedes poner un poco más en volumen o añadir una pizca de estevia para potenciar el dulzor sin calorías.',
        },
        {
          question: '¿Cómo se compara el helado light del Ninja Creami con Halo Top o marcas similares?',
          answer: 'En textura, el helado light casero del Creami es más cremoso — las marcas light de supermercado suelen tener un regusto algo pastoso o helado por el procesado y el transporte. En coste, el Creami gana con claridad: un pote casero cuesta unos 2–3 € en ingredientes frente a 5–7 € de Halo Top. En sabor, puedes afinar exactamente lo que quieres (menos dulce, más proteína, combinaciones concretas) en vez de elegir entre opciones prefabricadas.',
        },
      ],
    },
    de: {
      title: 'Leichtes Eis — Rezepte für Ninja Creami',
      description: 'Kalorienärmere Eis-Rezepte für deinen Ninja Creami. Der volle cremige Genuss mit weniger Kalorien — leichtere Basen, clevere Alternativen und genussvolle Eiskreationen.',
      metaDescription: 'Ninja Creami Leichtes-Eis-Rezepte — unter 400 kcal pro Pint mit vollem Geschmack. Proteinreiche Basen und makro-freundliche Pints ohne kreidigen Nachgeschmack.',
      longIntroSections: [
        {
          layout: 'two-col',
          markdown: `Leichtes Eis ist der Sweet Spot zwischen "Diät-Dessert" und "echter Eiscreme". Das Lite-Ice-Cream-Programm des Ninja Creami ist speziell für fett- und zuckerärmere Basen ausgelegt — genau die Art, die auf einem normalen Ice-Cream-Programm bröselig und eisig wird, unter Lite Ice Cream aber cremig und löffelbar. Jedes Pint auf dieser Seite bleibt unter 400 Kalorien gesamt, mit typisch 20–30 g Protein, und schmeckt wie echte Eiscreme. Kein kreidiges Gefühl, kein komischer Nachgeschmack.

Der Trick für gutes leichtes Eis ist nicht, alles zu streichen — sondern clever zu tauschen. Nimm 2%-Milch statt Sahne (spart etwa 60% Kalorien), Allulose statt Haushaltszucker (sie gibt Volumen und süßt ohne Kalorien und kristallisiert nicht), und eine Portion Vanille-Whey-Isolat für Protein ohne kreidiges Mundgefühl. Das sind keine "Diät-Fakes" — das sind dieselben Techniken, mit denen moderne Gelaterien ihre Pints unter 350 Kalorien drücken, ohne am Geschmack zu sparen.`,
        },
        {
          layout: 'cards',
          heading: 'Die drei Stile für leichtes Eis auf dieser Seite',
          cards: [
            {
              title: 'Kalorienärmere Klassiker',
              body: 'Schokolade, Vanille, Erdbeere, Cookies and Cream bei 300–380 Kalorien pro Pint. Die gleichen Sorten, die du liebst, neu formuliert mit leichterem Milchanteil und Allulose. Perfekt für den Alltag — sie schmecken wie die vollfetten Originale, passen aber bequem in ein normales Essverhalten.',
            },
            {
              title: 'Leichtes Protein-Eis',
              body: 'Eine Portion Whey-Isolat hebt den Proteingehalt auf 25–35 g pro Pint, während du unter 400 Kalorien gesamt bleibst. Ein Dessert, das gleichzeitig ernstzunehmender Post-Workout-Treibstoff ist. Nutze das Lite-Ice-Cream-Programm — niemals das normale Ice Cream — sonst endest du mit einem bröseligen, trockenen Pint.',
            },
            {
              title: 'Fruchtbetontes leichtes Eis',
              body: 'Beerenbasen, Steinobstbasen, Zitrus. Die Frucht trägt den Geschmack, sodass du mit weniger Fett auskommst und trotzdem ein befriedigendes Pint bekommst. Typisch 250–330 Kalorien pro Pint und von Natur aus zuckerärmer dank Ballaststoffen und Wasser aus der ganzen Frucht.',
            },
          ],
        },
        {
          layout: 'two-col',
          markdown: `**So nutzt du diese Rezepte:** Jedes Rezept auf dieser Seite nutzt das Lite-Ice-Cream-Programm (nicht das normale Ice Cream). Das Lite-Ice-Cream-Programm hat eine andere Klingenaktion, speziell abgestimmt auf fettärmere Basen — wenn du diese Rezepte stattdessen im Ice-Cream-Programm laufen lässt, bekommst du bröselige, trockene Pints. Wenn dein Creami kein Lite-Ice-Cream-Programm hat, nutze Ice Cream und mache sofort einen Re-Spin mit 1 Esslöffel Milch oben drauf, um das auszugleichen.

**Das richtige Süßungsmittel:** Allulose ist das Arbeitstier für leichte Creami-Rezepte — sie gibt Textur (verhindert Eiskristalle) genau wie Zucker, ohne die Kalorien. Meide Erythrit allein für Eis (wird gefroren griesig und löst ein Kältegefühl aus) und meide flüssiges Stevia als einziges Süßungsmittel (wässriges, flaches Ergebnis). Mönchsfrucht- und Allulose-Mischungen (Lakanto, Wholesome Allulose) funktionieren besonders gut.`,
        },
      ],
      faqs: [
        {
          question: 'Was gilt im Ninja Creami als "leichtes" Eis?',
          answer: 'Auf dieser Seite bedeutet leicht: unter 400 Kalorien pro Pint (das ganze Creami-Pint, geteilt in 4 Portionen, also 100 Kalorien pro Portion). Die meisten Rezepte liegen bei 280–380 Kalorien pro Pint, mit 20–30 g Protein. Vergleich das mit einem vollfetten hausgemachten Eis-Pint mit 1000–1400 Kalorien — du isst etwa ein Drittel bis ein Viertel der Kalorien bei nahezu gleicher Textur und Geschmack.',
        },
        {
          question: 'Welches Programm nutze ich für leichtes Eis im Creami?',
          answer: 'Nutze immer das Lite-Ice-Cream-Programm — es hat eine langsamere, aggressivere Klingenaktion, die auf fettärmere Basen ausgelegt ist. Leichte Rezepte im normalen Ice-Cream-Programm ergeben bröselige, trockene Pints, weil dieses Programm eine fettreichere Basis voraussetzt. Wenn dein Creami-Modell kein Lite Ice Cream hat, nutze Ice Cream und mache danach einen Re-Spin mit 1 Esslöffel Milch oben drauf.',
        },
        {
          question: 'Was ist der Unterschied zwischen leichtem Eis und Protein-Eis?',
          answer: 'Leichtes Eis definiert sich über die Kalorien (unter 400 pro Pint) — Protein kann ein Schwerpunkt sein, muss aber nicht. Protein-Eis definiert sich über den Proteingehalt (typisch 25 g+ pro Pint) — die Kalorien können reduziert sein, müssen aber nicht. Die beiden überlappen sich oft: Die meisten Protein-Rezepte sind auch leicht, und die meisten leichten Rezepte enthalten einen Protein-Boost. Wähle nach deinem Ziel: weniger Kalorien vs mehr Protein.',
        },
        {
          question: 'Warum ist mein leichtes Eis im Creami eisig?',
          answer: 'Drei häufige Ursachen: (1) Du nutzt ein künstliches Süßungsmittel, das kein Volumen gibt (wie reines Stevia oder Sucralose allein) — gib Allulose dazu, (2) dein Fettgehalt ist zu niedrig, unter etwa 2% gesamt — wechsle von Magermilch zu 2%, (3) du nutzt das normale Ice-Cream-Programm statt Lite Ice Cream. Die Kombination Lite-Ice-Cream-Programm + Allulose + 2%-Milchanteil ist das, was funktioniert.',
        },
        {
          question: 'Kann ich Allulose in jedem Ninja Creami Rezept verwenden?',
          answer: 'Ja — Allulose ist der "zuckerähnlichste" kalorienfreie Süßstoff für den Creami. Sie gibt Volumen wie Zucker, verhindert Eiskristalle wie Zucker und bräunt wie Zucker. Ersetze sie 1:1 nach Gewicht für normalen Zucker in jedem Creami-Rezept. Einziger Haken: Allulose süßt nur etwa 70% so stark wie Zucker — nimm entweder etwas mehr nach Volumen oder eine Prise Stevia, um die Süße ohne Kalorien zu verstärken.',
        },
        {
          question: 'Wie schneidet Ninja-Creami-Leichteis gegen Halo Top oder ähnliche Marken ab?',
          answer: 'Von der Textur her ist hausgemachtes leichtes Eis aus dem Creami cremiger — gekaufte Leichteis-Marken haben durch Verarbeitung und Transport oft einen leicht kreidigen oder eisigen Nachgeschmack. Beim Preis gewinnt der Creami deutlich: ein hausgemachtes Pint kostet etwa 2–3 € in Zutaten vs 5–7 € für Halo Top. Beim Geschmack kannst du genau einstellen, was du willst (weniger süß, mehr Protein, spezifische Sorten), statt aus vorgefertigten Optionen zu wählen.',
        },
      ],
    },
    pt: {
      title: 'Receitas de Sorvete Light para Ninja Creami',
      description: 'Receitas de sorvete com menos calorias para seu Ninja Creami. Toda a satisfação cremosa com menos calorias — bases mais leves e sobremesas geladas sem culpa com instruções passo a passo.',
      metaDescription: 'Receitas de sorvete light Ninja Creami — menos de 400 cal por pote, sabor completo. Bases proteicas e potes macro-friendly sem gosto arenoso.',
      longIntroSections: [
        {
          layout: 'two-col',
          markdown: `Sorvete light é o meio-termo entre "sobremesa de dieta" e "sorvete de verdade". O programa Lite Ice Cream do Ninja Creami foi desenhado especificamente para bases com menos gordura e menos açúcar — aquelas que saem quebradiças e geladas num programa Ice Cream comum, mas cremosas e de colher no Lite Ice Cream. Cada pote desta página fica abaixo das 400 calorias no total, com 20–30 g de proteína normalmente, e tem gosto de sorvete de verdade. Sem gosto arenoso, sem resíduo estranho.

O segredo de um bom sorvete light não é cortar tudo — é substituir com critério. Use leite semidesnatado (2%) em vez de creme de leite integral (corta cerca de 60% das calorias), alulose no lugar de açúcar refinado (dá volume e adoça sem calorias, e não cristaliza), e uma dose de whey isolate de baunilha para acrescentar proteína sem a sensação arenosa na boca. Não são "imitações de dieta" — são as mesmas técnicas que sorveterias modernas usam para baixar os potes a menos de 350 calorias sem sacrificar o sabor.`,
        },
        {
          layout: 'cards',
          heading: 'Os três estilos de sorvete light neste site',
          cards: [
            {
              title: 'Clássicos com menos calorias',
              body: 'Chocolate, baunilha, morango, cookies and cream entre 300 e 380 calorias por pote. Os mesmos sabores que você gosta, reformulados com laticínios mais leves e alulose. Perfeitos para o dia a dia — têm gosto das versões integrais mas encaixam confortavelmente numa alimentação normal.',
            },
            {
              title: 'Sorvete light proteico',
              body: 'Uma dose de whey isolate empurra a proteína para 25–35 g por pote mantendo-se abaixo das 400 calorias totais. Uma sobremesa que também serve como combustível pós-treino de verdade. Use o programa Lite Ice Cream — nunca Ice Cream comum — ou vai terminar com um pote quebradiço e seco.',
            },
            {
              title: 'Sorvete light frutado',
              body: 'Bases de frutas vermelhas, de frutas de caroço, de cítricos. A fruta conduz o sabor, então você pode baixar a gordura e ainda ter um pote satisfatório. Tipicamente 250–330 calorias por pote, e naturalmente com menos açúcar graças às fibras e à água que vêm da fruta inteira.',
            },
          ],
        },
        {
          layout: 'two-col',
          markdown: `**Como usar essas receitas:** cada receita desta página usa o programa Lite Ice Cream (não Ice Cream comum). O programa Lite Ice Cream tem uma ação de lâmina diferente, ajustada para bases com menos gordura — rodar essas receitas no programa Ice Cream produzirá potes quebradiços e secos. Se seu Creami não tem o programa Lite Ice Cream, use Ice Cream e depois faça um Re-Spin imediato com 1 colher de sopa de leite por cima para compensar.

**Escolhendo seu adoçante:** a alulose é a peça-chave das receitas Creami light — dá textura (evita cristais) do mesmo jeito que o açúcar, sem as calorias. Evite eritritol sozinho para sorvete (fica arenoso e dá sensação fria quando congelado) e evite estévia líquida como único adoçante (resultado aguado e sem graça). Misturas de monk fruit + alulose (Lakanto, Wholesome Allulose) funcionam especialmente bem.`,
        },
      ],
      faqs: [
        {
          question: 'O que conta como sorvete "light" no Ninja Creami?',
          answer: 'Neste site, light significa menos de 400 calorias por pote (o pote Creami inteiro, dividido em 4 porções, são 100 calorias cada uma). A maioria das receitas fica entre 280 e 380 calorias por pote, com 20–30 g de proteína. Compare com um pote de sorvete caseiro integral de 1000–1400 calorias — você come cerca de um terço a um quarto das calorias para uma textura e sabor quase idênticos.',
        },
        {
          question: 'Qual programa uso para sorvete light no Creami?',
          answer: 'Use sempre o programa "Lite Ice Cream" — ele tem uma ação de lâmina mais lenta e agressiva, desenhada para bases com menos gordura. Rodar receitas light no programa Ice Cream comum produz potes quebradiços e secos porque esse programa assume uma base com mais gordura. Se seu modelo de Creami não tem Lite Ice Cream, use Ice Cream e depois faça um Re-Spin com 1 colher de sopa de leite por cima.',
        },
        {
          question: 'Qual a diferença entre sorvete light e sorvete proteico?',
          answer: 'Sorvete light é definido pelas calorias (menos de 400 por pote) — a proteína pode ou não ser o foco. Sorvete proteico é definido pelo teor proteico (tipicamente 25 g+ por pote) — as calorias podem ou não ser cortadas. Os dois se sobrepõem com frequência: a maioria das receitas proteicas também é light, e a maioria das receitas light inclui algum boost proteico. Escolha pelo seu objetivo: menos calorias vs mais proteína.',
        },
        {
          question: 'Por que meu sorvete light está gelado no Creami?',
          answer: 'Três causas comuns: (1) você está usando um adoçante artificial que não dá volume (como estévia pura ou sucralose sozinhos) — adicione alulose, (2) seu teor de gordura está baixo demais, abaixo de cerca de 2% total — mude de leite desnatado para semidesnatado (2%), (3) você está usando o programa Ice Cream comum em vez de Lite Ice Cream. Programa Lite Ice Cream + alulose + laticínio a 2% é a combinação que funciona.',
        },
        {
          question: 'Posso usar alulose em qualquer receita do Ninja Creami?',
          answer: 'Sim — a alulose é o adoçante zero caloria mais "parecido com açúcar" para o Creami. Dá volume como o açúcar, evita cristais como o açúcar e carameliza como o açúcar. Substitua 1 para 1 em peso pelo açúcar comum em qualquer receita Creami. Única ressalva: a alulose adoça cerca de 70% do que o açúcar, então você pode usar um pouco mais em volume ou adicionar uma pitada de estévia para reforçar a doçura sem calorias.',
        },
        {
          question: 'Como o sorvete light do Ninja Creami se compara com Halo Top ou marcas similares?',
          answer: 'Em textura, o sorvete light caseiro do Creami é mais cremoso — as marcas light de supermercado geralmente têm um gosto residual meio arenoso ou gelado por causa do processamento e transporte. Em custo, o Creami ganha com folga: um pote caseiro custa cerca de R$ 10–15 em ingredientes contra R$ 25–35 de Halo Top (quando disponível no Brasil). Em sabor, você pode ajustar exatamente o que quer (menos doce, mais proteína, combinações específicas) em vez de escolher entre opções prontas.',
        },
      ],
    },
  },
  'italian-ice': {
    en: {
      title: 'Italian Ice Recipes for Ninja Creami',
      description: 'Refreshing Italian ice recipes for your Ninja Creami. Icy, fruity, and intensely flavored — the perfect summer treat made easy with step-by-step instructions.',
      metaDescription: 'Ninja Creami Italian ice recipes — icy, intensely fruity, zero dairy. Lemon, cherry, watermelon and more. Vegan, naturally sweet, 3 ingredients or less.',
      longIntroSections: [
        {
          layout: 'two-col',
          markdown: `Italian ice is the most refreshing thing the Ninja Creami makes. No dairy, no eggs, no gelatin — just fruit, water, sugar, and lemon juice, frozen and spun into that iconic shaved-ice texture you remember from summer boardwalks. The Creami's Italian Ice program (or Sorbet on older models) is specifically tuned to preserve the crystalline, almost granular mouthfeel instead of whipping it into smoothness. Every recipe on this page uses 3 or 4 ingredients and spins in under 2 minutes.

The key to great Italian ice is the water-to-sugar-to-fruit ratio. Too much water and it comes out bland and overly icy; too much sugar and it never freezes solid enough to spin. The sweet spot is roughly 1 cup fruit + 1 cup water + 1/3 cup sugar + 1 tablespoon lemon juice — then adjust per fruit. Naturally sweet fruits like strawberry and mango need less sugar; tart fruits like cherry and raspberry need more. Every recipe on this page lists the exact ratio tested for that specific fruit.`,
        },
        {
          layout: 'cards',
          heading: 'The three Italian ice styles on this site',
          cards: [
            {
              title: 'Classic boardwalk flavors',
              body: 'Lemon, cherry, blue raspberry, watermelon. The vibrant colors and intense flavors you remember from summer fairs and boardwalk carts. Made with real fruit (not syrup) for a cleaner, truer flavor and a natural color that doesn\'t need food dye to look like summer in a cup.',
            },
            {
              title: 'Sophisticated grown-up Italian ice',
              body: 'Blood orange, passion fruit, hibiscus-lime, prosecco-strawberry. More adult flavor profiles using real juice, herbs, and sometimes a splash of alcohol. Perfect as a palate cleanser between courses or a lighter dessert after a heavy meal — think of them as savoury-adjacent sorbets.',
            },
            {
              title: 'Herb and spice-infused ices',
              body: 'Basil-lime, rosemary-grapefruit, ginger-pear. The most experimental category — herbs and spices that don\'t normally show up in a frozen treat. Keep servings small because the flavor is intense, and pair with a simple cookie or fresh fruit for contrast.',
            },
          ],
        },
        {
          layout: 'two-col',
          markdown: `**How to use these recipes:** every recipe on this page uses the Italian Ice program on the Creami Deluxe. On the Original Creami (no Italian Ice program), use Sorbet — the texture will be slightly smoother but still correctly icy. Freeze the filled pint for 24 hours minimum. If your pint comes out chunky or frozen completely solid, add 1 tablespoon of water on top and Re-Spin — the added liquid breaks the ice and lets the blade do its work.

**Choosing your fruit:** fresh or frozen both work, but fruit frozen from peak-season fresh gives the most vibrant color and flavor. Avoid canned fruit (too much syrup changes the ratios) and avoid dried fruit (won't freeze correctly). Strain puree through a fine-mesh strainer before freezing to remove seeds and fibers — that single step is what separates a homemade Italian ice from a gritty, seedy one.`,
        },
      ],
      faqs: [
        {
          question: 'What\'s the difference between Italian ice and sorbet in the Ninja Creami?',
          answer: 'Italian ice is icier and more granular than sorbet — you can feel individual ice crystals on your tongue. Sorbet is smoother and silkier because it has more sugar (which lowers the freezing point and produces a finer texture). Italian ice uses less sugar and no stabilizers; sorbet uses more sugar and sometimes gum or starch. The Creami\'s Italian Ice program preserves the crystalline texture; Sorbet smooths it out.',
        },
        {
          question: 'Which program do I use for Italian ice in the Ninja Creami?',
          answer: 'Use the "Italian Ice" program on the Creami Deluxe — it\'s specifically tuned to preserve the icy, granular texture. On the Original Creami (no Italian Ice program), use Sorbet — the texture will be slightly smoother but still closer to authentic Italian ice than regular ice cream would be. Both work; Italian Ice program wins on texture authenticity.',
        },
        {
          question: 'Can I make Italian ice without sugar?',
          answer: 'Partially — you need some form of bulk sweetener to prevent it from freezing into a solid rock of flavored ice. Allulose is the best sugar substitute for Italian ice (it bulks and prevents complete freezing the same way sugar does). Avoid pure stevia or sucralose as your only sweetener — they\'ll make the pint unspinnable. A monk fruit + allulose blend at 1/3 cup per pint works well.',
        },
        {
          question: 'Why is my Italian ice too solid or too icy?',
          answer: 'Three causes: (1) not enough sugar or allulose — fruit alone freezes rock-solid, you need some sweetener to keep it spinnable, (2) you skipped the lemon juice — acid lowers the freezing point slightly and helps texture, (3) your pint was over-frozen (more than 48 hours) — let it sit at room temp for 5 minutes before spinning, or Re-Spin with 1 tablespoon of water on top.',
        },
        {
          question: 'Is Italian ice vegan?',
          answer: 'Yes — traditional Italian ice is naturally vegan. It contains only fruit, water, sugar, and lemon juice. No dairy, no eggs, no animal products of any kind. Every Italian ice recipe on this page is vegan by default. If a recipe includes cream or milk it\'s a sorbet-Italian ice hybrid, not true Italian ice, and will be labeled as such.',
        },
        {
          question: 'How do I get that classic bright Italian ice color without food dye?',
          answer: 'Use fruit with naturally vibrant color: strawberries and raspberries give deep red, blueberries give purple, mango and peach give orange, and blood orange gives an incredible natural red-orange. For a truly blue color (blue raspberry), butterfly pea flower tea works — it\'s naturally blue and flavor-neutral. Avoid artificial food dyes; they have no flavor benefit and the natural colors taste better.',
        },
      ],
    },
    fr: {
      title: 'Recettes de Granité Italien pour Ninja Creami',
      description: 'Recettes de granité italien rafraîchissantes pour votre Ninja Creami. Glacé, fruité et intensément parfumé — le dessert d\'été parfait avec des instructions étape par étape.',
      metaDescription: 'Recettes de granité italien Ninja Creami — glacé, intensément fruité, zéro lactose. Citron, cerise, pastèque. Végan, 3 ingrédients ou moins.',
      longIntroSections: [
        {
          layout: 'two-col',
          markdown: `Le granité italien est ce que le Ninja Creami fait de plus rafraîchissant. Pas de produits laitiers, pas d'œufs, pas de gélatine — juste des fruits, de l'eau, du sucre et du jus de citron, congelés et turbinés dans cette texture de glace pilée emblématique qu'on se rappelle des promenades sur front de mer en été. Le programme Italian Ice du Creami (ou Sorbet sur les modèles plus anciens) est spécifiquement calibré pour préserver cette sensation en bouche cristalline, presque granuleuse, au lieu de la fouetter jusqu'à lissage. Chaque recette de cette page utilise 3 ou 4 ingrédients et se turbine en moins de 2 minutes.

La clé d'un bon granité italien, c'est le ratio eau-sucre-fruit. Trop d'eau et il sort fade et trop glacé ; trop de sucre et il ne congèle jamais assez pour être turbiné. Le juste équilibre tourne autour de 1 tasse de fruit + 1 tasse d'eau + 1/3 tasse de sucre + 1 cuillère à soupe de jus de citron — puis à ajuster selon le fruit. Les fruits naturellement sucrés comme la fraise et la mangue demandent moins de sucre ; les fruits acidulés comme la cerise et la framboise en demandent plus. Chaque recette de cette page indique le ratio exact testé pour ce fruit précis.`,
        },
        {
          layout: 'cards',
          heading: 'Les trois styles de granité italien sur ce site',
          cards: [
            {
              title: 'Saveurs classiques de front de mer',
              body: 'Citron, cerise, framboise bleue, pastèque. Les couleurs vibrantes et les saveurs intenses qu\'on se rappelle des fêtes foraines d\'été et des chariots de bord de plage. Faits avec de vrais fruits (pas du sirop) pour une saveur plus pure et une couleur naturelle qui n\'a pas besoin de colorant pour ressembler à l\'été dans un gobelet.',
            },
            {
              title: 'Granité italien version adulte',
              body: 'Orange sanguine, fruit de la passion, hibiscus-citron vert, prosecco-fraise. Des profils plus adultes utilisant du vrai jus, des herbes et parfois un trait d\'alcool. Parfaits comme rafraîchissant de palais entre les plats ou comme dessert plus léger après un repas riche — voyez-les comme des sorbets proches du salé.',
            },
            {
              title: 'Granités aux herbes et épices',
              body: 'Basilic-citron vert, romarin-pamplemousse, gingembre-poire. La catégorie la plus expérimentale — des herbes et épices qui ne figurent pas habituellement dans un dessert glacé. Gardez les portions petites car la saveur est intense, et accompagnez d\'un biscuit simple ou d\'un fruit frais pour le contraste.',
            },
          ],
        },
        {
          layout: 'two-col',
          markdown: `**Comment utiliser ces recettes :** chaque recette de cette page utilise le programme Italian Ice sur le Creami Deluxe. Sur le Creami Original (sans programme Italian Ice), utilisez Sorbet — la texture sera légèrement plus lisse mais restera correctement glacée. Congelez le pot rempli pendant au moins 24 heures. Si votre pot sort en morceaux ou complètement congelé, ajoutez 1 cuillère à soupe d'eau sur le dessus et faites un Re-Spin — le liquide ajouté casse la glace et permet à la lame de faire son travail.

**Choisir ses fruits :** frais ou surgelés, les deux fonctionnent, mais des fruits congelés à partir de produits de saison à pleine maturité donnent la couleur et la saveur les plus vibrantes. Évitez les fruits en conserve (trop de sirop, ça fausse les ratios) et évitez les fruits séchés (ne congèlent pas correctement). Passez la purée à travers un tamis fin avant de congeler pour enlever les pépins et les fibres — cette seule étape sépare un granité italien maison d'une version granuleuse et pleine de pépins.`,
        },
      ],
      faqs: [
        {
          question: 'Quelle est la différence entre granité italien et sorbet dans le Ninja Creami ?',
          answer: 'Le granité italien est plus glacé et plus granuleux que le sorbet — on sent les cristaux de glace sur la langue. Le sorbet est plus lisse et plus soyeux parce qu\'il contient plus de sucre (ce qui abaisse le point de congélation et donne une texture plus fine). Le granité italien utilise moins de sucre et pas de stabilisant ; le sorbet en utilise plus, parfois avec de la gomme ou de l\'amidon. Le programme Italian Ice du Creami préserve la texture cristalline ; le programme Sorbet la lisse.',
        },
        {
          question: 'Quel programme utiliser pour le granité italien dans le Ninja Creami ?',
          answer: 'Utilisez le programme "Italian Ice" sur le Creami Deluxe — il est calibré pour préserver la texture glacée et granuleuse. Sur le Creami Original (sans programme Italian Ice), utilisez Sorbet — la texture sera légèrement plus lisse mais restera plus proche d\'un vrai granité italien que la crème glacée ne le serait. Les deux fonctionnent ; le programme Italian Ice l\'emporte sur l\'authenticité de la texture.',
        },
        {
          question: 'Puis-je faire du granité italien sans sucre ?',
          answer: 'En partie — il faut une forme d\'édulcorant de volume pour éviter qu\'il ne gèle en un bloc solide de glace aromatisée. L\'allulose est le meilleur substitut du sucre pour le granité italien (il apporte du volume et empêche la congélation complète comme le sucre). Évitez la stévia pure ou le sucralose seuls — ils rendent le pot impossible à turbiner. Un mélange monk fruit + allulose à 1/3 tasse par pot fonctionne bien.',
        },
        {
          question: 'Pourquoi mon granité italien est-il trop dur ou trop glacé ?',
          answer: 'Trois causes : (1) pas assez de sucre ou d\'allulose — le fruit seul gèle comme un bloc, il faut un édulcorant pour qu\'il reste turbinable, (2) vous avez sauté le jus de citron — l\'acide abaisse légèrement le point de congélation et améliore la texture, (3) votre pot a été trop longtemps au congélateur (plus de 48 heures) — laissez-le reposer à température ambiante 5 minutes avant le turbinage, ou faites un Re-Spin avec 1 cuillère à soupe d\'eau sur le dessus.',
        },
        {
          question: 'Le granité italien est-il végan ?',
          answer: 'Oui — le granité italien traditionnel est naturellement végan. Il ne contient que du fruit, de l\'eau, du sucre et du jus de citron. Pas de produits laitiers, pas d\'œufs, aucun produit d\'origine animale. Chaque recette de granité italien sur cette page est végane par défaut. Si une recette contient de la crème ou du lait, c\'est un hybride sorbet-granité, pas un vrai granité italien, et ce sera indiqué comme tel.',
        },
        {
          question: 'Comment obtenir la couleur vive classique sans colorant alimentaire ?',
          answer: 'Utilisez des fruits à la couleur naturellement vibrante : fraises et framboises donnent du rouge profond, myrtilles du violet, mangue et pêche de l\'orange, orange sanguine un rouge-orangé naturel incroyable. Pour une couleur vraiment bleue (framboise bleue), le thé de fleur de pois papillon fonctionne — il est naturellement bleu et neutre au goût. Évitez les colorants artificiels ; ils n\'apportent aucun bénéfice gustatif et les couleurs naturelles goûtent meilleur.',
        },
      ],
    },
    es: {
      title: 'Recetas de Raspado Italiano para Ninja Creami',
      description: 'Recetas refrescantes de raspado italiano para tu Ninja Creami. Helado, afrutado e intensamente sabroso — el postre de verano perfecto con instrucciones paso a paso.',
      metaDescription: 'Recetas de raspado italiano Ninja Creami — helado, intensamente afrutado, sin lácteos. Limón, cereza, sandía. Vegano, 3 ingredientes o menos.',
      longIntroSections: [
        {
          layout: 'two-col',
          markdown: `El raspado italiano es lo más refrescante que hace el Ninja Creami. Sin lácteos, sin huevos, sin gelatina — solo fruta, agua, azúcar y jugo de limón, congelados y batidos hasta esa textura de hielo rallado icónica que recuerdas de los paseos marítimos en verano. El programa Italian Ice del Creami (o Sorbet en modelos más antiguos) está ajustado específicamente para preservar esa sensación en boca cristalina, casi granulosa, en vez de batirla hasta dejarla lisa. Cada receta de esta página usa 3 o 4 ingredientes y se bate en menos de 2 minutos.

La clave de un buen raspado italiano es la proporción agua-azúcar-fruta. Demasiada agua y sale soso y muy helado; demasiado azúcar y no congela nunca lo suficiente para batirse. El punto justo ronda 1 taza de fruta + 1 taza de agua + 1/3 taza de azúcar + 1 cucharada de jugo de limón — luego a ajustar según la fruta. Las frutas naturalmente dulces como fresa y mango piden menos azúcar; las ácidas como cereza y frambuesa piden más. Cada receta de esta página indica la proporción exacta probada para esa fruta en concreto.`,
        },
        {
          layout: 'cards',
          heading: 'Los tres estilos de raspado italiano en este sitio',
          cards: [
            {
              title: 'Sabores clásicos de paseo marítimo',
              body: 'Limón, cereza, frambuesa azul, sandía. Los colores vibrantes y sabores intensos que recuerdas de las ferias de verano y los carritos de la playa. Hechos con fruta de verdad (no sirope) para un sabor más limpio y auténtico y un color natural que no necesita colorante para parecer verano en un vasito.',
            },
            {
              title: 'Raspado italiano adulto y sofisticado',
              body: 'Naranja sanguina, fruta de la pasión, hibisco-lima, prosecco-fresa. Perfiles de sabor más adultos con jugo real, hierbas y a veces un chorrito de alcohol. Perfectos como limpiador de paladar entre platos o como postre más ligero tras una comida pesada — piénsalos como sorbetes casi salados.',
            },
            {
              title: 'Raspados con hierbas y especias',
              body: 'Albahaca-lima, romero-pomelo, jengibre-pera. La categoría más experimental — hierbas y especias que no suelen aparecer en un postre helado. Mantén raciones pequeñas porque el sabor es intenso, y acompaña con una galleta simple o fruta fresca para el contraste.',
            },
          ],
        },
        {
          layout: 'two-col',
          markdown: `**Cómo usar estas recetas:** cada receta de esta página usa el programa Italian Ice en el Creami Deluxe. En el Creami Original (sin programa Italian Ice), usa Sorbet — la textura será algo más lisa pero seguirá siendo correctamente helada. Congela el pote lleno al menos 24 horas. Si tu pote sale en trozos o completamente duro, añade 1 cucharada de agua encima y haz un Re-Spin — el líquido añadido rompe el hielo y deja que la cuchilla haga su trabajo.

**Eligiendo tu fruta:** fresca o congelada, ambas funcionan, pero fruta congelada en temporada en su punto da el color y sabor más vibrantes. Evita la fruta en conserva (demasiado sirope, altera las proporciones) y evita la fruta seca (no congela correctamente). Cuela la pulpa por un colador fino antes de congelar para quitar semillas y fibras — ese paso solo separa un raspado italiano casero de uno granuloso y lleno de pepitas.`,
        },
      ],
      faqs: [
        {
          question: '¿Cuál es la diferencia entre raspado italiano y sorbete en el Ninja Creami?',
          answer: 'El raspado italiano es más helado y granuloso que el sorbete — notas los cristales de hielo en la lengua. El sorbete es más liso y sedoso porque tiene más azúcar (lo que baja el punto de congelación y produce una textura más fina). El raspado italiano lleva menos azúcar y sin estabilizantes; el sorbete lleva más, a veces con goma o almidón. El programa Italian Ice del Creami preserva la textura cristalina; Sorbet la suaviza.',
        },
        {
          question: '¿Qué programa uso para el raspado italiano en el Ninja Creami?',
          answer: 'Usa el programa "Italian Ice" en el Creami Deluxe — está ajustado específicamente para preservar la textura helada y granulosa. En el Creami Original (sin programa Italian Ice), usa Sorbet — la textura quedará algo más lisa pero seguirá más cerca de un raspado italiano auténtico que el helado normal. Ambos funcionan; el programa Italian Ice gana en autenticidad de textura.',
        },
        {
          question: '¿Puedo hacer raspado italiano sin azúcar?',
          answer: 'En parte — necesitas alguna forma de edulcorante con volumen para que no se congele en un bloque sólido de hielo saborizado. La alulosa es el mejor sustituto del azúcar para raspado italiano (aporta volumen y evita la congelación completa igual que el azúcar). Evita la estevia pura o la sucralosa solos — dejarán el pote imposible de batir. Una mezcla monk fruit + alulosa a 1/3 de taza por pote funciona bien.',
        },
        {
          question: '¿Por qué mi raspado italiano queda demasiado duro o demasiado helado?',
          answer: 'Tres causas: (1) poca azúcar o alulosa — la fruta sola se congela como piedra, hace falta algún edulcorante para que se pueda batir, (2) te saltaste el jugo de limón — el ácido baja ligeramente el punto de congelación y mejora la textura, (3) tu pote estuvo demasiado tiempo en el congelador (más de 48 horas) — déjalo reposar a temperatura ambiente 5 minutos antes de batir, o haz un Re-Spin con 1 cucharada de agua encima.',
        },
        {
          question: '¿El raspado italiano es vegano?',
          answer: 'Sí — el raspado italiano tradicional es naturalmente vegano. Contiene solo fruta, agua, azúcar y jugo de limón. Sin lácteos, sin huevos, sin productos animales de ningún tipo. Cada receta de raspado italiano en esta página es vegana por defecto. Si alguna lleva nata o leche es un híbrido sorbete-raspado, no un raspado italiano puro, y estará etiquetada como tal.',
        },
        {
          question: '¿Cómo consigo ese color brillante clásico sin colorantes?',
          answer: 'Usa fruta con color naturalmente vibrante: fresa y frambuesa dan rojo intenso, arándanos dan morado, mango y melocotón dan naranja, y naranja sanguina da un rojo-anaranjado natural increíble. Para un azul de verdad (frambuesa azul), el té de flor de guisante mariposa funciona — es naturalmente azul y neutro en sabor. Evita colorantes artificiales; no aportan beneficio al sabor y los colores naturales saben mejor.',
        },
      ],
    },
    de: {
      title: 'Italienisches Eis (Granita) — Rezepte für Ninja Creami',
      description: 'Erfrischende Italienische-Eis-Rezepte für deinen Ninja Creami. Eisig, fruchtig und intensiv im Geschmack — der perfekte Sommergenuss mit Schritt-für-Schritt-Anleitung.',
      metaDescription: 'Ninja Creami Granita-Rezepte — eisig, intensiv fruchtig, milchfrei. Zitrone, Kirsche, Wassermelone. Vegan, natürlich süß, 3 Zutaten oder weniger.',
      longIntroSections: [
        {
          layout: 'two-col',
          markdown: `Italienisches Eis ist das Erfrischendste, was der Ninja Creami macht. Keine Milchprodukte, keine Eier, keine Gelatine — nur Frucht, Wasser, Zucker und Zitronensaft, eingefroren und zu dieser ikonischen, gehobelten Eistextur gespinnt, die du von Sommerpromenaden kennst. Das Italian-Ice-Programm des Creami (oder Sorbet bei älteren Modellen) ist speziell darauf abgestimmt, dieses kristalline, fast körnige Mundgefühl zu bewahren, statt alles glatt aufzuschlagen. Jedes Rezept auf dieser Seite kommt mit 3 oder 4 Zutaten aus und ist in unter 2 Minuten gespinnt.

Der Schlüssel zu gutem italienischem Eis ist das Verhältnis Wasser-Zucker-Frucht. Zu viel Wasser und es wird fad und zu eisig; zu viel Zucker und es friert nie fest genug ein, um gespinnt zu werden. Der Sweet Spot liegt bei etwa 1 Tasse Frucht + 1 Tasse Wasser + 1/3 Tasse Zucker + 1 Esslöffel Zitronensaft — dann je nach Frucht anpassen. Natürlich süße Früchte wie Erdbeere und Mango brauchen weniger Zucker; saure Früchte wie Kirsche und Himbeere brauchen mehr. Jedes Rezept auf dieser Seite nennt das exakt getestete Verhältnis für diese Frucht.`,
        },
        {
          layout: 'cards',
          heading: 'Die drei Stile für italienisches Eis auf dieser Seite',
          cards: [
            {
              title: 'Klassische Strandpromenaden-Sorten',
              body: 'Zitrone, Kirsche, Blue Raspberry, Wassermelone. Die leuchtenden Farben und intensiven Aromen, die du von Sommerfesten und Promenadenwagen kennst. Hergestellt mit echter Frucht (kein Sirup) für einen reineren, wahreren Geschmack und eine natürliche Farbe, die keine Lebensmittelfarbe braucht, um nach Sommer im Becher auszusehen.',
            },
            {
              title: 'Erwachsenes italienisches Eis',
              body: 'Blutorange, Passionsfrucht, Hibiskus-Limette, Prosecco-Erdbeere. Erwachsenere Aromen mit echtem Saft, Kräutern und manchmal einem Schuss Alkohol. Perfekt als Gaumenreiniger zwischen Gängen oder als leichteres Dessert nach einem schweren Essen — stell sie dir als herzhaft-angrenzende Sorbets vor.',
            },
            {
              title: 'Kräuter- und Gewürz-Granita',
              body: 'Basilikum-Limette, Rosmarin-Grapefruit, Ingwer-Birne. Die experimentellste Kategorie — Kräuter und Gewürze, die in gefrorenen Desserts sonst nicht vorkommen. Halte die Portionen klein, weil der Geschmack intensiv ist, und kombiniere mit einem einfachen Keks oder frischer Frucht als Kontrast.',
            },
          ],
        },
        {
          layout: 'two-col',
          markdown: `**So nutzt du diese Rezepte:** Jedes Rezept auf dieser Seite nutzt das Italian-Ice-Programm am Creami Deluxe. Am Creami Original (ohne Italian-Ice-Programm) nutze Sorbet — die Textur wird etwas glatter, bleibt aber korrekt eisig. Friere das gefüllte Pint mindestens 24 Stunden ein. Wenn dein Pint klumpig oder komplett hart eingefroren herauskommt, gib 1 Esslöffel Wasser oben drauf und mache einen Re-Spin — die zusätzliche Flüssigkeit bricht das Eis und lässt die Klinge ihre Arbeit tun.

**Die richtige Frucht wählen:** Frisch oder gefroren, beides funktioniert, aber aus frischer Saisonware eingefrorene Frucht liefert die lebendigste Farbe und den kräftigsten Geschmack. Meide Dosenobst (zu viel Sirup verfälscht die Verhältnisse) und meide Trockenobst (friert nicht richtig ein). Streiche das Püree vor dem Einfrieren durch ein feines Sieb, um Kerne und Fasern zu entfernen — dieser eine Schritt trennt ein selbstgemachtes italienisches Eis von einem griesigen, kernreichen.`,
        },
      ],
      faqs: [
        {
          question: 'Was ist der Unterschied zwischen italienischem Eis (Granita) und Sorbet im Ninja Creami?',
          answer: 'Italienisches Eis ist eisiger und körniger als Sorbet — du spürst einzelne Eiskristalle auf der Zunge. Sorbet ist glatter und seidiger, weil es mehr Zucker enthält (das senkt den Gefrierpunkt und erzeugt eine feinere Textur). Italienisches Eis nutzt weniger Zucker und keine Stabilisatoren; Sorbet mehr Zucker und manchmal Gummi oder Stärke. Das Italian-Ice-Programm des Creami bewahrt die kristalline Textur; das Sorbet-Programm glättet sie.',
        },
        {
          question: 'Welches Programm nutze ich für italienisches Eis im Ninja Creami?',
          answer: 'Nutze das "Italian Ice"-Programm am Creami Deluxe — es ist speziell darauf abgestimmt, die eisige, körnige Textur zu bewahren. Am Creami Original (ohne Italian-Ice-Programm) nutze Sorbet — die Textur wird etwas glatter, bleibt aber näher an einem echten italienischen Eis als normales Eis. Beides funktioniert; das Italian-Ice-Programm gewinnt bei der Textur-Authentizität.',
        },
        {
          question: 'Kann ich italienisches Eis ohne Zucker machen?',
          answer: 'Teilweise — du brauchst eine Art volumengebenden Süßstoff, damit es nicht zu einem harten Block aromatisierten Eises gefriert. Allulose ist der beste Zuckerersatz für italienisches Eis (sie gibt Volumen und verhindert das komplette Durchfrieren genau wie Zucker). Meide reines Stevia oder Sucralose als einziges Süßungsmittel — damit wird das Pint nicht spinnbar. Eine Mönchsfrucht-Allulose-Mischung mit 1/3 Tasse pro Pint funktioniert gut.',
        },
        {
          question: 'Warum ist mein italienisches Eis zu fest oder zu eisig?',
          answer: 'Drei Ursachen: (1) nicht genug Zucker oder Allulose — Frucht allein friert zu einem Block, du brauchst Süßungsmittel für die Spinnbarkeit, (2) du hast den Zitronensaft weggelassen — Säure senkt den Gefrierpunkt leicht und verbessert die Textur, (3) dein Pint war zu lange gefroren (über 48 Stunden) — lass es 5 Minuten bei Raumtemperatur stehen oder mache einen Re-Spin mit 1 Esslöffel Wasser oben drauf.',
        },
        {
          question: 'Ist italienisches Eis vegan?',
          answer: 'Ja — traditionelles italienisches Eis ist von Natur aus vegan. Es enthält nur Frucht, Wasser, Zucker und Zitronensaft. Keine Milchprodukte, keine Eier, keine tierischen Zutaten. Jedes Italian-Ice-Rezept auf dieser Seite ist standardmäßig vegan. Wenn ein Rezept Sahne oder Milch enthält, ist es ein Sorbet-Granita-Hybrid, kein echtes italienisches Eis, und wird entsprechend gekennzeichnet.',
        },
        {
          question: 'Wie bekomme ich diese klassisch leuchtende Farbe ohne Lebensmittelfarbe?',
          answer: 'Nutze Früchte mit natürlich kräftiger Farbe: Erdbeeren und Himbeeren geben sattes Rot, Blaubeeren Violett, Mango und Pfirsich Orange, Blutorange ein unglaubliches natürliches Rot-Orange. Für echtes Blau (Blue Raspberry) funktioniert Schmetterlingserbsen-Blütentee — er ist von Natur aus blau und geschmacksneutral. Meide künstliche Lebensmittelfarben; sie bringen keinen Geschmacksvorteil und die natürlichen Farben schmecken besser.',
        },
      ],
    },
    pt: {
      title: 'Receitas de Raspadinha Italiana para Ninja Creami',
      description: 'Receitas refrescantes de raspadinha italiana para seu Ninja Creami. Gelada, frutada e intensamente saborosa — a sobremesa de verão perfeita com instruções passo a passo.',
      metaDescription: 'Receitas de raspadinha italiana Ninja Creami — gelada, intensamente frutada, sem lactose. Limão, cereja, melancia. Vegana, 3 ingredientes ou menos.',
      longIntroSections: [
        {
          layout: 'two-col',
          markdown: `A raspadinha italiana é o que o Ninja Creami faz de mais refrescante. Sem laticínios, sem ovos, sem gelatina — só fruta, água, açúcar e suco de limão, congelados e batidos naquela textura icônica de gelo raspado que você lembra dos calçadões de verão. O programa Italian Ice do Creami (ou Sorbet em modelos mais antigos) é ajustado especificamente para preservar essa sensação cristalina, quase granulada, em vez de bater tudo até ficar liso. Cada receita desta página usa 3 ou 4 ingredientes e fica pronta em menos de 2 minutos.

O segredo de uma boa raspadinha italiana é a proporção água-açúcar-fruta. Água demais e ela sai sem graça e gelada demais; açúcar demais e nunca congela firme o bastante para bater. O ponto certo gira em torno de 1 xícara de fruta + 1 xícara de água + 1/3 xícara de açúcar + 1 colher de sopa de suco de limão — depois ajuste por fruta. Frutas naturalmente doces como morango e manga pedem menos açúcar; frutas ácidas como cereja e framboesa pedem mais. Cada receita desta página lista a proporção exata testada para aquela fruta específica.`,
        },
        {
          layout: 'cards',
          heading: 'Os três estilos de raspadinha italiana neste site',
          cards: [
            {
              title: 'Sabores clássicos de calçadão',
              body: 'Limão, cereja, framboesa azul, melancia. As cores vibrantes e sabores intensos que você lembra de festas de verão e carrinhos de calçadão. Feitos com fruta de verdade (não xarope) para um sabor mais limpo e autêntico e uma cor natural que não precisa de corante para parecer verão num copinho.',
            },
            {
              title: 'Raspadinha italiana para adultos',
              body: 'Laranja-sanguínea, maracujá, hibisco-lima, prosecco-morango. Perfis de sabor mais adultos usando suco de verdade, ervas e às vezes um toque de álcool. Perfeitos como limpa-paladar entre pratos ou como sobremesa mais leve depois de uma refeição pesada — pense neles como sorbets quase salgados.',
            },
            {
              title: 'Raspadinhas com ervas e especiarias',
              body: 'Manjericão-lima, alecrim-toranja, gengibre-pera. A categoria mais experimental — ervas e especiarias que normalmente não aparecem numa sobremesa gelada. Mantenha as porções pequenas porque o sabor é intenso, e acompanhe com um biscoito simples ou fruta fresca para contraste.',
            },
          ],
        },
        {
          layout: 'two-col',
          markdown: `**Como usar essas receitas:** cada receita desta página usa o programa Italian Ice no Creami Deluxe. No Creami Original (sem programa Italian Ice), use Sorbet — a textura ficará um pouco mais lisa mas ainda corretamente gelada. Congele o pote cheio por no mínimo 24 horas. Se seu pote sair em pedaços ou completamente congelado duro, adicione 1 colher de sopa de água por cima e faça um Re-Spin — o líquido adicionado quebra o gelo e deixa a lâmina fazer o trabalho.

**Escolhendo a fruta:** fresca ou congelada, ambas funcionam, mas fruta congelada na estação, no ponto, dá a cor e o sabor mais vibrantes. Evite fruta em calda (xarope demais, altera as proporções) e evite fruta seca (não congela corretamente). Coe o purê numa peneira fina antes de congelar para tirar sementes e fibras — esse único passo separa uma raspadinha italiana caseira de uma granulada e cheia de sementes.`,
        },
      ],
      faqs: [
        {
          question: 'Qual a diferença entre raspadinha italiana e sorbet no Ninja Creami?',
          answer: 'A raspadinha italiana é mais gelada e granulada que o sorbet — você sente os cristais de gelo na língua. O sorbet é mais liso e sedoso porque tem mais açúcar (o que baixa o ponto de congelamento e produz uma textura mais fina). A raspadinha italiana leva menos açúcar e sem estabilizantes; o sorbet leva mais, às vezes com goma ou amido. O programa Italian Ice do Creami preserva a textura cristalina; o Sorbet suaviza.',
        },
        {
          question: 'Qual programa uso para raspadinha italiana no Ninja Creami?',
          answer: 'Use o programa "Italian Ice" no Creami Deluxe — ele é ajustado especificamente para preservar a textura gelada e granulada. No Creami Original (sem programa Italian Ice), use Sorbet — a textura ficará um pouco mais lisa mas ainda mais próxima de uma raspadinha italiana autêntica do que o sorvete normal. Ambos funcionam; o programa Italian Ice ganha em autenticidade de textura.',
        },
        {
          question: 'Posso fazer raspadinha italiana sem açúcar?',
          answer: 'Parcialmente — você precisa de alguma forma de adoçante com volume para evitar que congele em um bloco sólido de gelo com sabor. A alulose é o melhor substituto de açúcar para raspadinha italiana (dá volume e evita o congelamento total do mesmo jeito que o açúcar). Evite estévia pura ou sucralose sozinhos — deixam o pote impossível de bater. Uma mistura de monk fruit + alulose a 1/3 de xícara por pote funciona bem.',
        },
        {
          question: 'Por que minha raspadinha italiana ficou dura demais ou gelada demais?',
          answer: 'Três causas: (1) pouco açúcar ou alulose — fruta sozinha congela como pedra, precisa de algum adoçante para continuar bate-avel, (2) você pulou o suco de limão — o ácido baixa levemente o ponto de congelamento e melhora a textura, (3) seu pote ficou tempo demais no freezer (mais de 48 horas) — deixe descansar em temperatura ambiente por 5 minutos antes de bater, ou faça um Re-Spin com 1 colher de sopa de água por cima.',
        },
        {
          question: 'Raspadinha italiana é vegana?',
          answer: 'Sim — a raspadinha italiana tradicional é naturalmente vegana. Contém só fruta, água, açúcar e suco de limão. Sem laticínios, sem ovos, sem produtos de origem animal. Cada receita de raspadinha italiana desta página é vegana por padrão. Se alguma incluir creme de leite ou leite, é um híbrido sorbet-raspadinha, não uma raspadinha italiana pura, e será rotulada como tal.',
        },
        {
          question: 'Como consigo aquela cor vibrante clássica sem corante?',
          answer: 'Use fruta com cor naturalmente vibrante: morango e framboesa dão vermelho intenso, mirtilo dá roxo, manga e pêssego dão laranja, e laranja-sanguínea dá um vermelho-alaranjado natural incrível. Para um azul de verdade (framboesa azul), o chá de flor de ervilha-borboleta funciona — é naturalmente azul e de sabor neutro. Evite corantes artificiais; não trazem benefício de sabor e as cores naturais têm gosto melhor.',
        },
      ],
    },
  },
  'soft-serve': {
    en: {
      title: 'Soft Serve Recipes for Ninja Creami',
      description: 'Smooth, swirly soft serve recipes for your Ninja Creami. Classic vanilla to creative flavors, dispensed perfectly from your Creami\'s soft serve function — all with step-by-step instructions.',
      metaDescription: 'Ninja Creami soft serve recipes — instant, swirly, no scoop needed. Vanilla, chocolate, mango, matcha and more. Uses the Deluxe Soft Serve function.',
      longIntroSections: [
        {
          layout: 'two-col',
          markdown: `Soft serve is what the Deluxe Creami was built for. The Soft-Serve program on the Deluxe doesn\'t just spin the frozen pint — it aerates it into that signature cloud-light, pillowy texture you remember from the ice cream truck and the mall machine. Every recipe on this page has been tuned for that program: the exact base ratios, the freeze time, and the dispensing tricks that get you a perfect swirl on the first try.

The trick with soft serve is the base. Soft-serve bases are slightly different from regular ice cream bases — they need a stabilizer that keeps the structure airy rather than dense. Most of our recipes use a tablespoon or two of instant pudding mix for this, which is the single biggest texture unlock. Skip it and you get something closer to melted ice cream; add it and the pint holds its shape even after the spin.`,
        },
        {
          layout: 'cards',
          heading: 'The three soft serve styles on this site',
          cards: [
            {
              title: 'Classic mall-machine flavors',
              body: 'Vanilla, chocolate, strawberry, coffee. The recipes that nail the nostalgic swirl — sweet, airy, and cloud-light. Start here if you just bought the Deluxe and want to test the Soft-Serve program.',
            },
            {
              title: 'Protein soft serve',
              body: 'Protein powder + milk + instant pudding mix. A lower-calorie, high-protein take on soft serve that still swirls beautifully. Especially good as a post-workout dessert or a macro-friendly sweet treat.',
            },
            {
              title: 'Fruit soft serve',
              body: 'Mango, strawberry, passion fruit. Lighter and less creamy, closer to a soft-serve-meets-sorbet. Great for summer when you want something fresh rather than rich.',
            },
          ],
        },
        {
          layout: 'two-col',
          markdown: `**How to use these recipes:** every recipe specifies the exact Soft-Serve program cycle (usually just one pass — no Re-Spin needed for soft serve), freeze time (24 hours), and which stabilizer works best. You\'ll see two techniques for dispensing: the built-in Soft-Serve Dispenser if you have the Deluxe accessory, and the spatula-and-swirl trick for anyone without it.

**Don\'t have the Deluxe?** Most of these recipes also work on the Original Creami using the Ice Cream program followed by the Mix-In program — you won\'t get the perfect swirl dispensing, but the flavor and texture are essentially the same. We note which recipes work best on Original vs. Deluxe on each page.`,
        },
      ],
      faqs: [
        {
          question: 'What\'s the difference between soft serve and regular ice cream in the Creami?',
          answer: 'Soft serve is aerated and lighter, with a cloud-like pillowy texture; regular ice cream is dense and scoopable. The Deluxe Creami\'s Soft-Serve program incorporates more air into the pint as it spins, using a slightly different blade action and speed than the Ice Cream program. The base also matters — soft serve recipes typically include a stabilizer like instant pudding mix to hold that airy structure.',
        },
        {
          question: 'Can I make soft serve on the Original Creami (not Deluxe)?',
          answer: 'Not true soft serve dispensing — the Soft-Serve program is a Deluxe-only feature. But you can get close: use the Ice Cream program, then the Mix-In program on a slightly under-frozen pint (22 hours instead of 24). The flavor and texture will be nearly identical; you just won\'t get the swirl dispenser.',
        },
        {
          question: 'Why does my Ninja Creami soft serve melt too fast?',
          answer: 'Usually the base is too liquid or missing a stabilizer. Soft-serve bases benefit from 1–2 tablespoons of instant vanilla pudding mix, which traps air and slows melting. Also make sure your pint is fully frozen for 24 hours and your freezer is at 0°F (-18°C) or colder. A warm freezer gives you a melty soft serve even with a perfect recipe.',
        },
        {
          question: 'Is instant pudding mix necessary for soft serve?',
          answer: 'Not technically — you can make soft serve with just cream, milk, and sugar — but the pudding mix is the single biggest texture upgrade. It keeps the pint airy, holds the swirl longer, and produces that "melt-in-your-mouth" mouthfeel. For a pudding-free version, replace with 1 teaspoon of cornstarch whisked into warm milk.',
        },
        {
          question: 'Which program do I use for soft serve on the Deluxe Creami?',
          answer: 'The "Soft-Serve" program. It runs a single cycle at higher aeration than Ice Cream, producing the signature light, cloud-like texture. No Re-Spin is needed — one pass is the correct amount. If you spin it twice, it loses the air and becomes more like ice cream.',
        },
        {
          question: 'How many servings does a Ninja Creami soft serve pint make?',
          answer: 'Because soft serve is aerated, a 16oz pint gives you 4–5 medium servings (slightly more than ice cream since the volume expands). The 24oz Deluxe XL pint gives 6–7 servings. Each recipe lists servings and macros.',
        },
      ],
    },
    fr: {
      title: 'Recettes de Soft Serve pour Ninja Creami',
      description: 'Recettes de soft serve onctueuses pour votre Ninja Creami. De la vanille classique aux saveurs créatives, parfaitement distribuées avec la fonction soft serve — instructions étape par étape.',
      metaDescription: 'Recettes de soft serve Ninja Creami — instantané, onctueux, sans cuillère. Vanille, chocolat, mangue, matcha. Utilise la fonction Soft Serve du Deluxe.',
      longIntroSections: [
        {
          layout: 'two-col',
          markdown: `Le soft serve, c\'est pour ça que le Creami Deluxe a été conçu. Le programme Soft-Serve du Deluxe ne se contente pas de turbiner le pot congelé — il l\'aère pour lui donner cette texture légère comme un nuage, aérienne, que vous connaissez du camion à glace et de la machine du centre commercial. Chaque recette de cette page a été réglée pour ce programme : les ratios exacts de la base, le temps de congélation et les astuces de distribution pour obtenir une spirale parfaite du premier coup.

La clé du soft serve, c\'est la base. Les bases de soft serve sont légèrement différentes des bases de crème glacée classique — elles ont besoin d\'un stabilisateur qui maintient la structure aérienne plutôt que dense. La plupart de nos recettes utilisent une ou deux cuillères à soupe de préparation pour pudding instantané pour cela, et c\'est le plus gros levier de texture. Sans, vous obtenez quelque chose proche d\'une glace fondue ; avec, le pot garde sa forme même après le turbinage.`,
        },
        {
          layout: 'cards',
          heading: 'Les trois styles de soft serve sur ce site',
          cards: [
            {
              title: 'Saveurs classiques de la machine du mall',
              body: 'Vanille, chocolat, fraise, café. Les recettes qui reproduisent cette spirale nostalgique — sucrée, aérienne, légère comme un nuage. Commencez ici si vous venez d\'acheter le Deluxe et voulez tester le programme Soft-Serve.',
            },
            {
              title: 'Soft serve protéiné',
              body: 'Poudre de protéine + lait + préparation pour pudding instantané. Une version plus légère et riche en protéines qui garde une belle spirale. Parfaite comme dessert post-entraînement ou gourmandise adaptée aux macros.',
            },
            {
              title: 'Soft serve aux fruits',
              body: 'Mangue, fraise, fruit de la passion. Plus léger et moins crémeux, proche du soft-serve-rencontre-sorbet. Idéal en été quand on veut quelque chose de frais plutôt que riche.',
            },
          ],
        },
        {
          layout: 'two-col',
          markdown: `**Comment utiliser ces recettes :** chaque recette précise le cycle exact du programme Soft-Serve (généralement une seule passe — pas besoin de Re-Spin pour le soft serve), le temps de congélation (24 heures) et quel stabilisateur fonctionne le mieux. Vous verrez deux techniques de distribution : le distributeur Soft-Serve intégré si vous avez l\'accessoire Deluxe, et l\'astuce spatule-et-spirale pour ceux qui ne l\'ont pas.

**Vous n\'avez pas le Deluxe ?** La plupart de ces recettes fonctionnent aussi sur l\'Original Creami avec le programme Ice Cream suivi du programme Mix-In — vous n\'aurez pas la distribution en spirale parfaite, mais la saveur et la texture sont essentiellement les mêmes. Nous indiquons sur chaque page quelles recettes fonctionnent le mieux sur Original vs. Deluxe.`,
        },
      ],
      faqs: [
        {
          question: 'Quelle est la différence entre soft serve et crème glacée classique avec le Creami ?',
          answer: 'Le soft serve est aéré et plus léger, avec une texture façon nuage ; la crème glacée classique est dense et à la cuillère. Le programme Soft-Serve du Creami Deluxe incorpore plus d\'air dans le pot lors du turbinage, avec une action de lame et une vitesse légèrement différentes du programme Ice Cream. La base compte aussi — les recettes de soft serve incluent généralement un stabilisateur comme la préparation pour pudding instantané pour maintenir cette structure aérienne.',
        },
        {
          question: 'Puis-je faire du soft serve sur le Creami Original (pas Deluxe) ?',
          answer: 'Pas de vraie distribution soft serve — le programme Soft-Serve est exclusif au Deluxe. Mais vous pouvez vous en approcher : utilisez le programme Ice Cream, puis Mix-In sur un pot légèrement sous-congelé (22 heures au lieu de 24). La saveur et la texture seront presque identiques ; vous n\'aurez simplement pas le distributeur en spirale.',
        },
        {
          question: 'Pourquoi mon soft serve Ninja Creami fond-il trop vite ?',
          answer: 'En général la base est trop liquide ou manque de stabilisateur. Les bases de soft serve bénéficient de 1 à 2 cuillères à soupe de préparation pour pudding vanille instantané, qui piège l\'air et ralentit la fonte. Assurez-vous aussi que votre pot est bien congelé 24 heures et que votre congélateur est à -18°C ou plus froid. Un congélateur tiède donne un soft serve qui fond même avec une recette parfaite.',
        },
        {
          question: 'La préparation pour pudding instantané est-elle nécessaire pour le soft serve ?',
          answer: 'Techniquement non — vous pouvez faire du soft serve avec juste crème, lait et sucre — mais la préparation pour pudding est la plus grosse amélioration de texture. Elle garde le pot aérien, tient la spirale plus longtemps et produit cette sensation fondante en bouche. Pour une version sans pudding, remplacez par 1 cuillère à café de maïzena fouettée dans du lait tiède.',
        },
        {
          question: 'Quel programme utiliser pour le soft serve sur le Creami Deluxe ?',
          answer: 'Le programme "Soft-Serve". Il exécute un seul cycle avec plus d\'aération que Ice Cream, produisant cette texture légère et nuageuse caractéristique. Pas besoin de Re-Spin — une passe est la bonne quantité. Si vous le turbinez deux fois, il perd son air et se rapproche de la crème glacée.',
        },
        {
          question: 'Combien de portions donne un pot de soft serve Ninja Creami ?',
          answer: 'Comme le soft serve est aéré, un pot de 16oz donne 4–5 portions moyennes (un peu plus que la crème glacée car le volume augmente). Le pot Deluxe XL de 24oz donne 6–7 portions. Chaque recette indique les portions et les macros.',
        },
      ],
    },
    es: {
      title: 'Recetas de Soft Serve para Ninja Creami',
      description: 'Recetas de soft serve suaves y cremosas para tu Ninja Creami. Desde vainilla clásica hasta sabores creativos, servidas perfectamente con la función soft serve — instrucciones paso a paso.',
      metaDescription: 'Recetas de soft serve Ninja Creami — instantáneo, cremoso, sin cuchara. Vainilla, chocolate, mango, matcha. Usa la función Soft Serve del Deluxe.',
      longIntroSections: [
        {
          layout: 'two-col',
          markdown: `El soft serve es para lo que se diseñó el Creami Deluxe. El programa Soft-Serve del Deluxe no solo gira el pote congelado — lo airea hasta esa textura característica ligera como una nube que recuerdas del camión de helados y de la máquina del centro comercial. Cada receta de esta página está afinada para ese programa: las proporciones exactas de la base, el tiempo de congelado y los trucos de servido para conseguir una espiral perfecta a la primera.

El truco del soft serve está en la base. Las bases de soft serve son algo distintas a las de helado normal — necesitan un estabilizante que mantenga la estructura aireada en lugar de densa. La mayoría de nuestras recetas usan una o dos cucharadas de mezcla de pudín instantáneo para esto, que es la mayor mejora de textura que existe. Sin eso quedas con algo cercano a helado derretido; con eso el pote mantiene su forma incluso después del giro.`,
        },
        {
          layout: 'cards',
          heading: 'Los tres estilos de soft serve en este sitio',
          cards: [
            {
              title: 'Sabores clásicos de máquina de centro comercial',
              body: 'Vainilla, chocolate, fresa, café. Las recetas que clavan la espiral nostálgica — dulce, aireada, ligera como una nube. Empieza aquí si acabas de comprar el Deluxe y quieres probar el programa Soft-Serve.',
            },
            {
              title: 'Soft serve proteico',
              body: 'Proteína en polvo + leche + mezcla de pudín instantáneo. Una versión más ligera y alta en proteína del soft serve que aún gira en una espiral preciosa. Excelente como postre post-entreno o capricho dulce adaptado a las macros.',
            },
            {
              title: 'Soft serve de fruta',
              body: 'Mango, fresa, maracuyá. Más ligero y menos cremoso, cercano al soft-serve-con-sorbete. Perfecto para el verano cuando quieres algo fresco en lugar de denso.',
            },
          ],
        },
        {
          layout: 'two-col',
          markdown: `**Cómo usar estas recetas:** cada receta especifica el ciclo exacto del programa Soft-Serve (normalmente una sola pasada — no hace falta Re-Spin para soft serve), tiempo de congelado (24 horas) y qué estabilizante funciona mejor. Verás dos técnicas de servido: el dispensador Soft-Serve integrado si tienes el accesorio Deluxe, y el truco de espátula-y-espiral para quien no lo tenga.

**¿No tienes el Deluxe?** La mayoría de estas recetas también funcionan en el Original Creami usando el programa Ice Cream seguido de Mix-In — no conseguirás el dispensado en espiral perfecto, pero el sabor y la textura son prácticamente iguales. Indicamos en cada página qué recetas funcionan mejor en Original vs. Deluxe.`,
        },
      ],
      faqs: [
        {
          question: '¿Cuál es la diferencia entre soft serve y helado normal en el Creami?',
          answer: 'El soft serve es aireado y más ligero, con textura tipo nube; el helado normal es denso y para cuchara. El programa Soft-Serve del Creami Deluxe incorpora más aire al pote durante el giro, con una acción y velocidad de cuchilla algo distinta al programa Ice Cream. La base también importa — las recetas de soft serve suelen incluir un estabilizante como la mezcla de pudín instantáneo para mantener esa estructura aireada.',
        },
        {
          question: '¿Puedo hacer soft serve en el Creami Original (no Deluxe)?',
          answer: 'No un servido soft serve real — el programa Soft-Serve es exclusivo del Deluxe. Pero puedes acercarte: usa el programa Ice Cream, luego Mix-In en un pote algo menos congelado (22 horas en vez de 24). El sabor y la textura serán casi idénticos; simplemente no tendrás el dispensador en espiral.',
        },
        {
          question: '¿Por qué mi soft serve Ninja Creami se derrite demasiado rápido?',
          answer: 'Normalmente la base está muy líquida o le falta estabilizante. Las bases de soft serve se benefician de 1–2 cucharadas de mezcla de pudín de vainilla instantáneo, que atrapa aire y ralentiza el derretimiento. Asegúrate también de que el pote esté bien congelado 24 horas y tu congelador a -18°C o más frío. Un congelador templado da soft serve que se derrite incluso con receta perfecta.',
        },
        {
          question: '¿Es necesaria la mezcla de pudín instantáneo para el soft serve?',
          answer: 'Técnicamente no — puedes hacer soft serve con solo nata, leche y azúcar — pero la mezcla de pudín es la mayor mejora de textura posible. Mantiene el pote aireado, sostiene la espiral más tiempo y produce esa sensación de derretirse en la boca. Para una versión sin pudín, sustitúyela por 1 cucharadita de maicena batida en leche templada.',
        },
        {
          question: '¿Qué programa uso para soft serve en el Creami Deluxe?',
          answer: 'El programa "Soft-Serve". Ejecuta un único ciclo con mayor aireación que Ice Cream, produciendo esa textura ligera y tipo nube característica. No hace falta Re-Spin — una pasada es la cantidad correcta. Si lo giras dos veces, pierde el aire y se acerca más al helado.',
        },
        {
          question: '¿Cuántas porciones da un pote de soft serve Ninja Creami?',
          answer: 'Como el soft serve es aireado, un pote de 16oz da 4–5 porciones medianas (algo más que el helado porque el volumen aumenta). El pote Deluxe XL de 24oz da 6–7 porciones. Cada receta indica porciones y macros.',
        },
      ],
    },
    de: {
      title: 'Softeis-Rezepte für Ninja Creami',
      description: 'Glatte, cremige Softeis-Rezepte für deinen Ninja Creami. Von klassischer Vanille bis zu kreativen Geschmacksrichtungen — perfekt mit der Soft-Serve-Funktion — Schritt-für-Schritt-Anleitung.',
      metaDescription: 'Ninja Creami Softeis-Rezepte — sofort, cremig, ohne Löffel. Vanille, Schokolade, Mango, Matcha. Nutzt die Soft-Serve-Funktion des Deluxe.',
      longIntroSections: [
        {
          layout: 'two-col',
          markdown: `Softeis ist das, wofür der Creami Deluxe gebaut wurde. Das Soft-Serve-Programm am Deluxe verarbeitet das gefrorene Pint nicht einfach nur — es belüftet es in diese charakteristische, wolkenleichte, kissenweiche Textur, die du vom Eiswagen und der Mall-Maschine kennst. Jedes Rezept auf dieser Seite ist auf dieses Programm abgestimmt: die exakten Basis-Verhältnisse, die Gefrierzeit und die Dispenser-Tricks, die dir beim ersten Versuch einen perfekten Swirl liefern.

Der Schlüssel beim Softeis ist die Basis. Softeis-Basen unterscheiden sich leicht von klassischen Eisbasen — sie brauchen einen Stabilisator, der die Struktur luftig statt dicht hält. Die meisten unserer Rezepte nutzen dafür einen bis zwei Esslöffel Instant-Puddingpulver, und das ist der größte Textur-Hebel überhaupt. Ohne bekommst du etwas Ähnliches wie geschmolzenes Eis; mit hält das Pint seine Form sogar nach dem Dreh.`,
        },
        {
          layout: 'cards',
          heading: 'Die drei Softeis-Stile auf dieser Seite',
          cards: [
            {
              title: 'Klassische Mall-Maschinen-Sorten',
              body: 'Vanille, Schokolade, Erdbeere, Kaffee. Die Rezepte, die den nostalgischen Swirl treffen — süß, luftig und wolkenleicht. Starte hier, wenn du gerade den Deluxe gekauft hast und das Soft-Serve-Programm testen willst.',
            },
            {
              title: 'Protein-Softeis',
              body: 'Proteinpulver + Milch + Instant-Pudding. Eine kalorienärmere, proteinreiche Variante von Softeis, die trotzdem schön swirlt. Besonders gut als Dessert nach dem Training oder als makro-freundliche Süßigkeit.',
            },
            {
              title: 'Frucht-Softeis',
              body: 'Mango, Erdbeere, Passionsfrucht. Leichter und weniger cremig, näher an Softeis-trifft-Sorbet. Ideal im Sommer, wenn du etwas Frisches statt Gehaltvolles willst.',
            },
          ],
        },
        {
          layout: 'two-col',
          markdown: `**So nutzt du diese Rezepte:** Jedes Rezept gibt den exakten Soft-Serve-Zyklus an (normalerweise nur ein Durchgang — kein Re-Spin nötig), die Gefrierzeit (24 Stunden) und welcher Stabilisator am besten funktioniert. Du siehst zwei Dispenser-Techniken: den eingebauten Soft-Serve-Dispenser, falls du das Deluxe-Zubehör hast, und den Spatel-und-Swirl-Trick für alle, die ihn nicht haben.

**Hast du nicht den Deluxe?** Die meisten dieser Rezepte funktionieren auch auf dem Original Creami mit dem Ice-Cream-Programm gefolgt vom Mix-In-Programm — du bekommst nicht den perfekten Swirl-Dispens, aber Geschmack und Textur sind im Grunde gleich. Wir markieren auf jeder Seite, welche Rezepte am besten auf Original vs. Deluxe laufen.`,
        },
      ],
      faqs: [
        {
          question: 'Was ist der Unterschied zwischen Softeis und normalem Eis im Creami?',
          answer: 'Softeis ist belüftet und leichter, mit wolkenartiger, kissenweicher Textur; normales Eis ist dicht und löffelbar. Das Soft-Serve-Programm des Creami Deluxe bringt beim Dreh mehr Luft ins Pint, mit leicht anderer Klingenaktion und Geschwindigkeit als das Ice-Cream-Programm. Auch die Basis zählt — Softeis-Rezepte enthalten typischerweise einen Stabilisator wie Instant-Puddingpulver, um diese luftige Struktur zu halten.',
        },
        {
          question: 'Kann ich Softeis auf dem Original Creami (nicht Deluxe) machen?',
          answer: 'Kein echtes Softeis-Dispensing — das Soft-Serve-Programm ist Deluxe-exklusiv. Aber du kommst nah ran: Nutze das Ice-Cream-Programm, dann Mix-In auf einem etwas zu kurz eingefrorenen Pint (22 Stunden statt 24). Geschmack und Textur sind fast identisch; dir fehlt nur der Swirl-Dispenser.',
        },
        {
          question: 'Warum schmilzt mein Ninja Creami Softeis zu schnell?',
          answer: 'Meistens ist die Basis zu flüssig oder es fehlt ein Stabilisator. Softeis-Basen profitieren von 1–2 Esslöffeln Instant-Vanillepuddingpulver, das Luft einschließt und das Schmelzen verlangsamt. Stelle außerdem sicher, dass dein Pint 24 Stunden komplett gefroren ist und dein Gefrierschrank bei -18°C oder kälter steht. Ein zu warmer Gefrierschrank liefert schmelzendes Softeis selbst mit perfektem Rezept.',
        },
        {
          question: 'Ist Instant-Puddingpulver für Softeis notwendig?',
          answer: 'Technisch nicht — du kannst Softeis auch nur mit Sahne, Milch und Zucker machen — aber das Puddingpulver ist das größte Textur-Upgrade überhaupt. Es hält das Pint luftig, den Swirl länger und erzeugt dieses "Schmilzt-auf-der-Zunge"-Gefühl. Für eine puddingfreie Version ersetze es durch 1 Teelöffel Maisstärke, in warme Milch eingerührt.',
        },
        {
          question: 'Welches Programm nutze ich für Softeis auf dem Creami Deluxe?',
          answer: 'Das "Soft-Serve"-Programm. Es läuft einen einzigen Zyklus mit höherer Belüftung als Ice Cream und erzeugt die typische leichte, wolkenartige Textur. Kein Re-Spin nötig — ein Durchgang ist die richtige Menge. Drehst du zweimal, verliert es die Luft und wird mehr wie Eis.',
        },
        {
          question: 'Wie viele Portionen ergibt ein Ninja Creami Softeis-Pint?',
          answer: 'Da Softeis belüftet ist, ergibt ein 16oz-Pint 4–5 mittlere Portionen (etwas mehr als Eis, weil das Volumen wächst). Das 24oz Deluxe XL Pint ergibt 6–7 Portionen. Jedes Rezept nennt Portionen und Makros.',
        },
      ],
    },
    pt: {
      title: 'Receitas de Soft Serve para Ninja Creami',
      description: 'Receitas de soft serve suaves e cremosas para seu Ninja Creami. Da baunilha clássica a sabores criativos, servidas perfeitamente com a função soft serve — instruções passo a passo.',
      metaDescription: 'Receitas de soft serve Ninja Creami — instantâneo, cremoso, sem colher. Baunilha, chocolate, manga, matcha. Usa a função Soft Serve do Deluxe.',
      longIntroSections: [
        {
          layout: 'two-col',
          markdown: `O soft serve é para isso que o Creami Deluxe foi feito. O programa Soft-Serve do Deluxe não apenas gira o pote congelado — ele o arera até aquela textura característica, leve como uma nuvem e macia, que você lembra do caminhão de sorvete e da máquina do shopping. Cada receita desta página foi ajustada para esse programa: as proporções exatas da base, o tempo de congelamento e os truques de servir para conseguir uma espiral perfeita na primeira tentativa.

O pulo do gato no soft serve é a base. As bases de soft serve são um pouco diferentes das de sorvete comum — precisam de um estabilizante que mantenha a estrutura aerada em vez de densa. A maioria das nossas receitas usa uma ou duas colheres de sopa de mistura para pudim instantâneo para isso, e é o maior ganho de textura que existe. Sem isso, você fica com algo parecido com sorvete derretido; com isso, o pote mantém a forma mesmo após o giro.`,
        },
        {
          layout: 'cards',
          heading: 'Os três estilos de soft serve neste site',
          cards: [
            {
              title: 'Sabores clássicos de máquina de shopping',
              body: 'Baunilha, chocolate, morango, café. As receitas que acertam aquela espiral nostálgica — doce, aerada, leve como nuvem. Comece por aqui se acabou de comprar o Deluxe e quer testar o programa Soft-Serve.',
            },
            {
              title: 'Soft serve proteico',
              body: 'Whey protein + leite + mistura para pudim instantâneo. Uma versão mais leve e rica em proteína do soft serve que ainda gira em uma espiral linda. Excelente como sobremesa pós-treino ou doce macro-friendly.',
            },
            {
              title: 'Soft serve de fruta',
              body: 'Manga, morango, maracujá. Mais leve e menos cremoso, próximo do soft-serve-com-sorbete. Ótimo no verão quando você quer algo fresco em vez de rico.',
            },
          ],
        },
        {
          layout: 'two-col',
          markdown: `**Como usar estas receitas:** cada receita especifica o ciclo exato do programa Soft-Serve (geralmente apenas uma passada — não precisa de Re-Spin para soft serve), tempo de congelamento (24 horas) e qual estabilizante funciona melhor. Você verá duas técnicas para servir: o dispensador Soft-Serve integrado se você tem o acessório Deluxe, e o truque da espátula-e-espiral para quem não tem.

**Não tem o Deluxe?** A maioria dessas receitas também funciona no Original Creami usando o programa Ice Cream seguido do Mix-In — você não vai ter o servido em espiral perfeito, mas o sabor e a textura são praticamente os mesmos. Indicamos em cada página quais receitas funcionam melhor no Original vs. Deluxe.`,
        },
      ],
      faqs: [
        {
          question: 'Qual a diferença entre soft serve e sorvete comum no Creami?',
          answer: 'O soft serve é aerado e mais leve, com textura tipo nuvem; o sorvete comum é denso e para colher. O programa Soft-Serve do Creami Deluxe incorpora mais ar ao pote durante o giro, com uma ação e velocidade de lâmina um pouco diferentes do programa Ice Cream. A base também importa — receitas de soft serve geralmente incluem um estabilizante como a mistura para pudim instantâneo para manter essa estrutura aerada.',
        },
        {
          question: 'Posso fazer soft serve no Creami Original (não Deluxe)?',
          answer: 'Não com o servir soft serve real — o programa Soft-Serve é exclusivo do Deluxe. Mas você pode chegar perto: use o programa Ice Cream, depois Mix-In num pote um pouco menos congelado (22 horas em vez de 24). O sabor e a textura ficam quase idênticos; você só não terá o dispensador em espiral.',
        },
        {
          question: 'Por que meu soft serve do Ninja Creami derrete rápido demais?',
          answer: 'Normalmente a base está muito líquida ou sem estabilizante. Bases de soft serve se beneficiam de 1–2 colheres de sopa de mistura para pudim de baunilha instantâneo, que prende o ar e retarda o derretimento. Garanta também que seu pote esteja totalmente congelado por 24 horas e que seu freezer esteja a -18°C ou mais frio. Um freezer quente dá um soft serve que derrete mesmo com receita perfeita.',
        },
        {
          question: 'A mistura para pudim instantâneo é necessária no soft serve?',
          answer: 'Tecnicamente não — dá para fazer soft serve só com creme, leite e açúcar — mas a mistura para pudim é o maior upgrade de textura possível. Mantém o pote aerado, segura a espiral por mais tempo e produz aquela sensação de derreter na boca. Para uma versão sem pudim, substitua por 1 colher de chá de amido de milho dissolvido em leite morno.',
        },
        {
          question: 'Qual programa uso para soft serve no Creami Deluxe?',
          answer: 'O programa "Soft-Serve". Ele roda um único ciclo com mais aeração que o Ice Cream, produzindo aquela textura leve e tipo nuvem característica. Não precisa de Re-Spin — uma passada é a quantidade certa. Se você girar duas vezes, perde o ar e fica mais parecido com sorvete.',
        },
        {
          question: 'Quantas porções rende um pote de soft serve do Ninja Creami?',
          answer: 'Como o soft serve é aerado, um pote de 16oz rende 4–5 porções médias (um pouco mais que sorvete porque o volume aumenta). O pote Deluxe XL de 24oz rende 6–7 porções. Cada receita lista porções e macros.',
        },
      ],
    },
  },
};

/** Get translated collection metadata */
export function getCollectionMeta(slug: string, locale: Locale) {
  return COLLECTION_I18N[slug]?.[locale] ?? COLLECTION_I18N[slug]?.en ?? null;
}

/** Find a collection config by slug */
export function getCollection(slug: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}
