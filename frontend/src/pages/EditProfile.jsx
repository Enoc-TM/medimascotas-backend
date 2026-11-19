// src/pages/EditProfile.jsx
// Formulario para editar la información del perfil del usuario
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { actualizarPerfil } from '../services/auth';

export default function EditProfile() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState(user?.nombre || user?.name || '');
  const [telefono, setTelefono] = useState(user?.telefono || '');
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setGuardando(true);

    try {
      await actualizarPerfil({
        nombre,
        telefono
      });

      // Refrescar el estado global del usuario para que el navbar y demás vistas muestren los nuevos datos
      await refreshUser();
      alert('✅ Información del perfil actualizada exitosamente en la base de datos.');
      navigate('/perfil');
    } catch (err) {
      console.error('Error al actualizar perfil:', err);
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Error al guardar los cambios en la base de datos.'
      );
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="card-header">
          <h2>Editar Información del Perfil</h2>
          <p className="card-subtitle">
            Actualiza tus datos personales. Los cambios se guardarán en MySQL.
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="form-group">
          <div className="input-field">
            <label htmlFor="nombre">Nombre Completo *</label>
            <input
              id="nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre completo"
              required
            />
          </div>

          <div className="input-field">
            <label htmlFor="email">Correo Electrónico (No editable)</label>
            <input
              id="email"
              type="email"
              value={user?.email || ''}
              disabled
              className="input-disabled"
              title="El correo no se puede cambiar por políticas de seguridad"
            />
          </div>

          <div className="input-field">
            <label htmlFor="telefono">Teléfono / Celular</label>
            <input
              id="telefono"
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="3101234567"
            />
          </div>

          <div className="button-group">
            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={guardando}
            >
              {guardando ? 'Guardando en Base de Datos...' : '💾 Guardar Cambios'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/perfil')}
              className="btn btn-secondary btn-block"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
