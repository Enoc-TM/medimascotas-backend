import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 20px',
      borderBottom: '1px solid #ccc',
      backgroundColor: '#f8f9fa'
    }}>
      <div>
        <Link to={user ? "/dashboard" : "/"} style={{ fontWeight: 'bold', textDecoration: 'none', color: '#000', fontSize: '18px' }}>
          🐾 MediMascotas
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {user ? (
          <>
            <Link to="/dashboard" style={{ textDecoration: 'none', color: '#000' }}>Dashboard</Link>
            <Link to="/mascotas" style={{ textDecoration: 'none', color: '#000' }}>Mascotas</Link>
            <Link to="/perfil" style={{ textDecoration: 'none', color: '#000' }}>Perfil</Link>
            <span style={{ fontWeight: 'bold' }}>👤 {user.name || user.nombre || 'Juanito'}</span>
            <button onClick={handleLogout} style={{ padding: '4px 10px', cursor: 'pointer' }}>
              Salir
            </button>
          </>
        ) : (
          <>
            <Link to="/" style={{ textDecoration: 'none', color: '#000' }}>Home</Link>
            <Link to="/login" style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>
              👤 Iniciar Sesión / Registrarse
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
