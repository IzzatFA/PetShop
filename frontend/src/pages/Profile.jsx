import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Navbar from '../components/Navbar';;
import logoPaw from '../assets/logo/logo2-removebg-preview 2.png';
import hero1 from '../assets/hero_sig-up1.png';
import hero2 from '../assets/hero_sig-up2.png';

import './DaftarHewan/DaftarHewan.css';
import './Profile.css';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteProfile = async () => {
    if (!user?.id) {
      setError('User tidak ditemukan');
      return;
    }

    setError('');
    setDeleting(true);

    try {
      await api.delete(`/api/users/${user.id}`);
      logout();
      navigate('/register');
    } catch (err) {
      setError(
        err.response?.data?.error ||
        'Terjadi kesalahan saat menghapus profil'
      );
      setDeleteModalOpen(false);
    } finally {
      setDeleting(false);
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
            <h2 className="reg-title">Profil Saya</h2>
          </div>

          {error && <div className="reg-error">{error}</div>}

          <form>
            <div className="reg-form-group">
              <label className="reg-label">Full Name</label>
              <input 
                type="text" 
                className="reg-input" 
                placeholder={user?.name || 'Nama belum tersedia'}
                value={user?.name || ''}
                readOnly
              />
            </div>
            
            <div className="reg-form-group">
              <label className="reg-label">Email</label>
              <input 
                type="email" 
                className="reg-input" 
                placeholder={user?.email || 'Email belum tersedia'}
                value={user?.email || ''}
                readOnly
              />
            </div>

            <button
                type="button"
                className="reg-btn"
                onClick={() => navigate('/EditProfile')}
                >
                Edit Profil
            </button>

             <button
              type="button"
              className="delete-profile-btn"
              onClick={() => setDeleteModalOpen(true)}
              disabled={deleting}
            >
              Hapus Akun
            </button>
          </form>
        </div>
      </div>

      {deleteModalOpen && (
        <div
          className="delete-modal-overlay"
          onClick={() => !deleting && setDeleteModalOpen(false)}
        >
          <div
            className="delete-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="delete-modal-title">Hapus Akun?</h3>
            <p className="delete-modal-text">
              Akun dan data pengajuan yang terkait akan dihapus. Tindakan ini tidak bisa dibatalkan.
            </p>

            <div className="delete-modal-actions">
              <button
                type="button"
                className="delete-modal-cancel"
                onClick={() => setDeleteModalOpen(false)}
                disabled={deleting}
              >
                Batal
              </button>
              <button
                type="button"
                className="delete-modal-confirm"
                onClick={handleDeleteProfile}
                disabled={deleting}
              >
                {deleting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
