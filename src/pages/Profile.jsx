import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <div className="card-container">
      <div className="auth-card">
        <h1>Mi perfil</h1>
        <p><b>ID:</b> {user?.id}</p>
        <p><b>Nombre:</b> {user?.name || user?.nombre}</p>
        <p><b>Correo:</b> {user?.email}</p>
        <p><b>Rol:</b> {user?.rol || 'veterinario / usuario'}</p>
        {user?.telefono && <p><b>Teléfono:</b> {user.telefono}</p>}

        <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <Link to="/perfil/editar" className="btn-secondary">Editar perfil</Link>
          <button onClick={logout} className="btn-danger">Cerrar Sesión</button>
        </div>
      </div>
    </div>
  );
}
