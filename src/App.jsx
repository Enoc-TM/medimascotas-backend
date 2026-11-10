import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Mascotas from './pages/Mascotas';
import FormMascota from './pages/FormMascota';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';

export default function App() {
  return (
    <div>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login initialMode="login" />} />
          <Route path="/register" element={<Login initialMode="register" />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/mascotas" element={<Mascotas />} />
            <Route path="/mascotas/nueva" element={<FormMascota />} />
            <Route path="/mascotas/editar/:id" element={<FormMascota />} />
            <Route path="/perfil" element={<Profile />} />
            <Route path="/perfil/editar" element={<EditProfile />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
