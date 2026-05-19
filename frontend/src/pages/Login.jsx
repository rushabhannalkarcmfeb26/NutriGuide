import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Utensils, Eye, EyeOff } from 'lucide-react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await api.post('/auth/login', formData);
            login(res.data.user, res.data.token);
            if (res.data.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

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

                <h1 style={s.title}>Welcome back</h1>
                <p style={s.subtitle}>Sign in to continue your health journey</p>

                {error && (
                    <div style={s.errorBox}>
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={s.form}>
                    <div style={s.fieldGroup}>
                        <label style={s.label}>Email address</label>
                        <input
                            id="login-email"
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            required
                            style={s.input}
                            onFocus={e => e.target.style.borderColor = '#10b981'}
                            onBlur={e => e.target.style.borderColor = 'rgba(16,185,129,0.2)'}
                        />
                    </div>

                    <div style={s.fieldGroup}>
                        <label style={s.label}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                id="login-password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                required
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

                    <button
                        id="login-submit"
                        type="submit"
                        disabled={loading}
                        style={{ ...s.submitBtn, opacity: loading ? 0.75 : 1 }}
                        onMouseEnter={e => !loading && (e.currentTarget.style.transform = 'translateY(-1px)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
                    >
                        {loading ? 'Signing in…' : 'Sign In →'}
                    </button>
                </form>

                <p style={s.switchText}>
                    Don't have an account?{' '}
                    <Link to="/register" style={s.link}>Create one free</Link>
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
        padding: '2.8rem 2.5rem',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
        position: 'relative',
        zIndex: 5,
    },
    logoRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        justifyContent: 'center',
        marginBottom: '1.6rem',
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
        fontSize: '1.4rem',
        fontWeight: '800',
        color: '#10b981',
        letterSpacing: '-0.5px',
    },
    logoTextDark: {
        color: '#1a1a2e',
        fontWeight: '700',
    },
    title: {
        fontSize: '1.75rem',
        fontWeight: '800',
        color: '#1a1a2e',
        textAlign: 'center',
        marginBottom: '0.4rem',
        letterSpacing: '-0.5px',
    },
    subtitle: {
        fontSize: '0.9rem',
        color: '#666',
        textAlign: 'center',
        marginBottom: '1.8rem',
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
        gap: '0',
    },
    fieldGroup: {
        marginBottom: '1.1rem',
    },
    label: {
        display: 'block',
        fontSize: '0.82rem',
        fontWeight: '700',
        color: '#444',
        marginBottom: '0.45rem',
        letterSpacing: '0.2px',
    },
    input: {
        width: '100%',
        padding: '0.75rem 1rem',
        border: '1.5px solid rgba(16,185,129,0.2)',
        borderRadius: '10px',
        fontSize: '0.95rem',
        background: 'rgba(255,255,255,0.9)',
        color: '#1a1a2e',
        outline: 'none',
        transition: 'border-color 0.2s',
        fontFamily: 'inherit',
        boxSizing: 'border-box',
    },
    submitBtn: {
        marginTop: '0.6rem',
        width: '100%',
        background: 'linear-gradient(135deg, #10b981, #059669)',
        color: '#fff',
        border: 'none',
        borderRadius: '12px',
        padding: '0.85rem',
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
        marginTop: '1.4rem',
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
        marginTop: '0.8rem',
        cursor: 'pointer',
        transition: 'color 0.2s',
    },
};

export default Login;
