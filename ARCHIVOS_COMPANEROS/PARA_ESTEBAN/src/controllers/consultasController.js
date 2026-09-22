// src/controllers/consultasController.js
// Controlador para el registro y gestion de consultas veterinarias (RF-06, RF-07, RF-08, RF-09, CU-04, RN-05..09, RN-12, RN-15)
// Asignado a: Esteban Fierro
const Consulta = require('../models/Consulta');
const Mascota = require('../models/Mascota');
const Usuario = require('../models/Usuario');
const HistorialMedico = require('../models/HistorialMedico');
const Diagnostico = require('../models/Diagnostico');
const Tratamiento = require('../models/Tratamiento');
const Medicamento = require('../models/Medicamento');

exports.create = async (req, res, next) => {
  try {
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
    const mascota = await Mascota.findById(mascota_id);
    if (!mascota || mascota.activo === false) {
      return res.status(404).json({
        error: 'RN-05: No se puede registrar una consulta si la mascota no esta previamente registrada o se encuentra inactiva'
      });
    }

    // RN-06 y RN-12: Asociacion a usuario veterinario y control de acceso por roles
    const veterinario = await Usuario.findById(veterinario_id);
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

    const historial = await HistorialMedico.findByMascotaId(mascota.id);

    // Guardar consulta base
    const nuevaConsulta = await Consulta.create({
      historial_id: historial ? historial.id : null,
      mascota_id: mascota.id,
      veterinario_id: veterinario.id,
      veterinario_nombre: veterinario.nombre,
      fecha,
      hora,
      motivo,
      observaciones,
      diagnosticos: [],
      tratamientos: [],
      medicamentos: [],
      estado: 'completada'
    });

    // Guardar diagnosticos asociados a la consulta (RN-07)
    const diagnosticosGuardados = [];
    for (const d of diagnosticos) {
      const desc = typeof d === 'string' ? d : (d.descripcion || 'Diagnostico general');
      const grav = typeof d === 'object' && d.gravedad ? d.gravedad : 'leve';
      const diag = await Diagnostico.create({
        consulta_id: nuevaConsulta.id,
        descripcion: desc,
        gravedad: grav,
        fecha
      });
      diagnosticosGuardados.push(diag);
    }
    nuevaConsulta.diagnosticos = diagnosticosGuardados;

    // Guardar tratamientos asociados al primer diagnostico (RN-08)
    const tratamientosGuardados = [];
    if (Array.isArray(tratamientos) && diagnosticosGuardados.length > 0) {
      for (const t of tratamientos) {
        const desc = typeof t === 'string' ? t : (t.descripcion || 'Tratamiento indicado');
        const dur = typeof t === 'object' && t.duracion ? t.duracion : 'Segun evolucion';
        const fFin = typeof t === 'object' && t.fecha_fin ? t.fecha_fin : null;
        const trat = await Tratamiento.create({
          diagnostico_id: diagnosticosGuardados[0].id,
          descripcion: desc,
          duracion: dur,
          fecha_inicio: fecha,
          fecha_fin: fFin
        });
        tratamientosGuardados.push(trat);
      }
    }
    nuevaConsulta.tratamientos = tratamientosGuardados;

    // Guardar medicamentos asociados a la consulta (RN-09)
    const medicamentosGuardados = [];
    if (Array.isArray(medicamentos)) {
      for (const m of medicamentos) {
        const nom = typeof m === 'string' ? m : (m.nombre || 'Medicamento formulado');
        const dos = typeof m === 'object' && m.dosis ? m.dosis : 'Segun peso';
        const frec = typeof m === 'object' && m.frecuencia ? m.frecuencia : 'Cada 12 horas';
        const dur = typeof m === 'object' && m.duracion ? m.duracion : '7 dias';
        const ind = typeof m === 'object' && m.indicaciones ? m.indicaciones : 'Via oral';
        const med = await Medicamento.create({
          consulta_id: nuevaConsulta.id,
          nombre: nom,
          dosis: dos,
          frecuencia: frec,
          duracion: dur,
          indicaciones: ind
        });
        medicamentosGuardados.push(med);
      }
    }
    nuevaConsulta.medicamentos = medicamentosGuardados;

    return res.status(201).json({
      mensaje: 'Consulta veterinaria registrada exitosamente con diagnostico y tratamiento',
      consulta: nuevaConsulta
    });
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const list = await Consulta.findAll();
    return res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

exports.getByMascota = async (req, res, next) => {
  try {
    const list = await Consulta.findByMascotaId(req.params.mascotaId);
    return res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const consulta = await Consulta.findById(req.params.id);
    if (!consulta) {
      return res.status(404).json({ error: 'Consulta no encontrada' });
    }
    return res.status(200).json(consulta);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const updated = await Consulta.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Consulta no encontrada' });
    }
    return res.status(200).json({
      mensaje: 'Consulta actualizada exitosamente',
      consulta: updated
    });
  } catch (err) {
    next(err);
  }
};
