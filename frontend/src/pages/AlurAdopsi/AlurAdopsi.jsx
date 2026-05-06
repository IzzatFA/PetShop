import React from 'react';
import Navbar from '../../components/Navbar';
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
      a: "Sebagian besar hewan sudah mendapatkan vaksin dasar. Detail vaksin dapat dilihat pada profil masing-masing hewan."
    },
    {
      q: "Apakah hewan boleh langsung dibawa pulang?",
      a: "Bisa, setelah proses adopsi disetujui dan data adopter berhasil diverifikasi oleh admin."
    },
    {
      q: "Apakah ada biaya adopsi?",
      a: "Ya, beberapa hewan memiliki biaya adopsi untuk membantu biaya vaksin, makanan, dan perawatan sebelumnya."
    },
    {
      q: "Bagaimana proses adopsinya?",
      a: "Pengguna dapat memilih hewan, mengisi formulir adopsi, lalu menunggu konfirmasi dari admin atau shelter."
    },
    {
      q: "Apakah hewan sudah steril?",
      a: "Tidak semua hewan sudah steril. Informasi steril atau non-steril tersedia pada halaman detail hewan."
    },
    {
      q: "Bisakah saya mengadopsi lebih dari satu hewan?",
      a: "Bisa, selama calon adopter dinilai mampu memberikan perawatan yang layak untuk seluruh hewan."
    },
    {
      q: "Apa syarat untuk mengadopsi hewan?",
      a: "Calon adopter harus memiliki identitas valid, lingkungan yang aman, dan komitmen merawat hewan dengan baik."
    },
    {
      q: "Apakah tersedia fitur konsultasi sebelum adopsi?",
      a: "Ya, pengguna dapat menghubungi admin atau shelter untuk bertanya mengenai karakter dan kebutuhan hewan."
    },
    {
      q: "Bagaimana jika setelah adopsi saya tidak bisa merawat hewan?",
      a: "Disarankan untuk segera menghubungi pihak shelter agar hewan dapat ditangani dengan aman dan tidak terlantar."
    },
    {
      q: "Apakah hewan yang ditampilkan selalu tersedia?",
      a: "Tidak selalu. Status hewan dapat berubah sewaktu-waktu jika sudah diadopsi oleh pengguna lain."
    }
  ];

  return (
    <div className="aa-page">
      <div className='navbar-container'>
        <Navbar />
      </div>

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
