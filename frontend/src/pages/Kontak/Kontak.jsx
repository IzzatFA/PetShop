import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../DaftarHewan/components/Footer';
import { PawPrint, Mail, Phone, MapPin } from 'lucide-react';
import '../DaftarHewan/DaftarHewan.css';
import './Kontak.css';
import logoPaw from '../../assets/logo/logo2-removebg-preview 2.png';
import heroBg1 from '../../assets/hero_kontak1.png';
import heroBg2 from '../../assets/hero_kontak2.png';

export default function Kontak() {
  return (
    <div className="kt-page">
      <div className='navbar-container'>
        <Navbar />
      </div>

      <section className="kt-hero">
        <div 
          className="kt-hero-bg" 
          style={{ backgroundImage: `url(${heroBg1})` }}
        ></div>
        <div className="kt-hero-overlay"></div>
        <div className="kt-hero-content">
          <div className="kt-paw-icon">
            <img src={logoPaw} alt="Paw" style={{ height: '64px' }} />
          </div>
          <h1 className="kt-hero-title">Kontak</h1>
          <p className="kt-hero-subtitle">Hubungi kami untuk informasi lebih lanjut</p>
        </div>
      </section>

      <div className="kt-container">
        <h2 className="kt-section-title">Lets talk with us</h2>
        
        <div className="kt-talk-container">
          <div className="kt-info-card">
            <div className="kt-info-text">
              <p className="kt-info-desc">
                Questions, comments, or suggestions? Simply fill in the form and we'll be in touch shortly.
              </p>
              <div className="kt-info-list">
                <div className="kt-info-item">
                  <Mail size={24} />
                  <span>halo@rumahewan.id</span>
                </div>
                <div className="kt-info-item">
                  <Phone size={24} />
                  <span>+62 81 2345 6789</span>
                </div>
                <div className="kt-info-item">
                  <MapPin size={24} />
                  <span>Tembalang, Indonesia</span>
                </div>
              </div>
            </div>
            <img 
              src={heroBg2} 
              alt="Cute Cat" 
              className="kt-info-image" 
            />
          </div>

          <div className="kt-form-card">
            <form onSubmit={e => e.preventDefault()}>
              <div className="kt-form-row">
                <div className="kt-form-group">
                  <input type="text" className="kt-input" placeholder="Name*" required />
                </div>
                <div className="kt-form-group">
                  <input type="text" className="kt-input" placeholder="Last Name*" required />
                </div>
              </div>
              <div className="kt-form-group">
                <input type="email" className="kt-input" placeholder="Email*" required />
              </div>
              <div className="kt-form-group">
                <input type="tel" className="kt-input" placeholder="Phone Number*" required />
              </div>
              <div className="kt-form-group last">
                <textarea className="kt-input" placeholder="Your message.." rows="4" required></textarea>
              </div>
              <button type="submit" className="kt-submit-btn">Send Message</button>
            </form>
          </div>
        </div>

        <div className="kt-map-container">
          <iframe 
            src="https://maps.google.com/maps?q=Jl.%20Tirto%20Agung%20No.36,%20Pedalangan,%20Kec.%20Banyumanik,%20Kota%20Semarang,%20Jawa%20Tengah%2050268&t=&z=16&ie=UTF8&iwloc=&output=embed" 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Lokasi Rumah Hewan"
          ></iframe>
        </div>
      </div>

      <Footer />
    </div>
  );
}
