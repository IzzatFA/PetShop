import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, PawPrint, Tags, HeartHandshake,
  CalendarClock, LogOut, Home, ChevronRight
} from 'lucide-react';
import logoImg from '/Logo.png';
import './AdminLayout.css'; // Pastikan path import benar

const NAV = [
  { to: '/admin',             label: 'Dashboard',   icon: LayoutDashboard },
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
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <img src={logoImg} alt="Rumah Hewan" style={{ height: '84px' }} />
        </Link>

        {/* Nav */}
        <nav className="sidebar-nav">
          {NAV.map(item => {
            const active = location.pathname === item.to;
            const Icon = item.icon;
            return (
              <Link 
                key={item.to} 
                to={item.to} 
                className={`nav-item ${active ? 'active' : ''}`}
              >
                <Icon size={18} />
                {item.label}
                {active && <ChevronRight size={16} className="nav-chevron" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="user-info">
            <p className="label">Login sebagai</p>
            <p className="name">{user?.name}</p>
          </div>
          <button onClick={handleLogout} className="btn btn-sm footer-btn logout-btn">
            <LogOut size={15} /> Keluar
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}