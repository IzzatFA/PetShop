import React, { useState } from 'react';
import { PawPrint, X, Cat } from 'lucide-react';
import './AdoptionModal.css';

const AdoptionModal = ({ isOpen, onClose, onSubmit, petName, user, submitting }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    experience: '',
    experienceDetail: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // We pass the formData, but currently the backend might only use user_id and animal_id
    onSubmit(formData);
  };

  return (
    <div className="am-overlay" onClick={onClose}>
      <div className="am-card" onClick={e => e.stopPropagation()}>
        <button className="am-close-btn" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="am-scrollable">
          <div className="am-header">
            <div className="am-icon-wrap">
              <PawPrint size={48} color="var(--dh-primary)" fill="var(--dh-primary)" />
            </div>
            <div>
              <h2 className="am-title">Formulir Adopsi</h2>
              <p className="am-subtitle">
                Tolong lengkapi data Anda untuk mengajukan adopsi hewan kesayangan Anda di Rumah Hewan
              </p>
            </div>
          </div>

          <div className="am-notice">
            Permohonan adopsi akan direview oleh tim kami.<br/>
            Harap isi data dengan jujur
          </div>

          <form onSubmit={handleSubmit}>
            <div className="am-form-group">
              <label className="am-label">Nama Lengkap</label>
              <input 
                type="text" 
                name="name"
                className="am-input" 
                placeholder="Masukan nama lengkap" 
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="am-form-row">
              <div className="am-form-group">
                <label className="am-label">Email</label>
                <input 
                  type="email" 
                  name="email"
                  className="am-input" 
                  placeholder="Email@gmail.com" 
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="am-form-group">
                <label className="am-label">No Telepon</label>
                <input 
                  type="text" 
                  name="phone"
                  className="am-input" 
                  placeholder="08xxxx" 
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="am-form-group">
              <label className="am-label">Alamat Lengkap</label>
              <textarea 
                name="address"
                className="am-input" 
                placeholder="Tuliskan alamat lengkap tempat tinggal anda"
                rows="2"
                value={formData.address}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <div className="am-form-group">
              <label className="am-label">Pengalaman Memelihara</label>
              <div className="am-radio-group">
                <label className="am-radio-label">
                  <input 
                    type="radio" 
                    name="experience" 
                    value="yes"
                    checked={formData.experience === 'yes'}
                    onChange={handleChange}
                    required
                  />
                  Pernah atau sedang memelihara hewan
                </label>
                <label className="am-radio-label">
                  <input 
                    type="radio" 
                    name="experience" 
                    value="no"
                    checked={formData.experience === 'no'}
                    onChange={handleChange}
                    required
                  />
                  Belum pernah memelihara hewan
                </label>
              </div>
            </div>

            <div className="am-form-group">
              <label className="am-label">Sebutkan jenis dan jumlah hewan (jika pernah/sedang memelihara):</label>
              <textarea 
                name="experienceDetail"
                className="am-input" 
                placeholder="Contoh: 1 anjing kampung"
                rows="2"
                value={formData.experienceDetail}
                onChange={handleChange}
                disabled={formData.experience === 'no'}
              ></textarea>
            </div>

            <button type="submit" className="am-submit-btn" disabled={submitting}>
              <Cat size={20} />
              {submitting ? 'Mengirim...' : 'Kirim Pengajuan'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdoptionModal;
