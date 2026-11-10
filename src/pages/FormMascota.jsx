import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { crearMascota, obtenerMascotaPorId, actualizarMascota } from '../services/mascotas';

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
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (esEdicion) {
      obtenerMascotaPorId(id)
        .then((m) => {
          if (m) {
            setForm({
              nombre: m.nombre || '',
              especie: m.especie || 'Canino',
              raza: m.raza || '',
              edad: m.edad || '',
              sexo: m.sexo || 'Macho',
              peso_kg: m.peso_kg || '',
              codigo_chip: m.codigo_chip || '',
              propietario_id: m.propietario_id || '1',
            });
          }
        })
        .catch(() => setError('No se pudo cargar la información de la mascota'));
    }
  }, [id, esEdicion]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setGuardando(true);

    try {
      if (esEdicion) {
        await actualizarMascota(id, form);
      } else {
        await crearMascota(form);
      }
      navigate('/mascotas');
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Error al guardar');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="card-container">
      <form onSubmit={onSubmit} className="auth-card" style={{ maxWidth: '500px' }}>
        <h1>{esEdicion ? 'Editar Mascota' : 'Registrar Nueva Mascota'}</h1>
        {error && <p className="alert-error">{error}</p>}

        <p>
          <label>Nombre:</label>
          <input name="nombre" value={form.nombre} onChange={onChange} placeholder="Nombre de la mascota" required />
        </p>

        <p>
          <label>Especie:</label>
          <select name="especie" value={form.especie} onChange={onChange}>
            <option value="Canino">Canino</option>
            <option value="Felino">Felino</option>
            <option value="Ave">Ave</option>
            <option value="Otro">Otro</option>
          </select>
        </p>

        <p>
          <label>Raza:</label>
          <input name="raza" value={form.raza} onChange={onChange} placeholder="Ej: Labrador, Siamés..." required />
        </p>

        <p>
          <label>Edad (años):</label>
          <input name="edad" type="number" value={form.edad} onChange={onChange} placeholder="Edad" required />
        </p>

        <p>
          <label>Sexo:</label>
          <select name="sexo" value={form.sexo} onChange={onChange}>
            <option value="Macho">Macho</option>
            <option value="Hembra">Hembra</option>
          </select>
        </p>

        <p>
          <label>Peso (kg):</label>
          <input name="peso_kg" type="number" step="0.1" value={form.peso_kg} onChange={onChange} placeholder="Ej: 12.5" />
        </p>

        <p>
          <label>Código Chip:</label>
          <input name="codigo_chip" value={form.codigo_chip} onChange={onChange} placeholder="CHIP-123456" />
        </p>

        <div style={{ marginTop: '20px' }}>
          <button type="submit" disabled={guardando}>
            {guardando ? 'Guardando...' : esEdicion ? 'Actualizar Mascota' : 'Crear Mascota'}
          </button>{' '}
          <button type="button" onClick={() => navigate('/mascotas')} className="btn-secondary">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
