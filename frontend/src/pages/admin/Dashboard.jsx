import { useState, useEffect } from 'react';
import api from '../../services/api';
import { PawPrint, Tags, HeartHandshake, CalendarClock, TrendingUp } from 'lucide-react';
import './Dashboard.css'; // Pastikan path ini sesuai

export default function AdminDashboard() {
  const [stats, setStats] = useState({ animals: 0, categories: 0, adoptions: 0, appointments: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [aRes, cRes, adRes, apRes] = await Promise.all([
          api.get('/api/animals'),
          api.get('/api/categories'),
          api.get('/api/adoptions'),
          api.get('/api/appointments')
        ]);
        setStats({
          animals: aRes.data.length,
          categories: cRes.data.length,
          adoptions: adRes.data.length,
          appointments: apRes.data.length
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const cards = [
    { label: 'Total Hewan',       val: stats.animals,      icon: PawPrint,       color: '--primary',   rgb: '92,40,34' }, // Disesuaikan dengan warna tema baru
    { label: 'Kategori',          val: stats.categories,   icon: Tags,           color: '--success',   rgb: '16,185,129' },
    { label: 'Permintaan Adopsi', val: stats.adoptions,    icon: HeartHandshake, color: '--warning',   rgb: '245,158,11' },
    { label: 'Janji Temu',        val: stats.appointments, icon: CalendarClock,  color: '--accent',    rgb: '138,90,82' }, // Disesuaikan dengan warna tema baru
  ];

  if (loading) return <div className="empty-state"><p>Memuat dashboard...</p></div>;

  return (
    <div className="anim-fade-up">
      <div className="glass welcome-card">
        <div className="welcome-header">
          <TrendingUp size={20} color="var(--primary)" />
          <h3>Selamat Datang di Dashboard Admin</h3>
        </div>
      </div>

      <div className="dashboard-grid stagger">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className="glass stat-card">
              <div 
                className="stat-icon-wrapper" 
                style={{
                  background: `rgba(${c.rgb}, 0.12)`,
                  color: `var(${c.color})`
                }}
              >
                <Icon size={22} />
              </div>
              <div>
                <p className="stat-label">{c.label}</p>
                <p className="stat-value">{c.val}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}