import React, { useState, useEffect, useContext } from 'react';
import { BarChart, Calendar } from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

/* ─── BMI Scale Component ──────────────────────────────────────── */
const BMI_ZONES = [
  { label: 'Underweight', range: '< 18.5',  min: 10,   max: 18.5, color: '#38bdf8' },
  { label: 'Normal',      range: '18.5–24.9', min: 18.5, max: 25,   color: '#22c55e' },
  { label: 'Overweight',  range: '25.0–29.9', min: 25,   max: 30,   color: '#facc15' },
  { label: 'Obese',       range: '30.0–34.9', min: 30,   max: 35,   color: '#f97316' },
  { label: 'Morbidly Obese', range: '≥ 35.0', min: 35,  max: 45,   color: '#ef4444' },
];

const SCALE_MIN = 10;
const SCALE_MAX = 45;

const bmiToPercent = (val) =>
  Math.min(Math.max(((val - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100, 0), 100);

const getBMIZone = (val) => {
  if (val < 18.5) return BMI_ZONES[0];
  if (val < 25)   return BMI_ZONES[1];
  if (val < 30)   return BMI_ZONES[2];
  if (val < 35)   return BMI_ZONES[3];
  return BMI_ZONES[4];
};

const BMIScale = ({ bmi }) => {
  const bmiVal = parseFloat(bmi);
  const isValid = !isNaN(bmiVal);
  const zone = isValid ? getBMIZone(bmiVal) : null;
  const pointerLeft = isValid ? bmiToPercent(bmiVal) : null;

  return (
    <div className="card" style={{ marginBottom: '2rem', overflow: 'visible' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.8rem' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            Body Mass Index (BMI) Scale
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Based on your height &amp; weight from profile
          </p>
        </div>
        {isValid && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            background: zone.color + '18', border: `2px solid ${zone.color}`,
            borderRadius: '16px', padding: '0.6rem 1.2rem',
          }}>
            <span style={{ fontSize: '1.6rem', fontWeight: '900', color: zone.color, lineHeight: 1 }}>{bmiVal}</span>
            <span style={{ fontSize: '0.72rem', fontWeight: '700', color: zone.color, marginTop: '0.2rem' }}>{zone.label.toUpperCase()}</span>
          </div>
        )}
      </div>

      {/* Gradient Bar + Needle */}
      <div style={{ position: 'relative', marginBottom: '0.6rem' }}>
        {/* Bar */}
        <div style={{
          height: '28px',
          borderRadius: '999px',
          background: 'linear-gradient(to right, #38bdf8 0%, #22c55e 25%, #86efac 35%, #facc15 50%, #f97316 70%, #ef4444 100%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
          position: 'relative',
        }}>
          {/* Zone dividers */}
          {[18.5, 25, 30, 35].map(v => (
            <div key={v} style={{
              position: 'absolute',
              left: `${bmiToPercent(v)}%`,
              top: 0, bottom: 0,
              width: '2px',
              background: 'rgba(255,255,255,0.5)',
            }} />
          ))}
        </div>

        {/* Needle pointer */}
        {isValid && (
          <div style={{
            position: 'absolute',
            left: `${pointerLeft}%`,
            top: '-10px',
            transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            transition: 'left 0.8s cubic-bezier(.4,2,.6,1)',
            zIndex: 10,
          }}>
            {/* BMI bubble */}
            <div style={{
              background: zone.color,
              color: 'white',
              fontSize: '0.72rem',
              fontWeight: '800',
              padding: '0.15rem 0.45rem',
              borderRadius: '6px',
              boxShadow: `0 3px 10px ${zone.color}80`,
              marginBottom: '2px',
              whiteSpace: 'nowrap',
            }}>
              ▼ {bmiVal}
            </div>
            {/* Stem */}
            <div style={{
              width: '3px', height: '36px',
              background: zone.color,
              borderRadius: '2px',
              boxShadow: `0 0 6px ${zone.color}80`,
            }} />
          </div>
        )}
      </div>

      {/* Zone Labels */}
      <div style={{ display: 'flex', marginTop: '0.5rem' }}>
        {BMI_ZONES.map((z, i) => {
          const widthPct = ((z.max - z.min) / (SCALE_MAX - SCALE_MIN)) * 100;
          const isActive = zone?.label === z.label;
          return (
            <div key={i} style={{
              width: `${widthPct}%`,
              textAlign: 'center',
              paddingTop: '0.6rem',
              borderTop: `3px solid ${isActive ? z.color : z.color + '55'}`,
              transition: 'border-color 0.3s',
            }}>
              <div style={{
                fontSize: '0.72rem', fontWeight: isActive ? '800' : '600',
                color: isActive ? z.color : 'var(--text-muted)',
                letterSpacing: '0.3px',
                transition: 'color 0.3s',
              }}>
                {z.label.toUpperCase()}
              </div>
              <div style={{
                fontSize: '0.65rem', color: isActive ? z.color : '#aaa',
                marginTop: '0.1rem', fontWeight: isActive ? '700' : '400',
              }}>
                {z.range}
              </div>
            </div>
          );
        })}
      </div>

      {/* Health tip */}
      {isValid && (
        <div style={{
          marginTop: '1.4rem',
          padding: '0.8rem 1rem',
          borderRadius: '10px',
          background: zone.color + '12',
          border: `1px solid ${zone.color}40`,
          display: 'flex', alignItems: 'center', gap: '0.6rem',
          fontSize: '0.85rem', color: zone.color, fontWeight: '600',
        }}>
          <span style={{ fontSize: '1.1rem' }}>
            {bmiVal < 18.5 ? '🥗' : bmiVal < 25 ? '✅' : bmiVal < 30 ? '⚠️' : bmiVal < 35 ? '🔶' : '🔴'}
          </span>
          {bmiVal < 18.5 && 'Your BMI indicates underweight. Consider increasing calorie intake with nutrient-dense foods.'}
          {bmiVal >= 18.5 && bmiVal < 25 && 'Great! Your BMI is in the healthy range. Keep maintaining your balanced diet.'}
          {bmiVal >= 25 && bmiVal < 30 && 'Your BMI is slightly above normal. A moderate calorie deficit with more protein can help.'}
          {bmiVal >= 30 && bmiVal < 35 && 'Your BMI indicates obesity. A structured low-carb, high-protein plan is recommended.'}
          {bmiVal >= 35 && 'Your BMI is in the morbidly obese range. Please consult a healthcare professional.'}
        </div>
      )}

      {!isValid && (
        <div style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          ℹ️ Update your height &amp; weight in <strong>Profile</strong> to see your BMI position.
        </div>
      )}
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(8px)', border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}>
        <p style={{ margin: '0 0 0.75rem 0', fontWeight: 'bold', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>{label}</p>
        {payload.map((entry, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.35rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: entry.color === 'url(#colorCalBar)' ? '#3b82f6' : entry.color }}></div>
              <span style={{ color: '#64748b', fontWeight: '600', textTransform: 'capitalize' }}>{entry.name}</span>
            </div>
            <span style={{ color: '#0f172a', fontWeight: 'bold' }}>{entry.value}{entry.name === 'calories' ? ' kcal' : 'g'}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const Analytics = () => {
  const [days, setDays] = useState(7);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  // Compute BMI from profile
  let bmi = '--';
  if (user?.weight && user?.height) {
    const hm = user.height / 100;
    bmi = (user.weight / (hm * hm)).toFixed(1);
  }

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/meals/analytics?days=${days}`);
        
        const formattedData = res.data.map(d => ({
            date: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
            calories: Number(d.total_calories),
            protein: Number(d.total_protein),
            carbs: Number(d.total_carbs),
            fat: Number(d.total_fat)
        }));

        setData(formattedData);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      }
      setLoading(false);
    };

    fetchAnalytics();
  }, [days]);

  return (
    <div className="main-content">
      <div className="banner" style={{ background: 'linear-gradient(135deg, #3b82f6, #ec4899)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Analytics & Insights</h1>
          <p>Track your dietary progress over time</p>
        </div>
        <BarChart size={48} style={{ opacity: 0.5 }} />
      </div>

      {/* BMI Scale */}
      <BMIScale bmi={bmi} />

      {/* Day Range buttons */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => setDays(7)} style={{ flex: 1, padding: '1rem', background: days === 7 ? 'linear-gradient(135deg, #3b82f6, #a855f7)' : 'white', color: days === 7 ? 'white' : 'var(--text-main)', border: days === 7 ? 'none' : '1px solid var(--border-color)', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', transition: 'all 0.2s' }}>Last 7 Days</button>
        <button onClick={() => setDays(14)} style={{ flex: 1, padding: '1rem', background: days === 14 ? 'linear-gradient(135deg, #3b82f6, #a855f7)' : 'white', color: days === 14 ? 'white' : 'var(--text-main)', border: days === 14 ? 'none' : '1px solid var(--border-color)', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', transition: 'all 0.2s' }}>Last 14 Days</button>
        <button onClick={() => setDays(30)} style={{ flex: 1, padding: '1rem', background: days === 30 ? 'linear-gradient(135deg, #3b82f6, #a855f7)' : 'white', color: days === 30 ? 'white' : 'var(--text-main)', border: days === 30 ? 'none' : '1px solid var(--border-color)', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', transition: 'all 0.2s' }}>Last 30 Days</button>
      </div>

      <div className="card" style={{ height: '420px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        <h3 style={{ alignSelf: 'flex-start', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Calorie Intake History</h3>
        {loading ? (
            <div>Loading chart...</div>
        ) : data.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.5 }}>
                <BarChart size={48} style={{ marginBottom: '1rem' }} />
                <p>No meal data logged for the selected period.</p>
            </div>
        ) : (
            <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorCalBar" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1}/>
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity={1}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                    <Bar dataKey="calories" fill="url(#colorCalBar)" radius={[6, 6, 0, 0]} maxBarSize={45} animationDuration={1000} />
                </RechartsBarChart>
            </ResponsiveContainer>
        )}
      </div>

      <div className="card" style={{ height: '420px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>
        <h3 style={{ alignSelf: 'flex-start', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Macronutrient Stack</h3>
        {loading ? (
            <div>Loading chart...</div>
        ) : data.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.5 }}>
                <BarChart size={48} style={{ marginBottom: '1rem' }} />
                <p>No meal data logged for the selected period.</p>
            </div>
        ) : (
            <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar dataKey="protein" stackId="a" fill="#10b981" maxBarSize={45} animationDuration={1000} />
                    <Bar dataKey="carbs" stackId="a" fill="#f59e0b" maxBarSize={45} animationDuration={1000} />
                    <Bar dataKey="fat" stackId="a" fill="#ef4444" radius={[6, 6, 0, 0]} maxBarSize={45} animationDuration={1000} />
                </RechartsBarChart>
            </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default Analytics;
