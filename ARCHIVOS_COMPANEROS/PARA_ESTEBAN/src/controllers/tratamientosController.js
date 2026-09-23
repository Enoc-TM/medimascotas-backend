// src/controllers/tratamientosController.js
// Controlador para la gestion de tratamientos clinicos (RF-08, RN-08)
// Asignado a: Esteban Fierro
const Tratamiento = require('../models/Tratamiento');
const Diagnostico = require('../models/Diagnostico');

exports.create = async (req, res, next) => {
  try {
    const { diagnostico_id, descripcion, duracion = 'Segun evolucion', fecha_inicio, fecha_fin = null } = req.body;

    if (!diagnostico_id || !descripcion) {
      return res.status(400).json({
        error: 'RN-14: Los campos diagnostico_id y descripcion son obligatorios'
      });
    }

    // RN-08: Relacion tratamiento - diagnostico: Todo tratamiento registrado debe estar asociado a un diagnostico existente
    const diagnostico = await Diagnostico.findById(diagnostico_id);
    if (!diagnostico) {
      return res.status(400).json({
        error: 'RN-08: Todo tratamiento registrado debe estar asociado a un diagnostico existente'
      });
    }

    const nuevoTrat = await Tratamiento.create({
      diagnostico_id,
      descripcion,
      duracion,
      fecha_inicio: fecha_inicio || new Date().toISOString().slice(0, 10),
      fecha_fin
    });

    return res.status(201).json({
      mensaje: 'Tratamiento registrado exitosamente (RF-08)',
      tratamiento: nuevoTrat
    });
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const list = await Tratamiento.findAll();
    return res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const trat = await Tratamiento.findById(req.params.id);
    if (!trat) {
      return res.status(404).json({ error: 'Tratamiento no encontrado' });
    }
    return res.status(200).json(trat);
  } catch (err) {
    next(err);
  }
};

exports.getByDiagnostico = async (req, res, next) => {
  try {
    const list = await Tratamiento.findByDiagnosticoId(req.params.diagnosticoId);
    return res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const updated = await Tratamiento.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Tratamiento no encontrado' });
    }
    return res.status(200).json({
      mensaje: 'Tratamiento actualizado exitosamente',
      tratamiento: updated
    });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const ok = await Tratamiento.delete(req.params.id);
    if (!ok) {
      return res.status(404).json({ error: 'Tratamiento no encontrado' });
    }
    return res.status(200).json({
      mensaje: 'Tratamiento eliminado exitosamente',
      id: parseInt(req.params.id, 10)
    });
  } catch (err) {
    next(err);
  }
};
