// src/controllers/vacunasController.js
// Controlador para el registro de vacunas y carnet de vacunacion (RF-10, CU-06, RN-10, RN-15)
// Asignado a: Esteban Fierro
const Vacuna = require('../models/Vacuna');
const Mascota = require('../models/Mascota');

exports.create = async (req, res, next) => {
  try {
    const {
      mascota_id,
      tipo_vacuna,
      fecha_aplicacion,
      dosis = 'Dosis unica',
      proxima_dosis = null,
      veterinario_id = 1,
      observaciones = ''
    } = req.body;

    // RN-14: Validacion de datos obligatorios
    if (!mascota_id || !tipo_vacuna || !fecha_aplicacion) {
      return res.status(400).json({
        error: 'RN-14: Los campos mascota_id, tipo_vacuna y fecha_aplicacion son obligatorios'
      });
    }

    // RN-10: Registro de vacunas valido (mascota existe y esta activa)
    const mascota = await Mascota.findById(mascota_id);
    if (!mascota || mascota.activo === false) {
      return res.status(404).json({
        error: 'RN-10: Las vacunas solo pueden registrarse si la mascota existe en el sistema'
      });
    }

    // RN-15: Coherencia de fechas
    const fechaVacuna = new Date(fecha_aplicacion);
    if (isNaN(fechaVacuna.getTime())) {
      return res.status(400).json({
        error: 'RN-15: La fecha de aplicacion de la vacuna no es valida'
      });
    }

    const nuevaVacuna = await Vacuna.create({
      mascota_id: mascota.id,
      tipo_vacuna,
      fecha_aplicacion,
      dosis,
      proxima_dosis,
      veterinario_id,
      observaciones
    });

    return res.status(201).json({
      mensaje: 'Vacuna registrada exitosamente en el carnet de la mascota',
      vacuna: nuevaVacuna
    });
  } catch (err) {
    next(err);
  }
};

exports.getByMascota = async (req, res, next) => {
  try {
    const list = await Vacuna.findByMascotaId(req.params.mascotaId);
    return res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const list = await Vacuna.findAll();
    return res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const vacuna = await Vacuna.findById(req.params.id);
    if (!vacuna) {
      return res.status(404).json({ error: 'Vacuna no encontrada' });
    }
    return res.status(200).json(vacuna);
  } catch (err) {
    next(err);
  }
};
