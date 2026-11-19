// src/controllers/mascotasController.js
// Controlador para la gestión y CRUD de Mascotas
const Mascota = require('../models/Mascota');
const Propietario = require('../models/Propietario');

exports.getAll = async (req, res, next) => {
  try {
    const { search, especie, propietario_id } = req.query;
    const mascotas = await Mascota.findAll({ search, especie, propietario_id });
    return res.status(200).json(mascotas);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const mascota = await Mascota.findById(id);

    if (!mascota) {
      return res.status(404).json({ error: 'Mascota no encontrada' });
    }

    return res.status(200).json(mascota);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const {
      nombre,
      especie,
      raza = 'Criollo / Mestizo',
      edad,
      sexo = 'Macho',
      peso_kg = 0,
      propietario_id,
      codigo_chip
    } = req.body;

    if (!nombre || !especie) {
      return res.status(400).json({
        error: 'Los campos nombre y especie son obligatorios'
      });
    }

    // Propietario por defecto al Cliente 1 o Cliente 2 si no viene especificado
    const propId = propietario_id ? Number(propietario_id) : 1;

    const nuevaMascota = await Mascota.create({
      codigo_chip,
      nombre: nombre.trim(),
      especie: especie.trim(),
      raza: (raza || 'Criollo / Mestizo').trim(),
      edad: Number(edad) || 0,
      sexo,
      peso_kg: Number(peso_kg) || 0,
      propietario_id: propId
    });

    return res.status(201).json({
      mensaje: 'Mascota registrada exitosamente',
      mascota: nuevaMascota
    });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const actualizada = await Mascota.update(id, req.body);

    if (!actualizada) {
      return res.status(404).json({ error: 'Mascota no encontrada o no pudo actualizarse' });
    }

    return res.status(200).json({
      mensaje: 'Mascota actualizada exitosamente',
      mascota: actualizada
    });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const eliminada = await Mascota.delete(id);

    if (!eliminada) {
      return res.status(404).json({ error: 'Mascota no encontrada' });
    }

    return res.status(200).json({
      mensaje: 'Mascota eliminada exitosamente del sistema',
      mascota_id: id
    });
  } catch (err) {
    next(err);
  }
};
