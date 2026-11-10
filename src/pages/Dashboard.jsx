import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const nombre = user?.name || user?.nombre || 'Juanito';

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard</h1>
      <p>Bienvenido, <b>{nombre}</b>.</p>

      <div style={{ margin: '20px 0', padding: '15px', border: '1px solid #ccc', borderRadius: '4px' }}>
        <h3>Datos de la sesión</h3>
        <p><b>Usuario:</b> {nombre}</p>
        <p><b>Correo:</b> {user?.email}</p>
        <p><b>Rol:</b> {user?.rol || 'Veterinario'}</p>
      </div>

      <div style={{ margin: '20px 0', padding: '15px', border: '1px solid #ccc', borderRadius: '4px' }}>
        <h3>Menú de opciones</h3>
        <ul>
          <li><Link to="/mascotas">Gestión de Mascotas (CRUD)</Link></li>
          <li><Link to="/mascotas/nueva">Registrar Nueva Mascota</Link></li>
          <li><Link to="/perfil">Mi Perfil</Link></li>
        </ul>
      </div>
    </div>
  );
}
