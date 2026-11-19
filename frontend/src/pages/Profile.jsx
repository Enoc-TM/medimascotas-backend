// src/pages/Profile.jsx
// Visualización del perfil del usuario autenticado
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, deleteAccount, logout } = useAuth();
  const navigate = useNavigate();
  const [eliminando, setEliminando] = useState(false);

  const handleEliminarCuenta = async () => {
    const confirmacion = window.confirm(
      '⚠️ ATENCIÓN: ¿Deseas eliminar definitivamente tu usuario de la base de datos?\nEsta acción no se puede deshacer.'
    );

    if (!confirmacion) return;

    try {
      setEliminando(true);
      await deleteAccount();
      alert('✅ Tu usuario ha sido eliminado exitosamente de la base de datos.');
      navigate('/login');
    } catch (err) {
      console.error('Error al eliminar cuenta:', err);
      alert('❌ Ocurrió un error al intentar eliminar la cuenta.');
      setEliminando(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="card profile-card">
        <div className="profile-header">
          <div className="avatar-circle">
            {(user?.nombre || user?.name || 'U').charAt(0).toUpperCase()}
          </div>
          <h2>{user?.nombre || user?.name}</h2>
          <span className="badge badge-role">{user?.rol || 'propietario'}</span>
        </div>

        <div className="profile-details">
          <div className="detail-row">
            <span className="label">ID de Usuario:</span>
            <span className="value font-mono">#{user?.id}</span>
          </div>

          <div className="detail-row">
            <span className="label">Correo Electrónico:</span>
            <span className="value">{user?.email}</span>
          </div>

          <div className="detail-row">
            <span className="label">Teléfono:</span>
            <span className="value">{user?.telefono || 'No especificado'}</span>
          </div>

          <div className="detail-row">
            <span className="label">Rol en el Sistema:</span>
            <span className="value">{user?.rol || 'propietario'}</span>
          </div>

          {user?.fecha_creacion && (
            <div className="detail-row">
              <span className="label">Fecha de Registro:</span>
              <span className="value">
                {new Date(user.fecha_creacion).toLocaleString()}
              </span>
            </div>
          )}
        </div>

        <div className="profile-actions">
          <Link to="/perfil/editar" className="btn btn-primary">
            ✏️ Editar Información
          </Link>

          <Link to="/dashboard" className="btn btn-secondary">
            ⬅️ Volver al Dashboard
          </Link>

          <button
            onClick={handleEliminarCuenta}
            className="btn btn-danger"
            disabled={eliminando}
          >
            {eliminando ? 'Eliminando...' : '🗑️ Eliminar Perfil'}
          </button>
        </div>
      </div>
    </div>
  );
}
