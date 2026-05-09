import React, { useState, useEffect } from 'react';
import { User, Activity, Target, Apple, Save, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    height: '',
    weight: '',
    health_goal: 'maintain',
    diet_preference: 'none',
    allergies: '',
    target_weight: ''
  });

  // Sync formData when user data loads from the API
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        age: user.age || '',
        height: user.height || '',
        weight: user.weight || '',
        health_goal: user.health_goal || 'maintain',
        diet_preference: user.diet_preference || 'none',
        allergies: user.allergies || '',
        target_weight: user.target_weight || ''
      });
    }
  }, [user]);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put('/auth/profile', formData);
      updateUser(res.data);
      setSuccessMessage('Saved preference');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Failed to update profile', error);
      alert('Error saving profile');
    }
    setSaving(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="main-content">
      <div className="banner bg-purple" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Profile Settings</h1>
          <p>Manage your health &amp; fitness preferences</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ background: 'white', color: '#a855f7', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Save size={18} /> {saving ? 'Saving...' : 'Save Profile'}
          </button>
          <button onClick={handleLogout} className="btn-primary" style={{ background: '#ef4444', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid rgba(255,255,255,0.4)' }}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>
      
      {successMessage && (
        <div style={{ background: '#dcfce3', color: '#166534', padding: '1rem', borderRadius: '8px', margin: '1rem 0', textAlign: 'center', fontWeight: 'bold' }}>
          {successMessage}
        </div>
      )}

      <div className="profile-section">
        <div className="section-header" style={{ background: '#a855f7', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <User size={20} /> Personal Information
        </div>
        <div className="profile-body grid-2">
          <div className="form-group">
            <label>Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} color="var(--text-muted)" style={{ position: 'absolute', top: '12px', left: '12px' }} />
              <input type="text" name="name" value={formData.name} onChange={handleChange} style={{ paddingLeft: '2.5rem' }} />
            </div>
          </div>
          <div className="form-group">
            <label>Email</label>
            <div style={{ position: 'relative' }}>
              <User size={18} color="var(--text-muted)" style={{ position: 'absolute', top: '12px', left: '12px' }} />
              <input type="email" value={user?.email || ''} style={{ paddingLeft: '2.5rem' }} readOnly />
            </div>
          </div>
          <div className="form-group">
            <label>Age</label>
            <div style={{ position: 'relative' }}>
              <User size={18} color="var(--text-muted)" style={{ position: 'absolute', top: '12px', left: '12px' }} />
              <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Enter age" style={{ paddingLeft: '2.5rem' }} />
            </div>
          </div>
          <div className="form-group">
            <label>Gender</label>
            <div style={{ position: 'relative' }}>
              <User size={18} color="var(--text-muted)" style={{ position: 'absolute', top: '12px', left: '12px' }} />
              <select style={{ paddingLeft: '2.5rem' }}>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-section">
        <div className="section-header bg-green" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={20} /> Health Metrics
        </div>
        <div className="profile-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          <div className="form-group">
            <label>Height (cm)</label>
            <input type="number" name="height" value={formData.height} onChange={handleChange} placeholder="Enter height" />
          </div>
          <div className="form-group">
            <label>Current Weight (kg)</label>
            <input type="number" name="weight" value={formData.weight} onChange={handleChange} placeholder="Enter weight" />
          </div>
          <div className="form-group">
            <label>Target Weight (kg)</label>
            <input type="number" name="target_weight" value={formData.target_weight} onChange={handleChange} placeholder="Enter target" />
          </div>
        </div>
      </div>

      <div className="profile-section">
        <div className="section-header bg-blue" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Target size={20} /> Fitness Goals & Activity
        </div>
        <div className="profile-body grid-2">
          <div className="form-group">
            <label>Fitness Goal</label>
            <select name="health_goal" value={formData.health_goal} onChange={handleChange}>
              <option value="lose_weight">Lose Weight</option>
              <option value="maintain">Maintain Weight</option>
              <option value="gain_muscle">Build Muscle</option>
            </select>
          </div>
          <div className="form-group">
            <label>Activity Level</label>
            <select>
              <option>Sedentary (Little/No Exercise)</option>
              <option>Lightly Active (1-3 days/week)</option>
              <option>Moderately Active (3-5 days/week)</option>
              <option>Very Active (6-7 days/week)</option>
            </select>
          </div>
        </div>
      </div>


      <div className="profile-section">
        <div className="section-header bg-red" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Apple size={20} /> Dietary Preferences
        </div>
        <div className="profile-body">
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Diet Type</label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {[
              { id: 'none', label: 'None' },
              { id: 'vegan', label: 'Vegan' },
              { id: 'vegetarian', label: 'Vegetarian' },
              { id: 'non-vegetarian', label: 'Non-Vegetarian' }
            ].map(type => (
              <span 
                key={type.id} 
                onClick={() => setFormData({ ...formData, diet_preference: type.id })}
                style={{ 
                  padding: '0.25rem 0.75rem', 
                  background: formData.diet_preference === type.id ? '#fee2e2' : '#f1f5f9', 
                  color: formData.diet_preference === type.id ? '#ef4444' : 'var(--text-muted)',
                  border: formData.diet_preference === type.id ? '1px solid #ef4444' : '1px solid transparent',
                  borderRadius: '16px', 
                  fontSize: '0.9rem', 
                  cursor: 'pointer' 
                }}>
                {type.label}
              </span>
            ))}
          </div>
          <div className="form-group">
            <label>Allergies & Restrictions</label>
            <textarea name="allergies" value={formData.allergies} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '8px', background: '#f8fafc' }} rows="3" placeholder="Enter allergies separated by commas (e.g., peanuts, dairy, gluten)"></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
