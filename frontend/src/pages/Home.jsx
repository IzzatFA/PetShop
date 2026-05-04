import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { Search, Heart, Calendar, PawPrint, Info, Sparkles } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const [animals, setAnimals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // { type: 'adopt'|'appointment', animal }
  const [formNote, setFormNote] = useState('');
  const [formDate, setFormDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');

  const [userAdoptions, setUserAdoptions] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [aRes, cRes] = await Promise.all([
          api.get('/api/animals'),
          api.get('/api/categories')
        ]);
        setCategories(cRes.data);

        let myAdoptions = [];
        if (user) {
          const adRes = await api.get(`/api/adoptions/user/${user.id}`);
          myAdoptions = adRes.data;
          setUserAdoptions(myAdoptions);
        }

        // Tampilkan hewan yang 'available' ATAU hewan yang pernah diadopsi oleh user ini
        setAnimals(aRes.data.filter(a => 
          a.status === 'available' || myAdoptions.some(ua => ua.animal_id === a.id)
        ));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const filtered = animals.filter(a => {
    const matchCat = !filter || a.category_id === parseInt(filter);
    const matchSearch = !search || a.breed.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const getCatName = (id) => categories.find(c => c.id === id)?.name || '-';

  const handleAdopt = async (animal) => {
    if (!user) return alert('Silakan login terlebih dahulu!');
    setSubmitting(true);
    try {
      await api.post('/api/adoptions', { user_id: user.id, animal_id: animal.id });
      setMsg('Permintaan adopsi berhasil dikirim! Mohon tunggu persetujuan admin.');
      
      // Refresh user adoptions
      const adRes = await api.get(`/api/adoptions/user/${user.id}`);
      setUserAdoptions(adRes.data);
      
      setModal(null);
      setTimeout(() => setMsg(''), 5000);
    } catch (err) {
      alert(err.response?.data?.error || 'Gagal mengajukan adopsi');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAppointment = async (animal) => {
    if (!user) return alert('Silakan login terlebih dahulu!');
    if (!formDate) return alert('Pilih tanggal terlebih dahulu');
    setSubmitting(true);
    try {
      await api.post('/api/appointments', {
        user_id: user.id, animal_id: animal.id,
        date: formDate, note: formNote
      });
      setMsg('Janji temu berhasil dibuat! Mohon datang ke lokasi pada waktu yang ditentukan.');
      setModal(null);
      setFormDate('');
      setFormNote('');
      setTimeout(() => setMsg(''), 5000);
    } catch (err) {
      alert(err.response?.data?.error || 'Gagal membuat janji');
    } finally {
      setSubmitting(false);
    }
  };

  const getAdoptionStatus = (animalId) => {
    return userAdoptions.find(a => a.animal_id === animalId);
  };

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section style={{
        padding: '5rem 0 3rem',
        background: 'radial-gradient(ellipse at top, rgba(99,102,241,0.1), transparent 60%)',
        textAlign: 'center'
      }}>
        <div className="container anim-fade-up">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 1rem',
            background: 'var(--primary-light)', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600,
            color: 'var(--primary)', marginBottom: '1.5rem' }}>
            <Sparkles size={14} /> Platform Adopsi Hewan #1
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', maxWidth: 700, margin: '0 auto 1rem' }}>
            Temukan Sahabat <span style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Baru Anda</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: 550, margin: '0 auto 2.5rem' }}>
            Beri mereka kesempatan kedua. Adopsi hewan peliharaan dan ubah hidup mereka sekaligus hidup Anda.
          </p>

          {/* Search Bar */}
          <div className="glass" style={{ display: 'inline-flex', gap: '1px', padding: 6, borderRadius: 14, maxWidth: 550, width: '100%' }}>
            <div className="form-input-icon" style={{ flex: 1 }}>
              <Search size={17} />
              <input type="text" className="form-input" style={{ border: 'none', background: 'transparent', borderRadius: 10 }}
                placeholder="Cari ras hewan..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="form-input" style={{ width: 180, border: 'none', background: 'transparent', borderRadius: 10 }}
              value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="" style={{ background: 'var(--bg-elevated)' }}>Semua Kategori</option>
              {categories.map(c => (
                <option key={c.id} value={c.id} style={{ background: 'var(--bg-elevated)' }}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Success message */}
      {msg && (
        <div className="container" style={{ marginTop: '1.5rem' }}>
          <div className="alert alert-success anim-fade-up">{msg}</div>
        </div>
      )}

      {/* Animal Grid */}
      <section className="container" style={{ padding: '3rem 1.5rem 5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem' }}>Hewan Tersedia</h2>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{filtered.length} hewan ditemukan</span>
        </div>

        {loading ? (
          <div className="empty-state"><p>Memuat data hewan...</p></div>
        ) : filtered.length === 0 ? (
          <div className="glass empty-state">
            <Info size={48} />
            <h3>Tidak Ada Hewan Ditemukan</h3>
            <p>Coba ubah filter atau kata kunci pencarian Anda.</p>
          </div>
        ) : (
          <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {filtered.map(animal => (
              <div key={animal.id} className="glass anim-fade-up" style={{
                overflow: 'hidden', display: 'flex', flexDirection: 'column',
                transition: 'var(--transition)'
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {/* Image display */}
                <div style={{
                  height: 200, background: 'var(--bg-elevated)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
                  overflow: 'hidden'
                }}>
                  {animal.image_url ? (
                    <img src={animal.image_url} alt={animal.breed} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <PawPrint size={56} style={{ opacity: 0.08 }} />
                  )}
                  <div className={`badge ${animal.status === 'available' ? 'badge-success' : 'badge-primary'}`} style={{ position: 'absolute', top: 12, right: 12 }}>
                    {animal.status === 'available' ? 'Tersedia' : 'Milik Anda'}
                  </div>
                  <div className="badge badge-primary" style={{ position: 'absolute', top: 12, left: 12 }}>{getCatName(animal.category_id)}</div>
                </div>

                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.15rem' }}>{animal.breed}</h3>
                    <span className="badge badge-muted">{animal.age} bln</span>
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.75rem' }}>
                    Rp {Number(animal.price || 0).toLocaleString('id-ID')}
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', flex: 1, marginBottom: '1.25rem',
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {animal.description || 'Tidak ada deskripsi.'}
                  </p>
                  {user?.role !== 'admin' && (
                    <div style={{ marginTop: 'auto' }}>
                      {(() => {
                        const adoption = getAdoptionStatus(animal.id);
                        
                        if (adoption?.status === 'approved') {
                          return (
                            <button className="btn btn-outline btn-sm" style={{ width: '100%' }} onClick={() => {
                              setModal({ type: 'appointment', animal });
                            }}>
                              <Calendar size={14} /> Buat Janji Temu
                            </button>
                          );
                        }
                        
                        if (adoption?.status === 'pending') {
                          return (
                            <button className="btn btn-outline btn-sm" style={{ width: '100%', opacity: 0.7, cursor: 'not-allowed' }} disabled>
                              Menunggu Persetujuan Adopsi
                            </button>
                          );
                        }

                        return (
                          <button className="btn btn-primary btn-sm" style={{ width: '100%' }} onClick={() => {
                            if (!user) return alert('Silakan login terlebih dahulu!');
                            setModal({ type: 'adopt', animal });
                          }}>
                            <Heart size={14} /> Ajukan Adopsi
                          </button>
                        );
                      })()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modal */}
      {modal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }} onClick={() => setModal(null)}>
          <div className="glass anim-fade-up" style={{ width: '100%', maxWidth: 440, padding: '2rem' }}
            onClick={e => e.stopPropagation()}>
            {modal.type === 'adopt' ? (
              <>
                <h3 style={{ marginBottom: '1rem' }}>Konfirmasi Adopsi</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  Anda akan mengajukan adopsi untuk <strong>{modal.animal.breed}</strong>. Lanjutkan?
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <button className="btn btn-outline btn-sm" onClick={() => setModal(null)}>Batal</button>
                  <button className="btn btn-primary btn-sm" disabled={submitting}
                    onClick={() => handleAdopt(modal.animal)}>
                    {submitting ? 'Mengirim...' : 'Ya, Ajukan Adopsi'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 style={{ marginBottom: '1rem' }}>Buat Janji Temu</h3>
                <div className="alert badge-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', background: 'var(--primary-light)', color: 'var(--primary)', border: '1px solid var(--primary)' }}>
                  <Info size={16} />
                  <span>Janji temu akan dilakukan di tempat (Shelter).</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                  Jadwalkan kunjungan untuk bertemu <strong>{modal.animal.breed}</strong>.
                </p>
                <div className="form-group">
                  <label className="form-label">Tanggal & Waktu</label>
                  <input type="datetime-local" className="form-input" value={formDate}
                    onChange={e => setFormDate(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Catatan (opsional)</label>
                  <textarea className="form-input" rows="2" placeholder="Catatan tambahan..."
                    value={formNote} onChange={e => setFormNote(e.target.value)} />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <button className="btn btn-outline btn-sm" onClick={() => setModal(null)}>Batal</button>
                  <button className="btn btn-primary btn-sm" disabled={submitting}
                    onClick={() => handleAppointment(modal.animal)}>
                    {submitting ? 'Mengirim...' : 'Buat Janji'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
