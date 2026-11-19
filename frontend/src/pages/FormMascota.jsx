// src/pages/FormMascota.jsx
// Formulario para registrar o editar una mascota y asociarla a un cliente
import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { crearMascota, obtenerMascotaPorId, actualizarMascota, obtenerPropietarios } from '../services/mascotas';

export default function FormMascota() {
  const { id } = useParams();
  const esEdicion = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: '',
    especie: 'Canino',
    raza: '',
    edad: '',
    sexo: 'Macho',
    peso_kg: '',
    codigo_chip: '',
    propietario_id: '1',
  });

  const [propietarios, setPropietarios] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Cargar clientes/propietarios
    obtenerPropietarios()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPropietarios(data);
          if (!esEdicion) {
            setForm((prev) => ({ ...prev, propietario_id: String(data[0].id) }));
          }
        }
      })
      .catch((err) => console.warn('Error al cargar propietarios:', err));

    if (esEdicion) {
      setCargando(true);
      obtenerMascotaPorId(id)
        .then((m) => {
          if (m) {
            setForm({
              nombre: m.nombre || '',
              especie: m.especie || 'Canino',
              raza: m.raza || '',
              edad: m.edad !== undefined ? String(m.edad) : '',
              sexo: m.sexo || 'Macho',
              peso_kg: m.peso_kg !== undefined ? String(m.peso_kg) : '',
              codigo_chip: m.codigo_chip || '',
              propietario_id: m.propietario_id ? String(m.propietario_id) : '1',
            });
          }
        })
        .catch((err) => {
          console.error(err);
          setError('No se pudo cargar la información de la mascota');
        })
        .finally(() => setCargando(false));
    }
  }, [id, esEdicion]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.nombre.trim()) {
      setError('El nombre de la mascota es obligatorio.');
      return;
    }

    setGuardando(true);
    try {
      if (esEdicion) {
        await actualizarMascota(id, form);
      } else {
        await crearMascota(form);
      }
      navigate('/mascotas');
    } catch (err) {
      console.error('Error al guardar mascota:', err);
      const msg = err.response?.data?.error || err.response?.data?.mensaje || 'Error al guardar la información.';
      setError(msg);
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '60px' }}>
        <p>⏳ Cargando datos de la mascota...</p>
      </div>
    );
  }

  return (
    <div className="auth-wrapper" style={{ maxWidth: '650px', margin: '40px auto' }}>
      <div className="card auth-card">
        <div className="auth-header">
          <h2>{esEdicion ? '✏️ Editar Mascota' : '🐾 Registrar Nueva Mascota'}</h2>
          <p className="subtitle">
            {esEdicion
              ? 'Actualiza los datos médicos y de propiedad de la mascota'
              : 'Asocia una nueva mascota paciente a uno de los clientes registrados'}
          </p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label htmlFor="nombre">Nombre de la Mascota *</label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                className="form-control"
                placeholder="Ej: Lucas, Mishi..."
                value={form.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="especie">Especie *</label>
              <select
                id="especie"
                name="especie"
                className="form-control"
                value={form.especie}
                onChange={handleChange}
                required
              >
                <option value="Canino">🐶 Canino (Perro)</option>
                <option value="Felino">🐱 Felino (Gato)</option>
                <option value="Ave">🦜 Ave</option>
                <option value="Otro">🐾 Otro</option>
              </select>
            </div>
          </div>

          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label htmlFor="raza">Raza</label>
              <input
                id="raza"
                name="raza"
                type="text"
                className="form-control"
                placeholder="Ej: Golden Retriever, Siamés..."
                value={form.raza}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="sexo">Sexo</label>
              <select
                id="sexo"
                name="sexo"
                className="form-control"
                value={form.sexo}
                onChange={handleChange}
              >
                <option value="Macho">♂ Macho</option>
                <option value="Hembra">♀ Hembra</option>
              </select>
            </div>
          </div>

          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label htmlFor="edad">Edad (Años)</label>
              <input
                id="edad"
                name="edad"
                type="number"
                min="0"
                max="30"
                className="form-control"
                placeholder="Ej: 3"
                value={form.edad}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="peso_kg">Peso (Kilogramos)</label>
              <input
                id="peso_kg"
                name="peso_kg"
                type="number"
                step="0.1"
                min="0"
                className="form-control"
                placeholder="Ej: 14.5"
                value={form.peso_kg}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="codigo_chip">Código de Microchip (Opcional)</label>
            <input
              id="codigo_chip"
              name="codigo_chip"
              type="text"
              className="form-control"
              placeholder="Ej: CHIP-982101 (se generará uno automático si se deja en blanco)"
              value={form.codigo_chip}
              onChange={handleChange}
            />
          </div>

          {/* ASOCIACIÓN A CLIENTES */}
          <div className="form-group" style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <label htmlFor="propietario_id" style={{ fontWeight: 600, color: '#1e293b' }}>
              👤 Cliente / Propietario Responsable *
            </label>
            <select
              id="propietario_id"
              name="propietario_id"
              className="form-control"
              value={form.propietario_id}
              onChange={handleChange}
              required
              style={{ marginTop: '6px' }}
            >
              {propietarios.length > 0 ? (
                propietarios.map((p) => (
                  <option key={p.id} value={p.id}>
                    Cliente: {p.nombre} — {p.identificacion ? `(C.C. ${p.identificacion})` : ''} ({p.email || p.telefono})
                  </option>
                ))
              ) : (
                <>
                  <option value="1">Cliente 1: Esteban Fierro (1010203040)</option>
                  <option value="2">Cliente 2: Enoc Tamayo (1098765432)</option>
                </>
              )}
            </select>
            <small className="text-muted" style={{ display: 'block', marginTop: '6px' }}>
              Permite demostrar la relación de base de datos relacional entre propietarios y sus múltiples mascotas.
            </small>
          </div>

          <div className="form-actions" style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button type="submit" className="btn btn-primary" disabled={guardando} style={{ flex: 1 }}>
              {guardando ? 'Guardando...' : esEdicion ? '💾 Guardar Cambios' : '🐾 Crear Mascota'}
            </button>
            <Link to="/mascotas" className="btn btn-secondary">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
