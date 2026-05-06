import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Calendar, Weight, PawPrint, Heart, Hand } from 'lucide-react';
import Navbar from '../../components/Navbar';
import AdoptionModal from './components/AdoptionModal';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './DaftarHewan.css';
import './PetDetail.css';

export default function PetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pet, setPet] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const res = await api.get(`/api/animals/${id}`);
        const animal = res.data;
        setPet(animal);
        
        if (animal.category_id) {
          const catRes = await api.get('/api/categories');
          const cat = catRes.data.find(c => c.id === animal.category_id);
          if (cat) setCategoryName(cat.name);
        }
      } catch (err) {
        console.error("Failed to fetch pet details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPet();
  }, [id]);

  if (loading) return <div className="pd-page-wrapper" style={{ display: 'flex', justifyContent: 'center', paddingTop: '20vh' }}>Memuat data hewan...</div>;
  if (!pet) return <div className="pd-page-wrapper" style={{ display: 'flex', justifyContent: 'center', paddingTop: '20vh' }}>Hewan tidak ditemukan.</div>;

  const imageUrl = pet.image_url 
    ? (pet.image_url.startsWith('http') ? pet.image_url : `http://localhost:3000${pet.image_url}`) 
    : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80';

  // Mock data for fields not in DB
  const mockWeight = "5 kg";
  const mockGender = pet.gender || "Female";
  const mockTags = ["Sudah Vaksin", "Bersertifikat", "Calm", "Sudah Steril"];

  const handleAdoptSubmit = async (formData) => {
    if (!user) {
      alert("Silakan login terlebih dahulu untuk mengajukan adopsi.");
      navigate('/login');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/api/adoptions', { user_id: user.id, animal_id: pet.id });
      alert("Permintaan adopsi berhasil dikirim! Mohon tunggu persetujuan tim kami.");
      setIsModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.error || 'Gagal mengajukan adopsi');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pd-page-wrapper">
      <div className='navbar-container'>
        <Navbar />
      </div>
      
      <div className="container">
        <button className="pd-back-btn" onClick={() => navigate(-1)}>
          <ChevronLeft size={24} />
        </button>

        <div className="pd-main-card">
          <div className="pd-image-container">
            <img src={imageUrl} alt={pet.breed} className="pd-image" />
          </div>
          
          <div className="pd-content">
            <h1 className="pd-title">{pet.breed}</h1>
            
            <div className="pd-stats-grid">
              <div className="pd-stat-item">
                <div className="pd-stat-icon-wrap"><Calendar size={24} /></div>
                <div className="pd-stat-text">
                  <span className="pd-stat-label">Umur</span>
                  <span className="pd-stat-value">{pet.age} {pet.age === 1 ? 'month' : 'months'}</span>
                </div>
              </div>
              <div className="pd-stat-item">
                <div className="pd-stat-icon-wrap"><Weight size={24} /></div>
                <div className="pd-stat-text">
                  <span className="pd-stat-label">Berat</span>
                  <span className="pd-stat-value">{mockWeight}</span>
                </div>
              </div>
              <div className="pd-stat-item">
                <div className="pd-stat-icon-wrap"><PawPrint size={24} /></div>
                <div className="pd-stat-text">
                  <span className="pd-stat-label">Jenis</span>
                  <span className="pd-stat-value">{categoryName || 'Unknown'}</span>
                </div>
              </div>
              <div className="pd-stat-item">
                <div className="pd-stat-icon-wrap"><span style={{ fontWeight: 'bold', fontSize: '20px' }}>♀</span></div>
                <div className="pd-stat-text">
                  <span className="pd-stat-label">Jenis Kelamin</span>
                  <span className="pd-stat-value">{mockGender}</span>
                </div>
              </div>
            </div>

            <hr className="pd-divider" />

            <h2 className="pd-section-title">Deskripsi</h2>
            <p className="pd-description">
              {pet.description || `${pet.breed} adalah hewan peliharaan yang siap diadopsi. Hubungi kami untuk informasi lebih lanjut.`}
            </p>

            <div className="pd-tags-wrap">
              {mockTags.map((tag, idx) => (
                <div key={idx} className="pd-tag">{tag}</div>
              ))}
            </div>

            <div className="pd-actions">
              <button className="pd-btn-heart">
                <Heart size={24} />
              </button>
              <button className="pd-btn-adopt" onClick={() => {
                if (!user) {
                  alert("Silakan login terlebih dahulu untuk mengajukan adopsi.");
                  navigate('/login');
                  return;
                }
                setIsModalOpen(true);
              }}>
                Ajukan Adopsi
              </button>
            </div>
          </div>
        </div>
      </div>

      <AdoptionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAdoptSubmit}
        petName={pet.breed}
        user={user}
        submitting={submitting}
      />
    </div>
  );
}
