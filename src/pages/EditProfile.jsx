import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { actualizarPerfil, obtenerPerfil } from '../services/auth';

export default function EditProfile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: user?.name || user?.nombre || '',
    email: user?.email || '',
    telefono: user?.telefono || '',
  });
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setGuardando(true);
    try {
      await actualizarPerfil({ ...form, nombre: form.name });
      const actualizado = await obtenerPerfil();
      setUser(actualizado.usuario || actualizado); // refresca los datos mostrados
      navigate('/perfil');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'No se pudo actualizar el perfil');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="card-container">
      <form onSubmit={onSubmit} className="auth-card">
        <h1>Editar perfil</h1>
        {error && <p className="alert-error">{error}</p>}
        <p>
          <label>Nombre:</label>
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="Nombre"
            required
          />
        </p>
        <p>
          <label>Correo:</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            placeholder="Correo"
            required
          />
        </p>
        <p>
          <label>Teléfono:</label>
          <input
            name="telefono"
            value={form.telefono}
            onChange={onChange}
            placeholder="Teléfono"
          />
        </p>
        <button type="submit" disabled={guardando}>
          {guardando ? 'Guardando...' : 'Guardar cambios'}
        </button>{' '}
        <button type="button" onClick={() => navigate('/perfil')} className="btn-secondary">
          Cancelar
        </button>
      </form>
    </div>
  );
}
