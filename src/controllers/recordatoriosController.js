// src/controllers/recordatoriosController.js
// Controlador para la gestion de recordatorios medicos (vacunas, consultas, tratamientos)
// Entidad oficial de MediMascotas (especificada en el documento de arquitectura)
// Asignado a: Santiago Avila
const Recordatorio = require('../models/Recordatorio');
const Mascota = require('../models/Mascota');

exports.create = async (req, res, next) => {
  try {
    const { mascota_id, tipo = 'consulta', titulo, descripcion = '', fecha_recordatorio, estado = 'pendiente' } = req.body;

    if (!mascota_id || !titulo || !fecha_recordatorio) {
      return res.status(400).json({
        error: 'RN-14: Los campos mascota_id, titulo y fecha_recordatorio son obligatorios'
      });
    }

    const mascota = await Mascota.findById(mascota_id);
    if (!mascota || mascota.activo === false) {
      return res.status(404).json({
        error: 'No se puede programar un recordatorio para una mascota inexistente o inactiva'
      });
    }

    const nuevoRecordatorio = await Recordatorio.create({
      mascota_id,
      tipo,
      titulo,
      descripcion,
      fecha_recordatorio,
      estado
    });

    return res.status(201).json({
      mensaje: 'Recordatorio programado exitosamente',
      recordatorio: nuevoRecordatorio
    });
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const { estado, mascota_id } = req.query;
    const list = await Recordatorio.findAll({ estado, mascota_id });
    return res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const rec = await Recordatorio.findById(req.params.id);
    if (!rec) {
      return res.status(404).json({ error: 'Recordatorio no encontrado' });
    }
    return res.status(200).json(rec);
  } catch (err) {
    next(err);
  }
};

exports.getByMascota = async (req, res, next) => {
  try {
    const list = await Recordatorio.findByMascotaId(req.params.mascotaId);
    return res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const updated = await Recordatorio.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Recordatorio no encontrado' });
    }
    return res.status(200).json({
      mensaje: 'Recordatorio actualizado exitosamente',
      recordatorio: updated
    });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const ok = await Recordatorio.delete(req.params.id);
    if (!ok) {
      return res.status(404).json({ error: 'Recordatorio no encontrado' });
    }
    return res.status(200).json({
      mensaje: 'Recordatorio eliminado exitosamente',
      id: parseInt(req.params.id, 10)
    });
  } catch (err) {
    next(err);
  }
};
