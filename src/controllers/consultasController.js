// src/controllers/consultasController.js
const store = require('../data/store');

exports.create = (req, res) => {
  const {
    mascota_id,
    veterinario_id,
    fecha,
    hora = '08:00',
    motivo,
    observaciones = '',
    diagnosticos = [],
    tratamientos = [],
    medicamentos = []
  } = req.body;

  // RN-14: Validacion de datos obligatorios
  if (!mascota_id || !veterinario_id || !fecha || !motivo) {
    return res.status(400).json({
      error: 'RN-14: Los campos mascota_id, veterinario_id, fecha y motivo son obligatorios'
    });
  }

  // RN-05: Registro valido de consultas (mascota registrada y activa)
  const mascota = store.mascotas.find(m => m.id === parseInt(mascota_id, 10) && m.activo !== false);
  if (!mascota) {
    return res.status(404).json({
      error: 'RN-05: No se puede registrar una consulta si la mascota no esta previamente registrada o se encuentra inactiva'
    });
  }

  // RN-06 y RN-12: Asociacion a usuario veterinario y control de acceso por roles
  const veterinario = store.usuarios.find(u => u.id === parseInt(veterinario_id, 10));
  if (!veterinario || !['veterinario', 'admin'].includes(veterinario.rol)) {
    return res.status(403).json({
      error: 'RN-12: Solo usuarios con rol de veterinario o administrador pueden registrar consultas y diagnosticos'
    });
  }

  // RN-07: Registro de diagnostico obligatorio
  if (!Array.isArray(diagnosticos) || diagnosticos.length === 0) {
    return res.status(400).json({
      error: 'RN-07: Cada consulta debe contener al menos un diagnostico para ser valida'
    });
  }

  // RN-15: Coherencia de fechas
  const fechaConsulta = new Date(fecha);
  if (isNaN(fechaConsulta.getTime())) {
    return res.status(400).json({
      error: 'RN-15: La fecha de la consulta no es valida'
    });
  }

  const historial = store.historiales.find(h => h.mascota_id === mascota.id);

  // Crear diagnosticos asignando IDs
  const diagnosticosProcesados = diagnosticos.map(d => ({
    id: store.counters.diagnosticos++,
    descripcion: typeof d === 'string' ? d : (d.descripcion || 'Diagnostico general'),
    gravedad: typeof d === 'object' && d.gravedad ? d.gravedad : 'leve',
    fecha: fecha
  }));

  // RN-08: Relacion tratamiento - diagnostico
  const tratamientosProcesados = tratamientos.map(t => ({
    id: store.counters.tratamientos++,
    diagnostico_id: diagnosticosProcesados[0].id,
    descripcion: typeof t === 'string' ? t : (t.descripcion || 'Tratamiento indicado'),
    duracion: typeof t === 'object' && t.duracion ? t.duracion : 'Segun evolucion',
    fecha_inicio: fecha,
    fecha_fin: typeof t === 'object' && t.fecha_fin ? t.fecha_fin : null
  }));

  // RN-09: Medicamentos solo dentro de una consulta
  const medicamentosProcesados = medicamentos.map(m => ({
    id: store.counters.medicamentos++,
    nombre: typeof m === 'string' ? m : (m.nombre || 'Medicamento formulado'),
    dosis: typeof m === 'object' && m.dosis ? m.dosis : 'Segun peso',
    frecuencia: typeof m === 'object' && m.frecuencia ? m.frecuencia : 'Cada 12 horas',
    duracion: typeof m === 'object' && m.duracion ? m.duracion : '7 dias',
    indicaciones: typeof m === 'object' && m.indicaciones ? m.indicaciones : 'Via oral'
  }));

  const nuevaConsulta = {
    id: store.counters.consultas++,
    historial_id: historial ? historial.id : null,
    mascota_id: mascota.id,
    veterinario_id: veterinario.id,
    veterinario_nombre: veterinario.nombre,
    fecha,
    hora,
    motivo,
    observaciones,
    diagnosticos: diagnosticosProcesados,
    tratamientos: tratamientosProcesados,
    medicamentos: medicamentosProcesados,
    estado: 'completada'
  };

  store.consultas.push(nuevaConsulta);

  return res.status(201).json({
    mensaje: 'Consulta veterinaria registrada exitosamente con diagnostico y tratamiento',
    consulta: nuevaConsulta
  });
};

exports.getAll = (req, res) => {
  return res.status(200).json(store.consultas);
};

exports.getByMascota = (req, res) => {
  const mascotaId = parseInt(req.params.mascotaId, 10);
  const consultas = store.consultas.filter(c => c.mascota_id === mascotaId);
  return res.status(200).json(consultas);
};

exports.getById = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const consulta = store.consultas.find(c => c.id === id);

  if (!consulta) {
    return res.status(404).json({ error: 'Consulta no encontrada' });
  }

  return res.status(200).json(consulta);
};

exports.update = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const consulta = store.consultas.find(c => c.id === id);

  if (!consulta) {
    return res.status(404).json({ error: 'Consulta no encontrada' });
  }

  const { observaciones, estado } = req.body;
  if (observaciones !== undefined) consulta.observaciones = observaciones;
  if (estado && ['completada', 'en_progreso', 'cancelada'].includes(estado)) {
    consulta.estado = estado;
  }

  return res.status(200).json({
    mensaje: 'Consulta actualizada exitosamente',
    consulta
  });
};
