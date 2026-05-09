const axios = require('axios');
const db = require('./config/db');

const API_KEY = '25e727efee874165b5df1eb8a3d157f1';
const BASE_URL = 'https://api.spoonacular.com';

// Map Spoonacular diet tags to our schema
function mapDietTag(diets) {
    if (!diets || diets.length === 0) return 'non-vegetarian';
    if (diets.includes('vegan')) return 'vegan';
    if (diets.includes('vegetarian') || diets.includes('lacto ovo vegetarian')) return 'vegetarian';
    if (diets.includes('ketogenic')) return 'non-vegetarian';
    return 'non-vegetarian'; // default for non-veg / other
}

// Fetch recipes by category
async function fetchRecipes(diet, number = 10) {
    const dietParam = diet === 'keto' ? '' : `&diet=${diet}`;
    const url = `${BASE_URL}/recipes/complexSearch?apiKey=${API_KEY}&number=${number}${dietParam}&addRecipeNutrition=true&addRecipeInformation=true`;
    const response = await axios.get(url);
    return response.data.results || [];
}

// Fetch full recipe details (ingredients + instructions)
async function fetchRecipeDetails(id) {
    const url = `${BASE_URL}/recipes/${id}/information?apiKey=${API_KEY}&includeNutrition=false`;
    const response = await axios.get(url);
    return response.data;
}

// Extract a nutrient value by name
function getNutrient(nutrients, name) {
    const n = nutrients.find(n => n.name.toLowerCase() === name.toLowerCase());
    return n ? Math.round(n.amount) : 0;
}

async function seed() {
    console.log('🌱 Starting Spoonacular recipe seeding...\n');

    const categories = [
        { label: 'vegan',       diet: 'vegan',        count: 8 },
        { label: 'vegetarian',  diet: 'vegetarian',   count: 8 },
        { label: 'non-vegetarian', diet: 'non-vegetarian', count: 8 },
    ];

    let totalInserted = 0;

    for (const cat of categories) {
        console.log(`📥 Fetching ${cat.count} ${cat.label} recipes...`);
        let recipes;
        try {
            recipes = await fetchRecipes(cat.diet, cat.count);
        } catch (err) {
            console.error(`  ❌ Failed to fetch ${cat.label} recipes:`, err.message);
            continue;
        }

        for (const recipe of recipes) {
            try {
                // Get nutrition
                const nutrients = recipe.nutrition?.nutrients || [];
                const calories = getNutrient(nutrients, 'Calories');
                const protein  = getNutrient(nutrients, 'Protein');
                const carbs    = getNutrient(nutrients, 'Carbohydrates');
                const fat      = getNutrient(nutrients, 'Fat');

                // Ingredients list
                const ingredients = (recipe.nutrition?.ingredients || []).map(i => i.name);

                // Instructions - fetch full details if not included
                let instructions = recipe.instructions || '';
                if (!instructions) {
                    try {
                        const details = await fetchRecipeDetails(recipe.id);
                        instructions = details.instructions || 'See recipe source for instructions.';
                    } catch {
                        instructions = 'See recipe source for instructions.';
                    }
                }
                // Strip HTML tags from instructions
                instructions = instructions.replace(/<[^>]*>/g, '').trim() || 'See recipe source for instructions.';

                const title       = recipe.title || 'Untitled';
                const description = recipe.summary
                    ? recipe.summary.replace(/<[^>]*>/g, '').slice(0, 255)
                    : `A delicious ${cat.label} meal.`;
                const image_url   = recipe.image || null;
                const diet_tag    = mapDietTag(recipe.diets);

                await db.query(
                    `INSERT INTO recipes (title, description, ingredients, instructions, calories, protein, carbs, fat, diet_tag, image_url)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [title, description, JSON.stringify(ingredients), instructions, calories, protein, carbs, fat, diet_tag, image_url]
                );

                console.log(`  ✅ Inserted: ${title} (${calories} kcal, ${diet_tag})`);
                totalInserted++;

                // Respect rate limit (1 req/sec on free tier)
                await new Promise(r => setTimeout(r, 250));
            } catch (err) {
                console.error(`  ⚠️  Skipped "${recipe.title}":`, err.message);
            }
        }
    }

    console.log(`\n✅ Done! ${totalInserted} Spoonacular recipes inserted into the database.`);
    process.exit(0);
}

seed().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
