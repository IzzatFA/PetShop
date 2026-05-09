import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, ShieldCheck, PawPrint } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from './DaftarHewan/components/Footer';
import hero1 from '../assets/hero_beranda1.png';
import hero2 from '../assets/hero_beranda2.png';

// Use the global CSS variables defined in DaftarHewan
import './DaftarHewan/DaftarHewan.css';
import './Home.css';

export default function Home() {
  return (
    <div className="home-page">
      <div className='navbar-container'>
        <Navbar />
      </div>

      {/* HERO SECTION */}
      <section className="home-section" style={{ padding: 0 }}>
        <div className="home-container hero-wrapper">
          <div className="hero-text">
            <h1 className="hero-title">Temukan Sahabat Setiamu di Rumah Hewan</h1>
            <p className="hero-subtitle">Satu Adopsi, Sejuta Kasih</p>
            <Link to="/daftar-hewan" className="hero-btn">Adopsi Sekarang</Link>
          </div>
          <div className="hero-image">
            <img src={hero1} alt="Dog and Cat" className="hero-beranda-img1" />
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="home-section">
        <div className="home-container about-wrapper">
          <div className="about-image">
            <img src={hero2} alt="Puppy and Kitten" className="hero-beranda-img2" />
          </div>
          <div className="about-text">
            <h2 className="section-title">Rumah Hewan</h2>
            <p className="about-desc">
              Platform adopsi yang menghubungkan hewan-hewan yang membutuhkan rumah dengan orang-orang yang siap memberi kasih sayang. Kami percaya bahwa setiap hewan berhak mendapatkan kehidupan yang lebih baik dan tempat untuk pulang.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="home-section">
        <div className="home-container">
          <h2 className="section-title center">Kenapa Rumah Hewan?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon"><PawPrint size={32} /></div>
              <h3 className="feature-title">Proses Adopsi Mudah<br/>& Transparan</h3>
              <p className="feature-desc">Proses adopsi dirancang sederhana dan transparan, agar keputusan dipermudah dan dilakukan dengan aman.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><Heart size={32} /></div>
              <h3 className="feature-title">Kesehatan Hewan<br/>Terjamin</h3>
              <p className="feature-desc">Semua hewan yang tersedia telah mendapatkan perawatan kesehatan, vaksinasi, dan sterilisasi.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><ShieldCheck size={32} /></div>
              <h3 className="feature-title">Pendampingan Hingga<br/>Beradaptasi</h3>
              <p className="feature-desc">Kami siap memberikan pendampingan adaptasi, membantu perawatan, dan proses adaptasi hewan di rumah barunya.</p>
            </div>
          </div>
        </div>
      </section>

      {/* IMPACT SECTION */}
      <section className="home-section">
        <div className="home-container impact-container">
          <h2 className="section-title center" style={{ color: 'var(--dh-primary)', marginBottom: 0 }}>Dampak Rumah Hewan</h2>
          <div className="impact-grid">
            <div className="impact-card">
              <div className="impact-number">10+</div>
              <div className="impact-label">Hewan tersedia<br/>sekarang</div>
            </div>
            <div className="impact-card">
              <div className="impact-number">15+</div>
              <div className="impact-label">Hewan berhasil<br/>diadopsi</div>
            </div>
            <div className="impact-card">
              <div className="impact-number">99%</div>
              <div className="impact-label">Tingkat kepuasan<br/>adopter</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
