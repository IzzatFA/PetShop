import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [editId, setEditId] = useState(null);

  const fetch = async () => {
    try {
      const { data } = await api.get('/api/categories');
      setCategories(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Backend hanya punya POST (create), belum ada PUT untuk update
      await api.post('/api/categories', { name });
      setName('');
      setEditId(null);
      fetch();
    } catch (err) {
      alert(err.response?.data?.error || 'Gagal menyimpan kategori');
    }
  };

  return (
    <div className="anim-fade-up">
      {/* Form */}
      <div className="glass" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Tambah Kategori</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <input type="text" className="form-input" placeholder="Nama Kategori (misal: Kucing)"
            value={name} onChange={e => setName(e.target.value)} required style={{ flex: 1 }} />
          <button type="submit" className="btn btn-primary btn-sm">
            <Plus size={16} /> Tambah
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="glass table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama Kategori</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="2" style={{ textAlign: 'center', padding: '2rem' }}>Memuat data...</td></tr>
            ) : categories.length === 0 ? (
              <tr><td colSpan="2" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Belum ada kategori.</td></tr>
            ) : (
              categories.map(c => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td style={{ fontWeight: 500 }}>{c.name}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
