import React from 'react';
import Navbar from '../DaftarHewan/components/Navbar';
import Footer from '../DaftarHewan/components/Footer';
import { PawPrint, Search, Cat, FileEdit } from 'lucide-react';
import '../DaftarHewan/DaftarHewan.css';
import './AlurAdopsi.css';
import logoPaw from '../../assets/logo/logo2-removebg-preview 2.png';
import heroBg from '../../assets/hero_alur-adopsi.png';

export default function AlurAdopsi() {
  const faqList = [
    {
      q: "Apakah hewan sudah divaksin?",
      a: "Sebagian besar hewan sudah mendapatkan vaksin dasar, namun detailnya bisa dilihat di profil masing-masing."
    },
    {
      q: "Apakah hewan sudah divaksin?",
      a: "Sebagian besar hewan sudah mendapatkan vaksin dasar, namun detailnya bisa dilihat di profil masing-masing."
    },
    {
      q: "Apakah hewan sudah divaksin?",
      a: "Sebagian besar hewan sudah mendapatkan vaksin dasar, namun detailnya bisa dilihat di profil masing-masing."
    },
    {
      q: "Apakah hewan sudah divaksin?",
      a: "Sebagian besar hewan sudah mendapatkan vaksin dasar, namun detailnya bisa dilihat di profil masing-masing."
    },
    {
      q: "Apakah hewan sudah divaksin?",
      a: "Sebagian besar hewan sudah mendapatkan vaksin dasar, namun detailnya bisa dilihat di profil masing-masing."
    }
  ];

  return (
    <div className="aa-page">
      <Navbar />

      <section className="aa-hero">
        <div 
          className="aa-hero-bg" 
          style={{ backgroundImage: `url(${heroBg})` }}
        ></div>
        <div className="aa-hero-overlay"></div>
        <div className="aa-hero-content">
          <div className="aa-paw-icon">
            <img src={logoPaw} alt="Paw" style={{ height: '64px' }} />
          </div>
          <h1 className="aa-hero-title">Alur Adopsi & FAQ</h1>
          <p className="aa-hero-subtitle">Proses adopsi yang mudah, transparan, dan penuh kasih</p>
        </div>
      </section>

      <div className="aa-container">
        <section className="aa-flow-box">
          <h2 className="aa-section-title">Alur Adopsi</h2>
          <div className="aa-steps-container">
            <div className="aa-step-card">
              <div className="aa-step-icon">
                <Search size={40} />
              </div>
              <div className="aa-step-text">Cari Hewan Yang<br/>Diinginkan</div>
            </div>
            <div className="aa-step-card">
              <div className="aa-step-icon">
                <Cat size={40} />
              </div>
              <div className="aa-step-text">Klik Adopt</div>
            </div>
            <div className="aa-step-card">
              <div className="aa-step-icon">
                <FileEdit size={40} />
              </div>
              <div className="aa-step-text">Mengisi Form<br/>Appointment</div>
            </div>
          </div>
        </section>

        <section className="aa-faq-section">
          <h2 className="aa-section-title">FAQ</h2>
          <div className="aa-faq-list">
            {faqList.map((faq, index) => (
              <div key={index} className="aa-faq-card">
                <h3 className="aa-faq-question">{faq.q}</h3>
                <p className="aa-faq-answer">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
