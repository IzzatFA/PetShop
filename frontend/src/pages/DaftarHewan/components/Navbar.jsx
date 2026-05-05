import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logoImg from '../../../assets/logo/Group 3925.png';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav className="dh-navbar container">
      <Link to="/" className="navbar-logo">
        <img src={logoImg} alt="Rumah Hewan" style={{ height: '84px' }} />
      </Link>
      
      {/* Mobile Menu Toggle */}
      <button className="mobile-menu-btn" onClick={toggleMenu}>
        {isMobileMenuOpen ? <X size={32} color="var(--dh-primary)" /> : <Menu size={32} color="var(--dh-primary)" />}
      </button>

      {/* Desktop Links */}
      <ul className={`navbar-links ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
        <li><Link to="/" className={location.pathname === '/' ? 'active' : ''} onClick={toggleMenu}>Beranda</Link></li>
        <li><Link to="/daftar-hewan" className={location.pathname === '/daftar-hewan' ? 'active' : ''} onClick={toggleMenu}>Daftar Hewan</Link></li>
        <li><Link to="/alur-adopsi" className={location.pathname === '/alur-adopsi' ? 'active' : ''} onClick={toggleMenu}>Alur Adopsi</Link></li>
        <li><Link to="/kontak" className={location.pathname === '/kontak' ? 'active' : ''} onClick={toggleMenu}>Kontak</Link></li>
        
        {/* Mobile Actions */}
        <li className="mobile-actions-item">
          <Link to="/login" className="dh-btn-solid" onClick={toggleMenu}>Log In</Link>
          <Link to="/register" className="dh-btn-solid" onClick={toggleMenu}>Sign In</Link>
        </li>
      </ul>

      {/* Desktop Actions */}
      <div className="navbar-actions">
        <Link to="/login" className="dh-btn-solid">Log In</Link>
        <Link to="/register" className="dh-btn-solid">Sign In</Link>
      </div>
    </nav>
  );
};

export default Navbar;
