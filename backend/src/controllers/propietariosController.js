// src/controllers/propietariosController.js
// Controlador para obtener clientes / propietarios
const Propietario = require('../models/Propietario');

exports.getAll = async (req, res, next) => {
  try {
    const propietarios = await Propietario.findAll();
    return res.status(200).json(propietarios);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const propietario = await Propietario.findById(id);

    if (!propietario) {
      return res.status(404).json({ error: 'Propietario no encontrado' });
    }

    return res.status(200).json(propietario);
  } catch (err) {
    next(err);
  }
};
