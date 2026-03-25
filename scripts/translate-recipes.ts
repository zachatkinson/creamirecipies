/**
 * Batch Translation Script for Recipes
 *
 * Translates all recipes into French (fr) and Spanish (es) using deterministic
 * lookup tables and pattern-based translation. Inserts into recipe_translations.
 *
 * Run with:
 *   source .env && export PUBLIC_SUPABASE_URL SUPABASE_SERVICE_ROLE_KEY && npx tsx scripts/translate-recipes.ts
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing env vars: PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

type Locale = 'fr' | 'es';

// ============================================================
// INGREDIENT TRANSLATION MAPS
// ============================================================

const ingredientMap: Record<string, { fr: string; es: string }> = {
  // Dairy
  'heavy cream': { fr: 'crème épaisse', es: 'crema espesa' },
  'heavy whipping cream': { fr: 'crème fouettée épaisse', es: 'crema para batir espesa' },
  'whipping cream': { fr: 'crème fouettée', es: 'crema para batir' },
  'cream': { fr: 'crème', es: 'crema' },
  'half and half': { fr: 'mélange crème-lait', es: 'media crema' },
  'half & half': { fr: 'mélange crème-lait', es: 'media crema' },
  'whole milk': { fr: 'lait entier', es: 'leche entera' },
  'milk': { fr: 'lait', es: 'leche' },
  '2% milk': { fr: 'lait 2%', es: 'leche 2%' },
  'skim milk': { fr: 'lait écrémé', es: 'leche descremada' },
  'oat milk': { fr: 'lait d\'avoine', es: 'leche de avena' },
  'almond milk': { fr: 'lait d\'amande', es: 'leche de almendra' },
  'coconut milk': { fr: 'lait de coco', es: 'leche de coco' },
  'soy milk': { fr: 'lait de soja', es: 'leche de soya' },
  'cashew milk': { fr: 'lait de cajou', es: 'leche de anacardo' },
  'buttermilk': { fr: 'babeurre', es: 'suero de leche' },
  'sweetened condensed milk': { fr: 'lait concentré sucré', es: 'leche condensada azucarada' },
  'condensed milk': { fr: 'lait concentré', es: 'leche condensada' },
  'evaporated milk': { fr: 'lait évaporé', es: 'leche evaporada' },
  'cream cheese': { fr: 'fromage à la crème', es: 'queso crema' },
  'mascarpone': { fr: 'mascarpone', es: 'mascarpone' },
  'mascarpone cheese': { fr: 'fromage mascarpone', es: 'queso mascarpone' },
  'ricotta': { fr: 'ricotta', es: 'ricotta' },
  'ricotta cheese': { fr: 'fromage ricotta', es: 'queso ricotta' },
  'sour cream': { fr: 'crème aigre', es: 'crema agria' },
  'butter': { fr: 'beurre', es: 'mantequilla' },
  'unsalted butter': { fr: 'beurre non salé', es: 'mantequilla sin sal' },
  'salted butter': { fr: 'beurre salé', es: 'mantequilla con sal' },
  'yogurt': { fr: 'yaourt', es: 'yogur' },
  'greek yogurt': { fr: 'yaourt grec', es: 'yogur griego' },
  'plain greek yogurt': { fr: 'yaourt grec nature', es: 'yogur griego natural' },
  'vanilla greek yogurt': { fr: 'yaourt grec à la vanille', es: 'yogur griego de vainilla' },
  'cottage cheese': { fr: 'fromage cottage', es: 'queso cottage' },
  'whipped cream': { fr: 'crème fouettée', es: 'crema batida' },
  'cool whip': { fr: 'Cool Whip', es: 'Cool Whip' },
  'whipped topping': { fr: 'garniture fouettée', es: 'cobertura batida' },

  // Sweeteners
  'sugar': { fr: 'sucre', es: 'azúcar' },
  'granulated sugar': { fr: 'sucre granulé', es: 'azúcar granulada' },
  'white sugar': { fr: 'sucre blanc', es: 'azúcar blanca' },
  'brown sugar': { fr: 'sucre brun', es: 'azúcar morena' },
  'light brown sugar': { fr: 'sucre brun clair', es: 'azúcar morena clara' },
  'dark brown sugar': { fr: 'sucre brun foncé', es: 'azúcar morena oscura' },
  'powdered sugar': { fr: 'sucre glace', es: 'azúcar glas' },
  'confectioners sugar': { fr: 'sucre glace', es: 'azúcar glas' },
  'confectioners\' sugar': { fr: 'sucre glace', es: 'azúcar glas' },
  'maple syrup': { fr: 'sirop d\'érable', es: 'jarabe de arce' },
  'honey': { fr: 'miel', es: 'miel' },
  'agave': { fr: 'agave', es: 'agave' },
  'agave nectar': { fr: 'nectar d\'agave', es: 'néctar de agave' },
  'corn syrup': { fr: 'sirop de maïs', es: 'jarabe de maíz' },
  'light corn syrup': { fr: 'sirop de maïs léger', es: 'jarabe de maíz ligero' },
  'molasses': { fr: 'mélasse', es: 'melaza' },
  'stevia': { fr: 'stévia', es: 'stevia' },
  'monk fruit sweetener': { fr: 'édulcorant de fruit des moines', es: 'endulzante de fruta del monje' },
  'erythritol': { fr: 'érythritol', es: 'eritritol' },
  'allulose': { fr: 'allulose', es: 'alulosa' },
  'simple syrup': { fr: 'sirop simple', es: 'jarabe simple' },

  // Chocolate & Cocoa
  'cocoa powder': { fr: 'poudre de cacao', es: 'polvo de cacao' },
  'unsweetened cocoa powder': { fr: 'poudre de cacao non sucrée', es: 'polvo de cacao sin azúcar' },
  'dutch process cocoa powder': { fr: 'poudre de cacao hollandaise', es: 'polvo de cacao holandés' },
  'chocolate chips': { fr: 'pépites de chocolat', es: 'chispas de chocolate' },
  'semi-sweet chocolate chips': { fr: 'pépites de chocolat mi-sucré', es: 'chispas de chocolate semi-dulce' },
  'dark chocolate chips': { fr: 'pépites de chocolat noir', es: 'chispas de chocolate oscuro' },
  'milk chocolate chips': { fr: 'pépites de chocolat au lait', es: 'chispas de chocolate con leche' },
  'white chocolate chips': { fr: 'pépites de chocolat blanc', es: 'chispas de chocolate blanco' },
  'mini chocolate chips': { fr: 'mini pépites de chocolat', es: 'mini chispas de chocolate' },
  'chocolate': { fr: 'chocolat', es: 'chocolate' },
  'dark chocolate': { fr: 'chocolat noir', es: 'chocolate oscuro' },
  'milk chocolate': { fr: 'chocolat au lait', es: 'chocolate con leche' },
  'white chocolate': { fr: 'chocolat blanc', es: 'chocolate blanco' },
  'chocolate syrup': { fr: 'sirop de chocolat', es: 'jarabe de chocolate' },
  'chocolate sauce': { fr: 'sauce au chocolat', es: 'salsa de chocolate' },
  'hot fudge': { fr: 'sauce au chocolat chaud', es: 'salsa de chocolate caliente' },
  'nutella': { fr: 'Nutella', es: 'Nutella' },
  'chocolate hazelnut spread': { fr: 'pâte à tartiner chocolat-noisette', es: 'crema de chocolate y avellana' },
  'cacao nibs': { fr: 'éclats de cacao', es: 'nibs de cacao' },
  'cocoa': { fr: 'cacao', es: 'cacao' },

  // Fruits
  'strawberries': { fr: 'fraises', es: 'fresas' },
  'strawberry': { fr: 'fraise', es: 'fresa' },
  'fresh strawberries': { fr: 'fraises fraîches', es: 'fresas frescas' },
  'frozen strawberries': { fr: 'fraises surgelées', es: 'fresas congeladas' },
  'blueberries': { fr: 'myrtilles', es: 'arándanos' },
  'fresh blueberries': { fr: 'myrtilles fraîches', es: 'arándanos frescos' },
  'frozen blueberries': { fr: 'myrtilles surgelées', es: 'arándanos congelados' },
  'raspberries': { fr: 'framboises', es: 'frambuesas' },
  'fresh raspberries': { fr: 'framboises fraîches', es: 'frambuesas frescas' },
  'frozen raspberries': { fr: 'framboises surgelées', es: 'frambuesas congeladas' },
  'blackberries': { fr: 'mûres', es: 'moras' },
  'cherries': { fr: 'cerises', es: 'cerezas' },
  'fresh cherries': { fr: 'cerises fraîches', es: 'cerezas frescas' },
  'frozen cherries': { fr: 'cerises surgelées', es: 'cerezas congeladas' },
  'maraschino cherries': { fr: 'cerises au marasquin', es: 'cerezas marrasquino' },
  'banana': { fr: 'banane', es: 'plátano' },
  'bananas': { fr: 'bananes', es: 'plátanos' },
  'ripe banana': { fr: 'banane mûre', es: 'plátano maduro' },
  'ripe bananas': { fr: 'bananes mûres', es: 'plátanos maduros' },
  'frozen banana': { fr: 'banane surgelée', es: 'plátano congelado' },
  'frozen bananas': { fr: 'bananes surgelées', es: 'plátanos congelados' },
  'mango': { fr: 'mangue', es: 'mango' },
  'mangoes': { fr: 'mangues', es: 'mangos' },
  'frozen mango': { fr: 'mangue surgelée', es: 'mango congelado' },
  'frozen mango chunks': { fr: 'morceaux de mangue surgelés', es: 'trozos de mango congelados' },
  'peach': { fr: 'pêche', es: 'durazno' },
  'peaches': { fr: 'pêches', es: 'duraznos' },
  'fresh peaches': { fr: 'pêches fraîches', es: 'duraznos frescos' },
  'frozen peaches': { fr: 'pêches surgelées', es: 'duraznos congelados' },
  'pineapple': { fr: 'ananas', es: 'piña' },
  'crushed pineapple': { fr: 'ananas broyé', es: 'piña triturada' },
  'pineapple chunks': { fr: 'morceaux d\'ananas', es: 'trozos de piña' },
  'coconut': { fr: 'noix de coco', es: 'coco' },
  'shredded coconut': { fr: 'noix de coco râpée', es: 'coco rallado' },
  'toasted coconut': { fr: 'noix de coco grillée', es: 'coco tostado' },
  'coconut flakes': { fr: 'flocons de noix de coco', es: 'copos de coco' },
  'coconut cream': { fr: 'crème de coco', es: 'crema de coco' },
  'coconut water': { fr: 'eau de coco', es: 'agua de coco' },
  'lemon': { fr: 'citron', es: 'limón' },
  'lemon juice': { fr: 'jus de citron', es: 'jugo de limón' },
  'lemon zest': { fr: 'zeste de citron', es: 'ralladura de limón' },
  'lime': { fr: 'citron vert', es: 'lima' },
  'lime juice': { fr: 'jus de citron vert', es: 'jugo de lima' },
  'lime zest': { fr: 'zeste de citron vert', es: 'ralladura de lima' },
  'orange': { fr: 'orange', es: 'naranja' },
  'orange juice': { fr: 'jus d\'orange', es: 'jugo de naranja' },
  'orange zest': { fr: 'zeste d\'orange', es: 'ralladura de naranja' },
  'apple': { fr: 'pomme', es: 'manzana' },
  'apples': { fr: 'pommes', es: 'manzanas' },
  'applesauce': { fr: 'compote de pommes', es: 'compota de manzana' },
  'apple cider': { fr: 'cidre de pomme', es: 'sidra de manzana' },
  'cranberries': { fr: 'canneberges', es: 'arándanos rojos' },
  'dried cranberries': { fr: 'canneberges séchées', es: 'arándanos rojos secos' },
  'raisins': { fr: 'raisins secs', es: 'pasas' },
  'dates': { fr: 'dattes', es: 'dátiles' },
  'fig': { fr: 'figue', es: 'higo' },
  'figs': { fr: 'figues', es: 'higos' },
  'passion fruit': { fr: 'fruit de la passion', es: 'maracuyá' },
  'passion fruit puree': { fr: 'purée de fruit de la passion', es: 'puré de maracuyá' },
  'pomegranate': { fr: 'grenade', es: 'granada' },
  'pomegranate seeds': { fr: 'graines de grenade', es: 'semillas de granada' },
  'watermelon': { fr: 'pastèque', es: 'sandía' },
  'kiwi': { fr: 'kiwi', es: 'kiwi' },
  'guava': { fr: 'goyave', es: 'guayaba' },
  'papaya': { fr: 'papaye', es: 'papaya' },
  'dragon fruit': { fr: 'fruit du dragon', es: 'fruta del dragón' },
  'acai': { fr: 'açaï', es: 'açaí' },
  'mixed berries': { fr: 'fruits rouges mélangés', es: 'frutos rojos mixtos' },
  'frozen mixed berries': { fr: 'fruits rouges surgelés mélangés', es: 'frutos rojos congelados mixtos' },
  'berry mix': { fr: 'mélange de fruits rouges', es: 'mezcla de frutos rojos' },
  'fruit puree': { fr: 'purée de fruits', es: 'puré de frutas' },
  'strawberry puree': { fr: 'purée de fraises', es: 'puré de fresas' },
  'raspberry puree': { fr: 'purée de framboises', es: 'puré de frambuesas' },
  'mango puree': { fr: 'purée de mangue', es: 'puré de mango' },
  'peach puree': { fr: 'purée de pêche', es: 'puré de durazno' },

  // Nuts & Nut Butters
  'peanut butter': { fr: 'beurre de cacahuète', es: 'mantequilla de maní' },
  'creamy peanut butter': { fr: 'beurre de cacahuète crémeux', es: 'mantequilla de maní cremosa' },
  'crunchy peanut butter': { fr: 'beurre de cacahuète croquant', es: 'mantequilla de maní crocante' },
  'almond butter': { fr: 'beurre d\'amande', es: 'mantequilla de almendra' },
  'cashew butter': { fr: 'beurre de cajou', es: 'mantequilla de anacardo' },
  'sunflower seed butter': { fr: 'beurre de graines de tournesol', es: 'mantequilla de semillas de girasol' },
  'almonds': { fr: 'amandes', es: 'almendras' },
  'sliced almonds': { fr: 'amandes effilées', es: 'almendras laminadas' },
  'chopped almonds': { fr: 'amandes hachées', es: 'almendras picadas' },
  'pecans': { fr: 'noix de pécan', es: 'nueces pecanas' },
  'chopped pecans': { fr: 'noix de pécan hachées', es: 'nueces pecanas picadas' },
  'walnuts': { fr: 'noix', es: 'nueces' },
  'chopped walnuts': { fr: 'noix hachées', es: 'nueces picadas' },
  'hazelnuts': { fr: 'noisettes', es: 'avellanas' },
  'chopped hazelnuts': { fr: 'noisettes hachées', es: 'avellanas picadas' },
  'pistachios': { fr: 'pistaches', es: 'pistachos' },
  'chopped pistachios': { fr: 'pistaches hachées', es: 'pistachos picados' },
  'macadamia nuts': { fr: 'noix de macadamia', es: 'nueces de macadamia' },
  'cashews': { fr: 'noix de cajou', es: 'anacardos' },
  'peanuts': { fr: 'cacahuètes', es: 'maníes' },
  'chopped peanuts': { fr: 'cacahuètes hachées', es: 'maníes picados' },
  'mixed nuts': { fr: 'noix mélangées', es: 'nueces mixtas' },
  'coconut oil': { fr: 'huile de coco', es: 'aceite de coco' },

  // Extracts & Flavorings
  'vanilla extract': { fr: 'extrait de vanille', es: 'extracto de vainilla' },
  'vanilla': { fr: 'vanille', es: 'vainilla' },
  'vanilla bean': { fr: 'gousse de vanille', es: 'vaina de vainilla' },
  'vanilla bean paste': { fr: 'pâte de gousse de vanille', es: 'pasta de vaina de vainilla' },
  'almond extract': { fr: 'extrait d\'amande', es: 'extracto de almendra' },
  'peppermint extract': { fr: 'extrait de menthe poivrée', es: 'extracto de menta' },
  'mint extract': { fr: 'extrait de menthe', es: 'extracto de menta' },
  'coconut extract': { fr: 'extrait de noix de coco', es: 'extracto de coco' },
  'rum extract': { fr: 'extrait de rhum', es: 'extracto de ron' },
  'coffee extract': { fr: 'extrait de café', es: 'extracto de café' },
  'lemon extract': { fr: 'extrait de citron', es: 'extracto de limón' },
  'orange extract': { fr: 'extrait d\'orange', es: 'extracto de naranja' },
  'maple extract': { fr: 'extrait d\'érable', es: 'extracto de arce' },
  'rose water': { fr: 'eau de rose', es: 'agua de rosas' },
  'lavender': { fr: 'lavande', es: 'lavanda' },
  'dried lavender': { fr: 'lavande séchée', es: 'lavanda seca' },
  'matcha': { fr: 'matcha', es: 'matcha' },
  'matcha powder': { fr: 'poudre de matcha', es: 'polvo de matcha' },
  'espresso': { fr: 'espresso', es: 'espresso' },
  'espresso powder': { fr: 'poudre d\'espresso', es: 'polvo de espresso' },
  'instant espresso': { fr: 'espresso instantané', es: 'espresso instantáneo' },
  'instant espresso powder': { fr: 'poudre d\'espresso instantané', es: 'polvo de espresso instantáneo' },
  'instant coffee': { fr: 'café instantané', es: 'café instantáneo' },
  'coffee': { fr: 'café', es: 'café' },
  'brewed coffee': { fr: 'café infusé', es: 'café preparado' },
  'cold brew coffee': { fr: 'café infusé à froid', es: 'café frío preparado' },
  'cold brew concentrate': { fr: 'concentré de café à froid', es: 'concentrado de café frío' },
  'food coloring': { fr: 'colorant alimentaire', es: 'colorante alimentario' },
  'red food coloring': { fr: 'colorant alimentaire rouge', es: 'colorante alimentario rojo' },
  'green food coloring': { fr: 'colorant alimentaire vert', es: 'colorante alimentario verde' },

  // Spices
  'cinnamon': { fr: 'cannelle', es: 'canela' },
  'ground cinnamon': { fr: 'cannelle moulue', es: 'canela molida' },
  'nutmeg': { fr: 'noix de muscade', es: 'nuez moscada' },
  'ground nutmeg': { fr: 'noix de muscade moulue', es: 'nuez moscada molida' },
  'ginger': { fr: 'gingembre', es: 'jengibre' },
  'ground ginger': { fr: 'gingembre moulu', es: 'jengibre molido' },
  'fresh ginger': { fr: 'gingembre frais', es: 'jengibre fresco' },
  'cloves': { fr: 'clous de girofle', es: 'clavos de olor' },
  'ground cloves': { fr: 'clous de girofle moulus', es: 'clavos de olor molidos' },
  'allspice': { fr: 'piment de la Jamaïque', es: 'pimienta de Jamaica' },
  'cardamom': { fr: 'cardamome', es: 'cardamomo' },
  'ground cardamom': { fr: 'cardamome moulue', es: 'cardamomo molido' },
  'pumpkin pie spice': { fr: 'épices pour tarte à la citrouille', es: 'especias para pastel de calabaza' },
  'chai spice': { fr: 'épices chaï', es: 'especias chai' },
  'turmeric': { fr: 'curcuma', es: 'cúrcuma' },
  'cayenne pepper': { fr: 'poivre de Cayenne', es: 'pimienta de Cayena' },
  'chili powder': { fr: 'poudre de chili', es: 'polvo de chile' },
  'salt': { fr: 'sel', es: 'sal' },
  'sea salt': { fr: 'sel de mer', es: 'sal marina' },
  'flaky sea salt': { fr: 'sel de mer en flocons', es: 'sal marina en escamas' },
  'kosher salt': { fr: 'sel casher', es: 'sal kosher' },
  'pinch of salt': { fr: 'pincée de sel', es: 'pizca de sal' },

  // Cookies, Candy & Mix-ins
  'oreo cookies': { fr: 'biscuits Oreo', es: 'galletas Oreo' },
  'oreos': { fr: 'Oreo', es: 'Oreo' },
  'crushed oreos': { fr: 'Oreo écrasés', es: 'Oreo trituradas' },
  'oreo crumbs': { fr: 'miettes d\'Oreo', es: 'migas de Oreo' },
  'graham crackers': { fr: 'biscuits Graham', es: 'galletas Graham' },
  'graham cracker crumbs': { fr: 'miettes de biscuits Graham', es: 'migas de galletas Graham' },
  'cookie crumbs': { fr: 'miettes de biscuits', es: 'migas de galletas' },
  'cookies': { fr: 'biscuits', es: 'galletas' },
  'cookie dough': { fr: 'pâte à biscuit', es: 'masa de galleta' },
  'brownie pieces': { fr: 'morceaux de brownie', es: 'trozos de brownie' },
  'brownies': { fr: 'brownies', es: 'brownies' },
  'sprinkles': { fr: 'vermicelles colorés', es: 'chispitas de colores' },
  'rainbow sprinkles': { fr: 'vermicelles arc-en-ciel', es: 'chispitas arcoíris' },
  'chocolate sprinkles': { fr: 'vermicelles au chocolat', es: 'chispitas de chocolate' },
  'marshmallows': { fr: 'guimauves', es: 'malvaviscos' },
  'mini marshmallows': { fr: 'mini guimauves', es: 'mini malvaviscos' },
  'marshmallow fluff': { fr: 'crème de guimauve', es: 'crema de malvavisco' },
  'marshmallow creme': { fr: 'crème de guimauve', es: 'crema de malvavisco' },
  'caramel': { fr: 'caramel', es: 'caramelo' },
  'caramel sauce': { fr: 'sauce au caramel', es: 'salsa de caramelo' },
  'caramel syrup': { fr: 'sirop de caramel', es: 'jarabe de caramelo' },
  'dulce de leche': { fr: 'dulce de leche', es: 'dulce de leche' },
  'toffee bits': { fr: 'morceaux de caramel anglais', es: 'trozos de toffee' },
  'toffee': { fr: 'caramel anglais', es: 'toffee' },
  'butterscotch chips': { fr: 'pépites de caramel au beurre', es: 'chispas de caramelo de mantequilla' },
  'butterscotch': { fr: 'caramel au beurre', es: 'caramelo de mantequilla' },
  'peanut butter cups': { fr: 'bonbons au beurre de cacahuète', es: 'copas de mantequilla de maní' },
  'reese\'s pieces': { fr: 'Reese\'s Pieces', es: 'Reese\'s Pieces' },
  'candy': { fr: 'bonbons', es: 'dulces' },
  'candy cane': { fr: 'sucre d\'orge', es: 'bastón de caramelo' },
  'candy canes': { fr: 'sucres d\'orge', es: 'bastones de caramelo' },
  'crushed candy canes': { fr: 'sucres d\'orge écrasés', es: 'bastones de caramelo triturados' },
  'gummy bears': { fr: 'oursons en gélatine', es: 'ositos de goma' },
  'm&ms': { fr: 'M&Ms', es: 'M&Ms' },
  'snickers': { fr: 'Snickers', es: 'Snickers' },
  'twix': { fr: 'Twix', es: 'Twix' },
  'heath bar': { fr: 'barre Heath', es: 'barra Heath' },
  'waffle cone pieces': { fr: 'morceaux de cornet gaufré', es: 'trozos de cono de waffle' },
  'waffle cone': { fr: 'cornet gaufré', es: 'cono de waffle' },
  'sugar cone': { fr: 'cornet en sucre', es: 'cono de azúcar' },

  // Baking & Thickeners
  'flour': { fr: 'farine', es: 'harina' },
  'all-purpose flour': { fr: 'farine tout usage', es: 'harina de trigo' },
  'cornstarch': { fr: 'fécule de maïs', es: 'maicena' },
  'corn starch': { fr: 'fécule de maïs', es: 'maicena' },
  'tapioca starch': { fr: 'fécule de tapioca', es: 'fécula de tapioca' },
  'xanthan gum': { fr: 'gomme xanthane', es: 'goma xantana' },
  'guar gum': { fr: 'gomme de guar', es: 'goma guar' },
  'gelatin': { fr: 'gélatine', es: 'gelatina' },
  'baking soda': { fr: 'bicarbonate de soude', es: 'bicarbonato de sodio' },
  'baking powder': { fr: 'levure chimique', es: 'polvo de hornear' },
  'egg': { fr: 'œuf', es: 'huevo' },
  'eggs': { fr: 'œufs', es: 'huevos' },
  'egg yolks': { fr: 'jaunes d\'œufs', es: 'yemas de huevo' },
  'egg yolk': { fr: 'jaune d\'œuf', es: 'yema de huevo' },
  'egg whites': { fr: 'blancs d\'œufs', es: 'claras de huevo' },

  // Protein & Health
  'protein powder': { fr: 'poudre de protéine', es: 'proteína en polvo' },
  'vanilla protein powder': { fr: 'poudre de protéine à la vanille', es: 'proteína en polvo de vainilla' },
  'chocolate protein powder': { fr: 'poudre de protéine au chocolat', es: 'proteína en polvo de chocolate' },
  'collagen peptides': { fr: 'peptides de collagène', es: 'péptidos de colágeno' },
  'chia seeds': { fr: 'graines de chia', es: 'semillas de chía' },
  'flax seeds': { fr: 'graines de lin', es: 'semillas de lino' },
  'hemp seeds': { fr: 'graines de chanvre', es: 'semillas de cáñamo' },
  'oats': { fr: 'flocons d\'avoine', es: 'avena' },
  'rolled oats': { fr: 'flocons d\'avoine', es: 'avena en hojuelas' },
  'granola': { fr: 'granola', es: 'granola' },
  'avocado': { fr: 'avocat', es: 'aguacate' },
  'spinach': { fr: 'épinards', es: 'espinacas' },
  'frozen spinach': { fr: 'épinards surgelés', es: 'espinacas congeladas' },

  // Spreads & Jams
  'jam': { fr: 'confiture', es: 'mermelada' },
  'strawberry jam': { fr: 'confiture de fraises', es: 'mermelada de fresa' },
  'raspberry jam': { fr: 'confiture de framboises', es: 'mermelada de frambuesa' },
  'blueberry jam': { fr: 'confiture de myrtilles', es: 'mermelada de arándano' },
  'preserves': { fr: 'conserves', es: 'conservas' },
  'strawberry preserves': { fr: 'conserves de fraises', es: 'conservas de fresa' },
  'jelly': { fr: 'gelée', es: 'jalea' },
  'grape jelly': { fr: 'gelée de raisin', es: 'jalea de uva' },
  'lemon curd': { fr: 'crème de citron', es: 'crema de limón' },
  'pie filling': { fr: 'garniture de tarte', es: 'relleno de pastel' },
  'cherry pie filling': { fr: 'garniture de tarte aux cerises', es: 'relleno de pastel de cereza' },
  'apple pie filling': { fr: 'garniture de tarte aux pommes', es: 'relleno de pastel de manzana' },
  'pumpkin puree': { fr: 'purée de citrouille', es: 'puré de calabaza' },
  'pumpkin': { fr: 'citrouille', es: 'calabaza' },
  'canned pumpkin': { fr: 'citrouille en conserve', es: 'calabaza en lata' },
  'sweet potato': { fr: 'patate douce', es: 'batata' },
  'sweet potato puree': { fr: 'purée de patate douce', es: 'puré de batata' },

  // Liquids & Alcohol
  'water': { fr: 'eau', es: 'agua' },
  'ice': { fr: 'glace', es: 'hielo' },
  'juice': { fr: 'jus', es: 'jugo' },
  'apple juice': { fr: 'jus de pomme', es: 'jugo de manzana' },
  'cranberry juice': { fr: 'jus de canneberge', es: 'jugo de arándano' },
  'grape juice': { fr: 'jus de raisin', es: 'jugo de uva' },
  'bourbon': { fr: 'bourbon', es: 'bourbon' },
  'rum': { fr: 'rhum', es: 'ron' },
  'dark rum': { fr: 'rhum brun', es: 'ron oscuro' },
  'kahlua': { fr: 'Kahlúa', es: 'Kahlúa' },
  'baileys': { fr: 'Baileys', es: 'Baileys' },
  'irish cream': { fr: 'crème irlandaise', es: 'crema irlandesa' },
  'amaretto': { fr: 'amaretto', es: 'amaretto' },
  'vodka': { fr: 'vodka', es: 'vodka' },
  'wine': { fr: 'vin', es: 'vino' },
  'red wine': { fr: 'vin rouge', es: 'vino tinto' },
  'champagne': { fr: 'champagne', es: 'champaña' },

  // Misc
  'cream of coconut': { fr: 'crème de coco', es: 'crema de coco' },
  'vegetable oil': { fr: 'huile végétale', es: 'aceite vegetal' },
  'olive oil': { fr: 'huile d\'olive', es: 'aceite de oliva' },
  'cake mix': { fr: 'préparation pour gâteau', es: 'mezcla para pastel' },
  'pudding mix': { fr: 'préparation pour pouding', es: 'mezcla para pudín' },
  'instant pudding mix': { fr: 'préparation pour pouding instantané', es: 'mezcla para pudín instantáneo' },
  'jello': { fr: 'Jell-O', es: 'gelatina' },
  'gelatin mix': { fr: 'préparation pour gélatine', es: 'mezcla para gelatina' },
  'whey protein': { fr: 'protéine de lactosérum', es: 'proteína de suero' },
  'biscoff cookies': { fr: 'biscuits Biscoff', es: 'galletas Biscoff' },
  'biscoff spread': { fr: 'pâte à tartiner Biscoff', es: 'crema para untar Biscoff' },
  'cookie butter': { fr: 'beurre de biscuit', es: 'mantequilla de galleta' },
  'nilla wafers': { fr: 'gaufrettes Nilla', es: 'galletas Nilla' },
  'vanilla wafers': { fr: 'gaufrettes à la vanille', es: 'galletas de vainilla' },
  'animal crackers': { fr: 'biscuits animaux', es: 'galletas de animalitos' },
  'pretzels': { fr: 'bretzels', es: 'pretzels' },
  'cereal': { fr: 'céréales', es: 'cereal' },
  'fruity pebbles': { fr: 'Fruity Pebbles', es: 'Fruity Pebbles' },
  'cinnamon toast crunch': { fr: 'Cinnamon Toast Crunch', es: 'Cinnamon Toast Crunch' },
  'cocoa puffs': { fr: 'Cocoa Puffs', es: 'Cocoa Puffs' },
  'lucky charms marshmallows': { fr: 'guimauves Lucky Charms', es: 'malvaviscos Lucky Charms' },
  'tea': { fr: 'thé', es: 'té' },
  'green tea': { fr: 'thé vert', es: 'té verde' },
  'earl grey tea': { fr: 'thé Earl Grey', es: 'té Earl Grey' },
  'chai tea': { fr: 'thé chaï', es: 'té chai' },
};

// ============================================================
// TITLE WORD TRANSLATION MAPS
// ============================================================

// Base type translations in titles
const baseTitleMap: Record<string, { fr: string; es: string }> = {
  'ice cream': { fr: 'Crème Glacée', es: 'Helado' },
  'lite ice cream': { fr: 'Crème Glacée Légère', es: 'Helado Ligero' },
  'sorbet': { fr: 'Sorbet', es: 'Sorbete' },
  'gelato': { fr: 'Gelato', es: 'Gelato' },
  'frozen yogurt': { fr: 'Yaourt Glacé', es: 'Yogur Helado' },
  'milkshake': { fr: 'Milkshake', es: 'Batido' },
  'smoothie bowl': { fr: 'Bol de Smoothie', es: 'Bowl de Smoothie' },
  'italian ice': { fr: 'Glace Italienne', es: 'Hielo Italiano' },
  'frozen drink': { fr: 'Boisson Glacée', es: 'Bebida Helada' },
  'protein ice cream': { fr: 'Crème Glacée Protéinée', es: 'Helado Proteico' },
};

// Word-level title translations
const titleWordMap: Record<string, { fr: string; es: string }> = {
  // Flavors
  'chocolate': { fr: 'Chocolat', es: 'Chocolate' },
  'vanilla': { fr: 'Vanille', es: 'Vainilla' },
  'strawberry': { fr: 'Fraise', es: 'Fresa' },
  'blueberry': { fr: 'Myrtille', es: 'Arándano' },
  'raspberry': { fr: 'Framboise', es: 'Frambuesa' },
  'blackberry': { fr: 'Mûre', es: 'Mora' },
  'cherry': { fr: 'Cerise', es: 'Cereza' },
  'mango': { fr: 'Mangue', es: 'Mango' },
  'peach': { fr: 'Pêche', es: 'Durazno' },
  'pineapple': { fr: 'Ananas', es: 'Piña' },
  'coconut': { fr: 'Noix de Coco', es: 'Coco' },
  'banana': { fr: 'Banane', es: 'Plátano' },
  'lemon': { fr: 'Citron', es: 'Limón' },
  'lime': { fr: 'Citron Vert', es: 'Lima' },
  'orange': { fr: 'Orange', es: 'Naranja' },
  'apple': { fr: 'Pomme', es: 'Manzana' },
  'cranberry': { fr: 'Canneberge', es: 'Arándano Rojo' },
  'watermelon': { fr: 'Pastèque', es: 'Sandía' },
  'pomegranate': { fr: 'Grenade', es: 'Granada' },
  'passion fruit': { fr: 'Fruit de la Passion', es: 'Maracuyá' },
  'kiwi': { fr: 'Kiwi', es: 'Kiwi' },
  'guava': { fr: 'Goyave', es: 'Guayaba' },
  'dragon fruit': { fr: 'Fruit du Dragon', es: 'Fruta del Dragón' },
  'acai': { fr: 'Açaï', es: 'Açaí' },

  // Descriptors
  'peanut butter': { fr: 'Beurre de Cacahuète', es: 'Mantequilla de Maní' },
  'peanut butter cup': { fr: 'Beurre de Cacahuète', es: 'Copa de Mantequilla de Maní' },
  'caramel': { fr: 'Caramel', es: 'Caramelo' },
  'salted caramel': { fr: 'Caramel Salé', es: 'Caramelo Salado' },
  'butterscotch': { fr: 'Caramel au Beurre', es: 'Caramelo de Mantequilla' },
  'coffee': { fr: 'Café', es: 'Café' },
  'espresso': { fr: 'Espresso', es: 'Espresso' },
  'mocha': { fr: 'Moka', es: 'Moca' },
  'matcha': { fr: 'Matcha', es: 'Matcha' },
  'green tea': { fr: 'Thé Vert', es: 'Té Verde' },
  'chai': { fr: 'Chaï', es: 'Chai' },
  'cinnamon': { fr: 'Cannelle', es: 'Canela' },
  'ginger': { fr: 'Gingembre', es: 'Jengibre' },
  'lavender': { fr: 'Lavande', es: 'Lavanda' },
  'honey': { fr: 'Miel', es: 'Miel' },
  'maple': { fr: 'Érable', es: 'Arce' },
  'mint': { fr: 'Menthe', es: 'Menta' },
  'peppermint': { fr: 'Menthe Poivrée', es: 'Menta' },

  // Cookies & Candy
  'cookie': { fr: 'Biscuit', es: 'Galleta' },
  'cookies': { fr: 'Biscuits', es: 'Galletas' },
  'cookie dough': { fr: 'Pâte à Biscuit', es: 'Masa de Galleta' },
  'cookies and cream': { fr: 'Biscuits et Crème', es: 'Galletas y Crema' },
  'cookies & cream': { fr: 'Biscuits et Crème', es: 'Galletas y Crema' },
  'oreo': { fr: 'Oreo', es: 'Oreo' },
  'brownie': { fr: 'Brownie', es: 'Brownie' },
  'cheesecake': { fr: 'Cheesecake', es: 'Cheesecake' },
  'cake': { fr: 'Gâteau', es: 'Pastel' },
  'birthday cake': { fr: 'Gâteau d\'Anniversaire', es: 'Pastel de Cumpleaños' },
  'red velvet': { fr: 'Velours Rouge', es: 'Terciopelo Rojo' },
  'fudge': { fr: 'Fondant au Chocolat', es: 'Fudge de Chocolate' },
  'swirl': { fr: 'Tourbillon', es: 'Remolino' },
  'crunch': { fr: 'Croquant', es: 'Crujiente' },
  'chip': { fr: 'Pépite', es: 'Chispa' },
  'chips': { fr: 'Pépites', es: 'Chispas' },
  'cup': { fr: 'Coupe', es: 'Copa' },
  'biscoff': { fr: 'Biscoff', es: 'Biscoff' },
  'nutella': { fr: 'Nutella', es: 'Nutella' },

  // Nuts
  'peanut': { fr: 'Cacahuète', es: 'Maní' },
  'almond': { fr: 'Amande', es: 'Almendra' },
  'pecan': { fr: 'Noix de Pécan', es: 'Nuez Pecana' },
  'walnut': { fr: 'Noix', es: 'Nuez' },
  'hazelnut': { fr: 'Noisette', es: 'Avellana' },
  'pistachio': { fr: 'Pistache', es: 'Pistacho' },
  'macadamia': { fr: 'Macadamia', es: 'Macadamia' },
  'cashew': { fr: 'Cajou', es: 'Anacardo' },

  // Adjectives
  'fresh': { fr: 'Frais', es: 'Fresco' },
  'frozen': { fr: 'Glacé', es: 'Congelado' },
  'creamy': { fr: 'Crémeux', es: 'Cremoso' },
  'rich': { fr: 'Riche', es: 'Rico' },
  'classic': { fr: 'Classique', es: 'Clásico' },
  'ultimate': { fr: 'Ultime', es: 'Máximo' },
  'double': { fr: 'Double', es: 'Doble' },
  'triple': { fr: 'Triple', es: 'Triple' },
  'dark': { fr: 'Noir', es: 'Oscuro' },
  'white': { fr: 'Blanc', es: 'Blanco' },
  'sweet': { fr: 'Sucré', es: 'Dulce' },
  'spiced': { fr: 'Épicé', es: 'Especiado' },
  'toasted': { fr: 'Grillé', es: 'Tostado' },
  'roasted': { fr: 'Torréfié', es: 'Tostado' },
  'loaded': { fr: 'Garni', es: 'Cargado' },
  'simple': { fr: 'Simple', es: 'Simple' },
  'easy': { fr: 'Facile', es: 'Fácil' },
  'homemade': { fr: 'Maison', es: 'Casero' },
  'healthy': { fr: 'Sain', es: 'Saludable' },
  'protein': { fr: 'Protéiné', es: 'Proteico' },
  'vegan': { fr: 'Végan', es: 'Vegano' },
  'dairy-free': { fr: 'Sans Produits Laitiers', es: 'Sin Lácteos' },
  'sugar-free': { fr: 'Sans Sucre', es: 'Sin Azúcar' },
  'low-calorie': { fr: 'Faible en Calories', es: 'Bajo en Calorías' },
  'high-protein': { fr: 'Riche en Protéines', es: 'Alto en Proteínas' },
  'keto': { fr: 'Kéto', es: 'Keto' },
  'tropical': { fr: 'Tropical', es: 'Tropical' },
  'berry': { fr: 'Fruits Rouges', es: 'Frutos Rojos' },
  'mixed berry': { fr: 'Fruits Rouges Mélangés', es: 'Frutos Rojos Mixtos' },

  // Seasonal / Specialty
  'pumpkin': { fr: 'Citrouille', es: 'Calabaza' },
  'pumpkin spice': { fr: 'Épices de Citrouille', es: 'Especias de Calabaza' },
  'gingerbread': { fr: 'Pain d\'Épices', es: 'Pan de Jengibre' },
  'eggnog': { fr: 'Lait de Poule', es: 'Ponche de Huevo' },
  'candy cane': { fr: 'Sucre d\'Orge', es: 'Bastón de Caramelo' },
  'pie': { fr: 'Tarte', es: 'Pastel' },
  'apple pie': { fr: 'Tarte aux Pommes', es: 'Pastel de Manzana' },
  'key lime pie': { fr: 'Tarte au Citron Vert', es: 'Pastel de Lima' },
  'pumpkin pie': { fr: 'Tarte à la Citrouille', es: 'Pastel de Calabaza' },
  'butter pecan': { fr: 'Beurre de Noix de Pécan', es: 'Mantequilla de Nuez Pecana' },
  'rocky road': { fr: 'Rocky Road', es: 'Rocky Road' },
  'dulce de leche': { fr: 'Dulce de Leche', es: 'Dulce de Leche' },
  'tiramisu': { fr: 'Tiramisu', es: 'Tiramisú' },

  // Other dessert words
  'sundae': { fr: 'Sundae', es: 'Sundae' },
  'ripple': { fr: 'Ondulation', es: 'Ondulación' },
  'explosion': { fr: 'Explosion', es: 'Explosión' },
  'dream': { fr: 'Rêve', es: 'Sueño' },
  'delight': { fr: 'Délice', es: 'Delicia' },
  'bliss': { fr: 'Bonheur', es: 'Dicha' },
  'twist': { fr: 'Twist', es: 'Giro' },
  'paradise': { fr: 'Paradis', es: 'Paraíso' },
  'sensation': { fr: 'Sensation', es: 'Sensación' },
  'crumble': { fr: 'Crumble', es: 'Crumble' },
  'chunk': { fr: 'Morceau', es: 'Trozo' },
  'chunks': { fr: 'Morceaux', es: 'Trozos' },
  'marshmallow': { fr: 'Guimauve', es: 'Malvavisco' },
  'pretzel': { fr: 'Bretzel', es: 'Pretzel' },
  'toffee': { fr: 'Caramel', es: 'Toffee' },
  'fudge brownie': { fr: 'Brownie Fondant', es: 'Brownie de Fudge' },

  // Connectors often in titles
  'and': { fr: 'et', es: 'y' },
  '&': { fr: 'et', es: 'y' },
  'with': { fr: 'avec', es: 'con' },
  'n\'': { fr: 'et', es: 'y' },
};

// ============================================================
// STEP / INSTRUCTION TRANSLATION
// ============================================================

// Full-phrase patterns for instructions (checked first, case-insensitive)
const instructionPatterns: { pattern: RegExp; fr: string; es: string }[] = [
  // Freeze patterns
  { pattern: /^freeze for (\d+) hours?\.?$/i, fr: 'Congelez pendant $1 heures.', es: 'Congele durante $1 horas.' },
  { pattern: /^freeze for at least (\d+) hours?\.?$/i, fr: 'Congelez pendant au moins $1 heures.', es: 'Congele durante al menos $1 horas.' },
  { pattern: /^freeze for (\d+)[–-](\d+) hours?\.?$/i, fr: 'Congelez pendant $1 à $2 heures.', es: 'Congele durante $1 a $2 horas.' },
  { pattern: /^freeze (?:the )?(?:mixture |pint )?(?:for )?(?:a minimum of )?24 hours(?:\s*(?:or )?until solid)?\.?$/i, fr: 'Congelez pendant 24 heures ou jusqu\'à ce que ce soit solide.', es: 'Congele durante 24 horas o hasta que esté sólido.' },
  { pattern: /^freeze (?:the )?(?:pint )?(?:container )?(?:for )?overnight(?:,? (?:or )?(?:at least|for a minimum of) (\d+) hours?)?\.?$/i, fr: 'Congelez toute la nuit (au moins 24 heures).', es: 'Congele durante toda la noche (al menos 24 horas).' },
  { pattern: /^cover and freeze for (\d+) hours?\.?$/i, fr: 'Couvrez et congelez pendant $1 heures.', es: 'Cubra y congele durante $1 horas.' },

  // Process patterns
  { pattern: /^process (?:on|using) the ice cream (?:function|setting|program)\.?$/i, fr: 'Traitez en utilisant la fonction Crème Glacée.', es: 'Procese usando la función Helado.' },
  { pattern: /^process (?:on|using) the sorbet (?:function|setting|program)\.?$/i, fr: 'Traitez en utilisant la fonction Sorbet.', es: 'Procese usando la función Sorbete.' },
  { pattern: /^process (?:on|using) the gelato (?:function|setting|program)\.?$/i, fr: 'Traitez en utilisant la fonction Gelato.', es: 'Procese usando la función Gelato.' },
  { pattern: /^process (?:on|using) the frozen yogurt (?:function|setting|program)\.?$/i, fr: 'Traitez en utilisant la fonction Yaourt Glacé.', es: 'Procese usando la función Yogur Helado.' },
  { pattern: /^process (?:on|using) the milkshake (?:function|setting|program)\.?$/i, fr: 'Traitez en utilisant la fonction Milkshake.', es: 'Procese usando la función Batido.' },
  { pattern: /^process (?:on|using) the smoothie bowl (?:function|setting|program)\.?$/i, fr: 'Traitez en utilisant la fonction Bol de Smoothie.', es: 'Procese usando la función Bowl de Smoothie.' },
  { pattern: /^process (?:on|using) the lite ice cream (?:function|setting|program)\.?$/i, fr: 'Traitez en utilisant la fonction Crème Glacée Légère.', es: 'Procese usando la función Helado Ligero.' },
  { pattern: /^process (?:on|using) the italian ice (?:function|setting|program)\.?$/i, fr: 'Traitez en utilisant la fonction Glace Italienne.', es: 'Procese usando la función Hielo Italiano.' },

  // Re-spin
  { pattern: /^re-?spin (?:on|using) the re-?spin (?:function|setting|program)\.?$/i, fr: 'Re-traitez en utilisant la fonction Re-traitement.', es: 'Re-procese usando la función Re-procesado.' },
  { pattern: /^if (?:the )?(?:desired )?(?:texture|consistency) is not (?:reached|achieved|smooth enough)(?:,| )re-?spin\.?$/i, fr: 'Si la texture désirée n\'est pas atteinte, re-traitez.', es: 'Si no se alcanza la textura deseada, re-procese.' },
  { pattern: /^re-?spin if (?:a )?(?:thicker|creamier|smoother) (?:texture|consistency) is (?:desired|wanted)\.?$/i, fr: 'Re-traitez si une texture plus crémeuse est désirée.', es: 'Re-procese si se desea una textura más cremosa.' },

  // Pour patterns
  { pattern: /^pour (?:the )?(?:mixture |base )?into (?:a |the )?ninja creami pint container\.?$/i, fr: 'Versez le mélange dans le contenant du Ninja Creami.', es: 'Vierta la mezcla en el recipiente del Ninja Creami.' },
  { pattern: /^pour into (?:a |the )?ninja creami pint container\.?$/i, fr: 'Versez dans le contenant du Ninja Creami.', es: 'Vierta en el recipiente del Ninja Creami.' },
  { pattern: /^pour (?:the )?(?:mixture |base )?into (?:a |the )?pint container\.?$/i, fr: 'Versez le mélange dans le contenant.', es: 'Vierta la mezcla en el recipiente.' },
  { pattern: /^pour into (?:a |the )?pint container\.?$/i, fr: 'Versez dans le contenant.', es: 'Vierta en el recipiente.' },

  // Whisk / Mix / Stir
  { pattern: /^whisk (?:together )?(?:all )?(?:the )?(?:ingredients|everything) (?:together )?(?:in a (?:large )?bowl )?until (?:well )?(?:combined|mixed|smooth|dissolved)\.?$/i, fr: 'Fouettez tous les ingrédients ensemble jusqu\'à obtenir un mélange homogène.', es: 'Bata todos los ingredientes juntos hasta que estén bien combinados.' },
  { pattern: /^stir (?:together )?(?:all )?(?:the )?(?:ingredients|everything) (?:together )?until (?:well )?(?:combined|mixed|smooth)\.?$/i, fr: 'Mélangez tous les ingrédients ensemble jusqu\'à obtenir un mélange homogène.', es: 'Mezcle todos los ingredientes juntos hasta que estén bien combinados.' },
  { pattern: /^mix (?:together )?(?:all )?(?:the )?(?:ingredients|everything) (?:together )?until (?:well )?(?:combined|mixed|smooth)\.?$/i, fr: 'Mélangez tous les ingrédients ensemble jusqu\'à obtenir un mélange homogène.', es: 'Mezcle todos los ingredientes juntos hasta que estén bien combinados.' },
  { pattern: /^combine (?:all )?(?:the )?(?:ingredients|everything) (?:in a (?:large )?bowl )?(?:and )?(?:stir|mix|whisk) (?:until )?(?:well )?(?:combined|mixed|smooth)\.?$/i, fr: 'Combinez tous les ingrédients et mélangez jusqu\'à obtenir un mélange homogène.', es: 'Combine todos los ingredientes y mezcle hasta que estén bien combinados.' },

  // Add mix-ins
  { pattern: /^add (?:the )?mix-?ins (?:on top|to the top)(?: of the frozen pint)?\.?$/i, fr: 'Ajoutez les garnitures sur le dessus.', es: 'Añada las mezclas por encima.' },
  { pattern: /^add (?:the )?(?:desired )?(?:mix-?ins|toppings) (?:and|then) (?:process|re-?spin)\.?$/i, fr: 'Ajoutez les garnitures puis traitez à nouveau.', es: 'Añada las mezclas y luego procese de nuevo.' },

  // Remove / Install
  { pattern: /^remove (?:the )?pint (?:container )?from (?:the )?freezer\.?$/i, fr: 'Retirez le contenant du congélateur.', es: 'Retire el recipiente del congelador.' },
  { pattern: /^remove (?:the )?lid\.?$/i, fr: 'Retirez le couvercle.', es: 'Retire la tapa.' },
  { pattern: /^install (?:the )?(?:creamerizer )?paddle\.?$/i, fr: 'Installez la pale.', es: 'Instale la paleta.' },
  { pattern: /^(?:place|install) (?:the )?pint (?:container )?(?:in|into) (?:the )?(?:outer )?bowl\.?$/i, fr: 'Placez le contenant dans le bol.', es: 'Coloque el recipiente en el tazón.' },
  { pattern: /^lock (?:the )?lid\.?$/i, fr: 'Verrouillez le couvercle.', es: 'Asegure la tapa.' },
  { pattern: /^turn (?:the )?handle to lock\.?$/i, fr: 'Tournez la poignée pour verrouiller.', es: 'Gire la manija para asegurar.' },

  // Serve
  { pattern: /^serve immediately\.?$/i, fr: 'Servez immédiatement.', es: 'Sirva inmediatamente.' },
  { pattern: /^enjoy!?\.?$/i, fr: 'Dégustez !', es: '¡Disfrute!' },
  { pattern: /^serve and enjoy!?\.?$/i, fr: 'Servez et dégustez !', es: '¡Sirva y disfrute!' },
  { pattern: /^scoop and serve\.?$/i, fr: 'Formez des boules et servez.', es: 'Sirva en bolas.' },
];

// Word/phrase replacements for instructions (applied after pattern matching fails)
const instructionWordMap: Record<string, { fr: string; es: string }> = {
  'whisk': { fr: 'fouettez', es: 'bata' },
  'stir': { fr: 'mélangez', es: 'mezcle' },
  'mix': { fr: 'mélangez', es: 'mezcle' },
  'blend': { fr: 'mélangez', es: 'mezcle' },
  'combine': { fr: 'combinez', es: 'combine' },
  'pour': { fr: 'versez', es: 'vierta' },
  'add': { fr: 'ajoutez', es: 'añada' },
  'place': { fr: 'placez', es: 'coloque' },
  'put': { fr: 'mettez', es: 'ponga' },
  'freeze': { fr: 'congelez', es: 'congele' },
  'process': { fr: 'traitez', es: 'procese' },
  're-spin': { fr: 're-traitez', es: 're-procese' },
  'respin': { fr: 're-traitez', es: 're-procese' },
  'remove': { fr: 'retirez', es: 'retire' },
  'install': { fr: 'installez', es: 'instale' },
  'lock': { fr: 'verrouillez', es: 'asegure' },
  'turn': { fr: 'tournez', es: 'gire' },
  'serve': { fr: 'servez', es: 'sirva' },
  'scoop': { fr: 'formez des boules', es: 'sirva con cuchara' },
  'enjoy': { fr: 'dégustez', es: 'disfrute' },
  'let': { fr: 'laissez', es: 'deje' },
  'allow': { fr: 'laissez', es: 'permita' },
  'wait': { fr: 'attendez', es: 'espere' },
  'heat': { fr: 'chauffez', es: 'caliente' },
  'warm': { fr: 'réchauffez', es: 'caliente' },
  'cool': { fr: 'refroidissez', es: 'enfríe' },
  'chill': { fr: 'réfrigérez', es: 'enfríe' },
  'refrigerate': { fr: 'réfrigérez', es: 'refrigere' },
  'melt': { fr: 'faites fondre', es: 'derrita' },
  'dissolve': { fr: 'dissolvez', es: 'disuelva' },
  'crush': { fr: 'écrasez', es: 'triture' },
  'chop': { fr: 'hachez', es: 'pique' },
  'slice': { fr: 'tranchez', es: 'corte' },
  'cut': { fr: 'coupez', es: 'corte' },
  'fold': { fr: 'incorporez', es: 'incorpore' },
  'drizzle': { fr: 'arrosez', es: 'rocíe' },
  'spread': { fr: 'étalez', es: 'unte' },
  'sprinkle': { fr: 'saupoudrez', es: 'espolvoree' },
  'top': { fr: 'garnissez', es: 'cubra' },
  'cover': { fr: 'couvrez', es: 'cubra' },
  'strain': { fr: 'filtrez', es: 'cuele' },
  'puree': { fr: 'réduisez en purée', es: 'haga puré' },
  'mash': { fr: 'écrasez', es: 'aplaste' },
  'taste': { fr: 'goûtez', es: 'pruebe' },
  'adjust': { fr: 'ajustez', es: 'ajuste' },

  // Nouns in instructions
  'mixture': { fr: 'mélange', es: 'mezcla' },
  'base': { fr: 'base', es: 'base' },
  'bowl': { fr: 'bol', es: 'tazón' },
  'large bowl': { fr: 'grand bol', es: 'tazón grande' },
  'medium bowl': { fr: 'bol moyen', es: 'tazón mediano' },
  'small bowl': { fr: 'petit bol', es: 'tazón pequeño' },
  'saucepan': { fr: 'casserole', es: 'cacerola' },
  'blender': { fr: 'mixeur', es: 'licuadora' },
  'food processor': { fr: 'robot culinaire', es: 'procesador de alimentos' },
  'microwave': { fr: 'micro-ondes', es: 'microondas' },
  'stovetop': { fr: 'cuisinière', es: 'estufa' },
  'pint container': { fr: 'contenant', es: 'recipiente' },
  'ninja creami pint container': { fr: 'contenant du Ninja Creami', es: 'recipiente del Ninja Creami' },
  'pint': { fr: 'contenant', es: 'recipiente' },
  'container': { fr: 'contenant', es: 'recipiente' },
  'lid': { fr: 'couvercle', es: 'tapa' },
  'paddle': { fr: 'pale', es: 'paleta' },
  'creamerizer paddle': { fr: 'pale Creamerizer', es: 'paleta Creamerizer' },
  'outer bowl': { fr: 'bol extérieur', es: 'tazón exterior' },
  'handle': { fr: 'poignée', es: 'manija' },
  'mix-ins': { fr: 'garnitures', es: 'mezclas' },
  'mixins': { fr: 'garnitures', es: 'mezclas' },
  'toppings': { fr: 'garnitures', es: 'coberturas' },
  'ingredients': { fr: 'ingrédients', es: 'ingredientes' },
  'sugar': { fr: 'sucre', es: 'azúcar' },
  'cream': { fr: 'crème', es: 'crema' },
  'milk': { fr: 'lait', es: 'leche' },
  'ice cream': { fr: 'crème glacée', es: 'helado' },
  'sorbet': { fr: 'sorbet', es: 'sorbete' },
  'gelato': { fr: 'gelato', es: 'gelato' },
  'frozen yogurt': { fr: 'yaourt glacé', es: 'yogur helado' },
  'milkshake': { fr: 'milkshake', es: 'batido' },
  'smoothie bowl': { fr: 'bol de smoothie', es: 'bowl de smoothie' },
  'italian ice': { fr: 'glace italienne', es: 'hielo italiano' },
  'texture': { fr: 'texture', es: 'textura' },
  'consistency': { fr: 'consistance', es: 'consistencia' },
  'desired': { fr: 'désirée', es: 'deseada' },
  'smooth': { fr: 'lisse', es: 'suave' },
  'creamy': { fr: 'crémeux', es: 'cremoso' },
  'thick': { fr: 'épais', es: 'espeso' },
  'until': { fr: 'jusqu\'à ce que', es: 'hasta que' },
  'well combined': { fr: 'bien mélangé', es: 'bien combinado' },
  'dissolved': { fr: 'dissous', es: 'disuelto' },
  'combined': { fr: 'combiné', es: 'combinado' },
  'mixed': { fr: 'mélangé', es: 'mezclado' },
  'incorporated': { fr: 'incorporé', es: 'incorporado' },
  'minutes': { fr: 'minutes', es: 'minutos' },
  'hours': { fr: 'heures', es: 'horas' },
  'overnight': { fr: 'toute la nuit', es: 'toda la noche' },
  'room temperature': { fr: 'température ambiante', es: 'temperatura ambiente' },
  'on top': { fr: 'sur le dessus', es: 'por encima' },
  'on the bottom': { fr: 'au fond', es: 'en el fondo' },
  'immediately': { fr: 'immédiatement', es: 'inmediatamente' },
  'completely': { fr: 'complètement', es: 'completamente' },
  'thoroughly': { fr: 'soigneusement', es: 'completamente' },
  'gently': { fr: 'délicatement', es: 'suavemente' },
  'slowly': { fr: 'lentement', es: 'lentamente' },
  'together': { fr: 'ensemble', es: 'juntos' },
  'optional': { fr: 'facultatif', es: 'opcional' },
  'to taste': { fr: 'selon le goût', es: 'al gusto' },
  'if desired': { fr: 'si désiré', es: 'si se desea' },
  'as needed': { fr: 'au besoin', es: 'según sea necesario' },

  // Connectors
  'and': { fr: 'et', es: 'y' },
  'or': { fr: 'ou', es: 'o' },
  'then': { fr: 'puis', es: 'luego' },
  'the': { fr: 'le', es: 'el' },
  'a': { fr: 'un', es: 'un' },
  'an': { fr: 'un', es: 'un' },
  'in': { fr: 'dans', es: 'en' },
  'into': { fr: 'dans', es: 'en' },
  'from': { fr: 'de', es: 'de' },
  'to': { fr: 'à', es: 'a' },
  'for': { fr: 'pendant', es: 'durante' },
  'with': { fr: 'avec', es: 'con' },
  'on': { fr: 'sur', es: 'en' },
  'at': { fr: 'à', es: 'a' },
  'of': { fr: 'de', es: 'de' },
  'is': { fr: 'est', es: 'es' },
  'are': { fr: 'sont', es: 'son' },
  'not': { fr: 'pas', es: 'no' },
  'if': { fr: 'si', es: 'si' },
  'all': { fr: 'tous les', es: 'todos los' },
};

// Hint translations (common tips)
const hintPatterns: { pattern: RegExp; fr: string; es: string }[] = [
  { pattern: /^do not fill past the max line\.?$/i, fr: 'Ne pas dépasser la ligne de remplissage maximum.', es: 'No llenar más allá de la línea máxima.' },
  { pattern: /^(?:make sure to )?(?:do not|don't) overfill\.?$/i, fr: 'Ne pas trop remplir.', es: 'No llenar en exceso.' },
  { pattern: /^(?:the )?(?:sugar|sweetener) helps prevent (?:ice|icy) crystals?\.?$/i, fr: 'Le sucre aide à prévenir la formation de cristaux de glace.', es: 'El azúcar ayuda a prevenir los cristales de hielo.' },
  { pattern: /^(?:you can )?use (?:any|your favorite) milk\.?$/i, fr: 'Vous pouvez utiliser n\'importe quel lait.', es: 'Puede usar cualquier leche.' },
  { pattern: /^(?:this|the base) can (?:also )?be made ahead\.?$/i, fr: 'Ceci peut être préparé à l\'avance.', es: 'Esto se puede preparar con anticipación.' },
  { pattern: /^(?:for )?best results(?:,)? (?:use|freeze).*$/i, fr: 'Pour de meilleurs résultats, congelez au moins 24 heures.', es: 'Para mejores resultados, congele al menos 24 horas.' },
  { pattern: /^(?:a )?re-?spin (?:may be|is) (?:needed|required|helpful) (?:for|to get) (?:a )?(?:creamier|smoother|better) (?:texture|consistency|results?)\.?$/i, fr: 'Un re-traitement peut être nécessaire pour une texture plus crémeuse.', es: 'Un re-procesado puede ser necesario para una textura más cremosa.' },
  { pattern: /^(?:the|this) (?:recipe|base) (?:works|is compatible) with (?:all|any|the) (?:ninja creami )?models?\.?$/i, fr: 'Cette recette est compatible avec tous les modèles Ninja Creami.', es: 'Esta receta es compatible con todos los modelos Ninja Creami.' },
  { pattern: /^(?:let|allow) (?:the )?pint (?:to )?sit (?:on the counter )?for (\d+)[–-]?(\d+)? minutes? before processing\.?$/i, fr: 'Laissez le contenant reposer quelques minutes avant de traiter.', es: 'Deje reposar el recipiente unos minutos antes de procesar.' },
];

// ============================================================
// DESCRIPTION TRANSLATION HELPERS
// ============================================================

// Description phrase translations
const descriptionPhraseMap: Record<string, { fr: string; es: string }> = {
  'creamy and delicious': { fr: 'crémeux et délicieux', es: 'cremoso y delicioso' },
  'rich and creamy': { fr: 'riche et crémeux', es: 'rico y cremoso' },
  'smooth and creamy': { fr: 'lisse et crémeux', es: 'suave y cremoso' },
  'light and refreshing': { fr: 'léger et rafraîchissant', es: 'ligero y refrescante' },
  'sweet and tangy': { fr: 'sucré et acidulé', es: 'dulce y ácido' },
  'perfectly balanced': { fr: 'parfaitement équilibré', es: 'perfectamente equilibrado' },
  'made with': { fr: 'préparé avec', es: 'hecho con' },
  'packed with': { fr: 'rempli de', es: 'lleno de' },
  'loaded with': { fr: 'garni de', es: 'cargado de' },
  'topped with': { fr: 'garni de', es: 'cubierto con' },
  'swirled with': { fr: 'tourbillonné avec', es: 'con remolinos de' },
  'mixed with': { fr: 'mélangé avec', es: 'mezclado con' },
  'blended with': { fr: 'mélangé avec', es: 'mezclado con' },
  'perfect for': { fr: 'parfait pour', es: 'perfecto para' },
  'great for': { fr: 'idéal pour', es: 'ideal para' },
  'a classic': { fr: 'un classique', es: 'un clásico' },
  'a twist on': { fr: 'une variante de', es: 'una variante de' },
  'inspired by': { fr: 'inspiré par', es: 'inspirado en' },
  'homemade': { fr: 'fait maison', es: 'casero' },
  'ninja creami': { fr: 'Ninja Creami', es: 'Ninja Creami' },
  'ice cream': { fr: 'crème glacée', es: 'helado' },
  'frozen yogurt': { fr: 'yaourt glacé', es: 'yogur helado' },
  'sorbet': { fr: 'sorbet', es: 'sorbete' },
  'gelato': { fr: 'gelato', es: 'gelato' },
  'milkshake': { fr: 'milkshake', es: 'batido' },
  'smoothie bowl': { fr: 'bol de smoothie', es: 'bowl de smoothie' },
  'italian ice': { fr: 'glace italienne', es: 'hielo italiano' },
  'this recipe': { fr: 'cette recette', es: 'esta receta' },
  'this delicious': { fr: 'ce délicieux', es: 'este delicioso' },
  'summer': { fr: 'été', es: 'verano' },
  'winter': { fr: 'hiver', es: 'invierno' },
  'fall': { fr: 'automne', es: 'otoño' },
  'spring': { fr: 'printemps', es: 'primavera' },
  'a hot day': { fr: 'une journée chaude', es: 'un día caluroso' },
  'hot summer day': { fr: 'journée chaude d\'été', es: 'día caluroso de verano' },
  'the whole family': { fr: 'toute la famille', es: 'toda la familia' },
  'everyone': { fr: 'tout le monde', es: 'todos' },
  'kids and adults alike': { fr: 'enfants et adultes', es: 'niños y adultos' },
  'chocolate lover': { fr: 'amateur de chocolat', es: 'amante del chocolate' },
  'chocolate lovers': { fr: 'amateurs de chocolat', es: 'amantes del chocolate' },
  'easy to make': { fr: 'facile à préparer', es: 'fácil de preparar' },
  'simple to make': { fr: 'simple à préparer', es: 'sencillo de preparar' },
  'quick and easy': { fr: 'rapide et facile', es: 'rápido y fácil' },
  'few ingredients': { fr: 'peu d\'ingrédients', es: 'pocos ingredientes' },
  'no churn': { fr: 'sans baratte', es: 'sin batir' },
  'low calorie': { fr: 'faible en calories', es: 'bajo en calorías' },
  'high protein': { fr: 'riche en protéines', es: 'alto en proteínas' },
  'dairy free': { fr: 'sans produits laitiers', es: 'sin lácteos' },
  'dairy-free': { fr: 'sans produits laitiers', es: 'sin lácteos' },
  'sugar free': { fr: 'sans sucre', es: 'sin azúcar' },
  'sugar-free': { fr: 'sans sucre', es: 'sin azúcar' },
  'gluten free': { fr: 'sans gluten', es: 'sin gluten' },
  'gluten-free': { fr: 'sans gluten', es: 'sin gluten' },
  'vegan': { fr: 'végan', es: 'vegano' },
  'keto': { fr: 'kéto', es: 'keto' },
  'keto friendly': { fr: 'adapté au régime kéto', es: 'apto para keto' },
  'keto-friendly': { fr: 'adapté au régime kéto', es: 'apto para keto' },
};

// ============================================================
// TRANSLATION FUNCTIONS
// ============================================================

function translateIngredientName(name: string, locale: Locale): string {
  const lower = name.toLowerCase().trim();

  // Direct match
  if (ingredientMap[lower]) {
    return ingredientMap[lower][locale];
  }

  // Try removing leading descriptors like "softened", "melted", "chopped", etc.
  const descriptorPatterns = [
    /^(softened|melted|chilled|cold|warm|hot|room temperature|frozen|thawed|drained|rinsed|cooled|packed|loosely packed|firmly packed|lightly|finely|coarsely|roughly)\s+/i,
    /,?\s*(softened|melted|chilled|cold|warm|at room temperature|frozen|thawed|drained|to taste|divided|optional|chopped|diced|sliced|minced|crushed|crumbled|mashed|pureed|sifted|toasted|roasted)$/i,
  ];

  let cleaned = lower;
  for (const dp of descriptorPatterns) {
    cleaned = cleaned.replace(dp, '').trim();
  }

  if (ingredientMap[cleaned]) {
    // Re-apply descriptors translated
    const descriptorMap: Record<string, { fr: string; es: string }> = {
      'softened': { fr: 'ramolli', es: 'ablandado' },
      'melted': { fr: 'fondu', es: 'derretido' },
      'chilled': { fr: 'réfrigéré', es: 'enfriado' },
      'cold': { fr: 'froid', es: 'frío' },
      'warm': { fr: 'tiède', es: 'tibio' },
      'hot': { fr: 'chaud', es: 'caliente' },
      'room temperature': { fr: 'à température ambiante', es: 'a temperatura ambiente' },
      'frozen': { fr: 'surgelé', es: 'congelado' },
      'thawed': { fr: 'décongelé', es: 'descongelado' },
      'drained': { fr: 'égoutté', es: 'escurrido' },
      'chopped': { fr: 'haché', es: 'picado' },
      'diced': { fr: 'en dés', es: 'en cubitos' },
      'sliced': { fr: 'tranché', es: 'rebanado' },
      'minced': { fr: 'émincé', es: 'picado finamente' },
      'crushed': { fr: 'écrasé', es: 'triturado' },
      'crumbled': { fr: 'émietté', es: 'desmenuzado' },
      'mashed': { fr: 'écrasé', es: 'aplastado' },
      'pureed': { fr: 'en purée', es: 'en puré' },
      'sifted': { fr: 'tamisé', es: 'tamizado' },
      'toasted': { fr: 'grillé', es: 'tostado' },
      'roasted': { fr: 'torréfié', es: 'tostado' },
      'divided': { fr: 'divisé', es: 'dividido' },
      'optional': { fr: 'facultatif', es: 'opcional' },
      'to taste': { fr: 'selon le goût', es: 'al gusto' },
      'packed': { fr: 'tassé', es: 'compacto' },
      'finely': { fr: 'finement', es: 'finamente' },
      'coarsely': { fr: 'grossièrement', es: 'grueso' },
      'roughly': { fr: 'grossièrement', es: 'aproximadamente' },
    };

    let result = ingredientMap[cleaned][locale];
    // Check if original had trailing descriptor
    const trailingMatch = lower.match(/,?\s*(softened|melted|chilled|chopped|diced|sliced|minced|crushed|crumbled|divided|optional|to taste|toasted|roasted)$/i);
    if (trailingMatch) {
      const desc = trailingMatch[1].toLowerCase();
      if (descriptorMap[desc]) {
        result += `, ${descriptorMap[desc][locale]}`;
      }
    }
    return result;
  }

  // Fallback: try partial matching from longest to shortest keys
  const sortedKeys = Object.keys(ingredientMap).sort((a, b) => b.length - a.length);
  for (const key of sortedKeys) {
    if (lower.includes(key)) {
      // Replace the matching part
      const translated = ingredientMap[key][locale];
      const before = lower.substring(0, lower.indexOf(key)).trim();
      const after = lower.substring(lower.indexOf(key) + key.length).trim();
      let result = translated;
      if (before) result = before + ' ' + result;
      if (after) result = result + ' ' + after;
      return result;
    }
  }

  // Ultimate fallback: return original
  return name;
}

function translateTitle(title: string, locale: Locale): string {
  let result = title;

  // First try multi-word base type replacements (longest first)
  const sortedBaseKeys = Object.keys(baseTitleMap).sort((a, b) => b.length - a.length);
  for (const key of sortedBaseKeys) {
    const regex = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    if (regex.test(result)) {
      result = result.replace(regex, baseTitleMap[key][locale]);
      break; // Only replace one base type
    }
  }

  // Then multi-word title phrases (longest first)
  const sortedTitleKeys = Object.keys(titleWordMap).sort((a, b) => b.length - a.length);
  for (const key of sortedTitleKeys) {
    const regex = new RegExp(`\\b${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    result = result.replace(regex, (match) => {
      const trans = titleWordMap[key][locale];
      // Preserve original casing style (all caps, title case, etc.)
      if (match === match.toUpperCase()) return trans.toUpperCase();
      return trans;
    });
  }

  return result;
}

function translateInstruction(instruction: string, locale: Locale): string {
  // Try exact pattern matches first
  for (const { pattern, fr, es } of instructionPatterns) {
    const match = instruction.match(pattern);
    if (match) {
      let result = locale === 'fr' ? fr : es;
      // Replace capture groups
      for (let i = 1; i < match.length; i++) {
        if (match[i] !== undefined) {
          result = result.replace(`$${i}`, match[i]);
        }
      }
      return result;
    }
  }

  // Word-by-word replacement as fallback
  let result = instruction;

  // Multi-word phrases first (sorted by length descending)
  const sortedKeys = Object.keys(instructionWordMap).sort((a, b) => b.length - a.length);
  for (const key of sortedKeys) {
    if (key.length < 3 && !/^(or|of|in|to|at|a|an|is)$/i.test(key)) continue; // Skip very short non-connectors in multi-pass
    const regex = new RegExp(`\\b${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    result = result.replace(regex, instructionWordMap[key][locale]);
  }

  // Keep "Ninja Creami" intact
  result = result.replace(/ninja creami/gi, 'Ninja Creami');

  return result;
}

function translateHint(hint: string, locale: Locale): string {
  // Try exact pattern matches
  for (const { pattern, fr, es } of hintPatterns) {
    const match = hint.match(pattern);
    if (match) {
      let result = locale === 'fr' ? fr : es;
      for (let i = 1; i < match.length; i++) {
        if (match[i] !== undefined) {
          result = result.replace(`$${i}`, match[i]);
        }
      }
      return result;
    }
  }

  // Fallback: use instruction translator
  return translateInstruction(hint, locale);
}

function translateDescription(description: string, locale: Locale): string {
  let result = description;

  // Multi-word phrase replacements first (longest first)
  const sortedKeys = Object.keys(descriptionPhraseMap).sort((a, b) => b.length - a.length);
  for (const key of sortedKeys) {
    const regex = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    result = result.replace(regex, descriptionPhraseMap[key][locale]);
  }

  // Then instruction-level word map for remaining words
  const sortedWordKeys = Object.keys(instructionWordMap).sort((a, b) => b.length - a.length);
  for (const key of sortedWordKeys) {
    const regex = new RegExp(`\\b${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    result = result.replace(regex, instructionWordMap[key][locale]);
  }

  // Title word map for any remaining flavor/descriptor words
  const sortedTitleKeys = Object.keys(titleWordMap).sort((a, b) => b.length - a.length);
  for (const key of sortedTitleKeys) {
    const regex = new RegExp(`\\b${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    result = result.replace(regex, (match) => {
      const trans = titleWordMap[key.toLowerCase()]?.[locale];
      if (!trans) return match;
      // Use lowercase for descriptions
      return trans.toLowerCase();
    });
  }

  // Preserve brand names
  result = result.replace(/ninja creami/gi, 'Ninja Creami');

  return result;
}

// ============================================================
// MAIN SCRIPT
// ============================================================

interface DBRecipe {
  id: string;
  title: string;
  description: string;
}

interface DBStep {
  recipe_id: string;
  step_number: number;
  instruction: string;
  hint: string | null;
}

interface DBIngredient {
  recipe_id: string;
  name: string;
  amount: string;
  unit: string | null;
  sort_order: number;
}

async function main() {
  console.log('Starting recipe translation...\n');

  // 1. Fetch all recipes
  console.log('Fetching recipes...');
  const { data: recipes, error: recErr } = await supabase
    .from('recipes')
    .select('id, title, description')
    .order('id');

  if (recErr || !recipes) {
    console.error('Failed to fetch recipes:', recErr);
    process.exit(1);
  }
  console.log(`Found ${recipes.length} recipes.\n`);

  // 2. Fetch all steps
  console.log('Fetching steps...');
  const { data: allSteps, error: stepErr } = await supabase
    .from('steps')
    .select('recipe_id, step_number, instruction, hint')
    .order('step_number');

  if (stepErr || !allSteps) {
    console.error('Failed to fetch steps:', stepErr);
    process.exit(1);
  }
  console.log(`Found ${allSteps.length} steps.\n`);

  // 3. Fetch all ingredients
  console.log('Fetching ingredients...');
  const { data: allIngredients, error: ingErr } = await supabase
    .from('ingredients')
    .select('recipe_id, name, amount, unit, sort_order')
    .order('sort_order');

  if (ingErr || !allIngredients) {
    console.error('Failed to fetch ingredients:', ingErr);
    process.exit(1);
  }
  console.log(`Found ${allIngredients.length} ingredients.\n`);

  // Index by recipe_id
  const stepsByRecipe = new Map<string, DBStep[]>();
  for (const s of allSteps as DBStep[]) {
    if (!stepsByRecipe.has(s.recipe_id)) stepsByRecipe.set(s.recipe_id, []);
    stepsByRecipe.get(s.recipe_id)!.push(s);
  }

  const ingredientsByRecipe = new Map<string, DBIngredient[]>();
  for (const ing of allIngredients as DBIngredient[]) {
    if (!ingredientsByRecipe.has(ing.recipe_id)) ingredientsByRecipe.set(ing.recipe_id, []);
    ingredientsByRecipe.get(ing.recipe_id)!.push(ing);
  }

  // 4. Generate translations and insert in batches
  const BATCH_SIZE = 50;
  const locales: Locale[] = ['fr', 'es'];
  let totalInserted = 0;

  for (let i = 0; i < recipes.length; i += BATCH_SIZE) {
    const batch = recipes.slice(i, i + BATCH_SIZE);
    const rows: any[] = [];

    for (const recipe of batch as DBRecipe[]) {
      const steps = stepsByRecipe.get(recipe.id) || [];
      const ingredients = ingredientsByRecipe.get(recipe.id) || [];

      for (const locale of locales) {
        const translatedTitle = translateTitle(recipe.title, locale);
        const translatedDescription = translateDescription(recipe.description, locale);

        const translatedSteps = steps
          .sort((a, b) => a.step_number - b.step_number)
          .map((s) => ({
            instruction: translateInstruction(s.instruction, locale),
            hint: s.hint ? translateHint(s.hint, locale) : null,
          }));

        const translatedIngredients = ingredients
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((ing) => ({
            name: translateIngredientName(ing.name, locale),
            amount: ing.amount,
            unit: ing.unit,
          }));

        rows.push({
          recipe_id: recipe.id,
          locale,
          title: translatedTitle,
          description: translatedDescription,
          steps: translatedSteps,
          ingredients: translatedIngredients,
        });
      }
    }

    // Upsert batch
    const { error: upsertErr } = await supabase
      .from('recipe_translations')
      .upsert(rows, { onConflict: 'recipe_id,locale' });

    if (upsertErr) {
      console.error(`Error upserting batch ${i / BATCH_SIZE + 1}:`, upsertErr);
      // Continue with next batch instead of aborting
    } else {
      totalInserted += rows.length;
      console.log(`Batch ${Math.floor(i / BATCH_SIZE) + 1}: inserted ${rows.length} translations (recipes ${i + 1}–${Math.min(i + BATCH_SIZE, recipes.length)})`);
    }
  }

  console.log(`\nTotal translations inserted/updated: ${totalInserted}`);

  // 5. Verify counts
  console.log('\nVerifying...');
  const { count: frCount } = await supabase
    .from('recipe_translations')
    .select('*', { count: 'exact', head: true })
    .eq('locale', 'fr');

  const { count: esCount } = await supabase
    .from('recipe_translations')
    .select('*', { count: 'exact', head: true })
    .eq('locale', 'es');

  const { count: totalCount } = await supabase
    .from('recipe_translations')
    .select('*', { count: 'exact', head: true });

  console.log(`French translations: ${frCount}`);
  console.log(`Spanish translations: ${esCount}`);
  console.log(`Total translations: ${totalCount}`);

  // Show a sample
  const { data: sample } = await supabase
    .from('recipe_translations')
    .select('recipe_id, locale, title, description')
    .limit(4);

  if (sample) {
    console.log('\nSample translations:');
    for (const s of sample) {
      console.log(`  [${s.locale}] ${s.title}`);
      console.log(`       ${s.description?.substring(0, 100)}...`);
    }
  }

  console.log('\nDone!');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
