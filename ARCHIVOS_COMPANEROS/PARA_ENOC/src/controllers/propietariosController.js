// src/controllers/propietariosController.js
// Controlador para el registro y administracion de propietarios de mascotas (RF-03, CU-02, RN-02)
// Asignado a: Enoc Tamayo
const Propietario = require('../models/Propietario');
const Mascota = require('../models/Mascota');

exports.create = async (req, res, next) => {
  try {
    const { identificacion, nombre, telefono, direccion = '', email = '' } = req.body;

    if (!identificacion || !nombre || !telefono) {
      return res.status(400).json({
        error: 'Los campos identificacion, nombre y telefono son obligatorios'
      });
    }

    const existe = await Propietario.findByIdentificacion(identificacion);
    if (existe) {
      return res.status(400).json({
        error: 'RN-02: No se permite registrar dos propietarios con el mismo numero de identificacion'
      });
    }

    const nuevoPropietario = await Propietario.create({
      identificacion,
      nombre,
      telefono,
      direccion,
      email
    });

    return res.status(201).json({
      mensaje: 'Propietario registrado exitosamente',
      propietario: nuevoPropietario
    });
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const { search } = req.query;
    const list = await Propietario.findAll({ search });
    return res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const propietario = await Propietario.findById(req.params.id);
    if (!propietario) {
      return res.status(404).json({ error: 'Propietario no encontrado' });
    }
    return res.status(200).json(propietario);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const updated = await Propietario.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Propietario no encontrado' });
    }
    return res.status(200).json({
      mensaje: 'Propietario actualizado exitosamente',
      propietario: updated
    });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const ok = await Propietario.delete(req.params.id);
    if (!ok) {
      return res.status(404).json({ error: 'Propietario no encontrado' });
    }
    return res.status(200).json({
      mensaje: 'Propietario inactivado correctamente (eliminacion logica)',
      id: parseInt(req.params.id, 10)
    });
  } catch (err) {
    next(err);
  }
};

exports.getMascotas = async (req, res, next) => {
  try {
    const mascotas = await Mascota.findByPropietarioId(req.params.id);
    return res.status(200).json(mascotas);
  } catch (err) {
    next(err);
  }
};
