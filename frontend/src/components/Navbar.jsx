import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { PawPrint, LogOut, User, LayoutDashboard } from 'lucide-react';
import './Navbar.css'; // Pastikan import file barunya

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="main-navbar">
      <div className="container nav-container">
        <Link to="/" className="nav-logo">
          <div className="logo-icon-wrapper">
            <PawPrint size={18} color="#fff" />
          </div>
          <span>Rumah<span className="logo-text-primary">Hewan</span></span>
        </Link>

        <div className="nav-auth-group">
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
              <button 
                onClick={handleLogout} 
                className="btn btn-icon btn-outline btn-logout" 
                title="Logout"
              >
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