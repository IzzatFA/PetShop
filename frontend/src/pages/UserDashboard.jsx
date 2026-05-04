import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { Heart, Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function UserDashboard() {
  const { user } = useAuth();
  const [adoptions, setAdoptions] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const [adRes, apRes, anRes] = await Promise.all([
          api.get(`/api/adoptions/user/${user.id}`),
          api.get(`/api/appointments/user/${user.id}`),
          api.get('/api/animals')
        ]);
        setAdoptions(adRes.data);
        setAppointments(apRes.data);
        setAnimals(anRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const getAnimal = (id) => animals.find(a => a.id === id);

  const statusIcon = (s) => {
    if (s === 'approved') return <CheckCircle size={15} color="var(--success)" />;
    if (s === 'rejected') return <XCircle size={15} color="var(--danger)" />;
    return <Clock size={15} color="var(--warning)" />;
  };

  const statusBadge = (s) => {
    const map = { pending: 'badge-warning', approved: 'badge-success', rejected: 'badge-danger' };
    return <span className={`badge ${map[s] || 'badge-muted'}`}>{s}</span>;
  };

  if (loading) return (<><Navbar /><div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Memuat...</div></>);

  return (
    <>
      <Navbar />
      <div className="container" style={{ padding: '2rem 1.5rem 4rem' }}>
        <h1 className="anim-fade-up" style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>
          Halo, {user?.name} 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
          Pantau status adopsi dan janji temu Anda di sini.
        </p>

        {/* Adoptions */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 className="anim-fade-up" style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Heart size={20} color="var(--secondary)" /> Riwayat Adopsi
          </h2>
          {adoptions.length === 0 ? (
            <div className="glass empty-state" style={{ padding: '2.5rem' }}>
              <AlertCircle size={40} />
              <p>Anda belum mengajukan adopsi.</p>
            </div>
          ) : (
            <div className="glass table-wrap anim-fade-up">
              <table>
                <thead>
                  <tr>
                    <th>Hewan</th>
                    <th>Tanggal</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {adoptions.map(a => {
                    const an = getAnimal(a.animal_id);
                    return (
                      <tr key={a.id}>
                        <td style={{ fontWeight: 600 }}>{an?.breed || `#${a.animal_id}`}</td>
                        <td>{new Date(a.created_at).toLocaleDateString('id-ID')}</td>
                        <td>{statusBadge(a.status)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Appointments */}
        <div>
          <h2 className="anim-fade-up" style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={20} color="var(--primary)" /> Janji Temu
          </h2>
          {appointments.length === 0 ? (
            <div className="glass empty-state" style={{ padding: '2.5rem' }}>
              <AlertCircle size={40} />
              <p>Anda belum memiliki janji temu.</p>
            </div>
          ) : (
            <div className="glass table-wrap anim-fade-up">
              <table>
                <thead>
                  <tr>
                    <th>Hewan</th>
                    <th>Tanggal Kunjungan</th>
                    <th>Catatan</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(a => {
                    const an = getAnimal(a.animal_id);
                    return (
                      <tr key={a.id}>
                        <td style={{ fontWeight: 600 }}>{an?.breed || `#${a.animal_id}`}</td>
                        <td>{new Date(a.date).toLocaleString('id-ID')}</td>
                        <td style={{ color: 'var(--text-secondary)' }}>{a.note || '-'}</td>
                        <td>
                          <span className={`badge ${a.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                            {a.status === 'completed' ? 'Sudah Diambil' : 'Dijadwalkan'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
