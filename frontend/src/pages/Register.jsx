// src/pages/Register.jsx
// Formulario de Registro de Usuario en la Base de Datos con Logo
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telefono, setTelefono] = useState('');

  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      await registerUser({
        nombre,
        email,
        password,
        telefono
      });
      // Redirige directamente al Dashboard al quedar autenticado con el token generado
      navigate('/dashboard');
    } catch (err) {
      console.error('Error de registro:', err);
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Error al conectar con el servidor. Verifica que el backend esté en ejecución.'
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="card-header" style={{ textAlign: 'center' }}>
          <img src="/logo.png" alt="MediMascotas" className="auth-logo-img" />
          <h2>Crear Nueva Cuenta</h2>
          <p className="card-subtitle">Registra tus datos para acceder a MediMascotas</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="form-group">
          <div className="input-field">
            <label htmlFor="nombre">Nombre Completo</label>
            <input
              id="nombre"
              type="text"
              placeholder="Ej: Carlos Pérez"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="input-field">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              id="email"
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-field">
            <label htmlFor="telefono">Teléfono / Celular</label>
            <input
              id="telefono"
              type="tel"
              placeholder="Ej: 3001234567"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
          </div>

          <div className="input-field">
            <label htmlFor="password">Contraseña (Mínimo 6 caracteres)</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={cargando}
          >
            {cargando ? 'Registrando en Base de Datos...' : 'Registrar Cuenta'}
          </button>
        </form>

        <div className="card-footer">
          <p>
            ¿Ya tienes una cuenta registrada?{' '}
            <Link to="/login" className="link-primary">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
