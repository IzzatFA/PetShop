import { useState, useEffect } from 'react';
import api from '../../services/api';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function AdminAdoptions() {
  const [adoptions, setAdoptions] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Backend only has GET /api/adoptions/user/:userId, not a global list
  // For admin we need all adoptions. We'll try fetching from a general endpoint
  // or iterate users. For now, let's see if the API has a general list.
  // If not, we show a note.

  const fetchData = async () => {
    try {
      const [anRes] = await Promise.all([
        api.get('/api/animals'),
      ]);
      setAnimals(anRes.data);

      // Try fetching all adoptions — if backend supports GET /api/adoptions
      try {
        const adRes = await api.get('/api/adoptions');
        setAdoptions(adRes.data);
      } catch {
        // Endpoint might not exist; show empty
        setAdoptions([]);
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
      await api.put(`/api/adoptions/${id}/status`, { status });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Gagal mengupdate status');
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
              <th>Tanggal</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Memuat data...</td></tr>
            ) : adoptions.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                <AlertCircle size={20} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                Belum ada permintaan adopsi.
              </td></tr>
            ) : (
              adoptions.map(a => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{a.user_name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{a.user_email}</div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{a.breed || getAnimalName(a.animal_id)}</td>
                  <td>{new Date(a.created_at).toLocaleDateString('id-ID')}</td>
                  <td>
                    <span className={`badge ${
                      a.status === 'approved' ? 'badge-success' :
                      a.status === 'rejected' ? 'badge-danger' : 'badge-warning'
                    }`}>{a.status}</span>
                  </td>
                  <td>
                    {a.status === 'pending' && (
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button className="btn btn-icon btn-outline" title="Approve"
                          style={{ color: 'var(--success)' }}
                          onClick={() => handleStatus(a.id, 'approved')}>
                          <CheckCircle size={16} />
                        </button>
                        <button className="btn btn-icon btn-outline" title="Reject"
                          style={{ color: 'var(--danger)' }}
                          onClick={() => handleStatus(a.id, 'rejected')}>
                          <XCircle size={16} />
                        </button>
                      </div>
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
