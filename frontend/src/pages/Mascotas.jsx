// src/pages/Mascotas.jsx
// Vista principal para la gestión de Mascotas con soporte para múltiples clientes
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { obtenerMascotas, eliminarMascota, obtenerPropietarios } from '../services/mascotas';

export default function Mascotas() {
  const [mascotas, setMascotas] = useState([]);
  const [propietarios, setPropietarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEspecie, setFiltroEspecie] = useState('');
  const [filtroCliente, setFiltroCliente] = useState('');
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [listadoMascotas, listadoPropietarios] = await Promise.all([
        obtenerMascotas({
          search: busqueda || undefined,
          especie: filtroEspecie || undefined,
          propietario_id: filtroCliente || undefined,
        }),
        obtenerPropietarios().catch(() => [])
      ]);
      setMascotas(Array.isArray(listadoMascotas) ? listadoMascotas : []);
      setPropietarios(Array.isArray(listadoPropietarios) ? listadoPropietarios : []);
    } catch (err) {
      console.error('Error al cargar mascotas:', err);
      setMensaje({ tipo: 'error', texto: 'No se pudieron cargar las mascotas. Verifica la conexión con el servidor.' });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [filtroEspecie, filtroCliente]);

  const handleBuscar = (e) => {
    e.preventDefault();
    cargarDatos();
  };

  const handleEliminar = async (id, nombre) => {
    const confirmar = window.confirm(`¿Estás seguro de que deseas eliminar a la mascota "${nombre}"?`);
    if (!confirmar) return;

    try {
      await eliminarMascota(id);
      setMensaje({ tipo: 'success', texto: `Mascota "${nombre}" eliminada exitosamente.` });
      setMascotas(mascotas.filter((m) => m.id !== id));
    } catch (err) {
      console.error('Error al eliminar mascota:', err);
      setMensaje({ tipo: 'error', texto: 'No se pudo eliminar la mascota. Intenta nuevamente.' });
    }
  };

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1>🐾 Gestión de Mascotas</h1>
          <p className="subtitle">
            Administración clínica de pacientes y control de clientes propietarios
          </p>
        </div>
        <Link to="/mascotas/nueva" className="btn btn-primary">
          ➕ Registrar Nueva Mascota
        </Link>
      </div>

      {mensaje.texto && (
        <div className={`alert alert-${mensaje.tipo === 'error' ? 'danger' : 'success'}`}>
          {mensaje.texto}
        </div>
      )}

      {/* Barra de Filtros y Búsqueda */}
      <div className="card filters-card" style={{ marginBottom: '24px', padding: '16px' }}>
        <form onSubmit={handleBuscar} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '1 1 200px' }}>
            <input
              type="text"
              placeholder="🔍 Buscar por nombre, raza o cliente..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="form-control"
            />
          </div>

          <div style={{ minWidth: '150px' }}>
            <select
              value={filtroEspecie}
              onChange={(e) => setFiltroEspecie(e.target.value)}
              className="form-control"
            >
              <option value="">Todas las especies</option>
              <option value="Canino">🐶 Canino</option>
              <option value="Felino">🐱 Felino</option>
              <option value="Ave">🦜 Ave</option>
              <option value="Otro">🐾 Otro</option>
            </select>
          </div>

          <div style={{ minWidth: '180px' }}>
            <select
              value={filtroCliente}
              onChange={(e) => setFiltroCliente(e.target.value)}
              className="form-control"
            >
              <option value="">Todos los clientes</option>
              {propietarios.map((p) => (
                <option key={p.id} value={p.id}>
                  👤 {p.nombre}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-secondary">
            Buscar
          </button>
          {(busqueda || filtroEspecie || filtroCliente) && (
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                setBusqueda('');
                setFiltroEspecie('');
                setFiltroCliente('');
              }}
            >
              Limpiar
            </button>
          )}
        </form>
      </div>

      {/* Contenido Principal */}
      {cargando ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>⏳ Cargando listado de mascotas...</p>
        </div>
      ) : mascotas.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <h3>No se encontraron mascotas registradas</h3>
          <p className="text-muted" style={{ margin: '12px 0 20px' }}>
            No hay registros que coincidan con los filtros o aún no se han agregado pacientes.
          </p>
          <Link to="/mascotas/nueva" className="btn btn-primary">
            ➕ Registrar la primera mascota
          </Link>
        </div>
      ) : (
        <div className="mascotas-grid">
          {mascotas.map((m) => (
            <div key={m.id} className="card mascota-card">
              <div className="mascota-card-header">
                <div>
                  <span className={`badge badge-especie badge-${(m.especie || '').toLowerCase()}`}>
                    {m.especie === 'Felino' ? '🐱 Felino' : m.especie === 'Canino' ? '🐶 Canino' : '🐾 ' + m.especie}
                  </span>
                  <span className="badge badge-chip" style={{ marginLeft: '8px' }}>
                    {m.codigo_chip || 'Sin chip'}
                  </span>
                </div>
                <span className="mascota-sexo">
                  {m.sexo === 'Hembra' ? '♀ Hembra' : '♂ Macho'}
                </span>
              </div>

              <div className="mascota-card-body">
                <h3 className="mascota-nombre">{m.nombre}</h3>
                <p className="mascota-raza"><strong>Raza:</strong> {m.raza || 'Criollo'}</p>
                <div className="mascota-stats">
                  <div>
                    <span className="stat-label">Edad:</span>
                    <span className="stat-val">{m.edad} {m.edad === 1 ? 'año' : 'años'}</span>
                  </div>
                  <div>
                    <span className="stat-label">Peso:</span>
                    <span className="stat-val">{m.peso_kg ? `${m.peso_kg} kg` : 'N/A'}</span>
                  </div>
                </div>

                <div className="mascota-cliente-box">
                  <span className="cliente-label">👤 Cliente / Propietario:</span>
                  <p className="cliente-nombre">
                    <strong>{m.propietario_nombre || 'Cliente General'}</strong>
                  </p>
                  {m.propietario_identificacion && (
                    <small className="text-muted">C.C. {m.propietario_identificacion}</small>
                  )}
                </div>
              </div>

              <div className="card-footer actions" style={{ marginTop: 'auto' }}>
                <Link to={`/mascotas/editar/${m.id}`} className="btn btn-secondary btn-sm">
                  ✏️ Editar
                </Link>
                <button
                  onClick={() => handleEliminar(m.id, m.nombre)}
                  className="btn btn-danger btn-sm"
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
