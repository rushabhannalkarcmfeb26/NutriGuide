import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Target, Activity, Apple, Award, RotateCcw } from 'lucide-react';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [meals, setMeals] = useState([]);
    const [totalCalories, setTotalCalories] = useState(0);
    const [resetting, setResetting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const fetchDashboardData = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const mealRes = await api.get(`/meals/daily?date=${today}`);
            setMeals(mealRes.data.meals);
            setTotalCalories(mealRes.data.totalCalories);
        } catch (error) {
            console.error("Error fetching dashboard data", error);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleReset = async () => {
        setResetting(true);
        setShowConfirm(false);
        try {
            const today = new Date().toISOString().split('T')[0];
            await api.delete(`/meals/daily?date=${today}`);
            await fetchDashboardData();
        } catch (error) {
            console.error("Error resetting today's meals", error);
            alert("Failed to reset. Please try again.");
        }
        setResetting(false);
    };

    // ── Calorie Goal (Mifflin-St Jeor + TDEE) ──────────────────
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
    const progressPercent = Math.min((totalCalories / calorieGoal) * 100, 100);

    // ── BMI ──────────────────────────────────────────────────────
    let bmi = '--';
    if (user?.weight && user?.height) {
        const heightM = user.height / 100;
        bmi = (user.weight / (heightM * heightM)).toFixed(1);
    }

    // ── BMI-based Macro Ratios ───────────────────────────────────
    let bmiCategory = 'normal';
    let bmiLabel    = 'Normal Weight';
    let proteinRatio = 0.30;
    let carbsRatio   = 0.45;
    let fatRatio     = 0.25;

    if (user?.weight && user?.height) {
        const bmiVal = parseFloat(bmi);
        if (bmiVal < 18.5) {
            bmiCategory  = 'underweight';
            bmiLabel     = 'Underweight';
            // More carbs & protein to gain healthy weight
            proteinRatio = 0.30;
            carbsRatio   = 0.50;
            fatRatio     = 0.20;
        } else if (bmiVal < 25) {
            bmiCategory  = 'normal';
            bmiLabel     = 'Normal Weight';
            // Balanced macros
            proteinRatio = 0.30;
            carbsRatio   = 0.45;
            fatRatio     = 0.25;
        } else if (bmiVal < 30) {
            bmiCategory  = 'overweight';
            bmiLabel     = 'Overweight';
            // Higher protein, fewer carbs to aid fat loss
            proteinRatio = 0.35;
            carbsRatio   = 0.35;
            fatRatio     = 0.30;
        } else {
            bmiCategory  = 'obese';
            bmiLabel     = 'High BMI';
            // High protein, low carbs for weight management
            proteinRatio = 0.40;
            carbsRatio   = 0.30;
            fatRatio     = 0.30;
        }
    }

    const recommendedProtein = Math.round((calorieGoal * proteinRatio) / 4);
    const recommendedCarbs   = Math.round((calorieGoal * carbsRatio)   / 4);
    const recommendedFats    = Math.round((calorieGoal * fatRatio)     / 9);

    const bmiCategoryColors = {
        underweight: { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
        normal:      { bg: '#ecfdf5', text: '#065f46', border: '#a7f3d0' },
        overweight:  { bg: '#fffbeb', text: '#92400e', border: '#fde68a' },
        obese:       { bg: '#fef2f2', text: '#991b1b', border: '#fecaca' },
    };
    const bmiColors = bmiCategoryColors[bmiCategory];

    const totalProtein = meals.reduce((sum, meal) => sum + meal.protein, 0);
    const totalCarbs   = meals.reduce((sum, meal) => sum + meal.carbs,   0);
    const totalFats    = meals.reduce((sum, meal) => sum + meal.fat,     0);

    const formatGoal = (goal) => {
        if (!goal) return 'Maintain Weight';
        return goal.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    };

    return (
        <div className="main-content">
            {/* Banner */}
            <div className="banner bg-green" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Welcome back, {user?.name?.split(' ')[0] || user?.email?.split('@')[0]}! 👋</h1>
                    <p>Here's your health overview for today</p>
                </div>
                {showConfirm ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.15)', padding: '0.5rem 1rem', borderRadius: '8px' }}>
                        <span style={{ color: 'white', fontWeight: '600', fontSize: '0.9rem' }}>Reset today's logs?</span>
                        <button onClick={handleReset} disabled={resetting} style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', padding: '0.4rem 1rem', fontWeight: 'bold', cursor: 'pointer' }}>
                            {resetting ? 'Resetting...' : 'Yes, Reset'}
                        </button>
                        <button onClick={() => setShowConfirm(false)} style={{ background: 'white', color: '#10b981', border: 'none', borderRadius: '6px', padding: '0.4rem 1rem', fontWeight: 'bold', cursor: 'pointer' }}>Cancel</button>
                    </div>
                ) : (
                    <button onClick={() => setShowConfirm(true)} className="btn-primary" style={{ background: 'white', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem', border: 'none' }}>
                        <RotateCcw size={18} /> Reset Today's Logs
                    </button>
                )}
            </div>

            {/* Stat Cards */}
            <div className="grid-4">
                <div className="card">
                    <div style={{ width: '40px', height: '40px', background: '#dcfce7', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                        <Target color="#10b981" />
                    </div>
                    <p style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>DAILY CALORIES</p>
                    <h2 style={{ fontSize: '2rem', marginTop: '0.5rem' }}>{totalCalories} <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>/ {calorieGoal}</span></h2>
                </div>

                <div className="card">
                    <div style={{ width: '40px', height: '40px', background: '#f3e8ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                        <Activity color="#a855f7" />
                    </div>
                    <p style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>BMI</p>
                    <h2 style={{ fontSize: '2rem', marginTop: '0.5rem' }}>{bmi}</h2>
                </div>

                <div className="card">
                    <div style={{ width: '40px', height: '40px', background: '#ecfdf5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                        <Apple color="#10b981" />
                    </div>
                    <p style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>MEALS LOGGED</p>
                    <h2 style={{ fontSize: '2rem', marginTop: '0.5rem' }}>{meals.length} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>today</span></h2>
                </div>

                <div className="card">
                    <div style={{ width: '40px', height: '40px', background: '#eff6ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                        <Activity color="#3b82f6" />
                    </div>
                    <p style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>WEIGHT</p>
                    <h2 style={{ fontSize: '2rem', marginTop: '0.5rem' }}>{user?.weight || '--'} <span style={{ fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 'bold' }}>kg</span></h2>
                </div>
            </div>

            {/* Calorie Progress */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.1rem' }}>Today's Calorie Progress</h3>
                    <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{Math.round(progressPercent)}%</span>
                </div>
                <div className="progress-container">
                    <div className="progress-bar" style={{ width: `${progressPercent}%` }}></div>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '1rem' }}>{Math.max(calorieGoal - totalCalories, 0)} calories remaining</p>
            </div>

            {/* BMI-based Macronutrients */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem' }}>Today's Macronutrients</h3>
                    <span style={{
                        fontSize: '0.78rem', fontWeight: '700', padding: '0.25rem 0.75rem',
                        borderRadius: '20px', border: `1px solid ${bmiColors.border}`,
                        background: bmiColors.bg, color: bmiColors.text
                    }}>
                        BMI {bmi} · {bmiLabel}
                    </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.2rem' }}>
                    Targets adjusted for your BMI &nbsp;·&nbsp;
                    {proteinRatio * 100 | 0}% Protein &nbsp;·&nbsp;
                    {carbsRatio * 100 | 0}% Carbs &nbsp;·&nbsp;
                    {fatRatio * 100 | 0}% Fat
                </p>
                <div className="grid-4" style={{ marginBottom: '0' }}>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                            <span style={{ fontWeight: '600' }}>Protein</span>
                            <span>{totalProtein}g / {recommendedProtein}g</span>
                        </div>
                        <div className="progress-container">
                            <div className="progress-bar" style={{ width: `${Math.min((totalProtein / recommendedProtein) * 100, 100)}%`, background: '#10b981' }}></div>
                        </div>
                    </div>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                            <span style={{ fontWeight: '600' }}>Carbs</span>
                            <span>{totalCarbs}g / {recommendedCarbs}g</span>
                        </div>
                        <div className="progress-container">
                            <div className="progress-bar" style={{ width: `${Math.min((totalCarbs / recommendedCarbs) * 100, 100)}%`, background: '#3b82f6' }}></div>
                        </div>
                    </div>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                            <span style={{ fontWeight: '600' }}>Fats</span>
                            <span>{totalFats}g / {recommendedFats}g</span>
                        </div>
                        <div className="progress-container">
                            <div className="progress-bar" style={{ width: `${Math.min((totalFats / recommendedFats) * 100, 100)}%`, background: '#f59e0b' }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Health Insights */}
            <div className="card">
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Health Insights</h3>
                <div style={{ background: '#ecfdf5', border: '1px solid #d1fae5', padding: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#065f46' }}>
                    <Award size={20} /> <strong>Fitness Goal:</strong> {formatGoal(user?.health_goal)}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
