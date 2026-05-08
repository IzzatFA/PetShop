import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

import Navbar from '../components/Navbar';

import logoPaw from '../assets/logo/logo2-removebg-preview 2.png';
import hero1 from '../assets/hero_sig-up1.png';
import hero2 from '../assets/hero_sig-up2.png';

import './DaftarHewan/DaftarHewan.css';
import './EditProfile.css';

export default function EditProfile() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
  });

  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (form.password && form.password !== confirmPassword) {
      setError('Konfirmasi password tidak cocok');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: form.name,
        email: form.email,
      };

      if (form.password) {
        payload.password = form.password;
      }

      const { data } = await api.put(`/api/users/${user.id}`, payload);

      // update user di context
      login(data.user);

      setSuccess('Profil berhasil diperbarui');

      // optional redirect
      setTimeout(() => {
        navigate('/profile');
      }, 1000);

    } catch (err) {
      setError(
        err.response?.data?.error ||
        'Terjadi kesalahan saat update profil'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reg-page">
      <Navbar />

      <img src={hero1} alt="Dog" className="reg-bg-dog" />
      <img src={hero2} alt="Cat" className="reg-bg-cat" />

      <div className="reg-content">
        <div className="reg-card">

          <div className="reg-header">
            <div className="reg-paw-icon">
              <img
                src={logoPaw}
                alt="Paw"
                style={{ height: '48px' }}
              />
            </div>

            <h2 className="reg-title">
              Update Profil
            </h2>
          </div>

          {error && (
            <div className="reg-error">
              {error}
            </div>
          )}

          {success && (
            <div
              style={{
                background: '#d4edda',
                color: '#155724',
                padding: '12px',
                borderRadius: '12px',
                marginBottom: '16px',
                textAlign: 'center',
                fontWeight: '600',
              }}
            >
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="reg-form-group">
              <label className="reg-label">
                Full Name
              </label>

              <input
                type="text"
                className="reg-input"
                placeholder="Enter your full name"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                required
              />
            </div>

            <div className="reg-form-group">
              <label className="reg-label">
                Email
              </label>

              <input
                type="email"
                className="reg-input"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                required
              />
            </div>

            <div className="reg-form-group">
              <label className="reg-label">
                Password Baru
              </label>

              <input
                type="password"
                className="reg-input"
                placeholder="Enter new password"
                value={form.password}
                onChange={(e) => set('password', e.target.value)}
              />
            </div>

            <div className="reg-form-group">
              <label className="reg-label">
                Konfirmasi Password
              </label>

              <input
                type="password"
                className="reg-input"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
              />
            </div>

            <button
              type="submit"
              className="reg-btn"
              disabled={loading}
            >
              {loading
                ? 'Processing...'
                : 'Update Profil'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
