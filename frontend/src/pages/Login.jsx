// src/pages/Login.jsx
// Formulario de Inicio de Sesión y Autenticación con Logo
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Error al verificar credenciales. Verifica correo y contraseña.'
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
          <h2>Iniciar Sesión</h2>
          <p className="card-subtitle">Ingresa tus credenciales para acceder a MediMascotas</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="form-group">
          <div className="input-field">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              id="email"
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="input-field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={cargando}
          >
            {cargando ? 'Verificando...' : 'Entrar al Sistema'}
          </button>
        </form>

        <div className="card-footer">
          <p>
            ¿No tienes cuenta aún?{' '}
            <Link to="/register" className="link-primary">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
