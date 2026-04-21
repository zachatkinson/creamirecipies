-- Phase 2c batch 2: 60 new master_ingredients rows (D–L)
-- Compact INSERT + followup UPDATE to link ingredients by name.

INSERT INTO master_ingredients (name, slug, category, aliases, name_fr, name_es, name_de, name_pt) VALUES
  ('crushed meringue cookies', 'crushed-meringue-cookies', 'other', '{}',
    'meringues écrasées', 'merengues triturados', 'zerdrückte Baiser-Kekse', 'merengues esmagados'),
  ('crushed peanut brittle', 'crushed-peanut-brittle', 'nut', '{}',
    'nougatine aux cacahuètes écrasée', 'turrón de cacahuete triturado',
    'zerstoßener Erdnusskrokant', 'crocante de amendoim triturado'),
  ('crushed phyllo pieces', 'crushed-phyllo-pieces', 'other', '{crushed phyllo pieces (baked)}',
    'feuilles de filo écrasées', 'hojas de filo trituradas',
    'zerbröselte Filoteig-Stücke', 'lascas de massa filo esmagadas'),
  ('dark brown sugar', 'dark-brown-sugar', 'sugar', '{}',
    'cassonade foncée', 'azúcar moreno oscuro',
    'dunkler brauner Zucker', 'açúcar mascavo escuro'),
  ('dark chocolate (70%+), finely chopped', 'dark-chocolate-70-finely-chopped', 'chocolate', '{}',
    'chocolat noir (70%+) finement haché', 'chocolate negro (70%+) finamente picado',
    'fein gehackte dunkle Schokolade (70%+)', 'chocolate amargo (70%+) picado fino'),
  ('dark chocolate chunks', 'dark-chocolate-chunks', 'chocolate', '{dark chocolate chunks (70%+)}',
    'morceaux de chocolat noir', 'trozos de chocolate negro',
    'dunkle Schokoladenstücke', 'pedaços de chocolate amargo'),
  ('dark spiced rum', 'dark-spiced-rum', 'other', '{}',
    'rhum brun épicé', 'ron oscuro especiado', 'dunkler Gewürzrum', 'rum escuro temperado'),
  ('dried banana chips, crushed', 'dried-banana-chips-crushed', 'fruit', '{}',
    'chips de banane séchée écrasées', 'chips de plátano deshidratado triturados',
    'zerstoßene Bananenchips', 'chips de banana desidratada esmagados'),
  ('dried culinary lavender buds', 'dried-culinary-lavender-buds', 'spice', '{}',
    'boutons de lavande culinaire séchés', 'capullos de lavanda culinaria secos',
    'getrocknete kulinarische Lavendelblüten', 'botões de lavanda culinária secos'),
  ('dried goji berries, soaked + drained', 'dried-goji-berries-soaked-drained', 'fruit', '{}',
    'baies de goji séchées, trempées et égouttées', 'bayas de goji secas, remojadas y escurridas',
    'getrocknete Goji-Beeren, eingeweicht und abgetropft', 'bagas de goji secas, hidratadas e escorridas'),
  ('edible chocolate chip cookie dough, chopped', 'edible-chocolate-chip-cookie-dough-chopped', 'other', '{}',
    'pâte à cookies aux pépites de chocolat comestible hachée', 'masa de galleta con chispas de chocolate comestible picada',
    'gehackter essbarer Chocolate-Chip-Keksteig', 'massa de biscoito com gotas de chocolate comestível picada'),
  ('edible cookie dough chunks', 'edible-cookie-dough-chunks', 'other', '{}',
    'morceaux de pâte à cookies comestible', 'trozos de masa de galleta comestible',
    'essbare Keksteigstücke', 'pedaços de massa de biscoito comestível'),
  ('edible protein cookie dough chunks', 'edible-protein-cookie-dough-chunks', 'other', '{}',
    'morceaux de pâte à cookies protéinée comestible', 'trozos de masa de galleta proteica comestible',
    'essbare Protein-Keksteigstücke', 'pedaços de massa de biscoito proteica comestível'),
  ('egg whites, beaten stiff', 'egg-whites-beaten-stiff', 'other', '{}',
    'blancs d''œufs battus en neige ferme', 'claras de huevo batidas a punto de nieve',
    'steifgeschlagene Eiweiße', 'claras em neve firme'),
  ('egg yolks', 'egg-yolks', 'other', '{egg yolks tempered}',
    'jaunes d''œufs', 'yemas de huevo', 'Eigelb', 'gemas de ovo'),
  ('espresso-flavored cookies, crumbled', 'espresso-flavored-cookies-crumbled', 'other', '{}',
    'biscuits au café émiettés', 'galletas con sabor a espresso desmenuzadas',
    'zerbröselte Espresso-Kekse', 'biscoitos sabor espresso esfarelados'),
  ('fine cornmeal, toasted', 'fine-cornmeal-toasted', 'grain', '{}',
    'semoule de maïs fine grillée', 'harina fina de maíz tostada',
    'feines, geröstetes Maismehl', 'fubá fino torrado'),
  ('food-grade activated charcoal powder', 'activated-charcoal-powder', 'other', '{}',
    'charbon actif alimentaire en poudre', 'carbón activado alimentario en polvo',
    'Lebensmittel-Aktivkohlepulver', 'carvão ativado alimentício em pó'),
  ('French macaron shells, crumbled', 'french-macaron-shells-crumbled', 'other', '{}',
    'coques de macarons français émiettées', 'cáscaras de macarons franceses desmenuzadas',
    'zerbröselte französische Macaron-Schalen', 'cascas de macarons franceses esfareladas'),
  ('French Toast Crunch cereal, crushed', 'french-toast-crunch-cereal-crushed', 'grain', '{}',
    'céréales French Toast Crunch écrasées', 'cereal French Toast Crunch triturado',
    'zerstoßene French Toast Crunch Cerealien', 'cereal French Toast Crunch esmagado'),
  ('fresh or frozen raspberries', 'fresh-or-frozen-raspberries', 'fruit', '{}',
    'framboises fraîches ou surgelées', 'frambuesas frescas o congeladas',
    'frische oder gefrorene Himbeeren', 'framboesas frescas ou congeladas'),
  ('fresh red grapes, halved', 'fresh-red-grapes-halved', 'fruit', '{}',
    'raisins rouges frais coupés en deux', 'uvas rojas frescas partidas por la mitad',
    'frische rote Weintrauben, halbiert', 'uvas vermelhas frescas cortadas ao meio'),
  ('fresh ripe banana, halved lengthwise', 'fresh-ripe-banana-halved-lengthwise', 'fruit', '{}',
    'banane mûre coupée en deux dans la longueur', 'plátano maduro cortado a lo largo',
    'reife Banane, längs halbiert', 'banana madura cortada ao meio no comprimento'),
  ('fresh sage leaves', 'fresh-sage-leaves', 'spice', '{}',
    'feuilles de sauge fraîche', 'hojas de salvia fresca', 'frische Salbeiblätter', 'folhas de sálvia fresca'),
  ('fresh strawberries, hulled and halved', 'fresh-strawberries-hulled-and-halved', 'fruit', '{"fresh strawberries, stems removed"}',
    'fraises fraîches équeutées et coupées en deux', 'fresas frescas sin tallo y cortadas por la mitad',
    'frische Erdbeeren, entstielt und halbiert', 'morangos frescos sem cabinho, cortados ao meio'),
  ('freshly ground black pepper', 'freshly-ground-black-pepper', 'spice', '{freshly cracked black pepper}',
    'poivre noir fraîchement moulu', 'pimienta negra recién molida',
    'frisch gemahlener schwarzer Pfeffer', 'pimenta-do-reino moída na hora'),
  ('full-fat coconut milk', 'full-fat-coconut-milk', 'dairy', '{}',
    'lait de coco entier', 'leche de coco entera', 'Vollfett-Kokosmilch', 'leite de coco integral'),
  ('gingerbread cookie dough chunks, edible', 'gingerbread-cookie-dough-chunks', 'other', '{}',
    'morceaux de pâte à biscuits de pain d''épices comestibles', 'trozos de masa de galleta de jengibre comestible',
    'essbare Lebkuchen-Keksteigstücke', 'pedaços de massa de biscoito de gengibre comestível'),
  ('gingersnap cookies, crushed', 'gingersnap-cookies-crushed', 'other', '{}',
    'biscuits au gingembre écrasés', 'galletas de jengibre trituradas',
    'zerdrückte Ingwerkekse', 'biscoitos de gengibre esmagados'),
  ('Golden Oreo cookies, crushed', 'golden-oreo-cookies-crushed', 'other', '{"Oreo cookies, crushed (Golden preferred)"}',
    'biscuits Oreo Golden écrasés', 'galletas Oreo Golden trituradas',
    'zerdrückte Golden Oreo-Kekse', 'biscoitos Oreo Golden esmagados'),
  ('grape jelly', 'grape-jelly', 'condiment', '{}',
    'gelée de raisin', 'jalea de uva', 'Weintraubengelee', 'geleia de uva'),
  ('grapefruit zest', 'grapefruit-zest', 'fruit', '{}',
    'zeste de pamplemousse', 'ralladura de pomelo', 'Grapefruitschale', 'raspas de toranja'),
  ('ground cloves', 'ground-cloves', 'spice', '{}',
    'clous de girofle moulus', 'clavo molido', 'gemahlene Nelken', 'cravo-da-índia moído'),
  ('ground nutmeg', 'ground-nutmeg', 'spice', '{}',
    'muscade moulue', 'nuez moscada molida', 'gemahlene Muskatnuss', 'noz-moscada moída'),
  ('halva, crumbled', 'halva-crumbled', 'other', '{}',
    'halva émietté', 'halva desmenuzado', 'zerbröselter Halva', 'halva esfarelado'),
  ('hazelnut extract', 'hazelnut-extract', 'extract', '{}',
    'extrait de noisette', 'extracto de avellana', 'Haselnussextrakt', 'extrato de avelã'),
  ('hazelnut praline pieces', 'hazelnut-praline-pieces-new', 'nut', '{}',
    'morceaux de praliné aux noisettes', 'trozos de praliné de avellana',
    'Haselnuss-Praliné-Stücke', 'pedaços de praliné de avelã'),
  ('sugar-free hazelnut spread', 'sugar-free-hazelnut-spread', 'chocolate', '{"hazelnut spread (sugar-free)", "hazelnut spread (sugar-free if needed)"}',
    'pâte à tartiner aux noisettes sans sucre', 'crema de avellana sin azúcar',
    'zuckerfreier Nussaufstrich', 'creme de avelã sem açúcar'),
  ('Heath bars, crushed', 'heath-bars-crushed', 'other', '{}',
    'barres Heath écrasées', 'barras Heath trituradas', 'zerdrückte Heath-Riegel', 'barras Heath esmagadas'),
  ('high-quality extra-virgin olive oil', 'high-quality-evoo', 'oil', '{}',
    'huile d''olive extra vierge de qualité', 'aceite de oliva virgen extra de calidad',
    'hochwertiges natives Olivenöl extra', 'azeite extravirgem de qualidade'),
  ('honey or agave', 'honey-or-agave', 'sweetener', '{}',
    'miel ou sirop d''agave', 'miel o agave', 'Honig oder Agavendicksaft', 'mel ou agave'),
  ('honey-roasted almonds, chopped', 'honey-roasted-almonds-chopped', 'nut', '{}',
    'amandes grillées au miel hachées', 'almendras tostadas con miel picadas',
    'gehackte honiggeröstete Mandeln', 'amêndoas torradas com mel picadas'),
  ('honeycomb candy, chopped', 'honeycomb-candy-chopped', 'other', '{}',
    'friandise en nid d''abeille hachée', 'caramelo de panal picado',
    'gehackte Honigwaben-Süßigkeit', 'doce favo de mel picado'),
  ('kaffir lime leaves, torn', 'kaffir-lime-leaves-torn', 'spice', '{}',
    'feuilles de combava déchirées', 'hojas de lima kaffir rasgadas',
    'zerrissene Kaffirlimettenblätter', 'folhas de limão kaffir rasgadas'),
  ('keto cookie dough bites', 'keto-cookie-dough-bites', 'other', '{}',
    'bouchées de pâte à cookies keto', 'bocaditos de masa de galleta keto',
    'Keto-Keksteigstücke', 'pedacinhos de massa de biscoito keto'),
  ('kirsch (cherry brandy)', 'kirsch-cherry-brandy', 'other', '{"kirsch (cherry brandy, optional)"}',
    'kirsch (eau-de-vie de cerise)', 'kirsch (aguardiente de cereza)',
    'Kirschwasser', 'kirsch (aguardente de cereja)'),
  ('kiwi, peeled and sliced', 'kiwi-peeled-sliced', 'fruit', '{}',
    'kiwi pelé et tranché', 'kiwi pelado y en rodajas', 'geschälte und geschnittene Kiwi', 'kiwi descascado e fatiado'),
  ('loose earl grey tea (or 2 teabags)', 'loose-earl-grey-tea', 'other', '{}',
    'thé Earl Grey en vrac (ou 2 sachets)', 'té Earl Grey a granel (o 2 bolsitas)',
    'loser Earl Grey Tee (oder 2 Teebeutel)', 'chá Earl Grey a granel (ou 2 sachês)'),
  ('loose jasmine tea (or 2 jasmine tea bags, steeped into warm cream then strained)',
    'loose-jasmine-tea', 'other', '{}',
    'thé au jasmin en vrac (ou 2 sachets, infusés dans la crème chaude puis filtrés)',
    'té de jazmín a granel (o 2 bolsitas, infusionado en la crema tibia y colado)',
    'loser Jasmintee (oder 2 Teebeutel, in warme Sahne eingelegt und abgeseiht)',
    'chá de jasmim a granel (ou 2 sachês, em infusão no creme morno e coado)');

-- Now link ingredients by matching on their canonical OR alias names.
-- For rows using a canonical name:
UPDATE ingredients i SET master_ingredient_id = m.id
FROM master_ingredients m
WHERE i.name = m.name AND i.master_ingredient_id IS NULL
  AND m.slug IN ('crushed-meringue-cookies','crushed-peanut-brittle','crushed-phyllo-pieces',
    'dark-brown-sugar','dark-chocolate-70-finely-chopped','dark-chocolate-chunks',
    'dark-spiced-rum','dried-banana-chips-crushed','dried-culinary-lavender-buds',
    'dried-goji-berries-soaked-drained','edible-chocolate-chip-cookie-dough-chopped',
    'edible-cookie-dough-chunks','edible-protein-cookie-dough-chunks','egg-whites-beaten-stiff',
    'egg-yolks','espresso-flavored-cookies-crumbled','fine-cornmeal-toasted',
    'activated-charcoal-powder','french-macaron-shells-crumbled','french-toast-crunch-cereal-crushed',
    'fresh-or-frozen-raspberries','fresh-red-grapes-halved','fresh-ripe-banana-halved-lengthwise',
    'fresh-sage-leaves','fresh-strawberries-hulled-and-halved','freshly-ground-black-pepper',
    'full-fat-coconut-milk','gingerbread-cookie-dough-chunks','gingersnap-cookies-crushed',
    'golden-oreo-cookies-crushed','grape-jelly','grapefruit-zest','ground-cloves','ground-nutmeg',
    'halva-crumbled','hazelnut-extract','hazelnut-praline-pieces-new','sugar-free-hazelnut-spread',
    'heath-bars-crushed','high-quality-evoo','honey-or-agave','honey-roasted-almonds-chopped',
    'honeycomb-candy-chopped','kaffir-lime-leaves-torn','keto-cookie-dough-bites',
    'kirsch-cherry-brandy','kiwi-peeled-sliced','loose-earl-grey-tea','loose-jasmine-tea');

-- Back-fill translations on existing 'dark rum' master row + link variants
UPDATE master_ingredients SET
  name_fr = COALESCE(name_fr, 'rhum brun'),
  name_es = COALESCE(name_es, 'ron oscuro'),
  name_de = COALESCE(name_de, 'dunkler Rum'),
  name_pt = COALESCE(name_pt, 'rum escuro')
WHERE name = 'dark rum';

UPDATE ingredients SET master_ingredient_id = (SELECT id FROM master_ingredients WHERE name = 'dark rum')
WHERE name IN ('dark rum (optional)', 'dark rum (or 1/4 tsp rum extract)', 'dark rum (or 1/4 tsp rum extract for kid-friendly)')
  AND master_ingredient_id IS NULL;

-- Link variant rows using aliases:
UPDATE ingredients SET master_ingredient_id = (SELECT id FROM master_ingredients WHERE slug = 'crushed-phyllo-pieces')
WHERE name = 'crushed phyllo pieces (baked)' AND master_ingredient_id IS NULL;

UPDATE ingredients SET master_ingredient_id = (SELECT id FROM master_ingredients WHERE slug = 'dark-chocolate-chunks')
WHERE name = 'dark chocolate chunks (70%+)' AND master_ingredient_id IS NULL;

UPDATE ingredients SET master_ingredient_id = (SELECT id FROM master_ingredients WHERE slug = 'dark-rum')
WHERE name IN ('dark rum (optional)', 'dark rum (or 1/4 tsp rum extract)', 'dark rum (or 1/4 tsp rum extract for kid-friendly)')
  AND master_ingredient_id IS NULL;

UPDATE ingredients SET master_ingredient_id = (SELECT id FROM master_ingredients WHERE slug = 'egg-yolks')
WHERE name = 'egg yolks, tempered' AND master_ingredient_id IS NULL;

UPDATE ingredients SET master_ingredient_id = (SELECT id FROM master_ingredients WHERE slug = 'fresh-strawberries-hulled-and-halved')
WHERE name = 'fresh strawberries, stems removed' AND master_ingredient_id IS NULL;

UPDATE ingredients SET master_ingredient_id = (SELECT id FROM master_ingredients WHERE slug = 'freshly-ground-black-pepper')
WHERE name = 'freshly cracked black pepper' AND master_ingredient_id IS NULL;

UPDATE ingredients SET master_ingredient_id = (SELECT id FROM master_ingredients WHERE slug = 'golden-oreo-cookies-crushed')
WHERE name = 'Oreo cookies, crushed (Golden preferred)' AND master_ingredient_id IS NULL;

UPDATE ingredients SET master_ingredient_id = (SELECT id FROM master_ingredients WHERE slug = 'sugar-free-hazelnut-spread')
WHERE name IN ('hazelnut spread (sugar-free)', 'hazelnut spread (sugar-free if needed)')
  AND master_ingredient_id IS NULL;

UPDATE ingredients SET master_ingredient_id = (SELECT id FROM master_ingredients WHERE slug = 'kirsch-cherry-brandy')
WHERE name = 'kirsch (cherry brandy, optional)' AND master_ingredient_id IS NULL;

-- Also link "hazelnut spread (Nutella)" + "Nutella (hazelnut-chocolate spread)" to existing hazelnut-spread master
UPDATE ingredients SET master_ingredient_id = (SELECT id FROM master_ingredients WHERE slug = 'hazelnut-spread')
WHERE name IN ('hazelnut spread (Nutella)', 'Nutella (hazelnut-chocolate spread)')
  AND master_ingredient_id IS NULL;
