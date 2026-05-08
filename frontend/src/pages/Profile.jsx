import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';;
import logoPaw from '../assets/logo/logo2-removebg-preview 2.png';
import hero1 from '../assets/hero_sig-up1.png';
import hero2 from '../assets/hero_sig-up2.png';

import './DaftarHewan/DaftarHewan.css';
import './Profile.css';

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();

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

             <button type="button" className="reg-btn">
              Hapus Akun
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
