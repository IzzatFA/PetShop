import React from 'react';
import { Home, PawPrint, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoImg from '../../../assets/logo/Group 3925.png';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="dh-footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <img src={logoImg} alt="Rumah Hewan" style={{ height: '56px', marginBottom: '8px' }} />
          </Link>
          <p className="brand-desc">
            Platform adopsi hewan terpercaya.<br/>
            Satu adopsi, sejuta kasih.
          </p>
        </div>

        <div className="footer-links">
          <h4 className="footer-heading">NAVIGASI</h4>
          <ul>
            <li><Link to="/">Beranda</Link></li>
            <li><Link to="/daftar-hewan">Daftar Hewan</Link></li>
            <li><a href="#">Alur Adopsi</a></li>
            <li><a href="#">Kontak</a></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4 className="footer-heading">KONTAK</h4>
          <ul>
            <li>
              <Mail size={16} style={{ marginTop: '2px' }} />
              <span>halo@rumahhewan.id</span>
            </li>
            <li>
              <Phone size={16} style={{ marginTop: '2px' }} />
              <span>+62 81 2345 6789</span>
            </li>
            <li>
              <MapPin size={16} style={{ marginTop: '2px' }} />
              <span>Tembalang, Indonesia</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom container">
        <p>&copy; 2024 Rumah Hewan | Dibuat dengan kasih untuk hewan Indonesia</p>
        <div className="footer-bottom-links">
          <a href="#">Kebijakan Privasi</a>
          <a href="#">Syarat & Ketentuan</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
