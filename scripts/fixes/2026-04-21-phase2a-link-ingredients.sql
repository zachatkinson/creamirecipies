-- Phase 2a: link 67 ingredient-name variants to their master_ingredients row

UPDATE ingredients SET master_ingredient_id = '5065fa6f-3d81-4dfc-9956-5daeb3534540'
WHERE name = 'Greek yogurt' AND master_ingredient_id IS NULL;  -- -> plain Greek yogurt

UPDATE ingredients SET master_ingredient_id = 'b6d14b88-11dc-4e3d-b923-9e7335989b04'
WHERE name = 'toasted pecans, chopped' AND master_ingredient_id IS NULL;  -- -> toasted pecans

UPDATE ingredients SET master_ingredient_id = 'ea0ae5ad-48fc-460a-ab5e-32a69e6c2576'
WHERE name = 'lemon juice' AND master_ingredient_id IS NULL;  -- -> fresh lemon juice

UPDATE ingredients SET master_ingredient_id = '48b1b476-2442-4e86-8a6a-ca6180240b14'
WHERE name = 'fresh lime juice' AND master_ingredient_id IS NULL;  -- -> lime juice

UPDATE ingredients SET master_ingredient_id = '4202d45c-ef23-4c86-89ac-14977767a3fd'
WHERE name = 'toasted sliced almonds' AND master_ingredient_id IS NULL;  -- -> sliced almonds

UPDATE ingredients SET master_ingredient_id = 'b6ed27bf-5639-43ca-83be-96ae9d5ad445'
WHERE name = 'toasted walnuts, chopped' AND master_ingredient_id IS NULL;  -- -> chopped walnuts

UPDATE ingredients SET master_ingredient_id = 'ff8f54c1-9839-426a-b85e-c398c0688a4e'
WHERE name = 'strawberries, pureed' AND master_ingredient_id IS NULL;  -- -> fresh strawberries

UPDATE ingredients SET master_ingredient_id = '43ddc141-5586-4700-b3a3-aaf1cba61c55'
WHERE name = 'raspberries, pureed' AND master_ingredient_id IS NULL;  -- -> fresh raspberries

UPDATE ingredients SET master_ingredient_id = 'a6f27b93-e1d3-49f5-a25c-a53429caa43a'
WHERE name = 'almond milk' AND master_ingredient_id IS NULL;  -- -> unsweetened almond milk

UPDATE ingredients SET master_ingredient_id = '781aaa4c-88ed-433d-8756-ae8a79815a3a'
WHERE name = 'brownie bites, chopped' AND master_ingredient_id IS NULL;  -- -> brownie bites

UPDATE ingredients SET master_ingredient_id = '30884e25-2591-4f66-b626-da34b2ea2541'
WHERE name = 'vanilla bean, split and scraped' AND master_ingredient_id IS NULL;  -- -> vanilla bean

UPDATE ingredients SET master_ingredient_id = 'fff7ce95-d161-4682-9875-f07ecda54ab4'
WHERE name = 'Oreo cookies, crushed' AND master_ingredient_id IS NULL;  -- -> Oreo cookies

UPDATE ingredients SET master_ingredient_id = '9394e866-1817-4d06-9c50-e6b8bdb2d98c'
WHERE name = 'cream cheese, softened' AND master_ingredient_id IS NULL;  -- -> cream cheese

UPDATE ingredients SET master_ingredient_id = 'b55bc230-4ec4-451d-afae-d40e63a9471a'
WHERE name = 'white chocolate chips, melted' AND master_ingredient_id IS NULL;  -- -> white chocolate chips

UPDATE ingredients SET master_ingredient_id = '0882b56e-1a60-435b-b934-7bb4474d3606'
WHERE name = 'butter, melted' AND master_ingredient_id IS NULL;  -- -> butter

UPDATE ingredients SET master_ingredient_id = '163497f8-d7e2-4c6a-b885-dd98bff614b2'
WHERE name = 'unsweetened cocoa powder' AND master_ingredient_id IS NULL;  -- -> cocoa powder

UPDATE ingredients SET master_ingredient_id = '55a54450-3b6d-40cb-84b7-d443885353f5'
WHERE name = 'blackberries, pureed' AND master_ingredient_id IS NULL;  -- -> blackberries

UPDATE ingredients SET master_ingredient_id = '91467968-522c-4608-9724-f5cbe2fbd74a'
WHERE name = 'fresh mint leaves, minced' AND master_ingredient_id IS NULL;  -- -> fresh mint leaves

UPDATE ingredients SET master_ingredient_id = '7330af2d-7cbc-4225-95ab-9949169b40c1'
WHERE name = 'peanut butter' AND master_ingredient_id IS NULL;  -- -> creamy peanut butter

UPDATE ingredients SET master_ingredient_id = 'dc081b1f-c8e0-4567-89ef-a419bcd0733e'
WHERE name = 'watermelon, pureed' AND master_ingredient_id IS NULL;  -- -> watermelon

UPDATE ingredients SET master_ingredient_id = '9df6fd61-17e9-4e08-9b82-cdeb075829f3'
WHERE name = 'applesauce' AND master_ingredient_id IS NULL;  -- -> unsweetened applesauce

UPDATE ingredients SET master_ingredient_id = '79b0546f-98de-45cf-8857-1cc07cdd182a'
WHERE name = 'kiwi, pureed' AND master_ingredient_id IS NULL;  -- -> kiwi

UPDATE ingredients SET master_ingredient_id = 'ac64d960-cdb8-46c3-843e-0f64249a0c51'
WHERE name = 'fresh peaches, pureed' AND master_ingredient_id IS NULL;  -- -> ripe peaches

UPDATE ingredients SET master_ingredient_id = '410f9f59-0d65-4d68-b0db-9c6a097cea80'
WHERE name = 'fresh basil, minced' AND master_ingredient_id IS NULL;  -- -> fresh basil

UPDATE ingredients SET master_ingredient_id = '23f26cce-86df-4d5b-b87e-f6c0bec5f642'
WHERE name = 'creamy almond butter' AND master_ingredient_id IS NULL;  -- -> almond butter

UPDATE ingredients SET master_ingredient_id = '5aae9ac0-9e60-4320-a02b-e52245d72c10'
WHERE name = 'mixed berries, pureed' AND master_ingredient_id IS NULL;  -- -> mixed berries

UPDATE ingredients SET master_ingredient_id = '37919dab-1d2f-4d84-8856-61e282539a8d'
WHERE name = 'cherries, pureed' AND master_ingredient_id IS NULL;  -- -> cherries

UPDATE ingredients SET master_ingredient_id = '91467968-522c-4608-9724-f5cbe2fbd74a'
WHERE name = 'fresh mint leaves, chopped' AND master_ingredient_id IS NULL;  -- -> fresh mint leaves

UPDATE ingredients SET master_ingredient_id = 'bfd38023-6b6e-4504-bb0b-18b4d37b900b'
WHERE name = 'fresh key lime juice' AND master_ingredient_id IS NULL;  -- -> key lime juice

UPDATE ingredients SET master_ingredient_id = 'd47a6836-c3de-42be-b1fb-b95d93bcf498'
WHERE name = 'Nutella' AND master_ingredient_id IS NULL;  -- -> hazelnut spread

UPDATE ingredients SET master_ingredient_id = 'dde228f4-5c8a-45a2-8e40-d008ed9d4a06'
WHERE name = 'dark chocolate chips, melted' AND master_ingredient_id IS NULL;  -- -> dark chocolate chips

UPDATE ingredients SET master_ingredient_id = '81bd7b5a-a23f-477f-b140-39baf0f6f504'
WHERE name = 'ripe pears, pureed' AND master_ingredient_id IS NULL;  -- -> ripe pear

UPDATE ingredients SET master_ingredient_id = '81bd7b5a-a23f-477f-b140-39baf0f6f504'
WHERE name = 'ripe pear, pureed' AND master_ingredient_id IS NULL;  -- -> ripe pear

UPDATE ingredients SET master_ingredient_id = '126b1339-dec2-4c77-bccc-376722d95f60'
WHERE name = 'freeze-dried strawberries, crushed' AND master_ingredient_id IS NULL;  -- -> freeze-dried strawberries

UPDATE ingredients SET master_ingredient_id = 'b768b395-2260-4901-a3d3-5a4e8aabd20c'
WHERE name = 'apricots, pureed' AND master_ingredient_id IS NULL;  -- -> apricots

UPDATE ingredients SET master_ingredient_id = 'c3697a52-e854-4354-b88c-d358528fb7db'
WHERE name = 'plums, pureed' AND master_ingredient_id IS NULL;  -- -> plums

UPDATE ingredients SET master_ingredient_id = '1b08e15c-50db-4cbf-b40a-ea80edb5dcae'
WHERE name = 'frozen cherries' AND master_ingredient_id IS NULL;  -- -> frozen sweet cherries

UPDATE ingredients SET master_ingredient_id = '6936daf1-f65f-4440-b78e-5043e272e53e'
WHERE name = 'honeydew melon, pureed' AND master_ingredient_id IS NULL;  -- -> honeydew melon

UPDATE ingredients SET master_ingredient_id = 'f4a08b54-8252-4809-8a0e-bb0d34c9a880'
WHERE name = 'fresh basil leaves, finely minced' AND master_ingredient_id IS NULL;  -- -> fresh basil leaves

UPDATE ingredients SET master_ingredient_id = '5d579194-e860-4298-bd65-96d8c64a38dd'
WHERE name = 'creamy cashew butter' AND master_ingredient_id IS NULL;  -- -> cashew butter

UPDATE ingredients SET master_ingredient_id = 'e3eb5ae9-9272-4aa7-8e4a-1fcc2e287803'
WHERE name = 'Cinnamon Toast Crunch cereal, crushed' AND master_ingredient_id IS NULL;  -- -> Cinnamon Toast Crunch cereal

UPDATE ingredients SET master_ingredient_id = 'beb0e721-9cb3-47ed-8d1a-0e4e06df00ab'
WHERE name = 'toasted marshmallow fluff' AND master_ingredient_id IS NULL;  -- -> marshmallow fluff

UPDATE ingredients SET master_ingredient_id = 'ac64d960-cdb8-46c3-843e-0f64249a0c51'
WHERE name = 'ripe peaches, sliced' AND master_ingredient_id IS NULL;  -- -> ripe peaches

UPDATE ingredients SET master_ingredient_id = '97a1468b-2472-45de-9f1f-ec9e3ffb6454'
WHERE name = 'roasted unsalted pistachios' AND master_ingredient_id IS NULL;  -- -> roasted pistachios

UPDATE ingredients SET master_ingredient_id = 'f4a08b54-8252-4809-8a0e-bb0d34c9a880'
WHERE name = 'fresh basil leaves, minced' AND master_ingredient_id IS NULL;  -- -> fresh basil leaves

UPDATE ingredients SET master_ingredient_id = '253302d0-35e6-48ba-8422-d45bad81270e'
WHERE name = 'fresh sage, minced' AND master_ingredient_id IS NULL;  -- -> fresh sage

UPDATE ingredients SET master_ingredient_id = 'f1342287-ffa0-420a-8271-22615bbf8eca'
WHERE name = 'jalapeno, minced' AND master_ingredient_id IS NULL;  -- -> jalapeno

UPDATE ingredients SET master_ingredient_id = '1f46e5a3-3d23-4d51-8abe-76405a138f50'
WHERE name = 'fresh figs, pureed' AND master_ingredient_id IS NULL;  -- -> fresh figs

UPDATE ingredients SET master_ingredient_id = '7e890239-47ff-46dc-8e28-ea736d482770'
WHERE name = 'green grapes, pureed' AND master_ingredient_id IS NULL;  -- -> green grapes

UPDATE ingredients SET master_ingredient_id = 'af62b560-8097-4803-ae2c-845143731f98'
WHERE name = 'honey roasted peanuts, chopped' AND master_ingredient_id IS NULL;  -- -> honey roasted peanuts

UPDATE ingredients SET master_ingredient_id = 'f26cc36b-6e90-4a13-af2d-7226fab5740d'
WHERE name = 'praline pecans, chopped' AND master_ingredient_id IS NULL;  -- -> praline pecans

UPDATE ingredients SET master_ingredient_id = 'c369d6aa-52c1-4b1b-80eb-86c6fbd16f88'
WHERE name = 'blueberry preserves' AND master_ingredient_id IS NULL;  -- -> blueberry jam

UPDATE ingredients SET master_ingredient_id = 'b6ed27bf-5639-43ca-83be-96ae9d5ad445'
WHERE name = 'walnut pieces' AND master_ingredient_id IS NULL;  -- -> chopped walnuts

UPDATE ingredients SET master_ingredient_id = 'e143faaa-91f6-4c04-9b36-1088cc349264'
WHERE name = 'strawberry preserves' AND master_ingredient_id IS NULL;  -- -> strawberry jam

UPDATE ingredients SET master_ingredient_id = 'd4768838-718a-4288-be6e-6d2456ffb598'
WHERE name = 'pineapple, pureed' AND master_ingredient_id IS NULL;  -- -> pineapple

UPDATE ingredients SET master_ingredient_id = 'f7385e02-bcbb-462f-8a4d-1acebcb6fad7'
WHERE name = 'starfruit, pureed' AND master_ingredient_id IS NULL;  -- -> ripe starfruit, chopped

UPDATE ingredients SET master_ingredient_id = 'aa5d9a0c-7362-4049-92c0-2b132acb2acc'
WHERE name = 'nectarines, pureed' AND master_ingredient_id IS NULL;  -- -> nectarines

UPDATE ingredients SET master_ingredient_id = 'c3697a52-e854-4354-b88c-d358528fb7db'
WHERE name = 'fresh plums, pitted and halved' AND master_ingredient_id IS NULL;  -- -> plums

UPDATE ingredients SET master_ingredient_id = 'b9ebae2f-27f6-4024-b602-4c30212fd150'
WHERE name = 'cantaloupe, pureed' AND master_ingredient_id IS NULL;  -- -> cantaloupe

UPDATE ingredients SET master_ingredient_id = '5980989b-4a42-4398-9f03-12d5c18e0099'
WHERE name = 'golden raisins, roughly chopped' AND master_ingredient_id IS NULL;  -- -> golden raisins

UPDATE ingredients SET master_ingredient_id = 'ff189a93-839c-4c38-8436-73bb06c5cc3b'
WHERE name = 'toasted hazelnuts, chopped' AND master_ingredient_id IS NULL;  -- -> toasted hazelnuts

UPDATE ingredients SET master_ingredient_id = 'f1342287-ffa0-420a-8271-22615bbf8eca'
WHERE name = 'jalapeno, seeded and finely minced' AND master_ingredient_id IS NULL;  -- -> jalapeno

UPDATE ingredients SET master_ingredient_id = '5aae9ac0-9e60-4320-a02b-e52245d72c10'
WHERE name = 'frozen mixed berries, partially thawed' AND master_ingredient_id IS NULL;  -- -> mixed berries

UPDATE ingredients SET master_ingredient_id = '37919dab-1d2f-4d84-8856-61e282539a8d'
WHERE name = 'fresh cherries, pitted and halved' AND master_ingredient_id IS NULL;  -- -> cherries

UPDATE ingredients SET master_ingredient_id = '55e1415c-988a-4658-8e94-1f244695221d'
WHERE name = 'frozen blueberries, partially thawed' AND master_ingredient_id IS NULL;  -- -> frozen blueberries

UPDATE ingredients SET master_ingredient_id = 'b768b395-2260-4901-a3d3-5a4e8aabd20c'
WHERE name = 'fresh apricots, pitted and halved' AND master_ingredient_id IS NULL;  -- -> apricots

UPDATE ingredients SET master_ingredient_id = '1ee51068-2e0f-4c70-9144-3d11c0c48866'
WHERE name = 'caramel corn pieces, crushed' AND master_ingredient_id IS NULL;  -- -> caramel corn pieces

