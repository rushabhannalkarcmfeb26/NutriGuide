/**
 * update_meal_images.js
 * Fetches image URLs from TheMealDB (free, no API key) for recipes
 * that have null image_url, and updates the database.
 * Run with:  node update_meal_images.js
 */

require('dotenv').config();
const axios = require('axios');
const db    = require('./config/db');

const MEALDB = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

// Curated fallback images (permanent Unsplash photo IDs) by diet category
const CATEGORY_FALLBACKS = {
    vegan:           'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=480&h=300&fit=crop',
    vegetarian:      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=480&h=300&fit=crop',
    'non-vegetarian':'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=480&h=300&fit=crop',
};

// Keyword-to-Unsplash permanent photo mapping for common Indian dishes
const KEYWORD_MAP = [
    { keywords: ['biryani'],           url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=480&h=300&fit=crop' },
    { keywords: ['butter chicken','murgh makhani'], url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=480&h=300&fit=crop' },
    { keywords: ['tikka masala','tikka'], url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=480&h=300&fit=crop' },
    { keywords: ['palak','saag','spinach'], url: 'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=480&h=300&fit=crop' },
    { keywords: ['paneer'],            url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=480&h=300&fit=crop' },
    { keywords: ['dal','lentil','daal'], url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=480&h=300&fit=crop' },
    { keywords: ['curry'],             url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=480&h=300&fit=crop' },
    { keywords: ['roti','naan','flatbread','paratha'], url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=480&h=300&fit=crop' },
    { keywords: ['samosa','aloo tikki','chaat'], url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=480&h=300&fit=crop' },
    { keywords: ['rice','pongal','khichdi'],  url: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=480&h=300&fit=crop' },
    { keywords: ['chicken'],           url: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=480&h=300&fit=crop' },
    { keywords: ['fish','prawn','seafood','crab','mussel'], url: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=480&h=300&fit=crop' },
    { keywords: ['egg','bhurji'],      url: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=480&h=300&fit=crop' },
    { keywords: ['mutton','lamb','gosht'], url: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=480&h=300&fit=crop' },
    { keywords: ['soup','stew'],       url: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=480&h=300&fit=crop' },
    { keywords: ['oats','porridge'],   url: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=480&h=300&fit=crop' },
    { keywords: ['salad'],             url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=480&h=300&fit=crop' },
    { keywords: ['chana','chickpea','chole'], url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=480&h=300&fit=crop' },
    { keywords: ['dosa','idli','upma','sambhar'], url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=480&h=300&fit=crop' },
    { keywords: ['lassi','chai','beverage'], url: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=480&h=300&fit=crop' },
];

function getKeywordFallback(title) {
    const lower = title.toLowerCase();
    for (const entry of KEYWORD_MAP) {
        if (entry.keywords.some(k => lower.includes(k))) return entry.url;
    }
    return null;
}

async function searchMealDB(title) {
    // Try first 2-3 words of the title for best match
    const query = title.split(' ').slice(0, 3).join(' ');
    try {
        const res = await axios.get(MEALDB + encodeURIComponent(query), { timeout: 5000 });
        const meals = res.data?.meals;
        if (meals && meals.length > 0) return meals[0].strMealThumb || null;
    } catch { /* ignore */ }
    return null;
}

async function run() {
    console.log('\n🔍 Finding recipes with missing images...\n');

    const [rows] = await db.query(
        'SELECT id, title, diet_tag FROM recipes WHERE image_url IS NULL OR image_url = ""'
    );
    console.log(`Found ${rows.length} recipes without images.\n`);

    if (rows.length === 0) {
        console.log('✅ All recipes already have images!');
        process.exit(0);
    }

    let updated = 0, fromMealDB = 0, fromKeyword = 0, fromCategory = 0;

    for (const recipe of rows) {
        let imageUrl = null;

        // 1) Try TheMealDB search
        imageUrl = await searchMealDB(recipe.title);
        if (imageUrl) {
            fromMealDB++;
            console.log(`  🌐 TheMealDB  → ${recipe.title}`);
        }

        // 2) Fallback: keyword map
        if (!imageUrl) {
            imageUrl = getKeywordFallback(recipe.title);
            if (imageUrl) {
                fromKeyword++;
                console.log(`  🔑 Keyword    → ${recipe.title}`);
            }
        }

        // 3) Fallback: diet category
        if (!imageUrl) {
            imageUrl = CATEGORY_FALLBACKS[recipe.diet_tag] || CATEGORY_FALLBACKS['non-vegetarian'];
            fromCategory++;
            console.log(`  📂 Category   → ${recipe.title}`);
        }

        await db.query('UPDATE recipes SET image_url = ? WHERE id = ?', [imageUrl, recipe.id]);
        updated++;

        // Small delay to respect TheMealDB rate limits
        await new Promise(r => setTimeout(r, 200));
    }

    console.log('\n══════════════════════════════════');
    console.log(`✅ Updated ${updated} recipes`);
    console.log(`   🌐 From TheMealDB  : ${fromMealDB}`);
    console.log(`   🔑 From keyword map: ${fromKeyword}`);
    console.log(`   📂 From category   : ${fromCategory}`);
    console.log('══════════════════════════════════\n');
    process.exit(0);
}

run().catch(err => {
    console.error('Fatal error:', err.message);
    process.exit(1);
});
