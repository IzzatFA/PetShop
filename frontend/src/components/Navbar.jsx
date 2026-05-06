import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // Sesuaikan path-nya
import logoImg from '/Logo.png';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="dh-navbar">
      {/* Container cuma di dalam, biar background nav-nya bisa full width */}
      <div className="container nav-inner">
        <Link to="/" className="navbar-logo">
          <img src={logoImg} alt="Rumah Hewan" style={{ height: '84px' }} />
        </Link>
        
        {/* Mobile Menu Toggle */}
        <button className="mobile-menu-btn" onClick={toggleMenu}>
          {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>

        {/* Desktop Links */}
        <ul className={`navbar-links ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
          <li><Link to="/" className={isActive('/') ? 'active' : ''} onClick={() => setIsMobileMenuOpen(false)}>Beranda</Link></li>
          <li><Link to="/daftar-hewan" className={isActive('/daftar-hewan') ? 'active' : ''} onClick={() => setIsMobileMenuOpen(false)}>Daftar Hewan</Link></li>
          <li><Link to="/alur-adopsi" className={isActive('/alur-adopsi') ? 'active' : ''} onClick={() => setIsMobileMenuOpen(false)}>Alur Adopsi</Link></li>
          <li><Link to="/kontak" className={isActive('/kontak') ? 'active' : ''} onClick={() => setIsMobileMenuOpen(false)}>Kontak</Link></li>
          
          {/* Mobile Actions: Hanya muncul di HP */}
          <li className="mobile-actions-item">
            {user ? (
              <button onClick={handleLogout} className="dh-btn-solid">Logout</button>
            ) : (
              <>
                <Link to="/login" className="dh-btn-solid" onClick={toggleMenu}>Log In</Link>
                <Link to="/register" className="dh-btn-solid" onClick={toggleMenu}>Sign In</Link>
              </>
            )}
          </li>
        </ul>

        {/* Desktop Actions: Tahu role si Bien */}
        <div className="navbar-actions">
          {user ? (
            <div className="user-nav-group">
              {user.role === 'admin' && (
                <Link to="/admin" className="admin-link">
                  <LayoutDashboard size={18} /> Admin
                </Link>
              )}
              <Link to="/profile" className="user-link">
                <User size={18} /> {user.name}
              </Link>
              <button onClick={handleLogout} className="logout-btn">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="dh-btn-solid">Log In</Link>
              <Link to="/register" className="dh-btn-solid">Sign In</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;