const db = require('./config/db');

async function run() {
    try {
        console.log('Step 1: Temporarily making diet_tag a plain VARCHAR to allow renaming...');
        await db.query(`ALTER TABLE recipes MODIFY COLUMN diet_tag VARCHAR(50) DEFAULT NULL`);
        console.log('  ✅ Column converted to VARCHAR.');

        console.log('Step 2: Renaming keto → non-vegetarian...');
        const [r1] = await db.query(`UPDATE recipes SET diet_tag = 'non-vegetarian' WHERE diet_tag = 'keto'`);
        console.log(`  ✅ Updated ${r1.affectedRows} rows.`);

        console.log('Step 3: Converting back to ENUM with non-vegetarian...');
        await db.query(`
            ALTER TABLE recipes MODIFY COLUMN diet_tag 
            ENUM('vegan', 'vegetarian', 'non-vegetarian') DEFAULT NULL
        `);
        console.log('  ✅ ENUM column updated.');

        console.log('Step 4: Removing beef and pork products...');
        const beefPorkTerms = ['beef', 'pork', 'bacon', 'ham', 'lard', 'sausage'];
        const likeClauses = beefPorkTerms.map(t => `LOWER(title) LIKE '%${t}%' OR LOWER(ingredients) LIKE '%${t}%'`).join(' OR ');
        const [r2] = await db.query(`DELETE FROM recipes WHERE ${likeClauses}`);
        console.log(`  ✅ Removed ${r2.affectedRows} beef/pork recipe(s).`);

        console.log('Step 5: Inserting additional Indian recipes...');
        const indianRecipes = [
            // Non-Vegetarian Indian
            ['Chicken Tikka Masala', 'Roasted chicken chunks in a rich, spiced tomato-cream sauce.', '["chicken breast","yogurt","tomatoes","cream","butter","garlic","ginger","garam masala","kashmiri chili"]', 'Marinate chicken in yogurt and spices. Grill until charred. Simmer in tomato-cream sauce with butter and spices.', 450, 40, 15, 25, 'non-vegetarian', null],
            ['Butter Chicken (Murgh Makhani)', 'Tender chicken in a mildly spiced, buttery tomato sauce.', '["chicken","butter","cream","tomatoes","garlic","ginger","cardamom","kasuri methi"]', 'Marinate and grill chicken. Prepare rich tomato gravy with butter and cream. Combine and simmer.', 480, 32, 14, 34, 'non-vegetarian', null],
            ['Tandoori Chicken', 'Smoky, charred yogurt-marinated chicken from the tandoor.', '["whole chicken","yogurt","tandoori masala","lemon juice","garlic","ginger","red chili"]', 'Marinate chicken overnight. Grill in high heat until charred at edges. Serve with mint chutney.', 320, 45, 5, 14, 'non-vegetarian', null],
            ['Chicken Biryani', 'Aromatic basmati rice layered with spiced chicken, saffron and fried onions.', '["basmati rice","chicken","yogurt","saffron","onions","ghee","whole spices","mint"]', 'Marinate chicken. Partially cook rice with whole spices. Layer and steam (dum) until done.', 560, 36, 62, 18, 'non-vegetarian', null],
            ['Mutton Rogan Josh', 'Aromatic slow-cooked lamb in a deep Kashmiri spice gravy.', '["mutton","yogurt","kashmiri red chili","fennel","ginger powder","bay leaves","ghee"]', 'Brown mutton in ghee. Cook with yogurt and spices on low heat until tender.', 500, 35, 10, 35, 'non-vegetarian', null],
            ['Fish Curry (Kerala Style)', 'Tangy fish curry cooked in coconut milk with raw mango.', '["fish fillets","coconut milk","raw mango","mustard seeds","curry leaves","green chili","turmeric"]', 'Temper mustard and curry leaves. Add coconut milk and mango. Simmer fish until cooked.', 340, 30, 12, 18, 'non-vegetarian', null],
            ['Egg Curry', 'Boiled eggs in a rich, spiced onion-tomato gravy.', '["eggs","onions","tomatoes","garlic","ginger","garam masala","turmeric","oil"]', 'Boil eggs and fry. Make thick onion-tomato masala. Simmer eggs in the gravy.', 290, 18, 14, 18, 'non-vegetarian', null],
            ['Prawn Masala', 'Juicy prawns cooked in a bold spicy tomato-coconut gravy.', '["prawns","onions","tomatoes","coconut milk","garlic","garam masala","curry leaves"]', 'Sauté onions until golden. Add tomatoes and spices. Cook prawns until done.', 310, 28, 10, 18, 'non-vegetarian', null],
            ['Keema Matar', 'Minced mutton cooked with green peas and warming spices.', '["minced mutton","peas","onions","tomatoes","garlic","ginger","garam masala"]', 'Brown minced meat with onions. Add tomatoes and spices. Mix in peas and cook through.', 420, 35, 15, 24, 'non-vegetarian', null],
            ['Egg Bhurji', 'Indian spicy scrambled eggs with onions, tomatoes and green chilies.', '["eggs","onions","tomatoes","green chilies","cumin","turmeric","coriander"]', 'Sauté onions and chili. Add tomatoes. Crack in eggs and scramble with spices.', 240, 18, 6, 16, 'non-vegetarian', null],
            ['Chicken Chettinad', 'Fiery South Indian chicken curry with freshly ground spices.', '["chicken","coconut","black pepper","kalpasi","marathi mokku","curry leaves","red chili"]', 'Dry roast and grind fresh spices. Cook chicken in coconut-based spice masala.', 440, 38, 12, 28, 'non-vegetarian', null],
            ['Goan Fish Curry', 'Bright red Goan fish curry with vinegar and coconut.', '["kingfish","coconut","dried red chilies","vinegar","tamarind","mustard seeds"]', 'Grind coconut and chili paste. Cook with fish and tamarind. Balance with vinegar.', 330, 28, 10, 19, 'non-vegetarian', null],

            // Vegan Indian
            ['Chole Bhature', 'Spiced chickpea curry served with deep-fried fluffy bread.', '["chickpeas","maida flour","onions","tomatoes","amchur","tea bag","spices"]', 'Soak and boil chickpeas with tea. Make spicy masala. Deep fry bhatura dough.', 520, 16, 72, 18, 'vegan', null],
            ['Sambhar', 'South Indian lentil and vegetable stew with tamarind.', '["toor dal","tamarind","drumstick","tomatoes","shallots","sambhar masala","mustard seeds"]', 'Boil dal. Cook vegetables in tamarind water with sambhar powder. Temper and combine.', 220, 10, 35, 4, 'vegan', null],
            ['Pav Bhaji', 'Spiced mashed vegetable curry served with buttered bread rolls.', '["potatoes","cauliflower","peas","capsicum","pav bhaji masala","butter","pav buns"]', 'Cook and mash vegetables. Sauté with masala and butter. Serve with toasted buns.', 420, 9, 58, 16, 'vegan', null],
            ['Aloo Tikki', 'Crispy spiced potato patties served with chutneys.', '["potatoes","green peas","cumin","coriander","green chili","breadcrumbs","oil"]', 'Mash potatoes with spices and peas. Shape into patties. Shallow fry until golden.', 250, 5, 40, 9, 'vegan', null],
            ['Masala Chai Oats', 'Warming oats cooked with chai spices and jaggery.', '["rolled oats","cardamom","ginger","cinnamon","jaggery","almond milk","cloves"]', 'Brew spices in almond milk. Cook oats in spiced milk. Sweeten with jaggery.', 280, 8, 50, 6, 'vegan', null],

            // Vegetarian Indian
            ['Palak Paneer', 'Cottage cheese cubes in a velvety spinach gravy.', '["spinach","paneer","garlic","ginger","cream","onions","green chili","garam masala"]', 'Blanch and puree spinach. Fry paneer. Simmer in spinach sauce with cream.', 320, 16, 12, 24, 'vegetarian', null],
            ['Paneer Butter Masala', 'Paneer in a rich, buttery tomato-cashew sauce.', '["paneer","butter","tomatoes","cashews","cream","kasuri methi","onions","cardamom"]', 'Blend roasted tomatoes and cashews. Cook with butter and spices. Add paneer and cream.', 400, 15, 16, 30, 'vegetarian', null],
            ['Dal Makhani', 'Slow-simmered black lentils and kidney beans in butter and cream.', '["whole black lentils","kidney beans","butter","cream","onions","tomatoes","garam masala"]', 'Pressure cook lentils. Simmer overnight (or 3-4 hrs) with butter and cream. Garnish generously.', 380, 16, 40, 18, 'vegetarian', null],
            ['Aloo Paratha', 'Whole wheat flatbread stuffed with spiced potato and served with butter.', '["whole wheat flour","potatoes","ghee","green chili","ajwain","coriander","cumin"]', 'Make spiced potato stuffing. Encase in dough. Roll and roast on tawa with ghee.', 320, 8, 48, 12, 'vegetarian', null],
            ['Paneer Tikka', 'Charred marinated paneer skewers with bell peppers and onion.', '["paneer","yogurt","bell peppers","onion","tikka masala","mustard oil","lemon"]', 'Marinate paneer and vegetables. Skewer and grill until charred. Serve with mint chutney.', 300, 18, 10, 22, 'vegetarian', null],
            ['Khichdi', 'One-pot comfort dish of rice and lentils, tempered with ghee and spices.', '["rice","moong dal","ghee","turmeric","cumin","ginger","green chili"]', 'Pressure cook rice and dal together. Temper with ghee, cumin and ginger. Season and serve.', 310, 12, 52, 8, 'vegetarian', null],
        ];

        let inserted = 0;
        for (const row of indianRecipes) {
            await db.query(
                `INSERT INTO recipes (title, description, ingredients, instructions, calories, protein, carbs, fat, diet_tag, image_url) VALUES (?,?,?,?,?,?,?,?,?,?)`,
                row
            );
            inserted++;
        }
        console.log(`  ✅ Inserted ${inserted} Indian recipes.`);

        console.log('\n🎉 All done! Summary:');
        console.log(`   • diet_tag ENUM updated (keto → non-vegetarian)`);
        console.log(`   • Beef/pork products removed`);
        console.log(`   • ${inserted} Indian recipes added`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
}

run();
