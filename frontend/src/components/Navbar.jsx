import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { PawPrint, LogOut, User, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(15,23,42,0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border)'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.25rem' }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <PawPrint size={18} color="#fff" />
          </div>
          <span>Rumah<span style={{ color: 'var(--primary)' }}>Hewan</span></span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" className="btn btn-outline btn-sm">
                  <LayoutDashboard size={15} /> Admin
                </Link>
              )}
              <Link to="/dashboard" className="btn btn-outline btn-sm">
                <User size={15} /> {user.name}
              </Link>
              <button onClick={handleLogout} className="btn btn-icon btn-outline" title="Logout"
                style={{ color: 'var(--danger)' }}>
                <LogOut size={17} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">Masuk</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Daftar</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
