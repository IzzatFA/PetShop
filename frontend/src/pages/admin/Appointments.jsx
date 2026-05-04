import { useState, useEffect } from 'react';
import api from '../../services/api';
import { AlertCircle, CheckCircle } from 'lucide-react';

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [anRes] = await Promise.all([
        api.get('/api/animals'),
      ]);
      setAnimals(anRes.data);

      try {
        const apRes = await api.get('/api/appointments');
        setAppointments(apRes.data);
      } catch {
        setAppointments([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const getAnimalName = (id) => animals.find(a => a.id === id)?.breed || `#${id}`;

  const handleStatus = async (id, status) => {
    try {
      await api.put(`/api/appointments/${id}/status`, { status });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Gagal mengupdate status janji temu');
    }
  };

  return (
    <div className="anim-fade-up">
      <div className="glass table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Hewan</th>
              <th>Tanggal Janji</th>
              <th>Catatan</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>Memuat data...</td></tr>
            ) : appointments.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                <AlertCircle size={20} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                Belum ada janji temu.
              </td></tr>
            ) : (
              appointments.map(a => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{a.user_name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{a.user_email}</div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{a.breed || getAnimalName(a.animal_id)}</td>
                  <td>{new Date(a.date).toLocaleString('id-ID')}</td>
                  <td style={{ color: 'var(--text-secondary)', maxWidth: 300 }}>{a.note || '-'}</td>
                  <td>
                    <span className={`badge ${a.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                      {a.status === 'completed' ? 'Sudah Diambil' : 'Dijadwalkan'}
                    </span>
                  </td>
                  <td>
                    {a.status !== 'completed' && (
                      <button className="btn btn-icon btn-outline" title="Konfirmasi Sudah Diambil"
                        style={{ color: 'var(--success)' }}
                        onClick={() => handleStatus(a.id, 'completed')}>
                        <CheckCircle size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
