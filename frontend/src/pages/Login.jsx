import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { PawPrint } from 'lucide-react';
import Navbar from './DaftarHewan/components/Navbar';
import logoPaw from '../assets/logo/logo2-removebg-preview 2.png';

import './DaftarHewan/DaftarHewan.css';
import './Register.css'; // Reusing Register.css for identical layout styling

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/api/users/login', { email, password });
      login(data.user);
      navigate(data.user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.response?.data?.error || 'Terjadi kesalahan saat login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reg-page">
      <Navbar />

      {/* No animal background images here as per the Sign In design */}

      <div className="reg-content">
        <div className="reg-card">
          <div className="reg-header">
            <div className="reg-paw-icon">
              <img src={logoPaw} alt="Paw" style={{ height: '48px' }} />
            </div>
            <h2 className="reg-title">Selamat Datang!</h2>
            <p className="reg-subtitle">Sign In to your account</p>
          </div>

          {error && <div className="reg-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="reg-form-group">
              <label className="reg-label">Email</label>
              <input 
                type="email" 
                className="reg-input" 
                placeholder="Enter your email"
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
              />
            </div>
            
            <div className="reg-form-group">
              <label className="reg-label">Password</label>
              <input 
                type="password" 
                className="reg-input" 
                placeholder="Enter your password"
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
              />
            </div>

            <button type="submit" className="reg-btn" disabled={loading}>
              {loading ? 'Processing...' : 'Sign In'}
            </button>
          </form>

          <p className="reg-footer-text">
            Don't have account? <Link to="/register" className="reg-link">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
