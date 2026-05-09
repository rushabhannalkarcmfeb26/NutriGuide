import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Utensils } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div style={styles.wrapper}>
            {/* Navbar */}
            <nav style={styles.navbar}>
                <div style={styles.brand}>
                    <div style={styles.brandIcon}>
                        <Utensils size={22} color="white" />
                    </div>
                    <span style={styles.brandText}>
                        Nutri <span style={styles.brandTextDark}>Guide</span>
                    </span>
                </div>
                <div style={styles.navActions}>
                    <button
                        id="landing-login-btn"
                        style={styles.loginBtn}
                        onClick={() => navigate('/login')}
                        onMouseEnter={e => e.currentTarget.style.color = '#10b981'}
                        onMouseLeave={e => e.currentTarget.style.color = '#333'}
                    >
                        Login
                    </button>
                    <button
                        id="landing-register-btn"
                        style={styles.getStartedBtn}
                        onClick={() => navigate('/register')}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(16,185,129,0.4)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = '0 4px 14px rgba(16,185,129,0.3)';
                        }}
                    >
                        Get Started
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <main style={styles.hero}>
                {/* Decorative blobs */}
                <div style={styles.blobTopLeft} />
                <div style={styles.blobBottomRight} />

                <div style={styles.heroContent}>
                    <h1 style={styles.headline}>
                        <span style={styles.gradientText}>NutriGuide</span>
                    </h1>
                    <p style={styles.subtext}>
                        Personalized Healthy Diet Recipe Recommendation System
                    </p>

                    <button
                        id="landing-journey-btn"
                        style={styles.journeyBtn}
                        onClick={() => navigate('/login')}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-2px) scale(1.04)';
                            e.currentTarget.style.boxShadow = '0 10px 30px rgba(79,70,229,0.5)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(79,70,229,0.35)';
                        }}
                    >
                        Start Your Journey &nbsp;→
                    </button>
                </div>
            </main>
        </div>
    );
};


const styles = {
    wrapper: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 40%, #f5f3ff 100%)',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        position: 'relative',
        overflow: 'hidden',
    },

    /* ── Navbar ── */
    navbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.2rem 3rem',
        position: 'relative',
        zIndex: 10,
    },
    brand: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
    },
    brandIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #10b981, #059669)',
        borderRadius: '10px',
        padding: '0.4rem',
        boxShadow: '0 4px 10px rgba(16,185,129,0.3)',
    },
    brandText: {
        fontSize: '1.5rem',
        fontWeight: '800',
        color: '#10b981',
        letterSpacing: '-0.5px',
    },
    brandTextDark: {
        color: '#1a1a2e',
        fontWeight: '700',
    },
    navActions: {
        display: 'flex',
        alignItems: 'center',
        gap: '1.2rem',
    },
    loginBtn: {
        background: 'none',
        border: 'none',
        fontSize: '0.95rem',
        fontWeight: '600',
        color: '#333',
        cursor: 'pointer',
        transition: 'color 0.2s',
        padding: '0.4rem 0.6rem',
    },
    getStartedBtn: {
        background: 'linear-gradient(135deg, #10b981, #059669)',
        color: '#fff',
        border: 'none',
        borderRadius: '10px',
        padding: '0.55rem 1.4rem',
        fontSize: '0.95rem',
        fontWeight: '700',
        cursor: 'pointer',
        boxShadow: '0 4px 14px rgba(16,185,129,0.3)',
        transition: 'transform 0.2s, box-shadow 0.2s',
    },

    /* ── Hero ── */
    hero: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 80px)',
        textAlign: 'center',
        padding: '2rem',
        position: 'relative',
    },
    heroContent: {
        maxWidth: '720px',
        position: 'relative',
        zIndex: 5,
    },
    headline: {
        fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
        fontWeight: '800',
        color: '#1a1a2e',
        lineHeight: 1.15,
        marginBottom: '1.4rem',
        letterSpacing: '-1px',
    },
    gradientText: {
        background: 'linear-gradient(90deg, #10b981, #6366f1)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
    },
    subtext: {
        fontSize: '1.05rem',
        color: '#555',
        lineHeight: 1.7,
        marginBottom: '2.2rem',
    },
    journeyBtn: {
        background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
        color: '#fff',
        border: 'none',
        borderRadius: '50px',
        padding: '0.85rem 2.2rem',
        fontSize: '1rem',
        fontWeight: '700',
        cursor: 'pointer',
        boxShadow: '0 6px 20px rgba(79,70,229,0.35)',
        transition: 'transform 0.25s, box-shadow 0.25s',
        letterSpacing: '0.3px',
        marginBottom: '0',
    },

    /* ── Decorative blobs ── */
    blobTopLeft: {
        position: 'absolute',
        top: '-100px',
        left: '-100px',
        width: '420px',
        height: '420px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)',
        zIndex: 1,
        pointerEvents: 'none',
    },
    blobBottomRight: {
        position: 'absolute',
        bottom: '-120px',
        right: '-120px',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
        zIndex: 1,
        pointerEvents: 'none',
    },
};

export default LandingPage;
