import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Utensils, LayoutDashboard, LineChart, Target, User, HelpCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();


  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Meals', path: '/meals', icon: <Utensils size={20} /> },
    { name: 'Progress', path: '/progress', icon: <Target size={20} /> },
    { name: 'Analytics', path: '/analytics', icon: <LineChart size={20} /> },
    { name: 'Profile', path: '/profile', icon: <User size={20} /> },
    { name: 'Help', path: '/help', icon: <HelpCircle size={20} /> },
  ];

  if (user && user.role === 'admin') {
    navLinks.push({ name: 'Admin', path: '/admin', icon: <ShieldCheck size={20} /> });
  }

  if (!user) return null;

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', borderRadius: '10px', padding: '0.4rem', boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)' }}>
          <Utensils size={24} />
        </div>
        <span style={{ letterSpacing: '-0.5px', fontSize: '1.6rem', color: '#10b981', fontWeight: '800' }}>
          Nutri <span style={{ color: 'var(--text-main)', fontWeight: '700' }}>Guide</span>
        </span>
      </Link>
      
      <div className="nav-links">
        {navLinks.map((link) => (
          <Link 
            key={link.name} 
            to={link.path} 
            className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
          >
            {link.icon} {link.name}
          </Link>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {user.email ? user.email[0].toUpperCase() : 'U'}
          </div>
          {user.email ? user.email.split('@')[0] : 'User'}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
