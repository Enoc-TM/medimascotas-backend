// src/components/Navbar.jsx
// Barra de navegación superior con Logo oficial de MediMascotas
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={user ? "/dashboard" : "/login"} className="navbar-logo">
          <img src="/logo.png" alt="MediMascotas" className="navbar-logo-img" />
          <span className="navbar-logo-text">MediMascotas</span>
        </Link>

        <div className="navbar-links">
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/mascotas" className="nav-link">🐾 Mascotas</Link>
              <Link to="/perfil" className="nav-link">Mi Perfil</Link>
              <span className="user-badge">
                👤 {user.nombre || user.name}
              </span>
              <button onClick={handleLogout} className="btn-logout">
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Iniciar Sesión</Link>
              <Link to="/register" className="btn-register-nav">Registrarse</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
