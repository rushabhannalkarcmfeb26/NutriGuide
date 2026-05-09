/**
 * dedup_and_add_meals.js
 * 1. Removes duplicate recipes (keeps the one with the best image/most data)
 * 2. Inserts new unique Indian home meals with correct specific images
 * Run: node dedup_and_add_meals.js
 */
require('dotenv').config();
const db = require('./config/db');

// ── NEW UNIQUE MEALS ─────────────────────────────────────────────────────────
// [title, desc, ingredients(JSON), instructions, cal, protein, carbs, fat, diet_tag, image_url, meal_category]
const NEW_MEALS = [
  // ── BREAKFAST ──
  ['Masala Oats', 'Savory oats cooked with onion, tomato and Indian spices — healthy 10-min breakfast.',
   '["rolled oats","onion","tomato","green chili","mustard seeds","curry leaves","turmeric","oil","salt","coriander"]',
   'Temper mustard seeds and curry leaves. Sauté onion, tomato and chili. Add oats and water. Cook 5 min until thick. Garnish with coriander.',
   210, 8, 34, 5, 'vegan', 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=480&h=300&fit=crop', 'breakfast'],

  ['Rava Idli', 'Instant semolina idli — no fermentation needed, ready in 30 min.',
   '["semolina","yogurt","baking soda","carrot","cashews","mustard seeds","curry leaves","ghee","ginger","green chili"]',
   'Mix semolina with yogurt and water. Add vegetables and temper. Rest 10 min. Pour in greased moulds. Steam 12 min.',
   180, 5, 30, 4, 'vegetarian', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=480&h=300&fit=crop', 'breakfast'],

  ['Pesarattu (Green Moong Dosa)', 'Andhra crispy green moong crepes with ginger and onion — high protein.',
   '["green moong dal","ginger","green chili","onion","cumin","coriander leaves","oil"]',
   'Soak moong 6 hrs. Grind with ginger and chili to smooth batter. Spread thin on hot tawa. Top with onion. Cook until crispy.',
   220, 14, 32, 4, 'vegan', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=480&h=300&fit=crop', 'breakfast'],

  ['Methi Paratha', 'Whole wheat flatbread stuffed with fresh fenugreek leaves and spices.',
   '["whole wheat flour","fresh fenugreek leaves","ginger","green chili","ajwain","turmeric","oil","yogurt"]',
   'Knead wheat dough with chopped methi and spices. Rest 20 min. Roll into parathas. Cook on tawa with oil until golden.',
   270, 8, 40, 8, 'vegetarian', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=480&h=300&fit=crop', 'breakfast'],

  ['Poha Cutlet', 'Crispy potato and poha patties — great with tea, quick to prepare.',
   '["flattened rice","potato","onion","green chili","cumin","garam masala","breadcrumbs","oil","coriander"]',
   'Soak poha, mix with mashed potato and spices. Shape into cutlets. Coat with breadcrumbs. Shallow fry until crispy.',
   240, 6, 36, 8, 'vegan', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=480&h=300&fit=crop', 'breakfast'],

  ['Egg Bhurji (Spicy Scrambled Eggs)', 'Street-style spicy Indian scrambled eggs with onion, tomato and masala.',
   '["eggs","onion","tomato","green chili","ginger","turmeric","red chili powder","cumin","butter","coriander"]',
   'Heat butter, sauté cumin, onion and green chili. Add tomato and spices. Beat and add eggs. Scramble on medium heat. Garnish coriander.',
   280, 16, 8, 18, 'non-vegetarian', 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=480&h=300&fit=crop', 'breakfast'],

  // ── LUNCH ──
  ['Sambar Rice', 'One-pot Tamil Nadu comfort food — rice cooked in tangy vegetable sambar.',
   '["rice","toor dal","drumstick","eggplant","tomato","tamarind","sambar powder","mustard seeds","curry leaves","oil"]',
   'Cook rice. Make sambar with dal, tamarind and vegetables. Mix rice with sambar. Temper mustard seeds and curry leaves on top.',
   370, 12, 60, 8, 'vegan', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=480&h=300&fit=crop', 'lunch'],

  ['Aloo Sabzi with Poori', 'Spiced potato curry served with deep-fried wheat bread — weekend favourite.',
   '["potato","whole wheat flour","cumin","fennel seeds","coriander","tomato","amchur","oil","turmeric"]',
   'Make stiff dough for poori, rest 20 min. Make spiced potato sabzi with whole spices. Deep fry pooris until golden. Serve together.',
   480, 9, 66, 20, 'vegan', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=480&h=300&fit=crop', 'lunch'],

  ['Lemon Rice', 'South Indian tangy lemon-tempered rice with peanuts and curry leaves — ready in 15 min.',
   '["cooked rice","lemon juice","peanuts","mustard seeds","chana dal","curry leaves","dry red chili","turmeric","oil"]',
   'Cook rice and cool. Heat oil, add mustard seeds, dal, chili and curry leaves. Add turmeric and rice. Toss. Squeeze lemon and mix peanuts.',
   320, 7, 54, 8, 'vegan', 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=480&h=300&fit=crop', 'lunch'],

  ['Chana Saag', 'Chickpeas simmered in spiced spinach gravy — iron-rich power lunch.',
   '["chickpeas","spinach","onion","tomato","garlic","ginger","cumin","coriander","turmeric","garam masala","oil"]',
   'Boil chickpeas. Blanch and puree spinach. Make onion-tomato masala. Add spinach puree and chickpeas. Simmer 10 min.',
   310, 14, 44, 8, 'vegan', 'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=480&h=300&fit=crop', 'lunch'],

  ['Tawa Chicken', 'Flat-pan spiced chicken pieces with onion and capsicum — dhaba style.',
   '["chicken","onion","capsicum","tomato","ginger","garlic","kashmiri chili","cumin","garam masala","butter"]',
   'Marinate chicken with spices. Cook on hot tawa with butter. Add onion and capsicum. Bhuno until chicken is cooked and slightly charred.',
   370, 34, 10, 22, 'non-vegetarian', 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=480&h=300&fit=crop', 'lunch'],

  ['Bhindi Masala (Okra Stir Fry)', 'Crispy okra stir-fried with onion, tomato and spices — goes with any roti.',
   '["okra","onion","tomato","garlic","cumin","coriander","turmeric","amchur","red chili","oil"]',
   'Slice okra and dry thoroughly. Fry until crispy. Remove. Sauté onion-tomato masala. Add fried okra and toss on high heat.',
   180, 4, 22, 8, 'vegan', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=480&h=300&fit=crop', 'lunch'],

  ['Pav Bhaji', 'Mumbai street food — spiced mashed vegetables with buttery bread rolls.',
   '["mixed vegetables","pav (bread rolls)","butter","onion","tomato","pav bhaji masala","capsicum","potato","lemon","coriander"]',
   'Boil and mash vegetables. Cook with pav bhaji masala and butter until thick. Toast pav with butter. Serve bhaji with pav, onion and lemon.',
   440, 10, 64, 16, 'vegetarian', 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=480&h=300&fit=crop', 'lunch'],

  ['Moong Dal Tadka', 'Simple yellow moong dal with a crispy garlic-ghee tempering — light and nutritious.',
   '["yellow moong dal","garlic","ghee","cumin","dry red chili","turmeric","onion","tomato","coriander","lemon"]',
   'Pressure cook moong dal with turmeric. Make golden garlic tadka in ghee with cumin and dry chili. Pour over dal. Squeeze lemon.',
   250, 14, 36, 6, 'vegetarian', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=480&h=300&fit=crop', 'lunch'],

  // ── DINNER ──
  ['Chicken Saag', 'Tender chicken pieces in a thick, spiced spinach gravy — healthy and rich.',
   '["chicken","spinach","onion","tomato","garlic","ginger","cream","garam masala","cumin","oil"]',
   'Blanch spinach and blend. Fry chicken pieces until sealed. Make onion-tomato masala. Add spinach puree and chicken. Simmer with cream.',
   360, 36, 10, 20, 'non-vegetarian', 'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=480&h=300&fit=crop', 'dinner'],

  ['Paneer Tikka Masala', 'Chargrilled paneer cubes in a rich, smoky tomato-cream sauce.',
   '["paneer","yogurt","tomato","onion","cream","kashmiri chili","garam masala","kasuri methi","butter","cardamom"]',
   'Marinate paneer in yogurt and spices. Grill until charred. Make smooth tomato-butter sauce. Add cream and kasuri methi. Simmer grilled paneer.',
   410, 17, 15, 30, 'vegetarian', 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=480&h=300&fit=crop', 'dinner'],

  ['Mutton Keema Matar', 'Minced mutton with green peas in a richly spiced dry curry.',
   '["minced mutton","green peas","onion","tomato","garlic","ginger","whole spices","garam masala","oil","coriander"]',
   'Brown onions. Add ginger-garlic paste. Add minced mutton and bhuno until dry. Add tomatoes, spices and peas. Cook until oil separates.',
   430, 36, 16, 26, 'non-vegetarian', 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=480&h=300&fit=crop', 'dinner'],

  ['Aloo Matar', 'Simple potato and peas curry in a light tomato gravy — everyday dinner.',
   '["potato","green peas","onion","tomato","ginger","cumin","turmeric","coriander","garam masala","oil"]',
   'Fry onion until golden. Add ginger and tomato masala. Add potatoes and peas. Cook covered until potatoes are tender.',
   260, 7, 40, 8, 'vegan', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=480&h=300&fit=crop', 'dinner'],

  ['Dal Palak (Spinach Lentil)', 'Yellow dal cooked with spinach — nutritious one-pot dinner.',
   '["toor dal","spinach","onion","tomato","garlic","cumin","turmeric","dry red chili","ghee","lemon"]',
   'Pressure cook dal. Add chopped spinach in last whistle. Make tadka with ghee, cumin, garlic and red chili. Mix and serve.',
   270, 14, 38, 7, 'vegan', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=480&h=300&fit=crop', 'dinner'],

  ['Vegetable Pulao', 'Aromatic basmati rice with mixed vegetables and whole spices — simple one-pot dinner.',
   '["basmati rice","mixed vegetables","onion","whole spices","ghee","bay leaf","mint","cumin","water"]',
   'Heat ghee, fry whole spices. Add onion and vegetables. Add soaked rice. Pour water 1:1.5 ratio. Cover and cook on low heat.',
   340, 7, 60, 8, 'vegan', 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=480&h=300&fit=crop', 'dinner'],

  ['Chicken Vindaloo (Mild Home Version)', 'Goan-inspired spiced chicken in a tangy vinegar-based gravy.',
   '["chicken","onion","garlic","ginger","red chili","vinegar","cumin","mustard seeds","tomato","coconut oil"]',
   'Make paste with chili, garlic, ginger, vinegar and spices. Marinate chicken. Cook onion until dark. Add chicken and paste. Simmer until thick.',
   390, 34, 12, 24, 'non-vegetarian', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=480&h=300&fit=crop', 'dinner'],

  ['Lauki Chana Dal (Bottle Gourd Lentil)', 'Light and digestive gourd cooked with split chickpea lentil.',
   '["bottle gourd","chana dal","onion","tomato","garlic","turmeric","cumin","ghee","coriander","garam masala"]',
   'Soak chana dal 1 hour. Pressure cook with bottle gourd and turmeric. Make light onion-tomato tadka. Combine and simmer.',
   240, 12, 36, 6, 'vegan', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=480&h=300&fit=crop', 'dinner'],
];

async function run() {
  // ── STEP 1: Remove duplicates ──────────────────────────────────────────────
  console.log('\n🔍 Finding duplicate recipe titles...\n');
  const [dupes] = await db.query(`
    SELECT MIN(title) as title, COUNT(*) as cnt, GROUP_CONCAT(id ORDER BY id ASC) as ids
    FROM recipes
    GROUP BY LOWER(TRIM(title))
    HAVING cnt > 1
  `);

  if (dupes.length === 0) {
    console.log('✅ No duplicates found.');
  } else {
    for (const row of dupes) {
      const ids = row.ids.split(',').map(Number);
      // Keep the first id (lowest), delete the rest
      const toDelete = ids.slice(1);
      await db.query(`DELETE FROM recipes WHERE id IN (${toDelete.join(',')})`);
      console.log(`  🗑  "${row.title}" — kept id ${ids[0]}, deleted: ${toDelete.join(', ')}`);
    }
    console.log(`\n✅ Removed ${dupes.length} duplicate groups.`);
  }

  // ── STEP 2: Insert new meals ───────────────────────────────────────────────
  console.log('\n🌱 Inserting new Indian home meals...\n');
  let inserted = 0, skipped = 0;
  for (const m of NEW_MEALS) {
    const [exists] = await db.query('SELECT id FROM recipes WHERE LOWER(TRIM(title))=LOWER(TRIM(?))', [m[0]]);
    if (exists.length > 0) { console.log(`  ⏭  Exists: ${m[0]}`); skipped++; continue; }
    await db.query(
      `INSERT INTO recipes (title,description,ingredients,instructions,calories,protein,carbs,fat,diet_tag,image_url,meal_category) VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
      m
    );
    console.log(`  ✅ [${m[10]}] ${m[0]}`);
    inserted++;
  }

  console.log(`\n🎉 Done!  Inserted: ${inserted} | Skipped: ${skipped}\n`);
  process.exit(0);
}

run().catch(e => { console.error(e.message); process.exit(1); });
