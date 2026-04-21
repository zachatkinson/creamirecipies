-- Phase 2c batch 1: 45 new master_ingredients rows (A-C) with hand-translations
-- Pattern: insert canonical row with aliases[] for variants, then UPDATE ingredients
-- to link all variant rows to the new master row.

-- 1. aged balsamic vinegar
WITH m AS (
  INSERT INTO master_ingredients (name, slug, category, aliases, name_fr, name_es, name_de, name_pt)
  VALUES ('aged balsamic vinegar', 'aged-balsamic-vinegar', 'condiment', '{}',
    'vinaigre balsamique vieilli', 'vinagre balsámico añejo',
    'gereifter Balsamico-Essig', 'vinagre balsâmico envelhecido')
  ON CONFLICT (name) DO UPDATE SET name_fr=EXCLUDED.name_fr, name_es=EXCLUDED.name_es, name_de=EXCLUDED.name_de, name_pt=EXCLUDED.name_pt RETURNING id)
UPDATE ingredients SET master_ingredient_id = (SELECT id FROM m)
WHERE name = 'aged balsamic vinegar' AND master_ingredient_id IS NULL;

-- 2. almond biscotti, crumbled
WITH m AS (
  INSERT INTO master_ingredients (name, slug, category, aliases, name_fr, name_es, name_de, name_pt)
  VALUES ('almond biscotti, crumbled', 'almond-biscotti-crumbled', 'other', '{}',
    'biscotti aux amandes émiettés', 'biscotti de almendra desmenuzados',
    'zerbröselte Mandel-Biscotti', 'biscotti de amêndoa esfarelado')
  ON CONFLICT (name) DO UPDATE SET name_fr=EXCLUDED.name_fr, name_es=EXCLUDED.name_es, name_de=EXCLUDED.name_de, name_pt=EXCLUDED.name_pt RETURNING id)
UPDATE ingredients SET master_ingredient_id = (SELECT id FROM m)
WHERE name = 'almond biscotti, crumbled' AND master_ingredient_id IS NULL;

-- 3. almond brittle, crushed (canonical; aliases: chopped almond brittle)
WITH m AS (
  INSERT INTO master_ingredients (name, slug, category, aliases, name_fr, name_es, name_de, name_pt)
  VALUES ('almond brittle, crushed', 'almond-brittle-crushed', 'other', '{chopped almond brittle}',
    'nougatine aux amandes concassée', 'turrón de almendra triturado',
    'zerstoßener Mandelkrokant', 'crocante de amêndoa triturado')
  ON CONFLICT (name) DO UPDATE SET name_fr=EXCLUDED.name_fr, name_es=EXCLUDED.name_es, name_de=EXCLUDED.name_de, name_pt=EXCLUDED.name_pt RETURNING id)
UPDATE ingredients SET master_ingredient_id = (SELECT id FROM m)
WHERE name IN ('almond brittle, crushed', 'chopped almond brittle') AND master_ingredient_id IS NULL;

-- 4. almond streusel crumbles
WITH m AS (
  INSERT INTO master_ingredients (name, slug, category, aliases, name_fr, name_es, name_de, name_pt)
  VALUES ('almond streusel crumbles', 'almond-streusel-crumbles', 'other', '{}',
    'miettes de streusel aux amandes', 'migas de streusel de almendra',
    'Mandel-Streuselbrösel', 'farelinhos de streusel de amêndoa')
  ON CONFLICT (name) DO UPDATE SET name_fr=EXCLUDED.name_fr, name_es=EXCLUDED.name_es, name_de=EXCLUDED.name_de, name_pt=EXCLUDED.name_pt RETURNING id)
UPDATE ingredients SET master_ingredient_id = (SELECT id FROM m)
WHERE name = 'almond streusel crumbles' AND master_ingredient_id IS NULL;

-- 5. apple cider (reduced to 1/4 cup)
WITH m AS (
  INSERT INTO master_ingredients (name, slug, category, aliases, name_fr, name_es, name_de, name_pt)
  VALUES ('apple cider (reduced to 1/4 cup)', 'apple-cider-reduced', 'fruit', '{}',
    'cidre de pomme réduit à 1/4 tasse', 'sidra de manzana reducida a 1/4 de taza',
    'Apfelwein auf 1/4 Tasse reduziert', 'sidra de maçã reduzida a 1/4 de xícara')
  ON CONFLICT (name) DO UPDATE SET name_fr=EXCLUDED.name_fr, name_es=EXCLUDED.name_es, name_de=EXCLUDED.name_de, name_pt=EXCLUDED.name_pt RETURNING id)
UPDATE ingredients SET master_ingredient_id = (SELECT id FROM m)
WHERE name = 'apple cider (reduced to 1/4 cup)' AND master_ingredient_id IS NULL;

-- 6. apple cider donut crumbles
WITH m AS (
  INSERT INTO master_ingredients (name, slug, category, aliases, name_fr, name_es, name_de, name_pt)
  VALUES ('apple cider donut crumbles', 'apple-cider-donut-crumbles', 'other', '{}',
    'miettes de beignet au cidre de pomme', 'migas de rosquilla de sidra de manzana',
    'Apfelwein-Donut-Brösel', 'farelinhos de donut de sidra de maçã')
  ON CONFLICT (name) DO UPDATE SET name_fr=EXCLUDED.name_fr, name_es=EXCLUDED.name_es, name_de=EXCLUDED.name_de, name_pt=EXCLUDED.name_pt RETURNING id)
UPDATE ingredients SET master_ingredient_id = (SELECT id FROM m)
WHERE name = 'apple cider donut crumbles' AND master_ingredient_id IS NULL;

-- 7. assorted candy bars, chopped (Snickers, Twix, etc.)
WITH m AS (
  INSERT INTO master_ingredients (name, slug, category, aliases, name_fr, name_es, name_de, name_pt)
  VALUES ('assorted candy bars, chopped (Snickers, Twix, etc.)', 'assorted-candy-bars-chopped', 'other', '{}',
    'barres chocolatées assorties hachées (Snickers, Twix, etc.)', 'barras de chocolate surtidas picadas (Snickers, Twix, etc.)',
    'gehackte Schokoriegel gemischt (Snickers, Twix usw.)', 'barras de chocolate sortidas picadas (Snickers, Twix, etc.)')
  ON CONFLICT (name) DO UPDATE SET name_fr=EXCLUDED.name_fr, name_es=EXCLUDED.name_es, name_de=EXCLUDED.name_de, name_pt=EXCLUDED.name_pt RETURNING id)
UPDATE ingredients SET master_ingredient_id = (SELECT id FROM m)
WHERE name = 'assorted candy bars, chopped (Snickers, Twix, etc.)' AND master_ingredient_id IS NULL;

-- 8. Baileys Irish Cream liqueur
WITH m AS (
  INSERT INTO master_ingredients (name, slug, category, aliases, name_fr, name_es, name_de, name_pt)
  VALUES ('Baileys Irish Cream liqueur', 'baileys-irish-cream', 'other', '{Irish cream liqueur}',
    'liqueur Baileys Irish Cream', 'licor Baileys Irish Cream',
    'Baileys Irish Cream Likör', 'licor Baileys Irish Cream')
  ON CONFLICT (name) DO UPDATE SET name_fr=EXCLUDED.name_fr, name_es=EXCLUDED.name_es, name_de=EXCLUDED.name_de, name_pt=EXCLUDED.name_pt RETURNING id)
UPDATE ingredients SET master_ingredient_id = (SELECT id FROM m)
WHERE name IN ('Baileys Irish Cream liqueur', 'Irish cream liqueur') AND master_ingredient_id IS NULL;

-- 9. "banana" and "ripe banana, mashed" — LINK to existing "ripe banana" (slug=banana)
UPDATE ingredients SET master_ingredient_id = '76bc33db-bb22-4639-bda6-724306cb13b5'
WHERE name IN ('banana', 'ripe banana, mashed') AND master_ingredient_id IS NULL;

-- 10. bee pollen granules
WITH m AS (
  INSERT INTO master_ingredients (name, slug, category, aliases, name_fr, name_es, name_de, name_pt)
  VALUES ('bee pollen granules', 'bee-pollen-granules', 'other', '{}',
    'granulés de pollen d''abeille', 'gránulos de polen de abeja',
    'Bienenpollen-Granulat', 'grânulos de pólen de abelha')
  ON CONFLICT (name) DO UPDATE SET name_fr=EXCLUDED.name_fr, name_es=EXCLUDED.name_es, name_de=EXCLUDED.name_de, name_pt=EXCLUDED.name_pt RETURNING id)
UPDATE ingredients SET master_ingredient_id = (SELECT id FROM m)
WHERE name = 'bee pollen granules' AND master_ingredient_id IS NULL;

-- 11. black walnut extract
WITH m AS (
  INSERT INTO master_ingredients (name, slug, category, aliases, name_fr, name_es, name_de, name_pt)
  VALUES ('black walnut extract', 'black-walnut-extract', 'extract', '{}',
    'extrait de noix noire', 'extracto de nuez negra',
    'Schwarznuss-Extrakt', 'extrato de noz preta')
  ON CONFLICT (name) DO UPDATE SET name_fr=EXCLUDED.name_fr, name_es=EXCLUDED.name_es, name_de=EXCLUDED.name_de, name_pt=EXCLUDED.name_pt RETURNING id)
UPDATE ingredients SET master_ingredient_id = (SELECT id FROM m)
WHERE name = 'black walnut extract' AND master_ingredient_id IS NULL;

-- 12. chopped black walnuts
WITH m AS (
  INSERT INTO master_ingredients (name, slug, category, aliases, name_fr, name_es, name_de, name_pt)
  VALUES ('chopped black walnuts', 'chopped-black-walnuts', 'nut', '{}',
    'noix noires hachées', 'nueces negras picadas',
    'gehackte Schwarznüsse', 'nozes pretas picadas')
  ON CONFLICT (name) DO UPDATE SET name_fr=EXCLUDED.name_fr, name_es=EXCLUDED.name_es, name_de=EXCLUDED.name_de, name_pt=EXCLUDED.name_pt RETURNING id)
UPDATE ingredients SET master_ingredient_id = (SELECT id FROM m)
WHERE name = 'chopped black walnuts' AND master_ingredient_id IS NULL;

-- 13. blondie bites, chopped
WITH m AS (
  INSERT INTO master_ingredients (name, slug, category, aliases, name_fr, name_es, name_de, name_pt)
  VALUES ('blondie bites, chopped', 'blondie-bites-chopped', 'other', '{}',
    'bouchées de blondie hachées', 'trozos de blondie picados',
    'gehackte Blondie-Stücke', 'pedacinhos de blondie picados')
  ON CONFLICT (name) DO UPDATE SET name_fr=EXCLUDED.name_fr, name_es=EXCLUDED.name_es, name_de=EXCLUDED.name_de, name_pt=EXCLUDED.name_pt RETURNING id)
UPDATE ingredients SET master_ingredient_id = (SELECT id FROM m)
WHERE name = 'blondie bites, chopped' AND master_ingredient_id IS NULL;

-- 14. "blueberries, pureed" — LINK to existing master row (slug=blueberries-pureed)
UPDATE ingredients SET master_ingredient_id = 'e409443d-402d-4b71-9a8a-4a85fc496dc1'
WHERE name = 'blueberries, pureed' AND master_ingredient_id IS NULL;

-- 15. blueberry compote
WITH m AS (
  INSERT INTO master_ingredients (name, slug, category, aliases, name_fr, name_es, name_de, name_pt)
  VALUES ('blueberry compote', 'blueberry-compote', 'fruit', '{}',
    'compote de myrtilles', 'compota de arándanos',
    'Heidelbeerkompott', 'compota de mirtilo')
  ON CONFLICT (name) DO UPDATE SET name_fr=EXCLUDED.name_fr, name_es=EXCLUDED.name_es, name_de=EXCLUDED.name_de, name_pt=EXCLUDED.name_pt RETURNING id)
UPDATE ingredients SET master_ingredient_id = (SELECT id FROM m)
WHERE name = 'blueberry compote' AND master_ingredient_id IS NULL;

-- 16. bourbon whiskey
WITH m AS (
  INSERT INTO master_ingredients (name, slug, category, aliases, name_fr, name_es, name_de, name_pt)
  VALUES ('bourbon whiskey', 'bourbon-whiskey', 'other', '{}',
    'whiskey bourbon', 'whisky bourbon',
    'Bourbon-Whiskey', 'uísque bourbon')
  ON CONFLICT (name) DO UPDATE SET name_fr=EXCLUDED.name_fr, name_es=EXCLUDED.name_es, name_de=EXCLUDED.name_de, name_pt=EXCLUDED.name_pt RETURNING id)
UPDATE ingredients SET master_ingredient_id = (SELECT id FROM m)
WHERE name = 'bourbon whiskey' AND master_ingredient_id IS NULL;

-- 17. broken cannoli shells
WITH m AS (
  INSERT INTO master_ingredients (name, slug, category, aliases, name_fr, name_es, name_de, name_pt)
  VALUES ('broken cannoli shells', 'broken-cannoli-shells', 'other', '{}',
    'coques de cannoli brisées', 'tubos de cannoli rotos',
    'zerbrochene Cannoli-Schalen', 'cascas de cannoli quebradas')
  ON CONFLICT (name) DO UPDATE SET name_fr=EXCLUDED.name_fr, name_es=EXCLUDED.name_es, name_de=EXCLUDED.name_de, name_pt=EXCLUDED.name_pt RETURNING id)
UPDATE ingredients SET master_ingredient_id = (SELECT id FROM m)
WHERE name = 'broken cannoli shells' AND master_ingredient_id IS NULL;

-- 18. browned butter, cooled
WITH m AS (
  INSERT INTO master_ingredients (name, slug, category, aliases, name_fr, name_es, name_de, name_pt)
  VALUES ('browned butter, cooled', 'browned-butter-cooled', 'dairy', '{}',
    'beurre noisette refroidi', 'mantequilla dorada enfriada',
    'abgekühlte braune Butter', 'manteiga dourada resfriada')
  ON CONFLICT (name) DO UPDATE SET name_fr=EXCLUDED.name_fr, name_es=EXCLUDED.name_es, name_de=EXCLUDED.name_de, name_pt=EXCLUDED.name_pt RETURNING id)
UPDATE ingredients SET master_ingredient_id = (SELECT id FROM m)
WHERE name = 'browned butter, cooled' AND master_ingredient_id IS NULL;

-- 19. candied bacon, crumbled
WITH m AS (
  INSERT INTO master_ingredients (name, slug, category, aliases, name_fr, name_es, name_de, name_pt)
  VALUES ('candied bacon, crumbled', 'candied-bacon-crumbled', 'other', '{}',
    'bacon confit émietté', 'tocino confitado desmenuzado',
    'kandierter Speck zerbröselt', 'bacon caramelizado esfarelado')
  ON CONFLICT (name) DO UPDATE SET name_fr=EXCLUDED.name_fr, name_es=EXCLUDED.name_es, name_de=EXCLUDED.name_de, name_pt=EXCLUDED.name_pt RETURNING id)
UPDATE ingredients SET master_ingredient_id = (SELECT id FROM m)
WHERE name = 'candied bacon, crumbled' AND master_ingredient_id IS NULL;

-- 20. candied ginger, finely chopped
WITH m AS (
  INSERT INTO master_ingredients (name, slug, category, aliases, name_fr, name_es, name_de, name_pt)
  VALUES ('candied ginger, finely chopped', 'candied-ginger-finely-chopped', 'other', '{}',
    'gingembre confit finement haché', 'jengibre confitado finamente picado',
    'fein gehackter kandierter Ingwer', 'gengibre cristalizado picado fino')
  ON CONFLICT (name) DO UPDATE SET name_fr=EXCLUDED.name_fr, name_es=EXCLUDED.name_es, name_de=EXCLUDED.name_de, name_pt=EXCLUDED.name_pt RETURNING id)
UPDATE ingredients SET master_ingredient_id = (SELECT id FROM m)
WHERE name = 'candied ginger, finely chopped' AND master_ingredient_id IS NULL;

-- 21. candied hazelnut praline, chopped
WITH m AS (
  INSERT INTO master_ingredients (name, slug, category, aliases, name_fr, name_es, name_de, name_pt)
  VALUES ('candied hazelnut praline, chopped', 'candied-hazelnut-praline-chopped', 'nut', '{hazelnut praline pieces}',
    'praliné aux noisettes haché', 'praliné de avellana picado',
    'gehackte Haselnuss-Praline', 'praliné de avelã picado')
  ON CONFLICT (name) DO UPDATE SET name_fr=EXCLUDED.name_fr, name_es=EXCLUDED.name_es, name_de=EXCLUDED.name_de, name_pt=EXCLUDED.name_pt RETURNING id)
UPDATE ingredients SET master_ingredient_id = (SELECT id FROM m)
WHERE name IN ('candied hazelnut praline, chopped', 'hazelnut praline pieces') AND master_ingredient_id IS NULL;

-- 22. caramelized sugar shards
WITH m AS (
  INSERT INTO master_ingredients (name, slug, category, aliases, name_fr, name_es, name_de, name_pt)
  VALUES ('caramelized sugar shards', 'caramelized-sugar-shards', 'sugar', '{}',
    'éclats de sucre caramélisé', 'cristales de azúcar caramelizado',
    'karamellisierte Zuckersplitter', 'lascas de açúcar caramelizado')
  ON CONFLICT (name) DO UPDATE SET name_fr=EXCLUDED.name_fr, name_es=EXCLUDED.name_es, name_de=EXCLUDED.name_de, name_pt=EXCLUDED.name_pt RETURNING id)
UPDATE ingredients SET master_ingredient_id = (SELECT id FROM m)
WHERE name = 'caramelized sugar shards' AND master_ingredient_id IS NULL;

-- 23. caramelized white chocolate, melted
WITH m AS (
  INSERT INTO master_ingredients (name, slug, category, aliases, name_fr, name_es, name_de, name_pt)
  VALUES ('caramelized white chocolate, melted', 'caramelized-white-chocolate-melted', 'chocolate', '{}',
    'chocolat blanc caramélisé fondu', 'chocolate blanco caramelizado fundido',
    'geschmolzene karamellisierte weiße Schokolade', 'chocolate branco caramelizado derretido')
  ON CONFLICT (name) DO UPDATE SET name_fr=EXCLUDED.name_fr, name_es=EXCLUDED.name_es, name_de=EXCLUDED.name_de, name_pt=EXCLUDED.name_pt RETURNING id)
UPDATE ingredients SET master_ingredient_id = (SELECT id FROM m)
WHERE name = 'caramelized white chocolate, melted' AND master_ingredient_id IS NULL;

-- 24. champagne variant — LINK to existing 'champagne' row
UPDATE ingredients SET master_ingredient_id = (SELECT id FROM master_ingredients WHERE name = 'champagne')
WHERE name = 'champagne (or dry sparkling wine)' AND master_ingredient_id IS NULL;

-- 25. cherry compote (whole cherries in syrup)
WITH m AS (
  INSERT INTO master_ingredients (name, slug, category, aliases, name_fr, name_es, name_de, name_pt)
  VALUES ('cherry compote (whole cherries in syrup)', 'cherry-compote', 'fruit', '{}',
    'compote de cerises entières au sirop', 'compota de cerezas enteras en almíbar',
    'Kirschkompott (ganze Kirschen in Sirup)', 'compota de cerejas inteiras em calda')
  ON CONFLICT (name) DO UPDATE SET name_fr=EXCLUDED.name_fr, name_es=EXCLUDED.name_es, name_de=EXCLUDED.name_de, name_pt=EXCLUDED.name_pt RETURNING id)
UPDATE ingredients SET master_ingredient_id = (SELECT id FROM m)
WHERE name = 'cherry compote (whole cherries in syrup)' AND master_ingredient_id IS NULL;

-- 26. chocolate chip cookies, crushed
WITH m AS (
  INSERT INTO master_ingredients (name, slug, category, aliases, name_fr, name_es, name_de, name_pt)
  VALUES ('chocolate chip cookies, crushed', 'chocolate-chip-cookies-crushed', 'other', '{}',
    'biscuits aux pépites de chocolat écrasés', 'galletas con chispas de chocolate trituradas',
    'zerdrückte Chocolate Chip Cookies', 'biscoitos com gotas de chocolate esmagados')
  ON CONFLICT (name) DO UPDATE SET name_fr=EXCLUDED.name_fr, name_es=EXCLUDED.name_es, name_de=EXCLUDED.name_de, name_pt=EXCLUDED.name_pt RETURNING id)
UPDATE ingredients SET master_ingredient_id = (SELECT id FROM m)
WHERE name = 'chocolate chip cookies, crushed' AND master_ingredient_id IS NULL;

-- 27. chocolate chips (canonical; variants: chocolate chips, melted)
WITH m AS (
  INSERT INTO master_ingredients (name, slug, category, aliases, name_fr, name_es, name_de, name_pt)
  VALUES ('chocolate chips', 'chocolate-chips', 'chocolate', '{chocolate chips melted}',
    'pépites de chocolat', 'chispas de chocolate',
    'Schokoladenstückchen', 'gotas de chocolate')
  ON CONFLICT (name) DO UPDATE SET name_fr=EXCLUDED.name_fr, name_es=EXCLUDED.name_es, name_de=EXCLUDED.name_de, name_pt=EXCLUDED.name_pt RETURNING id)
UPDATE ingredients SET master_ingredient_id = (SELECT id FROM m)
WHERE name IN ('chocolate chips', 'chocolate chips, melted') AND master_ingredient_id IS NULL;

-- 28. chocolate drizzle
WITH m AS (
  INSERT INTO master_ingredients (name, slug, category, aliases, name_fr, name_es, name_de, name_pt)
  VALUES ('chocolate drizzle', 'chocolate-drizzle', 'chocolate', '{chocolate sauce for drizzle}',
    'filet de chocolat', 'chorrito de chocolate',
    'Schokoladen-Drizzle', 'fio de chocolate')
  ON CONFLICT (name) DO UPDATE SET name_fr=EXCLUDED.name_fr, name_es=EXCLUDED.name_es, name_de=EXCLUDED.name_de, name_pt=EXCLUDED.name_pt RETURNING id)
UPDATE ingredients SET master_ingredient_id = (SELECT id FROM m)
WHERE name IN ('chocolate drizzle', 'chocolate sauce for drizzle') AND master_ingredient_id IS NULL;

-- 29. chocolate orange truffles, chopped
WITH m AS (
  INSERT INTO master_ingredients (name, slug, category, aliases, name_fr, name_es, name_de, name_pt)
  VALUES ('chocolate orange truffles, chopped', 'chocolate-orange-truffles-chopped', 'chocolate', '{}',
    'truffes chocolat-orange hachées', 'trufas de chocolate y naranja picadas',
    'gehackte Schoko-Orangen-Trüffel', 'trufas de chocolate e laranja picadas')
  ON CONFLICT (name) DO UPDATE SET name_fr=EXCLUDED.name_fr, name_es=EXCLUDED.name_es, name_de=EXCLUDED.name_de, name_pt=EXCLUDED.name_pt RETURNING id)
UPDATE ingredients SET master_ingredient_id = (SELECT id FROM m)
WHERE name = 'chocolate orange truffles, chopped' AND master_ingredient_id IS NULL;

-- 30. chocolate pecan clusters, chopped
WITH m AS (
  INSERT INTO master_ingredients (name, slug, category, aliases, name_fr, name_es, name_de, name_pt)
  VALUES ('chocolate pecan clusters, chopped', 'chocolate-pecan-clusters-chopped', 'chocolate', '{}',
    'amas chocolat-noix de pécan hachés', 'racimos de chocolate y nueces pecanas picados',
    'gehackte Schoko-Pekan-Cluster', 'aglomerados de chocolate e nozes-pecã picados')
  ON CONFLICT (name) DO UPDATE SET name_fr=EXCLUDED.name_fr, name_es=EXCLUDED.name_es, name_de=EXCLUDED.name_de, name_pt=EXCLUDED.name_pt RETURNING id)
UPDATE ingredients SET master_ingredient_id = (SELECT id FROM m)
WHERE name = 'chocolate pecan clusters, chopped' AND master_ingredient_id IS NULL;

-- 31. chocolate stout beer (reduced to 2 tbsp)
WITH m AS (
  INSERT INTO master_ingredients (name, slug, category, aliases, name_fr, name_es, name_de, name_pt)
  VALUES ('chocolate stout beer (reduced to 2 tbsp)', 'chocolate-stout-beer-reduced', 'other', '{}',
    'bière stout au chocolat réduite à 2 c. à s.', 'cerveza stout de chocolate reducida a 2 cdas.',
    'Schoko-Stout-Bier auf 2 EL reduziert', 'cerveja stout de chocolate reduzida a 2 colheres de sopa')
  ON CONFLICT (name) DO UPDATE SET name_fr=EXCLUDED.name_fr, name_es=EXCLUDED.name_es, name_de=EXCLUDED.name_de, name_pt=EXCLUDED.name_pt RETURNING id)
UPDATE ingredients SET master_ingredient_id = (SELECT id FROM m)
WHERE name = 'chocolate stout beer (reduced to 2 tbsp)' AND master_ingredient_id IS NULL;

-- 32. chocolate truffles, chopped
WITH m AS (
  INSERT INTO master_ingredients (name, slug, category, aliases, name_fr, name_es, name_de, name_pt)
  VALUES ('chocolate truffles, chopped', 'chocolate-truffles-chopped', 'chocolate', '{}',
    'truffes au chocolat hachées', 'trufas de chocolate picadas',
    'gehackte Schokoladentrüffel', 'trufas de chocolate picadas')
  ON CONFLICT (name) DO UPDATE SET name_fr=EXCLUDED.name_fr, name_es=EXCLUDED.name_es, name_de=EXCLUDED.name_de, name_pt=EXCLUDED.name_pt RETURNING id)
UPDATE ingredients SET master_ingredient_id = (SELECT id FROM m)
WHERE name = 'chocolate truffles, chopped' AND master_ingredient_id IS NULL;

-- 33. chocolate-covered espresso beans, chopped
WITH m AS (
  INSERT INTO master_ingredients (name, slug, category, aliases, name_fr, name_es, name_de, name_pt)
  VALUES ('chocolate-covered espresso beans, chopped', 'chocolate-covered-espresso-beans-chopped', 'chocolate', '{}',
    'grains d''espresso enrobés de chocolat hachés', 'granos de espresso cubiertos de chocolate picados',
    'gehackte schokoüberzogene Espressobohnen', 'grãos de espresso cobertos de chocolate picados')
  ON CONFLICT (name) DO UPDATE SET name_fr=EXCLUDED.name_fr, name_es=EXCLUDED.name_es, name_de=EXCLUDED.name_de, name_pt=EXCLUDED.name_pt RETURNING id)
UPDATE ingredients SET master_ingredient_id = (SELECT id FROM m)
WHERE name = 'chocolate-covered espresso beans, chopped' AND master_ingredient_id IS NULL;

-- 34. chocolate-covered macadamia nuts, chopped
WITH m AS (
  INSERT INTO master_ingredients (name, slug, category, aliases, name_fr, name_es, name_de, name_pt)
  VALUES ('chocolate-covered macadamia nuts, chopped', 'chocolate-covered-macadamia-nuts-chopped', 'chocolate', '{}',
    'noix de macadamia enrobées de chocolat hachées', 'nueces de macadamia cubiertas de chocolate picadas',
    'gehackte schokoüberzogene Macadamianüsse', 'nozes-macadâmia cobertas de chocolate picadas')
  ON CONFLICT (name) DO UPDATE SET name_fr=EXCLUDED.name_fr, name_es=EXCLUDED.name_es, name_de=EXCLUDED.name_de, name_pt=EXCLUDED.name_pt RETURNING id)
UPDATE ingredients SET master_ingredient_id = (SELECT id FROM m)
WHERE name = 'chocolate-covered macadamia nuts, chopped' AND master_ingredient_id IS NULL;

-- 35. chocolate-covered peanuts, chopped
WITH m AS (
  INSERT INTO master_ingredients (name, slug, category, aliases, name_fr, name_es, name_de, name_pt)
  VALUES ('chocolate-covered peanuts, chopped', 'chocolate-covered-peanuts-chopped', 'chocolate', '{}',
    'cacahuètes enrobées de chocolat hachées', 'cacahuetes cubiertos de chocolate picados',
    'gehackte schokoüberzogene Erdnüsse', 'amendoins cobertos de chocolate picados')
  ON CONFLICT (name) DO UPDATE SET name_fr=EXCLUDED.name_fr, name_es=EXCLUDED.name_es, name_de=EXCLUDED.name_de, name_pt=EXCLUDED.name_pt RETURNING id)
UPDATE ingredients SET master_ingredient_id = (SELECT id FROM m)
WHERE name = 'chocolate-covered peanuts, chopped' AND master_ingredient_id IS NULL;

-- 36. chocolate-covered pretzels, chopped
WITH m AS (
  INSERT INTO master_ingredients (name, slug, category, aliases, name_fr, name_es, name_de, name_pt)
  VALUES ('chocolate-covered pretzels, chopped', 'chocolate-covered-pretzels-chopped', 'chocolate', '{}',
    'bretzels enrobés de chocolat hachés', 'pretzels cubiertos de chocolate picados',
    'gehackte schokoüberzogene Brezeln', 'pretzels cobertos de chocolate picados')
  ON CONFLICT (name) DO UPDATE SET name_fr=EXCLUDED.name_fr, name_es=EXCLUDED.name_es, name_de=EXCLUDED.name_de, name_pt=EXCLUDED.name_pt RETURNING id)
UPDATE ingredients SET master_ingredient_id = (SELECT id FROM m)
WHERE name = 'chocolate-covered pretzels, chopped' AND master_ingredient_id IS NULL;

-- 37. chopped peanut butter candy (Reeses Pieces or PB Cups)
WITH m AS (
  INSERT INTO master_ingredients (name, slug, category, aliases, name_fr, name_es, name_de, name_pt)
  VALUES ('chopped peanut butter candy (Reeses Pieces or PB Cups)', 'chopped-peanut-butter-candy', 'other', '{}',
    'bonbons au beurre de cacahuète hachés (Reeses Pieces ou PB Cups)', 'caramelos de mantequilla de maní picados (Reeses Pieces o PB Cups)',
    'gehackte Erdnussbutter-Süßigkeiten (Reeses Pieces oder PB Cups)', 'doces de pasta de amendoim picados (Reeses Pieces ou PB Cups)')
  ON CONFLICT (name) DO UPDATE SET name_fr=EXCLUDED.name_fr, name_es=EXCLUDED.name_es, name_de=EXCLUDED.name_de, name_pt=EXCLUDED.name_pt RETURNING id)
UPDATE ingredients SET master_ingredient_id = (SELECT id FROM m)
WHERE name = 'chopped peanut butter candy (Reeses Pieces or PB Cups)' AND master_ingredient_id IS NULL;

-- 38. chopped roasted peanuts
WITH m AS (
  INSERT INTO master_ingredients (name, slug, category, aliases, name_fr, name_es, name_de, name_pt)
  VALUES ('chopped roasted peanuts', 'chopped-roasted-peanuts', 'nut', '{}',
    'cacahuètes grillées hachées', 'cacahuetes tostados picados',
    'gehackte geröstete Erdnüsse', 'amendoins torrados picados')
  ON CONFLICT (name) DO UPDATE SET name_fr=EXCLUDED.name_fr, name_es=EXCLUDED.name_es, name_de=EXCLUDED.name_de, name_pt=EXCLUDED.name_pt RETURNING id)
UPDATE ingredients SET master_ingredient_id = (SELECT id FROM m)
WHERE name = 'chopped roasted peanuts' AND master_ingredient_id IS NULL;

-- 39. chopped whole hazelnuts
WITH m AS (
  INSERT INTO master_ingredients (name, slug, category, aliases, name_fr, name_es, name_de, name_pt)
  VALUES ('chopped whole hazelnuts', 'chopped-whole-hazelnuts', 'nut', '{}',
    'noisettes entières hachées', 'avellanas enteras picadas',
    'gehackte ganze Haselnüsse', 'avelãs inteiras picadas')
  ON CONFLICT (name) DO UPDATE SET name_fr=EXCLUDED.name_fr, name_es=EXCLUDED.name_es, name_de=EXCLUDED.name_de, name_pt=EXCLUDED.name_pt RETURNING id)
UPDATE ingredients SET master_ingredient_id = (SELECT id FROM m)
WHERE name = 'chopped whole hazelnuts' AND master_ingredient_id IS NULL;

-- 40. churro pieces or cinnamon-sugar fried dough, crushed
WITH m AS (
  INSERT INTO master_ingredients (name, slug, category, aliases, name_fr, name_es, name_de, name_pt)
  VALUES ('churro pieces or cinnamon-sugar fried dough, crushed', 'churro-pieces-crushed', 'other', '{}',
    'morceaux de churros ou beignets cannelle-sucre écrasés', 'trozos de churros o masa frita con azúcar y canela triturados',
    'zerstoßene Churros oder Zimt-Zucker-Gebäckstücke', 'pedaços de churros ou massa frita com açúcar e canela esmagados')
  ON CONFLICT (name) DO UPDATE SET name_fr=EXCLUDED.name_fr, name_es=EXCLUDED.name_es, name_de=EXCLUDED.name_de, name_pt=EXCLUDED.name_pt RETURNING id)
UPDATE ingredients SET master_ingredient_id = (SELECT id FROM m)
WHERE name = 'churro pieces or cinnamon-sugar fried dough, crushed' AND master_ingredient_id IS NULL;

-- 41. cinnamon-sugar swirl (2 tbsp sugar + 1 tsp cinnamon)
WITH m AS (
  INSERT INTO master_ingredients (name, slug, category, aliases, name_fr, name_es, name_de, name_pt)
  VALUES ('cinnamon-sugar swirl (2 tbsp sugar + 1 tsp cinnamon)', 'cinnamon-sugar-swirl', 'sugar', '{}',
    'tourbillon cannelle-sucre (2 c. à s. sucre + 1 c. à c. cannelle)', 'remolino de canela y azúcar (2 cdas. azúcar + 1 cdta. canela)',
    'Zimt-Zucker-Swirl (2 EL Zucker + 1 TL Zimt)', 'redemoinho de canela e açúcar (2 col. sopa açúcar + 1 col. chá canela)')
  ON CONFLICT (name) DO UPDATE SET name_fr=EXCLUDED.name_fr, name_es=EXCLUDED.name_es, name_de=EXCLUDED.name_de, name_pt=EXCLUDED.name_pt RETURNING id)
UPDATE ingredients SET master_ingredient_id = (SELECT id FROM m)
WHERE name = 'cinnamon-sugar swirl (2 tbsp sugar + 1 tsp cinnamon)' AND master_ingredient_id IS NULL;

-- 42. cooked brown sugar boba pearls
WITH m AS (
  INSERT INTO master_ingredients (name, slug, category, aliases, name_fr, name_es, name_de, name_pt)
  VALUES ('cooked brown sugar boba pearls', 'cooked-brown-sugar-boba-pearls', 'other', '{}',
    'perles de boba au sucre roux cuites', 'perlas de boba con azúcar moreno cocidas',
    'gekochte Boba-Perlen mit braunem Zucker', 'bolinhas de boba cozidas com açúcar mascavo')
  ON CONFLICT (name) DO UPDATE SET name_fr=EXCLUDED.name_fr, name_es=EXCLUDED.name_es, name_de=EXCLUDED.name_de, name_pt=EXCLUDED.name_pt RETURNING id)
UPDATE ingredients SET master_ingredient_id = (SELECT id FROM m)
WHERE name = 'cooked brown sugar boba pearls' AND master_ingredient_id IS NULL;

-- 43. cornbread crumbles
WITH m AS (
  INSERT INTO master_ingredients (name, slug, category, aliases, name_fr, name_es, name_de, name_pt)
  VALUES ('cornbread crumbles', 'cornbread-crumbles', 'other', '{}',
    'miettes de pain de maïs', 'migas de pan de maíz',
    'Maisbrot-Brösel', 'farelinhos de pão de milho')
  ON CONFLICT (name) DO UPDATE SET name_fr=EXCLUDED.name_fr, name_es=EXCLUDED.name_es, name_de=EXCLUDED.name_de, name_pt=EXCLUDED.name_pt RETURNING id)
UPDATE ingredients SET master_ingredient_id = (SELECT id FROM m)
WHERE name = 'cornbread crumbles' AND master_ingredient_id IS NULL;

-- 44. cranberry sauce (whole-berry)
WITH m AS (
  INSERT INTO master_ingredients (name, slug, category, aliases, name_fr, name_es, name_de, name_pt)
  VALUES ('cranberry sauce (whole-berry)', 'cranberry-sauce-whole-berry', 'condiment', '{}',
    'sauce aux canneberges entières', 'salsa de arándanos rojos enteros',
    'Cranberry-Sauce mit ganzen Beeren', 'molho de cranberry com frutas inteiras')
  ON CONFLICT (name) DO UPDATE SET name_fr=EXCLUDED.name_fr, name_es=EXCLUDED.name_es, name_de=EXCLUDED.name_de, name_pt=EXCLUDED.name_pt RETURNING id)
UPDATE ingredients SET master_ingredient_id = (SELECT id FROM m)
WHERE name = 'cranberry sauce (whole-berry)' AND master_ingredient_id IS NULL;

-- 45. crushed Biscoff cookies
WITH m AS (
  INSERT INTO master_ingredients (name, slug, category, aliases, name_fr, name_es, name_de, name_pt)
  VALUES ('crushed Biscoff cookies', 'crushed-biscoff-cookies', 'other', '{}',
    'biscuits Biscoff écrasés', 'galletas Biscoff trituradas',
    'zerdrückte Biscoff-Kekse', 'biscoitos Biscoff esmagados')
  ON CONFLICT (name) DO UPDATE SET name_fr=EXCLUDED.name_fr, name_es=EXCLUDED.name_es, name_de=EXCLUDED.name_de, name_pt=EXCLUDED.name_pt RETURNING id)
UPDATE ingredients SET master_ingredient_id = (SELECT id FROM m)
WHERE name = 'crushed Biscoff cookies' AND master_ingredient_id IS NULL;
