import { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  PawPrint,
  HeartHandshake,
  CalendarClock,
  CheckCircle2,
} from 'lucide-react';

import './Dashboard.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    animals: 0,
    adoptionRequests: 0,
    appointments: 0,
    completedAdoptions: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [aRes, adRes, apRes] = await Promise.all([
          api.get('/api/animals'),
          api.get('/api/adoptions'),
          api.get('/api/appointments')
        ]);

        // Contoh filter status
        // Sesuaikan dengan struktur database/API kamu
        const completedAdoptions = adRes.data.filter(
          a =>
            a.status === 'completed' ||
            a.status === 'approved' ||
            a.status === 'selesai'
        ).length;

        setStats({
          animals: aRes.data.length,
          adoptionRequests: adRes.data.length,
          appointments: apRes.data.length,
          completedAdoptions
        });

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const cards = [
    {
      label: 'Total Hewan',
      val: stats.animals,
      icon: PawPrint,
      color: '--primary',
      rgb: '92,40,34'
    },
    {
      label: 'Pengajuan Adopsi',
      val: stats.adoptionRequests,
      icon: HeartHandshake,
      color: '--warning',
      rgb: '245,158,11'
    },
    {
      label: 'Janji Temu Adopsi',
      val: stats.appointments,
      icon: CalendarClock,
      color: '--accent',
      rgb: '138,90,82'
    },
    {
      label: 'Selesai Adopsi',
      val: stats.completedAdoptions,
      icon: CheckCircle2,
      color: '--success',
      rgb: '16,185,129'
    }
  ];

  if (loading) {
    return (
      <div className="empty-state">
        <p>Memuat dashboard...</p>
      </div>
    );
  }

  return (
    <div className="anim-fade-up">
      <div className="glass welcome-card">
        <div className="welcome-header">
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
                  background: `rgba(${c.rgb}, .12)`,
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