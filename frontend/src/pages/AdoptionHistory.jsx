import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from './DaftarHewan/components/Footer';
import { Check, Calendar, Heart, FileSearch, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './AdoptionHistory.css';
import logoPaw from '../assets/logo/logo2-removebg-preview 2.png';
import heroBg from '../assets/hero_riwayat-adopsi.png';

export default function AdoptionHistory() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [adoptions, setAdoptions] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appointmentData, setAppointmentData] = useState({ date: '', time: '09:00 WIB' });

  const fetchHistory = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      const [adRes, apRes] = await Promise.all([
        api.get(`/api/adoptions/user/${user.id}`),
        api.get(`/api/appointments/user/${user.id}`)
      ]);
      setAdoptions(adRes.data);
      setAppointments(apRes.data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const isRejectedStatus = (status) => {
    const normalizedStatus = status ? status.toLowerCase() : '';
    return normalizedStatus === 'rejected' || normalizedStatus === 'ditolak';
  };

  const handleAppointmentSubmit = async (e, animal_id) => {
    e.preventDefault();
    try {
      // Remove " WIB" from time if present to ensure PostgreSQL can parse it
      const cleanTime = appointmentData.time.replace(' WIB', '');
      const fullDate = `${appointmentData.date} ${cleanTime}`;

      await api.post('/api/appointments', {
        user_id: user.id,
        animal_id: animal_id,
        date: fullDate,
        note: `Janji temu diajukan pada ${appointmentData.date}`
      });
      alert("Janji temu berhasil diajukan!");
      setAppointmentData({ date: '', time: '09:00 WIB' });
      fetchHistory();
    } catch (err) {
      console.error("Submit Appointment Error:", err);
      alert(err.response?.data?.details || err.response?.data?.error || "Gagal mengajukan janji temu");
    }
  };

  const getAdoptionState = (ad) => {
    const appt = appointments.find(a => a.animal_id === ad.animal_id);
    const adStatus = ad.status ? ad.status.toLowerCase() : 'pending';
    const apptStatus = appt?.status ? appt.status.toLowerCase() : 'pending';

    // 0: Rejected -> show rejected state
    if (isRejectedStatus(adStatus)) return 0;

    // 5: Success (Appointment Completed/Approved) -> All 4 steps checked
    // Admin uses 'completed' to mark successful pickup
    if (appt && apptStatus === 'completed') return 5;

    // 4: Penjemputan (Waiting for Appointment Approval) -> Step 4 active
    if (appt) return 4;

    // 3: Atur Janji Temu (Adoption Approved, but no appointment made yet) -> Step 3 active
    if (adStatus === 'approved') return 3;

    // 2: Verifikasi Admin (Adoption Pending) -> Step 2 active
    if (adStatus === 'pending') return 2;

    return 1;
  };

  const renderStepper = (currentState) => {
    const steps = [
      "Isi Form Adopsi",
      "Verifikasi Admin",
      "Atur Janji Temu",
      "Penjemputan"
    ];

    const isRejected = currentState === 0;
    // If state is 5, it means all 4 are completed
    const displayState = currentState > 4 ? 5 : currentState;
    const progressWidth = displayState === 5 ? 100 : isRejected ? 0 : (displayState - 1) * 33.33;

    return (
      <div className="ah-stepper-container">
        <div className="ah-stepper">
          <div className="ah-stepper-progress" style={{ width: `${progressWidth}%` }}></div>
          {steps.map((label, index) => {
            const stepNum = index + 1;
            // A step is completed if it's less than currentState, OR if currentState is 5 (Success)
            const status = isRejected && stepNum === 1
              ? 'rejected'
              : (stepNum < currentState || currentState === 5)
                ? 'completed'
                : stepNum === currentState
                  ? 'active'
                  : 'waiting';
            return (
              <div key={index} className={`ah-step ${status}`}>
                <div className="ah-step-circle">
                  {status === 'completed' ? <Check size={24} /> : status === 'rejected' ? <X size={26} /> : stepNum}
                </div>
                <span className="ah-step-label">{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="ah-page-container">
      <div className="navbar-container">
        <Navbar />
      </div>

      <section className="ah-hero">
        <div className="ah-hero-bg" style={{ backgroundImage: `url(${heroBg})` }}></div>
        <div className="ah-hero-overlay"></div>
        <div className="ah-hero-content">
          <div className="ah-paw-icon-wrap">
            <img src={logoPaw} alt="Paw" style={{ height: '64px' }} />
          </div>
          <h1 className="ah-hero-title">Riwayat Adopsi</h1>
          <p className="ah-hero-subtitle">Pantau terus proses adopsi anabul kesayanganmu di sini</p>
        </div>
      </section>

      <div className="ah-page-wrapper">
        <div className="container">
          {loading ? (
            <div className="ah-empty-container">
              <h3>Memuat data...</h3>
            </div>
          ) : adoptions.length === 0 ? (
            <div className="ah-empty-container glass anim-fade-up">
              <Heart size={64} style={{ color: 'var(--primary)', marginBottom: '1.5rem', opacity: 0.2 }} />
              <h3>Belum ada riwayat adopsi</h3>
              <p>Mulai cari hewan kesayangan Anda dan ajukan adopsi!</p>
              <button className="btn btn-primary" style={{ marginTop: '2rem' }} onClick={() => navigate('/daftar-hewan')}>
                Cari Hewan
              </button>
            </div>
          ) : (
            adoptions.map(ad => {
              const state = getAdoptionState(ad);
              const appt = appointments.find(a => a.animal_id === ad.animal_id);
              const adoptionStatus = ad.status ? ad.status.toLowerCase() : 'pending';
              const isRejected = isRejectedStatus(adoptionStatus);
              const statusBadgeClass = isRejected ? 'rejected' : adoptionStatus === 'approved' ? 'approved' : 'pending';
              const statusBadgeText = isRejected ? 'Gagal Diverifikasi' : adoptionStatus === 'approved' ? 'Lolos Diverifikasi' : 'Sedang Diverifikasi';

              return (
                <div key={ad.id} className="ah-adoption-item anim-fade-up">
                  {renderStepper(state)}

                  <div className="ah-content-grid">
                    {/* Left side: Pet Card */}
                    <div className="ah-pet-card">
                      <div className="ah-pet-image-wrap">
                        {ad.image_url ? (
                          <img src={ad.image_url} alt={ad.breed} className="ah-pet-image" />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ddd' }}>
                            <Check size={48} opacity={0.2} />
                          </div>
                        )}
                      </div>
                      <div className={`ah-status-badge ${statusBadgeClass}`}>
                        {statusBadgeText}
                      </div>
                      <h3 className="ah-pet-name">Adopsi {ad.breed}</h3>
                      <p className="ah-pet-date">
                        Pengajuan: {new Date(ad.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>

                    {/* Right side: Status Content */}
                    <div className="ah-status-content">
                      {state === 0 && (
                        <div className="ah-success-card ah-rejected-card anim-fade-up">
                          <div className="ah-success-icon-wrap ah-rejected-icon-wrap">
                            <span className="ah-rejected-emoji" aria-hidden="true">😔</span>
                          </div>
                          <h2 className="ah-success-title ah-rejected-title">Yah... Adopsi Tidak Diterima</h2>

                          <div className="ah-success-info-box ah-rejected-info-box">
                            <p>
                              Mohon Maaf. Tapi permintaan adopsi {ad.name || ad.breed} kami tolak.
                            </p>
                          </div>
                        </div>
                      )}

                      {state === 2 && (
                        <>
                          <div className="ah-status-icon-large" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fdf5f2', border: '3px dashed #f8c8b5' }}>
                            <FileSearch size={64} color="#a6523d" opacity={0.6} />
                          </div>
                          <h2 className="ah-status-title">Dokumen Sedang Diperiksa</h2>
                          <p className="ah-status-desc">
                            Admin kami sedang meninjau dokumen dan form adopsi yang kamu kirimkan. Tunggu sebentar yawww!!!
                          </p>
                        </>
                      )}

                      {state === 3 && (
                        <div className="ah-appointment-card">
                          <h2 className="ah-appointment-title">Atur Janji Temu</h2>
                          <p className="ah-appointment-desc">
                            Selamat! Verifikasi kamu lolos. Silahkan pilih waktu janji temu untuk pengambilan hewan.
                          </p>

                          {appt ? (
                            <div className="glass" style={{ padding: '2rem', borderRadius: '1rem', background: 'white' }}>
                              <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Permintaan Terkirim</h3>
                              <p>Menunggu konfirmasi admin untuk jadwal Anda.</p>
                              <div style={{ marginTop: '1rem', fontWeight: '600' }}>
                                <Calendar size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                                {new Date(appt.date).toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                          ) : (
                            <form onSubmit={(e) => handleAppointmentSubmit(e, ad.animal_id)}>
                              <div className="ah-form-row">
                                <div className="ah-form-group">
                                  <label>Tanggal</label>
                                  <input
                                    type="date"
                                    className="ah-input-styled"
                                    required
                                    value={appointmentData.date}
                                    onChange={e => setAppointmentData({ ...appointmentData, date: e.target.value })}
                                  />
                                </div>
                                <div className="ah-form-group">
                                  <label>Jam</label>
                                  <select
                                    className="ah-input-styled"
                                    value={appointmentData.time}
                                    onChange={e => setAppointmentData({ ...appointmentData, time: e.target.value })}
                                  >
                                    <option>09:00 WIB</option>
                                    <option>10:00 WIB</option>
                                    <option>11:00 WIB</option>
                                    <option>13:00 WIB</option>
                                    <option>14:00 WIB</option>
                                    <option>15:00 WIB</option>
                                  </select>
                                </div>
                              </div>
                              <button type="submit" className="ah-btn-confirm">Konfirmasi Jadwal</button>
                            </form>
                          )}
                        </div>
                      )}

                      {state === 4 && (
                        <div className="ah-appointment-card">
                          <h2 className="ah-appointment-title">Penjemputan</h2>
                          <div className="glass" style={{ padding: '2.5rem', borderRadius: '1.5rem', background: 'white', textAlign: 'center', border: '1px solid rgba(92,40,34,0.1)' }}>
                            <div className="ah-status-icon-large" style={{ margin: '0 auto 1.5rem', background: '#fdf5f2', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #f8c8b5' }}>
                              <Calendar size={48} color="#a6523d" />
                            </div>
                            <h3 style={{ marginBottom: '1rem', color: 'var(--primary)', fontSize: '1.5rem', fontWeight: '800' }}>Sampai Jumpa di Lokasi!</h3>
                            <p style={{ color: '#666', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>Jadwal kamu sudah tercatat. Silahkan datang ke shelter sesuai waktu yang kamu pilih ya!</p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                              <div style={{ padding: '1.25rem 2rem', background: '#fdf5f2', borderRadius: '1rem', fontWeight: '800', color: '#5C2822', display: 'inline-flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                                <Calendar size={20} />
                                <span>{new Date(appt.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} pukul {new Date(appt.date).getHours()}.{new Date(appt.date).getMinutes().toString().padStart(2, '0')}</span>
                              </div>
                              <div style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem' }}>
                                📍 Shelter PetShop Pusat
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {state === 5 && (
                        <div className="ah-success-card anim-fade-up">
                          <div className="ah-success-icon-wrap">
                            <Heart size={48} fill="#27ae60" color="#27ae60" />
                          </div>
                          <h2 className="ah-success-title">Yeay! Adopsi Berhasil</h2>

                          <div className="ah-success-status-line">
                            <Check size={20} color="#27ae60" />
                            <span>Status: <strong>HEWAN SUDAH DIAMBIL</strong></span>
                          </div>

                          <div className="ah-success-info-box" style={{ background: '#e8f5e9', border: '1px solid #c8e6c9', textAlign: 'center', display: 'block' }}>
                            <p style={{ fontSize: '1.1rem', fontWeight: '700', color: '#2e7d32', margin: 0 }}>
                              Selamat! Anabul sudah resmi jadi bagian keluarga kamu. Jaga anabulnya baik-baik ya! ❤️
                            </p>
                          </div>

                          <div className="ah-success-footer-text">
                            <Check size={18} />
                            Proses adopsi selesai. Terima kasih telah memberikan rumah baru!
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
