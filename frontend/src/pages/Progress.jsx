import React, { useState, useContext, useEffect } from 'react';
import { RotateCcw, Target, Activity, Droplets } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const Progress = () => {
  const { user } = useContext(AuthContext);
  const TODAY = new Date().toISOString().split('T')[0];
  const WATER_KEY = `water_intake_${TODAY}`;

  // Load persisted water for today (returns 0 if new day or no entry)
  const [water, setWater] = useState(() => {
    const saved = localStorage.getItem(WATER_KEY);
    return saved ? parseInt(saved, 10) : 0;
  });
  const [meals, setMeals] = useState([]);
  const [totalCalories, setTotalCalories] = useState(0);
  const [resetting, setResetting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [customVal, setCustomVal] = useState('');

  const fetchProgressData = async () => {
      try {
          const today = new Date().toISOString().split('T')[0];
          const mealRes = await api.get(`/meals/daily?date=${today}`);
          setMeals(mealRes.data.meals);
          setTotalCalories(mealRes.data.totalCalories);
      } catch (error) {
          console.error("Error fetching progress data", error);
      }
  };

  // Persist water to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(WATER_KEY, water);
  }, [water]);

  useEffect(() => {
      fetchProgressData();
  }, []);

  const handleReset = async () => {
    setResetting(true);
    setShowConfirm(false);
    try {
      const today = new Date().toISOString().split('T')[0];
      await api.delete(`/meals/daily?date=${today}`);
      // Also reset water intake
      setWater(0);
      localStorage.setItem(WATER_KEY, 0);
      await fetchProgressData();
    } catch (error) {
      console.error("Error resetting today's meals", error);
      alert("Failed to reset. Please try again.");
    }
    setResetting(false);
  };

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
  const calorieGoal = calculatedCalorieGoal;

  const recommendedProtein = Math.round((calorieGoal * 0.30) / 4);
  const recommendedCarbs = Math.round((calorieGoal * 0.45) / 4);
  const recommendedFats = Math.round((calorieGoal * 0.25) / 9);

  const totalProtein = meals.reduce((sum, meal) => sum + meal.protein, 0);
  const totalCarbs = meals.reduce((sum, meal) => sum + meal.carbs, 0);
  const totalFats = meals.reduce((sum, meal) => sum + meal.fat, 0);
  
  const progressPercent = Math.min((totalCalories / calorieGoal) * 100, 100);

  return (
    <div className="main-content">
      <div className="banner bg-purple" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Progress Tracking</h1>
          <p>Monitor your nutrition &amp; fitness journey</p>
        </div>
        {showConfirm ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.15)', padding: '0.5rem 1rem', borderRadius: '8px' }}>
            <span style={{ color: 'white', fontWeight: '600', fontSize: '0.9rem' }}>Reset today's logs?</span>
            <button onClick={handleReset} disabled={resetting} style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', padding: '0.4rem 1rem', fontWeight: 'bold', cursor: 'pointer' }}>
              {resetting ? 'Resetting...' : 'Yes, Reset'}
            </button>
            <button onClick={() => setShowConfirm(false)} style={{ background: 'white', color: '#a855f7', border: 'none', borderRadius: '6px', padding: '0.4rem 1rem', fontWeight: 'bold', cursor: 'pointer' }}>Cancel</button>
          </div>
        ) : (
          <button
            onClick={() => setShowConfirm(true)}
            className="btn-primary"
            style={{ background: 'white', color: '#a855f7', display: 'flex', alignItems: 'center', gap: '0.5rem', border: 'none' }}
          >
            <RotateCcw size={18} /> Reset Today's Logs
          </button>
        )}
      </div>

      <div className="grid-4">
        <div className="card">
          <div style={{ width: '40px', height: '40px', background: '#dcfce7', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <Target color="#10b981" />
          </div>
          <p style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>CALORIES TODAY</p>
          <h2 style={{ fontSize: '2rem', marginTop: '0.5rem' }}>{totalCalories} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>of {calorieGoal}</span></h2>
        </div>
        <div className="card">
          <div style={{ width: '40px', height: '40px', background: '#dcfce7', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <Activity color="#10b981" />
          </div>
          <p style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>REMAINING</p>
          <h2 style={{ fontSize: '2rem', marginTop: '0.5rem' }}>{Math.max(calorieGoal - totalCalories, 0)} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>calories</span></h2>
        </div>
        <div className="card">
          <div style={{ width: '40px', height: '40px', background: '#eff6ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <Activity color="#3b82f6" />
          </div>
          <p style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>MEALS LOGGED</p>
          <h2 style={{ fontSize: '2rem', marginTop: '0.5rem' }}>{meals.length} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>today</span></h2>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem' }}>Daily Goal Progress</h3>
          <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{Math.round(progressPercent)}%</span>
        </div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Today's Macronutrients</h3>
        <div className="grid-4" style={{ marginBottom: '0' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }}><span>Protein</span><span>{totalProtein}g / {recommendedProtein}g</span></div>
            <div className="progress-container"><div className="progress-bar" style={{ width: `${Math.min((totalProtein/recommendedProtein)*100, 100)}%` }}></div></div>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }}><span>Carbs</span><span>{totalCarbs}g / {recommendedCarbs}g</span></div>
            <div className="progress-container"><div className="progress-bar" style={{ width: `${Math.min((totalCarbs/recommendedCarbs)*100, 100)}%`, background: '#3b82f6' }}></div></div>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }}><span>Fats</span><span>{totalFats}g / {recommendedFats}g</span></div>
            <div className="progress-container"><div className="progress-bar" style={{ width: `${Math.min((totalFats/recommendedFats)*100, 100)}%`, background: '#f59e0b' }}></div></div>
          </div>
        </div>
      </div>

      <div className="water-tracker">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1d4ed8' }}><Droplets /> Water Intake</h3>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1d4ed8' }}>{water}ml</span>
            <div style={{ fontSize: '0.8rem', color: '#3b82f6' }}>of 2000ml</div>
          </div>
        </div>
        <div className="progress-container" style={{ background: '#bfdbfe' }}>
          <div className="progress-bar" style={{ width: `${Math.min((water/2000)*100, 100)}%`, background: '#3b82f6' }}></div>
        </div>
        <div className="water-buttons">
          <button className="water-btn" onClick={() => setWater(w => w + 250)}>+250ml</button>
          <button className="water-btn" onClick={() => setWater(w => w + 500)}>+500ml</button>
          <button className="water-btn" onClick={() => setWater(w => w + 750)}>+750ml</button>
          <button className="water-btn filled" onClick={() => { setShowCustom(true); setCustomVal(''); }}>Custom</button>
        </div>

        {showCustom && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.85rem', flexWrap: 'wrap' }}>
            <input
              type="number"
              min="1"
              max="5000"
              placeholder="Enter ml amount"
              value={customVal}
              onChange={e => setCustomVal(e.target.value)}
              autoFocus
              style={{
                flex: 1, padding: '0.5rem 0.85rem', borderRadius: '8px',
                border: '1.5px solid #3b82f6', outline: 'none',
                fontSize: '0.95rem', color: '#1d4ed8', fontWeight: '600',
                minWidth: '140px',
              }}
              onKeyDown={e => {
                if (e.key === 'Enter' && customVal > 0) {
                  setWater(w => w + Number(customVal));
                  setShowCustom(false);
                }
                if (e.key === 'Escape') setShowCustom(false);
              }}
            />
            <button
              onClick={() => { if (customVal > 0) { setWater(w => w + Number(customVal)); setShowCustom(false); } }}
              style={{ padding: '0.5rem 1.2rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
            >
              Add
            </button>
            <button
              onClick={() => setShowCustom(false)}
              style={{ padding: '0.5rem 1rem', background: 'transparent', color: '#6b7280', border: '1px solid #d1d5db', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress;
