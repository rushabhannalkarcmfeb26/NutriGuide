import React, { useState, useEffect, useContext } from 'react';
import { Search, ChefHat, Plus } from 'lucide-react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Meals = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('recommended');
  const [allMeals, setAllMeals] = useState([]);
  const [recommendedMeals, setRecommendedMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGoalReached, setIsGoalReached] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [mealCategory, setMealCategory] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const [allRes, recRes, dailyRes] = await Promise.all([
          api.get('/recipes'),
          api.get('/recipes/recommendations'),
          api.get(`/meals/daily?date=${today}`)
        ]);

        setAllMeals(allRes.data);

        let calculatedCalorieGoal = 2000;
        if (user?.weight && user?.height && user?.age) {
          const bmr = (10 * user.weight) + (6.25 * user.height) - (5 * user.age) + 5;
          let tdee = bmr * 1.3;
          const isLoseWeight = user.health_goal === 'lose_weight' || (user.target_weight && user.target_weight < user.weight);
          const isGainWeight = user.health_goal === 'gain_muscle' || (user.target_weight && user.target_weight > user.weight);
          if (isLoseWeight) tdee = tdee * 0.70;
          else if (isGainWeight) tdee = tdee * 1.30;
          calculatedCalorieGoal = Math.max(1200, Math.round(tdee));
        }

        if (dailyRes.data.totalCalories >= calculatedCalorieGoal) {
          setRecommendedMeals([]);
          setIsGoalReached(true);
        } else {
          setRecommendedMeals(recRes.data);
          setIsGoalReached(false);
        }
      } catch (error) {
        console.error("Error fetching meals:", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchMeals();
  }, [user]);

  const displayedMeals = (activeTab === 'all' ? allMeals : recommendedMeals).filter(meal => {
    const matchesSearch = meal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meal.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter  = filterCategory === 'all' || meal.diet_tag === filterCategory;
    const matchesMealCat = mealCategory === 'all' || meal.meal_category === mealCategory;
    return matchesSearch && matchesFilter && matchesMealCat;
  });

  const handleLogMeal = async (recipeId) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await api.post('/meals', { recipe_id: recipeId, date: today, meal_type: 'lunch' });
      alert("Meal logged successfully!");
      navigate('/progress');
    } catch (error) {
      console.error("Error logging meal", error);
      alert("Error logging meal");
    }
  };

  // Keyword-to-permanent-Unsplash-photo mapping (these IDs never expire)
  const KEYWORD_IMAGES = [
    { keys: ['biryani'],                    url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=480&h=300&fit=crop' },
    { keys: ['butter chicken','murgh'],     url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=480&h=300&fit=crop' },
    { keys: ['tikka'],                      url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=480&h=300&fit=crop' },
    { keys: ['palak','saag','spinach'],     url: 'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=480&h=300&fit=crop' },
    { keys: ['paneer'],                     url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=480&h=300&fit=crop' },
    { keys: ['dal','lentil','dahl','daal'], url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=480&h=300&fit=crop' },
    { keys: ['roti','naan','paratha','flatbread'], url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=480&h=300&fit=crop' },
    { keys: ['dosa','idli','upma','sambhar','pongal'], url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=480&h=300&fit=crop' },
    { keys: ['chana','chole','chickpea'],   url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=480&h=300&fit=crop' },
    { keys: ['rice','khichdi'],             url: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=480&h=300&fit=crop' },
    { keys: ['chicken'],                    url: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=480&h=300&fit=crop' },
    { keys: ['fish','prawn','crab','mussel','seafood'], url: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=480&h=300&fit=crop' },
    { keys: ['egg'],                        url: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=480&h=300&fit=crop' },
    { keys: ['mutton','lamb','gosht'],      url: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=480&h=300&fit=crop' },
    { keys: ['curry'],                      url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=480&h=300&fit=crop' },
    { keys: ['soup','stew'],                url: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=480&h=300&fit=crop' },
    { keys: ['salad'],                      url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=480&h=300&fit=crop' },
    { keys: ['lassi','chai'],               url: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=480&h=300&fit=crop' },
  ];

  const CATEGORY_FALLBACK = {
    vegan:            'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=480&h=300&fit=crop',
    vegetarian:       'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=480&h=300&fit=crop',
    'non-vegetarian': 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=480&h=300&fit=crop',
  };

  const getImageSrc = (meal) => {
    if (meal.image_url) return meal.image_url;
    const lower = meal.title.toLowerCase();
    const match = KEYWORD_IMAGES.find(e => e.keys.some(k => lower.includes(k)));
    if (match) return match.url;
    return CATEGORY_FALLBACK[meal.diet_tag] || CATEGORY_FALLBACK['non-vegetarian'];
  };

  const dietLabel = { vegan: '🌱 Vegan', vegetarian: '🥦 Vegetarian', 'non-vegetarian': '🍗 Non-Veg' };

  return (
    <div className="main-content">
      <div className="banner bg-green">
        <h1>Meal Database</h1>
        <p>Browse meals &amp; log them instantly</p>
      </div>

      {/* Search & Filter */}
      <div className="card" style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.5rem 1rem' }}>
          <Search size={20} color="var(--text-muted)" style={{ marginRight: '0.5rem' }} />
          <input
            type="text"
            placeholder="Search meals by name or description..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', fontSize: '1rem' }}
          />
        </div>
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="btn-outline"
          style={{ color: 'var(--text-main)', borderColor: 'var(--border-color)', outline: 'none', padding: '0.5rem 1rem', cursor: 'pointer', borderRadius: '8px' }}
        >
          <option value="all">All Diets</option>
          <option value="vegan">Vegan</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="non-vegetarian">Non-Vegetarian</option>
        </select>
      </div>

      {/* Meal Category Pills */}
      <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { key: 'all',       label: '🍽️ All Meals' },
          { key: 'breakfast', label: '🌅 Breakfast' },
          { key: 'lunch',     label: '☀️ Lunch' },
          { key: 'dinner',    label: '🌙 Dinner' },
        ].map(cat => (
          <button
            key={cat.key}
            onClick={() => setMealCategory(cat.key)}
            style={{
              padding: '0.45rem 1.1rem',
              borderRadius: '999px',
              border: '1.5px solid',
              borderColor: mealCategory === cat.key ? 'var(--primary)' : 'var(--border-color)',
              background: mealCategory === cat.key ? 'var(--primary)' : 'white',
              color: mealCategory === cat.key ? 'white' : 'var(--text-muted)',
              fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>


      {/* Tabs */}
      <div style={{ borderBottom: '1px solid var(--border-color)', marginBottom: '2rem', display: 'flex', gap: '2rem' }}>
        <button
          onClick={() => setActiveTab('all')}
          style={{ background: 'none', border: 'none', borderBottom: activeTab === 'all' ? '2px solid var(--primary)' : 'none', padding: '0.5rem 0', fontWeight: 'bold', color: activeTab === 'all' ? 'var(--primary)' : 'var(--text-muted)', cursor: 'pointer' }}
        >
          All Meals ({allMeals.length})
        </button>
        <button
          onClick={() => setActiveTab('recommended')}
          style={{ background: 'none', border: 'none', borderBottom: activeTab === 'recommended' ? '2px solid var(--primary)' : 'none', padding: '0.5rem 0', fontWeight: 'bold', color: activeTab === 'recommended' ? 'var(--primary)' : 'var(--text-muted)', cursor: 'pointer' }}
        >
          Recommended ({recommendedMeals.length})
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading meals...</div>
      ) : activeTab === 'recommended' && isGoalReached ? (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          <ChefHat size={48} style={{ opacity: 0.5, marginBottom: '1rem', color: '#10b981' }} />
          <h2 style={{ color: '#10b981', marginBottom: '0.5rem' }}>Daily Goal Reached! 🎉</h2>
          <p>You have hit your calorie limit. No more meals recommended for today!</p>
        </div>
      ) : displayedMeals.length === 0 ? (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          <ChefHat size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <p>No meals found. Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid-4">
          {displayedMeals.map(meal => (
            <div key={meal.id} className="card" style={{ display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden', borderRadius: '16px' }}>

              {/* Food Image */}
              <div style={{ position: 'relative', width: '100%', height: '165px', overflow: 'hidden', background: '#f1f5f9', flexShrink: 0 }}>
                <img
                  src={getImageSrc(meal)}
                  alt={meal.title}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s ease' }}
                  onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = 'https://source.unsplash.com/400x250/?indian,food,curry';
                  }}
                />
                {/* Diet badge */}
                <span style={{
                  position: 'absolute', top: '10px', right: '10px',
                  background: 'rgba(0,0,0,0.6)', color: 'white',
                  fontSize: '0.68rem', fontWeight: '700',
                  padding: '0.2rem 0.55rem', borderRadius: '20px',
                  backdropFilter: 'blur(4px)',
                }}>
                  {dietLabel[meal.diet_tag] || meal.diet_tag}
                </span>
              </div>

              {/* Card Body */}
              <div style={{ padding: '1rem 1.1rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <h3 style={{ fontSize: '0.98rem', fontWeight: '700', marginBottom: '0.3rem', color: 'var(--text-main)', lineHeight: 1.35 }}>
                  {meal.title}
                </h3>
                <p style={{
                  color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '0.9rem', flexGrow: 1,
                  lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical', overflow: 'hidden'
                }}>
                  {meal.description}
                </p>

                {/* Nutrition grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginBottom: '0.85rem', fontSize: '0.78rem', fontWeight: '600' }}>
                  <div style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>🔥 {meal.calories} kcal</div>
                  <div style={{ color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>💪 {meal.protein}g prot</div>
                  <div style={{ color: '#8b5cf6', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>🌾 {meal.carbs}g carb</div>
                  <div style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>🧈 {meal.fat}g fat</div>
                </div>

                <button
                  onClick={() => handleLogMeal(meal.id)}
                  className="btn-outline"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', fontSize: '0.85rem' }}
                >
                  <Plus size={15} /> Log Meal
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Meals;
