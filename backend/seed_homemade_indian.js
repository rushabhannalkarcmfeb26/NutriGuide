/**
 * seed_homemade_indian.js
 * 1. Adds meal_category column (breakfast/lunch/dinner/snack) to recipes table
 * 2. Updates existing recipes with a sensible default category
 * 3. Inserts easy homemade Indian meals with proper categories
 * Run: node seed_homemade_indian.js
 */
require('dotenv').config();
const db = require('./config/db');

// ─── HOMEMADE MEALS ───────────────────────────────────────────────────────────
// [title, description, ingredients(JSON), instructions, cal, protein, carbs, fat, diet_tag, image_url, meal_category]
const meals = [
  // ══ BREAKFAST ══
  ['Poha', 'Fluffy flattened rice with mustard, curry leaves, peanuts and turmeric — ready in 15 min.',
   '["flattened rice","onion","mustard seeds","curry leaves","peanuts","turmeric","green chili","lemon","oil"]',
   'Rinse poha and drain. Heat oil, splutter mustard seeds and curry leaves. Add onion, green chili, peanuts. Add turmeric and poha. Toss gently. Squeeze lemon. Serve hot.',
   220, 6, 38, 6, 'vegan', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=480&h=300&fit=crop', 'breakfast'],

  ['Upma', 'Savory semolina porridge with vegetables — a classic South Indian breakfast in 20 min.',
   '["semolina","onion","tomato","peas","carrot","mustard seeds","curry leaves","ginger","ghee","water"]',
   'Roast semolina golden. In a pan, temper mustard seeds and curry leaves. Sauté vegetables. Add boiling water, stir in semolina. Cook until thick.',
   240, 6, 40, 6, 'vegetarian', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=480&h=300&fit=crop', 'breakfast'],

  ['Aloo Paratha', 'Whole wheat flatbread stuffed with spiced potato filling — a Punjabi breakfast staple.',
   '["whole wheat flour","potato","green chili","ginger","cumin","coriander","ajwain","ghee","salt"]',
   'Boil and mash potatoes with spices. Encase in wheat dough ball. Roll flat. Cook on hot tawa with ghee until golden on both sides.',
   320, 8, 48, 12, 'vegetarian', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=480&h=300&fit=crop', 'breakfast'],

  ['Moong Dal Cheela', 'Crispy protein-rich green moong crepes — healthy and easy breakfast.',
   '["green moong dal","ginger","green chili","cumin","turmeric","coriander leaves","oil","salt"]',
   'Soak moong 4 hrs. Grind with ginger and chili to smooth batter. Add spices. Spread thin on hot non-stick tawa. Cook until crispy.',
   200, 14, 28, 4, 'vegan', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=480&h=300&fit=crop', 'breakfast'],

  ['Besan Chilla (Gram Flour Pancake)', 'Quick savory chickpea flour pancakes with onion and spices.',
   '["besan","onion","tomato","green chili","cumin","turmeric","coriander","ajwain","oil"]',
   'Mix besan with chopped vegetables and spices. Add water to make medium-thick batter. Pour on oiled tawa and spread. Cook both sides.',
   210, 10, 30, 5, 'vegan', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=480&h=300&fit=crop', 'breakfast'],

  ['Sabudana Khichdi', 'Fluffy sago pearls with peanuts, potato and cumin — popular fasting breakfast.',
   '["sabudana (sago)","peanuts","potato","cumin seeds","green chili","ghee","lemon","sugar","salt"]',
   'Soak sabudana overnight. Drain well. Heat ghee, add cumin and chili. Add boiled potato cubes. Toss in sabudana and peanuts. Cook until translucent.',
   350, 7, 55, 12, 'vegan', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=480&h=300&fit=crop', 'breakfast'],

  ['Idli with Sambar', 'Soft steamed rice cakes served with tangy lentil and vegetable stew.',
   '["idli batter","toor dal","drumstick","tomato","tamarind","mustard seeds","curry leaves","sambar powder"]',
   'Steam idli batter in moulds for 12 min. Make sambar: cook dal, add vegetables, tamarind water and sambar powder. Temper and serve.',
   220, 7, 38, 3, 'vegan', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=480&h=300&fit=crop', 'breakfast'],

  ['Bread Omelette', 'Quick Indian spiced egg omelette served with toasted bread — ready in 10 min.',
   '["eggs","onion","tomato","green chili","coriander","turmeric","salt","butter","bread slices"]',
   'Beat eggs with chopped onion, tomato, chili, coriander and spices. Cook in butter on medium heat. Serve between toasted bread slices.',
   310, 18, 22, 16, 'non-vegetarian', 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=480&h=300&fit=crop', 'breakfast'],

  ['Vermicelli Upma (Seviyan)', 'Roasted vermicelli with vegetables and mild spices — quick 15-min breakfast.',
   '["roasted vermicelli","onion","peas","carrot","mustard seeds","curry leaves","ginger","oil","lemon"]',
   'Temper mustard seeds and curry leaves. Sauté onion and vegetables. Add boiling water. Stir in vermicelli. Cook covered for 5 min.',
   230, 5, 40, 5, 'vegan', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=480&h=300&fit=crop', 'breakfast'],

  ['Paneer Bhurji Toast', 'Spiced scrambled paneer on toasted bread — protein-rich quick breakfast.',
   '["paneer","onion","tomato","capsicum","green chili","turmeric","garam masala","butter","bread"]',
   'Crumble paneer. Sauté onion, tomato and capsicum with spices. Add paneer and toss. Serve on buttered toast.',
   340, 18, 28, 18, 'vegetarian', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=480&h=300&fit=crop', 'breakfast'],

  ['Dosa with Coconut Chutney', 'Crispy thin rice and lentil crepe served with fresh coconut chutney.',
   '["dosa batter","coconut","green chili","ginger","mustard seeds","curry leaves","roasted chana dal","oil","salt"]',
   'Spread dosa batter on hot tawa. Drizzle oil and cook till crisp. Grind coconut, chili, ginger, chana dal to chutney. Temper with mustard and curry leaves.',
   280, 6, 45, 8, 'vegan', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=480&h=300&fit=crop', 'breakfast'],

  ['Masala Oats', 'Healthy and quick rolled oats cooked with mixed vegetables and Indian spices.',
   '["rolled oats","onion","tomato","carrot","peas","green chili","turmeric","garam masala","oil"]',
   'Sauté onion and vegetables. Add spices and oats. Pour water and cook for 5-7 minutes until creamy.',
   210, 8, 35, 5, 'vegan', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=480&h=300&fit=crop', 'breakfast'],

  ['Methi Thepla', 'Gujarati whole wheat flatbread flavored with fresh fenugreek leaves and spices.',
   '["whole wheat flour","fresh fenugreek leaves (methi)","yogurt","green chili","turmeric","carom seeds (ajwain)","oil","salt"]',
   'Knead flour with methi, yogurt, and spices into a soft dough. Roll into thin discs. Cook on tawa with a little oil until brown spots appear.',
   250, 7, 38, 9, 'vegetarian', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=480&h=300&fit=crop', 'breakfast'],

  ['Rava Dosa', 'Instant crispy semolina crepe with cumin and curry leaves — no fermentation needed.',
   '["semolina (rava)","rice flour","all-purpose flour","cumin seeds","black pepper","green chili","curry leaves","onion","water"]',
   'Mix rava, rice flour, maida with water to a thin buttermilk consistency. Add spices. Pour from a height onto a hot tawa. Cook until crisp.',
   260, 5, 42, 7, 'vegan', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=480&h=300&fit=crop', 'breakfast'],

  ['Khaman Dhokla', 'Soft and spongy steamed chickpea flour cake with sweet and tangy tempering.',
   '["besan (gram flour)","yogurt","lemon juice","green chili","ginger","eno fruit salt","mustard seeds","curry leaves","sugar","oil"]',
   'Mix besan with yogurt, water, ginger-chili paste. Add Eno, steam for 15 mins. Make tempering with mustard seeds, curry leaves, sugar water and pour over dhokla.',
   180, 8, 28, 4, 'vegetarian', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=480&h=300&fit=crop', 'breakfast'],

  ['Ven Pongal', 'South Indian comfort breakfast of rice and yellow moong dal cooked with ghee, cumin and black pepper.',
   '["rice","yellow moong dal","ghee","cumin seeds","whole black pepper","ginger","curry leaves","cashews"]',
   'Dry roast moong dal. Pressure cook rice and dal. Temper cumin, black pepper, ginger, curry leaves, and cashews in ghee. Mix into cooked rice-dal.',
   310, 9, 45, 12, 'vegetarian', 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=480&h=300&fit=crop', 'breakfast'],

  // ══ LUNCH ══
  ['Pindi Chole', 'Classic dry and tangy chickpea preparation from Punjab without onion-tomato gravy.',
   '["chickpeas","tea bag","amchur","pomegranate seeds","coriander powder","cumin","ginger","green chili","oil"]',
   'Boil chickpeas with tea bag. Dry roast and grind spices. Toss boiled chickpeas in the dry spice mix and finish with hot oil tempering.',
   340, 14, 52, 12, 'vegan', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=480&h=300&fit=crop', 'lunch'],

  ['Bhindi Masala', 'Stir-fried okra with onions, tomatoes and everyday Indian spices.',
   '["okra (bhindi)","onion","tomato","cumin","turmeric","coriander powder","amchur","oil"]',
   'Wash and dry okra perfectly before chopping. Stir fry okra until less slimy. Add chopped onions, tomatoes, and dry spices. Cook until tender.',
   180, 4, 18, 12, 'vegan', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=480&h=300&fit=crop', 'lunch'],

  ['Mutton Curry (Home Style)', 'Simple, slow-cooked Sunday special mutton curry with potatoes.',
   '["mutton","potato","onion","tomato","garlic","ginger","yogurt","garam masala","mustard oil"]',
   'Marinate mutton. Brown onions in mustard oil, add ginger-garlic and mutton. Slow cook for an hour. Add potatoes and simmer until tender.',
   450, 32, 18, 28, 'non-vegetarian', 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=480&h=300&fit=crop', 'lunch'],

  ['Lemon Rice', 'Tangy and crunchy South Indian rice tempered with peanuts, mustard seeds, and lemon.',
   '["cooked rice","lemon juice","peanuts","mustard seeds","urad dal","chana dal","curry leaves","turmeric","oil"]',
   'Heat oil, fry peanuts and dals until golden. Add mustard seeds, curry leaves, and turmeric. Mix this tempering into cooked rice along with lemon juice.',
   280, 6, 48, 8, 'vegan', 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=480&h=300&fit=crop', 'lunch'],

  ['Kadhi Pakora', 'Deep-fried onion fritters submerged in a tangy yogurt and gram flour curry.',
   '["yogurt","besan (gram flour)","onion","green chili","mustard seeds","fenugreek seeds","turmeric","oil","curry leaves"]',
   'Whisk yogurt, besan, and water. Simmer until thick. Make onion pakoras and drop them into the simmering kadhi. Finish with a spicy garlic tempering.',
   320, 10, 34, 18, 'vegetarian', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=480&h=300&fit=crop', 'lunch'],

  ['Mushroom Matar', 'Earthy mushrooms and sweet green peas simmered in a spiced onion-tomato gravy.',
   '["mushrooms","green peas","onion","tomato","garlic","ginger","cashew paste","garam masala","oil"]',
   'Sauté mushrooms until brown. Make onion-tomato masala, add cashew paste for richness. Add peas and mushrooms, simmer for 10 minutes.',
   260, 8, 22, 16, 'vegan', 'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=480&h=300&fit=crop', 'lunch'],

  ['Dal Chawal (Yellow Dal + Rice)', 'Comforting arhar dal with rice — simplest and most satisfying Indian home lunch.',
   '["toor dal","rice","onion","tomato","garlic","cumin","turmeric","ghee","mustard seeds"]',
   'Pressure cook dal with turmeric and salt. Make tempering with ghee, cumin, garlic, onion and tomato. Pour over dal. Serve with steamed rice.',
   420, 16, 68, 8, 'vegan', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=480&h=300&fit=crop', 'lunch'],

  ['Rajma Chawal', 'Creamy kidney bean curry with steamed rice — Monday lunch favourite across North India.',
   '["kidney beans","onion","tomato","garlic","ginger","garam masala","cumin","bay leaf","oil","rice"]',
   'Soak and pressure cook rajma. Make thick onion-tomato masala. Simmer rajma until creamy. Serve with plain boiled rice.',
   430, 18, 66, 10, 'vegan', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=480&h=300&fit=crop', 'lunch'],

  ['Chole Bhature', 'Tangy spiced chickpea curry with fluffy deep-fried bread — a weekend treat.',
   '["chickpeas","maida","yogurt","baking soda","onion","tomato","garam masala","amchur","oil"]',
   'Boil chickpeas with tea bag for color. Make spicy masala. Deep fry maida dough into puffed bhature. Serve together.',
   510, 16, 68, 20, 'vegan', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=480&h=300&fit=crop', 'lunch'],

  ['Palak Paneer', 'Creamy spinach and cottage cheese curry — nutritious and easy to make at home.',
   '["spinach","paneer","onion","tomato","garlic","ginger","cream","garam masala","butter","cumin"]',
   'Blanch spinach and puree. Fry paneer cubes golden. Make onion-tomato masala. Add spinach puree and cream. Simmer with fried paneer.',
   320, 16, 12, 22, 'vegetarian', 'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=480&h=300&fit=crop', 'lunch'],

  ['Aloo Gobi', 'Dry spiced potato and cauliflower stir-fry — goes well with any roti.',
   '["potato","cauliflower","onion","tomato","cumin","turmeric","garam masala","mustard oil","coriander"]',
   'Fry potatoes and cauliflower separately until half cooked. Make dry masala with onion and tomato. Combine and toss until coated.',
   240, 7, 34, 10, 'vegan', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=480&h=300&fit=crop', 'lunch'],

  ['Chicken Curry (Home Style)', 'Simple and rustic home-style chicken curry — ready in under 40 min.',
   '["chicken","onion","tomato","garlic","ginger","yogurt","turmeric","red chili","garam masala","oil"]',
   'Marinate chicken in yogurt and spices. Fry onions golden. Add garlic-ginger paste. Add tomatoes and spices. Add chicken and cook covered until done.',
   380, 34, 12, 22, 'non-vegetarian', 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=480&h=300&fit=crop', 'lunch'],

  ['Egg Curry', 'Boiled eggs simmered in a rich spiced onion-tomato gravy.',
   '["eggs","onion","tomato","garlic","ginger","garam masala","turmeric","red chili","oil","coriander"]',
   'Boil eggs, peel and fry until golden. Make thick onion-tomato masala. Add fried eggs and simmer in gravy for 10 min.',
   290, 18, 14, 18, 'non-vegetarian', 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=480&h=300&fit=crop', 'lunch'],

  ['Mixed Vegetable Sabzi', 'Quick and healthy stir-fried seasonal vegetables with mild spices.',
   '["potato","carrot","beans","peas","capsicum","onion","tomato","cumin","turmeric","garam masala","oil"]',
   'Chop all vegetables uniformly. Heat oil, add cumin. Sauté onion and tomato. Add hard vegetables first, then softer ones. Season and cook covered.',
   200, 6, 30, 7, 'vegan', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=480&h=300&fit=crop', 'lunch'],

  ['Baingan Bharta', 'Smoky roasted eggplant mashed with onions, tomatoes and spices.',
   '["eggplant","onion","tomato","garlic","green chili","mustard oil","turmeric","cumin","coriander"]',
   'Char eggplant on flame until skin is burnt and inside is soft. Peel and mash. Cook with sautéed onion, garlic and tomatoes.',
   190, 5, 20, 10, 'vegan', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=480&h=300&fit=crop', 'lunch'],

  ['Khichdi', 'One-pot rice and lentil comfort food with turmeric and ghee — easy digestion meal.',
   '["rice","moong dal","ghee","turmeric","cumin","ginger","green chili","salt","water"]',
   'Wash rice and moong dal. Pressure cook with turmeric and water until mushy. Temper with ghee, cumin and ginger. Serve with pickle.',
   310, 12, 52, 8, 'vegetarian', 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=480&h=300&fit=crop', 'lunch'],

  ['Fish Curry (Home Style)', 'Tangy and spicy homestyle fish curry with tomato and mustard.',
   '["fish fillets","onion","tomato","garlic","ginger","mustard seeds","turmeric","red chili","oil","curry leaves"]',
   'Fry fish lightly with turmeric. Make thick onion-tomato-mustard gravy. Add fish and cook gently for 10 min until gravy coats.',
   300, 28, 10, 16, 'non-vegetarian', 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=480&h=300&fit=crop', 'lunch'],

  // ══ DINNER ══
  ['Dal Makhani', 'Slow-simmered black lentils in buttery tomato cream sauce — classic dinner dish.',
   '["whole black lentils","kidney beans","butter","cream","onion","tomato","garlic","ginger","garam masala"]',
   'Pressure cook lentils overnight-style or for 4 hrs. Make onion-tomato masala. Add lentils, butter and cream. Simmer on low heat.',
   380, 16, 40, 18, 'vegetarian', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=480&h=300&fit=crop', 'dinner'],

  ['Butter Chicken (Simple Home Style)', 'Mild, creamy butter chicken that can be made easily at home for dinner.',
   '["chicken","butter","cream","tomato","onion","garlic","ginger","kasuri methi","garam masala","red chili"]',
   'Marinate chicken in yogurt and spices. Grill or pan-fry. Make smooth tomato-butter gravy. Add cream and kasuri methi. Simmer chicken in gravy.',
   460, 32, 14, 30, 'non-vegetarian', 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=480&h=300&fit=crop', 'dinner'],

  ['Paneer Butter Masala', 'Creamy, indulgent paneer in a cashew-tomato sauce — restaurant taste at home.',
   '["paneer","butter","cream","tomato","cashew","onion","cardamom","kasuri methi","garlic","ginger"]',
   'Blend roasted tomatoes, onion and cashews. Cook with butter and spices. Add cream and kasuri methi. Simmer with fried paneer cubes.',
   400, 15, 16, 30, 'vegetarian', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=480&h=300&fit=crop', 'dinner'],

  ['Jeera Rice', 'Simple fragrant cumin-tempered basmati rice — ideal dinner side dish.',
   '["basmati rice","cumin seeds","ghee","bay leaf","salt","water","cloves","cardamom"]',
   'Wash and soak rice 20 min. Heat ghee, add cumin and whole spices. Add rice and water. Cook covered until fluffy.',
   280, 5, 52, 6, 'vegetarian', 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=480&h=300&fit=crop', 'dinner'],

  ['Matar Paneer', 'Green peas and paneer in spiced tomato gravy — quick and nutritious dinner.',
   '["paneer","green peas","onion","tomato","garlic","ginger","cumin","garam masala","turmeric","oil"]',
   'Fry paneer golden. Make onion-tomato masala. Add peas and cook until soft. Add fried paneer and simmer for 5 min.',
   340, 16, 18, 20, 'vegetarian', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=480&h=300&fit=crop', 'dinner'],

  ['Chicken Biryani (Simple)', 'Aromatic one-pot chicken biryani you can make at home without a restaurant kitchen.',
   '["basmati rice","chicken","yogurt","onion","tomato","whole spices","saffron","ghee","mint","oil"]',
   'Marinate chicken. Fry onions golden. Cook chicken masala. Parboil rice. Layer chicken and rice. Cover tightly and steam on low heat 25 min.',
   540, 34, 58, 18, 'non-vegetarian', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=480&h=300&fit=crop', 'dinner'],

  ['Masoor Dal (Red Lentil)', 'Quick 20-min red lentil soup — light, nutritious and ideal for dinner.',
   '["masoor dal","onion","tomato","garlic","cumin","turmeric","red chili","ghee","lemon","coriander"]',
   'Boil masoor dal with turmeric until soft. Make simple tadka with ghee, cumin and garlic. Add onion-tomato. Pour over dal. Squeeze lemon.',
   260, 14, 36, 7, 'vegan', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=480&h=300&fit=crop', 'dinner'],

  ['Kadai Chicken', 'Bold and rustic chicken curry with freshly crushed pepper and capsicum.',
   '["chicken","capsicum","onion","tomato","coriander seeds","black pepper","dry red chili","garlic","ginger","oil"]',
   'Coarsely crush coriander and pepper. Fry chicken pieces. Make masala in same kadai. Toss in capsicum and cooked chicken.',
   380, 34, 12, 22, 'non-vegetarian', 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=480&h=300&fit=crop', 'dinner'],

  ['Sarson ka Saag with Makki Roti', 'Punjabi winter classic — mustard greens with corn flour flatbread and butter.',
   '["mustard leaves","spinach","makki atta","ginger","garlic","green chili","ghee","butter","jaggery"]',
   'Boil and blend mustard and spinach. Cook with spices and ghee. Make stiff dough with makki atta. Roll and roast on tawa with butter. Serve together.',
   420, 10, 52, 18, 'vegetarian', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=480&h=300&fit=crop', 'dinner'],

  ['Shahi Paneer', 'Royal paneer in saffron-cream sauce — best for a special dinner at home.',
   '["paneer","onion","cashew","cream","tomato","saffron","cardamom","ghee","rose water","milk"]',
   'Blend onion and cashew paste. Cook in ghee with spices. Add tomato puree and cream. Add saffron milk. Simmer paneer in sauce.',
   420, 16, 14, 30, 'vegetarian', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=480&h=300&fit=crop', 'dinner'],
];

async function run() {
  // Step 1: Add meal_category column if missing
  try {
    await db.query(`ALTER TABLE recipes ADD COLUMN meal_category ENUM('breakfast','lunch','dinner','snack') DEFAULT 'lunch'`);
    console.log('✅ Added meal_category column to recipes table.');
  } catch (e) {
    if (e.code === 'ER_DUP_FIELDNAME') {
      console.log('ℹ️  meal_category column already exists — skipping ALTER.');
    } else throw e;
  }

  // Step 2: Update existing recipes with sensible categories
  console.log('\n🔄 Updating existing recipes with default categories...');
  const breakfastKeywords = ['poha','upma','idli','dosa','paratha','oats','cheela','chilla','roti','naan','toast','egg bhurji','bhurji','lassi','chai','vermicelli'];
  const dinnerKeywords   = ['biryani','butter chicken','dal makhani','shahi','korma','makhani','kebab','seekh','keema','gosht','saag','rogan','chettinad','kadai chicken','fish curry'];
  
  for (const kw of breakfastKeywords) {
    await db.query(`UPDATE recipes SET meal_category='breakfast' WHERE LOWER(title) LIKE ? AND meal_category='lunch'`, [`%${kw}%`]);
  }
  for (const kw of dinnerKeywords) {
    await db.query(`UPDATE recipes SET meal_category='dinner' WHERE LOWER(title) LIKE ? AND meal_category='lunch'`, [`%${kw}%`]);
  }
  console.log('✅ Existing recipes categorized.');

  // Step 3: Insert homemade meals
  console.log('\n🌱 Inserting homemade Indian meals...\n');
  let inserted = 0, skipped = 0;
  for (const m of meals) {
    const [title,,,,,,,,,,, category] = [m[0],...m.slice(1)];
    const [exists] = await db.query('SELECT id FROM recipes WHERE title=?', [m[0]]);
    if (exists.length > 0) { console.log(`  ⏭  Duplicate: ${m[0]}`); skipped++; continue; }
    await db.query(
      `INSERT INTO recipes (title,description,ingredients,instructions,calories,protein,carbs,fat,diet_tag,image_url,meal_category) VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
      m
    );
    console.log(`  ✅ [${m[10]}] ${m[0]}`);
    inserted++;
  }

  console.log(`\n🎉 Done! Inserted: ${inserted} | Skipped: ${skipped}\n`);
  process.exit(0);
}

run().catch(e => { console.error(e.message); process.exit(1); });
