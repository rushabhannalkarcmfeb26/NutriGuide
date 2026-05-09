/**
 * seed_indian_meals.js
 * Fetches maximum Indian cuisine recipes from Spoonacular API.
 * Automatically skips meals containing beef, pork and related ingredients.
 * Run with:  node seed_indian_meals.js
 */

require('dotenv').config();
const axios = require('axios');
const db    = require('./config/db');

const API_KEY = '25e727efee874165b5df1eb8a3d157f1';
const BASE_URL = 'https://api.spoonacular.com';

// Ingredients to reject (beef / pork family)
const BANNED_INGREDIENTS = [
    'beef', 'pork', 'bacon', 'ham', 'lard', 'sausage',
    'pepperoni', 'salami', 'prosciutto', 'pancetta',
    'pork belly', 'pork chop', 'pork loin', 'pork ribs',
    'ground pork', 'minced pork', 'brisket', 'ribs',
    'hot dog', 'chorizo'
];

function containsBannedIngredient(recipe) {
    const title = (recipe.title || '').toLowerCase();
    // Check title first
    if (BANNED_INGREDIENTS.some(b => title.includes(b))) return true;

    // Check ingredient names
    const ingredientSources = [
        ...(recipe.nutrition?.ingredients || []),
        ...(recipe.extendedIngredients || []),
        ...(recipe.usedIngredients || []),
        ...(recipe.missedIngredients || []),
    ];
    const names = ingredientSources.map(i =>
        ((i.name || '') + ' ' + (i.originalName || '')).toLowerCase()
    );
    return BANNED_INGREDIENTS.some(b => names.some(n => n.includes(b)));
}

function mapDietTag(diets = []) {
    if (diets.includes('vegan')) return 'vegan';
    if (diets.includes('vegetarian') || diets.includes('lacto ovo vegetarian')) return 'vegetarian';
    return 'non-vegetarian';
}

function getNutrient(nutrients = [], name) {
    const n = nutrients.find(n => n.name.toLowerCase() === name.toLowerCase());
    return n ? Math.round(n.amount) : 0;
}

function stripHtml(str = '') {
    return str.replace(/<[^>]*>/g, '').trim();
}

async function fetchBatch(number, offset) {
    const url = `${BASE_URL}/recipes/complexSearch` +
        `?apiKey=${API_KEY}` +
        `&cuisine=Indian` +
        `&number=${number}` +
        `&offset=${offset}` +
        `&addRecipeNutrition=true` +
        `&addRecipeInformation=true` +
        `&instructionsRequired=true` +
        `&excludeIngredients=beef,pork,bacon,ham,lard,sausage,chorizo,pepperoni`;
    const res = await axios.get(url);
    return { results: res.data.results || [], total: res.data.totalResults || 0 };
}

async function fetchDetails(id) {
    const url = `${BASE_URL}/recipes/${id}/information?apiKey=${API_KEY}&includeNutrition=false`;
    const res = await axios.get(url);
    return res.data;
}

async function seed() {
    console.log('\n🌱 Fetching maximum Indian recipes from Spoonacular (no beef/pork)...\n');

    // First call to find total available
    let { results: firstBatch, total } = await fetchBatch(10, 0);
    console.log(`📊 Spoonacular reports ${total} total Indian recipes available.\n`);

    // Collect all results in batches of 20 (max per Spoonacular call)
    // Free tier: ~150 points/day. Each call of 20 = 1 + 20 = 21 pts → max ~7 calls = 140 results
    const BATCH_SIZE = 20;
    const MAX_RESULTS = 100; // stay safe on free tier
    const totalToFetch = Math.min(total, MAX_RESULTS);

    let allRecipes = [...firstBatch];
    const offsets = [];
    for (let o = 10; o < totalToFetch; o += BATCH_SIZE) offsets.push(o);

    for (const offset of offsets) {
        try {
            const batchCount = Math.min(BATCH_SIZE, totalToFetch - offset);
            console.log(`📥 Fetching ${batchCount} recipes at offset ${offset}...`);
            const { results } = await fetchBatch(batchCount, offset);
            allRecipes = allRecipes.concat(results);
            console.log(`   ✔ Got ${results.length}  |  Running total: ${allRecipes.length}`);
            await new Promise(r => setTimeout(r, 600)); // rate limit
        } catch (err) {
            const msg = err.response?.data?.message || err.message;
            console.error(`   ❌ Batch at offset ${offset} failed: ${msg}`);
            if (msg.toLowerCase().includes('quota') || err.response?.status === 402) {
                console.log('   ⚠️  API quota reached — stopping fetch early.');
                break;
            }
        }
    }

    console.log(`\n📦 Fetched ${allRecipes.length} recipes. Filtering & inserting...\n`);

    let inserted = 0, skippedDupe = 0, skippedBanned = 0, skippedErr = 0;

    for (const recipe of allRecipes) {
        const title = recipe.title || 'Untitled';

        // ── Filter out beef / pork ───────────────────────────────
        if (containsBannedIngredient(recipe)) {
            console.log(`  🚫 Banned ingredients: ${title}`);
            skippedBanned++;
            continue;
        }

        try {
            // ── Skip duplicates ──────────────────────────────────
            const [existing] = await db.query('SELECT id FROM recipes WHERE title = ?', [title]);
            if (existing.length > 0) {
                console.log(`  ⏭  Duplicate: ${title}`);
                skippedDupe++;
                continue;
            }

            // ── Nutrition ────────────────────────────────────────
            const nutrients = recipe.nutrition?.nutrients || [];
            const calories  = getNutrient(nutrients, 'Calories');
            const protein   = getNutrient(nutrients, 'Protein');
            const carbs     = getNutrient(nutrients, 'Carbohydrates');
            const fat       = getNutrient(nutrients, 'Fat');

            // ── Ingredients ──────────────────────────────────────
            const ingredients = [
                ...(recipe.nutrition?.ingredients   || []),
                ...(recipe.extendedIngredients      || []),
            ].map(i => i.name || i.originalName || '').filter(Boolean);

            // ── Instructions ─────────────────────────────────────
            let instructions = stripHtml(recipe.instructions || '');
            if (!instructions) {
                try {
                    const details = await fetchDetails(recipe.id);
                    instructions = stripHtml(details.instructions || '');
                    await new Promise(r => setTimeout(r, 350));
                } catch { /* ignore */ }
            }
            if (!instructions) instructions = 'See recipe source for full instructions.';

            // ── Description ──────────────────────────────────────
            const description = recipe.summary
                ? stripHtml(recipe.summary).slice(0, 255)
                : `A delicious Indian ${mapDietTag(recipe.diets)} recipe.`;

            const diet_tag  = mapDietTag(recipe.diets || []);
            const image_url = recipe.image || null;

            await db.query(
                `INSERT INTO recipes
                 (title, description, ingredients, instructions, calories, protein, carbs, fat, diet_tag, image_url)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [title, description, JSON.stringify(ingredients), instructions,
                 calories, protein, carbs, fat, diet_tag, image_url]
            );

            console.log(`  ✅ Inserted: ${title} (${calories} kcal | ${diet_tag})`);
            inserted++;
            await new Promise(r => setTimeout(r, 200));

        } catch (err) {
            console.error(`  ❌ Error on "${title}": ${err.message}`);
            skippedErr++;
        }
    }

    console.log('\n══════════════════════════════════════');
    console.log(`🎉 Seeding complete!`);
    console.log(`   ✅ Inserted            : ${inserted}`);
    console.log(`   🚫 Banned (beef/pork)  : ${skippedBanned}`);
    console.log(`   ⏭  Duplicates skipped  : ${skippedDupe}`);
    console.log(`   ❌ Errors              : ${skippedErr}`);
    console.log('══════════════════════════════════════\n');
    process.exit(0);
}

seed().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
