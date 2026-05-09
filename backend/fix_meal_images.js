require('dotenv').config();
const axios = require('axios');
const db = require('./config/db');

// Title → specific correct image
const TITLE_MAP = {
  'chicken tikka masala': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=480&h=300&fit=crop',
  'easy chicken tikka masala': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=480&h=300&fit=crop',
  'butter chicken': 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=480&h=300&fit=crop',
  'butter chicken (murgh makhani)': 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=480&h=300&fit=crop',
  'murgh makhani': 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=480&h=300&fit=crop',
  'tandoori chicken': 'https://www.themealdb.com/images/media/meals/qptpvt1487339580.jpg',
  'chicken biryani': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=480&h=300&fit=crop',
  'chicken biryani (hyderabadi)': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=480&h=300&fit=crop',
  'hyderabadi chicken curry': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=480&h=300&fit=crop',
  'mutton biryani': 'https://images.unsplash.com/photo-1630851840633-f96999247032?w=480&h=300&fit=crop',
  'palak paneer': 'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=480&h=300&fit=crop',
  'luscious palak paneer': 'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=480&h=300&fit=crop',
  'paneer butter masala': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=480&h=300&fit=crop',
  'paneer tikka': 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=480&h=300&fit=crop',
  'paneer jalfrezi': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=480&h=300&fit=crop',
  'kadai paneer': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=480&h=300&fit=crop',
  'shahi paneer': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=480&h=300&fit=crop',
  'paneer bhurji': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=480&h=300&fit=crop',
  'matar paneer': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=480&h=300&fit=crop',
  'malai kofta': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=480&h=300&fit=crop',
  'dal makhani': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=480&h=300&fit=crop',
  'dal tadka': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=480&h=300&fit=crop',
  'indian lentil dahl': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=480&h=300&fit=crop',
  'ethiopian lentil curry': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=480&h=300&fit=crop',
  'thai coconut curry lentil soup': 'https://images.unsplash.com/photo-1547592180-85f173990554?w=480&h=300&fit=crop',
  'aloo paratha': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=480&h=300&fit=crop',
  'fenugreek roti': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=480&h=300&fit=crop',
  'mint, fennel and garlic naan': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=480&h=300&fit=crop',
  'rajma chawal': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=480&h=300&fit=crop',
  'chole masala': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=480&h=300&fit=crop',
  'vegan chana masala curry': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=480&h=300&fit=crop',
  'channa-chickpea, potato & cauliflower curry': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=480&h=300&fit=crop',
  'baked indian spice chickpea': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=480&h=300&fit=crop',
  'egg curry': 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=480&h=300&fit=crop',
  'boiled egg curry': 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=480&h=300&fit=crop',
  'egg bhurji': 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=480&h=300&fit=crop',
  'masala dosa': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=480&h=300&fit=crop',
  'rava dosa': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=480&h=300&fit=crop',
  'idli sambar': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=480&h=300&fit=crop',
  'upma': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=480&h=300&fit=crop',
  'pongal (venn pongal)': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=480&h=300&fit=crop',
  'fish curry (kerala style)': 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=480&h=300&fit=crop',
  'goan fish curry': 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=480&h=300&fit=crop',
  'assam fish curry': 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=480&h=300&fit=crop',
  'prawn masala': 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=480&h=300&fit=crop',
  'amritsari fish fry': 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=480&h=300&fit=crop',
  'mutton rogan josh': 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=480&h=300&fit=crop',
  'kashmiri rogan josh': 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=480&h=300&fit=crop',
  'lamb chops masala': 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=480&h=300&fit=crop',
  'masala lamb chops': 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=480&h=300&fit=crop',
  'couscous biryani': 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=480&h=300&fit=crop',
  'roasted acorn squash stuffed with spicy biryani (veg/vegan)': 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=480&h=300&fit=crop',
  'vegetable biryani': 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=480&h=300&fit=crop',
  'strawberry and banana lassi': 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=480&h=300&fit=crop',
  'spicy black-eyed pea curry with swiss chard and roasted eggplant': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=480&h=300&fit=crop',
  'gujarati dry mung bean curry': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=480&h=300&fit=crop',
  'indian-style dill and turmeric potato salad': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=480&h=300&fit=crop',
  'indian-style pumpkin side dish': 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=480&h=300&fit=crop',
  'eggplant curry': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=480&h=300&fit=crop',
  'baingan bharta': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=480&h=300&fit=crop',
  'chickpea and pumpkin curry': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=480&h=300&fit=crop',
  'coconut vegetable curry over quinoa': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=480&h=300&fit=crop',
  'spicy coconut curry with peppers, pak choi and tomatoes': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=480&h=300&fit=crop',
  'red curry stew & vegetable noodles': 'https://images.unsplash.com/photo-1547592180-85f173990554?w=480&h=300&fit=crop',
  'halibut with coconut and green curry': 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=480&h=300&fit=crop',
  'cashew butter chicken': 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=480&h=300&fit=crop',
  'pachai payaru kulambu (green moong dal curry)': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=480&h=300&fit=crop',
  'fish fillet in creamy coconut curry': 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=480&h=300&fit=crop',
  'thai basil chicken with green curry': 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=480&h=300&fit=crop',
  'thai coconut curry soup': 'https://images.unsplash.com/photo-1547592180-85f173990554?w=480&h=300&fit=crop',
  'indian-inspired lentil soup': 'https://images.unsplash.com/photo-1547592180-85f173990554?w=480&h=300&fit=crop',
  'curry chicken salad': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=480&h=300&fit=crop',
  'chai pani\'s malabar chicken curry': 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=480&h=300&fit=crop',
  'authentic jamaican curry chicken': 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=480&h=300&fit=crop',
  'chicken tikka masala indian': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=480&h=300&fit=crop',
  'rice and peas with coconut curry mackerel': 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=480&h=300&fit=crop',
  'slow cooker lamb curry': 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=480&h=300&fit=crop',
};

// Diverse pool — used round-robin so no two consecutive dishes look the same
const IMAGE_POOL = [
  'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=480&h=300&fit=crop',
  'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=480&h=300&fit=crop',
  'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=480&h=300&fit=crop',
  'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=480&h=300&fit=crop',
  'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=480&h=300&fit=crop',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=480&h=300&fit=crop',
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=480&h=300&fit=crop',
  'https://images.unsplash.com/photo-1547592180-85f173990554?w=480&h=300&fit=crop',
  'https://images.unsplash.com/photo-1574484284002-952d92456975?w=480&h=300&fit=crop',
  'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=480&h=300&fit=crop',
  'https://images.unsplash.com/photo-1559847844-5315695dadae?w=480&h=300&fit=crop',
  'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=480&h=300&fit=crop',
  'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=480&h=300&fit=crop',
  'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=480&h=300&fit=crop',
  'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=480&h=300&fit=crop',
  'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=480&h=300&fit=crop',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=480&h=300&fit=crop',
  'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=480&h=300&fit=crop',
  'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=480&h=300&fit=crop',
  'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=480&h=300&fit=crop',
];

async function run() {
  const [rows] = await db.query('SELECT id, title, diet_tag FROM recipes ORDER BY id');
  console.log(`\n🔧 Fixing images for ${rows.length} recipes...\n`);

  let poolIdx = 0;
  for (const r of rows) {
    const key = r.title.toLowerCase().trim();
    let url = TITLE_MAP[key];

    if (!url) {
      // Try TheMealDB
      try {
        const q = r.title.split(' ').slice(0, 3).join(' ');
        const res = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(q)}`, { timeout: 4000 });
        const meals = res.data?.meals;
        if (meals?.[0]?.strMealThumb) url = meals[0].strMealThumb;
        await new Promise(res => setTimeout(res, 150));
      } catch { /* skip */ }
    }

    // Rotating pool fallback — guarantees no consecutive duplicates
    if (!url) {
      url = IMAGE_POOL[poolIdx % IMAGE_POOL.length];
      poolIdx++;
    }

    await db.query('UPDATE recipes SET image_url = ? WHERE id = ?', [url, r.id]);
    console.log(`  ✅ [${r.id}] ${r.title}`);
  }

  console.log('\n🎉 All meal images fixed!\n');
  process.exit(0);
}

run().catch(e => { console.error(e.message); process.exit(1); });
