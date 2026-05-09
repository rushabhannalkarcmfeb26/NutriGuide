import React, { useState, useContext } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Help = () => {
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState({ type: '', text: '' });
    const { user } = useContext(AuthContext);

    const handleSend = () => {
        if (!message.trim()) {
            setStatus({ type: 'error', text: 'Please describe your issue first.' });
            return;
        }

        const to = 'nutraguidehelp@gmail.com';
        const subject = encodeURIComponent('NutriGuide Support Request');
        const body = encodeURIComponent(
            `From: ${user?.name || 'User'} (${user?.email || 'unknown'})\n\n${message}`
        );

        // Open Gmail compose window with message pre-filled
        const gmailUrl = `https://mail.google.com/mail/?view=cm&to=${to}&su=${subject}&body=${body}`;
        window.open(gmailUrl, '_blank');

        setStatus({ type: 'success', text: 'Gmail opened! Just click Send in the new tab to deliver your message.' });
        setMessage('');
    };


    return (
        <div className="main-content">
            <h2 style={{ color: '#10b981', marginBottom: '0.25rem', fontSize: '1.2rem', fontWeight: 'bold' }}>Help</h2>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '2rem' }}>Contact Us</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* Left Card */}
                <div className="card" style={{ padding: '2rem', height: '100%', boxSizing: 'border-box' }}>
                    <div style={{ width: '60px', height: '60px', background: '#ecfdf5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                        <Mail color="#10b981" size={28} />
                    </div>
                    <h2 style={{ fontSize: '1.6rem', marginBottom: '1rem', color: '#111827' }}>NutriGuide Support</h2>
                    <p style={{ fontWeight: 'bold', color: '#10b981', marginBottom: '1.5rem', fontSize: '1.1rem' }}>nutraguidehelp@gmail.com</p>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '1.05rem' }}>
                        Share signup issues, diet recommendation problems, calorie target questions, or anything that is not working as expected.
                    </p>
                </div>

                {/* Right Card */}
                <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
                    <label style={{ fontWeight: '600', marginBottom: '0.75rem', display: 'block', color: '#374151', fontSize: '1.1rem' }}>What problem are you facing?</label>
                    <textarea 
                        placeholder="Write your issue here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        style={{ 
                            width: '100%', 
                            flexGrow: 1,
                            minHeight: '180px', 
                            padding: '1rem', 
                            borderRadius: '8px', 
                            border: '1px solid #10b981', 
                            outline: 'none',
                            resize: 'none',
                            marginBottom: '1.5rem',
                            fontSize: '1.05rem',
                            fontFamily: 'inherit',
                            boxSizing: 'border-box'
                        }}
                    />
                    <button 
                        onClick={handleSend}
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            gap: '0.5rem',
                            padding: '0.8rem 1.5rem',
                            background: '#94a3b8',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: '600',
                            fontSize: '1.05rem',
                            cursor: 'pointer',
                            alignSelf: 'flex-start',
                            transition: 'background 0.2s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#64748b'}
                        onMouseOut={(e) => e.currentTarget.style.background = '#94a3b8'}
                    >
                        <Send size={18} /> Send Help Request
                    </button>
                    
                    {status.text && (
                        <div style={{ 
                            marginTop: '1rem', 
                            padding: '0.75rem', 
                            borderRadius: '6px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem',
                            background: status.type === 'success' ? '#ecfdf5' : '#fef2f2',
                            color: status.type === 'success' ? '#065f46' : '#991b1b',
                            border: `1px solid ${status.type === 'success' ? '#d1fae5' : '#fee2e2'}`,
                            fontSize: '0.95rem'
                        }}>
                            {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                            {status.text}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Help;
