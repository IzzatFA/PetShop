import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, PawPrint, Tags, HeartHandshake,
  CalendarClock, LogOut, Home, ChevronRight
} from 'lucide-react';

const NAV = [
  { to: '/admin',              label: 'Dashboard',   icon: LayoutDashboard },
  { to: '/admin/animals',      label: 'Hewan',       icon: PawPrint },
  { to: '/admin/categories',   label: 'Kategori',    icon: Tags },
  { to: '/admin/adoptions',    label: 'Adopsi',      icon: HeartHandshake },
  { to: '/admin/appointments', label: 'Janji Temu',  icon: CalendarClock },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  const pageTitle = NAV.find(n => n.to === location.pathname)?.label || 'Admin';

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: 250, background: 'var(--bg-elevated)',
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50
      }}>
        {/* Logo */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.1rem' }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <PawPrint size={16} color="#fff" />
            </div>
            Admin<span style={{ color: 'var(--primary)' }}>Panel</span>
          </Link>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {NAV.map(item => {
            const active = location.pathname === item.to;
            const Icon = item.icon;
            return (
              <Link key={item.to} to={item.to} style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.65rem 1rem', borderRadius: 10,
                color: active ? '#fff' : 'var(--text-secondary)',
                background: active ? 'linear-gradient(135deg, var(--primary), var(--accent))' : 'transparent',
                fontWeight: active ? 600 : 500, fontSize: '0.9rem',
                transition: 'var(--transition)',
                boxShadow: active ? '0 4px 12px rgba(99,102,241,0.3)' : 'none'
              }}>
                <Icon size={18} />
                {item.label}
                {active && <ChevronRight size={16} style={{ marginLeft: 'auto', opacity: 0.7 }} />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: '1rem', borderTop: '1px solid var(--border)' }}>
          <div style={{ padding: '0.5rem 0.75rem', marginBottom: '0.75rem' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Login sebagai</p>
            <p style={{ fontWeight: 600, fontSize: '0.9rem', marginTop: '2px' }}>{user?.name}</p>
          </div>
          <Link to="/" className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <Home size={15} /> Ke Beranda
          </Link>
          <button onClick={handleLogout} className="btn btn-sm" style={{ width: '100%', justifyContent: 'center', color: 'var(--danger)' }}>
            <LogOut size={15} /> Keluar
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, marginLeft: 250, display: 'flex', flexDirection: 'column' }}>
        <header style={{
          height: 60, padding: '0 2rem',
          background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center',
          position: 'sticky', top: 0, zIndex: 40
        }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{pageTitle}</h2>
        </header>
        <div style={{ flex: 1, padding: '1.5rem 2rem', overflowY: 'auto' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
