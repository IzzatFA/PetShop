import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

import DaftarHewan from './pages/DaftarHewan';
import PetDetail from './pages/DaftarHewan/PetDetail';
import AlurAdopsi from './pages/AlurAdopsi';
import Kontak from './pages/Kontak';

import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminAnimals from './pages/admin/Animals';
import AdminCategories from './pages/admin/Categories';
import AdminAdoptions from './pages/admin/Adoptions';
import AdminAppointments from './pages/admin/Appointments';

function RequireAuth({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function RequireAdmin({ children }) {
  const { user } = useAuth();
  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/daftar-hewan" element={<DaftarHewan />} />
      <Route path="/daftar-hewan/:id" element={<PetDetail />} />
      <Route path="/alur-adopsi" element={<AlurAdopsi />} />
      <Route path="/kontak" element={<Kontak />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* User */}


      {/* Admin */}
      <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
        <Route index element={<AdminDashboard />} />
        <Route path="animals" element={<AdminAnimals />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="adoptions" element={<AdminAdoptions />} />
        <Route path="appointments" element={<AdminAppointments />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
