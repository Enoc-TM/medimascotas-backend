import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registrar } from '../services/auth';

export default function Login({ initialMode = 'login' }) {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [modo, setModo] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');

  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      if (modo === 'login') {
        await login(email, password);
      } else {
        await registrar({ name: nombre, nombre, email, password, telefono });
        await login(email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Error al procesar la solicitud');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ maxWidth: '360px', margin: '40px auto' }}>
      <h1>{modo === 'login' ? 'Login' : 'Registro'}</h1>

      {error && <div className="alert-error">{error}</div>}

      <div style={{ marginBottom: '15px' }}>
        <button
          type="button"
          onClick={() => { setModo('login'); setError(''); }}
          style={{ marginRight: '8px', fontWeight: modo === 'login' ? 'bold' : 'normal' }}
        >
          Iniciar Sesión
        </button>
        <button
          type="button"
          onClick={() => { setModo('register'); setError(''); }}
          style={{ fontWeight: modo === 'register' ? 'bold' : 'normal' }}
        >
          Registrarse
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {modo === 'register' && (
          <>
            <label>Nombre:</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre completo"
              required
            />
            <label>Teléfono (opcional):</label>
            <input
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="3101234567"
            />
          </>
        )}

        <label>Correo:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="correo@ejemplo.com"
          required
        />

        <label>Contraseña:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          required
        />

        <button type="submit" disabled={cargando} style={{ marginTop: '10px' }}>
          {cargando ? 'Cargando...' : modo === 'login' ? 'Ingresar' : 'Registrarme'}
        </button>
      </form>
    </div>
  );
}
