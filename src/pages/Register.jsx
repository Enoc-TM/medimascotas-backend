import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registrar } from '../services/auth';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      await registrar({ ...form, nombre: form.name });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'No se pudo registrar');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="card-container">
      <form onSubmit={onSubmit} className="auth-card">
        <h1>Crear cuenta</h1>
        {error && <p className="alert-error">{error}</p>}
        <p>
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="Nombre completo"
            required
          />
        </p>
        <p>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            placeholder="Correo electrónico"
            required
          />
        </p>
        <p>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            placeholder="Contraseña"
            required
          />
        </p>
        <button type="submit" disabled={cargando}>
          {cargando ? 'Registrando...' : 'Registrarme'}
        </button>
        <p>¿Ya tienes cuenta? <Link to="/login">Ingresa</Link></p>
      </form>
    </div>
  );
}
