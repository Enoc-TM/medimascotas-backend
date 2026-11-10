import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { obtenerMascotas, eliminarMascota } from '../services/mascotas';

export default function Mascotas() {
  const [mascotas, setMascotas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await obtenerMascotas();
      setMascotas(Array.isArray(data) ? data : data.mascotas || []);
    } catch (err) {
      setError('Error al cargar la lista de mascotas');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta mascota?')) return;
    try {
      await eliminarMascota(id);
      setMascotas(mascotas.filter((m) => m.id !== id));
    } catch (err) {
      alert('Error al eliminar la mascota');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1>Gestión de Mascotas (CRUD)</h1>
        <Link to="/mascotas/nueva" className="btn-primary">+ Nueva Mascota</Link>
      </div>

      {error && <p className="alert-error">{error}</p>}
      {cargando ? (
        <p>Cargando mascotas...</p>
      ) : mascotas.length === 0 ? (
        <p>No hay mascotas registradas actualmente.</p>
      ) : (
        <table className="tabla-crud">
          <thead>
            <tr>
              <th>ID</th>
              <th>Chip</th>
              <th>Nombre</th>
              <th>Especie</th>
              <th>Raza</th>
              <th>Edad</th>
              <th>Peso (kg)</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {mascotas.map((m) => (
              <tr key={m.id}>
                <td>{m.id}</td>
                <td>{m.codigo_chip || 'N/A'}</td>
                <td><b>{m.nombre}</b></td>
                <td>{m.especie}</td>
                <td>{m.raza}</td>
                <td>{m.edad}</td>
                <td>{m.peso_kg || 'N/A'}</td>
                <td>
                  <Link to={`/mascotas/editar/${m.id}`} className="btn-small btn-secondary">Editar</Link>{' '}
                  <button onClick={() => handleEliminar(m.id)} className="btn-small btn-danger">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
