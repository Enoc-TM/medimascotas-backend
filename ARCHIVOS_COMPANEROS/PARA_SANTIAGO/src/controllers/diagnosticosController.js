// src/controllers/diagnosticosController.js
// Controlador para la gestion de diagnosticos medicos veterinarios (RF-07, RN-07, RN-13)
// Asignado a: Santiago Avila
const Diagnostico = require('../models/Diagnostico');
const Consulta = require('../models/Consulta');

exports.create = async (req, res, next) => {
  try {
    const { consulta_id, descripcion, gravedad = 'leve', fecha } = req.body;

    if (!consulta_id || !descripcion) {
      return res.status(400).json({
        error: 'RN-14: Los campos consulta_id y descripcion son obligatorios'
      });
    }

    const consulta = await Consulta.findById(consulta_id);
    if (!consulta) {
      return res.status(404).json({
        error: 'No se puede registrar un diagnostico para una consulta inexistente'
      });
    }

    const fechaFinal = fecha || consulta.fecha || new Date().toISOString().slice(0, 10);
    const nuevoDiag = await Diagnostico.create({
      consulta_id,
      descripcion,
      gravedad,
      fecha: fechaFinal
    });

    // Sincronizar en la consulta en memoria si aplica
    if (consulta.diagnosticos && Array.isArray(consulta.diagnosticos)) {
      consulta.diagnosticos.push(nuevoDiag);
    }

    return res.status(201).json({
      mensaje: 'Diagnostico clinico registrado exitosamente (RF-07)',
      diagnostico: nuevoDiag
    });
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const list = await Diagnostico.findAll();
    return res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const diag = await Diagnostico.findById(req.params.id);
    if (!diag) {
      return res.status(404).json({ error: 'Diagnostico no encontrado' });
    }
    return res.status(200).json(diag);
  } catch (err) {
    next(err);
  }
};

exports.getByConsulta = async (req, res, next) => {
  try {
    const list = await Diagnostico.findByConsultaId(req.params.consultaId);
    return res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const updated = await Diagnostico.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Diagnostico no encontrado' });
    }
    return res.status(200).json({
      mensaje: 'Diagnostico actualizado exitosamente',
      diagnostico: updated
    });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const ok = await Diagnostico.delete(req.params.id);
    if (!ok) {
      return res.status(404).json({ error: 'Diagnostico no encontrado' });
    }
    return res.status(200).json({
      mensaje: 'Diagnostico eliminado exitosamente',
      id: parseInt(req.params.id, 10)
    });
  } catch (err) {
    next(err);
  }
};
