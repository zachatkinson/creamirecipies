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
    },
    fr: {
      title: 'Recettes de Sorbet pour Ninja Creami',
      description: 'Recettes de sorbet rafraîchissantes et sans produits laitiers pour votre Ninja Creami. Bases de fruits frais, saveurs vibrantes et desserts glacés naturellement légers — avec instructions étape par étape.',
      metaDescription: 'Recettes de sorbet Ninja Creami sans lactose — bases aux fruits frais, couleurs vibrantes, zéro crème ajoutée. Fraise classique ou cerise-balsamique gourmet.',
    },
    es: {
      title: 'Recetas de Sorbete para Ninja Creami',
      description: 'Recetas de sorbete refrescantes y sin lácteos para tu Ninja Creami. Bases de frutas frescas, sabores vibrantes y postres helados naturalmente ligeros — con instrucciones paso a paso.',
      metaDescription: 'Recetas de sorbete Ninja Creami sin lácteos — bases de fruta fresca, color vibrante, sin crema añadida. Fresa clásica y versiones gourmet como cereza-balsámico.',
    },
    de: {
      title: 'Sorbet-Rezepte für Ninja Creami',
      description: 'Erfrischende milchfreie Sorbet-Rezepte für deinen Ninja Creami. Frische Fruchtbasen, lebhafte Aromen und natürlich leichtere Eiskreationen — mit Schritt-für-Schritt-Anleitung.',
      metaDescription: 'Milchfreie Ninja Creami Sorbet-Rezepte — frische Fruchtbasen, leuchtende Farben, keine Sahne. Klassische Erdbeere bis Gourmet wie Kirsch-Balsamico.',
    },
    pt: {
      title: 'Receitas de Sorbet para Ninja Creami',
      description: 'Receitas refrescantes de sorbet sem lactose para seu Ninja Creami. Bases de frutas frescas, sabores vibrantes e sobremesas geladas naturalmente leves — com instruções passo a passo.',
      metaDescription: 'Receitas de sorbet Ninja Creami sem lactose — bases de fruta fresca, cor vibrante, zero creme adicionado. Do morango clássico ao cereja-balsâmico gourmet.',
    },
  },
  'gelato': {
    en: {
      title: 'Gelato Recipes for Ninja Creami',
      description: 'Authentic Italian-style gelato recipes for your Ninja Creami. Denser, silkier, and more intensely flavored than regular ice cream — all tested with step-by-step instructions.',
      metaDescription: 'Authentic Italian Ninja Creami gelato recipes — denser than ice cream, silkier texture, bold flavor. Pistachio, stracciatella, lemon ricotta and more.',
    },
    fr: {
      title: 'Recettes de Gelato pour Ninja Creami',
      description: 'Recettes de gelato authentiques à l\'italienne pour votre Ninja Creami. Plus dense, plus soyeux et plus intensément parfumé que la crème glacée — avec des instructions étape par étape.',
      metaDescription: 'Recettes authentiques de gelato Ninja Creami — plus dense que la glace, texture soyeuse, saveur intense. Pistache, stracciatella, ricotta-citron et plus.',
    },
    es: {
      title: 'Recetas de Gelato para Ninja Creami',
      description: 'Recetas auténticas de gelato estilo italiano para tu Ninja Creami. Más denso, más sedoso y con sabores más intensos que el helado común — con instrucciones paso a paso.',
      metaDescription: 'Recetas auténticas de gelato Ninja Creami — más denso que el helado, textura sedosa, sabor intenso. Pistacho, stracciatella, limón-ricotta y más.',
    },
    de: {
      title: 'Gelato-Rezepte für Ninja Creami',
      description: 'Authentische italienische Gelato-Rezepte für deinen Ninja Creami. Dichter, seidiger und geschmacksintensiver als normales Eis — mit Schritt-für-Schritt-Anleitung getestet.',
      metaDescription: 'Authentische italienische Ninja Creami Gelato-Rezepte — dichter als Eis, seidige Textur, intensiver Geschmack. Pistazie, Stracciatella, Zitrone-Ricotta u.v.m.',
    },
    pt: {
      title: 'Receitas de Gelato para Ninja Creami',
      description: 'Receitas autênticas de gelato estilo italiano para seu Ninja Creami. Mais denso, mais sedoso e com sabores mais intensos que sorvete comum — com instruções passo a passo.',
      metaDescription: 'Receitas autênticas de gelato Ninja Creami — mais denso que sorvete, textura sedosa, sabor intenso. Pistache, stracciatella, limão-ricota e mais.',
    },
  },
  'milkshake': {
    en: {
      title: 'Milkshake Recipes for Ninja Creami',
      description: 'Thick and creamy milkshake recipes made with your Ninja Creami. Classic flavors, indulgent mix-ins, and perfectly blended frozen drinks — all with step-by-step instructions.',
      metaDescription: 'Ninja Creami milkshake recipes — thicker, creamier, and quicker than a blender. Classic chocolate, strawberry, banana caramel plus creative mix-ins.',
    },
    fr: {
      title: 'Recettes de Milkshake pour Ninja Creami',
      description: 'Recettes de milkshakes épais et crémeux pour votre Ninja Creami. Saveurs classiques, garnitures gourmandes et boissons glacées parfaitement mixées — avec instructions étape par étape.',
      metaDescription: 'Recettes de milkshake Ninja Creami — plus épais, plus crémeux et plus rapides qu\'un blender. Chocolat, fraise, banane-caramel et mélanges créatifs.',
    },
    es: {
      title: 'Recetas de Milkshake para Ninja Creami',
      description: 'Recetas de milkshakes espesos y cremosos con tu Ninja Creami. Sabores clásicos, mezclas indulgentes y bebidas heladas perfectamente mezcladas — con instrucciones paso a paso.',
      metaDescription: 'Recetas de milkshake Ninja Creami — más espesos, cremosos y rápidos que una licuadora. Chocolate, fresa, banana-caramelo y mezclas creativas.',
    },
    de: {
      title: 'Milkshake-Rezepte für Ninja Creami',
      description: 'Dicke und cremige Milkshake-Rezepte für deinen Ninja Creami. Klassische Geschmacksrichtungen, verwöhnende Mix-ins und perfekt gemixte Eisgetränke — mit Schritt-für-Schritt-Anleitung.',
      metaDescription: 'Ninja Creami Milkshake-Rezepte — dicker, cremiger und schneller als jeder Mixer. Schokolade, Erdbeere, Banane-Karamell und kreative Mix-ins.',
    },
    pt: {
      title: 'Receitas de Milkshake para Ninja Creami',
      description: 'Receitas de milkshakes espessos e cremosos com seu Ninja Creami. Sabores clássicos, combinações indulgentes e bebidas geladas perfeitamente batidas — com instruções passo a passo.',
      metaDescription: 'Receitas de milkshake Ninja Creami — mais espessos, cremosos e rápidos que um liquidificador. Chocolate, morango, banana-caramelo e combinações criativas.',
    },
  },
  'smoothie-bowl': {
    en: {
      title: 'Smoothie Bowl Recipes for Ninja Creami',
      description: 'Thick, scoopable smoothie bowl recipes for your Ninja Creami. Frozen fruit bases, nutritious toppings, and beautiful breakfast bowls — all with step-by-step instructions.',
      metaDescription: 'Ninja Creami smoothie bowl recipes — thick enough to scoop, topped like a café. Açaí, berry-protein, tropical mango. Packed with fruit, no ice shards.',
    },
    fr: {
      title: 'Recettes de Smoothie Bowl pour Ninja Creami',
      description: 'Recettes de smoothie bowls épais et crémeux pour votre Ninja Creami. Bases de fruits surgelés, garnitures nutritives et bols petit-déjeuner colorés — avec instructions étape par étape.',
      metaDescription: 'Recettes de smoothie bowl Ninja Creami — assez épais pour être à la cuillère, garnis comme au café. Açaï, baies-protéines, mangue tropicale, sans glaçons.',
    },
    es: {
      title: 'Recetas de Smoothie Bowl para Ninja Creami',
      description: 'Recetas de smoothie bowls espesos y cremosos para tu Ninja Creami. Bases de frutas congeladas, toppings nutritivos y hermosos bowls de desayuno — con instrucciones paso a paso.',
      metaDescription: 'Recetas de smoothie bowl Ninja Creami — tan espesos que se comen a cuchara, servidos como en un café. Açaí, bayas-proteína, mango tropical, sin trozos de hielo.',
    },
    de: {
      title: 'Smoothie-Bowl-Rezepte für Ninja Creami',
      description: 'Dicke, löffelbare Smoothie-Bowl-Rezepte für deinen Ninja Creami. Gefrorene Fruchtbasen, nahrhafte Toppings und wunderschöne Frühstücksschalen — mit Schritt-für-Schritt-Anleitung.',
      metaDescription: 'Ninja Creami Smoothie-Bowl-Rezepte — dick genug zum Löffeln, wie im Café getoppt. Açaí, Beeren-Protein, tropische Mango. Viel Obst, keine Eissplitter.',
    },
    pt: {
      title: 'Receitas de Smoothie Bowl para Ninja Creami',
      description: 'Receitas de smoothie bowls espessos e cremosos para seu Ninja Creami. Bases de frutas congeladas, coberturas nutritivas e lindos bowls de café da manhã — com instruções passo a passo.',
      metaDescription: 'Receitas de smoothie bowl Ninja Creami — espessos o bastante para colher, servidos como em café. Açaí, frutas-proteína, manga tropical, sem pedaços de gelo.',
    },
  },
  'lite-ice-cream': {
    en: {
      title: 'Lite Ice Cream Recipes for Ninja Creami',
      description: 'Lower-calorie ice cream recipes for your Ninja Creami. All the creamy satisfaction with fewer calories — lighter bases, smart swaps, and guilt-free frozen treats with step-by-step instructions.',
      metaDescription: 'Ninja Creami lite ice cream recipes — under 400 calories per pint with full flavor. Protein-boosted bases and macro-friendly pints with no chalky aftertaste.',
    },
    fr: {
      title: 'Recettes de Glace Légère pour Ninja Creami',
      description: 'Recettes de crème glacée légère et faible en calories pour votre Ninja Creami. Toute la satisfaction crémeuse avec moins de calories — bases allégées et desserts glacés sans culpabilité.',
      metaDescription: 'Recettes de glace légère Ninja Creami — moins de 400 cal par pot, saveur complète. Bases protéinées et pots adaptés aux macros, sans arrière-goût farineux.',
    },
    es: {
      title: 'Recetas de Helado Light para Ninja Creami',
      description: 'Recetas de helado bajo en calorías para tu Ninja Creami. Toda la satisfacción cremosa con menos calorías — bases ligeras y postres helados sin culpa con instrucciones paso a paso.',
      metaDescription: 'Recetas de helado light Ninja Creami — menos de 400 cal por pote, sabor completo. Bases proteicas y potes macro-friendly, sin regusto pastoso.',
    },
    de: {
      title: 'Leichtes Eis — Rezepte für Ninja Creami',
      description: 'Kalorienärmere Eis-Rezepte für deinen Ninja Creami. Der volle cremige Genuss mit weniger Kalorien — leichtere Basen, clevere Alternativen und genussvolle Eiskreationen.',
      metaDescription: 'Ninja Creami Leichtes-Eis-Rezepte — unter 400 kcal pro Pint mit vollem Geschmack. Proteinreiche Basen und makro-freundliche Pints ohne kreidigen Nachgeschmack.',
    },
    pt: {
      title: 'Receitas de Sorvete Light para Ninja Creami',
      description: 'Receitas de sorvete com menos calorias para seu Ninja Creami. Toda a satisfação cremosa com menos calorias — bases mais leves e sobremesas geladas sem culpa com instruções passo a passo.',
      metaDescription: 'Receitas de sorvete light Ninja Creami — menos de 400 cal por pote, sabor completo. Bases proteicas e potes macro-friendly sem gosto arenoso.',
    },
  },
  'italian-ice': {
    en: {
      title: 'Italian Ice Recipes for Ninja Creami',
      description: 'Refreshing Italian ice recipes for your Ninja Creami. Icy, fruity, and intensely flavored — the perfect summer treat made easy with step-by-step instructions.',
      metaDescription: 'Ninja Creami Italian ice recipes — icy, intensely fruity, zero dairy. Lemon, cherry, watermelon and more. Vegan, naturally sweet, 3 ingredients or less.',
    },
    fr: {
      title: 'Recettes de Granité Italien pour Ninja Creami',
      description: 'Recettes de granité italien rafraîchissantes pour votre Ninja Creami. Glacé, fruité et intensément parfumé — le dessert d\'été parfait avec des instructions étape par étape.',
      metaDescription: 'Recettes de granité italien Ninja Creami — glacé, intensément fruité, zéro lactose. Citron, cerise, pastèque. Végan, 3 ingrédients ou moins.',
    },
    es: {
      title: 'Recetas de Raspado Italiano para Ninja Creami',
      description: 'Recetas refrescantes de raspado italiano para tu Ninja Creami. Helado, afrutado e intensamente sabroso — el postre de verano perfecto con instrucciones paso a paso.',
      metaDescription: 'Recetas de raspado italiano Ninja Creami — helado, intensamente afrutado, sin lácteos. Limón, cereza, sandía. Vegano, 3 ingredientes o menos.',
    },
    de: {
      title: 'Italienisches Eis (Granita) — Rezepte für Ninja Creami',
      description: 'Erfrischende Italienische-Eis-Rezepte für deinen Ninja Creami. Eisig, fruchtig und intensiv im Geschmack — der perfekte Sommergenuss mit Schritt-für-Schritt-Anleitung.',
      metaDescription: 'Ninja Creami Granita-Rezepte — eisig, intensiv fruchtig, milchfrei. Zitrone, Kirsche, Wassermelone. Vegan, natürlich süß, 3 Zutaten oder weniger.',
    },
    pt: {
      title: 'Receitas de Raspadinha Italiana para Ninja Creami',
      description: 'Receitas refrescantes de raspadinha italiana para seu Ninja Creami. Gelada, frutada e intensamente saborosa — a sobremesa de verão perfeita com instruções passo a passo.',
      metaDescription: 'Receitas de raspadinha italiana Ninja Creami — gelada, intensamente frutada, sem lactose. Limão, cereja, melancia. Vegana, 3 ingredientes ou menos.',
    },
  },
  'soft-serve': {
    en: {
      title: 'Soft Serve Recipes for Ninja Creami',
      description: 'Smooth, swirly soft serve recipes for your Ninja Creami. Classic vanilla to creative flavors, dispensed perfectly from your Creami\'s soft serve function — all with step-by-step instructions.',
      metaDescription: 'Ninja Creami soft serve recipes — instant, swirly, no scoop needed. Vanilla, chocolate, mango, matcha and more. Uses the Deluxe Soft Serve function.',
    },
    fr: {
      title: 'Recettes de Soft Serve pour Ninja Creami',
      description: 'Recettes de soft serve onctueuses pour votre Ninja Creami. De la vanille classique aux saveurs créatives, parfaitement distribuées avec la fonction soft serve — instructions étape par étape.',
      metaDescription: 'Recettes de soft serve Ninja Creami — instantané, onctueux, sans cuillère. Vanille, chocolat, mangue, matcha. Utilise la fonction Soft Serve du Deluxe.',
    },
    es: {
      title: 'Recetas de Soft Serve para Ninja Creami',
      description: 'Recetas de soft serve suaves y cremosas para tu Ninja Creami. Desde vainilla clásica hasta sabores creativos, servidas perfectamente con la función soft serve — instrucciones paso a paso.',
      metaDescription: 'Recetas de soft serve Ninja Creami — instantáneo, cremoso, sin cuchara. Vainilla, chocolate, mango, matcha. Usa la función Soft Serve del Deluxe.',
    },
    de: {
      title: 'Softeis-Rezepte für Ninja Creami',
      description: 'Glatte, cremige Softeis-Rezepte für deinen Ninja Creami. Von klassischer Vanille bis zu kreativen Geschmacksrichtungen — perfekt mit der Soft-Serve-Funktion — Schritt-für-Schritt-Anleitung.',
      metaDescription: 'Ninja Creami Softeis-Rezepte — sofort, cremig, ohne Löffel. Vanille, Schokolade, Mango, Matcha. Nutzt die Soft-Serve-Funktion des Deluxe.',
    },
    pt: {
      title: 'Receitas de Soft Serve para Ninja Creami',
      description: 'Receitas de soft serve suaves e cremosas para seu Ninja Creami. Da baunilha clássica a sabores criativos, servidas perfeitamente com a função soft serve — instruções passo a passo.',
      metaDescription: 'Receitas de soft serve Ninja Creami — instantâneo, cremoso, sem colher. Baunilha, chocolate, manga, matcha. Usa a função Soft Serve do Deluxe.',
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
