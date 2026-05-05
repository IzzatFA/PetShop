import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { PawPrint } from 'lucide-react';
import Navbar from './DaftarHewan/components/Navbar';
import logoPaw from '../assets/logo/logo2-removebg-preview 2.png';
import hero1 from '../assets/hero_sig-up1.png';
import hero2 from '../assets/hero_sig-up2.png';

import './DaftarHewan/DaftarHewan.css';
import './Register.css';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/api/users/register', form);
      login(data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Terjadi kesalahan saat registrasi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reg-page">
      <Navbar />

      {/* Placeholder images from internet for dog and cat cutouts */}
      <img src={hero1} alt="Dog" className="reg-bg-dog" />
      <img src={hero2} alt="Cat" className="reg-bg-cat" />

      <div className="reg-content">
        <div className="reg-card">
          <div className="reg-header">
            <div className="reg-paw-icon">
              <img src={logoPaw} alt="Paw" style={{ height: '48px' }} />
            </div>
            {/* Fixing typo from the design image: "Cerate Account" -> "Create Account" */}
            <h2 className="reg-title">Create Account</h2>
            <p className="reg-subtitle">Join Rumah Hewan Today!</p>
          </div>

          {error && <div className="reg-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="reg-form-group">
              <label className="reg-label">Full Name</label>
              <input 
                type="text" 
                className="reg-input" 
                placeholder="Enter your full name"
                value={form.name} 
                onChange={e => set('name', e.target.value)} 
                required 
              />
            </div>
            
            <div className="reg-form-group">
              <label className="reg-label">Email</label>
              <input 
                type="email" 
                className="reg-input" 
                placeholder="Enter your email"
                value={form.email} 
                onChange={e => set('email', e.target.value)} 
                required 
              />
            </div>
            
            <div className="reg-form-group">
              <label className="reg-label">Password</label>
              <input 
                type="password" 
                className="reg-input" 
                placeholder="Enter your password"
                value={form.password} 
                onChange={e => set('password', e.target.value)} 
                required 
                minLength={6} 
              />
            </div>

            <button type="submit" className="reg-btn" disabled={loading}>
              {loading ? 'Processing...' : 'Sign Up'}
            </button>
          </form>

          <p className="reg-footer-text">
            Already have account? <Link to="/login" className="reg-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
