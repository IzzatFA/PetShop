import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { PawPrint, Mail, Lock, User } from 'lucide-react';

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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem',
      background: 'radial-gradient(ellipse at top, rgba(236,72,153,0.06), transparent 60%)' }}>
      <div className="glass anim-fade-up" style={{ width: '100%', maxWidth: 420, padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14, margin: '0 auto 1rem',
            background: 'linear-gradient(135deg, var(--secondary), var(--accent))',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <PawPrint size={24} color="#fff" />
          </div>
          <h2 style={{ fontSize: '1.5rem' }}>Buat Akun Baru</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.4rem' }}>
            Bergabunglah untuk mengadopsi hewan impian Anda.
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nama Lengkap</label>
            <div className="form-input-icon">
              <User size={17} />
              <input type="text" className="form-input" placeholder="John Doe"
                value={form.name} onChange={e => set('name', e.target.value)} required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="form-input-icon">
              <Mail size={17} />
              <input type="email" className="form-input" placeholder="email@contoh.com"
                value={form.email} onChange={e => set('email', e.target.value)} required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="form-input-icon">
              <Lock size={17} />
              <input type="password" className="form-input" placeholder="Minimal 6 karakter"
                value={form.password} onChange={e => set('password', e.target.value)} required minLength={6} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.85rem' }}>
            {loading ? 'Memproses...' : 'Daftar'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Sudah punya akun?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Masuk di sini</Link>
        </p>
      </div>
    </div>
  );
}
