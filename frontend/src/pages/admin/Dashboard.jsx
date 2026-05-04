import { useState, useEffect } from 'react';
import api from '../../services/api';
import { PawPrint, Tags, HeartHandshake, CalendarClock, TrendingUp } from 'lucide-react';

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
    { label: 'Total Hewan',      val: stats.animals,      icon: PawPrint,       color: '--primary',   rgb: '99,102,241' },
    { label: 'Kategori',          val: stats.categories,   icon: Tags,           color: '--success',   rgb: '16,185,129' },
    { label: 'Permintaan Adopsi', val: stats.adoptions,    icon: HeartHandshake, color: '--secondary', rgb: '236,72,153' },
    { label: 'Janji Temu',        val: stats.appointments, icon: CalendarClock,  color: '--warning',   rgb: '245,158,11' },
  ];

  if (loading) return <div className="empty-state"><p>Memuat dashboard...</p></div>;

  return (
    <div className="anim-fade-up">
      <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className="glass" style={{
              padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem',
              transition: 'var(--transition)', opacity: 0
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{
                width: 50, height: 50, borderRadius: 12,
                background: `rgba(${c.rgb}, 0.12)`,
                color: `var(${c.color})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <Icon size={22} />
              </div>
              <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '2px' }}>{c.label}</p>
                <h3 style={{ fontSize: '1.6rem', margin: 0 }}>{c.val}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <div className="glass" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <TrendingUp size={20} color="var(--primary)" />
          <h3>Selamat Datang di Dashboard Admin</h3>
        </div>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          Gunakan menu navigasi di sebelah kiri untuk mengelola data hewan, kategori, permintaan adopsi, dan janji temu.
          Semua data terhubung langsung ke database melalui API lokal di <code style={{ color: 'var(--primary)' }}>localhost:3000</code>.
        </p>
      </div>
    </div>
  );
}
