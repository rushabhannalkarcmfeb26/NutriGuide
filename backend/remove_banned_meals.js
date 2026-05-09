require('dotenv').config();
const db = require('./config/db');

async function removeBannedMeals() {
    const terms = [
        'beef', 'pork', 'bacon', 'ham', 'lard', 'sausage',
        'pepperoni', 'salami', 'prosciutto', 'pancetta',
        'brisket', 'chorizo', 'hot dog', 'pork belly',
        'pork chop', 'pork loin', 'minced beef', 'ground beef'
    ];

    const likes = terms.map(t =>
        `LOWER(title) LIKE '%${t}%' OR LOWER(ingredients) LIKE '%${t}%'`
    ).join(' OR ');

    // First show what will be deleted
    const [rows] = await db.query(`SELECT id, title FROM recipes WHERE ${likes}`);
    if (rows.length === 0) {
        console.log('✅ No beef/pork recipes found — database is already clean!');
        process.exit(0);
    }

    console.log(`\n🚫 Found ${rows.length} recipe(s) to remove:\n`);
    rows.forEach(r => console.log(`  ❌  [${r.id}] ${r.title}`));

    const [result] = await db.query(`DELETE FROM recipes WHERE ${likes}`);
    console.log(`\n✅ Deleted ${result.affectedRows} recipe(s) containing beef/pork.\n`);
    process.exit(0);
}

removeBannedMeals().catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
});
