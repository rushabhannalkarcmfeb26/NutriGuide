const db = require('./config/db');

async function seed() {
    try {
        await db.query('DELETE FROM recipes');
        
        const query = `
            INSERT INTO recipes (title, description, ingredients, instructions, calories, protein, carbs, fat, diet_tag)
            VALUES 
            -- VEGAN (20 Total)
            ('Chana Masala', 'Spicy and tangy chickpea curry.', '["chickpeas", "onions", "tomatoes", "spices"]', 'Boil chickpeas. Sauté onions and tomatoes with spices. Mix and simmer.', 300, 12, 45, 8, 'vegan'),
            ('Aloo Gobi', 'Dry vegetable dish made with potatoes and cauliflower.', '["potatoes", "cauliflower", "spices"]', 'Sauté potatoes and cauliflower with spices until tender.', 200, 5, 30, 7, 'vegan'),
            ('Baingan Bharta', 'Smoky roasted eggplant mash cooked with onions and tomatoes.', '["eggplant", "onions", "tomatoes", "garlic"]', 'Roast eggplant. Mash and cook with aromatics.', 150, 4, 20, 5, 'vegan'),
            ('Dal Tadka', 'Yellow lentils tempered with oil and spices.', '["yellow lentils", "oil", "garlic", "cumin"]', 'Boil lentils. Add tempering.', 220, 14, 35, 6, 'vegan'),
            ('Bhindi Masala', 'Stir-fried okra with spices.', '["okra", "onions", "tomatoes", "spices"]', 'Chop okra. Sauté with onions and spices.', 180, 4, 15, 10, 'vegan'),
            ('Rajma', 'Red kidney bean curry.', '["kidney beans", "onions", "tomatoes", "spices"]', 'Cook beans. Simmer in spicy onion tomato gravy.', 320, 15, 48, 5, 'vegan'),
            ('Mix Veg Sabzi', 'Mixed vegetables cooked with spices.', '["carrots", "peas", "beans", "potatoes"]', 'Sauté mixed vegetables until cooked.', 160, 5, 20, 6, 'vegan'),
            ('Poha', 'Flattened rice dish with peanuts and turmeric.', '["flattened rice", "peanuts", "onions", "turmeric"]', 'Wash poha. Cook with onions and peanuts.', 250, 6, 45, 8, 'vegan'),
            ('Vegetable Upma', 'Semolina porridge with mixed vegetables.', '["semolina", "mixed vegetables", "mustard seeds"]', 'Roast semolina. Cook with boiled veg and water.', 280, 7, 50, 9, 'vegan'),
            ('Masala Dosa', 'Crispy crepe stuffed with spiced potato filling.', '["rice batter", "potatoes", "onions"]', 'Spread batter. Add potato filling.', 300, 6, 45, 10, 'vegan'),
            ('Idli Sambhar', 'Steamed rice cakes with lentil soup.', '["rice", "lentils", "vegetables", "tamarind"]', 'Steam idli batter. Boil sambhar with veg.', 280, 8, 55, 2, 'vegan'),
            ('Aloo Palak', 'Potatoes cooked in a spinach gravy.', '["potatoes", "spinach", "garlic"]', 'Boil potatoes. Cook in pureed spinach.', 190, 6, 25, 5, 'vegan'),
            ('Mushroom Matar', 'Mushrooms and peas in a spiced gravy.', '["mushrooms", "peas", "onions", "tomatoes"]', 'Sauté mushrooms and peas in tomato gravy.', 210, 8, 15, 10, 'vegan'),
            ('Cabbage Poriyal', 'South Indian stir-fried cabbage with coconut.', '["cabbage", "coconut", "mustard seeds", "curry leaves"]', 'Stir fry cabbage with tempering and coconut.', 120, 3, 15, 6, 'vegan'),
            ('Lauki Chana Dal', 'Bottle gourd cooked with lentils.', '["bottle gourd", "chana dal", "tomatoes"]', 'Pressure cook dal and bottle gourd with spices.', 170, 9, 25, 2, 'vegan'),
            ('Soya Chunk Curry', 'High-protein soya chunks in a rich gravy.', '["soya chunks", "onions", "tomatoes", "garlic"]', 'Boil soya chunks. Cook in spicy gravy.', 260, 25, 15, 10, 'vegan'),
            ('Kala Chana', 'Black chickpeas cooked in a dry spice mix.', '["black chickpeas", "onions", "green chilies"]', 'Boil chickpeas. Sauté in dry spices.', 290, 14, 40, 6, 'vegan'),
            ('Vegetable Pulao', 'One-pot rice dish with assorted veggies.', '["basmati rice", "carrots", "beans", "peas"]', 'Cook rice with vegetables and whole spices.', 340, 6, 65, 8, 'vegan'),
            ('Jeera Rice', 'Cumin flavored basmati rice.', '["basmati rice", "cumin seeds", "oil"]', 'Cook rice. Temper with cumin seeds.', 220, 4, 45, 4, 'vegan'),
            ('Methi Aloo', 'Fenugreek leaves cooked with potatoes.', '["fenugreek leaves", "potatoes", "garlic"]', 'Stir fry chopped potatoes and methi leaves.', 160, 4, 25, 5, 'vegan'),
            
            -- VEGETARIAN (20 Total)
            ('Paneer Butter Masala', 'Rich and creamy cottage cheese curry.', '["paneer", "butter", "tomatoes", "cream"]', 'Cook tomatoes with butter. Add cream and paneer.', 400, 14, 15, 30, 'vegetarian'),
            ('Palak Paneer', 'Spinach gravy with cottage cheese cubes.', '["spinach", "paneer", "garlic", "cream"]', 'Blanch spinach. Puree and cook with paneer.', 320, 15, 12, 25, 'vegetarian'),
            ('Dal Makhani', 'Slow-cooked black lentils with butter and cream.', '["black lentils", "kidney beans", "butter", "cream"]', 'Slow cook lentils. Add butter and cream.', 380, 16, 40, 18, 'vegetarian'),
            ('Malai Kofta', 'Fried dumpling in a rich creamy gravy.', '["potatoes", "paneer", "cream", "cashews"]', 'Make koftas. Deep fry. Simmer in cashew gravy.', 450, 12, 35, 32, 'vegetarian'),
            ('Shahi Paneer', 'Paneer in a thick gravy made of cream, tomatoes and spices.', '["paneer", "yogurt", "nuts", "spices"]', 'Cook paneer in yogurt and nut based gravy.', 420, 16, 15, 30, 'vegetarian'),
            ('Kadai Paneer', 'Spicy paneer with bell peppers.', '["paneer", "bell peppers", "onions", "spices"]', 'Sauté paneer and peppers with ground spices.', 350, 15, 15, 26, 'vegetarian'),
            ('Veg Biryani', 'Aromatic rice dish with mixed vegetables and paneer.', '["basmati rice", "mixed veg", "paneer", "spices"]', 'Layer half cooked rice with veg curry. Slow cook.', 400, 12, 60, 14, 'vegetarian'),
            ('Mutter Paneer', 'Peas and cottage cheese curry.', '["peas", "paneer", "tomatoes", "onions"]', 'Cook peas and paneer in tomato gravy.', 340, 16, 20, 22, 'vegetarian'),
            ('Ghee Roast Dosa', 'Crispy crepe roasted with clarified butter.', '["rice batter", "ghee"]', 'Spread batter. Roast with ghee until crispy.', 250, 5, 30, 12, 'vegetarian'),
            ('Paneer Tikka', 'Grilled marinated cottage cheese cubes.', '["paneer", "yogurt", "bell peppers", "spices"]', 'Marinate paneer. Grill in tandoor or oven.', 300, 18, 10, 22, 'vegetarian'),
            ('Vegetable Korma', 'Mixed veggies in a creamy coconut and yogurt sauce.', '["mixed vegetables", "coconut", "yogurt", "cashews"]', 'Simmer veggies in blended cashew-coconut gravy.', 360, 8, 25, 26, 'vegetarian'),
            ('Navratan Korma', 'Rich curry with nine types of veg, fruits, and nuts.', '["mixed veg", "paneer", "fruits", "nuts", "cream"]', 'Cook ingredients in a sweet and savory creamy sauce.', 410, 10, 35, 28, 'vegetarian'),
            ('Paneer Bhurji', 'Scrambled paneer with onions and tomatoes.', '["paneer", "onions", "tomatoes", "green chilies"]', 'Sauté onions and tomatoes. Add crumbled paneer.', 280, 16, 10, 20, 'vegetarian'),
            ('Vegetable Manchurian', 'Indo-Chinese fried veg balls in a soy-based sauce.', '["cabbage", "carrots", "soy sauce", "cornstarch"]', 'Deep fry veg balls. Toss in thick soy gravy.', 330, 6, 45, 15, 'vegetarian'),
            ('Chilli Paneer', 'Indo-Chinese spicy paneer stir fry.', '["paneer", "capsicum", "soy sauce", "chili sauce"]', 'Fry paneer cubes. Toss with sauces and peppers.', 380, 15, 20, 28, 'vegetarian'),
            ('Curd Rice', 'Comforting yogurt mixed with soft rice.', '["rice", "yogurt", "mustard seeds", "curry leaves"]', 'Mix rice and yogurt. Add tempering.', 240, 8, 40, 6, 'vegetarian'),
            ('Methi Malai Mutter', 'Fenugreek and peas in a rich cream sauce.', '["fenugreek", "peas", "cream", "cashews"]', 'Cook peas and methi. Simmer in rich cream gravy.', 390, 10, 20, 32, 'vegetarian'),
            ('Aloo Paratha', 'Whole wheat flatbread stuffed with spiced potatoes.', '["wheat flour", "potatoes", "ghee", "spices"]', 'Stuff dough with potato mix. Roast with ghee.', 320, 8, 45, 12, 'vegetarian'),
            ('Paneer Paratha', 'Whole wheat flatbread stuffed with grated paneer.', '["wheat flour", "paneer", "ghee", "spices"]', 'Stuff dough with paneer mix. Roast with ghee.', 360, 14, 40, 16, 'vegetarian'),
            ('Gulab Jamun', 'Deep fried milk solids soaked in sugar syrup.', '["milk powder", "sugar", "ghee", "cardamom"]', 'Make dough balls. Fry in ghee. Soak in syrup.', 450, 5, 60, 22, 'vegetarian'),
            
            -- KETO / NON-VEG (15 Total)
            ('Chicken Tikka Masala', 'Roasted chicken chunks in a spicy sauce.', '["chicken", "yogurt", "tomatoes", "spices"]', 'Marinate and roast chicken. Simmer in tomato sauce.', 450, 40, 15, 25, 'non-vegetarian'),
            ('Mutton Rogan Josh', 'Aromatic lamb dish of Persian origin.', '["mutton", "yogurt", "kashmiri chili", "spices"]', 'Slow cook mutton in yogurt and spices.', 500, 35, 10, 35, 'non-vegetarian'),
            ('Butter Chicken', 'Chicken in a mildly spiced tomato sauce.', '["chicken", "butter", "cream", "tomatoes"]', 'Cook chicken in creamy tomato sauce.', 480, 30, 15, 35, 'non-vegetarian'),
            ('Fish Curry', 'Spicy and tangy fish curry.', '["fish", "coconut milk", "tamarind", "spices"]', 'Simmer fish in coconut and tamarind gravy.', 350, 30, 10, 20, 'non-vegetarian'),
            ('Chicken Biryani', 'Aromatic rice dish layered with spiced chicken.', '["basmati rice", "chicken", "yogurt", "spices"]', 'Marinate chicken. Layer with half-cooked rice. Slow cook.', 550, 35, 60, 18, 'non-vegetarian'),
            ('Mutton Biryani', 'Rich and flavorful rice dish with tender mutton.', '["basmati rice", "mutton", "ghee", "spices"]', 'Cook mutton in spices. Layer with rice and steam.', 650, 40, 65, 25, 'non-vegetarian'),
            ('Egg Curry', 'Boiled eggs in a spicy onion-tomato gravy.', '["eggs", "onions", "tomatoes", "spices"]', 'Boil eggs. Simmer in rich curry sauce.', 300, 18, 15, 20, 'non-vegetarian'),
            ('Tandoori Chicken', 'Yogurt and spice marinated chicken roasted in a tandoor.', '["chicken", "yogurt", "tandoori masala", "lemon"]', 'Marinate chicken overnight. Grill until charred.', 320, 45, 5, 14, 'non-vegetarian'),
            ('Chicken Korma', 'Mild chicken curry in a yogurt and nut-based sauce.', '["chicken", "yogurt", "cashews", "cream"]', 'Cook chicken in a blended creamy white gravy.', 460, 38, 12, 30, 'non-vegetarian'),
            ('Prawn Masala', 'Juicy prawns cooked in a thick spicy gravy.', '["prawns", "onions", "tomatoes", "garam masala"]', 'Sauté prawns quickly. Simmer in thick masala.', 310, 28, 10, 18, 'non-vegetarian'),
            ('Keema Matar', 'Minced meat cooked with green peas.', '["minced mutton", "peas", "onions", "tomatoes"]', 'Brown minced meat. Cook with peas and spices.', 420, 35, 15, 25, 'non-vegetarian'),
            ('Fish Fry', 'Crispy pan-fried marinated fish slices.', '["fish", "semolina", "red chili powder", "lemon"]', 'Coat fish in spices and semolina. Shallow fry.', 280, 25, 8, 16, 'non-vegetarian'),
            ('Egg Bhurji', 'Indian style spicy scrambled eggs.', '["eggs", "onions", "green chilies", "tomatoes"]', 'Sauté veggies. Crack eggs and scramble.', 250, 18, 5, 18, 'non-vegetarian'),
            ('Chicken Chettinad', 'Highly spiced South Indian chicken curry.', '["chicken", "coconut", "black pepper", "curry leaves"]', 'Roast and grind fresh spices. Cook with chicken.', 440, 38, 12, 28, 'non-vegetarian'),
            ('Mutton Kebab', 'Minced meat skewers grilled to perfection.', '["minced mutton", "mint", "coriander", "spices"]', 'Mix meat with herbs. Mold on skewers and grill.', 380, 30, 5, 26, 'non-vegetarian')
        `;
        await db.query(query);
        console.log('Indian recipes inserted successfully!');
        
        process.exit(0);
    } catch (err) {
        console.error('Error seeding:', err);
        process.exit(1);
    }
}

seed();
