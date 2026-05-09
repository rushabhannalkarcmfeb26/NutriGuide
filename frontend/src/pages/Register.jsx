import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Utensils, Eye, EyeOff } from 'lucide-react';
import api from '../services/api';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '',
        age: '', weight: '', height: '',
        diet_preference: 'none', health_goal: 'maintain'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (formData.weight && formData.height) {
            const h = parseFloat(formData.height) / 100;
            const w = parseFloat(formData.weight);
            if (h > 0 && w > 0) {
                const bmi = w / (h * h);
                let suggestedGoal = 'maintain';
                if (bmi < 18.5) suggestedGoal = 'gain_muscle';
                else if (bmi >= 25) suggestedGoal = 'lose_weight';
                setFormData(prev =>
                    prev.health_goal !== suggestedGoal ? { ...prev, health_goal: suggestedGoal } : prev
                );
            }
        }
    }, [formData.weight, formData.height]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await api.post('/auth/register', formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const calculateBMI = () => {
        if (formData.weight && formData.height) {
            const h = parseFloat(formData.height) / 100;
            const w = parseFloat(formData.weight);
            if (h > 0 && w > 0) return (w / (h * h)).toFixed(1);
        }
        return '';
    };

    const update = (field) => (e) => setFormData({ ...formData, [field]: e.target.value });

    return (
        <div style={s.page}>
            {/* Background blobs */}
            <div style={s.blobTL} />
            <div style={s.blobBR} />

            <div style={s.card}>
                {/* Logo */}
                <div style={s.logoRow}>
                    <div style={s.logoIconBox}>
                        <Utensils size={20} color="white" />
                    </div>
                    <span style={s.logoText}>
                        Nutri <span style={s.logoTextDark}>Guide</span>
                    </span>
                </div>

                <h1 style={s.title}>Create your account</h1>
                <p style={s.subtitle}>Start your personalized nutrition journey</p>

                {error && <div style={s.errorBox}>⚠️ {error}</div>}

                <form onSubmit={handleSubmit} style={s.form}>

                    {/* Name */}
                    <div style={s.field}>
                        <label style={s.label}>Full Name</label>
                        <input id="reg-name" type="text" placeholder="Enter your full name"
                            value={formData.name} onChange={update('name')} required
                            style={s.input}
                            onFocus={e => e.target.style.borderColor = '#10b981'}
                            onBlur={e => e.target.style.borderColor = 'rgba(16,185,129,0.2)'}
                        />
                    </div>

                    {/* Email */}
                    <div style={s.field}>
                        <label style={s.label}>Email Address</label>
                        <input id="reg-email" type="email" placeholder="you@example.com"
                            value={formData.email} onChange={update('email')} required
                            style={s.input}
                            onFocus={e => e.target.style.borderColor = '#10b981'}
                            onBlur={e => e.target.style.borderColor = 'rgba(16,185,129,0.2)'}
                        />
                    </div>

                    {/* Password */}
                    <div style={s.field}>
                        <label style={s.label}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <input id="reg-password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                value={formData.password} onChange={update('password')} required
                                style={{ ...s.input, paddingRight: '2.8rem' }}
                                onFocus={e => e.target.style.borderColor = '#10b981'}
                                onBlur={e => e.target.style.borderColor = 'rgba(16,185,129,0.2)'}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(v => !v)}
                                style={{
                                    position: 'absolute', right: '0.75rem', top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    color: '#6b7280', padding: '0', display: 'flex', alignItems: 'center',
                                }}
                                tabIndex={-1}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Age & Weight */}
                    <div style={s.row}>
                        <div style={s.field}>
                            <label style={s.label}>Age</label>
                            <input id="reg-age" type="number" placeholder="Enter your age"
                                value={formData.age} onChange={update('age')}
                                style={s.input}
                                onFocus={e => e.target.style.borderColor = '#10b981'}
                                onBlur={e => e.target.style.borderColor = 'rgba(16,185,129,0.2)'}
                            />
                        </div>
                        <div style={s.field}>
                            <label style={s.label}>Weight (kg)</label>
                            <input id="reg-weight" type="number" placeholder="Enter your weight"
                                value={formData.weight} onChange={update('weight')}
                                style={s.input}
                                onFocus={e => e.target.style.borderColor = '#10b981'}
                                onBlur={e => e.target.style.borderColor = 'rgba(16,185,129,0.2)'}
                            />
                        </div>
                    </div>

                    {/* Height & BMI */}
                    <div style={s.row}>
                        <div style={s.field}>
                            <label style={s.label}>Height (cm)</label>
                            <input id="reg-height" type="number" placeholder="Enter your height"
                                value={formData.height} onChange={update('height')}
                                style={s.input}
                                onFocus={e => e.target.style.borderColor = '#10b981'}
                                onBlur={e => e.target.style.borderColor = 'rgba(16,185,129,0.2)'}
                            />
                        </div>
                        <div style={s.field}>
                            <label style={s.label}>BMI (auto)</label>
                            <input type="text" value={calculateBMI()} readOnly
                                style={{ ...s.input, background: 'rgba(16,185,129,0.06)', color: '#10b981', fontWeight: '700' }}
                            />
                        </div>
                    </div>

                    {/* Diet Preference */}
                    <div style={s.field}>
                        <label style={s.label}>Diet Preference</label>
                        <select id="reg-diet" value={formData.diet_preference} onChange={update('diet_preference')}
                            style={s.select}
                            onFocus={e => e.target.style.borderColor = '#10b981'}
                            onBlur={e => e.target.style.borderColor = 'rgba(16,185,129,0.2)'}
                        >
                            <option value="none">None</option>
                            <option value="vegan">Vegan</option>
                            <option value="vegetarian">Vegetarian</option>
                            <option value="non-vegetarian">Non-Vegetarian</option>
                        </select>
                    </div>

                    {/* Health Goal */}
                    <div style={s.field}>
                        <label style={s.label}>Health Goal</label>
                        <select id="reg-goal" value={formData.health_goal} onChange={update('health_goal')}
                            style={s.select}
                            onFocus={e => e.target.style.borderColor = '#10b981'}
                            onBlur={e => e.target.style.borderColor = 'rgba(16,185,129,0.2)'}
                        >
                            <option value="lose_weight">Lose Weight</option>
                            <option value="maintain">Maintain Weight</option>
                            <option value="gain_muscle">Gain Muscle</option>
                        </select>
                    </div>

                    <button
                        id="reg-submit"
                        type="submit"
                        disabled={loading}
                        style={{ ...s.submitBtn, opacity: loading ? 0.75 : 1 }}
                        onMouseEnter={e => !loading && (e.currentTarget.style.transform = 'translateY(-1px)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
                    >
                        {loading ? 'Creating account…' : 'Create Account →'}
                    </button>
                </form>

                <p style={s.switchText}>
                    Already have an account?{' '}
                    <Link to="/login" style={s.link}>Sign in</Link>
                </p>

                <p style={s.backLink} onClick={() => navigate('/')}>
                    ← Back to home
                </p>
            </div>
        </div>
    );
};

const s = {
    page: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 40%, #f5f3ff 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        position: 'relative',
        overflow: 'hidden',
        padding: '2rem',
    },
    blobTL: {
        position: 'fixed',
        top: '-120px',
        left: '-120px',
        width: '450px',
        height: '450px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16,185,129,0.14) 0%, transparent 70%)',
        pointerEvents: 'none',
    },
    blobBR: {
        position: 'fixed',
        bottom: '-150px',
        right: '-150px',
        width: '550px',
        height: '550px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.13) 0%, transparent 70%)',
        pointerEvents: 'none',
    },
    card: {
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.7)',
        borderRadius: '24px',
        padding: '2.4rem 2.5rem',
        width: '100%',
        maxWidth: '480px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
        position: 'relative',
        zIndex: 5,
    },
    logoRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        justifyContent: 'center',
        marginBottom: '1.2rem',
    },
    logoIconBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #10b981, #059669)',
        borderRadius: '10px',
        padding: '0.4rem',
        boxShadow: '0 4px 10px rgba(16,185,129,0.3)',
    },
    logoText: {
        fontSize: '1.35rem',
        fontWeight: '800',
        color: '#10b981',
        letterSpacing: '-0.5px',
    },
    logoTextDark: {
        color: '#1a1a2e',
        fontWeight: '700',
    },
    title: {
        fontSize: '1.6rem',
        fontWeight: '800',
        color: '#1a1a2e',
        textAlign: 'center',
        marginBottom: '0.3rem',
        letterSpacing: '-0.5px',
    },
    subtitle: {
        fontSize: '0.88rem',
        color: '#666',
        textAlign: 'center',
        marginBottom: '1.5rem',
    },
    errorBox: {
        background: 'rgba(239,68,68,0.08)',
        border: '1px solid rgba(239,68,68,0.25)',
        color: '#dc2626',
        borderRadius: '10px',
        padding: '0.7rem 1rem',
        fontSize: '0.875rem',
        marginBottom: '1.2rem',
        fontWeight: '500',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    row: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0.75rem',
    },
    field: {
        marginBottom: '0.85rem',
    },
    label: {
        display: 'block',
        fontSize: '0.8rem',
        fontWeight: '700',
        color: '#444',
        marginBottom: '0.35rem',
        letterSpacing: '0.2px',
    },
    input: {
        width: '100%',
        padding: '0.65rem 0.9rem',
        border: '1.5px solid rgba(16,185,129,0.2)',
        borderRadius: '10px',
        fontSize: '0.9rem',
        background: 'rgba(255,255,255,0.9)',
        color: '#1a1a2e',
        outline: 'none',
        transition: 'border-color 0.2s',
        fontFamily: 'inherit',
        boxSizing: 'border-box',
    },
    select: {
        width: '100%',
        padding: '0.65rem 0.9rem',
        border: '1.5px solid rgba(16,185,129,0.2)',
        borderRadius: '10px',
        fontSize: '0.9rem',
        background: 'rgba(255,255,255,0.9)',
        color: '#1a1a2e',
        outline: 'none',
        transition: 'border-color 0.2s',
        fontFamily: 'inherit',
        boxSizing: 'border-box',
        cursor: 'pointer',
    },
    submitBtn: {
        marginTop: '0.4rem',
        width: '100%',
        background: 'linear-gradient(135deg, #10b981, #059669)',
        color: '#fff',
        border: 'none',
        borderRadius: '12px',
        padding: '0.82rem',
        fontSize: '1rem',
        fontWeight: '700',
        cursor: 'pointer',
        boxShadow: '0 4px 15px rgba(16,185,129,0.35)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        letterSpacing: '0.2px',
    },
    switchText: {
        textAlign: 'center',
        fontSize: '0.875rem',
        color: '#666',
        marginTop: '1.2rem',
    },
    link: {
        color: '#10b981',
        fontWeight: '700',
        textDecoration: 'none',
    },
    backLink: {
        textAlign: 'center',
        fontSize: '0.8rem',
        color: '#999',
        marginTop: '0.7rem',
        cursor: 'pointer',
    },
};

export default Register;
