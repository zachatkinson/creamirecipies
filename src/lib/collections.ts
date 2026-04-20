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
          layout: 'two-col',
          markdown: `Protein ice cream is the reason a lot of people buy a Ninja Creami in the first place. The machine is uniquely good at turning high-protein, low-fat bases — which would be icy and grainy in a traditional ice cream maker — into something that legitimately tastes like dessert. Every recipe on this page lands between 20 and 40 grams of protein per pint, with macros listed up front so you know exactly what you're eating.

We've split the recipes into three approaches, so you can pick based on what's in your cupboard.`,
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
    },
    es: {
      title: 'Recetas de Helado Proteico para Ninja Creami',
      description: 'Recetas de Ninja Creami altas en proteína que saben a helado de verdad. Bases de requesón, proteína en polvo y postres helados saludables — todos probados con instrucciones paso a paso.',
      metaDescription: 'Recetas de helado proteico Ninja Creami con macros. Requesón, proteína en polvo y bases bajas en calorías — probadas paso a paso.',
    },
    de: {
      title: 'Protein-Eis Rezepte für Ninja Creami',
      description: 'Proteinreiche Ninja Creami Rezepte, die wie echtes Eis schmecken. Quark-Basen, Proteinpulver und makrofreundliche Eiskreationen — alle mit Schritt-für-Schritt-Anleitung getestet.',
      metaDescription: 'Proteinreiche Ninja Creami Eis-Rezepte mit Makros. Quark, Proteinpulver und kalorienarme Basen — Schritt für Schritt getestet.',
    },
    pt: {
      title: 'Receitas de Sorvete Proteico para Ninja Creami',
      description: 'Receitas Ninja Creami ricas em proteína que têm gosto de sorvete de verdade. Bases de cottage cheese, whey protein e sobremesas geladas saudáveis — todas testadas com instruções passo a passo.',
      metaDescription: 'Receitas de sorvete proteico Ninja Creami com macros. Cottage cheese, whey protein e bases de baixa caloria — testadas passo a passo.',
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
    },
    es: {
      title: 'Recetas de Yogurt Helado para Ninja Creami',
      description: 'Recetas cremosas de yogurt helado con tu Ninja Creami. Bases de yogurt griego, frutas frescas y alternativas más ligeras al helado tradicional — todas con instrucciones paso a paso.',
      metaDescription: 'Recetas de yogurt helado Ninja Creami con yogurt griego y frutas. Instrucciones paso a paso para un froyo casero perfecto.',
    },
    de: {
      title: 'Frozen Yogurt Rezepte für Ninja Creami',
      description: 'Cremige Frozen-Yogurt-Rezepte für deinen Ninja Creami. Griechischer Joghurt, frische Früchte und leichtere Alternativen zu herkömmlichem Eis — alle mit Schritt-für-Schritt-Anleitung.',
      metaDescription: 'Ninja Creami Frozen-Yogurt-Rezepte mit griechischem Joghurt und Früchten. Schritt für Schritt zum perfekten selbstgemachten Froyo.',
    },
    pt: {
      title: 'Receitas de Frozen Yogurt para Ninja Creami',
      description: 'Receitas cremosas de frozen yogurt feitas com seu Ninja Creami. Bases de iogurte grego, frutas frescas e alternativas mais leves ao sorvete tradicional — todas com instruções passo a passo.',
      metaDescription: 'Receitas de frozen yogurt Ninja Creami com iogurte grego e frutas. Instruções passo a passo para um froyo caseiro perfeito.',
    },
  },
  'ice-cream': {
    en: {
      title: 'Ice Cream Recipes for Ninja Creami',
      description: 'Classic and creative ice cream recipes made with your Ninja Creami. Rich, creamy bases with endless flavor combinations — all tested with step-by-step instructions and pro tips.',
      metaDescription: 'Ninja Creami ice cream recipes with step-by-step instructions. Classic vanilla to creative flavors — tested for perfect homemade ice cream every time.',
      longIntroSections: [
        {
          layout: 'prose',
          markdown: `The Ninja Creami is at its best when you feed it a proper ice cream base. A real cream base — heavy cream, whole milk, and sugar — freezes into a dense block that the Creami blade shaves into that velvety, scoopable texture you can't get from a blender or a regular ice cream maker. Every recipe on this page starts with that foundation and adds a flavor profile we've tested end-to-end, so you know exactly how the finished pint will taste and scoop.`,
        },
        {
          layout: 'prose',
          markdown: `If you're brand new to the machine, start with a classic: vanilla, chocolate, or strawberry. These are the recipes that teach you how the "Ice Cream" program behaves, how long to freeze your pint, and when to reach for the Re-Spin button. Once your first pint comes out glossy instead of crumbly, you'll know your freezer and your Creami are calibrated, and the more advanced recipes — swirls, mix-ins, layered flavors — become much easier to nail.`,
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
    },
    es: {
      title: 'Recetas de Helado para Ninja Creami',
      description: 'Recetas de helado clásicas y creativas hechas con tu Ninja Creami. Bases ricas y cremosas con infinitas combinaciones de sabores — todas probadas con instrucciones paso a paso.',
      metaDescription: 'Recetas de helado Ninja Creami con instrucciones paso a paso. Desde vainilla clásica hasta sabores creativos — probadas para un helado casero perfecto.',
    },
    de: {
      title: 'Eis-Rezepte für Ninja Creami',
      description: 'Klassische und kreative Eis-Rezepte für deinen Ninja Creami. Reichhaltige, cremige Basen mit endlosen Geschmackskombinationen — alle mit Schritt-für-Schritt-Anleitung getestet.',
      metaDescription: 'Ninja Creami Eis-Rezepte mit Schritt-für-Schritt-Anleitung. Von klassischer Vanille bis zu kreativen Geschmacksrichtungen — für perfektes selbstgemachtes Eis.',
    },
    pt: {
      title: 'Receitas de Sorvete para Ninja Creami',
      description: 'Receitas de sorvete clássicas e criativas feitas com seu Ninja Creami. Bases ricas e cremosas com combinações infinitas de sabores — todas testadas com instruções passo a passo.',
      metaDescription: 'Receitas de sorvete Ninja Creami com instruções passo a passo. Da baunilha clássica a sabores criativos — testadas para um sorvete caseiro perfeito.',
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
