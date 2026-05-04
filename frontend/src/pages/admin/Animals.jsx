import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Plus, Edit2, Trash2, X, PawPrint } from 'lucide-react';

const INIT = { category_id: '', breed: '', age: '', description: '', status: 'available', image_url: '', price: '' };

export default function AdminAnimals() {
  const [animals, setAnimals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(INIT);
  const [editId, setEditId] = useState(null);

  const fetchData = async () => {
    try {
      const [aRes, cRes] = await Promise.all([
        api.get('/api/animals'),
        api.get('/api/categories')
      ]);
      setAnimals(aRes.data);
      setCategories(cRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        set('image_url', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, category_id: +form.category_id, age: +form.age, price: +form.price || 0 };
    try {
      if (editId) {
        await api.put(`/api/animals/${editId}`, payload);
      } else {
        await api.post('/api/animals', payload);
      }
      setForm(INIT);
      setEditId(null);
      setShowForm(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Gagal menyimpan data hewan');
    }
  };

  const handleEdit = (a) => {
    setForm({
      category_id: a.category_id || '',
      breed: a.breed,
      age: a.age || '',
      description: a.description || '',
      status: a.status,
      image_url: a.image_url || '',
      price: a.price || ''
    });
    setEditId(a.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus hewan ini?')) return;
    try {
      await api.delete(`/api/animals/${id}`);
      fetchData();
    } catch (err) {
      alert('Gagal menghapus hewan.');
    }
  };

  const getCatName = (id) => categories.find(c => c.id === id)?.name || '-';

  return (
    <div className="anim-fade-up">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem' }}>Daftar Hewan</h3>
        <button className="btn btn-primary btn-sm" onClick={() => {
          setShowForm(!showForm); setForm(INIT); setEditId(null);
        }}>
          {showForm ? <><X size={15} /> Tutup</> : <><Plus size={15} /> Tambah Hewan</>}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="glass anim-fade-up" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h4 style={{ marginBottom: '1rem', fontSize: '0.95rem' }}>{editId ? 'Edit Hewan' : 'Tambah Hewan Baru'}</h4>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Kategori</label>
                <select className="form-input" value={form.category_id} onChange={e => set('category_id', e.target.value)} required>
                  <option value="">Pilih Kategori</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Ras / Jenis</label>
                <input type="text" className="form-input" value={form.breed} onChange={e => set('breed', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Umur (Bulan)</label>
                <input type="number" className="form-input" value={form.age} onChange={e => set('age', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Harga (Rp)</label>
                <input type="number" className="form-input" placeholder="0" value={form.price} onChange={e => set('price', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <input type="text" className="form-input" value={form.status === 'available' ? 'Tersedia' : form.status === 'adopted' ? 'Diadopsi' : form.status} disabled style={{ backgroundColor: 'var(--bg-elevated)', cursor: 'not-allowed' }} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Gambar Hewan</label>
              <input type="file" className="form-input" accept="image/*" onChange={handleFileChange} />
              {form.image_url && (
                <div style={{ marginTop: '0.5rem' }}>
                  <img src={form.image_url} alt="Preview" style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }} />
                </div>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Deskripsi</label>
              <textarea className="form-input" rows="3" value={form.description} onChange={e => set('description', e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="submit" className="btn btn-primary btn-sm">{editId ? 'Update' : 'Simpan'}</button>
              {editId && <button type="button" className="btn btn-outline btn-sm" onClick={() => { setEditId(null); setForm(INIT); }}>Batal Edit</button>}
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="glass table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Gambar</th>
              <th>Ras</th>
              <th>Kategori</th>
              <th>Umur</th>
              <th>Harga</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>Memuat data...</td></tr>
            ) : animals.length === 0 ? (
              <tr><td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Belum ada hewan.</td></tr>
            ) : (
              animals.map(a => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>
                    {a.image_url ? (
                      <img src={a.image_url} alt={a.breed} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6 }} />
                    ) : (
                      <div style={{ width: 40, height: 40, background: 'var(--bg-elevated)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <PawPrint size={16} opacity={0.3} />
                      </div>
                    )}
                  </td>
                  <td style={{ fontWeight: 600 }}>{a.breed}</td>
                  <td>{getCatName(a.category_id)}</td>
                  <td>{a.age} bln</td>
                  <td style={{ fontWeight: 600, color: 'var(--primary)' }}>Rp {Number(a.price || 0).toLocaleString('id-ID')}</td>
                  <td>
                    <span className={`badge ${a.status === 'available' ? 'badge-success' : 'badge-muted'}`}>{a.status}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button className="btn btn-icon btn-outline" onClick={() => handleEdit(a)} title="Edit">
                        <Edit2 size={15} />
                      </button>
                      <button className="btn btn-icon btn-outline" onClick={() => handleDelete(a.id)} title="Hapus"
                        style={{ color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.2)' }}>
                        <Trash2 size={15} />
                      </button>
                    </div>
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
