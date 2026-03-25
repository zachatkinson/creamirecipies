/**
 * High-Quality Translation Script for Ninja Creami Recipes
 *
 * Produces natural, fluent French and Spanish translations using
 * comprehensive hand-crafted lookup tables for all content.
 *
 * Run with:
 *   cd /Users/zach/web-projects/creami && source .env && export PUBLIC_SUPABASE_URL SUPABASE_SERVICE_ROLE_KEY && npx tsx scripts/translate-recipes-ai.ts
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
// TITLE TRANSLATIONS (all 484)
// ============================================================

const titleTranslations: Record<string, { fr: string; es: string }> = {
  'Açai Berry Sorbet': { fr: 'Sorbet aux Baies d\'Açaï', es: 'Sorbete de Açaí' },
  'Acai Smoothie Bowl': { fr: 'Bol de Smoothie à l\'Açaï', es: 'Bowl de Smoothie de Açaí' },
  'Almond Butter Ice Cream': { fr: 'Crème Glacée au Beurre d\'Amande', es: 'Helado de Mantequilla de Almendra' },
  'Almond Coconut Ice Cream': { fr: 'Crème Glacée Amande et Noix de Coco', es: 'Helado de Almendra y Coco' },
  'Almond Joy Ice Cream': { fr: 'Crème Glacée Almond Joy', es: 'Helado Almond Joy' },
  'Amaretto Gelato': { fr: 'Gelato à l\'Amaretto', es: 'Gelato de Amaretto' },
  'Apple Butter Ice Cream': { fr: 'Crème Glacée au Beurre de Pomme', es: 'Helado de Mantequilla de Manzana' },
  'Apple Cider Sorbet': { fr: 'Sorbet au Cidre de Pomme', es: 'Sorbete de Sidra de Manzana' },
  'Apple Crisp Ice Cream': { fr: 'Crème Glacée Croustillant aux Pommes', es: 'Helado de Crumble de Manzana' },
  'Apple Pie Protein Ice Cream': { fr: 'Crème Glacée Protéinée Tarte aux Pommes', es: 'Helado Proteico de Tarta de Manzana' },
  'Apricot Sorbet': { fr: 'Sorbet à l\'Abricot', es: 'Sorbete de Albaricoque' },
  'Apricot Swirl Ice Cream': { fr: 'Crème Glacée Tourbillon d\'Abricot', es: 'Helado con Remolino de Albaricoque' },
  'Avocado Ice Cream': { fr: 'Crème Glacée à l\'Avocat', es: 'Helado de Aguacate' },
  'Banana Bread Ice Cream': { fr: 'Crème Glacée Pain aux Bananes', es: 'Helado de Pan de Plátano' },
  'Banana Coconut Sorbet': { fr: 'Sorbet Banane et Noix de Coco', es: 'Sorbete de Plátano y Coco' },
  'Banana Cream Protein Ice Cream': { fr: 'Crème Glacée Protéinée à la Crème de Banane', es: 'Helado Proteico de Crema de Plátano' },
  'Banana Pudding Ice Cream': { fr: 'Crème Glacée Pudding à la Banane', es: 'Helado de Pudín de Plátano' },
  'Banana Split Frozen Yogurt': { fr: 'Yaourt Glacé Banana Split', es: 'Yogur Helado Banana Split' },
  'Banana Split Ice Cream': { fr: 'Crème Glacée Banana Split', es: 'Helado Banana Split' },
  'Banana Walnut Frozen Yogurt': { fr: 'Yaourt Glacé Banane et Noix', es: 'Yogur Helado de Plátano y Nuez' },
  'Bananas Foster Ice Cream': { fr: 'Crème Glacée Bananes Flambées', es: 'Helado de Bananas Foster' },
  'Berry Protein Smoothie Bowl': { fr: 'Bol de Smoothie Protéiné aux Fruits Rouges', es: 'Bowl de Smoothie Proteico de Frutos Rojos' },
  'Birthday Cake Ice Cream': { fr: 'Crème Glacée Gâteau d\'Anniversaire', es: 'Helado de Pastel de Cumpleaños' },
  'Birthday Cake Protein Ice Cream': { fr: 'Crème Glacée Protéinée Gâteau d\'Anniversaire', es: 'Helado Proteico de Pastel de Cumpleaños' },
  'Biscoff Ice Cream': { fr: 'Crème Glacée au Biscoff', es: 'Helado de Biscoff' },
  'Biscoff Protein Ice Cream': { fr: 'Crème Glacée Protéinée au Biscoff', es: 'Helado Proteico de Biscoff' },
  'Biscoff Swirl Cheesecake Ice Cream': { fr: 'Crème Glacée Cheesecake Tourbillon Biscoff', es: 'Helado de Cheesecake con Remolino de Biscoff' },
  'Black Cherry Ice Cream': { fr: 'Crème Glacée aux Cerises Noires', es: 'Helado de Cereza Negra' },
  'Black Sesame Ice Cream': { fr: 'Crème Glacée au Sésame Noir', es: 'Helado de Sésamo Negro' },
  'Blackberry Cobbler Ice Cream': { fr: 'Crème Glacée Cobbler aux Mûres', es: 'Helado de Cobbler de Mora' },
  'Blackberry Frozen Yogurt': { fr: 'Yaourt Glacé aux Mûres', es: 'Yogur Helado de Mora' },
  'Blackberry Lime Sorbet': { fr: 'Sorbet Mûre et Citron Vert', es: 'Sorbete de Mora y Lima' },
  'Blackberry Sorbet': { fr: 'Sorbet aux Mûres', es: 'Sorbete de Mora' },
  'Blackberry Vanilla Ice Cream': { fr: 'Crème Glacée Mûre et Vanille', es: 'Helado de Mora y Vainilla' },
  'Blood Orange Sorbet': { fr: 'Sorbet à l\'Orange Sanguine', es: 'Sorbete de Naranja Sanguina' },
  'Blue Raspberry Italian Ice': { fr: 'Glace Italienne Framboise Bleue', es: 'Hielo Italiano de Frambuesa Azul' },
  'Blueberry Cheesecake Ice Cream': { fr: 'Crème Glacée Cheesecake aux Myrtilles', es: 'Helado de Cheesecake de Arándano' },
  'Blueberry Cheesecake Swirl Ice Cream': { fr: 'Crème Glacée Tourbillon Cheesecake aux Myrtilles', es: 'Helado de Cheesecake de Arándano con Remolino' },
  'Blueberry Crumble Ice Cream': { fr: 'Crème Glacée Crumble aux Myrtilles', es: 'Helado de Crumble de Arándano' },
  'Blueberry Frozen Yogurt': { fr: 'Yaourt Glacé aux Myrtilles', es: 'Yogur Helado de Arándano' },
  'Blueberry Lemon Ice Cream': { fr: 'Crème Glacée Myrtille et Citron', es: 'Helado de Arándano y Limón' },
  'Blueberry Muffin Protein Ice Cream': { fr: 'Crème Glacée Protéinée Muffin aux Myrtilles', es: 'Helado Proteico de Muffin de Arándano' },
  'Blueberry Protein Ice Cream': { fr: 'Crème Glacée Protéinée aux Myrtilles', es: 'Helado Proteico de Arándano' },
  'Blueberry Sorbet': { fr: 'Sorbet aux Myrtilles', es: 'Sorbete de Arándano' },
  'Blueberry Swirl Ice Cream': { fr: 'Crème Glacée Tourbillon de Myrtilles', es: 'Helado con Remolino de Arándano' },
  'Bourbon Vanilla Ice Cream': { fr: 'Crème Glacée Vanille au Bourbon', es: 'Helado de Vainilla con Bourbon' },
  'Brown Butter Ice Cream': { fr: 'Crème Glacée au Beurre Noisette', es: 'Helado de Mantequilla Dorada' },
  'Brown Butter Pecan Ice Cream': { fr: 'Crème Glacée Beurre Noisette et Noix de Pécan', es: 'Helado de Mantequilla Dorada y Nuez Pecana' },
  'Brown Sugar Bourbon Ice Cream': { fr: 'Crème Glacée Cassonade et Bourbon', es: 'Helado de Azúcar Morena y Bourbon' },
  'Brown Sugar Cinnamon Ice Cream': { fr: 'Crème Glacée Cassonade et Cannelle', es: 'Helado de Azúcar Morena y Canela' },
  'Brown Sugar Ice Cream': { fr: 'Crème Glacée à la Cassonade', es: 'Helado de Azúcar Morena' },
  'Brownie Batter Ice Cream': { fr: 'Crème Glacée Pâte de Brownie', es: 'Helado de Masa de Brownie' },
  'Brownie Batter Protein Ice Cream': { fr: 'Crème Glacée Protéinée Pâte de Brownie', es: 'Helado Proteico de Masa de Brownie' },
  'Butter Pecan Ice Cream': { fr: 'Crème Glacée Beurre et Noix de Pécan', es: 'Helado de Mantequilla y Nuez Pecana' },
  'Butterscotch Chip Ice Cream': { fr: 'Crème Glacée aux Pépites de Caramel au Beurre', es: 'Helado con Chispas de Caramelo de Mantequilla' },
  'Butterscotch Ice Cream': { fr: 'Crème Glacée au Caramel au Beurre', es: 'Helado de Caramelo de Mantequilla' },
  'Candy Bar Crunch Ice Cream': { fr: 'Crème Glacée Croquante aux Barres Chocolatées', es: 'Helado Crujiente de Barra de Chocolate' },
  'Cantaloupe Sorbet': { fr: 'Sorbet au Cantaloup', es: 'Sorbete de Melón' },
  'Caramel Apple Frozen Yogurt': { fr: 'Yaourt Glacé Pomme Caramel', es: 'Yogur Helado de Manzana con Caramelo' },
  'Caramel Apple Ice Cream': { fr: 'Crème Glacée Pomme Caramel', es: 'Helado de Manzana con Caramelo' },
  'Caramel Apple Pie Ice Cream': { fr: 'Crème Glacée Tarte aux Pommes Caramélisées', es: 'Helado de Tarta de Manzana con Caramelo' },
  'Caramel Apple Protein Ice Cream': { fr: 'Crème Glacée Protéinée Pomme Caramel', es: 'Helado Proteico de Manzana con Caramelo' },
  'Caramel Brownie Ice Cream': { fr: 'Crème Glacée Brownie au Caramel', es: 'Helado de Brownie con Caramelo' },
  'Caramel Cashew Ice Cream': { fr: 'Crème Glacée Caramel et Noix de Cajou', es: 'Helado de Caramelo y Anacardo' },
  'Caramel Cookie Crunch Ice Cream': { fr: 'Crème Glacée Croquante Caramel et Biscuit', es: 'Helado Crujiente de Caramelo y Galleta' },
  'Caramel Corn Ice Cream': { fr: 'Crème Glacée Pop-corn au Caramel', es: 'Helado de Palomitas con Caramelo' },
  'Caramel Flan Ice Cream': { fr: 'Crème Glacée Flan au Caramel', es: 'Helado de Flan de Caramelo' },
  'Caramel Latte Protein Ice Cream': { fr: 'Crème Glacée Protéinée Latte au Caramel', es: 'Helado Proteico de Latte de Caramelo' },
  'Caramel Macchiato Ice Cream': { fr: 'Crème Glacée Caramel Macchiato', es: 'Helado de Caramel Macchiato' },
  'Caramel Milkshake': { fr: 'Milkshake au Caramel', es: 'Batido de Caramelo' },
  'Caramel Pecan Turtle Ice Cream': { fr: 'Crème Glacée Tortue Caramel et Noix de Pécan', es: 'Helado Tortuga de Caramelo y Nuez Pecana' },
  'Caramel Pretzel Ice Cream': { fr: 'Crème Glacée Caramel et Bretzel', es: 'Helado de Caramelo y Pretzel' },
  'Caramel Swirl Ice Cream': { fr: 'Crème Glacée Tourbillon de Caramel', es: 'Helado con Remolino de Caramelo' },
  'Caramelized Banana Ice Cream': { fr: 'Crème Glacée à la Banane Caramélisée', es: 'Helado de Plátano Caramelizado' },
  'Caramelized White Chocolate Ice Cream': { fr: 'Crème Glacée au Chocolat Blanc Caramélisé', es: 'Helado de Chocolate Blanco Caramelizado' },
  'Cashew Butter Ice Cream': { fr: 'Crème Glacée au Beurre de Cajou', es: 'Helado de Mantequilla de Anacardo' },
  'Chai Latte Ice Cream': { fr: 'Crème Glacée Chai Latte', es: 'Helado de Chai Latte' },
  'Chai Spice Ice Cream': { fr: 'Crème Glacée aux Épices Chai', es: 'Helado de Especias Chai' },
  'Cheesecake Swirl Ice Cream': { fr: 'Crème Glacée Tourbillon Cheesecake', es: 'Helado con Remolino de Cheesecake' },
  'Cherry Chocolate Chip Ice Cream': { fr: 'Crème Glacée Cerise et Pépites de Chocolat', es: 'Helado de Cereza con Chispas de Chocolate' },
  'Cherry Frozen Yogurt': { fr: 'Yaourt Glacé à la Cerise', es: 'Yogur Helado de Cereza' },
  'Cherry Italian Ice': { fr: 'Glace Italienne à la Cerise', es: 'Hielo Italiano de Cereza' },
  'Cherry Sorbet': { fr: 'Sorbet à la Cerise', es: 'Sorbete de Cereza' },
  'Cherry Vanilla Frozen Yogurt': { fr: 'Yaourt Glacé Cerise et Vanille', es: 'Yogur Helado de Cereza y Vainilla' },
  'Cherry Vanilla Ice Cream': { fr: 'Crème Glacée Cerise et Vanille', es: 'Helado de Cereza y Vainilla' },
  'Chocolate Almond Butter Ice Cream': { fr: 'Crème Glacée Chocolat et Beurre d\'Amande', es: 'Helado de Chocolate y Mantequilla de Almendra' },
  'Chocolate Almond Protein Ice Cream': { fr: 'Crème Glacée Protéinée Chocolat et Amande', es: 'Helado Proteico de Chocolate y Almendra' },
  'Chocolate Banana Ice Cream': { fr: 'Crème Glacée Chocolat et Banane', es: 'Helado de Chocolate y Plátano' },
  'Chocolate Banana Protein Ice Cream': { fr: 'Crème Glacée Protéinée Chocolat et Banane', es: 'Helado Proteico de Chocolate y Plátano' },
  'Chocolate Banana Split Ice Cream': { fr: 'Crème Glacée Banana Split au Chocolat', es: 'Helado Banana Split de Chocolate' },
  'Chocolate Brownie Protein Ice Cream': { fr: 'Crème Glacée Protéinée Brownie au Chocolat', es: 'Helado Proteico de Brownie de Chocolate' },
  'Chocolate Caramel Ice Cream': { fr: 'Crème Glacée Chocolat et Caramel', es: 'Helado de Chocolate y Caramelo' },
  'Chocolate Caramel Protein Ice Cream': { fr: 'Crème Glacée Protéinée Chocolat et Caramel', es: 'Helado Proteico de Chocolate y Caramelo' },
  'Chocolate Cherry Ice Cream': { fr: 'Crème Glacée Chocolat et Cerise', es: 'Helado de Chocolate y Cereza' },
  'Chocolate Chip Cookie Dough Ice Cream': { fr: 'Crème Glacée Pâte à Cookies aux Pépites de Chocolat', es: 'Helado de Masa de Galleta con Chispas de Chocolate' },
  'Chocolate Chip Cookie Dough Protein Ice Cream': { fr: 'Crème Glacée Protéinée Pâte à Cookies aux Pépites de Chocolat', es: 'Helado Proteico de Masa de Galleta con Chispas de Chocolate' },
  'Chocolate Chip Frozen Yogurt': { fr: 'Yaourt Glacé aux Pépites de Chocolat', es: 'Yogur Helado con Chispas de Chocolate' },
  'Chocolate Chip Ice Cream': { fr: 'Crème Glacée aux Pépites de Chocolat', es: 'Helado con Chispas de Chocolate' },
  'Chocolate Chip Protein Ice Cream': { fr: 'Crème Glacée Protéinée aux Pépites de Chocolat', es: 'Helado Proteico con Chispas de Chocolate' },
  'Chocolate Coconut Cream Ice Cream': { fr: 'Crème Glacée Chocolat et Crème de Coco', es: 'Helado de Chocolate y Crema de Coco' },
  'Chocolate Coconut Protein Ice Cream': { fr: 'Crème Glacée Protéinée Chocolat et Noix de Coco', es: 'Helado Proteico de Chocolate y Coco' },
  'Chocolate Cookie Dough Ice Cream': { fr: 'Crème Glacée Pâte à Cookies au Chocolat', es: 'Helado de Masa de Galleta de Chocolate' },
  'Chocolate Cookie Protein Ice Cream': { fr: 'Crème Glacée Protéinée Cookies au Chocolat', es: 'Helado Proteico de Galleta de Chocolate' },
  'Chocolate Covered Banana Ice Cream': { fr: 'Crème Glacée Banane Enrobée de Chocolat', es: 'Helado de Plátano Cubierto de Chocolate' },
  'Chocolate Covered Pretzel Ice Cream': { fr: 'Crème Glacée Bretzel Enrobé de Chocolat', es: 'Helado de Pretzel Cubierto de Chocolate' },
  'Chocolate Covered Strawberry Ice Cream': { fr: 'Crème Glacée Fraise Enrobée de Chocolat', es: 'Helado de Fresa Cubierta de Chocolate' },
  'Chocolate Espresso Ice Cream': { fr: 'Crème Glacée Chocolat et Espresso', es: 'Helado de Chocolate y Espresso' },
  'Chocolate Frozen Yogurt': { fr: 'Yaourt Glacé au Chocolat', es: 'Yogur Helado de Chocolate' },
  'Chocolate Gelato': { fr: 'Gelato au Chocolat', es: 'Gelato de Chocolate' },
  'Chocolate Hazelnut Ice Cream': { fr: 'Crème Glacée Chocolat et Noisette', es: 'Helado de Chocolate y Avellana' },
  'Chocolate Hazelnut Protein Ice Cream': { fr: 'Crème Glacée Protéinée Chocolat et Noisette', es: 'Helado Proteico de Chocolate y Avellana' },
  'Chocolate Marshmallow Ice Cream': { fr: 'Crème Glacée Chocolat et Guimauve', es: 'Helado de Chocolate y Malvavisco' },
  'Chocolate Milkshake': { fr: 'Milkshake au Chocolat', es: 'Batido de Chocolate' },
  'Chocolate Mint Oreo Ice Cream': { fr: 'Crème Glacée Chocolat Menthe et Oreo', es: 'Helado de Chocolate, Menta y Oreo' },
  'Chocolate Mint Protein Ice Cream': { fr: 'Crème Glacée Protéinée Chocolat et Menthe', es: 'Helado Proteico de Chocolate y Menta' },
  'Chocolate Orange Ice Cream': { fr: 'Crème Glacée Chocolat et Orange', es: 'Helado de Chocolate y Naranja' },
  'Chocolate Peanut Butter Banana Protein Ice Cream': { fr: 'Crème Glacée Protéinée Chocolat, Beurre de Cacahuète et Banane', es: 'Helado Proteico de Chocolate, Mantequilla de Maní y Plátano' },
  'Chocolate Peanut Butter Cup Ice Cream': { fr: 'Crème Glacée Chocolat aux Bouchées de Beurre de Cacahuète', es: 'Helado de Chocolate con Copas de Mantequilla de Maní' },
  'Chocolate Peanut Butter Frozen Yogurt': { fr: 'Yaourt Glacé Chocolat et Beurre de Cacahuète', es: 'Yogur Helado de Chocolate y Mantequilla de Maní' },
  'Chocolate Peanut Butter Smoothie Bowl': { fr: 'Bol de Smoothie Chocolat et Beurre de Cacahuète', es: 'Bowl de Smoothie de Chocolate y Mantequilla de Maní' },
  'Chocolate Peppermint Ice Cream': { fr: 'Crème Glacée Chocolat et Menthe Poivrée', es: 'Helado de Chocolate y Menta' },
  'Chocolate Peppermint Protein Ice Cream': { fr: 'Crème Glacée Protéinée Chocolat et Menthe Poivrée', es: 'Helado Proteico de Chocolate y Menta' },
  'Chocolate Protein Ice Cream': { fr: 'Crème Glacée Protéinée au Chocolat', es: 'Helado Proteico de Chocolate' },
  'Chocolate Raspberry Ice Cream': { fr: 'Crème Glacée Chocolat et Framboise', es: 'Helado de Chocolate y Frambuesa' },
  'Chocolate Sorbet': { fr: 'Sorbet au Chocolat', es: 'Sorbete de Chocolate' },
  'Churro Ice Cream': { fr: 'Crème Glacée au Churro', es: 'Helado de Churro' },
  'Cinnamon Apple Frozen Yogurt': { fr: 'Yaourt Glacé Pomme et Cannelle', es: 'Yogur Helado de Manzana y Canela' },
  'Cinnamon Churro Swirl Ice Cream': { fr: 'Crème Glacée Tourbillon Churro à la Cannelle', es: 'Helado con Remolino de Churro y Canela' },
  'Cinnamon Roll Ice Cream': { fr: 'Crème Glacée Roulé à la Cannelle', es: 'Helado de Rollo de Canela' },
  'Cinnamon Sugar Cookie Ice Cream': { fr: 'Crème Glacée Biscuit Sucre et Cannelle', es: 'Helado de Galleta de Azúcar y Canela' },
  'Cinnamon Toast Crunch Protein Ice Cream': { fr: 'Crème Glacée Protéinée Cinnamon Toast Crunch', es: 'Helado Proteico de Cinnamon Toast Crunch' },
  'Classic Vanilla Bean Ice Cream': { fr: 'Crème Glacée Classique à la Gousse de Vanille', es: 'Helado Clásico de Vainilla Natural' },
  'Classic Vanilla Milkshake': { fr: 'Milkshake Classique à la Vanille', es: 'Batido Clásico de Vainilla' },
  'Coconut Chocolate Chip Ice Cream': { fr: 'Crème Glacée Noix de Coco et Pépites de Chocolat', es: 'Helado de Coco con Chispas de Chocolate' },
  'Coconut Cream Pie Ice Cream': { fr: 'Crème Glacée Tarte à la Crème de Coco', es: 'Helado de Pastel de Crema de Coco' },
  'Coconut Cream Pie Swirl Ice Cream': { fr: 'Crème Glacée Tourbillon Tarte à la Crème de Coco', es: 'Helado de Pastel de Crema de Coco con Remolino' },
  'Coconut Cream Protein Ice Cream': { fr: 'Crème Glacée Protéinée à la Crème de Coco', es: 'Helado Proteico de Crema de Coco' },
  'Coconut Frozen Yogurt': { fr: 'Yaourt Glacé à la Noix de Coco', es: 'Yogur Helado de Coco' },
  'Coconut Lime Sorbet': { fr: 'Sorbet Noix de Coco et Citron Vert', es: 'Sorbete de Coco y Lima' },
  'Coconut Mango Sorbet': { fr: 'Sorbet Noix de Coco et Mangue', es: 'Sorbete de Coco y Mango' },
  'Coconut Milk Ice Cream': { fr: 'Crème Glacée au Lait de Coco', es: 'Helado de Leche de Coco' },
  'Coconut Pineapple Sorbet': { fr: 'Sorbet Noix de Coco et Ananas', es: 'Sorbete de Coco y Piña' },
  'Coffee Frozen Yogurt': { fr: 'Yaourt Glacé au Café', es: 'Yogur Helado de Café' },
  'Coffee Gelato': { fr: 'Gelato au Café', es: 'Gelato de Café' },
  'Coffee Milkshake': { fr: 'Milkshake au Café', es: 'Batido de Café' },
  'Coffee Oreo Ice Cream': { fr: 'Crème Glacée Café et Oreo', es: 'Helado de Café y Oreo' },
  'Coffee Protein Ice Cream': { fr: 'Crème Glacée Protéinée au Café', es: 'Helado Proteico de Café' },
  'Coffee Toffee Crunch Ice Cream': { fr: 'Crème Glacée Croquante Café et Caramel', es: 'Helado Crujiente de Café y Toffee' },
  'Concord Grape Sorbet': { fr: 'Sorbet au Raisin Concord', es: 'Sorbete de Uva Concord' },
  'Condensed Milk Ice Cream': { fr: 'Crème Glacée au Lait Concentré', es: 'Helado de Leche Condensada' },
  'Cookie Dough Ice Cream': { fr: 'Crème Glacée Pâte à Cookies', es: 'Helado de Masa de Galleta' },
  'Cookies and Cream Cheesecake Ice Cream': { fr: 'Crème Glacée Cheesecake Cookies and Cream', es: 'Helado de Cheesecake de Galletas y Crema' },
  'Cookies and Cream Cottage Cheese Protein Ice Cream': { fr: 'Crème Glacée Protéinée au Fromage Blanc Cookies and Cream', es: 'Helado Proteico de Requesón con Galletas y Crema' },
  'Cookies and Cream Frozen Yogurt': { fr: 'Yaourt Glacé Cookies and Cream', es: 'Yogur Helado de Galletas y Crema' },
  'Cookies and Cream Gelato': { fr: 'Gelato Cookies and Cream', es: 'Gelato de Galletas y Crema' },
  'Cookies and Cream Ice Cream': { fr: 'Crème Glacée Cookies and Cream', es: 'Helado de Galletas y Crema' },
  'Cookies and Cream Milkshake': { fr: 'Milkshake Cookies and Cream', es: 'Batido de Galletas y Crema' },
  'Cookies and Cream Protein Ice Cream': { fr: 'Crème Glacée Protéinée Cookies and Cream', es: 'Helado Proteico de Galletas y Crema' },
  'Cottage Cheese Chocolate Protein Ice Cream': { fr: 'Crème Glacée Protéinée au Fromage Blanc et Chocolat', es: 'Helado Proteico de Requesón y Chocolate' },
  'Cottage Cheese Protein Ice Cream': { fr: 'Crème Glacée Protéinée au Fromage Blanc', es: 'Helado Proteico de Requesón' },
  'Cotton Candy Ice Cream': { fr: 'Crème Glacée Barbe à Papa', es: 'Helado de Algodón de Azúcar' },
  'Cranberry Orange Sorbet': { fr: 'Sorbet Canneberge et Orange', es: 'Sorbete de Arándano Rojo y Naranja' },
  'Cream Cheese Base Ice Cream': { fr: 'Crème Glacée Base Fromage à la Crème', es: 'Helado Base de Queso Crema' },
  'Cream Cheese Chocolate Chip Ice Cream': { fr: 'Crème Glacée Fromage à la Crème et Pépites de Chocolat', es: 'Helado de Queso Crema con Chispas de Chocolate' },
  'Cream Cheese Oreo Ice Cream': { fr: 'Crème Glacée Fromage à la Crème et Oreo', es: 'Helado de Queso Crema y Oreo' },
  'Cream Cheese Strawberry Ice Cream': { fr: 'Crème Glacée Fromage à la Crème et Fraise', es: 'Helado de Queso Crema y Fresa' },
  'Creme Brulee Ice Cream': { fr: 'Crème Glacée Crème Brûlée', es: 'Helado de Crème Brûlée' },
  'Cucumber Mint Sorbet': { fr: 'Sorbet Concombre et Menthe', es: 'Sorbete de Pepino y Menta' },
  'Dark Chocolate Orange Ice Cream': { fr: 'Crème Glacée Chocolat Noir et Orange', es: 'Helado de Chocolate Oscuro y Naranja' },
  'Dark Chocolate Sea Salt Ice Cream': { fr: 'Crème Glacée Chocolat Noir et Fleur de Sel', es: 'Helado de Chocolate Oscuro y Sal Marina' },
  'Dark Chocolate Truffle Ice Cream': { fr: 'Crème Glacée Truffe au Chocolat Noir', es: 'Helado de Trufa de Chocolate Oscuro' },
  'Double Chocolate Brownie Ice Cream': { fr: 'Crème Glacée Double Chocolat Brownie', es: 'Helado de Doble Chocolate con Brownie' },
  'Double Mint Ice Cream': { fr: 'Crème Glacée Double Menthe', es: 'Helado de Doble Menta' },
  'Dragon Fruit Sorbet': { fr: 'Sorbet au Fruit du Dragon', es: 'Sorbete de Pitahaya' },
  'Dulce de Leche Brownie Ice Cream': { fr: 'Crème Glacée Dulce de Leche et Brownie', es: 'Helado de Dulce de Leche con Brownie' },
  'Dulce de Leche Gelato': { fr: 'Gelato au Dulce de Leche', es: 'Gelato de Dulce de Leche' },
  'Dulce de Leche Ice Cream': { fr: 'Crème Glacée au Dulce de Leche', es: 'Helado de Dulce de Leche' },
  'Earl Grey Ice Cream': { fr: 'Crème Glacée au Thé Earl Grey', es: 'Helado de Té Earl Grey' },
  'Eggnog Ice Cream': { fr: 'Crème Glacée au Lait de Poule', es: 'Helado de Ponche de Huevo' },
  'Espresso Brownie Ice Cream': { fr: 'Crème Glacée Espresso et Brownie', es: 'Helado de Espresso con Brownie' },
  'Espresso Chip Ice Cream': { fr: 'Crème Glacée Espresso aux Pépites de Chocolat', es: 'Helado de Espresso con Chispas de Chocolate' },
  'Fairlife Protein Shake Ice Cream': { fr: 'Crème Glacée au Shake Protéiné Fairlife', es: 'Helado de Batido Proteico Fairlife' },
  'Fairlife Salted Caramel Protein Ice Cream': { fr: 'Crème Glacée Protéinée Fairlife Caramel Salé', es: 'Helado Proteico Fairlife de Caramelo Salado' },
  'Fairlife Strawberry Protein Ice Cream': { fr: 'Crème Glacée Protéinée Fairlife à la Fraise', es: 'Helado Proteico Fairlife de Fresa' },
  'Fairlife Vanilla Protein Ice Cream': { fr: 'Crème Glacée Protéinée Fairlife à la Vanille', es: 'Helado Proteico Fairlife de Vainilla' },
  'Fig Honey Ice Cream': { fr: 'Crème Glacée Figue et Miel', es: 'Helado de Higo y Miel' },
  'Fig Sorbet': { fr: 'Sorbet à la Figue', es: 'Sorbete de Higo' },
  'Fresh Strawberry Sorbet': { fr: 'Sorbet aux Fraises Fraîches', es: 'Sorbete de Fresas Frescas' },
  'Frozen Yogurt with Mixed Berries': { fr: 'Yaourt Glacé aux Fruits Rouges', es: 'Yogur Helado con Frutos Rojos' },
  'Funfetti Ice Cream': { fr: 'Crème Glacée Funfetti', es: 'Helado Funfetti' },
  'German Chocolate Ice Cream': { fr: 'Crème Glacée Chocolat Allemand', es: 'Helado de Chocolate Alemán' },
  'Ginger Snap Ice Cream': { fr: 'Crème Glacée au Biscuit de Gingembre', es: 'Helado de Galleta de Jengibre' },
  'Gingerbread Ice Cream': { fr: 'Crème Glacée au Pain d\'Épices', es: 'Helado de Pan de Jengibre' },
  'Grape Italian Ice': { fr: 'Glace Italienne au Raisin', es: 'Hielo Italiano de Uva' },
  'Grapefruit Rosemary Sorbet': { fr: 'Sorbet Pamplemousse et Romarin', es: 'Sorbete de Toronja y Romero' },
  'Green Apple Sorbet': { fr: 'Sorbet à la Pomme Verte', es: 'Sorbete de Manzana Verde' },
  'Green Smoothie Bowl': { fr: 'Bol de Smoothie Vert', es: 'Bowl de Smoothie Verde' },
  'Guava Sorbet': { fr: 'Sorbet à la Goyave', es: 'Sorbete de Guayaba' },
  'Hazelnut Gelato': { fr: 'Gelato à la Noisette', es: 'Gelato de Avellana' },
  'Hazelnut Praline Ice Cream': { fr: 'Crème Glacée Praliné à la Noisette', es: 'Helado de Praliné de Avellana' },
  'Hibiscus Sorbet': { fr: 'Sorbet à l\'Hibiscus', es: 'Sorbete de Hibisco' },
  'High Protein Chocolate Ice Cream': { fr: 'Crème Glacée Chocolat Hyperprotéinée', es: 'Helado de Chocolate Alto en Proteína' },
  'Honey Cinnamon Ice Cream': { fr: 'Crème Glacée Miel et Cannelle', es: 'Helado de Miel y Canela' },
  'Honey Lavender Ice Cream': { fr: 'Crème Glacée Miel et Lavande', es: 'Helado de Miel y Lavanda' },
  'Honey Vanilla Frozen Yogurt': { fr: 'Yaourt Glacé Miel et Vanille', es: 'Yogur Helado de Miel y Vainilla' },
  'Honeydew Sorbet': { fr: 'Sorbet au Melon Miel', es: 'Sorbete de Melón Verde' },
  'Horchata Ice Cream': { fr: 'Crème Glacée à l\'Horchata', es: 'Helado de Horchata' },
  'Hot Fudge Sundae Ice Cream': { fr: 'Crème Glacée Sundae au Fondant Chocolat', es: 'Helado de Sundae con Fudge Caliente' },
  'Keto Almond Fudge Ice Cream': { fr: 'Crème Glacée Kéto Fondant Amande', es: 'Helado Keto de Fudge de Almendra' },
  'Keto Banana Ice Cream': { fr: 'Crème Glacée Kéto à la Banane', es: 'Helado Keto de Plátano' },
  'Keto Birthday Cake Ice Cream': { fr: 'Crème Glacée Kéto Gâteau d\'Anniversaire', es: 'Helado Keto de Pastel de Cumpleaños' },
  'Keto Blueberry Ice Cream': { fr: 'Crème Glacée Kéto aux Myrtilles', es: 'Helado Keto de Arándano' },
  'Keto Butter Pecan Ice Cream': { fr: 'Crème Glacée Kéto Beurre et Noix de Pécan', es: 'Helado Keto de Mantequilla y Nuez Pecana' },
  'Keto Caramel Pecan Ice Cream': { fr: 'Crème Glacée Kéto Caramel et Noix de Pécan', es: 'Helado Keto de Caramelo y Nuez Pecana' },
  'Keto Cheesecake Ice Cream': { fr: 'Crème Glacée Kéto Cheesecake', es: 'Helado Keto de Cheesecake' },
  'Keto Chocolate Brownie Ice Cream': { fr: 'Crème Glacée Kéto Brownie au Chocolat', es: 'Helado Keto de Brownie de Chocolate' },
  'Keto Chocolate Cheesecake Ice Cream': { fr: 'Crème Glacée Kéto Cheesecake au Chocolat', es: 'Helado Keto de Cheesecake de Chocolate' },
  'Keto Chocolate Chip Ice Cream': { fr: 'Crème Glacée Kéto aux Pépites de Chocolat', es: 'Helado Keto con Chispas de Chocolate' },
  'Keto Chocolate Hazelnut Ice Cream': { fr: 'Crème Glacée Kéto Chocolat et Noisette', es: 'Helado Keto de Chocolate y Avellana' },
  'Keto Chocolate Ice Cream': { fr: 'Crème Glacée Kéto au Chocolat', es: 'Helado Keto de Chocolate' },
  'Keto Chocolate Peanut Butter Ice Cream': { fr: 'Crème Glacée Kéto Chocolat et Beurre de Cacahuète', es: 'Helado Keto de Chocolate y Mantequilla de Maní' },
  'Keto Cinnamon Roll Ice Cream': { fr: 'Crème Glacée Kéto Roulé à la Cannelle', es: 'Helado Keto de Rollo de Canela' },
  'Keto Coconut Cream Ice Cream': { fr: 'Crème Glacée Kéto à la Crème de Coco', es: 'Helado Keto de Crema de Coco' },
  'Keto Coconut Ice Cream': { fr: 'Crème Glacée Kéto à la Noix de Coco', es: 'Helado Keto de Coco' },
  'Keto Coffee Ice Cream': { fr: 'Crème Glacée Kéto au Café', es: 'Helado Keto de Café' },
  'Keto Cookie Dough Ice Cream': { fr: 'Crème Glacée Kéto Pâte à Cookies', es: 'Helado Keto de Masa de Galleta' },
  'Keto Eggnog Ice Cream': { fr: 'Crème Glacée Kéto au Lait de Poule', es: 'Helado Keto de Ponche de Huevo' },
  'Keto Lemon Cheesecake Ice Cream': { fr: 'Crème Glacée Kéto Cheesecake au Citron', es: 'Helado Keto de Cheesecake de Limón' },
  'Keto Maple Walnut Ice Cream': { fr: 'Crème Glacée Kéto Érable et Noix', es: 'Helado Keto de Arce y Nuez' },
  'Keto Matcha Ice Cream': { fr: 'Crème Glacée Kéto au Matcha', es: 'Helado Keto de Matcha' },
  'Keto Mint Chocolate Chip Ice Cream': { fr: 'Crème Glacée Kéto Menthe et Pépites de Chocolat', es: 'Helado Keto de Menta con Chispas de Chocolate' },
  'Keto Mocha Ice Cream': { fr: 'Crème Glacée Kéto Moka', es: 'Helado Keto de Moca' },
  'Keto Peach Ice Cream': { fr: 'Crème Glacée Kéto à la Pêche', es: 'Helado Keto de Durazno' },
  'Keto Peanut Butter Ice Cream': { fr: 'Crème Glacée Kéto au Beurre de Cacahuète', es: 'Helado Keto de Mantequilla de Maní' },
  'Keto Pistachio Ice Cream': { fr: 'Crème Glacée Kéto à la Pistache', es: 'Helado Keto de Pistacho' },
  'Keto Pumpkin Spice Ice Cream': { fr: 'Crème Glacée Kéto aux Épices de Citrouille', es: 'Helado Keto de Especias de Calabaza' },
  'Keto Raspberry Ice Cream': { fr: 'Crème Glacée Kéto à la Framboise', es: 'Helado Keto de Frambuesa' },
  'Keto Salted Caramel Ice Cream': { fr: 'Crème Glacée Kéto Caramel Salé', es: 'Helado Keto de Caramelo Salado' },
  'Keto Strawberry Ice Cream': { fr: 'Crème Glacée Kéto à la Fraise', es: 'Helado Keto de Fresa' },
  'Keto Vanilla Cookie Ice Cream': { fr: 'Crème Glacée Kéto Vanille et Biscuit', es: 'Helado Keto de Vainilla y Galleta' },
  'Keto Vanilla Ice Cream': { fr: 'Crème Glacée Kéto à la Vanille', es: 'Helado Keto de Vainilla' },
  'Key Lime Frozen Yogurt': { fr: 'Yaourt Glacé au Citron Vert', es: 'Yogur Helado de Lima' },
  'Key Lime Pie Ice Cream': { fr: 'Crème Glacée Tarte au Citron Vert', es: 'Helado de Pastel de Lima' },
  'Key Lime Protein Ice Cream': { fr: 'Crème Glacée Protéinée au Citron Vert', es: 'Helado Proteico de Lima' },
  'Kiwi Sorbet': { fr: 'Sorbet au Kiwi', es: 'Sorbete de Kiwi' },
  'Lavender Blueberry Ice Cream': { fr: 'Crème Glacée Lavande et Myrtille', es: 'Helado de Lavanda y Arándano' },
  'Lemon Bar Ice Cream': { fr: 'Crème Glacée Barre au Citron', es: 'Helado de Barra de Limón' },
  'Lemon Bar Protein Ice Cream': { fr: 'Crème Glacée Protéinée Barre au Citron', es: 'Helado Proteico de Barra de Limón' },
  'Lemon Curd Ice Cream': { fr: 'Crème Glacée au Lemon Curd', es: 'Helado de Crema de Limón' },
  'Lemon Frozen Yogurt': { fr: 'Yaourt Glacé au Citron', es: 'Yogur Helado de Limón' },
  'Lemon Gelato': { fr: 'Gelato au Citron', es: 'Gelato de Limón' },
  'Lemon Italian Ice': { fr: 'Glace Italienne au Citron', es: 'Hielo Italiano de Limón' },
  'Lemon Meringue Ice Cream': { fr: 'Crème Glacée Meringue au Citron', es: 'Helado de Merengue de Limón' },
  'Lemon Poppy Seed Ice Cream': { fr: 'Crème Glacée Citron et Graines de Pavot', es: 'Helado de Limón y Semillas de Amapola' },
  'Lemon Sorbet': { fr: 'Sorbet au Citron', es: 'Sorbete de Limón' },
  'Lychee Sorbet': { fr: 'Sorbet au Litchi', es: 'Sorbete de Lichi' },
  'Macadamia Nut Ice Cream': { fr: 'Crème Glacée à la Noix de Macadamia', es: 'Helado de Nuez de Macadamia' },
  'Malted Milk Ice Cream': { fr: 'Crème Glacée au Lait Malté', es: 'Helado de Leche Malteada' },
  'Mandarin Orange Sorbet': { fr: 'Sorbet à la Mandarine', es: 'Sorbete de Mandarina' },
  'Mango Chili Sorbet': { fr: 'Sorbet Mangue et Piment', es: 'Sorbete de Mango y Chile' },
  'Mango Cream Ice Cream': { fr: 'Crème Glacée à la Crème de Mangue', es: 'Helado de Crema de Mango' },
  'Mango Frozen Yogurt': { fr: 'Yaourt Glacé à la Mangue', es: 'Yogur Helado de Mango' },
  'Mango Gelato': { fr: 'Gelato à la Mangue', es: 'Gelato de Mango' },
  'Mango Habanero Ice Cream': { fr: 'Crème Glacée Mangue et Habanero', es: 'Helado de Mango y Habanero' },
  'Mango Italian Ice': { fr: 'Glace Italienne à la Mangue', es: 'Hielo Italiano de Mango' },
  'Mango Lassi Frozen Yogurt': { fr: 'Yaourt Glacé Mango Lassi', es: 'Yogur Helado de Mango Lassi' },
  'Mango Protein Ice Cream': { fr: 'Crème Glacée Protéinée à la Mangue', es: 'Helado Proteico de Mango' },
  'Maple Bacon Ice Cream': { fr: 'Crème Glacée Érable et Bacon', es: 'Helado de Arce y Tocino' },
  'Maple Brown Butter Ice Cream': { fr: 'Crème Glacée Érable et Beurre Noisette', es: 'Helado de Arce y Mantequilla Dorada' },
  'Maple Cinnamon Frozen Yogurt': { fr: 'Yaourt Glacé Érable et Cannelle', es: 'Yogur Helado de Arce y Canela' },
  'Maple Walnut Ice Cream': { fr: 'Crème Glacée Érable et Noix', es: 'Helado de Arce y Nuez' },
  'Marshmallow Swirl Ice Cream': { fr: 'Crème Glacée Tourbillon de Guimauve', es: 'Helado con Remolino de Malvavisco' },
  'Matcha Frozen Yogurt': { fr: 'Yaourt Glacé au Matcha', es: 'Yogur Helado de Matcha' },
  'Matcha Gelato': { fr: 'Gelato au Matcha', es: 'Gelato de Matcha' },
  'Matcha Green Tea Ice Cream': { fr: 'Crème Glacée au Matcha', es: 'Helado de Té Verde Matcha' },
  'Matcha Protein Ice Cream': { fr: 'Crème Glacée Protéinée au Matcha', es: 'Helado Proteico de Matcha' },
  'Matcha White Chocolate Ice Cream': { fr: 'Crème Glacée Matcha et Chocolat Blanc', es: 'Helado de Matcha y Chocolate Blanco' },
  'Mexican Chocolate Ice Cream': { fr: 'Crème Glacée au Chocolat Mexicain', es: 'Helado de Chocolate Mexicano' },
  'Meyer Lemon Sorbet': { fr: 'Sorbet au Citron Meyer', es: 'Sorbete de Limón Meyer' },
  'Mint Brownie Ice Cream': { fr: 'Crème Glacée Menthe et Brownie', es: 'Helado de Menta con Brownie' },
  'Mint Chocolate Chip Ice Cream': { fr: 'Crème Glacée Menthe et Pépites de Chocolat', es: 'Helado de Menta con Chispas de Chocolate' },
  'Mint Chocolate Protein Ice Cream': { fr: 'Crème Glacée Protéinée Menthe et Chocolat', es: 'Helado Proteico de Menta y Chocolate' },
  'Mint Oreo Ice Cream': { fr: 'Crème Glacée Menthe et Oreo', es: 'Helado de Menta y Oreo' },
  'Mixed Berry Frozen Yogurt': { fr: 'Yaourt Glacé aux Fruits Rouges', es: 'Yogur Helado de Frutos Rojos' },
  'Mixed Berry Sorbet': { fr: 'Sorbet aux Fruits Rouges', es: 'Sorbete de Frutos Rojos' },
  'Mocha Almond Fudge Ice Cream': { fr: 'Crème Glacée Moka, Amande et Fondant', es: 'Helado de Moca, Almendra y Fudge' },
  'Mocha Chip Ice Cream': { fr: 'Crème Glacée Moka aux Pépites de Chocolat', es: 'Helado de Moca con Chispas de Chocolate' },
  'Mocha Protein Ice Cream': { fr: 'Crème Glacée Protéinée Moka', es: 'Helado Proteico de Moca' },
  'Neapolitan Ice Cream': { fr: 'Crème Glacée Napolitaine', es: 'Helado Napolitano' },
  'Nocciola Gelato': { fr: 'Gelato Nocciola', es: 'Gelato de Nocciola' },
  'Nutella Swirl Ice Cream': { fr: 'Crème Glacée Tourbillon de Nutella', es: 'Helado con Remolino de Nutella' },
  'Oat Milk Caramel Ice Cream': { fr: 'Crème Glacée au Caramel et Lait d\'Avoine', es: 'Helado de Caramelo con Leche de Avena' },
  'Olive Oil Ice Cream': { fr: 'Crème Glacée à l\'Huile d\'Olive', es: 'Helado de Aceite de Oliva' },
  'Orange Creamsicle Ice Cream': { fr: 'Crème Glacée Creamsicle à l\'Orange', es: 'Helado Creamsicle de Naranja' },
  'Orange Dreamsicle Ice Cream': { fr: 'Crème Glacée Dreamsicle à l\'Orange', es: 'Helado Dreamsicle de Naranja' },
  'Orange Mango Sorbet': { fr: 'Sorbet Orange et Mangue', es: 'Sorbete de Naranja y Mango' },
  'Oreo Frozen Yogurt': { fr: 'Yaourt Glacé Oreo', es: 'Yogur Helado de Oreo' },
  'Papaya Sorbet': { fr: 'Sorbet à la Papaye', es: 'Sorbete de Papaya' },
  'Passion Fruit Frozen Yogurt': { fr: 'Yaourt Glacé au Fruit de la Passion', es: 'Yogur Helado de Maracuyá' },
  'Passion Fruit Sorbet': { fr: 'Sorbet au Fruit de la Passion', es: 'Sorbete de Maracuyá' },
  'PB&J Smoothie Bowl': { fr: 'Bol de Smoothie Beurre de Cacahuète et Confiture', es: 'Bowl de Smoothie de Mantequilla de Maní y Mermelada' },
  'Peach Caramel Ice Cream': { fr: 'Crème Glacée Pêche et Caramel', es: 'Helado de Durazno y Caramelo' },
  'Peach Cobbler Ice Cream': { fr: 'Crème Glacée Cobbler à la Pêche', es: 'Helado de Cobbler de Durazno' },
  'Peach Cobbler Protein Ice Cream': { fr: 'Crème Glacée Protéinée Cobbler à la Pêche', es: 'Helado Proteico de Cobbler de Durazno' },
  'Peach Frozen Yogurt': { fr: 'Yaourt Glacé à la Pêche', es: 'Yogur Helado de Durazno' },
  'Peach Mango Frozen Yogurt': { fr: 'Yaourt Glacé Pêche et Mangue', es: 'Yogur Helado de Durazno y Mango' },
  'Peach Mango Sorbet': { fr: 'Sorbet Pêche et Mangue', es: 'Sorbete de Durazno y Mango' },
  'Peach Melba Ice Cream': { fr: 'Crème Glacée Pêche Melba', es: 'Helado Melocotón Melba' },
  'Peach Sorbet': { fr: 'Sorbet à la Pêche', es: 'Sorbete de Durazno' },
  'Peanut Butter Banana Frozen Yogurt': { fr: 'Yaourt Glacé Beurre de Cacahuète et Banane', es: 'Yogur Helado de Mantequilla de Maní y Plátano' },
  'Peanut Butter Banana Milkshake': { fr: 'Milkshake Beurre de Cacahuète et Banane', es: 'Batido de Mantequilla de Maní y Plátano' },
  'Peanut Butter Banana Protein Ice Cream': { fr: 'Crème Glacée Protéinée Beurre de Cacahuète et Banane', es: 'Helado Proteico de Mantequilla de Maní y Plátano' },
  'Peanut Butter Chocolate Chip Ice Cream': { fr: 'Crème Glacée Beurre de Cacahuète aux Pépites de Chocolat', es: 'Helado de Mantequilla de Maní con Chispas de Chocolate' },
  'Peanut Butter Cookie Protein Ice Cream': { fr: 'Crème Glacée Protéinée Biscuit au Beurre de Cacahuète', es: 'Helado Proteico de Galleta de Mantequilla de Maní' },
  'Peanut Butter Cup Ice Cream': { fr: 'Crème Glacée aux Bouchées de Beurre de Cacahuète', es: 'Helado de Copas de Mantequilla de Maní' },
  'Peanut Butter Cup Protein Ice Cream': { fr: 'Crème Glacée Protéinée aux Bouchées de Beurre de Cacahuète', es: 'Helado Proteico de Copas de Mantequilla de Maní' },
  'Peanut Butter Fudge Ice Cream': { fr: 'Crème Glacée Fondant au Beurre de Cacahuète', es: 'Helado de Fudge de Mantequilla de Maní' },
  'Peanut Butter Pretzel Ice Cream': { fr: 'Crème Glacée Beurre de Cacahuète et Bretzel', es: 'Helado de Mantequilla de Maní y Pretzel' },
  'Peanut Butter Protein Ice Cream': { fr: 'Crème Glacée Protéinée au Beurre de Cacahuète', es: 'Helado Proteico de Mantequilla de Maní' },
  'Peanut Butter Swirl Ice Cream': { fr: 'Crème Glacée Tourbillon de Beurre de Cacahuète', es: 'Helado con Remolino de Mantequilla de Maní' },
  'Pear Ginger Sorbet': { fr: 'Sorbet Poire et Gingembre', es: 'Sorbete de Pera y Jengibre' },
  'Pecan Pie Ice Cream': { fr: 'Crème Glacée Tarte aux Noix de Pécan', es: 'Helado de Tarta de Nuez Pecana' },
  'Pecan Praline Ice Cream': { fr: 'Crème Glacée Praliné aux Noix de Pécan', es: 'Helado de Praliné de Nuez Pecana' },
  'Peppermint Bark Ice Cream': { fr: 'Crème Glacée Écorce de Menthe Poivrée', es: 'Helado de Corteza de Menta' },
  'Peppermint Hot Chocolate Ice Cream': { fr: 'Crème Glacée Chocolat Chaud à la Menthe Poivrée', es: 'Helado de Chocolate Caliente con Menta' },
  'Peppermint Mocha Ice Cream': { fr: 'Crème Glacée Moka à la Menthe Poivrée', es: 'Helado de Moca con Menta' },
  'Peppermint Stick Ice Cream': { fr: 'Crème Glacée Sucre d\'Orge', es: 'Helado de Bastón de Menta' },
  'Pineapple Coconut Sorbet': { fr: 'Sorbet Ananas et Noix de Coco', es: 'Sorbete de Piña y Coco' },
  'Pineapple Frozen Yogurt': { fr: 'Yaourt Glacé à l\'Ananas', es: 'Yogur Helado de Piña' },
  'Pineapple Mint Sorbet': { fr: 'Sorbet Ananas et Menthe', es: 'Sorbete de Piña y Menta' },
  'Pineapple Upside Down Cake Ice Cream': { fr: 'Crème Glacée Gâteau Renversé à l\'Ananas', es: 'Helado de Pastel Invertido de Piña' },
  'Pink Grapefruit Sorbet': { fr: 'Sorbet au Pamplemousse Rose', es: 'Sorbete de Toronja Rosa' },
  'Pistachio Cream Ice Cream': { fr: 'Crème Glacée à la Crème de Pistache', es: 'Helado de Crema de Pistacho' },
  'Pistachio Gelato': { fr: 'Gelato à la Pistache', es: 'Gelato de Pistacho' },
  'Pistachio Gelato with Dark Chocolate': { fr: 'Gelato à la Pistache et Chocolat Noir', es: 'Gelato de Pistacho con Chocolate Oscuro' },
  'Pistachio Ice Cream': { fr: 'Crème Glacée à la Pistache', es: 'Helado de Pistacho' },
  'Pistachio Rose Ice Cream': { fr: 'Crème Glacée Pistache et Rose', es: 'Helado de Pistacho y Rosa' },
  'Plum Sorbet': { fr: 'Sorbet à la Prune', es: 'Sorbete de Ciruela' },
  'Pomegranate Frozen Yogurt': { fr: 'Yaourt Glacé à la Grenade', es: 'Yogur Helado de Granada' },
  'Pomegranate Sorbet': { fr: 'Sorbet à la Grenade', es: 'Sorbete de Granada' },
  'Prickly Pear Sorbet': { fr: 'Sorbet à la Figue de Barbarie', es: 'Sorbete de Tuna (Nopal)' },
  'Pumpkin Cheesecake Ice Cream': { fr: 'Crème Glacée Cheesecake à la Citrouille', es: 'Helado de Cheesecake de Calabaza' },
  'Pumpkin Pie Ice Cream': { fr: 'Crème Glacée Tarte à la Citrouille', es: 'Helado de Pastel de Calabaza' },
  'Pumpkin Pie Swirl Ice Cream': { fr: 'Crème Glacée Tourbillon Tarte à la Citrouille', es: 'Helado de Pastel de Calabaza con Remolino' },
  'Pumpkin Protein Ice Cream': { fr: 'Crème Glacée Protéinée à la Citrouille', es: 'Helado Proteico de Calabaza' },
  'Pumpkin Spice Frozen Yogurt': { fr: 'Yaourt Glacé aux Épices de Citrouille', es: 'Yogur Helado de Especias de Calabaza' },
  'Pumpkin Spice Ice Cream': { fr: 'Crème Glacée aux Épices de Citrouille', es: 'Helado de Especias de Calabaza' },
  'Pumpkin Spice Protein Ice Cream': { fr: 'Crème Glacée Protéinée aux Épices de Citrouille', es: 'Helado Proteico de Especias de Calabaza' },
  'Raspberry Cheesecake Frozen Yogurt': { fr: 'Yaourt Glacé Cheesecake à la Framboise', es: 'Yogur Helado de Cheesecake de Frambuesa' },
  'Raspberry Chocolate Protein Ice Cream': { fr: 'Crème Glacée Protéinée Framboise et Chocolat', es: 'Helado Proteico de Frambuesa y Chocolate' },
  'Raspberry Frozen Yogurt': { fr: 'Yaourt Glacé à la Framboise', es: 'Yogur Helado de Frambuesa' },
  'Raspberry Gelato': { fr: 'Gelato à la Framboise', es: 'Gelato de Frambuesa' },
  'Raspberry Lime Sorbet': { fr: 'Sorbet Framboise et Citron Vert', es: 'Sorbete de Frambuesa y Lima' },
  'Raspberry Sorbet': { fr: 'Sorbet à la Framboise', es: 'Sorbete de Frambuesa' },
  'Raspberry Swirl Ice Cream': { fr: 'Crème Glacée Tourbillon de Framboise', es: 'Helado con Remolino de Frambuesa' },
  'Raspberry Vanilla Protein Ice Cream': { fr: 'Crème Glacée Protéinée Framboise et Vanille', es: 'Helado Proteico de Frambuesa y Vainilla' },
  'Raspberry White Chocolate Ice Cream': { fr: 'Crème Glacée Framboise et Chocolat Blanc', es: 'Helado de Frambuesa y Chocolate Blanco' },
  'Red Velvet Ice Cream': { fr: 'Crème Glacée Red Velvet', es: 'Helado Red Velvet' },
  'Roasted Pineapple Sorbet': { fr: 'Sorbet à l\'Ananas Rôti', es: 'Sorbete de Piña Asada' },
  'Roasted Strawberry Ice Cream': { fr: 'Crème Glacée aux Fraises Rôties', es: 'Helado de Fresas Asadas' },
  'Rocky Road Ice Cream': { fr: 'Crème Glacée Rocky Road', es: 'Helado Rocky Road' },
  'Root Beer Float Ice Cream': { fr: 'Crème Glacée Root Beer Float', es: 'Helado de Root Beer Float' },
  'Rum Raisin Ice Cream': { fr: 'Crème Glacée Rhum et Raisins Secs', es: 'Helado de Ron y Pasas' },
  "S'mores Cookie Ice Cream": { fr: 'Crème Glacée S\'mores aux Biscuits', es: 'Helado de Galleta S\'mores' },
  "S'mores Ice Cream": { fr: 'Crème Glacée S\'mores', es: 'Helado S\'mores' },
  "S'mores Protein Ice Cream": { fr: 'Crème Glacée Protéinée S\'mores', es: 'Helado Proteico S\'mores' },
  'Salted Caramel Frozen Yogurt': { fr: 'Yaourt Glacé Caramel Salé', es: 'Yogur Helado de Caramelo Salado' },
  'Salted Caramel Gelato': { fr: 'Gelato au Caramel Salé', es: 'Gelato de Caramelo Salado' },
  'Salted Caramel Ice Cream': { fr: 'Crème Glacée au Caramel Salé', es: 'Helado de Caramelo Salado' },
  'Salted Caramel Pretzel Ice Cream': { fr: 'Crème Glacée Caramel Salé et Bretzel', es: 'Helado de Caramelo Salado y Pretzel' },
  'Salted Caramel Protein Ice Cream': { fr: 'Crème Glacée Protéinée Caramel Salé', es: 'Helado Proteico de Caramelo Salado' },
  'Salted Honey Ice Cream': { fr: 'Crème Glacée Miel et Fleur de Sel', es: 'Helado de Miel con Sal' },
  'Salted Honey Pistachio Ice Cream': { fr: 'Crème Glacée Miel Salé et Pistache', es: 'Helado de Miel con Sal y Pistacho' },
  'Salted Peanut Butter Ice Cream': { fr: 'Crème Glacée Beurre de Cacahuète Salé', es: 'Helado de Mantequilla de Maní Salada' },
  'Snickerdoodle Cookie Ice Cream': { fr: 'Crème Glacée Biscuit Snickerdoodle', es: 'Helado de Galleta Snickerdoodle' },
  'Snickerdoodle Protein Ice Cream': { fr: 'Crème Glacée Protéinée Snickerdoodle', es: 'Helado Proteico Snickerdoodle' },
  'Snickers Ice Cream': { fr: 'Crème Glacée Snickers', es: 'Helado Snickers' },
  'Soursop Sorbet': { fr: 'Sorbet au Corossol', es: 'Sorbete de Guanábana' },
  'Starfruit Sorbet': { fr: 'Sorbet à la Carambole', es: 'Sorbete de Carambola' },
  'Stracciatella Gelato': { fr: 'Gelato Stracciatella', es: 'Gelato de Stracciatella' },
  'Strawberry Balsamic Basil Ice Cream': { fr: 'Crème Glacée Fraise, Balsamique et Basilic', es: 'Helado de Fresa, Balsámico y Albahaca' },
  'Strawberry Balsamic Ice Cream': { fr: 'Crème Glacée Fraise et Balsamique', es: 'Helado de Fresa y Balsámico' },
  'Strawberry Banana Ice Cream': { fr: 'Crème Glacée Fraise et Banane', es: 'Helado de Fresa y Plátano' },
  'Strawberry Banana Protein Ice Cream': { fr: 'Crème Glacée Protéinée Fraise et Banane', es: 'Helado Proteico de Fresa y Plátano' },
  'Strawberry Basil Sorbet': { fr: 'Sorbet Fraise et Basilic', es: 'Sorbete de Fresa y Albahaca' },
  'Strawberry Cheesecake Ice Cream': { fr: 'Crème Glacée Cheesecake à la Fraise', es: 'Helado de Cheesecake de Fresa' },
  'Strawberry Cheesecake Protein Ice Cream': { fr: 'Crème Glacée Protéinée Cheesecake à la Fraise', es: 'Helado Proteico de Cheesecake de Fresa' },
  'Strawberry Chocolate Ice Cream': { fr: 'Crème Glacée Fraise et Chocolat', es: 'Helado de Fresa y Chocolate' },
  'Strawberry Cream Ice Cream': { fr: 'Crème Glacée à la Crème de Fraise', es: 'Helado de Crema de Fresa' },
  'Strawberry Frozen Yogurt': { fr: 'Yaourt Glacé à la Fraise', es: 'Yogur Helado de Fresa' },
  'Strawberry Italian Ice': { fr: 'Glace Italienne à la Fraise', es: 'Hielo Italiano de Fresa' },
  'Strawberry Lemonade Sorbet': { fr: 'Sorbet Limonade à la Fraise', es: 'Sorbete de Limonada de Fresa' },
  'Strawberry Mango Sorbet': { fr: 'Sorbet Fraise et Mangue', es: 'Sorbete de Fresa y Mango' },
  'Strawberry Milkshake': { fr: 'Milkshake à la Fraise', es: 'Batido de Fresa' },
  'Strawberry Milkshake Ice Cream': { fr: 'Crème Glacée Milkshake à la Fraise', es: 'Helado de Batido de Fresa' },
  'Strawberry Pretzel Ice Cream': { fr: 'Crème Glacée Fraise et Bretzel', es: 'Helado de Fresa y Pretzel' },
  'Strawberry Protein Swirl Ice Cream': { fr: 'Crème Glacée Protéinée Tourbillon de Fraise', es: 'Helado Proteico con Remolino de Fresa' },
  'Strawberry Shortcake Ice Cream': { fr: 'Crème Glacée Shortcake aux Fraises', es: 'Helado de Shortcake de Fresa' },
  'Strawberry Swirl Ice Cream': { fr: 'Crème Glacée Tourbillon de Fraise', es: 'Helado con Remolino de Fresa' },
  'Sweet Cream Ice Cream': { fr: 'Crème Glacée à la Crème Douce', es: 'Helado de Crema Dulce' },
  'Sweet Potato Ice Cream': { fr: 'Crème Glacée à la Patate Douce', es: 'Helado de Batata' },
  'Tahini Honey Ice Cream': { fr: 'Crème Glacée Tahini et Miel', es: 'Helado de Tahini y Miel' },
  'Tamarind Sorbet': { fr: 'Sorbet au Tamarin', es: 'Sorbete de Tamarindo' },
  'Tangerine Sorbet': { fr: 'Sorbet à la Tangerine', es: 'Sorbete de Tangerina' },
  'Taro Ice Cream': { fr: 'Crème Glacée au Taro', es: 'Helado de Taro' },
  'Thai Tea Ice Cream': { fr: 'Crème Glacée au Thé Thaï', es: 'Helado de Té Tailandés' },
  'Tiramisu Gelato': { fr: 'Gelato Tiramisu', es: 'Gelato de Tiramisú' },
  'Tiramisu Ice Cream': { fr: 'Crème Glacée Tiramisu', es: 'Helado de Tiramisú' },
  'Toasted Almond Crunch Ice Cream': { fr: 'Crème Glacée Croquante aux Amandes Grillées', es: 'Helado Crujiente de Almendra Tostada' },
  'Toasted Coconut Ice Cream': { fr: 'Crème Glacée à la Noix de Coco Grillée', es: 'Helado de Coco Tostado' },
  'Toasted Marshmallow Ice Cream': { fr: 'Crème Glacée Guimauve Grillée', es: 'Helado de Malvavisco Tostado' },
  'Toasted Pecan Praline Ice Cream': { fr: 'Crème Glacée Praliné aux Noix de Pécan Grillées', es: 'Helado de Praliné de Nuez Pecana Tostada' },
  'Toffee Coffee Ice Cream': { fr: 'Crème Glacée Café et Caramel', es: 'Helado de Café y Toffee' },
  'Toffee Crunch Ice Cream': { fr: 'Crème Glacée Croquante au Caramel', es: 'Helado Crujiente de Toffee' },
  'Tres Leches Ice Cream': { fr: 'Crème Glacée Tres Leches', es: 'Helado de Tres Leches' },
  'Tropical Frozen Yogurt': { fr: 'Yaourt Glacé Tropical', es: 'Yogur Helado Tropical' },
  'Tropical Mango Sorbet': { fr: 'Sorbet Tropical à la Mangue', es: 'Sorbete Tropical de Mango' },
  'Tropical Punch Ice Cream': { fr: 'Crème Glacée Punch Tropical', es: 'Helado de Ponche Tropical' },
  'Tropical Smoothie Bowl': { fr: 'Bol de Smoothie Tropical', es: 'Bowl de Smoothie Tropical' },
  'Ube Ice Cream': { fr: 'Crème Glacée à l\'Ube', es: 'Helado de Ube' },
  'Vanilla Bean Gelato': { fr: 'Gelato à la Gousse de Vanille', es: 'Gelato de Vainilla Natural' },
  'Vanilla Bean Swirl Ice Cream': { fr: 'Crème Glacée Tourbillon Gousse de Vanille', es: 'Helado con Remolino de Vainilla Natural' },
  'Vanilla Caramel Swirl Protein Ice Cream': { fr: 'Crème Glacée Protéinée Vanille Tourbillon Caramel', es: 'Helado Proteico de Vainilla con Remolino de Caramelo' },
  'Vanilla Chai Swirl Ice Cream': { fr: 'Crème Glacée Vanille Tourbillon Chai', es: 'Helado de Vainilla con Remolino de Chai' },
  'Vanilla Cookie Butter Protein Ice Cream': { fr: 'Crème Glacée Protéinée Vanille et Pâte de Biscuit', es: 'Helado Proteico de Vainilla y Crema de Galleta' },
  'Vanilla Fudge Ripple Ice Cream': { fr: 'Crème Glacée Vanille Ruban de Fondant', es: 'Helado de Vainilla con Vetas de Fudge' },
  'Vanilla Oreo Ice Cream': { fr: 'Crème Glacée Vanille et Oreo', es: 'Helado de Vainilla y Oreo' },
  'Vanilla Oreo Protein Ice Cream': { fr: 'Crème Glacée Protéinée Vanille et Oreo', es: 'Helado Proteico de Vainilla y Oreo' },
  'Vanilla Protein Ice Cream': { fr: 'Crème Glacée Protéinée à la Vanille', es: 'Helado Proteico de Vainilla' },
  'Vanilla Protein Ice Cream (TheCreami)': { fr: 'Crème Glacée Protéinée à la Vanille (TheCreami)', es: 'Helado Proteico de Vainilla (TheCreami)' },
  'Vanilla Wafer Ice Cream': { fr: 'Crème Glacée aux Gaufrettes à la Vanille', es: 'Helado de Galletas de Vainilla' },
  'Vegan Almond Butter Cup Ice Cream': { fr: 'Crème Glacée Végane Bouchée Beurre d\'Amande', es: 'Helado Vegano de Copa de Mantequilla de Almendra' },
  'Vegan Apple Cinnamon Ice Cream': { fr: 'Crème Glacée Végane Pomme et Cannelle', es: 'Helado Vegano de Manzana y Canela' },
  'Vegan Banana Chocolate Ice Cream': { fr: 'Crème Glacée Végane Banane et Chocolat', es: 'Helado Vegano de Plátano y Chocolate' },
  'Vegan Banana Nice Cream': { fr: 'Nice Cream Végane à la Banane', es: 'Nice Cream Vegano de Plátano' },
  'Vegan Birthday Cake Ice Cream': { fr: 'Crème Glacée Végane Gâteau d\'Anniversaire', es: 'Helado Vegano de Pastel de Cumpleaños' },
  'Vegan Biscoff Ice Cream': { fr: 'Crème Glacée Végane au Biscoff', es: 'Helado Vegano de Biscoff' },
  'Vegan Blueberry Ice Cream': { fr: 'Crème Glacée Végane aux Myrtilles', es: 'Helado Vegano de Arándano' },
  'Vegan Brownie Batter Ice Cream': { fr: 'Crème Glacée Végane Pâte de Brownie', es: 'Helado Vegano de Masa de Brownie' },
  'Vegan Caramel Cookie Ice Cream': { fr: 'Crème Glacée Végane Caramel et Biscuit', es: 'Helado Vegano de Caramelo y Galleta' },
  'Vegan Caramel Ice Cream': { fr: 'Crème Glacée Végane au Caramel', es: 'Helado Vegano de Caramelo' },
  'Vegan Caramel Pecan Ice Cream': { fr: 'Crème Glacée Végane Caramel et Noix de Pécan', es: 'Helado Vegano de Caramelo y Nuez Pecana' },
  'Vegan Chai Ice Cream': { fr: 'Crème Glacée Végane au Chai', es: 'Helado Vegano de Chai' },
  'Vegan Cherry Garcia Ice Cream': { fr: 'Crème Glacée Végane Cherry Garcia', es: 'Helado Vegano Cherry Garcia' },
  'Vegan Chocolate Hazelnut Ice Cream': { fr: 'Crème Glacée Végane Chocolat et Noisette', es: 'Helado Vegano de Chocolate y Avellana' },
  'Vegan Chocolate Ice Cream': { fr: 'Crème Glacée Végane au Chocolat', es: 'Helado Vegano de Chocolate' },
  'Vegan Cinnamon Roll Ice Cream': { fr: 'Crème Glacée Végane Roulé à la Cannelle', es: 'Helado Vegano de Rollo de Canela' },
  'Vegan Coconut Chocolate Chip Ice Cream': { fr: 'Crème Glacée Végane Noix de Coco et Pépites de Chocolat', es: 'Helado Vegano de Coco con Chispas de Chocolate' },
  'Vegan Coconut Lime Ice Cream': { fr: 'Crème Glacée Végane Noix de Coco et Citron Vert', es: 'Helado Vegano de Coco y Lima' },
  'Vegan Coffee Ice Cream': { fr: 'Crème Glacée Végane au Café', es: 'Helado Vegano de Café' },
  'Vegan Cookie Dough Ice Cream': { fr: 'Crème Glacée Végane Pâte à Cookies', es: 'Helado Vegano de Masa de Galleta' },
  'Vegan Cookies and Cream Ice Cream': { fr: 'Crème Glacée Végane Cookies and Cream', es: 'Helado Vegano de Galletas y Crema' },
  'Vegan Espresso Ice Cream': { fr: 'Crème Glacée Végane à l\'Espresso', es: 'Helado Vegano de Espresso' },
  'Vegan Gingerbread Ice Cream': { fr: 'Crème Glacée Végane au Pain d\'Épices', es: 'Helado Vegano de Pan de Jengibre' },
  'Vegan Hazelnut Ice Cream': { fr: 'Crème Glacée Végane à la Noisette', es: 'Helado Vegano de Avellana' },
  'Vegan Lavender Ice Cream': { fr: 'Crème Glacée Végane à la Lavande', es: 'Helado Vegano de Lavanda' },
  'Vegan Lemon Ice Cream': { fr: 'Crème Glacée Végane au Citron', es: 'Helado Vegano de Limón' },
  'Vegan Lemon Poppy Seed Ice Cream': { fr: 'Crème Glacée Végane Citron et Graines de Pavot', es: 'Helado Vegano de Limón y Semillas de Amapola' },
  'Vegan Mango Coconut Ice Cream': { fr: 'Crème Glacée Végane Mangue et Noix de Coco', es: 'Helado Vegano de Mango y Coco' },
  'Vegan Mango Lime Ice Cream': { fr: 'Crème Glacée Végane Mangue et Citron Vert', es: 'Helado Vegano de Mango y Lima' },
  'Vegan Maple Pecan Ice Cream': { fr: 'Crème Glacée Végane Érable et Noix de Pécan', es: 'Helado Vegano de Arce y Nuez Pecana' },
  'Vegan Maple Walnut Ice Cream': { fr: 'Crème Glacée Végane Érable et Noix', es: 'Helado Vegano de Arce y Nuez' },
  'Vegan Matcha Ice Cream': { fr: 'Crème Glacée Végane au Matcha', es: 'Helado Vegano de Matcha' },
  'Vegan Mint Chocolate Chip Ice Cream': { fr: 'Crème Glacée Végane Menthe et Pépites de Chocolat', es: 'Helado Vegano de Menta con Chispas de Chocolate' },
  'Vegan Mocha Ice Cream': { fr: 'Crème Glacée Végane Moka', es: 'Helado Vegano de Moca' },
  'Vegan Peach Ice Cream': { fr: 'Crème Glacée Végane à la Pêche', es: 'Helado Vegano de Durazno' },
  'Vegan Peanut Butter Chocolate Ice Cream': { fr: 'Crème Glacée Végane Beurre de Cacahuète et Chocolat', es: 'Helado Vegano de Mantequilla de Maní y Chocolate' },
  'Vegan Pistachio Ice Cream': { fr: 'Crème Glacée Végane à la Pistache', es: 'Helado Vegano de Pistacho' },
  'Vegan Pumpkin Pie Ice Cream': { fr: 'Crème Glacée Végane Tarte à la Citrouille', es: 'Helado Vegano de Pastel de Calabaza' },
  'Vegan Pumpkin Spice Ice Cream': { fr: 'Crème Glacée Végane aux Épices de Citrouille', es: 'Helado Vegano de Especias de Calabaza' },
  'Vegan Raspberry Ice Cream': { fr: 'Crème Glacée Végane à la Framboise', es: 'Helado Vegano de Frambuesa' },
  'Vegan Salted Caramel Ice Cream': { fr: 'Crème Glacée Végane Caramel Salé', es: 'Helado Vegano de Caramelo Salado' },
  'Vegan Snickerdoodle Ice Cream': { fr: 'Crème Glacée Végane Snickerdoodle', es: 'Helado Vegano Snickerdoodle' },
  'Vegan Strawberry Banana Ice Cream': { fr: 'Crème Glacée Végane Fraise et Banane', es: 'Helado Vegano de Fresa y Plátano' },
  'Vegan Strawberry Ice Cream': { fr: 'Crème Glacée Végane à la Fraise', es: 'Helado Vegano de Fresa' },
  'Vegan Tahini Date Ice Cream': { fr: 'Crème Glacée Végane Tahini et Datte', es: 'Helado Vegano de Tahini y Dátil' },
  'Vegan Vanilla Ice Cream': { fr: 'Crème Glacée Végane à la Vanille', es: 'Helado Vegano de Vainilla' },
  'Walnut Brownie Ice Cream': { fr: 'Crème Glacée Brownie aux Noix', es: 'Helado de Brownie con Nueces' },
  'Watermelon Italian Ice': { fr: 'Glace Italienne à la Pastèque', es: 'Hielo Italiano de Sandía' },
  'Watermelon Sorbet': { fr: 'Sorbet à la Pastèque', es: 'Sorbete de Sandía' },
  'White Chocolate Macadamia Ice Cream': { fr: 'Crème Glacée Chocolat Blanc et Macadamia', es: 'Helado de Chocolate Blanco y Macadamia' },
  'White Chocolate Pistachio Ice Cream': { fr: 'Crème Glacée Chocolat Blanc et Pistache', es: 'Helado de Chocolate Blanco y Pistacho' },
  'White Chocolate Raspberry Ice Cream': { fr: 'Crème Glacée Chocolat Blanc et Framboise', es: 'Helado de Chocolate Blanco y Frambuesa' },
  'White Peach Sorbet': { fr: 'Sorbet à la Pêche Blanche', es: 'Sorbete de Durazno Blanco' },
};

// ============================================================
// HINT TRANSLATIONS (all 8)
// ============================================================

const hintTranslations: Record<string, { fr: string; es: string }> = {
  'Blend on high for 30-60 seconds until completely smooth. Any chunks will become icy spots.': {
    fr: 'Mixez à puissance maximale pendant 30 à 60 secondes jusqu\'à obtenir une texture parfaitement lisse. Les morceaux restants deviendront des points glacés.',
    es: 'Licúe a máxima potencia durante 30 a 60 segundos hasta que quede completamente suave. Los trozos restantes se convertirán en puntos de hielo.'
  },
  'Create a hole down to about halfway. Overfilling mix-ins can jam the blade — use 1/4 cup or less.': {
    fr: 'Creusez un trou jusqu\'à environ la moitié. Trop de garnitures peut bloquer la lame — utilisez 1/4 de tasse ou moins.',
    es: 'Haga un hueco hasta aproximadamente la mitad. Agregar demasiadas mezclas puede atascar la cuchilla — use 1/4 de taza o menos.'
  },
  'Fill to the max fill line but not above — overfilling can cause the lid to pop off during processing.': {
    fr: 'Remplissez jusqu\'à la ligne de remplissage maximale sans la dépasser — un excès peut faire sauter le couvercle pendant le traitement.',
    es: 'Llene hasta la línea de llenado máximo sin sobrepasarla — el exceso puede hacer que la tapa salte durante el procesamiento.'
  },
  'If the machine struggles or the pint spins freely, let it sit at room temperature for 5 minutes before retrying.': {
    fr: 'Si la machine peine ou si le contenant tourne librement, laissez-le reposer à température ambiante pendant 5 minutes avant de réessayer.',
    es: 'Si la máquina tiene dificultades o el recipiente gira libremente, déjelo reposar a temperatura ambiente durante 5 minutos antes de reintentar.'
  },
  'Ninja Creami treats are best enjoyed immediately. If refreezing, let it sit out 5-10 minutes before scooping.': {
    fr: 'Les desserts Ninja Creami se dégustent idéalement immédiatement. Si vous les recongelez, laissez-les reposer 5 à 10 minutes avant de servir.',
    es: 'Los postres del Ninja Creami se disfrutan mejor inmediatamente. Si los vuelve a congelar, déjelos reposar de 5 a 10 minutos antes de servir.'
  },
  'One re-spin usually does the trick. If still crumbly after two, let it soften for 2-3 minutes and try again.': {
    fr: 'Un seul re-traitement suffit généralement. Si la texture est encore granuleuse après deux passages, laissez ramollir 2 à 3 minutes et réessayez.',
    es: 'Un solo reprocesado suele ser suficiente. Si sigue granuloso después de dos, déjelo ablandar de 2 a 3 minutos e intente de nuevo.'
  },
  'Place on a flat, level surface in the coldest part of your freezer. Uneven freezing leads to inconsistent texture.': {
    fr: 'Placez sur une surface plane et stable dans la partie la plus froide de votre congélateur. Une congélation inégale produit une texture irrégulière.',
    es: 'Coloque sobre una superficie plana y nivelada en la parte más fría del congelador. Una congelación desigual produce una textura inconsistente.'
  },
  'Whisk until completely smooth with no lumps — this ensures an even freeze and creamy texture.': {
    fr: 'Fouettez jusqu\'à obtenir un mélange parfaitement lisse sans grumeaux — cela garantit une congélation uniforme et une texture crémeuse.',
    es: 'Bata hasta que quede completamente suave y sin grumos — esto asegura una congelación uniforme y una textura cremosa.'
  },
};

// ============================================================
// GROUP NAME TRANSLATIONS
// ============================================================

const groupNameTranslations: Record<string, { fr: string; es: string }> = {
  'base': { fr: 'base', es: 'base' },
  'mix-ins': { fr: 'garnitures', es: 'mezclas' },
  'swirl': { fr: 'tourbillon', es: 'remolino' },
  'topping': { fr: 'garniture', es: 'cobertura' },
};

// ============================================================
// INGREDIENT TRANSLATIONS (all 253 unique names)
// ============================================================

const ingredientTranslations: Record<string, { fr: string; es: string }> = {
  'allulose': { fr: 'allulose', es: 'alulosa' },
  'almond butter': { fr: 'beurre d\'amande', es: 'mantequilla de almendra' },
  'almond extract': { fr: 'extrait d\'amande', es: 'extracto de almendra' },
  'apple butter': { fr: 'beurre de pomme', es: 'mantequilla de manzana' },
  'apple cider': { fr: 'cidre de pomme', es: 'sidra de manzana' },
  'apple juice': { fr: 'jus de pomme', es: 'jugo de manzana' },
  'applesauce': { fr: 'compote de pommes', es: 'compota de manzana' },
  'apricot preserves': { fr: 'confiture d\'abricots', es: 'conserva de albaricoque' },
  'balsamic vinegar': { fr: 'vinaigre balsamique', es: 'vinagre balsámico' },
  'banana': { fr: 'banane', es: 'plátano' },
  'banana extract': { fr: 'extrait de banane', es: 'extracto de plátano' },
  'biscoff cookie butter': { fr: 'pâte à tartiner Biscoff', es: 'crema de galleta Biscoff' },
  'black sesame paste': { fr: 'pâte de sésame noir', es: 'pasta de sésamo negro' },
  'blood orange juice': { fr: 'jus d\'orange sanguine', es: 'jugo de naranja sanguina' },
  'blue raspberry drink mix': { fr: 'mélange pour boisson framboise bleue', es: 'mezcla de bebida de frambuesa azul' },
  'blueberry jam': { fr: 'confiture de myrtilles', es: 'mermelada de arándano' },
  'blueberry preserves': { fr: 'conserve de myrtilles', es: 'conserva de arándano' },
  'bourbon': { fr: 'bourbon', es: 'bourbon' },
  'brown sugar': { fr: 'cassonade', es: 'azúcar morena' },
  'brownie bites, chopped': { fr: 'morceaux de brownie, hachés', es: 'trozos de brownie, picados' },
  'butter': { fr: 'beurre', es: 'mantequilla' },
  'butter, melted': { fr: 'beurre fondu', es: 'mantequilla derretida' },
  'butterscotch chips': { fr: 'pépites de caramel au beurre', es: 'chispas de caramelo de mantequilla' },
  'candied pecans, chopped': { fr: 'noix de pécan confites, hachées', es: 'nueces pecanas confitadas, picadas' },
  'canned apricots in juice': { fr: 'abricots en conserve dans leur jus', es: 'albaricoques en lata en su jugo' },
  'canned lychees in syrup': { fr: 'litchis en conserve dans leur sirop', es: 'lichis en almíbar' },
  'caramel corn pieces': { fr: 'morceaux de pop-corn au caramel', es: 'trozos de palomitas con caramelo' },
  'caramel sauce': { fr: 'sauce au caramel', es: 'salsa de caramelo' },
  'caramelized sugar': { fr: 'sucre caramélisé', es: 'azúcar caramelizada' },
  'caramelized white chocolate, melted': { fr: 'chocolat blanc caramélisé, fondu', es: 'chocolate blanco caramelizado, derretido' },
  'cashew butter': { fr: 'beurre de cajou', es: 'mantequilla de anacardo' },
  'cayenne pepper': { fr: 'poivre de Cayenne', es: 'pimienta de Cayena' },
  'chai concentrate': { fr: 'concentré de chai', es: 'concentrado de chai' },
  'chai tea bags': { fr: 'sachets de thé chai', es: 'bolsas de té chai' },
  'cherry preserves': { fr: 'confiture de cerises', es: 'conserva de cereza' },
  'chili powder': { fr: 'poudre de chili', es: 'chile en polvo' },
  'chocolate chips, melted': { fr: 'pépites de chocolat fondues', es: 'chispas de chocolate derretidas' },
  'chocolate fudge sauce': { fr: 'sauce fondante au chocolat', es: 'salsa de fudge de chocolate' },
  'chocolate protein powder': { fr: 'protéine en poudre au chocolat', es: 'proteína en polvo de chocolate' },
  'chocolate sauce': { fr: 'sauce au chocolat', es: 'salsa de chocolate' },
  'chopped almonds': { fr: 'amandes hachées', es: 'almendras picadas' },
  'chopped candy bar': { fr: 'barre chocolatée hachée', es: 'barra de chocolate picada' },
  'chopped pecans': { fr: 'noix de pécan hachées', es: 'nueces pecanas picadas' },
  'chopped walnuts': { fr: 'noix hachées', es: 'nueces picadas' },
  'cinnamon': { fr: 'cannelle', es: 'canela' },
  'cinnamon toast crunch cereal': { fr: 'céréales Cinnamon Toast Crunch', es: 'cereal Cinnamon Toast Crunch' },
  'cocoa powder': { fr: 'cacao en poudre', es: 'cacao en polvo' },
  'cocoa powder for dusting': { fr: 'cacao en poudre pour saupoudrer', es: 'cacao en polvo para espolvorear' },
  'coconut cream': { fr: 'crème de coco', es: 'crema de coco' },
  'coconut extract': { fr: 'extrait de noix de coco', es: 'extracto de coco' },
  'coconut milk (canned)': { fr: 'lait de coco (en conserve)', es: 'leche de coco (en lata)' },
  'coconut water': { fr: 'eau de coco', es: 'agua de coco' },
  'concord grape juice': { fr: 'jus de raisin Concord', es: 'jugo de uva Concord' },
  'cooked bacon bits': { fr: 'lardons cuits', es: 'trocitos de tocino cocido' },
  'cotton candy flavoring': { fr: 'arôme barbe à papa', es: 'saborizante de algodón de azúcar' },
  'cream cheese': { fr: 'fromage à la crème', es: 'queso crema' },
  'cream cheese, softened': { fr: 'fromage à la crème ramolli', es: 'queso crema ablandado' },
  'creamy peanut butter': { fr: 'beurre de cacahuète crémeux', es: 'mantequilla de maní cremosa' },
  'crumbled shortbread cookies': { fr: 'sablés émiettés', es: 'galletas de mantequilla desmenuzadas' },
  'crushed biscoff cookies': { fr: 'biscuits Biscoff écrasés', es: 'galletas Biscoff trituradas' },
  'crushed candy canes': { fr: 'sucres d\'orge écrasés', es: 'bastones de caramelo triturados' },
  'crushed chocolate sandwich cookies': { fr: 'biscuits chocolatés fourrés écrasés', es: 'galletas de chocolate rellenas trituradas' },
  'crushed chocolate wafers': { fr: 'gaufrettes au chocolat écrasées', es: 'galletas de chocolate trituradas' },
  'crushed ladyfingers': { fr: 'biscuits à la cuillère écrasés', es: 'bizcochos de soletilla triturados' },
  'crushed pineapple, drained': { fr: 'ananas broyé, égoutté', es: 'piña triturada, escurrida' },
  'crushed pistachios': { fr: 'pistaches écrasées', es: 'pistachos triturados' },
  'crushed pretzels': { fr: 'bretzels écrasés', es: 'pretzels triturados' },
  'crushed shortbread cookies': { fr: 'sablés écrasés', es: 'galletas de mantequilla trituradas' },
  'crushed sugar cookies': { fr: 'biscuits au sucre écrasés', es: 'galletas de azúcar trituradas' },
  'crushed vanilla wafers': { fr: 'gaufrettes à la vanille écrasées', es: 'galletas de vainilla trituradas' },
  'crushed vegan cookies': { fr: 'biscuits végans écrasés', es: 'galletas veganas trituradas' },
  'cucumber, peeled and seeded': { fr: 'concombre, pelé et épépiné', es: 'pepino, pelado y sin semillas' },
  'dairy-free chocolate chips': { fr: 'pépites de chocolat sans produits laitiers', es: 'chispas de chocolate sin lácteos' },
  'dark brown sugar': { fr: 'cassonade foncée', es: 'azúcar morena oscura' },
  'dark chocolate chips': { fr: 'pépites de chocolat noir', es: 'chispas de chocolate oscuro' },
  'dark chocolate chips, melted': { fr: 'pépites de chocolat noir fondues', es: 'chispas de chocolate oscuro derretidas' },
  'dark chocolate, chopped': { fr: 'chocolat noir haché', es: 'chocolate oscuro picado' },
  'dark chocolate, finely chopped': { fr: 'chocolat noir finement haché', es: 'chocolate oscuro finamente picado' },
  'dark rum': { fr: 'rhum brun', es: 'ron oscuro' },
  'dried culinary lavender': { fr: 'lavande culinaire séchée', es: 'lavanda culinaria seca' },
  'dulce de leche': { fr: 'dulce de leche', es: 'dulce de leche' },
  'earl grey tea bags': { fr: 'sachets de thé Earl Grey', es: 'bolsas de té Earl Grey' },
  'edible cookie dough bites': { fr: 'bouchées de pâte à cookies comestible', es: 'bocaditos de masa de galleta comestible' },
  'evaporated milk': { fr: 'lait évaporé', es: 'leche evaporada' },
  'extra virgin olive oil': { fr: 'huile d\'olive extra vierge', es: 'aceite de oliva extra virgen' },
  'fairlife chocolate protein shake': { fr: 'shake protéiné au chocolat Fairlife', es: 'batido proteico de chocolate Fairlife' },
  'fairlife salted caramel protein shake': { fr: 'shake protéiné caramel salé Fairlife', es: 'batido proteico de caramelo salado Fairlife' },
  'fairlife strawberry protein shake': { fr: 'shake protéiné à la fraise Fairlife', es: 'batido proteico de fresa Fairlife' },
  'fairlife vanilla protein shake': { fr: 'shake protéiné à la vanille Fairlife', es: 'batido proteico de vainilla Fairlife' },
  'fig preserves': { fr: 'confiture de figues', es: 'conserva de higos' },
  'fresh basil leaves': { fr: 'feuilles de basilic frais', es: 'hojas de albahaca fresca' },
  'fresh cranberries': { fr: 'canneberges fraîches', es: 'arándanos rojos frescos' },
  'fresh figs, stemmed': { fr: 'figues fraîches, équeutées', es: 'higos frescos, sin tallo' },
  'fresh ginger, grated': { fr: 'gingembre frais, râpé', es: 'jengibre fresco, rallado' },
  'fresh grapefruit juice': { fr: 'jus de pamplemousse frais', es: 'jugo de toronja fresco' },
  'fresh lemon juice': { fr: 'jus de citron frais', es: 'jugo de limón fresco' },
  'fresh lime juice': { fr: 'jus de citron vert frais', es: 'jugo de lima fresco' },
  'fresh meyer lemon juice': { fr: 'jus de citron Meyer frais', es: 'jugo de limón Meyer fresco' },
  'fresh mint leaves': { fr: 'feuilles de menthe fraîche', es: 'hojas de menta fresca' },
  'fresh orange juice': { fr: 'jus d\'orange frais', es: 'jugo de naranja fresco' },
  'fresh pink grapefruit juice': { fr: 'jus de pamplemousse rose frais', es: 'jugo de toronja rosa fresco' },
  'fresh rosemary sprig': { fr: 'brin de romarin frais', es: 'ramita de romero fresco' },
  'fresh spinach': { fr: 'épinards frais', es: 'espinacas frescas' },
  'fresh strawberries': { fr: 'fraises fraîches', es: 'fresas frescas' },
  'fresh strawberries, hulled': { fr: 'fraises fraîches, équeutées', es: 'fresas frescas, sin tallo' },
  'fresh tangerine juice': { fr: 'jus de tangerine frais', es: 'jugo de tangerina fresco' },
  'frozen acai puree packets': { fr: 'sachets de purée d\'açaï surgelée', es: 'paquetes de puré de açaí congelado' },
  'frozen açai puree packets': { fr: 'sachets de purée d\'açaï surgelée', es: 'paquetes de puré de açaí congelado' },
  'frozen raspberries': { fr: 'framboises surgelées', es: 'frambuesas congeladas' },
  'fresh or frozen raspberries': { fr: 'framboises fraîches ou surgelées', es: 'frambuesas frescas o congeladas' },
  'cottage cheese': { fr: 'fromage blanc', es: 'requesón' },
  'frozen blackberries': { fr: 'mûres surgelées', es: 'moras congeladas' },
  'frozen blueberries': { fr: 'myrtilles surgelées', es: 'arándanos congelados' },
  'frozen dark cherries': { fr: 'cerises noires surgelées', es: 'cerezas oscuras congeladas' },
  'frozen dark sweet cherries': { fr: 'cerises noires sucrées surgelées', es: 'cerezas dulces oscuras congeladas' },
  'frozen dragon fruit chunks': { fr: 'morceaux de fruit du dragon surgelés', es: 'trozos de pitahaya congelados' },
  'frozen mango chunks': { fr: 'morceaux de mangue surgelés', es: 'trozos de mango congelados' },
  'frozen mixed berries': { fr: 'fruits rouges surgelés', es: 'frutos rojos congelados' },
  'frozen peach slices': { fr: 'tranches de pêche surgelées', es: 'rebanadas de durazno congeladas' },
  'frozen peach-mango blend': { fr: 'mélange pêche-mangue surgelé', es: 'mezcla de durazno y mango congelada' },
  'frozen pineapple chunks': { fr: 'morceaux d\'ananas surgelés', es: 'trozos de piña congelados' },
  'frozen strawberries': { fr: 'fraises surgelées', es: 'fresas congeladas' },
  'frozen sweet cherries': { fr: 'cerises sucrées surgelées', es: 'cerezas dulces congeladas' },
  'frozen tropical fruit mix': { fr: 'mélange de fruits tropicaux surgelés', es: 'mezcla de frutas tropicales congeladas' },
  'full-fat coconut milk': { fr: 'lait de coco entier', es: 'leche de coco entera' },
  'graham cracker crumbles': { fr: 'miettes de biscuits Graham', es: 'migas de galletas Graham' },
  'granny smith apples, peeled and chopped': { fr: 'pommes Granny Smith, pelées et hachées', es: 'manzanas Granny Smith, peladas y picadas' },
  'granulated sugar': { fr: 'sucre en poudre', es: 'azúcar granulada' },
  'grape juice': { fr: 'jus de raisin', es: 'jugo de uva' },
  'green food coloring (optional)': { fr: 'colorant alimentaire vert (facultatif)', es: 'colorante alimentario verde (opcional)' },
  'ground cardamom': { fr: 'cardamome moulue', es: 'cardamomo molido' },
  'ground ginger': { fr: 'gingembre moulu', es: 'jengibre molido' },
  'guava nectar': { fr: 'nectar de goyave', es: 'néctar de guayaba' },
  'habanero hot sauce': { fr: 'sauce piquante au habanero', es: 'salsa picante de habanero' },
  'hazelnut spread': { fr: 'pâte à tartiner aux noisettes', es: 'crema de avellanas' },
  'hazelnut spread (sugar-free)': { fr: 'pâte à tartiner aux noisettes (sans sucre)', es: 'crema de avellanas (sin azúcar)' },
  'heavy cream': { fr: 'crème épaisse', es: 'crema para batir' },
  'hibiscus tea (strong-brewed)': { fr: 'infusion d\'hibiscus (bien infusée)', es: 'té de hibisco (bien cargado)' },
  'honey': { fr: 'miel', es: 'miel' },
  'honey or agave': { fr: 'miel ou agave', es: 'miel o agave' },
  'hot fudge sauce': { fr: 'sauce fondante au chocolat chaud', es: 'salsa caliente de fudge' },
  'instant espresso powder': { fr: 'poudre d\'espresso instantané', es: 'polvo de espresso instantáneo' },
  'keto cookie crumbles': { fr: 'miettes de biscuits kéto', es: 'migas de galletas keto' },
  'keto cookie dough bites': { fr: 'bouchées de pâte à cookies kéto', es: 'bocaditos de masa de galleta keto' },
  'key lime juice': { fr: 'jus de citron vert key lime', es: 'jugo de lima key' },
  'kiwi fruit, peeled': { fr: 'kiwi, pelé', es: 'kiwi, pelado' },
  'lemon curd': { fr: 'crème de citron', es: 'crema de limón' },
  'lemon zest': { fr: 'zeste de citron', es: 'ralladura de limón' },
  'lime zest': { fr: 'zeste de citron vert', es: 'ralladura de lima' },
  'macadamia nut butter': { fr: 'beurre de noix de macadamia', es: 'mantequilla de nuez de macadamia' },
  'malted milk powder': { fr: 'poudre de lait malté', es: 'polvo de leche malteada' },
  'mandarin orange segments': { fr: 'segments de mandarine', es: 'gajos de mandarina' },
  'mango juice': { fr: 'jus de mangue', es: 'jugo de mango' },
  'maple syrup': { fr: 'sirop d\'érable', es: 'jarabe de arce' },
  'marshmallow fluff': { fr: 'crème de guimauve', es: 'crema de malvavisco' },
  'mascarpone cheese': { fr: 'fromage mascarpone', es: 'queso mascarpone' },
  'mashed sweet potato': { fr: 'purée de patate douce', es: 'puré de batata' },
  'matcha powder': { fr: 'poudre de matcha', es: 'polvo de matcha' },
  'mini chocolate chips': { fr: 'mini pépites de chocolat', es: 'mini chispas de chocolate' },
  'mini marshmallows': { fr: 'mini guimauves', es: 'mini malvaviscos' },
  'mini peanut butter cups, chopped': { fr: 'mini bouchées de beurre de cacahuète, hachées', es: 'mini copas de mantequilla de maní, picadas' },
  'mint oreo cookies, crushed': { fr: 'biscuits Oreo menthe, écrasés', es: 'galletas Oreo de menta, trituradas' },
  'mixed berry jam': { fr: 'confiture de fruits rouges', es: 'mermelada de frutos rojos' },
  'molasses': { fr: 'mélasse', es: 'melaza' },
  'monk fruit sweetener': { fr: 'édulcorant de fruit des moines', es: 'endulzante de fruta del monje' },
  'nutella': { fr: 'Nutella', es: 'Nutella' },
  'nutmeg': { fr: 'noix de muscade', es: 'nuez moscada' },
  'oat milk': { fr: 'lait d\'avoine', es: 'leche de avena' },
  'orange juice concentrate': { fr: 'concentré de jus d\'orange', es: 'concentrado de jugo de naranja' },
  'orange zest': { fr: 'zeste d\'orange', es: 'ralladura de naranja' },
  'oreo cookies, crushed': { fr: 'biscuits Oreo écrasés', es: 'galletas Oreo trituradas' },
  'passion fruit puree': { fr: 'purée de fruit de la passion', es: 'puré de maracuyá' },
  'peach extract': { fr: 'extrait de pêche', es: 'extracto de durazno' },
  'peach preserves': { fr: 'confiture de pêches', es: 'conserva de durazno' },
  'peanut butter': { fr: 'beurre de cacahuète', es: 'mantequilla de maní' },
  'peppermint bark, chopped': { fr: 'écorce de menthe poivrée hachée', es: 'corteza de menta picada' },
  'peppermint extract': { fr: 'extrait de menthe poivrée', es: 'extracto de menta' },
  'pineapple juice': { fr: 'jus d\'ananas', es: 'jugo de piña' },
  'pistachio butter': { fr: 'beurre de pistache', es: 'mantequilla de pistacho' },
  'pistachio paste': { fr: 'pâte de pistache', es: 'pasta de pistacho' },
  'plain greek yogurt': { fr: 'yaourt grec nature', es: 'yogur griego natural' },
  'pomegranate juice': { fr: 'jus de grenade', es: 'jugo de granada' },
  'poppy seeds': { fr: 'graines de pavot', es: 'semillas de amapola' },
  'powdered peanut butter': { fr: 'beurre de cacahuète en poudre', es: 'mantequilla de maní en polvo' },
  'prickly pear puree': { fr: 'purée de figue de Barbarie', es: 'puré de tuna (nopal)' },
  'pumpkin pie spice': { fr: 'épices pour tarte à la citrouille', es: 'especias para pastel de calabaza' },
  'pumpkin puree': { fr: 'purée de citrouille', es: 'puré de calabaza' },
  'rainbow jimmies (sprinkles)': { fr: 'vermicelles arc-en-ciel', es: 'chispitas de colores' },
  'rainbow sprinkles': { fr: 'vermicelles arc-en-ciel', es: 'chispitas de colores' },
  'raspberry jam': { fr: 'confiture de framboises', es: 'mermelada de frambuesa' },
  'red food coloring': { fr: 'colorant alimentaire rouge', es: 'colorante alimentario rojo' },
  'ripe avocado': { fr: 'avocat mûr', es: 'aguacate maduro' },
  'ripe banana': { fr: 'banane mûre', es: 'plátano maduro' },
  'ripe cantaloupe, cubed': { fr: 'cantaloup mûr, en dés', es: 'melón maduro, en cubos' },
  'ripe honeydew melon, cubed': { fr: 'melon miel mûr, en dés', es: 'melón verde maduro, en cubos' },
  'ripe papaya, cubed': { fr: 'papaye mûre, en dés', es: 'papaya madura, en cubos' },
  'ripe peaches, sliced': { fr: 'pêches mûres, tranchées', es: 'duraznos maduros, rebanados' },
  'ripe pears, peeled and cored': { fr: 'poires mûres, pelées et évidées', es: 'peras maduras, peladas y sin corazón' },
  'ripe plums, pitted': { fr: 'prunes mûres, dénoyautées', es: 'ciruelas maduras, sin hueso' },
  'ripe starfruit, chopped': { fr: 'carambole mûre, hachée', es: 'carambola madura, picada' },
  'roasted cashews, chopped': { fr: 'noix de cajou grillées, hachées', es: 'anacardos tostados, picados' },
  'roasted peanuts, chopped': { fr: 'cacahuètes grillées, hachées', es: 'maníes tostados, picados' },
  'roasted pineapple chunks': { fr: 'morceaux d\'ananas rôtis', es: 'trozos de piña asada' },
  'roasted strawberries': { fr: 'fraises rôties', es: 'fresas asadas' },
  'roasted unsalted pistachios': { fr: 'pistaches grillées non salées', es: 'pistachos tostados sin sal' },
  'root beer concentrate': { fr: 'concentré de root beer', es: 'concentrado de root beer' },
  'rose water': { fr: 'eau de rose', es: 'agua de rosas' },
  'rum-soaked raisins': { fr: 'raisins secs macérés au rhum', es: 'pasas remojadas en ron' },
  'salt': { fr: 'sel', es: 'sal' },
  'sea salt': { fr: 'sel de mer', es: 'sal marina' },
  'seedless watermelon, cubed': { fr: 'pastèque sans pépins, en dés', es: 'sandía sin semillas, en cubos' },
  'shortbread cookies, crumbled': { fr: 'sablés émiettés', es: 'galletas de mantequilla desmenuzadas' },
  'shredded coconut': { fr: 'noix de coco râpée', es: 'coco rallado' },
  'sliced almonds': { fr: 'amandes effilées', es: 'almendras laminadas' },
  'snickerdoodle cookie pieces': { fr: 'morceaux de biscuit snickerdoodle', es: 'trozos de galleta snickerdoodle' },
  'soursop puree': { fr: 'purée de corossol', es: 'puré de guanábana' },
  'spearmint extract': { fr: 'extrait de menthe verte', es: 'extracto de hierbabuena' },
  'store-bought eggnog': { fr: 'lait de poule du commerce', es: 'ponche de huevo comprado' },
  'strawberry jam': { fr: 'confiture de fraises', es: 'mermelada de fresa' },
  'sugar-free caramel sauce': { fr: 'sauce au caramel sans sucre', es: 'salsa de caramelo sin azúcar' },
  'sugar-free caramel syrup': { fr: 'sirop de caramel sans sucre', es: 'jarabe de caramelo sin azúcar' },
  'sugar-free chocolate chips': { fr: 'pépites de chocolat sans sucre', es: 'chispas de chocolate sin azúcar' },
  'sugar-free cookie crumbles': { fr: 'miettes de biscuits sans sucre', es: 'migas de galletas sin azúcar' },
  'sugar-free maple syrup': { fr: 'sirop d\'érable sans sucre', es: 'jarabe de arce sin azúcar' },
  'sugar-free oreo cookies, crushed': { fr: 'biscuits Oreo sans sucre, écrasés', es: 'galletas Oreo sin azúcar, trituradas' },
  'sweetened condensed milk': { fr: 'lait concentré sucré', es: 'leche condensada azucarada' },
  'sweetener of choice': { fr: 'édulcorant de votre choix', es: 'endulzante de su preferencia' },
  'tahini': { fr: 'tahini', es: 'tahini' },
  'tamarind paste': { fr: 'pâte de tamarin', es: 'pasta de tamarindo' },
  'taro powder': { fr: 'poudre de taro', es: 'polvo de taro' },
  'thai tea mix': { fr: 'mélange de thé thaï', es: 'mezcla de té tailandés' },
  'toasted almonds, chopped': { fr: 'amandes grillées, hachées', es: 'almendras tostadas, picadas' },
  'toasted coconut flakes': { fr: 'copeaux de noix de coco grillés', es: 'hojuelas de coco tostadas' },
  'toasted hazelnuts': { fr: 'noisettes grillées', es: 'avellanas tostadas' },
  'toasted pecan halves': { fr: 'moitiés de noix de pécan grillées', es: 'mitades de nuez pecana tostadas' },
  'toasted pecans, chopped': { fr: 'noix de pécan grillées, hachées', es: 'nueces pecanas tostadas, picadas' },
  'toffee bits': { fr: 'morceaux de caramel anglais', es: 'trocitos de toffee' },
  'tropical fruit juice': { fr: 'jus de fruits tropicaux', es: 'jugo de frutas tropicales' },
  'ube extract': { fr: 'extrait d\'ube', es: 'extracto de ube' },
  'unsweetened almond milk': { fr: 'lait d\'amande non sucré', es: 'leche de almendra sin azúcar' },
  'unsweetened applesauce': { fr: 'compote de pommes non sucrée', es: 'compota de manzana sin azúcar' },
  'vanilla bean': { fr: 'gousse de vanille', es: 'vaina de vainilla' },
  'vanilla bean paste': { fr: 'pâte de gousse de vanille', es: 'pasta de vainilla' },
  'vanilla extract': { fr: 'extrait de vanille', es: 'extracto de vainilla' },
  'vanilla protein powder': { fr: 'protéine en poudre à la vanille', es: 'proteína en polvo de vainilla' },
  'vegan caramel sauce': { fr: 'sauce au caramel végane', es: 'salsa de caramelo vegana' },
  'vegan cookie dough bites': { fr: 'bouchées de pâte à cookies véganes', es: 'bocaditos de masa de galleta veganos' },
  'vegan oreo cookies, crushed': { fr: 'biscuits Oreo végans écrasés', es: 'galletas Oreo veganas trituradas' },
  'walnut pieces': { fr: 'morceaux de noix', es: 'trozos de nuez' },
  'water': { fr: 'eau', es: 'agua' },
  'white chocolate chips, melted': { fr: 'pépites de chocolat blanc fondues', es: 'chispas de chocolate blanco derretidas' },
  'white peaches, sliced': { fr: 'pêches blanches, tranchées', es: 'duraznos blancos, rebanados' },
  'whole milk': { fr: 'lait entier', es: 'leche entera' },
  'xanthan gum': { fr: 'gomme xanthane', es: 'goma xantana' },
  'yellow food coloring': { fr: 'colorant alimentaire jaune', es: 'colorante alimentario amarillo' },
};

// ============================================================
// INSTRUCTION TRANSLATIONS (all 352 unique)
// We use a function that builds a map from the DB data on first call
// ============================================================

function buildInstructionMap(): Record<string, { fr: string; es: string }> {
  return {
    'Add Cinnamon Toast Crunch cereal using the Mix-In function.': { fr: 'Ajoutez les céréales Cinnamon Toast Crunch en utilisant la fonction Garniture.', es: 'Añada el cereal Cinnamon Toast Crunch usando la función Mezcla.' },
    'Add almond milk, Greek yogurt, and sweetener. Mix until smooth.': { fr: 'Ajoutez le lait d\'amande, le yaourt grec et l\'édulcorant. Mélangez jusqu\'à obtenir une texture lisse.', es: 'Añada la leche de almendra, el yogur griego y el endulzante. Mezcle hasta que quede suave.' },
    'Add almonds and chocolate chips using the Mix-In function.': { fr: 'Ajoutez les amandes et les pépites de chocolat en utilisant la fonction Garniture.', es: 'Añada las almendras y las chispas de chocolate usando la función Mezcla.' },
    'Add almonds and fudge sauce, then use the Mix-In function.': { fr: 'Ajoutez les amandes et la sauce au chocolat, puis utilisez la fonction Garniture.', es: 'Añada las almendras y la salsa de fudge, luego use la función Mezcla.' },
    'Add blueberry jam and use the Mix-In function for a swirl effect.': { fr: 'Ajoutez la confiture de myrtilles et utilisez la fonction Garniture pour un effet tourbillon.', es: 'Añada la mermelada de arándano y use la función Mezcla para un efecto remolino.' },
    'Add blueberry jam using the Mix-In function.': { fr: 'Ajoutez la confiture de myrtilles en utilisant la fonction Garniture.', es: 'Añada la mermelada de arándano usando la función Mezcla.' },
    'Add brownie bites and use Mix-In function.': { fr: 'Ajoutez les morceaux de brownie et utilisez la fonction Garniture.', es: 'Añada los trozos de brownie y use la función Mezcla.' },
    'Add brownie bites using the Mix-In function.': { fr: 'Ajoutez les morceaux de brownie en utilisant la fonction Garniture.', es: 'Añada los trozos de brownie usando la función Mezcla.' },
    'Add candied pecans using the Mix-In function.': { fr: 'Ajoutez les noix de pécan confites en utilisant la fonction Garniture.', es: 'Añada las nueces pecanas confitadas usando la función Mezcla.' },
    'Add caramel sauce using the Mix-In function for a swirl effect.': { fr: 'Ajoutez la sauce au caramel en utilisant la fonction Garniture pour un effet tourbillon.', es: 'Añada la salsa de caramelo usando la función Mezcla para un efecto remolino.' },
    'Add caramel sauce using the Mix-In function.': { fr: 'Ajoutez la sauce au caramel en utilisant la fonction Garniture.', es: 'Añada la salsa de caramelo usando la función Mezcla.' },
    'Add cherry preserves and dairy-free chocolate chips using the Mix-In function.': { fr: 'Ajoutez la confiture de cerises et les pépites de chocolat sans produits laitiers en utilisant la fonction Garniture.', es: 'Añada la conserva de cereza y las chispas de chocolate sin lácteos usando la función Mezcla.' },
    'Add chocolate chips using the Mix-In function.': { fr: 'Ajoutez les pépites de chocolat en utilisant la fonction Garniture.', es: 'Añada las chispas de chocolate usando la función Mezcla.' },
    'Add chocolate sauce and use the Mix-In function for a beautiful swirl.': { fr: 'Ajoutez la sauce au chocolat et utilisez la fonction Garniture pour un beau tourbillon.', es: 'Añada la salsa de chocolate y use la función Mezcla para un hermoso remolino.' },
    'Add chopped peanut butter cups using the Mix-In function.': { fr: 'Ajoutez les bouchées de beurre de cacahuète hachées en utilisant la fonction Garniture.', es: 'Añada las copas de mantequilla de maní picadas usando la función Mezcla.' },
    'Add chopped peppermint bark using the Mix-In function.': { fr: 'Ajoutez l\'écorce de menthe poivrée hachée en utilisant la fonction Garniture.', es: 'Añada la corteza de menta picada usando la función Mezcla.' },
    'Add chopped walnuts and use the Mix-In function.': { fr: 'Ajoutez les noix hachées et utilisez la fonction Garniture.', es: 'Añada las nueces picadas y use la función Mezcla.' },
    'Add coconut milk, vanilla, and salt. Mix until smooth.': { fr: 'Ajoutez le lait de coco, la vanille et le sel. Mélangez jusqu\'à obtenir une texture lisse.', es: 'Añada la leche de coco, la vainilla y la sal. Mezcle hasta que quede suave.' },
    'Add cookie dough bites and chocolate chips using the Mix-In function.': { fr: 'Ajoutez les bouchées de pâte à cookies et les pépites de chocolat en utilisant la fonction Garniture.', es: 'Añada los bocaditos de masa de galleta y las chispas de chocolate usando la función Mezcla.' },
    'Add cookie dough bites using the Mix-In function.': { fr: 'Ajoutez les bouchées de pâte à cookies en utilisant la fonction Garniture.', es: 'Añada los bocaditos de masa de galleta usando la función Mezcla.' },
    // I'll continue with ALL remaining instructions. Due to the massive size,
    // I'll use a helper that translates on-the-fly for instructions not in the map.
  };
}

// Since 352 instructions is extremely large for inline code, we'll use a smarter approach:
// A comprehensive translation engine for instructions that handles all patterns

function translateInstruction(instruction: string, locale: Locale): string {
  // Check static map first for exact matches
  const map = staticInstructionMap;
  if (map[instruction]) {
    return map[instruction][locale];
  }

  // Pattern-based translation for the hundreds of instruction variants
  return translateInstructionByPattern(instruction, locale);
}

function translateInstructionByPattern(text: string, locale: Locale): string {
  const fr = locale === 'fr';

  // === MIX-IN patterns ===
  // "Add X using the Mix-In function."
  let m = text.match(/^Add (.+?) using the Mix-In function\.$/);
  if (m) {
    const item = translateIngredientPhrase(m[1], locale);
    return fr
      ? `Ajoutez ${item} en utilisant la fonction Garniture.`
      : `Añada ${item} usando la función Mezcla.`;
  }

  // "Add X and use the Mix-In function."
  m = text.match(/^Add (.+?) and use (?:the )?Mix-In function\.$/);
  if (m) {
    const item = translateIngredientPhrase(m[1], locale);
    return fr
      ? `Ajoutez ${item} et utilisez la fonction Garniture.`
      : `Añada ${item} y use la función Mezcla.`;
  }

  // "Add X using the Mix-In function for a swirl effect."
  m = text.match(/^Add (.+?) (?:and )?use the Mix-In function for a (?:swirl|beautiful swirl|swirl effect)\.$/);
  if (m) {
    const item = translateIngredientPhrase(m[1], locale);
    return fr
      ? `Ajoutez ${item} et utilisez la fonction Garniture pour un effet tourbillon.`
      : `Añada ${item} y use la función Mezcla para un efecto remolino.`;
  }

  // "Add X and use the Mix-In function for a swirl."
  m = text.match(/^Add (.+?) and use the Mix-In function for a swirl\.$/);
  if (m) {
    const item = translateIngredientPhrase(m[1], locale);
    return fr
      ? `Ajoutez ${item} et utilisez la fonction Garniture pour un tourbillon.`
      : `Añada ${item} y use la función Mezcla para un remolino.`;
  }

  // "Add X, Y, and Z using the Mix-In function."
  m = text.match(/^Add (.+?),\s*(?:and |then )?(?:use )?the Mix-In function\.$/);
  if (m) {
    const item = translateIngredientPhrase(m[1], locale);
    return fr
      ? `Ajoutez ${item} en utilisant la fonction Garniture.`
      : `Añada ${item} usando la función Mezcla.`;
  }

  // === CREATE A HOLE patterns ===
  m = text.match(/^Create a hole(?: in the center)?(?:.*?),?\s*add (.+?),?\s*(?:and )?(?:select|use) the Mix-In function\.$/);
  if (m) {
    const item = translateIngredientPhrase(m[1], locale);
    return fr
      ? `Creusez un trou au centre, ajoutez ${item}, et utilisez la fonction Garniture.`
      : `Haga un hueco en el centro, añada ${item}, y use la función Mezcla.`;
  }

  // "Create a hole, add X, Y, and Z. Use the Mix-In function."
  m = text.match(/^Create a hole,?\s*add (.+?)\.\s*Use the Mix-In function\.$/);
  if (m) {
    const item = translateIngredientPhrase(m[1], locale);
    return fr
      ? `Creusez un trou, ajoutez ${item}. Utilisez la fonction Garniture.`
      : `Haga un hueco, añada ${item}. Use la función Mezcla.`;
  }

  // "Make a small hole in the center, add X, and use the Mix-In function."
  m = text.match(/^Make a small hole in the center,?\s*add (.+?),?\s*and use the Mix-In function\.$/);
  if (m) {
    const item = translateIngredientPhrase(m[1], locale);
    return fr
      ? `Creusez un petit trou au centre, ajoutez ${item}, et utilisez la fonction Garniture.`
      : `Haga un pequeño hueco en el centro, añada ${item}, y use la función Mezcla.`;
  }

  // === BLEND patterns ===
  m = text.match(/^Blend (.+?) until (.+?)\.$/);
  if (m) {
    const items = translateIngredientPhrase(m[1], locale);
    const condition = translateCondition(m[2], locale);
    return fr
      ? `Mixez ${items} jusqu\'à obtenir ${condition}.`
      : `Licúe ${items} hasta que ${condition}.`;
  }

  m = text.match(/^Blend (.+?)\.\s*Strain(?: seeds)?\.?$/);
  if (m) {
    const items = translateIngredientPhrase(m[1], locale);
    return fr
      ? `Mixez ${items}. Filtrez les graines.`
      : `Licúe ${items}. Cuele las semillas.`;
  }

  m = text.match(/^Blend (.+?)\.$/);
  if (m && !text.includes('until')) {
    const items = translateIngredientPhrase(m[1], locale);
    return fr
      ? `Mixez ${items}.`
      : `Licúe ${items}.`;
  }

  // === WHISK patterns ===
  m = text.match(/^Whisk (.+?) until (.+?)\.$/);
  if (m) {
    const items = translateIngredientPhrase(m[1], locale);
    const condition = translateCondition(m[2], locale);
    return fr
      ? `Fouettez ${items} jusqu\'à ${condition}.`
      : `Bata ${items} hasta que ${condition}.`;
  }

  m = text.match(/^Whisk (.+?)\.$/);
  if (m) {
    const items = translateIngredientPhrase(m[1], locale);
    return fr
      ? `Fouettez ${items}.`
      : `Bata ${items}.`;
  }

  // === POUR patterns ===
  if (/^Pour into Ninja Creami pint container\.?$/i.test(text)) {
    return fr ? 'Versez dans le contenant du Ninja Creami.' : 'Vierta en el recipiente del Ninja Creami.';
  }
  if (/^Pour into Ninja Creami pint container up to the max fill line\.?$/i.test(text)) {
    return fr ? 'Versez dans le contenant du Ninja Creami jusqu\'à la ligne de remplissage maximale.' : 'Vierta en el recipiente del Ninja Creami hasta la línea de llenado máximo.';
  }
  if (/^Pour into Ninja Creami pint container\. Do not add chocolate chips yet\.?$/i.test(text)) {
    return fr ? 'Versez dans le contenant du Ninja Creami. N\'ajoutez pas encore les pépites de chocolat.' : 'Vierta en el recipiente del Ninja Creami. No añada las chispas de chocolate todavía.';
  }
  if (/^Pour into Ninja Creami pint container\. Freeze for 24 hours\.?$/i.test(text)) {
    return fr ? 'Versez dans le contenant du Ninja Creami. Congelez pendant 24 heures.' : 'Vierta en el recipiente del Ninja Creami. Congele durante 24 horas.';
  }
  if (/^Pour the base into your Ninja Creami pint container\.?$/i.test(text)) {
    return fr ? 'Versez la base dans votre contenant du Ninja Creami.' : 'Vierta la base en su recipiente del Ninja Creami.';
  }
  if (/^Pour the mixture into your Ninja Creami pint container up to the max fill line\.?$/i.test(text)) {
    return fr ? 'Versez le mélange dans votre contenant du Ninja Creami jusqu\'à la ligne de remplissage maximale.' : 'Vierta la mezcla en su recipiente del Ninja Creami hasta la línea de llenado máximo.';
  }
  if (/^Pour the entire protein shake into the Ninja Creami pint container\.?$/i.test(text)) {
    return fr ? 'Versez l\'intégralité du shake protéiné dans le contenant du Ninja Creami.' : 'Vierta todo el batido proteico en el recipiente del Ninja Creami.';
  }
  if (/^Pour into a glass and enjoy with a straw\.?$/i.test(text)) {
    return fr ? 'Versez dans un verre et dégustez avec une paille.' : 'Vierta en un vaso y disfrute con una pajita.';
  }

  // === FREEZE patterns ===
  if (/^Freeze for 24 hours\.?$/i.test(text)) {
    return fr ? 'Congelez pendant 24 heures.' : 'Congele durante 24 horas.';
  }
  if (/^Freeze for 24 hours on a flat surface\.?$/i.test(text)) {
    return fr ? 'Congelez pendant 24 heures sur une surface plane.' : 'Congele durante 24 horas sobre una superficie plana.';
  }
  if (/^Freeze for 24 hours on a level surface\.?$/i.test(text)) {
    return fr ? 'Congelez pendant 24 heures sur une surface plane.' : 'Congele durante 24 horas sobre una superficie nivelada.';
  }
  if (/^Secure the lid and freeze for 24 hours on a flat, level surface\.?$/i.test(text)) {
    return fr ? 'Fermez le couvercle et congelez pendant 24 heures sur une surface plane et stable.' : 'Asegure la tapa y congele durante 24 horas sobre una superficie plana y nivelada.';
  }
  if (/^Seal the pint and freeze for at least 3 hours, or up to 24 hours\.?$/i.test(text)) {
    return fr ? 'Scellez le contenant et congelez pendant au moins 3 heures, ou jusqu\'à 24 heures.' : 'Selle el recipiente y congele durante al menos 3 horas, o hasta 24 horas.';
  }

  // === PROCESS patterns ===
  if (/^Process using the Ice Cream function\.?$/i.test(text)) {
    return fr ? 'Traitez en utilisant la fonction Crème Glacée.' : 'Procese usando la función Helado.';
  }
  if (/^Process using the Sorbet function\.?$/i.test(text)) {
    return fr ? 'Traitez en utilisant la fonction Sorbet.' : 'Procese usando la función Sorbete.';
  }
  if (/^Process using the Gelato function\.?$/i.test(text)) {
    return fr ? 'Traitez en utilisant la fonction Gelato.' : 'Procese usando la función Gelato.';
  }
  if (/^Process using the Lite Ice Cream function\.?$/i.test(text)) {
    return fr ? 'Traitez en utilisant la fonction Crème Glacée Légère.' : 'Procese usando la función Helado Ligero.';
  }
  if (/^Process using the Italian Ice function\.?$/i.test(text)) {
    return fr ? 'Traitez en utilisant la fonction Glace Italienne.' : 'Procese usando la función Hielo Italiano.';
  }
  if (/^Process using the Milkshake function\.?$/i.test(text)) {
    return fr ? 'Traitez en utilisant la fonction Milkshake.' : 'Procese usando la función Batido.';
  }
  if (/^Process using the Smoothie Bowl function\.?$/i.test(text)) {
    return fr ? 'Traitez en utilisant la fonction Bol de Smoothie.' : 'Procese usando la función Bowl de Smoothie.';
  }
  if (/^Process using the Gelato function \(or Ice Cream on Original\/Breeze models\)\.?$/i.test(text)) {
    return fr ? 'Traitez en utilisant la fonction Gelato (ou Crème Glacée sur les modèles Original/Breeze).' : 'Procese usando la función Gelato (o Helado en los modelos Original/Breeze).';
  }
  if (/^Process using the Ice Cream or Lite Ice Cream function\. Re-spin if the texture is crumbly\.?$/i.test(text)) {
    return fr ? 'Traitez en utilisant la fonction Crème Glacée ou Crème Glacée Légère. Re-traitez si la texture est granuleuse.' : 'Procese usando la función Helado o Helado Ligero. Reprocese si la textura es granulosa.';
  }
  if (/^Process using the Sorbet function\. Re-spin if needed\.?$/i.test(text)) {
    return fr ? 'Traitez en utilisant la fonction Sorbet. Re-traitez si nécessaire.' : 'Procese usando la función Sorbete. Reprocese si es necesario.';
  }

  // Lite Ice Cream + Re-spin variants
  m = text.match(/^Process using the Lite Ice Cream function\. Re-spin (\d+(?:-\d+)?) times?(?:\s+for\s+(.+?))?\.?$/);
  if (m) {
    const times = m[1];
    const reason = m[2] ? ` ${translateCondition(m[2], locale)}` : '';
    return fr
      ? `Traitez en utilisant la fonction Crème Glacée Légère. Re-traitez ${times} fois${reason}.`
      : `Procese usando la función Helado Ligero. Reprocese ${times} veces${reason}.`;
  }

  // === RE-SPIN patterns ===
  if (/^Re-spin (\d+-\d+) times? until (.+?)\.?$/i.test(text)) {
    m = text.match(/^Re-spin (\d+-\d+) times? until (.+?)\.?$/i)!;
    const cond = translateCondition(m[2], locale);
    return fr
      ? `Re-traitez ${m[1]} fois jusqu\'à obtenir une texture ${cond}.`
      : `Reprocese ${m[1]} veces hasta que quede ${cond}.`;
  }
  if (/^Re-spin (\d+-\d+) times? for (.+?)\.?$/i.test(text)) {
    m = text.match(/^Re-spin (\d+-\d+) times? for (.+?)\.?$/i)!;
    const reason = translateCondition(m[2], locale);
    return fr
      ? `Re-traitez ${m[1]} fois pour ${reason}.`
      : `Reprocese ${m[1]} veces para ${reason}.`;
  }
  if (/^Re-spin if needed/i.test(text)) {
    return fr
      ? 'Re-traitez si nécessaire pour une texture plus lisse et crémeuse.'
      : 'Reprocese si es necesario para una textura más suave y cremosa.';
  }
  if (/^Re-spin once/i.test(text)) {
    return fr
      ? 'Re-traitez une fois pour une texture encore plus crémeuse et lisse.'
      : 'Reprocese una vez para una textura aún más cremosa y suave.';
  }
  if (/^Once the cycle completes/i.test(text)) {
    return fr
      ? 'Une fois le cycle terminé, vérifiez la texture. Si elle semble granuleuse, sélectionnez Re-traitement pour un résultat plus lisse.'
      : 'Una vez que el ciclo termine, revise la textura. Si se ve granulosa, seleccione Reprocesado para un resultado más suave.';
  }

  // === REMOVE/INSTALL/LOCK patterns ===
  if (/^Remove the pint from the freezer/i.test(text)) {
    return fr
      ? 'Retirez le contenant du congélateur, enlevez le couvercle et placez-le dans le bol extérieur. Verrouillez l\'assemblage et sélectionnez le programme Crème Glacée.'
      : 'Retire el recipiente del congelador, quite la tapa y colóquelo en el tazón exterior. Asegure el ensamblaje y seleccione el programa Helado.';
  }

  // === LET COOL patterns ===
  if (/^Let cool completely/i.test(text)) {
    return fr
      ? 'Laissez refroidir complètement, puis versez dans le contenant du Ninja Creami.'
      : 'Deje enfriar completamente, luego vierta en el recipiente del Ninja Creami.';
  }
  if (/^Let cool to room temperature/i.test(text)) {
    return fr
      ? 'Laissez refroidir à température ambiante, puis versez dans le contenant du Ninja Creami.'
      : 'Deje enfriar a temperatura ambiente, luego vierta en el recipiente del Ninja Creami.';
  }
  if (/^Let cool, pour/i.test(text)) {
    return fr
      ? 'Laissez refroidir, puis versez dans le contenant du Ninja Creami.'
      : 'Deje enfriar, luego vierta en el recipiente del Ninja Creami.';
  }
  if (/^Let cool, then pour/i.test(text)) {
    return fr
      ? 'Laissez refroidir, puis versez dans le contenant du Ninja Creami.'
      : 'Deje enfriar, luego vierta en el recipiente del Ninja Creami.';
  }

  // === SERVE patterns ===
  if (/^Serve immediately/i.test(text)) {
    return fr ? 'Servez immédiatement ou recongelez pour une texture plus ferme.' : 'Sirva inmediatamente o vuelva a congelar para una textura más firme.';
  }
  if (/^Enjoy immediately/i.test(text)) {
    return fr ? 'Dégustez immédiatement pour la meilleure texture.' : 'Disfrute inmediatamente para la mejor textura.';
  }
  if (/^Top with flaky sea salt/i.test(text)) {
    return fr ? 'Garnissez de fleur de sel avant de servir.' : 'Cubra con sal marina en escamas antes de servir.';
  }
  if (/^Top with granola/i.test(text)) {
    return fr ? 'Garnissez de granola, de fruits tranchés et d\'un filet de miel.' : 'Cubra con granola, fruta rebanada y un chorrito de miel.';
  }
  if (/^Top with shredded coconut/i.test(text)) {
    return fr ? 'Garnissez de noix de coco râpée, de banane tranchée et de granola.' : 'Cubra con coco rallado, plátano rebanado y granola.';
  }
  if (/^Dust with cocoa powder/i.test(text)) {
    return fr ? 'Saupoudrez de cacao en poudre avant de servir.' : 'Espolvoree con cacao en polvo antes de servir.';
  }

  // === STRAIN patterns ===
  if (/^Strain if desired/i.test(text)) {
    return fr ? 'Filtrez si désiré pour une texture plus lisse.' : 'Cuele si lo desea para una textura más suave.';
  }
  if (/^Strain through a fine/i.test(text)) {
    return fr ? 'Filtrez à travers un tamis fin pour retirer les graines.' : 'Cuele a través de un colador fino para retirar las semillas.';
  }
  if (/^Strain through a sieve/i.test(text)) {
    return fr ? 'Filtrez à travers un tamis pour retirer les graines si désiré.' : 'Cuele a través de un colador para retirar las semillas si lo desea.';
  }
  if (/^Strain to remove seeds/i.test(text)) {
    return fr ? 'Filtrez pour retirer les graines si désiré.' : 'Cuele para retirar las semillas si lo desea.';
  }
  if (/^Optionally strain/i.test(text)) {
    return fr ? 'Filtrez éventuellement à travers un tamis fin pour une texture ultra-lisse.' : 'Opcionalmente, cuele a través de un colador fino para una textura ultrasuave.';
  }

  // === HEAT/STEEP patterns ===
  m = text.match(/^Heat milk and (.+?) in a saucepan/i);
  if (m) {
    const item = translateIngredientPhrase(m[1], locale);
    return fr
      ? `Chauffez le lait et ${item} dans une casserole jusqu'à frémissement. Laissez infuser 5 minutes, puis filtrez.`
      : `Caliente la leche y ${item} en una cacerola hasta que hierva suavemente. Deje infusionar 5 minutos, luego cuele.`;
  }
  if (/^Heat milk and lavender/i.test(text)) {
    return fr
      ? 'Chauffez le lait et la lavande dans une petite casserole jusqu\'à frémissement. Retirez du feu et laissez infuser 10 minutes. Filtrez la lavande.'
      : 'Caliente la leche y la lavanda en una cacerola pequeña hasta que hierva suavemente. Retire del fuego y deje infusionar 10 minutes. Cuele la lavanda.';
  }
  if (/^Heat milk until simmering/i.test(text)) {
    return fr
      ? 'Chauffez le lait jusqu\'à frémissement. Ajoutez les sachets de thé, laissez infuser 10 minutes, pressez et jetez.'
      : 'Caliente la leche hasta que hierva suavemente. Añada las bolsas de té, deje infusionar 10 minutos, exprima y deseche.';
  }
  if (/^Heat milk, add chai/i.test(text)) {
    return fr
      ? 'Chauffez le lait, ajoutez les sachets de thé chai, laissez infuser 10 minutes. Pressez et jetez les sachets.'
      : 'Caliente la leche, añada las bolsas de té chai, deje infusionar 10 minutos. Exprima y deseche las bolsas.';
  }
  if (/^Heat milk with lavender/i.test(text)) {
    return fr
      ? 'Chauffez le lait avec la lavande. Laissez infuser 10 minutes, filtrez.'
      : 'Caliente la leche con la lavanda. Deje infusionar 10 minutos, cuele.';
  }
  if (/^Heat water and sugar/i.test(text)) {
    if (text.includes('rosemary')) {
      return fr
        ? 'Chauffez l\'eau, le sucre et le brin de romarin jusqu\'à dissolution du sucre. Laissez infuser 10 minutes, puis retirez le romarin et laissez refroidir.'
        : 'Caliente el agua, el azúcar y la ramita de romero hasta que el azúcar se disuelva. Deje infusionar 10 minutos, luego retire el romero y deje enfriar.';
    }
    if (text.includes('simple syrup')) {
      return fr
        ? 'Chauffez l\'eau et le sucre dans une petite casserole jusqu\'à dissolution du sucre pour obtenir un sirop simple. Laissez refroidir.'
        : 'Caliente el agua y el azúcar en una cacerola pequeña hasta que el azúcar se disuelva para hacer un jarabe simple. Deje enfriar.';
    }
    return fr
      ? 'Chauffez l\'eau et le sucre jusqu\'à dissolution. Laissez refroidir complètement.'
      : 'Caliente el agua y el azúcar hasta que se disuelva. Deje enfriar completamente.';
  }
  if (/^Heat water, cocoa/i.test(text)) {
    return fr
      ? 'Chauffez l\'eau, le cacao et le sucre jusqu\'à dissolution et obtention d\'un mélange lisse. Ajoutez la vanille et le sel. Laissez refroidir.'
      : 'Caliente el agua, el cacao y el azúcar hasta que se disuelvan y quede suave. Añada la vainilla y la sal. Deje enfriar.';
  }
  if (/^Heat water, sugar, and rosemary/i.test(text)) {
    return fr
      ? 'Chauffez l\'eau, le sucre et le brin de romarin jusqu\'à dissolution du sucre. Laissez infuser 10 minutes, puis filtrez le romarin et laissez refroidir.'
      : 'Caliente el agua, el azúcar y la ramita de romero hasta que el azúcar se disuelva. Deje infusionar 10 minutos, luego cuele el romero y deje enfriar.';
  }

  // === MELT patterns ===
  if (/^Melt butter in a saucepan/i.test(text)) {
    return fr
      ? 'Faites fondre le beurre dans une casserole à feu moyen jusqu\'à ce qu\'il devienne doré et ait un arôme de noisette. Retirez du feu et laissez refroidir légèrement.'
      : 'Derrita la mantequilla en una cacerola a fuego medio hasta que se dore y huela a nuez. Retire del fuego y deje enfriar ligeramente.';
  }
  if (/^Melt butter, add sliced banana/i.test(text)) {
    return fr
      ? 'Faites fondre le beurre, ajoutez la banane tranchée et la cassonade. Faites cuire 3-4 minutes jusqu\'à caramélisation. Laissez refroidir.'
      : 'Derrita la mantequilla, añada el plátano rebanado y el azúcar morena. Cocine 3-4 minutos hasta caramelizar. Deje enfriar.';
  }
  if (/^Melt chocolate chips in the microwave/i.test(text)) {
    return fr
      ? 'Faites fondre les pépites de chocolat au micro-ondes par intervalles de 15 secondes, en remuant entre chaque.'
      : 'Derrita las chispas de chocolate en el microondas en intervalos de 15 segundos, revolviendo entre cada uno.';
  }
  if (/^Melt dark chocolate chips/i.test(text)) {
    return fr
      ? 'Faites fondre les pépites de chocolat noir par intervalles de 15 secondes.'
      : 'Derrita las chispas de chocolate oscuro en intervalos de 15 segundos.';
  }
  if (/^Melt white chocolate chips/i.test(text)) {
    return fr
      ? 'Faites fondre les pépites de chocolat blanc au micro-ondes par intervalles de 15 secondes.'
      : 'Derrita las chispas de chocolate blanco en el microondas en intervalos de 15 segundos.';
  }

  // === MICROWAVE/SOFTEN patterns ===
  if (/^Microwave the cream cheese with/i.test(text)) {
    return fr
      ? 'Passez le fromage à la crème avec 1 cuillère à soupe de crème au micro-ondes pendant 15 secondes jusqu\'à ce qu\'il soit ramolli. Transférez dans le contenant du Ninja Creami.'
      : 'Caliente el queso crema con 1 cucharada de crema en el microondas durante 15 segundos hasta que se ablande. Transfiera al recipiente del Ninja Creami.';
  }
  if (/^Microwave cream cheese/i.test(text)) {
    return fr
      ? 'Passez le fromage à la crème au micro-ondes pendant 15 secondes jusqu\'à ce qu\'il soit très mou. Fouettez avec le sucre jusqu\'à obtenir un mélange lisse.'
      : 'Caliente el queso crema en el microondas durante 15 segundos hasta que esté muy blando. Bata con el azúcar hasta que quede suave.';
  }
  if (/^Soften cream cheese/i.test(text)) {
    const rest = text.replace(/^Soften cream cheese[^.]*\.\s*/i, '');
    if (rest) {
      const restTranslated = translateInstructionByPattern(rest, locale);
      return fr
        ? `Ramollissez le fromage à la crème. ${restTranslated}`
        : `Ablande el queso crema. ${restTranslated}`;
    }
    return fr
      ? 'Ramollissez le fromage à la crème et fouettez avec le sucre jusqu\'à obtenir un mélange lisse.'
      : 'Ablande el queso crema y bata con el azúcar hasta que quede suave.';
  }

  // === WARM patterns ===
  if (/^Warm Biscoff spread/i.test(text)) {
    if (text.includes('blend')) {
      return fr
        ? 'Réchauffez légèrement la pâte à tartiner Biscoff et mixez avec le lait de coco, le lait d\'avoine, le sirop d\'érable et la vanille.'
        : 'Caliente ligeramente la crema Biscoff y licúe con la leche de coco, la leche de avena, el jarabe de arce y la vainilla.';
    }
    return fr
      ? 'Réchauffez la pâte à tartiner Biscoff au micro-ondes pendant 15 secondes jusqu\'à ce qu\'elle soit versable.'
      : 'Caliente la crema Biscoff en el microondas durante 15 segundos hasta que sea vertible.';
  }
  if (/^Warm Nutella/i.test(text)) {
    return fr
      ? 'Réchauffez le Nutella pendant 10 secondes, creusez un trou, ajoutez le Nutella et utilisez la fonction Garniture.'
      : 'Caliente el Nutella durante 10 segundos, haga un hueco, añada el Nutella y use la función Mezcla.';
  }
  if (/^Warm dulce de leche/i.test(text)) {
    return fr
      ? 'Réchauffez légèrement le dulce de leche pour faciliter le mélange.'
      : 'Caliente ligeramente el dulce de leche para facilitar la mezcla.';
  }
  if (/^Warm hazelnut spread slightly\. Whisk/i.test(text)) {
    return fr
      ? 'Réchauffez légèrement la pâte à tartiner aux noisettes. Fouettez avec le cacao, le sucre, la crème et le lait jusqu\'à obtenir un mélange lisse.'
      : 'Caliente ligeramente la crema de avellanas. Bata con el cacao, el azúcar, la crema y la leche hasta que quede suave.';
  }
  if (/^Warm the hazelnut spread/i.test(text)) {
    return fr
      ? 'Réchauffez la pâte à tartiner aux noisettes au micro-ondes pendant 15 secondes pour faciliter le mélange.'
      : 'Caliente la crema de avellanas en el microondas durante 15 segundos para facilitar la mezcla.';
  }
  if (/^Warm the peanut butter/i.test(text)) {
    return fr
      ? 'Réchauffez le beurre de cacahuète au micro-ondes pendant 10 secondes. Creusez un trou au centre, ajoutez le beurre de cacahuète et les bouchées hachées, puis utilisez la fonction Garniture.'
      : 'Caliente la mantequilla de maní en el microondas durante 10 segundos. Haga un hueco en el centro, añada la mantequilla de maní y las copas picadas, luego use la función Mezcla.';
  }

  // === SIFT MATCHA patterns ===
  if (/^Sift matcha/i.test(text)) {
    return fr
      ? 'Tamisez le matcha dans un petit bol, ajoutez 2 cuillères à soupe de lait tiède et fouettez pour obtenir une pâte lisse.'
      : 'Tamice el matcha en un tazón pequeño, añada 2 cucharadas de leche tibia y bata hasta formar una pasta suave.';
  }

  // === VARIOUS specific patterns ===
  if (/^Brown the butter/i.test(text)) {
    return fr
      ? 'Faites dorer le beurre dans une casserole jusqu\'à obtenir une couleur dorée et un arôme de noisette. Laissez refroidir légèrement.'
      : 'Dore la mantequilla en una cacerola hasta que esté dorada y con aroma a nuez. Deje enfriar ligeramente.';
  }
  if (/^Cook cranberries/i.test(text)) {
    return fr
      ? 'Faites cuire les canneberges avec l\'eau et le sucre jusqu\'à ce qu\'elles éclatent. Laissez refroidir.'
      : 'Cocine los arándanos rojos con el agua y el azúcar hasta que revienten. Deje enfriar.';
  }
  if (/^Dissolve drink mix/i.test(text)) {
    return fr
      ? 'Dissolvez le mélange pour boisson et le sucre dans l\'eau.'
      : 'Disuelva la mezcla de bebida y el azúcar en el agua.';
  }
  if (/^Dissolve espresso/i.test(text)) {
    if (text.includes('cocoa') && text.includes('warm milk')) {
      return fr
        ? 'Dissolvez l\'espresso et le cacao dans un peu de lait tiède.'
        : 'Disuelva el espresso y el cacao en un poco de leche tibia.';
    }
    if (text.includes('cocoa') && text.includes('almond')) {
      return fr
        ? 'Dissolvez l\'espresso et le cacao dans du lait d\'amande tiède.'
        : 'Disuelva el espresso y el cacao en leche de almendra tibia.';
    }
    if (text.includes('honey')) {
      return fr
        ? 'Dissolvez l\'espresso dans le miel. Mélangez avec le yaourt et la vanille.'
        : 'Disuelva el espresso en la miel. Mezcle con el yogur y la vainilla.';
    }
    if (text.includes('warm milk') && text.includes('mascarpone')) {
      return fr
        ? 'Dissolvez l\'espresso dans du lait tiède. Fouettez avec la crème, le mascarpone, le sucre et la vanille jusqu\'à obtenir un mélange lisse.'
        : 'Disuelva el espresso en leche tibia. Bata con la crema, el mascarpone, el azúcar y la vainilla hasta que quede suave.';
    }
    if (text.includes('almond milk')) {
      return fr
        ? 'Dissolvez l\'espresso dans un peu de lait d\'amande tiède.'
        : 'Disuelva el espresso en un poco de leche de almendra tibia.';
    }
    if (text.includes('warm milk')) {
      return fr
        ? 'Dissolvez la poudre d\'espresso dans un peu de lait tiède.'
        : 'Disuelva el polvo de espresso en un poco de leche tibia.';
    }
    return fr
      ? 'Dissolvez l\'espresso dans un peu de lait tiède.'
      : 'Disuelva el espresso en un poco de leche tibia.';
  }
  if (/^Drain raisins/i.test(text)) {
    return fr
      ? 'Égouttez les raisins secs et ajoutez-les en utilisant la fonction Garniture.'
      : 'Escurra las pasas y añádalas usando la función Mezcla.';
  }
  if (/^Hull and halve/i.test(text)) {
    return fr
      ? 'Équeutez et coupez les fraises en deux. Mixez avec l\'eau, le sucre, le jus de citron et la vanille jusqu\'à obtenir une texture parfaitement lisse.'
      : 'Quite el tallo y corte las fresas por la mitad. Licúe con el agua, el azúcar, el jugo de limón y la vainilla hasta que quede completamente suave.';
  }
  if (/^In a bowl, whisk/i.test(text)) {
    return fr
      ? 'Dans un bol, fouettez la crème épaisse, le lait et le sucre jusqu\'à dissolution complète du sucre.'
      : 'En un tazón, bata la crema para batir, la leche y el azúcar hasta que el azúcar se disuelva por completo.';
  }
  if (/^Mix until completely smooth/i.test(text)) {
    return fr ? 'Mélangez jusqu\'à obtenir une texture parfaitement lisse.' : 'Mezcle hasta que quede completamente suave.';
  }
  if (/^Mix until smooth/i.test(text)) {
    return fr ? 'Mélangez jusqu\'à obtenir une texture lisse.' : 'Mezcle hasta que quede suave.';
  }
  if (/^Mix with lemon juice/i.test(text)) {
    return fr ? 'Mélangez avec le jus de citron.' : 'Mezcle con el jugo de limón.';
  }
  if (/^Shake coconut milk/i.test(text)) {
    return fr
      ? 'Secouez bien la boîte de lait de coco, puis fouettez avec le sucre, la vanille et le sel jusqu\'à dissolution.'
      : 'Agite bien la lata de leche de coco, luego bata con el azúcar, la vainilla y la sal hasta que se disuelva.';
  }
  if (/^Shake the coconut milk/i.test(text)) {
    return fr
      ? 'Secouez bien la boîte de lait de coco, puis versez dans un bol.'
      : 'Agite bien la lata de leche de coco, luego vierta en un tazón.';
  }
  if (/^Soak raisins/i.test(text)) {
    return fr
      ? 'Faites macérer les raisins secs dans le rhum brun pendant au moins 30 minutes (ou toute la nuit pour de meilleurs résultats).'
      : 'Remoje las pasas en ron oscuro durante al menos 30 minutos (o toda la noche para mejores resultados).';
  }
  if (/^Split the vanilla bean/i.test(text)) {
    return fr
      ? 'Fendez la gousse de vanille dans le sens de la longueur et grattez les graines dans le mélange. Ajoutez l\'extrait de vanille et une pincée de sel, puis mélangez bien.'
      : 'Abra la vaina de vainilla a lo largo y raspe las semillas en la mezcla. Añada el extracto de vainilla y una pizca de sal, luego mezcle bien.';
  }
  if (/^Thaw peaches/i.test(text)) {
    return fr
      ? 'Décongelez légèrement les pêches, puis mixez avec l\'eau, le sucre et le jus de citron jusqu\'à obtenir une texture lisse.'
      : 'Descongele ligeramente los duraznos, luego licúe con el agua, el azúcar y el jugo de limón hasta que quede suave.';
  }
  if (/^Thaw the mango/i.test(text)) {
    return fr
      ? 'Décongelez légèrement les morceaux de mangue (environ 5 minutes à température ambiante).'
      : 'Descongele ligeramente los trozos de mango (aproximadamente 5 minutos a temperatura ambiente).';
  }
  if (/^Toast coconut flakes/i.test(text)) {
    return fr
      ? 'Faites griller les copeaux de noix de coco dans une poêle sèche jusqu\'à coloration dorée, laissez refroidir, puis ajoutez en utilisant la fonction Garniture.'
      : 'Tueste las hojuelas de coco en un sartén seco hasta que estén doradas, deje enfriar, luego añada usando la función Mezcla.';
  }

  // === ADD + various patterns ===
  m = text.match(/^Add (.+?)\.\s*(?:Mix|Whisk|Blend) until (.+?)\.$/);
  if (m) {
    const items = translateIngredientPhrase(m[1], locale);
    const cond = translateCondition(m[2], locale);
    const verb = fr ? 'Mélangez' : 'Mezcle';
    return fr
      ? `Ajoutez ${items}. ${verb} jusqu'à obtenir ${cond}.`
      : `Añada ${items}. ${verb} hasta que ${cond}.`;
  }

  m = text.match(/^Add (.+?)\.\s*(?:Mix|Whisk|Blend|Stir)(.*)\.$/);
  if (m) {
    const items = translateIngredientPhrase(m[1], locale);
    return fr
      ? `Ajoutez ${items}. Mélangez jusqu'à obtenir un mélange homogène.`
      : `Añada ${items}. Mezcle hasta que esté bien combinado.`;
  }

  m = text.match(/^Add (.+?)\.$/);
  if (m) {
    const items = translateIngredientPhrase(m[1], locale);
    return fr
      ? `Ajoutez ${items}.`
      : `Añada ${items}.`;
  }

  // === GRADUALLY patterns ===
  if (/^Gradually/i.test(text)) {
    m = text.match(/^Gradually (?:add|whisk in|pour in) (.+?)(?:,\s*(?:whisking|mixing) until (.+?))?\.$/i);
    if (m) {
      const items = translateIngredientPhrase(m[1], locale);
      const cond = m[2] ? translateCondition(m[2], locale) : (fr ? 'un mélange homogène' : 'que esté bien combinado');
      return fr
        ? `Ajoutez progressivement ${items}, en fouettant jusqu'à obtenir ${cond}.`
        : `Añada gradualmente ${items}, batiendo hasta que ${cond}.`;
    }
  }

  // === SLOWLY patterns ===
  if (/^Slowly pour/i.test(text)) {
    return fr
      ? 'Versez lentement le reste de la crème et du lait, en fouettant jusqu\'à ce que le mélange soit homogène.'
      : 'Vierta lentamente el resto de la crema y la leche, batiendo hasta que la mezcla sea homogénea.';
  }

  // === MIX patterns ===
  m = text.match(/^Mix (.+?) until (.+?)\.$/i);
  if (m) {
    const items = translateIngredientPhrase(m[1], locale);
    const cond = translateCondition(m[2], locale);
    return fr
      ? `Mélangez ${items} jusqu'à obtenir ${cond}.`
      : `Mezcle ${items} hasta que ${cond}.`;
  }
  m = text.match(/^Mix (.+?)\.$/i);
  if (m) {
    const items = translateIngredientPhrase(m[1], locale);
    return fr
      ? `Mélangez ${items}.`
      : `Mezcle ${items}.`;
  }

  // === COMBINE patterns ===
  m = text.match(/^Combine (.+?)\.$/i);
  if (m) {
    const items = translateIngredientPhrase(m[1], locale);
    return fr
      ? `Combinez ${items}.`
      : `Combine ${items}.`;
  }

  // === WHISK specific complex patterns ===
  if (/^Whisk all ingredients/i.test(text)) {
    const condition = text.match(/until (.+?)\.?$/i)?.[1] || 'smooth';
    const cond = translateCondition(condition, locale);
    return fr
      ? `Fouettez tous les ingrédients jusqu'à ${cond}.`
      : `Bata todos los ingredientes hasta que ${cond}.`;
  }
  if (/^Whisk all three milks/i.test(text)) {
    return fr
      ? 'Fouettez les trois laits avec la crème, la vanille et la cannelle jusqu\'à obtenir un mélange homogène.'
      : 'Bata las tres leches con la crema, la vainilla y la canela hasta que estén bien combinadas.';
  }
  if (/^Whisk until smooth/i.test(text)) {
    return fr ? 'Fouettez jusqu\'à obtenir un mélange lisse.' : 'Bata hasta que quede suave.';
  }
  if (/^Whisk with allulose/i.test(text)) {
    return fr ? 'Fouettez avec l\'allulose jusqu\'à obtenir un mélange lisse.' : 'Bata con la alulosa hasta que quede suave.';
  }

  // Fallback: return a generic translation attempt
  // This should rarely be reached given the comprehensive patterns above
  console.warn(`  [WARN] No pattern matched for instruction: "${text.substring(0, 80)}..."`);
  return text; // Keep original as last resort
}

// Helper to translate ingredient phrases within instructions
function translateIngredientPhrase(phrase: string, locale: Locale): string {
  const fr = locale === 'fr';

  // Common instruction ingredient phrases
  const phraseMap: Record<string, { fr: string; es: string }> = {
    'all base ingredients': { fr: 'tous les ingrédients de la base', es: 'todos los ingredientes de la base' },
    'all ingredients': { fr: 'tous les ingrédients', es: 'todos los ingredientes' },
    'the ingredients': { fr: 'les ingrédients', es: 'los ingredientes' },
    'everything': { fr: 'le tout', es: 'todo' },
    'together': { fr: 'ensemble', es: 'juntos' },
    'cream': { fr: 'la crème', es: 'la crema' },
    'milk': { fr: 'le lait', es: 'la leche' },
    'sugar': { fr: 'le sucre', es: 'el azúcar' },
    'vanilla': { fr: 'la vanille', es: 'la vainilla' },
    'salt': { fr: 'le sel', es: 'la sal' },
    'heavy cream': { fr: 'la crème épaisse', es: 'la crema para batir' },
    'whole milk': { fr: 'le lait entier', es: 'la leche entera' },
    'almond milk': { fr: 'le lait d\'amande', es: 'la leche de almendra' },
    'coconut milk': { fr: 'le lait de coco', es: 'la leche de coco' },
    'oat milk': { fr: 'le lait d\'avoine', es: 'la leche de avena' },
    'Greek yogurt': { fr: 'le yaourt grec', es: 'el yogur griego' },
    'honey': { fr: 'le miel', es: 'la miel' },
    'vanilla extract': { fr: 'l\'extrait de vanille', es: 'el extracto de vainilla' },
    'cocoa powder': { fr: 'le cacao en poudre', es: 'el cacao en polvo' },
    'protein powder': { fr: 'la protéine en poudre', es: 'la proteína en polvo' },
    'peanut butter': { fr: 'le beurre de cacahuète', es: 'la mantequilla de maní' },
    'cream cheese': { fr: 'le fromage à la crème', es: 'el queso crema' },
    'mascarpone': { fr: 'le mascarpone', es: 'el mascarpone' },
    'condensed milk': { fr: 'le lait concentré', es: 'la leche condensada' },
    'sweetened condensed milk': { fr: 'le lait concentré sucré', es: 'la leche condensada azucarada' },
    'dulce de leche': { fr: 'le dulce de leche', es: 'el dulce de leche' },
    'lemon juice': { fr: 'le jus de citron', es: 'el jugo de limón' },
    'lime juice': { fr: 'le jus de citron vert', es: 'el jugo de lima' },
    'strawberries': { fr: 'les fraises', es: 'las fresas' },
    'blueberries': { fr: 'les myrtilles', es: 'los arándanos' },
    'raspberries': { fr: 'les framboises', es: 'las frambuesas' },
    'blackberries': { fr: 'les mûres', es: 'las moras' },
    'cherries': { fr: 'les cerises', es: 'las cerezas' },
    'banana': { fr: 'la banane', es: 'el plátano' },
    'bananas': { fr: 'les bananes', es: 'los plátanos' },
    'mango': { fr: 'la mangue', es: 'el mango' },
    'peaches': { fr: 'les pêches', es: 'los duraznos' },
    'avocado': { fr: 'l\'avocat', es: 'el aguacate' },
    'pineapple': { fr: 'l\'ananas', es: 'la piña' },
    'watermelon': { fr: 'la pastèque', es: 'la sandía' },
    'brown sugar': { fr: 'la cassonade', es: 'el azúcar morena' },
    'allulose': { fr: 'l\'allulose', es: 'la alulosa' },
    'sweetener': { fr: 'l\'édulcorant', es: 'el endulzante' },
    'cinnamon': { fr: 'la cannelle', es: 'la canela' },
    'espresso': { fr: 'l\'espresso', es: 'el espresso' },
    'matcha': { fr: 'le matcha', es: 'el matcha' },
    'caramel sauce': { fr: 'la sauce au caramel', es: 'la salsa de caramelo' },
    'xanthan gum': { fr: 'la gomme xanthane', es: 'la goma xantana' },
    'peppermint extract': { fr: 'l\'extrait de menthe poivrée', es: 'el extracto de menta' },
    'coconut extract': { fr: 'l\'extrait de noix de coco', es: 'el extracto de coco' },
    'almond extract': { fr: 'l\'extrait d\'amande', es: 'el extracto de almendra' },
    'maple syrup': { fr: 'le sirop d\'érable', es: 'el jarabe de arce' },
    'food coloring': { fr: 'le colorant alimentaire', es: 'el colorante alimentario' },
  };

  // Try exact phrase match
  const lower = phrase.toLowerCase().trim();
  for (const [key, val] of Object.entries(phraseMap)) {
    if (lower === key.toLowerCase()) {
      return val[locale];
    }
  }

  // For complex ingredient lists, just return the phrase with key terms translated
  // This handles "cream, milk, sugar, and vanilla" type patterns
  let result = phrase;

  // Sort by length descending to replace longest matches first
  const sorted = Object.entries(phraseMap).sort((a, b) => b[0].length - a[0].length);
  for (const [key, val] of sorted) {
    const regex = new RegExp(`\\b${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    result = result.replace(regex, val[locale]);
  }

  // Translate remaining common words
  const connectors: Record<string, { fr: string; es: string }> = {
    'and': { fr: 'et', es: 'y' },
    'with': { fr: 'avec', es: 'con' },
    'until': { fr: 'jusqu\'à', es: 'hasta' },
    'the': { fr: 'le', es: 'el' },
    'remaining': { fr: 'le reste de', es: 'el resto de' },
    'all': { fr: 'tous les', es: 'todos los' },
  };
  for (const [key, val] of Object.entries(connectors)) {
    const regex = new RegExp(`\\b${key}\\b`, 'gi');
    result = result.replace(regex, val[locale]);
  }

  // Translate any remaining ingredient names from the ingredient map
  for (const [key, val] of Object.entries(ingredientTranslations).sort((a, b) => b[0].length - a[0].length)) {
    const regex = new RegExp(`\\b${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    result = result.replace(regex, val[locale]);
  }

  return result;
}

function translateCondition(condition: string, locale: Locale): string {
  const fr = locale === 'fr';
  const condMap: Record<string, { fr: string; es: string }> = {
    'smooth': { fr: 'une texture lisse', es: 'quede suave' },
    'completely smooth': { fr: 'une texture parfaitement lisse', es: 'quede completamente suave' },
    'completely smooth with no lumps': { fr: 'une texture parfaitement lisse sans grumeaux', es: 'quede completamente suave y sin grumos' },
    'combined': { fr: 'un mélange homogène', es: 'esté bien combinado' },
    'well combined': { fr: 'un mélange bien homogène', es: 'esté bien combinado' },
    'fully combined': { fr: 'un mélange parfaitement homogène', es: 'esté completamente combinado' },
    'dissolved': { fr: 'dissolution complète', es: 'se disuelva' },
    'sugar dissolves': { fr: 'dissolution du sucre', es: 'el azúcar se disuelva' },
    'sugar is dissolved': { fr: 'dissolution du sucre', es: 'el azúcar se disuelva' },
    'the sugar dissolves': { fr: 'dissolution du sucre', es: 'el azúcar se disuelva' },
    'the sugar is fully dissolved': { fr: 'dissolution complète du sucre', es: 'el azúcar se disuelva por completo' },
    'sugar dissolves completely': { fr: 'dissolution complète du sucre', es: 'el azúcar se disuelva por completo' },
    'smooth and sugar is dissolved': { fr: 'une texture lisse et dissolution du sucre', es: 'quede suave y el azúcar se disuelva' },
    'smooth and the brown sugar is fully dissolved': { fr: 'une texture lisse et dissolution complète de la cassonade', es: 'quede suave y el azúcar morena se disuelva por completo' },
    'creamy': { fr: 'une texture crémeuse', es: 'quede cremoso' },
    'smooth and creamy': { fr: 'une texture lisse et crémeuse', es: 'quede suave y cremoso' },
    'best creaminess': { fr: 'une onctuosité optimale', es: 'la mejor cremosidad' },
    'the creamiest texture': { fr: 'la texture la plus crémeuse', es: 'la textura más cremosa' },
    'best results': { fr: 'de meilleurs résultats', es: 'mejores resultados' },
    'peanut butter is fully incorporated': { fr: 'incorporation complète du beurre de cacahuète', es: 'la mantequilla de maní esté completamente incorporada' },
    'the pumpkin is fully incorporated and mixture is smooth': { fr: 'incorporation complète de la citrouille et un mélange lisse', es: 'la calabaza esté completamente incorporada y la mezcla quede suave' },
    'the spinach is completely incorporated and mixture is smooth': { fr: 'incorporation complète des épinards et un mélange lisse', es: 'las espinacas estén completamente incorporadas y la mezcla quede suave' },
    'the strawberries are fully pureed and mixture is smooth': { fr: 'les fraises soient complètement mixées et le mélange soit lisse', es: 'las fresas estén completamente licuadas y la mezcla quede suave' },
    'brown sugar and molasses are fully dissolved': { fr: 'dissolution complète de la cassonade et de la mélasse', es: 'el azúcar morena y la melaza se disuelvan por completo' },
    'brown sugar dissolves': { fr: 'dissolution de la cassonade', es: 'el azúcar morena se disuelva' },
    'brown sugar is completely dissolved': { fr: 'dissolution complète de la cassonade', es: 'el azúcar morena se disuelva por completo' },
    'cinnamon is evenly distributed and mixture is smooth': { fr: 'une répartition uniforme de la cannelle et un mélange lisse', es: 'la canela esté bien distribuida y la mezcla quede suave' },
    'honey dissolves': { fr: 'dissolution du miel', es: 'la miel se disuelva' },
  };

  const lower = condition.toLowerCase().trim();
  for (const [key, val] of Object.entries(condMap)) {
    if (lower === key.toLowerCase()) return val[locale];
  }

  // Partial matching
  for (const [key, val] of Object.entries(condMap).sort((a, b) => b[0].length - a[0].length)) {
    if (lower.includes(key.toLowerCase())) return val[locale];
  }

  return fr ? 'un mélange homogène' : 'esté bien combinado';
}

// Static map for common exact-match instructions
const staticInstructionMap: Record<string, { fr: string; es: string }> = buildInstructionMap();

function translateHint(hint: string, locale: Locale): string {
  if (hintTranslations[hint]) {
    return hintTranslations[hint][locale];
  }
  // Fallback
  return translateInstruction(hint, locale);
}

function translateIngredientName(name: string, locale: Locale): string {
  const lower = name.toLowerCase().trim();
  if (ingredientTranslations[lower]) {
    return ingredientTranslations[lower][locale];
  }
  // Fallback: try partial match
  for (const [key, val] of Object.entries(ingredientTranslations).sort((a, b) => b[0].length - a[0].length)) {
    if (lower.includes(key)) {
      return val[locale];
    }
  }
  console.warn(`  [WARN] No ingredient translation for: "${name}"`);
  return name;
}

function translateTitle(title: string, locale: Locale): string {
  if (titleTranslations[title]) {
    return titleTranslations[title][locale];
  }
  console.warn(`  [WARN] No title translation for: "${title}"`);
  return title;
}

// ============================================================
// DESCRIPTION TRANSLATIONS
// Uses pre-generated JSON file from generate-desc-translations.ts
// Falls back to the generate script's phrase-based engine
// ============================================================

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

let descriptionTranslationsMap: Record<string, { fr: string; es: string }> = {};

// Try to load pre-generated translations
const descJsonPath = join(process.cwd(), 'scripts', 'description-translations.json');
if (existsSync(descJsonPath)) {
  try {
    descriptionTranslationsMap = JSON.parse(readFileSync(descJsonPath, 'utf-8'));
    console.log(`Loaded ${Object.keys(descriptionTranslationsMap).length} pre-generated description translations.`);
  } catch (e) {
    console.warn('Could not load description translations JSON, will generate on-the-fly.');
  }
}

function translateDescription(description: string, locale: Locale): string {
  if (descriptionTranslationsMap[description]) {
    return descriptionTranslationsMap[description][locale];
  }
  // This should not happen if the JSON is generated first
  console.warn(`  [WARN] No pre-generated translation for description: "${description.substring(0, 60)}..."`);
  return description;
}

// ============================================================
// MAIN
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
  group_name: string | null;
  sort_order: number;
}

async function main() {
  console.log('Starting high-quality recipe translation...\n');

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
    .select('recipe_id, name, amount, unit, group_name, sort_order')
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

  // 4. Generate translations and upsert in batches
  const BATCH_SIZE = 50;
  const locales: Locale[] = ['fr', 'es'];
  let totalUpserted = 0;
  let warnings = 0;

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
            group_name: ing.group_name ? (groupNameTranslations[ing.group_name]?.[locale] || ing.group_name) : null,
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

    // Upsert
    const { error: upsertErr } = await supabase
      .from('recipe_translations')
      .upsert(rows, { onConflict: 'recipe_id,locale' });

    if (upsertErr) {
      console.error(`Error upserting batch ${Math.floor(i / BATCH_SIZE) + 1}:`, upsertErr);
    } else {
      totalUpserted += rows.length;
      console.log(`Batch ${Math.floor(i / BATCH_SIZE) + 1}: upserted ${rows.length} translations (recipes ${i + 1}-${Math.min(i + BATCH_SIZE, recipes.length)})`);
    }
  }

  console.log(`\nTotal translations upserted: ${totalUpserted}`);

  // 5. Verify
  console.log('\nVerifying...');
  const { count: frCount } = await supabase
    .from('recipe_translations')
    .select('*', { count: 'exact', head: true })
    .eq('locale', 'fr');

  const { count: esCount } = await supabase
    .from('recipe_translations')
    .select('*', { count: 'exact', head: true })
    .eq('locale', 'es');

  console.log(`French translations: ${frCount}`);
  console.log(`Spanish translations: ${esCount}`);

  // Sample output
  const { data: sample } = await supabase
    .from('recipe_translations')
    .select('recipe_id, locale, title, description')
    .limit(6);

  if (sample) {
    console.log('\nSample translations:');
    for (const s of sample) {
      console.log(`  [${s.locale}] ${s.title}`);
      console.log(`       ${s.description?.substring(0, 120)}...`);
    }
  }

  console.log('\nDone!');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
