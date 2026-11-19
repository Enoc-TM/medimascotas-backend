// src/pages/Dashboard.jsx
// Panel Principal del Sistema - MediMascotas
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { obtenerMascotas } from '../services/mascotas';

export default function Dashboard() {
  const { user, logout, deleteAccount } = useAuth();
  const navigate = useNavigate();

  const [totalMascotas, setTotalMascotas] = useState(0);
  const [cargandoMascotas, setCargandoMascotas] = useState(true);
  const [eliminando, setEliminando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    obtenerMascotas()
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setTotalMascotas(list.length);
      })
      .catch((err) => console.warn('Error al obtener conteo de mascotas:', err))
      .finally(() => setCargandoMascotas(false));
  }, []);

  const handleEliminarCuenta = async () => {
    const confirmacion = window.confirm(
      '⚠️ ¿Estás seguro de que deseas eliminar tu cuenta permanentemente?\nEsta acción borrará tus registros de la base de datos de manera irreversible.'
    );

    if (!confirmacion) return;

    try {
      setEliminando(true);
      await deleteAccount();
      alert('✅ Cuenta eliminada correctamente de la base de datos.');
      navigate('/login');
    } catch (err) {
      console.error('Error al eliminar cuenta:', err);
      alert('❌ No se pudo eliminar la cuenta. Intenta de nuevo.');
      setEliminando(false);
    }
  };

  const nombreUsuario = user?.nombre || user?.name || 'Usuario';

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>¡Bienvenido, {nombreUsuario}! 👋</h1>
        <p className="subtitle">
          Sistema integral de gestión de historial clínico veterinario y control de pacientes
        </p>
      </div>

      {mensaje && <div className="alert alert-success">{mensaje}</div>}

      <div className="dashboard-grid">
        {/* Tarjeta de Información de Usuario */}
        <div className="card dashboard-card">
          <div className="card-header">
            <h3>👤 Perfil de Usuario</h3>
          </div>
          <div className="card-body">
            <ul className="info-list">
              <li>
                <strong>Nombre:</strong>
                <span>{nombreUsuario}</span>
              </li>
              <li>
                <strong>Correo Electrónico:</strong>
                <span>{user?.email}</span>
              </li>
              <li>
                <strong>Rol en el Sistema:</strong>
                <span className="badge badge-role">{user?.rol || 'propietario'}</span>
              </li>
              <li>
                <strong>Teléfono:</strong>
                <span>{user?.telefono || 'No registrado'}</span>
              </li>
              {user?.fecha_creacion && (
                <li>
                  <strong>Fecha de Registro:</strong>
                  <span>{new Date(user.fecha_creacion).toLocaleDateString()}</span>
                </li>
              )}
            </ul>
          </div>
          <div className="card-footer actions">
            <Link to="/perfil/editar" className="btn btn-primary">
              ✏️ Editar Perfil
            </Link>
            <Link to="/perfil" className="btn btn-secondary">
              👁️ Ver Detalles
            </Link>
          </div>
        </div>

        {/* Tarjeta de Gestión de Mascotas y Clientes */}
        <div className="card dashboard-card">
          <div className="card-header">
            <h3>🐾 Gestión de Pacientes y Mascotas</h3>
          </div>
          <div className="card-body">
            <p style={{ color: '#475569', marginBottom: '16px', lineHeight: '1.5' }}>
              Administra los registros médicos de los pacientes caninos y felinos asociados a los diferentes clientes propietarios.
            </p>

            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, color: '#1e40af' }}>Mascotas Registradas:</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#2563eb' }}>
                  {cargandoMascotas ? '...' : totalMascotas}
                </span>
              </div>
              <small style={{ color: '#64748b', display: 'block', marginTop: '4px' }}>
                Pacientes vinculados activamente en la base de datos
              </small>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link to="/mascotas" className="btn btn-primary" style={{ textAlign: 'center' }}>
                📋 Ver Listado Completo de Mascotas
              </Link>
              <Link to="/mascotas/nueva" className="btn btn-outline" style={{ textAlign: 'center' }}>
                ➕ Registrar Nueva Mascota
              </Link>
            </div>
          </div>

          <div className="card-footer actions" style={{ borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
            <button
              onClick={handleEliminarCuenta}
              className="btn btn-danger"
              disabled={eliminando}
            >
              {eliminando ? 'Eliminando...' : '🗑️ Eliminar Mi Cuenta'}
            </button>
            <button onClick={logout} className="btn btn-outline">
              🚪 Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
