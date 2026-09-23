// src/controllers/medicamentosController.js
// Controlador para la formulacion y gestion de medicamentos (RF-09, RN-09)
// Asignado a: Santiago Avila
const Medicamento = require('../models/Medicamento');
const Consulta = require('../models/Consulta');

exports.create = async (req, res, next) => {
  try {
    const {
      consulta_id,
      nombre,
      dosis = 'Segun peso',
      frecuencia = 'Cada 12 horas',
      duracion = '7 dias',
      indicaciones = 'Via oral'
    } = req.body;

    if (!consulta_id || !nombre) {
      return res.status(400).json({
        error: 'RN-14: Los campos consulta_id y nombre del medicamento son obligatorios'
      });
    }

    // RN-09: Registro de medicamentos controlado (Los medicamentos solo pueden registrarse dentro de una consulta veterinaria)
    const consulta = await Consulta.findById(consulta_id);
    if (!consulta) {
      return res.status(400).json({
        error: 'RN-09: Los medicamentos solo pueden registrarse dentro de una consulta veterinaria valida'
      });
    }

    const nuevoMedicamento = await Medicamento.create({
      consulta_id,
      nombre,
      dosis,
      frecuencia,
      duracion,
      indicaciones
    });

    return res.status(201).json({
      mensaje: 'Medicamento registrado y formulado exitosamente (RF-09)',
      medicamento: nuevoMedicamento
    });
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const list = await Medicamento.findAll();
    return res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const med = await Medicamento.findById(req.params.id);
    if (!med) {
      return res.status(404).json({ error: 'Medicamento no encontrado' });
    }
    return res.status(200).json(med);
  } catch (err) {
    next(err);
  }
};

exports.getByConsulta = async (req, res, next) => {
  try {
    const list = await Medicamento.findByConsultaId(req.params.consultaId);
    return res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const updated = await Medicamento.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Medicamento no encontrado' });
    }
    return res.status(200).json({
      mensaje: 'Medicamento actualizado exitosamente',
      medicamento: updated
    });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const ok = await Medicamento.delete(req.params.id);
    if (!ok) {
      return res.status(404).json({ error: 'Medicamento no encontrado' });
    }
    return res.status(200).json({
      mensaje: 'Medicamento eliminado exitosamente',
      id: parseInt(req.params.id, 10)
    });
  } catch (err) {
    next(err);
  }
};
