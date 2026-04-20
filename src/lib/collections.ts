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
